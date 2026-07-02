// ============================================
// COMPONENTS - All UI components in one file
// ============================================

import { Link, NavLink, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapPin,
  ExternalLink,
  Bookmark,
  Users,
  Landmark,
  Compass,
  Search,
  Menu,
  X,
  Globe,
  Layers,
  AlertTriangle,
} from "lucide-react";

// ---------- AttractionCard ----------
export function AttractionCard({
  title,
  extract,
  thumbnail,
  distanceMeters,
  coords,
}) {
  return (
    <a
      href={`https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`}
      target="_blank"
      rel="noreferrer"
      className="card-stamp group flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 items-start"
    >
      <div className="h-16 w-full sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-ink-700">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink-400">
            <MapPin className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display text-base text-parchment-50 leading-snug">
            {title}
          </h4>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-1 text-ink-400 group-hover:text-brass-300 transition-colors" />
        </div>
        {extract && (
          <p className="text-sm text-ink-300 mt-1 line-clamp-2">{extract}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {distanceMeters != null && (
            <span className="coord">
              {(distanceMeters / 1000).toFixed(1)} km away
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

// ---------- CountryCard ----------
function formatPopulation(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function CountryCard({ country, index = 0 }) {
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(country.cca3);
  const [lat, lng] = country.latlng ?? [];

  return (
    <Link
      to={`/country/${country.cca3}`}
      className="card-stamp group block h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
        <img
          src={country.flags?.svg || country.flags?.png}
          alt={`Flag of ${country.name.common}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent" />

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSave(country);
          }}
          aria-label={saved ? "Remove from saved" : "Save destination"}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all ${
            saved
              ? "bg-brass-300 text-ink-900"
              : "bg-ink-900/60 text-parchment-100 hover:bg-ink-900/80"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="coord">{formatCoords(lat, lng)}</p>
          <h3 className="font-display text-xl text-parchment-50 mt-0.5 leading-tight">
            {country.name.common}
          </h3>
        </div>

        <span className="absolute top-3 left-3 font-mono text-[10px] text-parchment-100/70 tracking-widest">
          №{String(index + 1).padStart(3, "0")}
        </span>
      </div>

      <div className="p-4 flex flex-wrap items-center gap-x-4 gap-y-2 justify-between">
        <div className="flex items-center gap-1.5 text-xs text-ink-300 min-w-0">
          <Landmark className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {country.capital?.[0] ?? "No capital"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink-300">
          <Users className="h-3.5 w-3.5 shrink-0" />
          <span>{formatPopulation(country.population)}</span>
        </div>
        <span className="text-xs font-mono text-teal-300 truncate">
          {country.region}
        </span>
      </div>
    </Link>
  );
}

// ---------- FilterChips ----------
export function FilterChips({
  options,
  value,
  onChange,
  label = "Filter by region",
}) {
  return (
    <div className="relative -mx-4 sm:mx-0">
      <div
        className="flex gap-2 overflow-x-auto scrollbar-none px-4 sm:px-0 pb-1 sm:flex-wrap sm:overflow-visible"
        role="group"
        aria-label={label}
      >
        <button
          type="button"
          onClick={() => onChange("")}
          className={`chip shrink-0 ${!value ? "chip-active" : ""}`}
        >
          All regions
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt === value ? "" : opt)}
            className={`chip shrink-0 ${value === opt ? "chip-active" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Footer ----------
export function Footer() {
  return (
    <footer className="border-t border-ink-700/80 mt-12 sm:mt-24">
      <div className="container-wide py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Compass
              className="h-5 w-5 text-brass-300 shrink-0"
              strokeWidth={1.75}
            />
            <span className="font-display text-lg text-parchment-50">
              Atlasora
            </span>
          </div>
          <p className="text-sm text-ink-300 leading-relaxed max-w-sm">
            A field guide to everywhere. Discover, chart, and save the places
            worth the trip.
          </p>
        </div>

        <FooterCol
          title="Explore"
          links={[
            { to: "/explore", label: "All countries" },
            { to: "/explore?region=Europe", label: "Europe" },
            { to: "/explore?region=Asia", label: "Asia" },
            { to: "/explore?region=Africa", label: "Africa" },
          ]}
        />
        <FooterCol
          title="Resources"
          links={[
            { to: "/guides", label: "Travel guides" },
            { to: "/saved", label: "Saved destinations" },
          ]}
        />
        <div>
          <p className="eyebrow mb-3">Data sources</p>
          <ul className="space-y-2 text-sm text-ink-300">
            <li>REST Countries</li>
            <li>Wikipedia</li>
            <li>Unsplash</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-700/80">
        <div className="container-wide relative py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-ink-400 font-mono text-center sm:text-left">
          <span>
            © {new Date().getFullYear()} ATLASORA · COORDINATES SUBJECT TO
            CHANGE
          </span>
          <span>Built for explorers</span>
          <span className="absolute right-3 bottom-1 opacity-5 text-[9px] sm:text-[10px] font-light text-parchment-50 pointer-events-none select-none">
            Abdul Azeem
          </span>
        </div>
      </div>
    </footer>
  );
}

// ---------- Watermark (subtle, bottom-right) ----------
// (watermark moved into footer)

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-sm text-ink-300 hover:text-brass-200 transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Navbar ----------
const navLinks = [
  { to: "/", label: "Home", icon: Globe },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/guides", label: "Guides", icon: Layers },
  { to: "/saved", label: "Saved", icon: Bookmark },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/90 backdrop-blur-xl">
      <div className="container-wide flex h-16 sm:h-20 lg:h-24 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0"
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-brass-300/20 blur-xl rounded-full group-hover:bg-brass-300/30 transition-all duration-500" />
            <Compass
              className="h-7 w-7 sm:h-8 sm:w-8 text-brass-300 transition-transform duration-700 group-hover:rotate-180 relative"
              strokeWidth={1.5}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-xl sm:text-2xl tracking-tight text-parchment-50 leading-none truncate">
              Atlasora
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] text-brass-300/70 uppercase hidden sm:block">
              Global Intelligence
            </span>
          </div>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-brass-200 bg-brass-300/10 border border-brass-300/20 shadow-glow"
                    : "text-parchment-300 hover:text-parchment-50 hover:bg-ink-800/50 border border-transparent"
                }`
              }
            >
              <l.icon
                className="h-4 w-4 transition-transform group-hover:scale-110"
                strokeWidth={1.5}
              />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/explore"
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-parchment-300 hover:text-parchment-50 hover:bg-ink-800/50 border border-transparent hover:border-ink-600 transition-all duration-300"
          >
            <Search
              className="h-4 w-4 transition-transform group-hover:scale-110"
              strokeWidth={1.5}
            />
            Search
          </Link>
          <Link
            to="/saved"
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-parchment-300 hover:text-parchment-50 hover:bg-ink-800/50 border border-transparent hover:border-ink-600 transition-all duration-300"
          >
            <Bookmark
              className="h-4 w-4 transition-transform group-hover:scale-110"
              strokeWidth={1.5}
            />
            Saved
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl text-parchment-300 hover:text-parchment-50 hover:bg-ink-800/50 border border-ink-600 transition-all duration-300"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav
          className="lg:hidden border-t border-ink-700/60 bg-ink-950/95 backdrop-blur-xl px-4 sm:px-6 py-4 space-y-1 max-h-[calc(100dvh-4rem)] overflow-y-auto safe-bottom"
          aria-label="Mobile navigation"
        >
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "text-brass-200 bg-brass-300/10 border border-brass-300/20"
                    : "text-parchment-200 hover:text-parchment-50 hover:bg-ink-800/50 border border-transparent"
                }`
              }
            >
              <l.icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

// ---------- ProtectedRoute ----------
export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// ---------- SearchBar ----------
export function SearchBar({
  value,
  onChange,
  placeholder = "Search a country, capital, or region…",
  large = false,
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 ${large ? "h-5 w-5" : "h-4 w-4"}`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`field-input w-full ${large ? "pl-12 py-4 text-base" : "pl-10"}`}
      />
    </div>
  );
}

// ---------- States ----------
export function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-stamp animate-pulse">
          <div className="aspect-[4/3] bg-ink-700" />
          <div className="p-4 space-y-2">
            <div className="h-3 w-2/3 bg-ink-700 rounded" />
            <div className="h-3 w-1/2 bg-ink-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CenteredSpinner({ label = "Charting the map…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Compass
        className="h-8 w-8 text-brass-300 animate-spin-slow"
        strokeWidth={1.5}
      />
      <p className="coord">{label}</p>
    </div>
  );
}

export function ErrorState({
  message = "Something drifted off course.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-400 text-center">
      <AlertTriangle className="h-8 w-8 text-coral-400" strokeWidth={1.5} />
      <p className="text-parchment-200 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Compass,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-ink-600 bg-ink-800">
        <Icon className="h-6 w-6 text-brass-300" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-xl text-parchment-50">{title}</h3>
      {description && (
        <p className="text-ink-300 max-w-sm text-sm">{description}</p>
      )}
      {action}
    </div>
  );
}

// Helper functions (imported from lib)
function formatCoords(lat, lng) {
  if (lat == null || lng == null) return "--° --°";
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${latDir} ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

// Import hooks from context (will be available after context.jsx is loaded)
// These are stubs - actual implementations are in context.jsx
export function useSaved() {
  throw new Error(
    "useSaved must be used within SavedProvider - import from context.jsx",
  );
}

export function useAuth() {
  throw new Error(
    "useAuth must be used within AuthProvider - import from context.jsx",
  );
}
