import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/SiteHeader";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/sources")({
  head: () => seo("Data Sources & Methodology", "Where our climate data comes from — NASA, NOAA, Our World in Data and IPCC — and how it is processed."),
  component: Sources,
});

const SOURCES = [
  { name: "NASA GISS Surface Temperature (GISTEMP v4)", url: "https://data.giss.nasa.gov/gistemp/", d: "Global and regional temperature anomalies since 1880, relative to the 1951–1980 base period." },
  { name: "NOAA Global Monitoring Laboratory — Mauna Loa CO₂", url: "https://gml.noaa.gov/ccgg/trends/", d: "Continuous atmospheric CO₂ measurements since 1958 (Keeling Curve)." },
  { name: "NASA Sea Level Change", url: "https://sealevel.nasa.gov/", d: "Satellite altimetry since 1993, combined with historic tide gauge reconstructions." },
  { name: "NSIDC Sea Ice Index", url: "https://nsidc.org/data/seaice_index", d: "Monthly Arctic sea ice extent from passive microwave satellites since 1979." },
  { name: "Our World in Data — CO₂ and Greenhouse Gas Emissions", url: "https://ourworldindata.org/co2-and-greenhouse-gas-emissions", d: "Country and sector emissions from the Global Carbon Project and Climate Watch." },
  { name: "IPCC Sixth Assessment Report (AR6)", url: "https://www.ipcc.ch/assessment-report/ar6/", d: "Scientific consensus, attribution and future scenarios used for context and methodology." },
];

function Sources() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-8">
      <PageHeader eyebrow="Data" title="Sources & methodology" intro="We rely on open, peer-reviewed datasets from leading scientific institutions." />
      <ul className="space-y-4">
        {SOURCES.map((s) => (
          <li key={s.url} className="rounded-2xl border bg-card p-5">
            <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              {s.name} <ExternalLink className="size-4" aria-hidden /><span className="sr-only">(opens in new tab)</span>
            </a>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </li>
        ))}
      </ul>
      <section className="mt-14 space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-bold text-foreground">Methodology</h2>
        <p><strong className="text-foreground">Anomalies, not absolutes.</strong> Temperatures are shown as the difference from a 30-year baseline (1951–1980). This makes trends comparable across regions with very different climates.</p>
        <p><strong className="text-foreground">Annual values.</strong> Monthly series are averaged to calendar years. Arctic ice uses the September minimum, the most sensitive indicator of decline.</p>
        <p><strong className="text-foreground">Sample data.</strong> Values shown today are realistic approximations of the sources above, built to demonstrate the platform. Each dataset is isolated so it can be replaced with live CSV files or API feeds.</p>
        <p><strong className="text-foreground">Emissions</strong> are territorial fossil CO₂ (and land-use for sectors), in billions of tonnes. Per-capita values divide by mid-year population.</p>
      </section>
    </div>
  );
}
