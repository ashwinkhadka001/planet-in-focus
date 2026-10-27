import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, Brush, CartesianGrid, Line, LineChart,
  ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ChartCard, axisProps, tooltipStyle } from "@/components/ChartCard";
import { PageHeader } from "@/components/SiteHeader";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  COUNTRIES, REGIONS, type Region, countryEmissions, getArcticIce, getCO2,
  getSeaLevel, getTemperature, sectorEmissions,
} from "@/data/climate";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard")({
  head: () => seo("Climate Dashboard", "Interactive charts of temperature anomaly, CO₂, emissions, sea level and Arctic sea ice with year and region filters."),
  component: Dashboard,
});

const DATASETS = ["All datasets", "Temperature", "CO₂", "Emissions", "Sea level", "Arctic ice"] as const;
type Dataset = (typeof DATASETS)[number];

function Dashboard() {
  const [years, setYears] = useState<[number, number]>([1950, 2024]);
  const [region, setRegion] = useState<Region>("Global");
  const [dataset, setDataset] = useState<Dataset>("All datasets");
  const [breakdown, setBreakdown] = useState<"country" | "sector">("country");

  const inRange = <T extends { year: number }>(d: T[]) => d.filter((p) => p.year >= years[0] && p.year <= years[1]);
  const temp = useMemo(() => inRange(getTemperature(region)), [years, region]);
  const co2 = useMemo(() => inRange(getCO2()), [years]);
  const sea = useMemo(() => inRange(getSeaLevel()), [years]);
  const ice = useMemo(() => inRange(getArcticIce()), [years]);
  const barYear = Math.min(years[1], 2022);
  const bars = useMemo(
    () =>
      breakdown === "country"
        ? COUNTRIES.map((c) => ({ name: c.name, value: countryEmissions(c, barYear) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 12)
        : sectorEmissions(barYear),
    [breakdown, barYear],
  );
  const show = (d: Dataset) => dataset === "All datasets" || dataset === d;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <PageHeader eyebrow="Dashboard" title="Climate indicators" intro="Filter by years, region and dataset. Drag the handles under each chart to zoom." />

      <div className="mb-8 grid gap-6 rounded-2xl border bg-card p-5 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium" id="yr">Years: {years[0]} – {years[1]}</label>
          <Slider aria-labelledby="yr" className="mt-4" min={1880} max={2024} step={1} value={years} onValueChange={(v) => setYears([v[0], v[1]] as [number, number])} />
        </div>
        <div>
          <label className="text-sm font-medium">Region (temperature)</label>
          <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
            <SelectTrigger className="mt-2" aria-label="Region"><SelectValue /></SelectTrigger>
            <SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Dataset</label>
          <Select value={dataset} onValueChange={(v) => setDataset(v as Dataset)}>
            <SelectTrigger className="mt-2" aria-label="Dataset"><SelectValue /></SelectTrigger>
            <SelectContent>{DATASETS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {show("Temperature") && (
          <ChartCard className="lg:col-span-2" title={`Temperature anomaly — ${region}`} description="°C relative to the 1951–1980 average (NASA GISTEMP-style)." data={temp} fileName="temperature-anomaly">
            <ResponsiveContainer>
              <LineChart data={temp}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} unit="°" width={40} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} °C`, "Anomaly"]} />
                <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
                <Line dataKey="value" stroke="var(--hot)" strokeWidth={2.5} dot={false} animationDuration={1200} />
                <Brush dataKey="year" height={22} stroke="var(--primary)" fill="var(--card)" travellerWidth={8} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
        {show("CO₂") && (
          <ChartCard title="Atmospheric CO₂" description="Parts per million, Mauna Loa record (NOAA)." data={co2} fileName="co2-ppm">
            <ResponsiveContainer>
              <AreaChart data={co2}>
                <defs>
                  <linearGradient id="co2g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--warm)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--warm)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} domain={["dataMin - 5", "dataMax + 5"]} width={40} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} ppm`, "CO₂"]} />
                <Area dataKey="value" stroke="var(--warm)" strokeWidth={2} fill="url(#co2g)" animationDuration={1200} />
                <Brush dataKey="year" height={22} stroke="var(--primary)" fill="var(--card)" travellerWidth={8} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
        {show("Emissions") && (
          <section className="contents">
            <ChartCard
              title={`CO₂ emissions by ${breakdown} — ${barYear}`}
              description="Billion tonnes CO₂ (Our World in Data / Global Carbon Project)."
              data={bars}
              fileName={`emissions-by-${breakdown}-${barYear}`}
            >
              <div className="flex h-full flex-col">
                <ToggleGroup type="single" size="sm" value={breakdown} onValueChange={(v) => v && setBreakdown(v as "country" | "sector")} className="mb-2 self-start" aria-label="Breakdown">
                  <ToggleGroupItem value="country">Country</ToggleGroupItem>
                  <ToggleGroupItem value="sector">Sector</ToggleGroupItem>
                </ToggleGroup>
                <div className="min-h-0 flex-1">
                  <ResponsiveContainer>
                    <BarChart data={bars} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" {...axisProps} />
                      <YAxis type="category" dataKey="name" {...axisProps} width={110} interval={0} fontSize={11} />
                      <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v: number) => [`${v} Gt`, "Emissions"]} />
                      <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 6, 6, 0]} animationDuration={1000} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartCard>
          </section>
        )}
        {show("Sea level") && (
          <ChartCard title="Global mean sea level" description="Millimetres relative to 1993 (CSIRO tide gauge + NASA satellite)." data={sea} fileName="sea-level">
            <ResponsiveContainer>
              <AreaChart data={sea}>
                <defs>
                  <linearGradient id="seag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--cool)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--cool)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} width={40} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} mm`, "Sea level"]} />
                <Area dataKey="value" stroke="var(--cool)" strokeWidth={2} fill="url(#seag)" animationDuration={1200} />
                <Brush dataKey="year" height={22} stroke="var(--primary)" fill="var(--card)" travellerWidth={8} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
        {show("Arctic ice") && (
          <ChartCard title="Arctic sea ice extent (September)" description="Million km², annual minimum (NSIDC)." data={ice} fileName="arctic-ice">
            <ResponsiveContainer>
              <LineChart data={ice}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} domain={[0, 8]} width={30} />
                <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v} M km²`, "Extent"]} />
                <Line dataKey="value" stroke="var(--primary)" strokeWidth={2.5} dot={false} animationDuration={1200} />
                <Brush dataKey="year" height={22} stroke="var(--primary)" fill="var(--card)" travellerWidth={8} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
}
