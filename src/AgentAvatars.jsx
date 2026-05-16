import React from 'react';

const MascotDefs = ({ id }) => (
  <defs>
    <radialGradient id={`visor-${id}`} cx="50%" cy="40%" r="65%">
      <stop offset="0%" stopColor="#1f5a74" />
      <stop offset="55%" stopColor="#0e2d40" />
      <stop offset="100%" stopColor="#06121d" />
    </radialGradient>
    <pattern id={`grid-${id}`} patternUnits="userSpaceOnUse" width="5" height="5">
      <rect width="5" height="5" fill="#4ce8e6" />
      <rect x="4" width="1" height="5" fill="#072028" opacity="0.55" />
      <rect y="4" width="5" height="1" fill="#072028" opacity="0.55" />
    </pattern>
    <linearGradient id={`helmet-${id}`} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#f6f7fb" />
      <stop offset="55%" stopColor="#d2d6e2" />
      <stop offset="100%" stopColor="#9097ab" />
    </linearGradient>
    <linearGradient id={`metal-${id}`} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#7a809a" />
      <stop offset="100%" stopColor="#2c2f42" />
    </linearGradient>
    <linearGradient id={`magenta-${id}`} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#f06aff" />
      <stop offset="100%" stopColor="#8a1ca6" />
    </linearGradient>
    <radialGradient id={`button-${id}`} cx="35%" cy="30%" r="80%">
      <stop offset="0%" stopColor="#bdfffd" />
      <stop offset="55%" stopColor="#4ce8e6" />
      <stop offset="100%" stopColor="#1d8e8c" />
    </radialGradient>
    <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

const HelmetHardware = ({ id }) => (
  <g>
    <g>
      <ellipse cx="82" cy="248" rx="30" ry="44" fill={`url(#metal-${id})`} stroke="#444859" strokeWidth="2.5" />
      <ellipse cx="90" cy="248" rx="22" ry="34" fill={`url(#magenta-${id})`} />
      <ellipse cx="94" cy="248" rx="12" ry="22" fill="#4a126b" />
      <circle cx="94" cy="248" r="4" fill="#4ce8e6" opacity="0.85" />
    </g>
    <g>
      <ellipse cx="418" cy="248" rx="30" ry="44" fill={`url(#metal-${id})`} stroke="#444859" strokeWidth="2.5" />
      <ellipse cx="410" cy="248" rx="22" ry="34" fill={`url(#magenta-${id})`} />
      <ellipse cx="406" cy="248" rx="12" ry="22" fill="#4a126b" />
      <circle cx="406" cy="248" r="4" fill="#4ce8e6" opacity="0.85" />
    </g>
  </g>
);

const VisorFace = ({ id, mouthVariant = "cat" }) => (
  <g>
    <path
      d="M 168 218 Q 180 213 232 250 L 232 278 Q 200 290 175 278 Q 158 250 168 218 Z"
      fill={`url(#grid-${id})`}
      stroke="#4ce8e6"
      strokeWidth="1.5"
      filter={`url(#glow-${id})`}
    />
    <path
      d="M 332 218 Q 320 213 268 250 L 268 278 Q 300 290 325 278 Q 342 250 332 218 Z"
      fill={`url(#grid-${id})`}
      stroke="#4ce8e6"
      strokeWidth="1.5"
      filter={`url(#glow-${id})`}
    />
    {mouthVariant === "cat" && (
      <path
        d="M 218 298 L 233 314 L 250 305 L 267 314 L 282 298 L 274 322 Q 250 338 226 322 Z"
        fill={`url(#grid-${id})`}
        stroke="#4ce8e6"
        strokeWidth="1.2"
        filter={`url(#glow-${id})`}
      />
    )}
    {mouthVariant === "fang" && (
      <g fill={`url(#grid-${id})`} stroke="#4ce8e6" strokeWidth="1.2" filter={`url(#glow-${id})`}>
        <path d="M 218 300 L 282 300 L 274 320 L 266 312 L 258 322 L 250 312 L 242 322 L 234 312 L 226 320 Z" />
      </g>
    )}
    {mouthVariant === "beak" && (
      <g>
        <path
          d="M 230 302 L 270 302 L 264 314 L 258 308 L 250 318 L 242 308 L 236 314 Z"
          fill={`url(#grid-${id})`}
          stroke="#4ce8e6"
          strokeWidth="1.2"
          filter={`url(#glow-${id})`}
        />
        <path d="M 235 332 L 250 358 L 265 332 Z" fill="#e9a23b" stroke="#7a4a00" strokeWidth="1.6" />
        <path d="M 245 332 L 250 352 L 255 332 Z" fill="#7a4a00" opacity="0.55" />
      </g>
    )}
    {mouthVariant === "snarl" && (
      <path
        d="M 215 300 Q 250 322 285 300 L 280 318 Q 268 330 250 332 Q 232 330 220 318 Z M 240 318 L 244 326 L 248 318 M 252 318 L 256 326 L 260 318"
        fill={`url(#grid-${id})`}
        stroke="#4ce8e6"
        strokeWidth="1.2"
        fillRule="evenodd"
        filter={`url(#glow-${id})`}
      />
    )}
    {mouthVariant === "wolf" && (
      <path
        d="M 215 298 L 285 298 L 278 316 L 268 308 L 260 322 L 250 308 L 240 322 L 232 308 L 222 316 Z"
        fill={`url(#grid-${id})`}
        stroke="#4ce8e6"
        strokeWidth="1.2"
        filter={`url(#glow-${id})`}
      />
    )}
  </g>
);

const Body = ({ id, stocky = false }) => {
  const w = stocky ? 90 : 75;
  return (
    <g>
      <path
        d={`M ${250 - w - 10} 385
           Q ${250 - w - 18} 480 ${250 - w + 22} 540
           Q 220 595 250 595
           Q 280 595 ${250 + w - 22} 540
           Q ${250 + w + 18} 480 ${250 + w + 10} 385 Z`}
        fill="#f6f7fb"
        stroke="#9097ab"
        strokeWidth="3"
      />
      <g>
        <circle cx="135" cy="412" r="46" fill={`url(#metal-${id})`} stroke="#444859" strokeWidth="3" />
        <circle cx="135" cy="412" r="33" fill="#1a1d2e" />
        <circle cx="135" cy="412" r="9" fill={`url(#button-${id})`} />
        <circle cx="135" cy="412" r="3" fill="#dffefe" />
      </g>
      <g>
        <circle cx="365" cy="412" r="46" fill={`url(#metal-${id})`} stroke="#444859" strokeWidth="3" />
        <circle cx="365" cy="412" r="33" fill="#1a1d2e" />
        <circle cx="365" cy="412" r="9" fill={`url(#button-${id})`} />
        <circle cx="365" cy="412" r="3" fill="#dffefe" />
      </g>
      <g transform="translate(70, 492)">
        <circle r="64" fill="#1a1d2e" stroke="#444859" strokeWidth="3" />
        <circle r="56" fill="#2a2e44" />
        <circle r="46" fill="none" stroke="#444859" strokeWidth="1.5" opacity="0.6" />
        <circle cx="-18" cy="-28" r="13" fill={`url(#button-${id})`} stroke="#0e3a3a" strokeWidth="1.2" />
        <circle cx="20" cy="-14" r="13" fill={`url(#button-${id})`} stroke="#0e3a3a" strokeWidth="1.2" />
        <circle cx="-24" cy="20" r="13" fill={`url(#button-${id})`} stroke="#0e3a3a" strokeWidth="1.2" />
        <circle cx="18" cy="28" r="13" fill={`url(#button-${id})`} stroke="#0e3a3a" strokeWidth="1.2" />
      </g>
      <g transform="translate(400, 510)">
        <ellipse rx="32" ry="36" fill="#1a1d2e" stroke="#444859" strokeWidth="3" />
        <ellipse rx="26" ry="30" fill="#2a2e44" />
        <circle r="11" fill={`url(#button-${id})`} stroke="#0e3a3a" strokeWidth="1.2" />
        <circle r="3" fill="#dffefe" />
      </g>
      <ellipse cx="222" cy="612" rx="23" ry="20" fill="#f6f7fb" stroke="#9097ab" strokeWidth="3" />
      <ellipse cx="278" cy="612" rx="23" ry="20" fill="#f6f7fb" stroke="#9097ab" strokeWidth="3" />
      <ellipse cx="218" cy="613" rx="3" ry="2.5" fill="#d33fd9" opacity="0.45" />
      <ellipse cx="282" cy="613" rx="3" ry="2.5" fill="#d33fd9" opacity="0.45" />
    </g>
  );
};

const HawkGlyph = ({ color = "#4ce8e6" }) => (
  <g fill={color}>
    <path d="M -22 18 L -14 -28 L -6 12 Z" />
    <path d="M -7 14 L 0 -34 L 7 14 Z" />
    <path d="M 6 12 L 14 -28 L 22 18 Z" />
  </g>
);

const OwlGlyph = ({ color = "#4ce8e6" }) => (
  <g fill={color}>
    <path d="M 0 -28 L 24 -14 L 24 14 L 0 28 L -24 14 L -24 -14 Z" />
    <circle cx="0" cy="0" r="9" fill="#0a1a26" />
  </g>
);

const FoxGlyph = ({ color = "#4ce8e6" }) => (
  <g fill={color}>
    <path d="M 0 -30 L 20 -4 L 8 -4 L 18 18 L 0 4 L -18 18 L -8 -4 L -20 -4 Z" />
  </g>
);

const BearGlyph = ({ color = "#4ce8e6" }) => (
  <g fill={color}>
    <path d="M -22 -16 L 22 -16 L 22 8 Q 0 30 -22 8 Z" />
    <circle cx="-12" cy="-22" r="6" />
    <circle cx="0" cy="-26" r="6" />
    <circle cx="12" cy="-22" r="6" />
  </g>
);

const WolfGlyph = ({ color = "#4ce8e6" }) => (
  <g fill={color}>
    <path d="M -20 -22 Q 14 -28 22 6 Q 14 28 -8 22 Q 6 12 6 -2 Q 6 -16 -20 -22 Z" />
    <path d="M -4 6 L 2 30 L 10 6 Z" />
  </g>
);

const head_hawk = { rx: 168, ry: 158, cy: 235 };
const head_owl = { rx: 182, ry: 152, cy: 240 };
const head_fox = { rx: 162, ry: 162, cy: 235 };
const head_bear = { rx: 192, ry: 158, cy: 240 };
const head_wolf = { rx: 168, ry: 162, cy: 235 };

const HawkEars = () => (
  <g>
    <path d="M 132 142 L 168 48 L 222 152 Z" fill="url(#magenta-hawk)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 378 142 L 332 48 L 278 152 Z" fill="url(#magenta-hawk)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 152 142 L 173 85 L 207 152 Z" fill="#4a126b" />
    <path d="M 348 142 L 327 85 L 293 152 Z" fill="#4a126b" />
  </g>
);

const OwlEars = () => (
  <g>
    <path d="M 120 158 L 110 88 L 156 142 Z" fill="url(#magenta-owl)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 380 158 L 390 88 L 344 142 Z" fill="url(#magenta-owl)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 128 152 L 122 108 L 148 144 Z" fill="#4a126b" />
    <path d="M 372 152 L 378 108 L 352 144 Z" fill="#4a126b" />
    <path d="M 230 116 L 250 78 L 270 116 Z" fill="url(#magenta-owl)" stroke="#5a1170" strokeWidth="2" />
    <path d="M 240 118 L 250 92 L 260 118 Z" fill="#4a126b" />
  </g>
);

const FoxEars = () => (
  <g>
    <path d="M 120 158 L 142 18 L 198 148 Z" fill="url(#magenta-fox)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 380 158 L 358 18 L 302 148 Z" fill="url(#magenta-fox)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 138 150 L 148 60 L 184 146 Z" fill="#4a126b" />
    <path d="M 362 150 L 352 60 L 316 146 Z" fill="#4a126b" />
    <path d="M 148 142 L 152 80 L 175 142 Z" fill="#f6f7fb" opacity="0.85" />
    <path d="M 352 142 L 348 80 L 325 142 Z" fill="#f6f7fb" opacity="0.85" />
  </g>
);

const BearEars = () => (
  <g>
    <circle cx="118" cy="118" r="32" fill="url(#magenta-bear)" stroke="#5a1170" strokeWidth="2.5" />
    <circle cx="382" cy="118" r="32" fill="url(#magenta-bear)" stroke="#5a1170" strokeWidth="2.5" />
    <circle cx="118" cy="122" r="18" fill="#4a126b" />
    <circle cx="382" cy="122" r="18" fill="#4a126b" />
  </g>
);

const WolfEars = () => (
  <g>
    <path d="M 108 156 L 142 50 L 202 150 Z" fill="url(#magenta-wolf)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 392 156 L 358 50 L 298 150 Z" fill="url(#magenta-wolf)" stroke="#5a1170" strokeWidth="2.5" />
    <path d="M 130 152 L 150 86 L 192 148 Z" fill="#4a126b" />
    <path d="M 370 152 L 350 86 L 308 148 Z" fill="#4a126b" />
  </g>
);

const HawkTail = () => (
  <g>
    <path
      d="M 360 478 Q 460 472 472 410 Q 476 360 448 358"
      stroke="#322a3a"
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="448" cy="358" r="9" fill="#4ce8e6" opacity="0.7" />
  </g>
);

const OwlTail = () => (
  <g>
    <path d="M 350 560 L 340 612 L 360 610 Z" fill="#322a3a" />
    <path d="M 365 560 L 365 615 L 385 610 Z" fill="#241e2a" />
    <path d="M 380 558 L 392 612 L 410 600 Z" fill="#322a3a" />
  </g>
);

const FoxTail = () => (
  <g>
    <path
      d="M 355 470 Q 470 470 470 360 Q 470 290 410 290"
      stroke="#322a3a"
      strokeWidth="44"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M 355 470 Q 460 470 462 380"
      stroke="#1a1620"
      strokeWidth="14"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
    <ellipse cx="410" cy="290" rx="22" ry="20" fill="#f6f7fb" stroke="#9097ab" strokeWidth="2" />
  </g>
);

const BearTail = () => (
  <circle cx="358" cy="555" r="14" fill="#322a3a" />
);

const WolfTail = () => (
  <g>
    <path
      d="M 355 478 Q 472 510 478 580 Q 478 612 440 618"
      stroke="#322a3a"
      strokeWidth="34"
      fill="none"
      strokeLinecap="round"
    />
    <ellipse cx="442" cy="618" rx="20" ry="16" fill="#0a0712" stroke="#322a3a" strokeWidth="2" />
  </g>
);

const Mascot = ({ variant }) => {
  const v = variant;
  return (
    <svg className="mascot-svg" viewBox="0 0 500 640" xmlns="http://www.w3.org/2000/svg">
      <MascotDefs id={v.id} />
      {v.tail}
      {v.ears}
      <ellipse
        cx="250"
        cy={v.head.cy}
        rx={v.head.rx}
        ry={v.head.ry}
        fill={`url(#helmet-${v.id})`}
        stroke="#6b7088"
        strokeWidth="3"
      />
      <path
        d={`M ${250 - v.head.rx * 0.7} ${v.head.cy - v.head.ry * 0.55} Q 250 ${v.head.cy - v.head.ry * 0.95} ${250 + v.head.rx * 0.7} ${v.head.cy - v.head.ry * 0.55}`}
        stroke="#a8aec2"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <path
        d={`M ${250 - v.head.rx * 0.75} ${v.head.cy + v.head.ry * 0.55} Q 250 ${v.head.cy + v.head.ry * 1.0} ${250 + v.head.rx * 0.75} ${v.head.cy + v.head.ry * 0.55}`}
        stroke="#6b7088"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      <HelmetHardware id={v.id} />
      <ellipse cx="250" cy="248" rx="134" ry="114" fill={`url(#visor-${v.id})`} />
      <ellipse cx="250" cy="248" rx="134" ry="114" fill={`url(#grid-${v.id})`} opacity="0.05" />
      <path
        d="M 145 200 Q 200 168 270 170"
        stroke="#5fb3c8"
        strokeWidth="3"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />
      <g transform="translate(250, 180) scale(0.45)">
        <v.Glyph color="#6cf3f0" />
      </g>
      <VisorFace id={v.id} mouthVariant={v.mouth} />
      <Body id={v.id} stocky={v.stocky} />
      <g transform="translate(250, 480) scale(1.55)">
        <v.Glyph color="#d33fd9" />
        <g transform="scale(0.55)">
          <v.Glyph color="#4ce8e6" />
        </g>
      </g>
    </svg>
  );
};

const MascotHead = ({ variant }) => {
  const v = variant;
  return (
    <svg
      className="mascot-head"
      viewBox="55 15 390 390"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <MascotDefs id={`head-${v.id}`} />
      <g>
        {v.ears && React.cloneElement(v.ears, { key: 'ears' })}
      </g>
      <ellipse
        cx="250"
        cy={v.head.cy}
        rx={v.head.rx}
        ry={v.head.ry}
        fill={`url(#helmet-head-${v.id})`}
        stroke="#6b7088"
        strokeWidth="3"
      />
      <path
        d={`M ${250 - v.head.rx * 0.7} ${v.head.cy - v.head.ry * 0.55} Q 250 ${v.head.cy - v.head.ry * 0.95} ${250 + v.head.rx * 0.7} ${v.head.cy - v.head.ry * 0.55}`}
        stroke="#a8aec2"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      <HelmetHardware id={`head-${v.id}`} />
      <ellipse cx="250" cy="248" rx="134" ry="114" fill={`url(#visor-head-${v.id})`} />
      <ellipse cx="250" cy="248" rx="134" ry="114" fill={`url(#grid-head-${v.id})`} opacity="0.05" />
      <path
        d="M 145 200 Q 200 168 270 170"
        stroke="#5fb3c8"
        strokeWidth="3"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />
      <g transform="translate(250, 180) scale(0.45)">
        <v.Glyph color="#6cf3f0" />
      </g>
      <VisorFace id={`head-${v.id}`} mouthVariant={v.mouth} />
    </svg>
  );
};

export const MASCOTS = [
  {
    id: "hawk",
    name: "THE HAWK",
    code: "TA-001",
    role: "ASSAULT // AVIAN",
    tagline: "// strikes from above. no warning.",
    head: head_hawk,
    ears: <HawkEars />,
    tail: <HawkTail />,
    mouth: "cat",
    Glyph: HawkGlyph,
    stocky: false,
  },
  {
    id: "owl",
    name: "THE OWL",
    code: "TA-002",
    role: "RECON // AVIAN",
    tagline: "// sees you before you blink.",
    head: head_owl,
    ears: <OwlEars />,
    tail: <OwlTail />,
    mouth: "beak",
    Glyph: OwlGlyph,
    stocky: false,
  },
  {
    id: "wolf",
    name: "THE WOLF",
    code: "TA-003",
    role: "STRIKER // LUPINE",
    tagline: "// hunts in packs of one.",
    head: head_wolf,
    ears: <WolfEars />,
    tail: <WolfTail />,
    mouth: "wolf",
    Glyph: WolfGlyph,
    stocky: false,
  },
  {
    id: "fox",
    name: "THE FOX",
    code: "TA-004",
    role: "FLANK // VULPINE",
    tagline: "// six steps ahead. always.",
    head: head_fox,
    ears: <FoxEars />,
    tail: <FoxTail />,
    mouth: "fang",
    Glyph: FoxGlyph,
    stocky: false,
  },
  {
    id: "bear",
    name: "THE BEAR",
    code: "TA-005",
    role: "TANK // URSINE",
    tagline: "// the wall that hits back.",
    head: head_bear,
    ears: <BearEars />,
    tail: <BearTail />,
    mouth: "snarl",
    Glyph: BearGlyph,
    stocky: true,
  },
];

export const getAgentAvatar = (idx) => {
  if (idx < 0 || idx >= MASCOTS.length) return null;
  return <Mascot variant={MASCOTS[idx]} />;
};

export const getAgentHead = (idx) => {
  if (idx < 0 || idx >= MASCOTS.length) return null;
  return <MascotHead variant={MASCOTS[idx]} />;
};

export const getAgentMeta = (idx) => {
  if (idx < 0 || idx >= MASCOTS.length) return null;
  return MASCOTS[idx];
};

export default getAgentAvatar;