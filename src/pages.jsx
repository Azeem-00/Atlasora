// ============================================
// PAGES - All page components in one file
// ============================================

import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowRight, Compass, MapPin, BookOpen, Bookmark, Globe, TrendingUp, Database, Zap,
  Users, Landmark, Globe2, Clock, Languages, Coins, ArrowLeft, ExternalLink,
  Check, Calendar, AlertCircle,
} from 'lucide-react';
import {
  getAllCountries, getCountryByCode, getWikiSummary, getAttractionsNear, getUnsplashPhoto, formatCoords,
} from './lib';
import { useSaved, useAuth } from './context';

// ---------- HOME PAGE ----------
const REGIONS_HOME = [
  { name: 'Africa', coord: '2.00°N 21.75°E', count: '54 nations', highlight: 'Safari & Heritage' },
  { name: 'Americas', coord: '15.00°N 90.00°W', count: '35 nations', highlight: 'Diverse Landscapes' },
  { name: 'Asia', coord: '34.00°N 100.00°E', count: '48 nations', highlight: 'Ancient Cultures' },
  { name: 'Europe', coord: '54.00°N 15.00°E', count: '44 nations', highlight: 'History & Art' },
  { name: 'Oceania', coord: '22.00°S 140.00°E', count: '14 nations', highlight: 'Island Paradises' },
];

export function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    getAllCountries()
      .then((data) => {
        if (!alive) return;
        const featured = [...data]
          .sort((a, b) => b.population - a.population)
          .filter((c, i, arr) => arr.findIndex((x) => x.region === c.region) === i || i < 40)
          .slice(0, 12);
        setCountries(featured);
      })
      .catch((err) => {
        if (!alive) return;
        console.error('Failed to load countries:', err);
        setError(err.message);
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/explore${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-[10%] h-3 w-3 rounded-full bg-brass-300/60 animate-pulse-soft blur-sm" />
          <div className="absolute top-48 right-[12%] h-2 w-2 rounded-full bg-teal-300/50 animate-pulse-soft blur-sm" style={{ animationDelay: '0.4s' }} />
          <div className="absolute bottom-32 left-[18%] h-2 w-2 rounded-full bg-brass-300/50 animate-pulse-soft blur-sm" style={{ animationDelay: '0.8s' }} />
          <div className="absolute bottom-40 right-[22%] h-3 w-3 rounded-full bg-teal-300/60 animate-pulse-soft blur-sm" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-[40%] left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-brass-300/30 to-transparent" />
          <div className="absolute top-[35%] right-[8%] w-px h-24 bg-gradient-to-b from-transparent via-teal-300/30 to-transparent" />
        </div>

        <div className="container-wide pt-20 pb-20 sm:pt-28 sm:pb-28 md:pt-36 md:pb-36 lg:pt-40 lg:pb-40 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brass-300/20 bg-brass-300/5 mb-8 animate-drift">
              <div className="h-2 w-2 rounded-full bg-brass-300 animate-pulse" />
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-brass-200">Global Intelligence Platform</span>
            </div>

            <h1 className="font-display text-[2.5rem] leading-[1.1] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] text-parchment-50 text-balance tracking-tight">
              Navigate the
              <br />
              <span className="relative">
                <span className="italic text-brass-300">World's</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="2" className="text-brass-300/40" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              Coordinates
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-ink-200 max-w-2xl leading-relaxed font-light">
              Atlasora delivers comprehensive geospatial intelligence for 195 nations. Real-time data, cultural insights, and strategic travel intelligence for the modern explorer.
            </p>

            <form onSubmit={handleSearch} className="search-hero mt-8 sm:mt-12">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try Japan, Nairobi, or Europe…"
                className="field-input flex-1 min-w-0 pl-12 py-4 text-base"
              />
              <button type="submit" className="btn-primary w-full sm:w-auto shrink-0">
                <span className="hidden sm:inline">Begin Exploration</span>
                <span className="sm:hidden">Explore</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatItem value="195" label="Sovereign Nations" icon={Globe} />
              <StatItem value="7" label="Continents" icon={Compass} />
              <StatItem value="10K+" label="Data Points" icon={Database} />
              <StatItem value="Live" label="API Connected" icon={Zap} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide section-pad">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-brass-300" strokeWidth={1.5} />
              <span className="eyebrow">Trending Destinations</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-parchment-50">Most Explored Coordinates</h2>
          </div>
          <Link to="/explore" className="btn-ghost w-fit">
            View All Destinations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card-stamp animate-pulse">
                <div className="aspect-[4/3] bg-ink-700" />
                <div className="p-4 space-y-2">
                  <div className="h-3 w-2/3 bg-ink-700 rounded" />
                  <div className="h-3 w-1/2 bg-ink-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-ink-300 mb-4">Unable to load destinations. Please check your connection.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {countries.map((c, i) => (
              <Link key={c.cca3} to={`/country/${c.cca3}`} className="card-stamp group block h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
                  <img src={c.flags?.svg} alt={c.name.common} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="coord">{formatCoords(c.latlng?.[0], c.latlng?.[1])}</p>
                    <h3 className="font-display text-xl text-parchment-50 mt-0.5 leading-tight">{c.name.common}</h3>
                  </div>
                  <span className="absolute top-3 left-3 font-mono text-[10px] text-parchment-100/70 tracking-widest">№{String(i + 1).padStart(3, '0')}</span>
                </div>
                <div className="p-4 flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-ink-300 min-w-0">
                    <Landmark className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{c.capital?.[0] ?? 'No capital'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-300">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span>{c.population >= 1_000_000 ? `${(c.population / 1_000_000).toFixed(1)}M` : c.population >= 1_000 ? `${(c.population / 1_000).toFixed(0)}K` : c.population}</span>
                  </div>
                  <span className="text-xs font-mono text-teal-300 truncate">{c.region}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container-wide section-pad">
        <div className="text-center mb-8 sm:mb-12">
          <p className="eyebrow mb-3">Strategic Overview</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-parchment-50">Explore by Region</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {REGIONS_HOME.map((r) => (
            <Link key={r.name} to={`/explore?region=${encodeURIComponent(r.name)}`} className="group relative rounded-2xl border border-ink-600 bg-ink-800/40 p-6 overflow-hidden transition-all duration-500 hover:border-brass-300/40 hover:-translate-y-2 hover:shadow-glow">
              <div className="absolute inset-0 bg-graticule opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <MapPin className="h-6 w-6 text-teal-300" strokeWidth={1.5} />
                  <span className="font-mono text-xs text-brass-300/80 bg-brass-300/10 px-2 py-1 rounded-full">{r.count}</span>
                </div>
                <h3 className="font-display text-xl text-parchment-50 mb-2">{r.name}</h3>
                <p className="coord mb-3">{r.coord}</p>
                <p className="text-xs text-ink-400 font-medium">{r.highlight}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-wide section-pad">
        <div className="text-center mb-8 sm:mb-12">
          <p className="eyebrow mb-3">Platform Capabilities</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-parchment-50">Why Atlasora</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard icon={Database} title="Live Geospatial Data" desc="Real-time country profiles, currencies, languages, and coordinates sourced from authoritative global databases." />
          <FeatureCard icon={BookOpen} title="Comprehensive Guides" desc="Every destination includes detailed cultural insights, landmarks, and travel intelligence from verified sources." />
          <FeatureCard icon={Bookmark} title="Personal Atlas" desc="Build your custom collection of destinations. Save, organize, and access your travel intelligence anywhere." />
        </div>
      </section>

      <section className="container-wide pb-16 sm:pb-24 lg:pb-32">
        <div className="relative rounded-2xl sm:rounded-3xl border border-ink-600 bg-gradient-to-br from-ink-800/80 to-ink-900/80 p-8 sm:p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-graticule opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-brass-300/50 to-transparent" />
          <div className="relative">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <Compass className="h-6 w-6 text-brass-300" strokeWidth={1.5} />
              <span className="eyebrow">Begin Your Journey</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-parchment-50 text-balance mb-4 sm:mb-6">Your Global Atlas Awaits</h2>
            <p className="text-lg text-ink-300 max-w-2xl mx-auto leading-relaxed">Start building your personal collection of destinations. Save coordinates, track explorations, and access comprehensive travel intelligence.</p>
            <Link to="/explore" className="btn-primary mt-10 inline-flex !py-4 !px-10 text-lg">Start Exploring <ArrowRight className="h-5 w-5" /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ value, label, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-brass-300/10 border border-brass-300/20 shrink-0">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-brass-300" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="font-display text-xl sm:text-2xl text-parchment-50">{value}</div>
        <div className="font-mono text-[10px] sm:text-xs text-ink-400 uppercase tracking-wider leading-tight">{label}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="group relative rounded-2xl border border-ink-600 bg-ink-800/40 p-8 transition-all duration-300 hover:border-brass-300/40 hover:-translate-y-1">
      <div className="absolute inset-0 bg-graticule opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brass-300/10 border border-brass-300/20 mb-6 group-hover:bg-brass-300/20 transition-colors">
          <Icon className="h-7 w-7 text-brass-300" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-xl text-parchment-50 mb-3">{title}</h3>
        <p className="text-sm text-ink-300 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ---------- EXPLORE PAGE ----------
const REGIONS_EXPLORE = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
const SORTS = [
  { key: 'name', label: 'Name A–Z' },
  { key: 'population', label: 'Population' },
  { key: 'area', label: 'Area' },
];

export function Explore() {
  const [params, setParams] = useSearchParams();
  const [countries, setCountries] = useState([]);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [region, setRegion] = useState(params.get('region') ?? '');
  const [sort, setSort] = useState('name');

  useEffect(() => {
    setStatus('loading');
    getAllCountries()
      .then((data) => {
        setCountries(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    const next = {};
    if (query) next.q = query;
    if (region) next.region = region;
    setParams(next, { replace: true });
  }, [query, region]);

  const filtered = useMemo(() => {
    let list = countries;
    if (region) list = list.filter((c) => c.region === region);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.common.toLowerCase().includes(q) ||
          c.capital?.[0]?.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.subregion?.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === 'name') sorted.sort((a, b) => a.name.common.localeCompare(b.name.common));
    if (sort === 'population') sorted.sort((a, b) => b.population - a.population);
    if (sort === 'area') sorted.sort((a, b) => b.area - a.area);
    return sorted;
  }, [countries, region, query, sort]);

  return (
    <div className="container-wide py-8 sm:py-10">
      <div className="page-header">
        <p className="eyebrow mb-2">Explore</p>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-parchment-50">Chart your next destination</h1>
        <p className="text-ink-300 mt-2 max-w-xl text-sm sm:text-base">Search all 195 countries by name, capital, or region.</p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Compass className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 h-4 w-4" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a country, capital, or region…" className="field-input w-full pl-10" />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs font-mono text-ink-400 uppercase tracking-wider shrink-0">Sort by</span>
          <div className="flex gap-1 rounded-full border border-ink-600 p-1 shrink-0">
            {SORTS.map((s) => (
              <button key={s.key} type="button" onClick={() => setSort(s.key)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${sort === s.key ? 'bg-brass-300 text-ink-900' : 'text-ink-300 hover:text-parchment-100'}`}>{s.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="relative -mx-4 sm:mx-0">
          <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 sm:px-0 pb-1 sm:flex-wrap sm:overflow-visible" role="group" aria-label="Filter by region">
            <button type="button" onClick={() => setRegion('')} className={`chip shrink-0 ${!region ? 'chip-active' : ''}`}>All regions</button>
            {REGIONS_EXPLORE.map((opt) => (
              <button key={opt} type="button" onClick={() => setRegion(opt === region ? '' : opt)} className={`chip shrink-0 ${region === opt ? 'chip-active' : ''}`}>{opt}</button>
            ))}
          </div>
        </div>
      </div>

      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card-stamp animate-pulse"><div className="aspect-[4/3] bg-ink-700" /><div className="p-4 space-y-2"><div className="h-3 w-2/3 bg-ink-700 rounded" /><div className="h-3 w-1/2 bg-ink-700 rounded" /></div></div>
          ))}
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <AlertTriangle className="h-8 w-8 text-coral-400" strokeWidth={1.5} />
          <p className="text-parchment-200 max-w-sm">We couldn't chart the countries just now. The data source may be unreachable.</p>
        </div>
      )}
      {status === 'ready' && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ink-600 bg-ink-800"><Compass className="h-6 w-6 text-brass-300" strokeWidth={1.5} /></div>
          <h3 className="font-display text-xl text-parchment-50">No coordinates match</h3>
          <p className="text-ink-300 max-w-sm text-sm">Try a different search term, or clear the region filter.</p>
        </div>
      )}
      {status === 'ready' && filtered.length > 0 && (
        <>
          <p className="coord mb-4">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((c, i) => (
              <Link key={c.cca3} to={`/country/${c.cca3}`} className="card-stamp group block h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
                  <img src={c.flags?.svg} alt={c.name.common} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="coord">{formatCoords(c.latlng?.[0], c.latlng?.[1])}</p>
                    <h3 className="font-display text-xl text-parchment-50 mt-0.5 leading-tight">{c.name.common}</h3>
                  </div>
                  <span className="absolute top-3 left-3 font-mono text-[10px] text-parchment-100/70 tracking-widest">№{String(i + 1).padStart(3, '0')}</span>
                </div>
                <div className="p-4 flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-ink-300 min-w-0"><Landmark className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{c.capital?.[0] ?? 'No capital'}</span></div>
                  <div className="flex items-center gap-1.5 text-xs text-ink-300"><Users className="h-3.5 w-3.5 shrink-0" /><span>{c.population >= 1_000_000 ? `${(c.population / 1_000_000).toFixed(1)}M` : c.population >= 1_000 ? `${(c.population / 1_000).toFixed(0)}K` : c.population}</span></div>
                  <span className="text-xs font-mono text-teal-300 truncate">{c.region}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- COUNTRY DETAIL PAGE ----------
function formatPopulation(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

export function CountryDetail() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [guide, setGuide] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [heroImg, setHeroImg] = useState(null);
  const [borderNames, setBorderNames] = useState({});
  const [status, setStatus] = useState('loading');
  const { isSaved, toggleSave } = useSaved();

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    setCountry(null);
    setGuide(null);
    setAttractions([]);

    getCountryByCode(code)
      .then(async (c) => {
        if (!alive) return;
        if (!c) { setStatus('error'); return; }
        setCountry(c);
        setStatus('ready');

        const name = c.name.common;
        const [lat, lng] = c.latlng ?? [];

        getWikiSummary(name).then((s) => alive && setGuide(s)).catch(() => alive && setGuide(null));
        getUnsplashPhoto(`${name} landscape travel`, { width: 1600, height: 900 }).then((p) => alive && setHeroImg(p)).catch(() => {});

        if (lat != null && lng != null) {
          getAttractionsNear(lat, lng).then((results) => alive && setAttractions(results)).catch(() => alive && setAttractions([]));
        }
      })
      .catch(() => alive && setStatus('error'));

    return () => { alive = false; };
  }, [code]);

  useEffect(() => {
    setBorderNames({});
    if (!country?.borders?.length) return;
    let alive = true;
    getAllCountries()
      .then((all) => {
        if (!alive) return;
        const lookup = Object.fromEntries(all.map((c) => [c.cca3, c.name.common]));
        const names = {};
        country.borders.forEach((b) => { names[b] = lookup[b] ?? b; });
        setBorderNames(names);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [country]);

  if (status === 'loading') return <div className="flex flex-col items-center justify-center py-24 gap-4"><Compass className="h-8 w-8 text-brass-300 animate-spin-slow" strokeWidth={1.5} /><p className="coord">Charting coordinates…</p></div>;
  if (status === 'error' || !country) {
    return (
      <div className="container-wide py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-ink-800 border border-ink-600 mb-6"><MapPin className="h-10 w-10 text-ink-400" /></div>
          <h2 className="font-display text-3xl text-parchment-50 mb-4">Country Not Found</h2>
          <p className="text-ink-300 mb-8 max-w-md mx-auto">We couldn't find that country on the map. It may not be available in our current dataset.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/explore" className="btn-primary">Explore Available Countries</Link>
            <Link to="/" className="btn-secondary">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const [lat, lng] = country.latlng ?? [];
  const saved = isSaved(country.cca3);
  const languages = country.languages ? Object.values(country.languages) : [];
  const currencies = country.currencies ? Object.values(country.currencies) : [];

  return (
    <div>
      <section className="relative h-[45vh] sm:h-[50vh] min-h-[320px] sm:min-h-[380px] overflow-hidden">
        <img src={heroImg?.url || country.flags?.svg} alt={country.name.common} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/20" />
        <div className="absolute inset-0 bg-ink-950/20" />
        <div className="relative container-wide h-full flex flex-col justify-between py-4 sm:py-6">
          <Link to="/explore" className="btn-ghost !text-parchment-100 w-fit bg-ink-950/40 backdrop-blur-sm text-sm"><ArrowLeft className="h-4 w-4" /> Back to explore</Link>
          <div>
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <img src={country.flags?.svg} alt="" className="h-7 w-10 sm:h-8 sm:w-12 object-cover rounded shadow-stamp" />
              <p className="coord">{formatCoords(lat, lng)}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-3xl sm:text-4xl md:text-6xl text-parchment-50 break-words">{country.name.common}</h1>
                <p className="text-parchment-200 mt-1 text-sm sm:text-base line-clamp-2">{country.name.official}</p>
              </div>
              <button type="button" onClick={() => toggleSave(country)} className={`btn-primary w-full sm:w-auto shrink-0 ${saved ? '!bg-ink-800 !text-brass-200 border border-brass-300/50' : ''}`}><Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />{saved ? 'Saved to atlas' : 'Save destination'}</button>
            </div>
          </div>
        </div>
        {heroImg?.credit?.name && <a href={heroImg.credit.link} target="_blank" rel="noreferrer" className="absolute bottom-3 right-4 text-[10px] font-mono text-parchment-200/70 hover:text-parchment-100">Photo: {heroImg.credit.name} / Unsplash</a>}
      </section>

      <div className="container-wide py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <DetailStat icon={Landmark} label="Capital" value={country.capital?.[0] ?? '—'} />
            <DetailStat icon={Users} label="Population" value={formatPopulation(country.population)} />
            <DetailStat icon={Globe2} label="Region" value={country.subregion || country.region} />
            <DetailStat icon={Clock} label="Timezone" value={country.timezones?.[0] ?? '—'} />
          </div>

          <div>
            <p className="eyebrow mb-2">Travel guide</p>
            <h2 className="font-display text-2xl text-parchment-50 mb-4">About {country.name.common}</h2>
            {guide ? (
              <div className="card-stamp p-6">
                <p className="text-ink-100 leading-relaxed">{guide.extract}</p>
                <a href={guide.content_urls?.desktop?.page} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brass-300 hover:text-brass-200 mt-4">Read the full guide on Wikipedia <ExternalLink className="h-3.5 w-3.5" /></a>
              </div>
            ) : <p className="text-ink-400 text-sm">No guide summary available for this destination yet.</p>}
          </div>

          <div>
            <p className="eyebrow mb-2">Nearby</p>
            <h2 className="font-display text-2xl text-parchment-50 mb-4">Landmarks & attractions</h2>
            {attractions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attractions.map((a) => (
                  <a key={a.pageid} href={`https://en.wikipedia.org/wiki/${encodeURIComponent(a.title.replace(/ /g, '_'))}`} target="_blank" rel="noreferrer" className="card-stamp group flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 items-start">
                    <div className="h-16 w-full sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-ink-700 flex items-center justify-center text-ink-400"><MapPin className="h-6 w-6" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2"><h4 className="font-display text-base text-parchment-50 leading-snug">{a.title}</h4><ExternalLink className="h-3.5 w-3.5 shrink-0 mt-1 text-ink-400 group-hover:text-brass-300 transition-colors" /></div>
                      <div className="flex items-center gap-3 mt-2"><span className="coord">{(a.dist / 1000).toFixed(1)} km away</span></div>
                    </div>
                  </a>
                ))}
              </div>
            ) : <div className="card-stamp p-6 flex items-center gap-3 text-ink-400 text-sm"><MapPin className="h-4 w-4" />No catalogued landmarks found near this capital point yet.</div>}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card-stamp p-6 space-y-5">
            <h3 className="eyebrow">Field notes</h3>
            <InfoRow icon={Languages} label="Languages">{languages.length ? languages.join(', ') : '—'}</InfoRow>
            <InfoRow icon={Coins} label="Currency">{currencies.length ? currencies.map((c) => `${c.name} (${c.symbol ?? '—'})`).join(', ') : '—'}</InfoRow>
            <InfoRow icon={Globe2} label="Area">{country.area ? `${formatPopulation(Math.round(country.area))} km²` : '—'}</InfoRow>
            {country.maps?.googleMaps && <a href={country.maps.googleMaps} target="_blank" rel="noreferrer" className="btn-secondary w-full !py-2.5 text-sm">View on map <ExternalLink className="h-3.5 w-3.5" /></a>}
          </div>

          {country.borders?.length > 0 && (
            <div className="card-stamp p-6">
              <h3 className="eyebrow mb-4">Shares a border with</h3>
              <div className="flex flex-wrap gap-2">
                {country.borders.map((b) => <Link key={b} to={`/country/${b}`} className="chip !py-1 text-xs">{borderNames[b] ?? b}</Link>)}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function DetailStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink-600 bg-ink-800/50 p-4">
      <Icon className="h-4 w-4 text-teal-300 mb-2" strokeWidth={1.5} />
      <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-sm text-parchment-100 mt-0.5 truncate">{value}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-brass-300 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-ink-400">{label}</p>
        <p className="text-sm text-parchment-100">{children}</p>
      </div>
    </div>
  );
}

// ---------- GUIDES PAGE ----------
const TOPICS = [
  { title: 'Kyoto', tag: 'City guide' },
  { title: 'Marrakesh', tag: 'City guide' },
  { title: 'Patagonia', tag: 'Region guide' },
  { title: 'Icelandic Highlands', tag: 'Region guide' },
  { title: 'Great Barrier Reef', tag: 'Natural wonder' },
  { title: 'Swiss Alps', tag: 'Region guide' },
  { title: 'Serengeti', tag: 'Natural wonder' },
  { title: 'Machu Picchu', tag: 'Landmark' },
  { title: 'Santorini', tag: 'Island guide' },
];

export function Guides() {
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let alive = true;
    Promise.all(TOPICS.map(async (t) => {
      try {
        const [summary, photo] = await Promise.all([getWikiSummary(t.title), getUnsplashPhoto(`${t.title} travel`, { width: 700, height: 500 })]);
        return { ...t, summary, photo };
      } catch { return { ...t, summary: null, photo: null }; }
    })).then((res) => {
      if (alive) { setCards(res.filter((r) => r.summary)); setStatus('ready'); }
    });
    return () => { alive = false; };
  }, []);

  return (
    <div className="container-wide py-8 sm:py-10">
      <div className="page-header max-w-2xl">
        <p className="eyebrow mb-2">Guides</p>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-parchment-50">Field-tested reading, before you go</h1>
        <p className="text-ink-300 mt-2 text-sm sm:text-base">Long-form context on cities, regions, and natural wonders — pulled from Wikipedia's open archive and refreshed live.</p>
      </div>

      {status === 'loading' ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4"><Compass className="h-8 w-8 text-brass-300 animate-spin-slow" strokeWidth={1.5} /><p className="coord">Gathering dispatches…</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((c) => (
            <a key={c.title} href={c.summary.content_urls?.desktop?.page} target="_blank" rel="noreferrer" className="card-stamp group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink-700">
                <img src={c.photo?.url} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 to-transparent" />
                <span className="absolute top-3 left-3 chip !py-1 !bg-ink-900/70 text-[11px]"><BookOpen className="h-3 w-3" /> {c.tag}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display text-lg text-parchment-50">{c.title}</h3>
                <p className="text-sm text-ink-300 mt-2 line-clamp-3 flex-1">{c.summary.extract}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-brass-300 mt-4 group-hover:gap-2.5 transition-all">Read the dispatch <ArrowRight className="h-3.5 w-3.5" /></span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- SAVED PAGE ----------
export function Saved() {
  const { saved, removeSaved } = useSaved();

  return (
    <div className="container-wide py-8 sm:py-10">
      <div className="page-header">
        <p className="eyebrow mb-2">Your atlas</p>
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-parchment-50">Saved destinations</h1>
        <p className="text-ink-300 mt-2 text-sm sm:text-base">{saved.length > 0 ? `${saved.length} place${saved.length !== 1 ? 's' : ''} stamped for later.` : 'Nothing stamped yet — start exploring to build your collection.'}</p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ink-600 bg-ink-800"><Bookmark className="h-6 w-6 text-brass-300" strokeWidth={1.5} /></div>
          <h3 className="font-display text-xl text-parchment-50">Your atlas is empty</h3>
          <p className="text-ink-300 max-w-sm text-sm">Save destinations from the explore page and they'll appear here, ready whenever you are.</p>
          <Link to="/explore" className="btn-primary">Start exploring <ArrowRight className="h-4 w-4" /></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {saved.map((s) => (
            <div key={s.cca3} className="card-stamp group">
              <Link to={`/country/${s.cca3}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
                  <img src={s.flag} alt={s.name} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="coord">{formatCoords(s.latlng?.[0], s.latlng?.[1])}</p>
                    <h3 className="font-display text-xl text-parchment-50">{s.name}</h3>
                  </div>
                </div>
              </Link>
              <div className="p-4 flex items-center justify-between">
                <div className="text-xs text-ink-300 flex items-center gap-1.5"><Compass className="h-3.5 w-3.5" /> {s.region}</div>
                <button onClick={() => removeSaved(s.cca3)} className="flex items-center gap-1 text-xs text-ink-400 hover:text-coral-400 transition-colors"><X className="h-3.5 w-3.5" /> Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- LOGIN PAGE ----------
export function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Compass className="h-8 w-8 text-brass-300 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="font-display text-3xl text-parchment-50">Welcome back</h1>
          <p className="text-ink-300 mt-2 text-sm">Sign in to reach your saved destinations.</p>
        </div>

        <form onSubmit={handleSubmit} className="card-stamp p-7 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-coral-500/40 bg-coral-500/10 px-3 py-2.5 text-sm text-coral-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="field-input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="field-input" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'} <ArrowRight className="h-4 w-4" /></button>
        </form>

        <p className="text-center text-sm text-ink-400 mt-6">New to Atlasora? <Link to="/signup" className="text-brass-300 hover:text-brass-200">Create an account</Link></p>
        <p className="text-center text-xs text-ink-500 mt-3 font-mono">Demo auth — data stays in your browser only.</p>
      </div>
    </div>
  );
}

// ---------- SIGNUP PAGE ----------
export function Signup() {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    try {
      await signup(form);
      navigate('/', { replace: true });
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Compass className="h-8 w-8 text-brass-300 mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="font-display text-3xl text-parchment-50">Start your atlas</h1>
          <p className="text-ink-300 mt-2 text-sm">Create a free account to save destinations as you explore.</p>
        </div>

        <form onSubmit={handleSubmit} className="card-stamp p-7 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-coral-500/40 bg-coral-500/10 px-3 py-2.5 text-sm text-coral-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Full name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="field-input" placeholder="Ada Explorer" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="field-input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="field-input" placeholder="At least 6 characters" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60">{loading ? 'Creating account…' : 'Create account'} <ArrowRight className="h-4 w-4" /></button>
        </form>

        <p className="text-center text-sm text-ink-400 mt-6">Already have an account? <Link to="/login" className="text-brass-300 hover:text-brass-200">Sign in</Link></p>
        <p className="text-center text-xs text-ink-500 mt-3 font-mono">Demo auth — data stays in your browser only.</p>
      </div>
    </div>
  );
}

// ---------- PROFILE PAGE ----------
export function Profile() {
  const { user, updateProfile } = useAuth();
  const { saved } = useSaved();
  const [form, setForm] = useState({ homeBase: user?.homeBase ?? '', bio: user?.bio ?? '' });
  const [savedFlag, setSavedFlag] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSavedFlag(true);
    setTimeout(() => setSavedFlag(false), 1800);
  };

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—';
  const regions = [...new Set(saved.map((s) => s.region))];

  return (
    <div className="container-wide py-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brass-300/15 text-brass-200 font-display text-2xl">{user?.name?.[0]?.toUpperCase() ?? 'A'}</div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-parchment-50">{user?.name}</h1>
          <p className="text-ink-300 text-sm flex items-center gap-1.5 mt-1"><Calendar className="h-3.5 w-3.5" /> Charting since {memberSince}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card-stamp p-7 space-y-5">
          <h2 className="eyebrow">Field notes</h2>

          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Email</label>
            <input value={user?.email ?? ''} disabled className="field-input opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Home base</label>
            <input value={form.homeBase} onChange={(e) => setForm((f) => ({ ...f, homeBase: e.target.value }))} className="field-input" placeholder="Where do you set out from?" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-ink-400 mb-1.5 block">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={4} className="field-input resize-none" placeholder="A short note about your travel style…" />
          </div>

          <button type="submit" className="btn-primary">{savedFlag ? <><Check className="h-4 w-4" /> Saved</> : 'Save changes'}</button>
        </form>

        <aside className="space-y-6">
          <div className="card-stamp p-6">
            <div className="flex items-center gap-2 mb-4"><Bookmark className="h-4 w-4 text-brass-300" /><h3 className="eyebrow">Atlas summary</h3></div>
            <p className="font-display text-4xl text-parchment-50">{saved.length}</p>
            <p className="text-xs text-ink-400 mt-1">destination{saved.length !== 1 ? 's' : ''} saved</p>

            {regions.length > 0 && (
              <div className="mt-5 pt-5 border-t border-ink-700">
                <p className="text-xs uppercase tracking-wide text-ink-400 mb-2">Regions covered</p>
                <div className="flex flex-wrap gap-1.5">
                  {regions.map((r) => <span key={r} className="chip !py-1 text-xs cursor-default"><MapPin className="h-3 w-3" /> {r}</span>)}
                </div>
              </div>
            )}

            <Link to="/saved" className="btn-secondary w-full mt-5 !py-2.5 text-sm">View saved atlas</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
