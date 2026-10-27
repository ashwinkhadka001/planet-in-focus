import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BarChart3, GitCompare, Globe2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-earth.jpg";
import { KEY_STATS, getTemperature } from "@/data/climate";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "See the Planet Change",
      "Interactive climate data: global temperature rise, CO₂ concentration, sea level and emissions, made easy to explore.",
    ),
  component: Index,
});

function Counter({ value, decimals, unit }: { value: number; decimals: number; unit: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setN(value * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span ref={ref} aria-label={`${value}${unit}`}>
      {decimals ? "+" : "+"}
      {n.toFixed(decimals)}
      {unit}
    </span>
  );
}

const temp = getTemperature();

function Index() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={hero}
          alt="Earth seen from space with glowing city lights and a thin blue atmosphere"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-right"
        />
        <div className="absolute inset-0 -z-10 bg-hero-fade" />
        <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8 md:pb-32 md:pt-40">
          <p className="animate-rise text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Climate Change Data Visualization Platform
          </p>
          <h1 className="animate-rise mt-4 max-w-3xl text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
            See the Planet <span className="text-warm-gradient">Change</span>
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            145 years of temperature, carbon and ice — turned into charts and maps anyone can explore.
          </p>
          <div className="animate-rise mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link to="/dashboard">
                Explore the Data <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 bg-transparent px-6 text-base">
              <Link to="/map">Open the map</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-label="Key climate indicators" className="mx-auto -mt-10 max-w-7xl px-4 md:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {KEY_STATS.map((s, i) => (
            <div key={s.label} className="animate-rise rounded-2xl border bg-card p-6 shadow-card" style={{ animationDelay: `${i * 120}ms` }}>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-warm-gradient md:text-5xl">
                <Counter value={s.value} decimals={s.decimals} unit={s.unit} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">The trend is unmistakable</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every year since 1977 has been warmer than the 20th-century average. The last ten years are the warmest on record.
            </p>
          </div>
          <div className="h-56 rounded-2xl border bg-card p-4" role="img" aria-label="Area chart of global temperature anomaly rising from about -0.2°C in 1880 to +1.28°C in 2024">
            <ResponsiveContainer>
              <AreaChart data={temp}>
                <defs>
                  <linearGradient id="heroTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--hot)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--hot)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area dataKey="value" stroke="var(--hot)" strokeWidth={2} fill="url(#heroTemp)" animationDuration={1800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-28 grid max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-8">
        {[
          { to: "/dashboard" as const, icon: BarChart3, t: "Dashboard", d: "Temperature, CO₂, sea level, ice and emissions with filters." },
          { to: "/map" as const, icon: Globe2, t: "World map", d: "Warming and emissions by country, year by year." },
          { to: "/compare" as const, icon: GitCompare, t: "Compare", d: "Put two countries or two eras side by side." },
        ].map((c) => (
          <Link key={c.to} to={c.to} className="group rounded-2xl border bg-card p-6 transition-colors hover:border-primary">
            <c.icon className="size-6 text-primary" aria-hidden />
            <h3 className="mt-4 text-lg font-semibold">{c.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
              Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
