# Atlasora

A travel discovery web app for exploring countries, destinations, attractions, and
travel guides — built with real, live public API data. Search freely, read a guide,
browse nearby landmarks, and stamp the places you want to visit into your own saved atlas.

## Design

Atlasora's visual identity is built around cartography: deep ink-navy surfaces, a
brass-gold and deep-teal palette, a graticule (lat/long grid) texture, and "stamp"
cards that show real coordinates for every destination — like pages out of a modern
field journal rather than a generic travel-brochure template.

- **Display type:** Fraunces (serif, atlas-book character)
- **Body type:** Manrope (clean geometric sans)
- **Utility type:** JetBrains Mono (coordinates, stats, data)

## Data sources (all real, all free)

| Source | Used for |
|---|---|
| [REST Countries](https://restcountries.com) | Country profiles: capital, population, region, languages, currencies, borders, coordinates |
| [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/) | Travel guide summaries |
| [Wikipedia Geosearch](https://www.mediawiki.org/wiki/Extension:GeoData) | Nearby landmarks & attractions, found via each country's coordinates |
| [Unsplash](https://unsplash.com/developers) *(optional)* | Destination photography — falls back to Picsum automatically if no API key is set |

No backend or database is required — the app talks to these APIs directly from the browser.

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Optional: add real Unsplash photography

By default, hero and guide images fall back to placeholder photography (Picsum) so the
app works out of the box. To use real Unsplash photos:

1. Create a free account at [unsplash.com/developers](https://unsplash.com/developers) and register an app to get an **Access Key**.
2. Copy `.env.example` to `.env`.
3. Set `VITE_UNSPLASH_ACCESS_KEY=your_key_here`.
4. Restart the dev server.

## Features

- **Explore** — search and filter all 195 countries by name, capital, or region; sort by name, population, or area.
- **Country detail** — capital, population, languages, currencies, timezone, bordering countries, a Wikipedia-sourced guide, and nearby landmarks pulled via geosearch.
- **Guides** — a curated set of long-form dispatches on cities, regions, and natural wonders.
- **Saved atlas** — bookmark destinations to a personal, persistent collection.
- **Accounts** — sign up / sign in / profile editing, backed by `localStorage` for a fully working demo with zero backend. Swap `src/context/AuthContext.jsx` for a real auth provider (Supabase, Firebase, your own API) to go to production.

## Tech stack

- React 18 + Vite
- React Router
- Tailwind CSS
- Lucide icons

## Project structure

```
src/
  components/   Reusable UI: Navbar, Footer, CountryCard, states, filters
  context/      AuthContext (mock auth) and SavedContext (bookmarks)
  lib/          api.js (all external data fetching), storage.js (localStorage helpers)
  pages/        Home, Explore, CountryDetail, Guides, Saved, Login, Signup, Profile
```

## Deploying

This is a static Vite app — build it and deploy the `dist/` folder anywhere
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.):

```bash
npm run build
```
