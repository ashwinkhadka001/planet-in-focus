/**
 * Sample climate datasets approximating published values (NASA GISTEMP, NOAA/Scripps
 * Mauna Loa, CSIRO/NASA sea level, NSIDC sea ice, Global Carbon Project via OWID).
 * Replace any `get*` function with a CSV/API loader returning the same shapes.
 */

export type YearPoint = { year: number; value: number };

function interp(anchors: [number, number][], year: number) {
  for (let i = 0; i < anchors.length - 1; i++) {
    const [y0, v0] = anchors[i];
    const [y1, v1] = anchors[i + 1];
    if (year >= y0 && year <= y1) return v0 + ((v1 - v0) * (year - y0)) / (y1 - y0);
  }
  return year < anchors[0][0] ? anchors[0][1] : anchors[anchors.length - 1][1];
}
// deterministic "noise" so data looks natural and is stable across renders
const wobble = (year: number, amp: number) =>
  amp * (Math.sin(year * 1.7) * 0.6 + Math.sin(year * 0.53 + 1) * 0.4);
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const REGIONS = ["Global", "Northern Hemisphere", "Southern Hemisphere", "Arctic"] as const;
export type Region = (typeof REGIONS)[number];
const regionFactor: Record<Region, number> = {
  Global: 1,
  "Northern Hemisphere": 1.22,
  "Southern Hemisphere": 0.78,
  Arctic: 2.9,
};

const tempAnchors: [number, number][] = [
  [1880, -0.17], [1900, -0.2], [1910, -0.4], [1940, 0.12], [1950, -0.17], [1976, -0.1],
  [1990, 0.44], [2000, 0.4], [2010, 0.72], [2016, 1.01], [2020, 1.01], [2023, 1.17], [2024, 1.28],
];
export function getTemperature(region: Region = "Global"): YearPoint[] {
  return range(1880, 2024).map((year) => ({
    year,
    value: round((interp(tempAnchors, year) + wobble(year, 0.07)) * regionFactor[region]),
  }));
}

const co2Anchors: [number, number][] = [
  [1958, 315.2], [1970, 325.7], [1980, 338.8], [1990, 354.4], [2000, 369.7],
  [2010, 389.9], [2020, 414.2], [2024, 422.8],
];
export function getCO2(): YearPoint[] {
  return range(1958, 2024).map((year) => ({ year, value: round(interp(co2Anchors, year), 1) }));
}

const seaAnchors: [number, number][] = [
  [1900, -175], [1930, -140], [1960, -100], [1993, 0], [2010, 55], [2024, 108],
];
export function getSeaLevel(): YearPoint[] {
  return range(1900, 2024).map((year) => ({
    year,
    value: round(interp(seaAnchors, year) + wobble(year, 3), 0),
  }));
}

const iceAnchors: [number, number][] = [
  [1979, 7.05], [1990, 6.2], [1996, 7.2], [2002, 5.9], [2007, 4.27], [2012, 3.57],
  [2016, 4.53], [2020, 3.92], [2024, 4.28],
];
export function getArcticIce(): YearPoint[] {
  return range(1979, 2024).map((year) => ({
    year,
    value: round(interp(iceAnchors, year) + wobble(year, 0.15)),
  }));
}

type Profile = "rising" | "plateau" | "declining";
export type Country = {
  id: string; // ISO 3166-1 numeric (matches world-atlas topojson ids)
  name: string;
  emissions2022: number; // Gt CO2
  tempChange2022: number; // °C vs 1951–1980
  population: number; // millions
  profile: Profile;
};

export const COUNTRIES: Country[] = [
  { id: "156", name: "China", emissions2022: 11.4, tempChange2022: 1.6, population: 1412, profile: "rising" },
  { id: "840", name: "United States", emissions2022: 5.06, tempChange2022: 1.4, population: 333, profile: "plateau" },
  { id: "356", name: "India", emissions2022: 2.83, tempChange2022: 0.9, population: 1417, profile: "rising" },
  { id: "643", name: "Russia", emissions2022: 1.65, tempChange2022: 2.6, population: 144, profile: "plateau" },
  { id: "392", name: "Japan", emissions2022: 1.05, tempChange2022: 1.3, population: 125, profile: "plateau" },
  { id: "364", name: "Iran", emissions2022: 0.69, tempChange2022: 1.8, population: 89, profile: "rising" },
  { id: "276", name: "Germany", emissions2022: 0.67, tempChange2022: 2.1, population: 84, profile: "declining" },
  { id: "682", name: "Saudi Arabia", emissions2022: 0.69, tempChange2022: 1.9, population: 36, profile: "rising" },
  { id: "360", name: "Indonesia", emissions2022: 0.69, tempChange2022: 0.8, population: 276, profile: "rising" },
  { id: "410", name: "South Korea", emissions2022: 0.6, tempChange2022: 1.4, population: 52, profile: "rising" },
  { id: "124", name: "Canada", emissions2022: 0.55, tempChange2022: 2.3, population: 39, profile: "plateau" },
  { id: "076", name: "Brazil", emissions2022: 0.48, tempChange2022: 1.0, population: 215, profile: "rising" },
  { id: "484", name: "Mexico", emissions2022: 0.47, tempChange2022: 1.2, population: 128, profile: "rising" },
  { id: "710", name: "South Africa", emissions2022: 0.4, tempChange2022: 1.1, population: 60, profile: "plateau" },
  { id: "036", name: "Australia", emissions2022: 0.39, tempChange2022: 1.4, population: 26, profile: "plateau" },
  { id: "792", name: "Turkey", emissions2022: 0.44, tempChange2022: 1.6, population: 85, profile: "rising" },
  { id: "826", name: "United Kingdom", emissions2022: 0.32, tempChange2022: 1.6, population: 67, profile: "declining" },
  { id: "250", name: "France", emissions2022: 0.3, tempChange2022: 1.9, population: 68, profile: "declining" },
  { id: "380", name: "Italy", emissions2022: 0.32, tempChange2022: 1.9, population: 59, profile: "declining" },
  { id: "616", name: "Poland", emissions2022: 0.32, tempChange2022: 1.9, population: 38, profile: "declining" },
  { id: "724", name: "Spain", emissions2022: 0.24, tempChange2022: 1.8, population: 48, profile: "declining" },
  { id: "818", name: "Egypt", emissions2022: 0.25, tempChange2022: 1.3, population: 111, profile: "rising" },
  { id: "032", name: "Argentina", emissions2022: 0.19, tempChange2022: 0.9, population: 46, profile: "plateau" },
  { id: "566", name: "Nigeria", emissions2022: 0.13, tempChange2022: 0.9, population: 219, profile: "rising" },
  { id: "578", name: "Norway", emissions2022: 0.04, tempChange2022: 2.2, population: 5.5, profile: "plateau" },
  { id: "752", name: "Sweden", emissions2022: 0.035, tempChange2022: 2.0, population: 10.5, profile: "declining" },
  { id: "404", name: "Kenya", emissions2022: 0.02, tempChange2022: 0.9, population: 54, profile: "rising" },
  { id: "304", name: "Greenland", emissions2022: 0.0005, tempChange2022: 2.8, population: 0.06, profile: "plateau" },
];

function profileFactor(p: Profile, year: number) {
  const t = Math.max(0, Math.min(1, (year - 1960) / 62));
  if (p === "rising") return Math.max(0.05, t ** 1.8);
  if (p === "plateau") return interp([[1960, 0.55], [2005, 1.15], [2022, 1]], year);
  return interp([[1960, 1.3], [1980, 1.75], [1990, 1.7], [2022, 1]], year);
}

const tempAt2022 = interp(tempAnchors, 2022);
export function countryEmissions(c: Country, year: number) {
  return round(c.emissions2022 * profileFactor(c.profile, year), 3);
}
export function countryTemp(c: Country, year: number) {
  return round((c.tempChange2022 * Math.max(-0.2, interp(tempAnchors, year))) / tempAt2022, 2);
}
export function countrySeries(c: Country, from = 1960, to = 2022) {
  return range(from, to).map((year) => ({
    year,
    emissions: countryEmissions(c, year),
    temp: countryTemp(c, year),
    perCapita: round((countryEmissions(c, year) * 1000) / c.population, 2),
  }));
}

export const SECTORS = [
  { sector: "Electricity & heat", share: 0.31 },
  { sector: "Transport", share: 0.15 },
  { sector: "Manufacturing", share: 0.13 },
  { sector: "Agriculture", share: 0.12 },
  { sector: "Buildings", share: 0.07 },
  { sector: "Land use & forestry", share: 0.06 },
  { sector: "Industry processes", share: 0.06 },
  { sector: "Fugitive emissions", share: 0.06 },
  { sector: "Waste", share: 0.04 },
];
export function sectorEmissions(year: number) {
  const total = interp([[1960, 13], [1990, 32], [2010, 44], [2022, 50]], year);
  return SECTORS.map((s) => ({ name: s.sector, value: round(total * s.share, 2) }));
}

export const KEY_STATS = [
  { label: "Global temperature rise", value: 1.28, decimals: 2, unit: "°C", note: "2024 vs 1951–1980 average" },
  { label: "Atmospheric CO₂", value: 422.8, decimals: 1, unit: " ppm", note: "up from 280 ppm pre-industrial" },
  { label: "Sea level rise", value: 108, decimals: 0, unit: " mm", note: "since 1993 satellite record" },
];
