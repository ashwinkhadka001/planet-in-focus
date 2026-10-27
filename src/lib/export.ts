export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export function toCSV(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

export function downloadCSV(rows: Record<string, unknown>[], filename: string) {
  downloadBlob(new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8" }), filename);
}

export async function downloadPNG(node: HTMLElement, filename: string) {
  const { toPng } = await import("html-to-image");
  const bg = getComputedStyle(document.body).backgroundColor;
  const url = await toPng(node, { backgroundColor: bg, pixelRatio: 2 });
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}
