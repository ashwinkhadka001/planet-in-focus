import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/SiteHeader";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("About Us", "Our mission: make climate data clear and accessible for students, researchers, journalists and everyone."),
  component: About,
});

const TEAM = [
  { name: "Maya Okafor", role: "Climate scientist", initials: "MO" },
  { name: "Daniel Reyes", role: "Data visualization lead", initials: "DR" },
  { name: "Priya Nair", role: "Data engineer", initials: "PN" },
  { name: "Lukas Berg", role: "Science journalist", initials: "LB" },
];

function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <PageHeader eyebrow="About" title="Climate data, made clear" intro="ClimateLens turns complex scientific datasets into honest, beautiful visuals — so anyone can see the evidence for themselves." />
      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Accurate", "Built on peer-reviewed datasets with transparent methods."],
          ["Accessible", "Readable for students and the public, deep enough for researchers."],
          ["Open", "Every chart's data can be downloaded and reused."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold text-primary">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-20 text-2xl font-bold">Team</h2>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((m) => (
          <li key={m.name} className="rounded-2xl border bg-card p-6 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-warm-gradient text-lg font-bold text-primary-foreground" aria-hidden>{m.initials}</div>
            <p className="mt-4 font-semibold">{m.name}</p>
            <p className="text-sm text-muted-foreground">{m.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
