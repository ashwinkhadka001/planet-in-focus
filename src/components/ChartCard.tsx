import { useRef, type ReactNode } from "react";
import { Download, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCSV, downloadPNG } from "@/lib/export";

type Props = {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  fileName: string;
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, description, data, fileName, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <section
      aria-label={title}
      className={`animate-rise rounded-2xl border bg-card p-5 shadow-card md:p-6 ${className}`}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => ref.current && downloadPNG(ref.current, `${fileName}.png`)}
            aria-label={`Download ${title} as image`}
          >
            <ImageDown /> PNG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadCSV(data, `${fileName}.csv`)}
            aria-label={`Download ${title} data as CSV`}
          >
            <Download /> CSV
          </Button>
        </div>
      </div>
      <div ref={ref} className="h-72 w-full md:h-80">
        {children}
      </div>
    </section>
  );
}

export const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--popover-foreground)",
    fontSize: 13,
  },
  labelStyle: { color: "var(--muted-foreground)" },
};
export const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
};
