// CedarCare mark (a care cross with a cedar leaf) + wordmark. Same artwork as /public/favicon.svg.
export function LogoMark({ light = false, className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="15" fill={light ? "#ffffff" : "#1e4b41"} />
      <path d="M32 16V48M16 32H48" stroke={light ? "#1e4b41" : "#ffffff"} strokeWidth="8" strokeLinecap="round" />
      <path d="M37 27C37 15 48 10 55 9C55 16 50 27 37 27Z" fill={light ? "#2f7d6e" : "#6fcfb6"} />
    </svg>
  );
}

export default function Logo({ light = false, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark light={light} />
      <span className="leading-none">
        <span className={`block font-display text-[1.45rem] ${light ? "text-white" : "text-cedar-dark"}`}>
          Cedar<span className={light ? "text-[#bfe6da]" : "text-leaf"}>Care</span>
        </span>
        <span className={`mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${light ? "text-white/75" : "text-muted"}`}>Family Clinic</span>
      </span>
    </span>
  );
}
