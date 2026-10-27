import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard, axisProps, tooltipStyle } from "@/components/ChartCard";
import { PageHeader } from "@/components/SiteHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COUNTRIES, countrySeries, getTemperature } from "@/data/climate";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/compare")({
  head: () => seo("Compare Countries & Eras", "Compare climate data for two countries or two time periods side by side."),
  component: Compare,
});

const METRICS = { emissions: "Emissions (Gt CO₂)", perCapita: "Per capita (t CO₂)", temp: "Temperature change (°C)" } as const;
type Metric = keyof typeof METRICS;

function Pick({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function Stat({ label, a, b, unit }: { label: string; a: number; b: number; unit: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 flex justify-between gap-2 font-semibold tabular-nums">
        <span className="text-chart-1">{a}{unit}</span>
        <span className="text-chart-2">{b}{unit}</span>
      </div>
    </div>
  );
}

function Compare() {
  const [a, setA] = useState("840");
  const [b, setB] = useState("156");
  const [metric, setMetric] = useState<Metric>("emissions");
  const ca = COUNTRIES.find((c) => c.id === a)!;
  const cb = COUNTRIES.find((c) => c.id === b)!;
  const data = useMemo(() => {
    const sa = countrySeries(ca), sb = countrySeries(cb);
    return sa.map((p, i) => ({ year: p.year, [ca.name]: p[metric], [cb.name]: sb[i]![metric] }));
  }, [ca, cb, metric]);
  const la = countrySeries(ca).at(-1)!, lb = countrySeries(cb).at(-1)!;

  const [p1, setP1] = useState("1900");
  const [p2, setP2] = useState("1990");
  const temp = getTemperature();
  const periods = ["1880", "1900", "1930", "1960", "1990"];
  const eraData = useMemo(() => {
    const s1 = temp.filter((t) => t.year >= +p1 && t.year < +p1 + 30);
    const s2 = temp.filter((t) => t.year >= +p2 && t.year < +p2 + 35);
    return Array.from({ length: Math.max(s1.length, s2.length) }, (_, i) => ({
      yearOffset: i,
      [`${p1}–${+p1 + 29}`]: s1[i]?.value,
      [`${p2}–${Math.min(+p2 + 34, 2024)}`]: s2[i]?.value,
    }));
  }, [p1, p2]);
  const avg = (s: number[]) => Math.round((s.reduce((x, y) => x + y, 0) / s.length) * 100) / 100;
  const keys = Object.keys(eraData[0] ?? {}).filter((k) => k !== "yearOffset");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <PageHeader eyebrow="Compare" title="Side by side" intro="Pick two countries, or two eras of global temperature." />
      <Tabs defaultValue="countries">
        <TabsList className="mb-6">
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="periods">Time periods</TabsTrigger>
        </TabsList>
        <TabsContent value="countries" className="space-y-6">
          <div className="grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-3">
            <Pick value={a} onChange={setA} label="First country" />
            <Pick value={b} onChange={setB} label="Second country" />
            <Select value={metric} onValueChange={(v) => setMetric(v as Metric)}>
              <SelectTrigger aria-label="Metric"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(METRICS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Stat label="Emissions 2022 (Gt)" a={la.emissions} b={lb.emissions} unit="" />
            <Stat label="Per capita 2022 (t)" a={la.perCapita} b={lb.perCapita} unit="" />
            <Stat label="Warming 2022" a={la.temp} b={lb.temp} unit="°C" />
          </div>
          <ChartCard title={`${ca.name} vs ${cb.name}`} description={METRICS[metric]} data={data} fileName={`compare-${ca.name}-${cb.name}-${metric}`}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" {...axisProps} />
                <YAxis {...axisProps} width={40} />
                <Tooltip {...tooltipStyle} />
                <Legend />
                <Line dataKey={ca.name} stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                <Line dataKey={cb.name} stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
        <TabsContent value="periods" className="space-y-6">
          <div className="grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-2">
            {[[p1, setP1, "First period"], [p2, setP2, "Second period"]].map(([v, set, l]) => (
              <Select key={l as string} value={v as string} onValueChange={set as (v: string) => void}>
                <SelectTrigger aria-label={l as string}><SelectValue /></SelectTrigger>
                <SelectContent>{periods.map((p) => <SelectItem key={p} value={p}>Starting {p}</SelectItem>)}</SelectContent>
              </Select>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {keys.map((k, i) => (
              <div key={k} className="rounded-xl border bg-card p-4">
                <p className="text-xs text-muted-foreground">{k} average anomaly</p>
                <p className={`mt-1 text-2xl font-bold ${i ? "text-chart-2" : "text-chart-1"}`}>
                  {avg(eraData.map((d) => d[k] as number).filter((x) => x !== undefined))}°C
                </p>
              </div>
            ))}
          </div>
          <ChartCard title="Global temperature: era vs era" description="Anomaly (°C) by years since start of period." data={eraData} fileName="compare-periods">
            <ResponsiveContainer>
              <LineChart data={eraData}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="yearOffset" {...axisProps} />
                <YAxis {...axisProps} width={40} />
                <Tooltip {...tooltipStyle} labelFormatter={(l) => `Year +${l}`} />
                <Legend />
                {keys.map((k, i) => <Line key={k} dataKey={k} stroke={i ? "var(--chart-2)" : "var(--chart-1)"} strokeWidth={2.5} dot={false} />)}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
