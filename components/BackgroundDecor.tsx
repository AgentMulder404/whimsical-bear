// Decorative background layer. Trees are aria-hidden; the duck is interactive
// (click to reveal the birthday easter egg).
import DuckEasterEgg from './DuckEasterEgg'

export default function BackgroundDecor() {
  return (
    <>
      {/* ── Left tree group ──────────────────────────────────────────────── */}
      <div
        className="absolute inset-y-0 left-0 w-24 sm:w-32 md:w-44 overflow-hidden pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <LeftTrees />
      </div>

      {/* ── Right tree group ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-y-0 right-0 w-24 sm:w-32 md:w-44 overflow-hidden pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <RightTrees />
      </div>

      {/* ── Duck easter egg — clickable, left side mid-page ──────────────── */}
      <div
        className="absolute left-0 sm:left-2 md:left-4 top-[50%] -translate-y-1/2 w-16 sm:w-20 md:w-24 hidden sm:block select-none z-[5]"
      >
        <DuckEasterEgg />
      </div>
    </>
  )
}

/* ── Left trees ──────────────────────────────────────────────────────────────
   Two overlapping woodland trees. The back tree is partially clipped by the
   left screen edge. A branch with hanging moss extends from the front tree.
   ──────────────────────────────────────────────────────────────────────────── */
function LeftTrees() {
  return (
    <svg
      viewBox="0 0 180 900"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* ── Back tree (partially off left edge) ── */}
      <ellipse cx="5"   cy="260" rx="75" ry="92" fill="#355E3B" opacity="0.80"/>
      <ellipse cx="-14" cy="288" rx="58" ry="72" fill="#40826D" opacity="0.54"/>
      <ellipse cx="22"  cy="238" rx="46" ry="58" fill="#5F8575" opacity="0.25"/>
      <path d="M -2 900 C -6 780 -10 640 4 480 L 28 480 C 42 640 40 780 36 900 Z" fill="#6F4E37"/>

      {/* ── Front tree ── */}
      <ellipse cx="118" cy="178" rx="90" ry="108" fill="#355E3B" opacity="0.91"/>
      <ellipse cx="96"  cy="210" rx="75" ry="88"  fill="#40826D" opacity="0.52"/>
      <ellipse cx="140" cy="158" rx="60" ry="72"  fill="#5F8575" opacity="0.26"/>
      {/* Lichen light catch at canopy top */}
      <ellipse cx="112" cy="152" rx="34" ry="22"  fill="#C9CC3F" opacity="0.08"/>

      {/* Front tree trunk */}
      <path d="M 88 900 C 83 770 78 620 93 355 L 122 355 C 136 620 133 770 127 900 Z" fill="#7B3F00"/>
      {/* Bark texture */}
      <path d="M 98 490 C 104 477 108 483 106 500" stroke="#6F4E37" strokeWidth="2" fill="none" opacity="0.36"/>
      <path d="M 108 645 C 114 632 118 637 116 655" stroke="#6F4E37" strokeWidth="2" fill="none" opacity="0.36"/>
      {/* Knothole */}
      <ellipse cx="100" cy="435" rx="9" ry="7"   fill="#2e1600" opacity="0.58"/>
      <ellipse cx="100" cy="435" rx="6" ry="4.5" fill="#1a0d00" opacity="0.42"/>

      {/* Branch extending left */}
      <path d="M 90 350 C 68 333 40 325 14 331" stroke="#7B3F00" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M 90 350 C 68 333 40 325 14 331" stroke="#6F4E37" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.45"/>
      {/* Small right-side branch stub */}
      <path d="M 120 336 C 142 321 157 317 164 322" stroke="#7B3F00" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* Hanging moss strands */}
      <path d="M 20 333 C 18 352 16 370 18 388" stroke="#355E3B" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.46"/>
      <path d="M 34 330 C 32 350 30 368 32 386" stroke="#40826D" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.38"/>
      <path d="M 50 328 C 48 348 47 365 49 382" stroke="#355E3B" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.40"/>
      <path d="M 64 326 C 63 344 62 360 64 376" stroke="#40826D" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.32"/>

      {/* ── Ground — mushrooms, grass, leaves ── */}
      <ellipse cx="30"  cy="892" rx="28" ry="8"  fill="#355E3B" opacity="0.16"/>
      <ellipse cx="130" cy="890" rx="22" ry="6"  fill="#40826D" opacity="0.14"/>

      {/* Large mushroom */}
      <rect    x="48"  y="870" width="10" height="24" rx="4"  fill="#E9DCC9"/>
      <ellipse cx="53" cy="871" rx="20"  ry="12"               fill="#954535"/>
      <circle  cx="47" cy="868" r="3"                           fill="#FAF9F6" opacity="0.48"/>
      <circle  cx="58" cy="866" r="2"                           fill="#FAF9F6" opacity="0.48"/>
      {/* Small mushroom */}
      <rect    x="136" y="877" width="7" height="17" rx="3"  fill="#E9DCC9"/>
      <ellipse cx="139" cy="878" rx="13" ry="9"               fill="#CC7722" opacity="0.82"/>
      <circle  cx="136" cy="876" r="2"                         fill="#FAF9F6" opacity="0.42"/>
      {/* Tiny mushroom */}
      <rect    x="70"  y="882" width="5" height="13" rx="2"  fill="#E9DCC9" opacity="0.80"/>
      <ellipse cx="72" cy="883" rx="9"   ry="7"               fill="#954535" opacity="0.58"/>

      {/* Grass tufts */}
      <path d="M 18 892 C 16 878 20 874 23 882 M 24 892 C 24 877 28 873 30 881"
        stroke="#40826D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 150 888 C 148 874 152 870 155 878 M 156 888 C 156 873 160 869 162 877"
        stroke="#355E3B" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* Fallen leaves */}
      <ellipse cx="76"  cy="889" rx="7"   ry="4.5" fill="#C9CC3F" opacity="0.46" transform="rotate(-22 76 889)"/>
      <ellipse cx="158" cy="883" rx="5.5" ry="3.5" fill="#CC7722" opacity="0.40" transform="rotate(16 158 883)"/>

      {/* Firefly motes */}
      <circle cx="148" cy="465" r="2.5" fill="#8A9AFB" opacity="0.20"/>
      <circle cx="148" cy="465" r="5"   fill="#8A9AFB" opacity="0.07"/>
      <circle cx="54"  cy="595" r="2"   fill="#96DED1" opacity="0.17"/>
      <circle cx="54"  cy="595" r="4"   fill="#96DED1" opacity="0.06"/>
      <circle cx="165" cy="700" r="1.8" fill="#8A9AFB" opacity="0.15"/>
    </svg>
  )
}

/* ── Right trees ─────────────────────────────────────────────────────────────
   Intentionally different arrangement from left — slightly taller front tree,
   branch extends toward the right (screen) edge.
   ──────────────────────────────────────────────────────────────────────────── */
function RightTrees() {
  return (
    <svg
      viewBox="0 0 180 900"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* ── Front tree (left side of this SVG, faces toward content) ── */}
      <ellipse cx="62"  cy="172" rx="90" ry="108" fill="#355E3B" opacity="0.90"/>
      <ellipse cx="82"  cy="204" rx="75" ry="88"  fill="#40826D" opacity="0.50"/>
      <ellipse cx="44"  cy="152" rx="60" ry="72"  fill="#5F8575" opacity="0.25"/>
      <ellipse cx="66"  cy="148" rx="34" ry="22"  fill="#C9CC3F" opacity="0.07"/>

      {/* Front tree trunk */}
      <path d="M 46 900 C 41 770 37 620 52 355 L 80 355 C 95 620 92 770 87 900 Z" fill="#7B3F00"/>
      {/* Bark texture */}
      <path d="M 56 492 C 62 479 66 485 64 502" stroke="#6F4E37" strokeWidth="2" fill="none" opacity="0.36"/>
      <path d="M 66 648 C 72 635 76 640 74 658" stroke="#6F4E37" strokeWidth="2" fill="none" opacity="0.36"/>
      {/* Knothole */}
      <ellipse cx="74" cy="438" rx="9" ry="7"   fill="#2e1600" opacity="0.56"/>
      <ellipse cx="74" cy="438" rx="6" ry="4.5" fill="#1a0d00" opacity="0.42"/>

      {/* Branch extending right (toward screen edge) */}
      <path d="M 78 350 C 100 333 128 325 154 331" stroke="#7B3F00" strokeWidth="9" fill="none" strokeLinecap="round"/>
      <path d="M 78 350 C 100 333 128 325 154 331" stroke="#6F4E37" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.45"/>
      {/* Small left branch stub */}
      <path d="M 54 337 C 34 322 18 318 10 324" stroke="#7B3F00" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* Hanging moss */}
      <path d="M 128 333 C 126 352 124 370 126 388" stroke="#355E3B" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.44"/>
      <path d="M 142 330 C 140 350 138 368 140 386" stroke="#40826D" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.36"/>
      <path d="M 156 328 C 154 348 153 365 155 382" stroke="#355E3B" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.38"/>

      {/* ── Back tree (right edge, partially off screen) ── */}
      <ellipse cx="172" cy="255" rx="72" ry="88" fill="#355E3B" opacity="0.79"/>
      <ellipse cx="192" cy="282" rx="56" ry="70" fill="#40826D" opacity="0.52"/>
      <ellipse cx="160" cy="238" rx="45" ry="57" fill="#5F8575" opacity="0.24"/>
      <path d="M 152 900 C 148 780 144 640 158 480 L 182 480 C 196 640 194 780 190 900 Z" fill="#6F4E37"/>

      {/* ── Ground ── */}
      <ellipse cx="80"  cy="892" rx="28" ry="8"  fill="#355E3B" opacity="0.15"/>
      <ellipse cx="155" cy="888" rx="22" ry="6"  fill="#40826D" opacity="0.14"/>

      {/* Large mushroom */}
      <rect    x="100" y="870" width="10" height="24" rx="4"  fill="#E9DCC9"/>
      <ellipse cx="105" cy="871" rx="20"  ry="12"               fill="#954535"/>
      <circle  cx="99"  cy="868" r="3"                           fill="#FAF9F6" opacity="0.48"/>
      <circle  cx="110" cy="866" r="2"                           fill="#FAF9F6" opacity="0.48"/>
      {/* Small mushroom */}
      <rect    x="28"  y="878" width="7" height="17" rx="3"  fill="#E9DCC9"/>
      <ellipse cx="31" cy="879" rx="13"  ry="9"               fill="#CC7722" opacity="0.82"/>
      {/* Tiny mushroom */}
      <rect    x="164" y="883" width="5" height="13" rx="2"  fill="#E9DCC9" opacity="0.78"/>
      <ellipse cx="166" cy="884" rx="9"  ry="7"               fill="#954535" opacity="0.56"/>

      {/* Grass tufts */}
      <path d="M 14 892 C 12 878 16 874 19 882 M 20 892 C 20 877 24 873 26 881"
        stroke="#40826D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 148 888 C 146 874 150 870 153 878 M 154 888 C 154 873 158 869 160 877"
        stroke="#355E3B" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* Fallen leaves */}
      <ellipse cx="50"  cy="889" rx="7"   ry="4.5" fill="#C9CC3F" opacity="0.44" transform="rotate(20 50 889)"/>
      <ellipse cx="120" cy="883" rx="5.5" ry="3.5" fill="#954535" opacity="0.38" transform="rotate(-15 120 883)"/>

      {/* Firefly motes */}
      <circle cx="32"  cy="462" r="2.5" fill="#8A9AFB" opacity="0.20"/>
      <circle cx="32"  cy="462" r="5"   fill="#8A9AFB" opacity="0.07"/>
      <circle cx="124" cy="588" r="2"   fill="#96DED1" opacity="0.17"/>
      <circle cx="124" cy="588" r="4"   fill="#96DED1" opacity="0.06"/>
      <circle cx="18"  cy="698" r="1.8" fill="#8A9AFB" opacity="0.14"/>
    </svg>
  )
}

