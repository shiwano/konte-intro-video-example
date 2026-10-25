/** October 2026, Monday first: the 1st falls on a Thursday. The entry deadline, Sunday the 25th, is circled. */
const LEAD = 3;
const DAYS = 31;
const DEADLINE = 25;
const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const INK = "#2e2747";
const VIOLET = "#8a6ee0";
const MARKER = "#6d4fd8";
const RED = "#e2483d";

function Cross({ x, y, w, h, s }: { x: number; y: number; w: number; h: number; s: number }) {
  const [l, r, t, b] = [x + w * 0.44, x + w * 0.9, y + h * 0.4, y + h * 0.9];
  return (
    <g stroke={MARKER} strokeWidth={10 * s} strokeLinecap="round" fill="none" opacity={0.92}>
      <path d={`M${l} ${t} Q${(l + r) / 2 + w * 0.02} ${(t + b) / 2 - h * 0.02} ${r} ${b}`} />
      <path d={`M${r - w * 0.02} ${t + h * 0.02} Q${(l + r) / 2} ${(t + b) / 2 + h * 0.02} ${l + w * 0.02} ${b - h * 0.01}`} />
    </g>
  );
}

/** The calendar sheet: the 1st through `crossed` carry a violet X. With `inkAfter`, only the crosses after that day. */
function Sheet({ w, h, crossed, s, inkAfter }: { w: number; h: number; crossed: number; s: number; inkAfter?: number }) {
  const head = h * 0.15;
  const days = h * 0.07;
  const cw = w / 7;
  const ch = (h - head - days) / 5;
  const cells = Array.from({ length: 35 }, (_, i) => {
    const day = i - LEAD + 1;
    const col = i % 7;
    const row = Math.floor(i / 7);
    return { day, col, x: col * cw, y: head + days + row * ch };
  });
  if (inkAfter !== undefined) {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        {cells
          .filter((c) => c.day > inkAfter && c.day <= crossed)
          .map((c) => (
            <Cross x={c.x} y={c.y} w={cw} h={ch} s={s} />
          ))}
      </svg>
    );
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <rect x={0} y={0} width={w} height={h} fill="#fffdf8" />
      <rect x={6 * cw} y={head} width={cw} height={h - head} fill="#fde6ec" />
      <rect x={0} y={0} width={w} height={head} fill={VIOLET} />
      <text x={w / 2} y={head * 0.66} textAnchor="middle" fill="#fff" fontFamily="Nunito" fontWeight={900} fontSize={head * 0.48} letterSpacing={head * 0.06}>
        OCTOBER 2026
      </text>
      {WEEKDAYS.map((d, i) => (
        <text x={i * cw + cw / 2} y={head + days * 0.7} textAnchor="middle" fill={i === 6 ? RED : "#7d7596"} fontFamily="Nunito" fontWeight={800} fontSize={days * 0.55}>
          {d}
        </text>
      ))}
      {cells.map((c) => (
        <rect x={c.x} y={c.y} width={cw} height={ch} fill="none" stroke="#d4cde4" strokeWidth={2 * s} />
      ))}
      {cells
        .filter((c) => c.day >= 1 && c.day <= DAYS)
        .map((c) => (
          <text x={c.x + cw * 0.1} y={c.y + ch * 0.36} fill={c.col === 6 ? RED : INK} fontFamily="Nunito" fontWeight={800} fontSize={ch * 0.28}>
            {c.day}
          </text>
        ))}
      {cells
        .filter((c) => c.day === DEADLINE)
        .map((c) => (
          <ellipse cx={c.x + cw * 0.27} cy={c.y + ch * 0.26} rx={cw * 0.3} ry={ch * 0.24} fill="none" stroke={RED} strokeWidth={7 * s} transform={`rotate(-8 ${c.x + cw * 0.27} ${c.y + ch * 0.26})`} />
        ))}
      {cells
        .filter((c) => c.day >= 1 && c.day <= crossed)
        .map((c) => (
          <Cross x={c.x} y={c.y} w={cw} h={ch} s={s} />
        ))}
      <rect x={0} y={0} width={w} height={h} fill="none" stroke={INK} strokeWidth={5 * s} />
    </svg>
  );
}

/** The violet crosses from the day after `after` through `crossed`, on a clear ground, registered to an `insert` calendar. */
export function CalendarInk({ width, height, after, crossed }: { width: number; height: number; after: number; crossed: number }) {
  return (
    <div style={{ position: "absolute", left: -width * 0.02, top: -height * 0.03, width: width * 1.04, height: height * 1.08 }}>
      <Sheet w={width * 1.04} h={height * 1.08} crossed={crossed} s={width / 1280} inkAfter={after} />
    </div>
  );
}

/**
 * `prop`: the whole calendar hanging on a pale wall, for the roster sheet. `insert`: its date grid filling a
 * 16:9 frame, as the close shots see it, soft daylight falling from the left.
 */
export function Calendar({ width, height, mode, crossed }: { width: number; height: number; mode: "prop" | "insert"; crossed: number }) {
  const s = width / 1280;
  if (mode === "insert") {
    return (
      <div style={{ position: "relative", width, height, overflow: "hidden", background: "#fffdf8" }}>
        <div style={{ position: "absolute", left: -width * 0.02, top: -height * 0.03, width: width * 1.04, height: height * 1.08 }}>
          <Sheet w={width * 1.04} h={height * 1.08} crossed={crossed} s={s} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 45%, rgba(70,60,130,.10) 100%)" }} />
      </div>
    );
  }
  const w = width * 0.56;
  const h = w * 1.12;
  return (
    <div style={{ position: "relative", width, height, background: "#f3f0ea", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: w, height: h, boxShadow: `0 ${10 * s}px ${30 * s}px rgba(60,50,110,.18)` }}>
        <div style={{ position: "absolute", left: "50%", top: -26 * s, width: 34 * s, height: 34 * s, marginLeft: -17 * s, borderRadius: "50%", border: `${5 * s}px solid ${INK}`, background: "#f3f0ea" }} />
        <Sheet w={w} h={h} crossed={crossed} s={s} />
      </div>
    </div>
  );
}

/** Where a calendar hangs in a frame, in fractions of the canvas: its sheet's left, top, width and height. */
export type CalendarRect = { x: number; y: number; w: number; h: number };

/**
 * The calendar hanging on the wall at `rect`, laid over a frame whose own calendar it replaces; `night`
 * dims it to the room's lamplight. `inkAfter` draws only the crosses after that day, over a calendar
 * already showing the ones before. `clip` is a CSS clip-path that leaves the frame's foreground in front of it.
 */
export function WallCalendar({ width, height, rect, crossed, night, inkAfter, clip }: { width: number; height: number; rect: CalendarRect; crossed: number; night?: boolean; inkAfter?: number; clip?: string }) {
  const w = rect.w * width;
  const h = rect.h * height;
  const s = w / 720;
  return (
    <div style={{ position: "absolute", left: rect.x * width, top: rect.y * height, width: w, height: h, clipPath: clip ?? "none" }}>
      {inkAfter === undefined && (
        <svg style={{ position: "absolute", left: w * 0.33, top: -h * 0.1, width: w * 0.34, height: h * 0.11, overflow: "visible" }} viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M8 30 L50 4 L92 30" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={50} cy={4} r={4} fill={INK} />
        </svg>
      )}
      <div style={{ position: "absolute", inset: 0, boxShadow: inkAfter === undefined ? `${3 * s}px ${6 * s}px ${14 * s}px rgba(60,50,110,.22)` : "none" }}>
        <Sheet w={w} h={h} crossed={crossed} s={Math.max(s, 0.25)} inkAfter={inkAfter} />
      </div>
      {night && <div style={{ position: "absolute", inset: 0, background: "rgba(16,20,56,.55)" }} />}
    </div>
  );
}
