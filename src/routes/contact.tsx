import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Get in touch with the ClimateLens team about data, partnerships or press."),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thanks! We'll be in touch soon.");
    }, 600);
  };
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-8">
      <PageHeader eyebrow="Contact" title="Say hello" intro="Questions about the data, press enquiries or ideas for collaboration." />
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
        <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" required maxLength={100} /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required maxLength={255} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="msg">Message</Label><Textarea id="msg" rows={6} required maxLength={2000} /></div>
          <Button type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"}</Button>
        </form>
        <div className="space-y-3">
          <h2 className="font-semibold">Find us</h2>
          {[
            { icon: Mail, label: "hello@climatelens.org", href: "mailto:hello@climatelens.org" },
            { icon: Twitter, label: "Twitter / X", href: "https://x.com" },
            { icon: Github, label: "GitHub", href: "https://github.com" },
            { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
          ].map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm transition-colors hover:border-primary">
              <s.icon className="size-5 text-primary" aria-hidden /> {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
