import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { FeatureCollection, Geometry } from "geojson";
import world from "world-atlas/countries-110m.json";
import { PageHeader } from "@/components/SiteHeader";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { COUNTRIES, countryEmissions, countryTemp } from "@/data/climate";
import { downloadCSV } from "@/lib/export";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/map")({
  head: () => seo("World Climate Map", "Interactive world map of temperature change and CO₂ emissions by country, with a year slider."),
  component: MapPage,
});

const W = 960, H = 500;
const topo = world as unknown as Topology<{ countries: GeometryCollection<{ name: string }> }>;
const geo = feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, { name: string }>;
const projection = geoNaturalEarth1().fitSize([W, H], geo);
const pathGen = geoPath(projection);
const byId = new Map(COUNTRIES.map((c) => [c.id, c]));

function colorFor(t: number) {
  // 0 → cool, 1 → hot via color-mix of design tokens
  const pct = Math.round(Math.max(0, Math.min(1, t)) * 100);
  return pct < 50
    ? `color-mix(in oklch, var(--warm) ${pct * 2}%, var(--cool))`
    : `color-mix(in oklch, var(--hot) ${(pct - 50) * 2}%, var(--warm))`;
}

function MapPage() {
  const [year, setYear] = useState(2022);
  const [metric, setMetric] = useState<"temp" | "emissions">("temp");
  const [hover, setHover] = useState<{ name: string; value?: number; x: number; y: number } | null>(null);

  const values = useMemo(() => {
    const m = new Map<string, number>();
    COUNTRIES.forEach((c) => m.set(c.id, metric === "temp" ? countryTemp(c, year) : countryEmissions(c, year)));
    return m;
  }, [year, metric]);
  const scale = (v: number) => (metric === "temp" ? v / 3 : Math.sqrt(v / 12));
  const unit = metric === "temp" ? "°C" : " Gt CO₂";

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <PageHeader eyebrow="Map view" title="Where the world is changing" intro="Hover or tab through countries to see values. Drag the slider to travel through time." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5">
        <ToggleGroup type="single" value={metric} onValueChange={(v) => v && setMetric(v as "temp" | "emissions")} aria-label="Metric">
          <ToggleGroupItem value="temp">Temperature change</ToggleGroupItem>
          <ToggleGroupItem value="emissions">CO₂ emissions</ToggleGroupItem>
        </ToggleGroup>
        <div className="flex min-w-64 flex-1 items-center gap-4 md:max-w-md">
          <span id="yl" className="text-2xl font-bold tabular-nums">{year}</span>
          <Slider aria-labelledby="yl" min={1960} max={2022} step={1} value={[year]} onValueChange={(v) => setYear(v[0])} />
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadCSV(COUNTRIES.map((c) => ({ country: c.name, year, [metric]: values.get(c.id) })), `map-${metric}-${year}.csv`)}>
          <Download /> CSV
        </Button>
      </div>

      <div className="animate-rise relative overflow-hidden rounded-2xl border bg-card p-2" onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`World map of ${metric === "temp" ? "temperature change" : "CO2 emissions"} in ${year}`}>
          {geo.features.map((f, i) => {
            const id = String(f.id);
            const v = values.get(id);
            const c = byId.get(id);
            const d = pathGen(f) ?? "";
            const show = (e: { clientX: number; clientY: number }) => {
              const box = (e as unknown as { currentTarget: Element }).currentTarget.closest("div")!.getBoundingClientRect();
              setHover({ name: c?.name ?? f.properties.name, value: v, x: e.clientX - box.left, y: e.clientY - box.top });
            };
            return (
              <path
                key={i}
                d={d}
                tabIndex={c ? 0 : -1}
                aria-label={c ? `${c.name}: ${v}${unit}` : undefined}
                className={`stroke-background transition-[fill] duration-500 outline-none hover:opacity-80 focus:stroke-foreground ${v === undefined ? "fill-map-empty" : ""}`}
                strokeWidth={0.5}
                style={v !== undefined ? { fill: colorFor(scale(v)) } : undefined}
                onMouseMove={show}
                onFocus={(e) => {
                  const r = (e.target as SVGPathElement).getBoundingClientRect();
                  const box = (e.target as Element).closest("div")!.getBoundingClientRect();
                  setHover({ name: c!.name, value: v, x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 });
                }}
                onBlur={() => setHover(null)}
              />
            );
          })}
        </svg>
        {hover && (
          <div className="pointer-events-none absolute z-10 rounded-lg border bg-popover px-3 py-2 text-sm shadow-card" style={{ left: hover.x + 12, top: hover.y + 12 }}>
            <p className="font-semibold">{hover.name}</p>
            <p className="text-muted-foreground">{hover.value !== undefined ? `${hover.value}${unit}` : "No sample data"}</p>
          </div>
        )}
        <div className="flex items-center gap-3 px-3 pb-2 text-xs text-muted-foreground">
          <span>{metric === "temp" ? "0°C" : "0 Gt"}</span>
          <div className="h-2 w-40 rounded-full" style={{ background: "linear-gradient(90deg, var(--cool), var(--warm), var(--hot))" }} aria-hidden />
          <span>{metric === "temp" ? "3°C+" : "12 Gt"}</span>
        </div>
      </div>
    </div>
  );
}
