# Planet in Focus

Build a modern, responsive website called "Climate Change Data Visualization Platform" that helps people explore and understand climate change through interactive charts and maps.

Purpose: Make climate data easy to understand and explore for students, researchers, journalists, and the general public.

Pages/sections:

- Home: bold hero with headline ("See the Planet Change"), short tagline, a key-stat counter (global temperature rise, CO2 ppm, sea level rise), and a "Explore the Data" button

- Dashboard: interactive charts with filters (year range, region, dataset), including:

  - Line chart: global temperature anomaly over time

  - Line/area chart: atmospheric CO2 concentration

  - Bar chart: emissions by country or sector

  - Sea level rise and Arctic ice extent charts

- Map view: interactive world map showing temperature change or emissions by country, with hover tooltips and a year slider

- Compare tool: pick two countries or time periods and compare side by side

- Data sources and methodology: list sources (NASA, NOAA, Our World in Data, IPCC) with links and a short explanation of the data

- About: project mission and team

- Contact: simple form and social links

Features:

- Interactive charts with tooltips, zoom, and hover details (use Chart.js, D3, or Recharts)

- Dark/light mode toggle

- Download chart as image and data as CSV

- Fully mobile responsive and accessible (good contrast, keyboard navigation, alt text)

- Smooth animations when charts load

- Fast loading and SEO-friendly

Style:

- Colors: deep navy and teal background with warm orange/red accents for warming data, white text

- Fonts: clean modern sans-serif (Inter or Poppins)

- Mood: trustworthy, scientific, but engaging and modern, with plenty of white space

Use realistic sample climate data for now, structured so real datasets can be plugged in later via CSV or API.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://planet-in-focus.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a882a2f6-431f-490a-8e67-f5d45fafde5d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
