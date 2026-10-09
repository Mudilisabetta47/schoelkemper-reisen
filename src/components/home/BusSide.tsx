import { PHOENIX_PATHS, WORDMARK_PATHS } from "@/components/ui/logo-paths";

/**
 * Seitenansicht eines Scholkemper-Reisebusses (Vektor) in der echten
 * Lackierung: weißer Aufbau, dunkles Fensterband, Original-Logo.
 * Räder drehen über die CSS-Variable --wheel (gesetzt von der Szene).
 */
function Wheel({ cx }: { cx: number }) {
  return (
    <g className="bus-wheel" style={{ transformOrigin: `${cx}px 274px` }}>
      <circle cx={cx} cy={274} r={41} fill="#121416" />
      <circle cx={cx} cy={274} r={27} fill="#c9cdd1" />
      <circle cx={cx} cy={274} r={22} fill="#9aa0a6" />
      {[0, 72, 144, 216, 288].map((a) => (
        <rect key={a} x={cx - 2.5} y={252} width={5} height={22} rx={2} fill="#e4e7ea" transform={`rotate(${a} ${cx} 274)`} />
      ))}
      <circle cx={cx} cy={274} r={7} fill="#2a2f33" />
    </g>
  );
}

export function BusSide({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1220 330" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bs-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f1f2f1" />
          <stop offset="1" stopColor="#d9dbda" />
        </linearGradient>
        <linearGradient id="bs-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a444b" />
          <stop offset="0.45" stopColor="#1c2125" />
          <stop offset="1" stopColor="#14181b" />
        </linearGradient>
        <linearGradient id="bs-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ff9f5a" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="bs-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="bs-window-clip">
          <path d="M52 62 H1104 Q1142 62 1160 98 L1176 172 H52 Q44 172 44 164 V70 Q44 62 52 62Z" />
        </clipPath>
      </defs>

      {/* Dachklima */}
      <rect x="560" y="26" width="260" height="18" rx="9" fill="#e7e9e8" />
      {/* Aufbau */}
      <path
        d="M44 40 H1098 Q1152 40 1172 82 L1192 166 V258 Q1192 282 1168 282 H40 Q20 282 20 262 V66 Q20 40 44 40Z"
        fill="url(#bs-body)"
        stroke="#c5c8c7"
        strokeWidth="1.5"
      />
      {/* Fensterband */}
      <path d="M52 62 H1104 Q1142 62 1160 98 L1176 172 H52 Q44 172 44 164 V70 Q44 62 52 62Z" fill="url(#bs-glass)" />
      {/* Innenbeleuchtung (Opazität über --glow) */}
      <g clipPath="url(#bs-window-clip)">
        <rect x="44" y="62" width="1140" height="112" fill="url(#bs-glow)" className="bus-glow" />
        {/* Kopfstützen-Silhouetten */}
        {Array.from({ length: 13 }, (_, i) => (
          <rect key={i} x={120 + i * 72} y={118} width={30} height={54} rx={10} fill="#0e1113" opacity="0.55" />
        ))}
        <rect x="-300" y="62" width="300" height="112" fill="url(#bs-sheen)" className="bus-sheen" />
      </g>
      {/* Fensterstreben */}
      {[220, 400, 580, 760, 940].map((x) => (
        <rect key={x} x={x} y={62} width={5} height={110} fill="#0c0f11" opacity="0.9" />
      ))}
      {/* Türen */}
      <rect x="1060" y="176" width="74" height="98" rx="4" fill="none" stroke="#b9bdbc" strokeWidth="2" />
      <rect x="1068" y="184" width="58" height="46" rx="3" fill="#232a2f" />
            {/* Kofferraumklappen */}
      <rect x="826" y="236" width="80" height="30" rx="4" fill="none" stroke="#cfd2d1" strokeWidth="1.5" />
      {/* Logo (Original-Pfade) */}
      <g transform="translate(440 182) scale(0.6)">
        <g fill="#992233">
          {PHOENIX_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g fill="#555555">
          {WORDMARK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
      {/* Radkästen */}
      <path d="M204 282 V262 A50 50 0 0 1 254 212 H364 A50 50 0 0 1 414 262 V282Z" fill="#2b3034" />
      <path d="M922 282 V264 A52 52 0 0 1 1026 264 V282Z" fill="#2b3034" />
      <Wheel cx={256} />
      <Wheel cx={362} />
      <Wheel cx={974} />
      {/* Scheinwerfer, Rückleuchte, Spiegel */}
      <rect x="1176" y="226" width="16" height="14" rx="3" fill="#fffbe8" className="bus-headlight" />
      <rect x="20" y="196" width="9" height="50" rx="3" fill="#b3122b" className="bus-taillight" />
      <path d="M1176 70 C1206 66 1216 84 1214 118" fill="none" stroke="#1c2125" strokeWidth="6" strokeLinecap="round" />
      <rect x="1206" y="112" width="12" height="30" rx="4" fill="#1c2125" />
    </svg>
  );
}
