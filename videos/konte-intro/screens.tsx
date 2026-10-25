import { Animate, Image, type MediaAsset } from "konte";
import { ClaudeCode, Choice, Line, Prompt, terminalScript } from "./ui/claude-code";
import type { ShotCardData, TimelineClip, TimelineRow, TimelineShot } from "./ui/review-ui";

type Img = MediaAsset<"image">;

/** The size every review-screen still is rendered at: twice the canvas, so text stays crisp. */
export const SCREEN = { width: 2496, height: 1408 };

export const CWD = "~/films/paper-whale";

// ───────────────────────── the in-story film: The Paper Whale, 80 shots ─────────────────────────

const FILM_ACTIONS = [
  "Rain streams down the slate-blue rooftops of the harbour town.",
  "The girl in the yellow raincoat looks up from under her green umbrella.",
  "A huge whale folded from paper drifts out of the clouds.",
  "The paper whale glides low over the chimneys, rain beading on its fins.",
  "The whale tips its head down toward the girl in the street.",
  "Lamplight spills from every window onto the wet cobblestones.",
  "The girl raises one hand toward the whale's great paper fin.",
  "The paper whale turns out over the harbour as the rain thins.",
];
const FILM_DURATIONS = [4, 5.5, 3, 6, 4.5, 3.5, 5, 4];

export const FILM_IDS = Array.from({ length: 80 }, (_, i) => String(i + 1).padStart(2, "0"));
const filmDuration = (i: number) => FILM_DURATIONS[i % FILM_DURATIONS.length]!;
const filmStart = (i: number) => FILM_IDS.slice(0, i).reduce((a, _, k) => a + filmDuration(k), 0);
export const FILM_TOTAL = filmStart(80);

export const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, "0")}`;

/** Shot cards for the review page's shot column; the first `accepted` shots are accepted. */
export function filmCards(accepted: number, extra: Record<string, Partial<ShotCardData>> = {}): ShotCardData[] {
  return FILM_IDS.map((id, i) => ({
    id,
    action: FILM_ACTIONS[i % FILM_ACTIONS.length]!,
    accepted: i < accepted,
    ...extra[id],
  }));
}

export function filmTimeline(stage: "animatic" | "video", accepted: number, selected: string, extra: Partial<TimelineShot> = {}, clip: Partial<TimelineClip> = {}) {
  const shots: TimelineShot[] = FILM_IDS.map((id, i) => ({
    id,
    duration: filmDuration(i),
    accepted: i < accepted,
    ...(id === selected ? extra : {}),
  }));
  const rows: TimelineRow[] =
    stage === "animatic"
      ? [
          {
            label: "Image",
            icon: "image",
            clips: FILM_IDS.map((id, i) => ({
              label: "key",
              start: filmStart(i),
              end: filmStart(i) + filmDuration(i),
              kind: "image",
              takes: 1,
              accepted: i < accepted || undefined,
              ...(id === selected ? clip : {}),
            })),
          },
        ]
      : [
          {
            label: "Video",
            icon: "film",
            clips: FILM_IDS.map((id, i) => ({
              label: "motion",
              start: filmStart(i),
              end: filmStart(i) + filmDuration(i),
              kind: "video",
              takes: 1,
              accepted: i < accepted || undefined,
              ...(id === selected ? clip : {}),
            })),
          },
          { label: "Audio", icon: "speaker", clips: [{ label: "bgm", start: 0, end: FILM_TOTAL, kind: "audio", accepted: true }] },
        ];
  const i = FILM_IDS.indexOf(selected);
  const at = filmStart(i);
  return { shots, rows, playhead: at + 1, selected, view: [Math.max(at - 14, 0), at + 16] as [number, number] };
}

export const filmTime = (id: string) => fmt(filmStart(FILM_IDS.indexOf(id)) + 1);

// ───────────────────────── composition pieces ─────────────────────────

/**
 * A review-screen still filling the canvas, with `next` dissolving over it at `at` seconds and each of
 * `steps` after it at its own `at`. `focus` is where the camera pushes in, `[x, y, scale]` in fractions of
 * the canvas; `children` (a `Pointer`) move with it.
 */
export function Screen({
  src,
  next,
  at,
  steps = [],
  fade = 0.2,
  focus,
  children,
}: {
  src: Img;
  next?: Img;
  at?: number;
  steps?: { src: Img; at: number }[];
  fade?: number;
  focus?: [number, number, number];
  children?: any;
}) {
  const [fx, fy, fs] = focus ?? [0.5, 0.5, 1];
  const all = [...(next ? [{ src: next, at: at ?? 1 }] : []), ...steps];
  return (
    <>
      <div className="screen-wrap" style={{ position: "absolute", inset: 0, transformOrigin: `${fx * 100}% ${fy * 100}%`, transform: `scale(${fs})` }}>
        <Image src={src} fill />
        {all.map((s, i) => (
          <div data-step={i} style={{ position: "absolute", inset: 0, opacity: 0 }}>
            <Image src={s.src} fill />
          </div>
        ))}
        {children}
      </div>
      <Animate
        data={{ ats: all.map((s) => s.at), fs, fade }}
        script={({ timeline, data }) => {
          timeline.to(".screen-wrap", { scale: data.fs * 1.06, duration: 6, ease: "none" }, 0);
          data.ats.forEach((t, i) => timeline.to(`[data-step="${i}"]`, { opacity: 1, duration: data.fade, ease: "power2.out" }, t));
        }}
      />
    </>
  );
}

/**
 * The story's clock in the lower left, a weekday and a time: the first of `stamps` appears at its `at`, and
 * each later one replaces it at its own `at`.
 */
export function Stamp({ stamps }: { stamps: { text: string; at: number }[] }) {
  return (
    <>
      <div
        className="stamp"
        style={{
          position: "absolute",
          left: "3vmax",
          bottom: "3vmax",
          display: "flex",
          alignItems: "center",
          gap: "0.7vmax",
          padding: "0.5vmax 1.2vmax 0.5vmax 0.8vmax",
          borderRadius: "0.6vmax",
          background: "rgba(255,255,255,.94)",
          color: "#5b3fd1",
          fontWeight: 800,
          fontSize: "2.2vmax",
          letterSpacing: "0.02em",
          boxShadow: "0 0.4vmax 1.2vmax rgba(60,30,140,.3)",
        }}
      >
        <svg viewBox="0 0 40 40" style={{ width: "2.2vmax", height: "2.2vmax" }}>
          <circle cx={20} cy={20} r={17} fill="none" stroke="#5b3fd1" strokeWidth={3.5} />
          <path d="M20 9 V20 L27 24" fill="none" stroke="#5b3fd1" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ position: "relative" }}>
          {stamps.map((st, i) => (
            <div data-stamp={i} style={{ position: i === 0 ? "relative" : "absolute", left: 0, top: 0, whiteSpace: "nowrap", opacity: i === 0 ? 1 : 0 }}>
              {st.text}
            </div>
          ))}
        </div>
      </div>
      <Animate
        data={{ ats: stamps.map((st) => st.at) }}
        script={({ timeline, data }) => {
          timeline.from(".stamp", { y: 20, opacity: 0, duration: 0.35, ease: "back.out(1.4)" }, data.ats[0]);
          data.ats.slice(1).forEach((t, k) => {
            timeline.to(`[data-stamp="${k}"]`, { opacity: 0, y: -12, duration: 0.2, ease: "power2.in" }, t);
            timeline.fromTo(`[data-stamp="${k + 1}"]`, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, t + 0.1);
          });
        }}
      />
    </>
  );
}

/** A mouse pointer gliding from one spot to another (fractions of the canvas) and clicking at `click`. */
/** A click highlight at `at` (fractions of the canvas): a flash of light under the pointer and two rings spreading from it. */
function ClickBurst({ cls, at }: { cls: string; at: [number, number] }) {
  const ring = (border: string, glow: string) => ({
    position: "absolute" as const,
    left: "-3vmax",
    top: "-3vmax",
    width: "6vmax",
    height: "6vmax",
    borderRadius: "50%",
    border,
    boxShadow: glow,
  });
  return (
    <div className={cls} style={{ position: "absolute", left: `${at[0] * 100}%`, top: `${at[1] * 100}%`, width: 0, height: 0, opacity: 0, zIndex: 30, pointerEvents: "none" }}>
      <div className="burst-dot" style={{ position: "absolute", left: "-1.3vmax", top: "-1.3vmax", width: "2.6vmax", height: "2.6vmax", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(169,159,255,.7) 45%, rgba(123,92,255,0) 72%)" }} />
      <div className="burst-ring" style={ring("0.32vmax solid rgba(255,255,255,.97)", "0 0 1.2vmax rgba(169,159,255,.95), inset 0 0 0.9vmax rgba(169,159,255,.7)")} />
      <div className="burst-ring2" style={ring("0.2vmax solid rgba(169,159,255,.95)", "0 0 0.9vmax rgba(123,92,255,.8)")} />
    </div>
  );
}

export function Pointer({
  from,
  to,
  move,
  click,
  second,
}: {
  from: [number, number];
  to: [number, number];
  move: number;
  click?: number;
  second?: { to: [number, number]; at: number; move: number; click?: number };
}) {
  return (
    <>
      {click !== undefined && <ClickBurst cls="click-burst" at={to} />}
      {second?.click !== undefined && <ClickBurst cls="click-burst-2" at={second.to} />}
      <svg
        className="pointer"
        viewBox="0 0 24 24"
        style={{ position: "absolute", left: `${from[0] * 100}%`, top: `${from[1] * 100}%`, width: "2.4vmax", height: "2.4vmax", zIndex: 31, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))" }}
      >
        <path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.6 14 L18 14 Z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <Animate
        data={{
          dx: to[0] - from[0],
          dy: to[1] - from[1],
          move,
          click: click ?? -1,
          second: second ? { dx: second.to[0] - from[0], dy: second.to[1] - from[1], at: second.at, move: second.move, click: second.click ?? -1 } : null,
        }}
        script={({ timeline, data }) => {
          const el = document.querySelector(".pointer") as HTMLElement;
          const w = el.parentElement!.clientWidth;
          const h = el.parentElement!.clientHeight;
          const press = (at: number, cls: string) => {
            timeline.to(".pointer", { scale: 0.82, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.out" }, at);
            timeline.set(cls, { opacity: 1 }, at);
            timeline.fromTo(`${cls} .burst-dot`, { scale: 0.4, opacity: 1 }, { scale: 1.3, opacity: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, at);
            timeline.fromTo(`${cls} .burst-ring`, { scale: 0.25, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.5, ease: "expo.out", immediateRender: false }, at);
            timeline.fromTo(`${cls} .burst-ring2`, { scale: 0.25, opacity: 0.9 }, { scale: 2.2, opacity: 0, duration: 0.6, ease: "expo.out", immediateRender: false }, at + 0.08);
            timeline.set(cls, { opacity: 0 }, at + 0.7);
          };
          timeline.to(".pointer", { x: data.dx * w, y: data.dy * h, duration: data.move, ease: "power2.inOut" }, 0.1);
          if (data.click >= 0) press(data.click, ".click-burst");
          if (data.second) {
            timeline.to(".pointer", { x: data.second.dx * w, y: data.second.dy * h, duration: data.second.move, ease: "power2.inOut" }, data.second.at);
            if (data.second.click >= 0) press(data.second.click, ".click-burst-2");
          }
        }}
      />
    </>
  );
}

/**
 * The review page's inline note box, opened by a click on the frame at `pin` (fractions of the canvas): it
 * appears at `at`, `text` types out from `typeAt` over `dur` at an uneven pace, and it closes at `done`.
 */
export function NoteDraft({ pin, text, at, typeAt, dur, done }: { pin: [number, number]; text: string; at: number; typeAt: number; dur: number; done: number }) {
  return (
    <>
      <div
        className="note-pin"
        style={{
          position: "absolute",
          left: `${pin[0] * 100}%`,
          top: `${pin[1] * 100}%`,
          width: "1.5vmax",
          height: "1.5vmax",
          margin: "-0.75vmax 0 0 -0.75vmax",
          borderRadius: "50%",
          background: "#6e62f5",
          border: "0.15vmax solid #fff",
          color: "#fff",
          font: "700 0.8vmax Inter, system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0.2vmax 0.6vmax rgba(0,0,0,.5)",
        }}
      >
        1
      </div>
      <div
        className="note-draft"
        style={{
          position: "absolute",
          left: `calc(${pin[0] * 100}% + 1.2vmax)`,
          top: `calc(${pin[1] * 100}% + 0.4vmax)`,
          width: "17vmax",
          padding: "0.7vmax 0.85vmax",
          borderRadius: "0.6vmax",
          background: "#1b1b21",
          border: "0.1vmax solid #6e62f5",
          boxShadow: "0 0.8vmax 2vmax rgba(0,0,0,.55)",
          font: "500 0.95vmax Inter, system-ui, sans-serif",
          color: "#ececec",
          display: "flex",
          flexDirection: "column",
          gap: "0.5vmax",
          transformOrigin: "0 0",
        }}
      >
        <div style={{ color: "#8a8a92", fontSize: "0.75vmax", fontWeight: 600, letterSpacing: "0.04em" }}>NOTE · PIN 1</div>
        <div style={{ minHeight: "1.4vmax", padding: "0.45vmax 0.55vmax", borderRadius: "0.4vmax", background: "#111115", border: "0.08vmax solid #2e2e33" }}>
          <span className="note-text">{text}</span>
          <span style={{ display: "inline-block", width: "0.08vmax", height: "1.05vmax", marginLeft: "0.08vmax", verticalAlign: "-0.15vmax", background: "#a99fff" }} />
        </div>
        <div style={{ alignSelf: "flex-end", color: "#8a8a92", fontSize: "0.7vmax" }}>Enter to save</div>
      </div>
      <Animate
        data={{ at, typeAt, dur, done }}
        script={({ timeline, split, data }) => {
          let seed = 11;
          const rand = () => {
            seed = (seed * 16807) % 2147483647;
            return seed / 2147483647;
          };
          timeline.from(".note-pin", { scale: 0, duration: 0.15, ease: "back.out(2)" }, data.at - 0.05);
          timeline.from(".note-draft", { opacity: 0, scale: 0.94, duration: 0.15, ease: "power2.out" }, data.at);
          const chars = split(".note-text", { type: "chars" }).chars as unknown as HTMLElement[];
          const gaps = chars.map((c, k) => {
            const prev = k > 0 ? chars[k - 1]!.textContent : "";
            return (0.45 + rand() * 1.1) * (prev === " " ? 1.6 : 1) * (rand() < 0.06 ? 3.5 : 1);
          });
          const scale = data.dur / gaps.reduce((a, g) => a + g, 0);
          let t = data.typeAt;
          chars.forEach((c, k) => {
            t += gaps[k]! * scale;
            timeline.from(c as any, { display: "none", duration: 0.01 }, t);
          });
          timeline.to(".note-draft, .note-pin", { opacity: 0, duration: 0.15 }, data.done);
        }}
      />
    </>
  );
}

/** Unspoken screen text from the shot's `telop`, set in the lower right like a time stamp. */
export function Telop({ text, start = 0.2 }: { text: string; start?: number }) {
  return (
    <>
      <div
        className="telop"
        style={{
          position: "absolute",
          right: "3vmax",
          top: "3vmax",
          padding: "0.5vmax 1.2vmax",
          borderRadius: "0.6vmax",
          background: "rgba(255,255,255,.92)",
          color: "#5b3fd1",
          fontWeight: 800,
          fontSize: "2.2vmax",
          letterSpacing: "0.02em",
          boxShadow: "0 0.4vmax 1.2vmax rgba(60,30,140,.25)",
        }}
      >
        {text}
      </div>
      <Animate
        data={{ start }}
        script={({ timeline, data }) => {
          timeline.from(".telop", { y: -20, opacity: 0, duration: 0.35, ease: "back.out(1.4)" }, data.start);
        }}
      />
    </>
  );
}

function Terminal({ banner, status, children }: { banner?: boolean; status?: string; children?: any }) {
  return (
    <>
      <ClaudeCode cwd={CWD} banner={banner} status={status}>
        {children}
      </ClaudeCode>
      <Animate script={terminalScript} />
    </>
  );
}

const ASK = "I want to turn my manga into a real short film. 80 shots, for the school film festival. [24 images]";

/** When shot 17's direction lines, and the manga panels beside them, arrive. */
export const MANGA_AT = [1.0, 1.6, 2.2, 2.9];

/** When each generation shot's job starts beside the terminal (`start`) and when its takes land (`at`). */
export const GEN_AT = {
  "23": { start: 1.6, at: [2.2, 2.9, 3.6] },
  "27a": { start: 1.6, at: 2.7 },
  "35b": { start: 1.4, at: 2.2 },
  "37": { start: 0.3, at: 1.9 },
} as const;

/** Each terminal shot's screen; earlier lines stay on screen, `at` lines arrive during the shot. */
export const TERMINAL: Record<string, () => JSX.Element> = {
  "16": () => (
    <Terminal banner>
      <Line kind="user" className="cc-dim">
        /konte-checkin
      </Line>
      <Line kind="say">This workspace has no videos yet. What would you like to make?</Line>
      <Prompt text={ASK} at={0.4} dur={2.6} />
    </Terminal>
  ),
  "17": () => (
    <Terminal>
      <Line kind="user">{`❯ ${ASK}`}</Line>
      <Line kind="say" at={0.2}>
        I read all 24 pages. A paper whale over a rainy town — I love it.
      </Line>
      <Line kind="tool" at={0.6}>
        Write(videos/paper-whale/direction.ts)
      </Line>
      <Line kind="out" at={0.8}>
        Wrote 1,286 lines
      </Line>
      <Line kind="cont" at={MANGA_AT[0]}>
        {'{ id: "01", action: "Rain streams down the slate-blue rooftops." },'}
      </Line>
      <Line kind="cont" at={MANGA_AT[1]}>
        {'{ id: "02", action: "The girl looks up from under her green umbrella." },'}
      </Line>
      <Line kind="cont" at={MANGA_AT[2]}>
        {'{ id: "03", action: "A whale folded from paper drifts out of the clouds." },'}
      </Line>
      <Line kind="cont" at={MANGA_AT[2]}>
        …
      </Line>
      <Line kind="cont" at={MANGA_AT[3]}>
        {'{ id: "80", action: "The paper whale turns out over the harbour." },'}
      </Line>
    </Terminal>
  ),
  "18": () => (
    <Terminal>
      <Line kind="tool">Bash(konte status)</Line>
      <Line kind="out">direction: 80 shots, 6:01 — no findings</Line>
      <Line kind="say" at={0.2}>
        The plan is ready. One question before I start generating:
      </Line>
      <Choice at={0.6} title="Where should I run generation?" options={["A local GPU (ComfyUI)", "Comfy API — runs in the cloud"]} selected={0} />
    </Terminal>
  ),
  "20": () => (
    <Terminal>
      <Choice title="Where should I run generation?" options={["A local GPU (ComfyUI)", "Comfy API — runs in the cloud"]} selected={1} />
      <Line kind="say" at={0.2}>
        No GPU? No problem — let's use Comfy API!
      </Line>
      <Line kind="cont" stream at={0.2}>
        1. Sign up on Comfy Developer Platform
      </Line>
      <Line kind="cont" stream at={0.2}>
        2. Create an API key
      </Line>
      <Line kind="cont" stream at={0.2}>
        3. Paste it into konte settings — I'll open it for you.
      </Line>
      <Line kind="tool" at={2.4}>
        Bash(konte settings --tab credentials)
      </Line>
      <Line kind="out" at={2.8}>
        Settings at http://127.0.0.1:4649/?tab=credentials
      </Line>
    </Terminal>
  ),
  "23": () => (
    <Terminal>
      <Line kind="out">COMFY_API_KEY is set — Comfy API is ready.</Line>
      <Line kind="tool" at={0.2}>
        Bash(konte generate reference)
      </Line>
      <Line kind="out" at={0.6}>
        reference:paperWhale → comfyapi:cloud
      </Line>
      <Line kind="cont" at={0.6}>
        reference:girl → comfyapi:cloud
      </Line>
      <Line kind="cont" at={0.6}>
        reference:harbourTown → comfyapi:cloud
      </Line>
      <Line kind="cont" at={0.6}>
        reference:umbrella → comfyapi:cloud
      </Line>
      <Line kind="cont" at={0.6}>
        … +8 more
      </Line>
      <Line kind="cont" at={0.6}>
        12 started, 0 waiting, 0 failed
      </Line>
      <Line kind="tool" at={GEN_AT["23"].start}>
        Bash(konte job wait)
      </Line>
      <Line kind="out" at={GEN_AT["23"].at[0]}>
        4 of 12 completed…
      </Line>
      <Line kind="cont" at={GEN_AT["23"].at[1]}>
        8 of 12 completed…
      </Line>
      <Line kind="cont" at={GEN_AT["23"].at[2]}>
        12 of 12 completed
      </Line>
    </Terminal>
  ),
  "25": () => (
    <Terminal>
      <Line kind="tool">Bash(konte job wait)</Line>
      <Line kind="out" at={0.2}>
        12 job(s) settled: 12 completed (1:42)
      </Line>
      <Line kind="say" at={0.7}>
        I checked every take — nothing broken, nothing extra in frame.
      </Line>
      <Line kind="tool" at={1.5}>
        Bash(konte preview reference)
      </Line>
      <Line kind="out" at={2.0}>
        Preview server at http://127.0.0.1:4649 — opening browser
      </Line>
    </Terminal>
  ),
  "26a": () => (
    <Terminal>
      <Line kind="out">Reference Review: submitted</Line>
      <Line kind="tool" at={0.15}>
        Bash(konte generate animatic && konte job wait)
      </Line>
      <Line kind="out" at={0.7}>
        80 job(s) settled: 80 completed (14:32)
      </Line>
      <Line kind="say" at={1.2}>
        Self-review: all 80 panels have the right subject, and the whale holds its look.
      </Line>
      <Line kind="tool" at={1.9}>
        Bash(konte preview animatic)
      </Line>
    </Terminal>
  ),
  "27a": () => (
    <Terminal>
      <Line kind="out">Animatic Review: submitted</Line>
      <Line kind="tool" at={0.15}>
        Bash(konte review record show)
      </Line>
      <Line kind="out" at={0.5}>
        animatic:shot.05 [pin 1] Her eyes should be kinder.
      </Line>
      <Line kind="say" at={1.0}>
        Got it. I'll redraw the whale in shot 05 with a rounder, softer eye.
      </Line>
      <Line kind="tool" at={GEN_AT["27a"].start}>
        Bash(konte generate animatic && konte job wait)
      </Line>
      <Line kind="out" at={GEN_AT["27a"].at}>
        1 job(s) settled: 1 completed (0:48)
      </Line>
    </Terminal>
  ),
  "35b": () => (
    <Terminal>
      <Line kind="out">Video Review: submitted</Line>
      <Line kind="out" at={0.15}>
        video:shot.80 Bigger! She should fill the sky!
      </Line>
      <Line kind="say" at={0.7}>
        On it — rerolling only shot 80; the other 79 stay accepted.
      </Line>
      <Line kind="tool" at={GEN_AT["35b"].start}>
        Bash(konte reroll video:shot.80.motion && konte job wait)
      </Line>
      <Line kind="out" at={GEN_AT["35b"].at}>
        1 job(s) settled: 1 completed (2:51)
      </Line>
    </Terminal>
  ),
  "37": () => (
    <Terminal>
      <Line kind="out">Video Review: submitted — 80 of 80 accepted</Line>
      <Line kind="tool" at={0.15}>
        Bash(konte export video && konte job wait)
      </Line>
      <Line kind="out" at={GEN_AT["37"].at}>
        videos/paper-whale/dist/video/20261025T235812/video.mp4
      </Line>
      <Line kind="say" at={2.2}>
        Done! The Paper Whale — 80 shots, 6:01. Good luck at the festival!
      </Line>
    </Terminal>
  ),
};

/**
 * The festival arriving: a circle opens from the dark onto the flyer, which settles in the middle with the
 * day's label, and the frame fades to black over the last 0.4s for the hall.
 */
export function FestivalCard({ flyer, label, dur }: { flyer: Img; label: string; dur: number }) {
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#141413" }} />
      <div
        className="fest-card"
        style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #fbf7ee 0%, #f1ead9 70%, #e6dcc4 100%)", clipPath: "circle(0% at 50% 50%)" }}
      >
        <div className="fest-flyer" style={{ position: "absolute", left: "50%", top: "47%", width: "34vmax", height: "34vmax", transform: "translate(-50%, -50%) rotate(-4deg)" }}>
          <Image src={flyer} style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 0.8vmax 1.6vmax rgba(60,40,110,.28))" }} />
        </div>
        <div
          className="fest-label"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "6vmax",
            transform: "translateX(-50%)",
            padding: "0.6vmax 1.8vmax",
            borderRadius: "3vmax",
            background: "#5b3fd1",
            color: "#fff",
            fontWeight: 800,
            fontSize: "2.6vmax",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            boxShadow: "0 0.5vmax 1.4vmax rgba(60,30,140,.35)",
          }}
        >
          {label}
        </div>
      </div>
      <div className="fest-black" style={{ position: "absolute", inset: 0, background: "#000", opacity: 0 }} />
      <Animate
        data={{ dur }}
        script={({ timeline, data }) => {
          timeline.to(".fest-card", { clipPath: "circle(75% at 50% 50%)", duration: 0.45, ease: "power2.inOut" }, 0);
          timeline.fromTo(".fest-flyer", { scale: 0.86 }, { scale: 1, duration: 1.2, ease: "power2.out" }, 0.1);
          timeline.from(".fest-label", { y: 24, opacity: 0, duration: 0.35, ease: "back.out(1.6)" }, 0.5);
          timeline.to(".fest-black", { opacity: 1, duration: 0.4, ease: "power1.in" }, data.dur - 0.4);
        }}
      />
    </>
  );
}

/** A black frame lifting at the head of a shot, carrying a fade out of the shot before it. */
export function FadeIn({ dur = 0.5 }: { dur?: number }) {
  return (
    <>
      <div className="fade-in" style={{ position: "absolute", inset: 0, background: "#000", zIndex: 40 }} />
      <Animate data={{ dur }} script={({ timeline, data }) => timeline.to(".fade-in", { opacity: 0, duration: data.dur, ease: "power1.out" }, 0)} />
    </>
  );
}

/** The manga panels each new direction line was written from, stacked down the right edge as their lines arrive. */
export function MangaStrip({ panels }: { panels: { src: Img; id: string; at: number }[] }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: "2.5vmax",
          top: 0,
          bottom: 0,
          width: "19vmax",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1.2vmax",
        }}
      >
        {panels.map((p, i) => (
          <div
            key={p.id}
            className={`manga-${i}`}
            style={{
              position: "relative",
              opacity: 0,
              background: "#fff",
              padding: "0.35vmax",
              borderRadius: "0.3vmax",
              boxShadow: "0 0.6vmax 1.6vmax rgba(0,0,0,.5)",
            }}
          >
            <Image src={p.src} style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }} />
            <div
              style={{
                position: "absolute",
                left: "-1.2vmax",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#7c5cff",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.2vmax",
                padding: "0.15vmax 0.55vmax",
                borderRadius: "0.35vmax",
              }}
            >
              {p.id}
            </div>
          </div>
        ))}
      </div>
      <Animate
        data={{ ats: panels.map((p) => p.at) }}
        script={({ timeline, data }) => {
          data.ats.forEach((at, i) => {
            const tilt = i % 2 === 0 ? -1.5 : 1.5;
            timeline.set(`.manga-${i}`, { x: 60, rotation: tilt }, 0);
            timeline.to(`.manga-${i}`, { opacity: 1, x: 0, duration: 0.4, ease: "power3.out" }, at);
          });
        }}
      />
    </>
  );
}

/**
 * A game-calendar date card in the upper left: a slanted white plate on a violet block, the text big and heavy.
 * Several items flip one after another across `span` seconds, the last one holding.
 */
export function DateCard({ items, start = 0.15, span = 0 }: { items: string[]; start?: number; span?: number }) {
  return (
    <>
      <div
        className="date-card"
        style={{ position: "absolute", left: "3vmax", top: "3vmax", transform: "skewX(-12deg)" }}
      >
        <div style={{ position: "absolute", inset: 0, transform: "translate(0.9vmax, 0.9vmax)", background: "#5b3fd1" }} />
        <div style={{ position: "relative", background: "#fff", padding: "0.6vmax 2.8vmax", minWidth: "18vmax", height: "9vmax" }}>
          {items.map((t, i) => (
            <div
              key={t}
              className={`date-item-${i}`}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 2.4vmax",
                whiteSpace: "nowrap",
                color: "#2a1a6e",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: items.length > 1 ? "6.8vmax" : "3.6vmax",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                opacity: 0,
              }}
            >
              {t}
            </div>
          ))}
          <div style={{ visibility: "hidden", fontWeight: 900, fontStyle: "italic", fontSize: items.length > 1 ? "6.8vmax" : "3.6vmax", whiteSpace: "nowrap", textTransform: "uppercase" }}>
            {items.reduce((a, b) => (b.length > a.length ? b : a), "")}
          </div>
        </div>
      </div>
      <Animate
        data={{ start, n: items.length, step: items.length > 1 ? span / (items.length - 1) : 0 }}
        script={({ timeline, data }) => {
          timeline.from(".date-card", { x: "-40vmax", duration: 0.35, ease: "expo.out" }, data.start);
          for (let i = 0; i < data.n; i++) {
            const at = data.start + i * data.step;
            timeline.set(`.date-item-${i}`, { opacity: 1, yPercent: -40 }, at);
            timeline.to(`.date-item-${i}`, { yPercent: 0, duration: 0.18, ease: "back.out(1.4)" }, at);
            if (i < data.n - 1) timeline.set(`.date-item-${i}`, { opacity: 0 }, at + data.step);
          }
        }}
      />
    </>
  );
}

/**
 * Takes being generated beside the terminal, stacked down the right edge: each tile slides in at `start` over
 * its `from` image (dimmed) or an empty frame with a filling progress bar, and its new image lands at `at`.
 * `video` names an exported file and puts a play button on the landed frame.
 */
export function GenStrip({ items }: { items: { src: Img; from?: Img; label: string; start: number; at: number; video?: boolean }[] }) {
  const fill = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } as const;
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: "2.5vmax",
          top: 0,
          bottom: 0,
          width: items.length > 1 ? "19vmax" : "24vmax",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1.2vmax",
        }}
      >
        {items.map((it, i) => (
          <div
            key={it.label}
            className={`gen-${i}`}
            style={{ position: "relative", opacity: 0, background: "#1d1b22", padding: "0.35vmax", borderRadius: "0.4vmax", boxShadow: "0 0.6vmax 1.6vmax rgba(0,0,0,.5)" }}
          >
            <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "0.2vmax", background: "#2a2733" }}>
              {it.from && <Image src={it.from} style={{ ...fill, filter: "grayscale(.6) brightness(.45)" }} />}
              <div className={`gen-img-${i}`} style={{ position: "absolute", inset: 0, opacity: 0 }}>
                <Image src={it.src} style={fill} />
              </div>
              {it.video && (
                <div
                  className={`gen-play-${i}`}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: "4.4vmax",
                    height: "4.4vmax",
                    margin: "-2.2vmax 0 0 -2.2vmax",
                    borderRadius: "50%",
                    background: "rgba(20,16,40,.6)",
                    border: "0.2vmax solid #fff",
                    opacity: 0,
                  }}
                >
                  <div style={{ position: "absolute", left: "1.65vmax", top: "1.2vmax", borderStyle: "solid", borderWidth: "0.9vmax 0 0.9vmax 1.4vmax", borderColor: "transparent transparent transparent #fff" }} />
                </div>
              )}
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "0.45vmax", background: "rgba(255,255,255,.12)" }}>
                <div className={`gen-bar-${i}`} style={{ height: "100%", background: "#7c5cff", transformOrigin: "left", transform: "scaleX(0)" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1vmax", padding: "0.45vmax 0.3vmax 0.15vmax", fontSize: "1.15vmax", fontWeight: 700, whiteSpace: "nowrap" }}>
              <span style={{ color: "#e8e6f0" }}>{it.label}</span>
              <span style={{ position: "relative" }}>
                <span className={`gen-wait-${i}`} style={{ color: "#a9a3c2" }}>
                  {it.video ? "exporting…" : "generating…"}
                </span>
                <span className={`gen-done-${i}`} style={{ position: "absolute", right: 0, top: 0, color: "#5fd38a", opacity: 0 }}>
                  ✓ done
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <Animate
        data={{ items: items.map((it) => ({ start: it.start, at: it.at })) }}
        script={({ timeline, data }) => {
          data.items.forEach((it, i) => {
            timeline.set(`.gen-${i}`, { x: 60 }, 0);
            timeline.to(`.gen-${i}`, { opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }, it.start);
            timeline.to(`.gen-bar-${i}`, { scaleX: 1, duration: it.at - it.start, ease: "power1.inOut" }, it.start);
            timeline.to(`.gen-bar-${i}`, { opacity: 0, duration: 0.2 }, it.at);
            timeline.fromTo(`.gen-img-${i}`, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }, it.at);
            timeline.set(`.gen-wait-${i}`, { opacity: 0 }, it.at);
            timeline.to(`.gen-done-${i}`, { opacity: 1, duration: 0.2 }, it.at);
            timeline.fromTo(`.gen-play-${i}`, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.8)" }, it.at + 0.1);
          });
        }}
      />
    </>
  );
}

const SITE_FONT = '"Nunito", "Helvetica Neue", Arial, sans-serif';

/** A clip thumbnail; `crop` zooms in on the paper whale's head of a wide frame, so its eye reads at timeline size. */
function WhaleThumb({ src, label, crop }: { src: Img; label: string; crop?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5vmax" }}>
      <div style={{ position: "relative", width: "17.6vmax", aspectRatio: "16 / 9", overflow: "hidden", borderRadius: "0.6vmax", border: "0.2vmax solid #f1ece4" }}>
        <Image src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...(crop ? { transformOrigin: "45% 42%", transform: "scale(2.6)" } : {}) }} />
      </div>
      <span style={{ fontSize: "1.15vmax", fontWeight: 700, color: "#6b6560" }}>{label}</span>
    </div>
  );
}

/**
 * The made-up video generator site the girl tries first: an image and a prompt on the left, the preview
 * player on the right, and the clips she has made along the timeline at the bottom.
 */
export function GenSite({ image, prompt, preview, clips = [] }: { image?: Img; prompt?: string; preview?: Img; clips?: { src: Img; crop?: boolean }[] }) {
  const card = { background: "#fff", borderRadius: "1vmax", padding: "1.2vmax", boxShadow: "0 0.3vmax 1.2vmax rgba(80,60,40,.08)" } as const;
  const label = { fontSize: "1.15vmax", fontWeight: 800, color: "#8a8178", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.7vmax" } as const;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f7f3ee", fontFamily: SITE_FONT, color: "#2f2a26" }}>
      <div style={{ height: "4.6vmax", display: "flex", alignItems: "center", gap: "1vmax", padding: "0 2.4vmax", background: "#fff", borderBottom: "0.1vmax solid #ebe4da" }}>
        <div style={{ width: "2.2vmax", height: "2.2vmax", borderRadius: "50%", background: "linear-gradient(135deg, #ff9a5a, #2bb3a3)" }} />
        <span style={{ fontSize: "1.9vmax", fontWeight: 800 }}>Clipwell</span>
        <span style={{ marginLeft: "3vmax", fontSize: "1.3vmax", fontWeight: 700, color: "#2f2a26" }}>Create</span>
        <span style={{ marginLeft: "1.6vmax", fontSize: "1.3vmax", fontWeight: 700, color: "#a39a90" }}>Library</span>
        <div style={{ marginLeft: "auto", width: "2.2vmax", height: "2.2vmax", borderRadius: "50%", background: "#e6ddd2" }} />
      </div>
      <div style={{ position: "absolute", left: "2.4vmax", top: "6.4vmax", width: "30vmax", display: "flex", flexDirection: "column", gap: "1.2vmax" }}>
        <div style={card}>
          <div style={label}>Image</div>
          <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: "0.6vmax", overflow: "hidden", border: image ? "none" : "0.2vmax dashed #d4c9bc", background: "#faf7f3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {image ? (
              <Image src={image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "1.2vmax", color: "#a39a90", fontWeight: 700 }}>Drop an image</span>
            )}
          </div>
        </div>
        <div style={card}>
          <div style={label}>Prompt</div>
          <div style={{ minHeight: "4.6vmax", fontSize: "1.35vmax", lineHeight: 1.4, color: prompt ? "#2f2a26" : "#b5aca2", fontWeight: 600 }}>{prompt ?? "Describe the motion…"}</div>
        </div>
        <div style={{ height: "4vmax", borderRadius: "2vmax", background: "linear-gradient(90deg, #ff8a4c, #ff6f61)", color: "#fff", fontSize: "1.5vmax", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
          Generate
        </div>
      </div>
      <div style={{ position: "absolute", left: "34.8vmax", right: "2.4vmax", top: "6.4vmax", ...card, padding: "0.8vmax" }}>
        <div style={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "0.6vmax", overflow: "hidden", background: "#2f2a26", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {preview ? (
            <>
              <Image src={preview} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: "1.2vmax", right: "1.2vmax", bottom: "1vmax", height: "0.4vmax", borderRadius: "0.2vmax", background: "rgba(255,255,255,.35)" }}>
                <div className="site-play" style={{ width: "35%", height: "100%", borderRadius: "0.2vmax", background: "#fff" }} />
              </div>
            </>
          ) : (
            <span style={{ fontSize: "1.3vmax", color: "#8a8178", fontWeight: 700 }}>Your clip will appear here</span>
          )}
        </div>
      </div>
      {clips.length > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "15.6vmax", background: "#fff", borderTop: "0.1vmax solid #ebe4da", padding: "1.2vmax 2.4vmax" }}>
          <div style={label}>Timeline · {clips.length} clips</div>
          <div style={{ display: "flex", gap: "1.2vmax" }}>
            {clips.map((c, i) => (
              <WhaleThumb src={c.src} crop={c.crop} label={`clip_${String(i + 1).padStart(2, "0")}.mp4`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const REMAKES = [
  "shot01_town_v1.mp4",
  "shot02_girl_v2.mp4",
  "shot03_whale_v2.mp4",
  "shot03_whale_final.mp4",
  "shot04_v3_fix.mp4",
  "shot05_eyes_fix.mp4",
  "shot07_final.mp4",
  "shot09_v4.mp4",
  "shot12_final.mp4",
  "shot12_final_REAL.mp4",
];
const REMAKE_ROWS = [4, 6, 8, 10];
const REMAKE_ITEMS = [38, 112, 187, 246];

/** The browser's downloads list at step `count` (1–4), the newest remade clips on top and the total growing. */
export function Downloads({ count }: { count: number }) {
  const rows = REMAKES.slice(0, REMAKE_ROWS[count - 1]).reverse();
  return (
    <div style={{ position: "absolute", inset: 0, background: "#f7f3ee", fontFamily: SITE_FONT, color: "#2f2a26", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "62vmax", background: "#fff", borderRadius: "1.2vmax", boxShadow: "0 0.8vmax 2.4vmax rgba(80,60,40,.14)", padding: "1.8vmax 2vmax" }}>
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: "1.2vmax" }}>
          <span style={{ fontSize: "1.8vmax", fontWeight: 800 }}>Downloads</span>
          <span style={{ marginLeft: "auto", fontSize: "1.5vmax", fontWeight: 800, color: "#c2410c" }}>{REMAKE_ITEMS[count - 1]} items</span>
        </div>
        <div style={{ maxHeight: "38vmax", overflow: "hidden", WebkitMaskImage: "linear-gradient(#000 80%, transparent)" }}>
        {rows.map((name, i) => (
          <div style={{ display: "flex", alignItems: "center", gap: "1.2vmax", padding: "1vmax 0.6vmax", borderTop: "0.1vmax solid #f0ebe4", background: i === 0 ? "#fff6ef" : "transparent", borderRadius: "0.5vmax" }}>
            <div style={{ width: "2.8vmax", height: "3.4vmax", borderRadius: "0.4vmax", background: "linear-gradient(135deg, #ff9a5a, #2bb3a3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1vmax", fontWeight: 800 }}>▶</div>
            <span style={{ fontSize: "2vmax", fontWeight: 700, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{name}</span>
            <span style={{ marginLeft: "auto", fontSize: "1.3vmax", color: "#a39a90", fontWeight: 700 }}>{i === 0 ? "just now" : `${i * 4} min ago`}</span>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export const KONTE_ABOUT = "Make multi-shot AI videos the way you build software with a coding agent.";

/** The 🎬 that opens konte's about line, drawn so it renders without an emoji font. */
function Clapper() {
  return (
    <svg viewBox="0 0 32 32" style={{ flex: "none", width: "1em", height: "1em", marginRight: "0.3em", transform: "translateY(0.12em)" }}>
      <rect x="3" y="12" width="26" height="17" rx="2" fill="#3b3b45" />
      <path d="M3 7.5 27.5 3l1 5.5L4 13z" fill="#3b3b45" />
      <path d="M8 6.6l3.6 5.3M14.5 5.4l3.6 5.3M21 4.2l3.6 5.3" stroke="#fff" stroke-width="2.4" />
      <path d="M3 16h26" stroke="#fff" stroke-width="1.6" />
    </svg>
  );
}

/** A forum thread asking how to keep a character consistent across a long film, with a reply pointing to konte. */
/** The drag that selects a sentence of the forum reply: canvas fractions, the selected line's box, and its start and length in seconds. */
export const FORUM_SEL = {
  from: [0.5, 0.85] as [number, number],
  start: [0.277, 0.555] as [number, number],
  end: [0.558, 0.555] as [number, number],
  box: [0.2797, 0.549, 0.2806, 0.036] as [number, number, number, number],
  at: 0.6,
  dur: 1.2,
};

/** A text-selection highlight over `box` (`[x, y, w, h]`, canvas fractions) growing left to right from `at` over `dur`, on the pointer's ease. */
export function TextSelect({ box, at, dur }: { box: [number, number, number, number]; at: number; dur: number }) {
  const [x, y, w, h] = box;
  return (
    <>
      <div className="text-select" style={{ position: "absolute", left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%`, background: "#b4d5fe", mixBlendMode: "multiply", transformOrigin: "0 50%", transform: "scaleX(0)" }} />
      <Animate data={{ at, dur }} script={({ timeline, data }) => timeline.to(".text-select", { scaleX: 1, duration: data.dur, ease: "power2.inOut" }, data.at)} />
    </>
  );
}

export function ForumThread() {
  const vote = (n: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2vmax", width: "3.4vmax", color: "#878a8c", fontWeight: 800, fontSize: "1.2vmax" }}>
      <span style={{ color: "#ff4500", fontSize: "1.5vmax" }}>▲</span>
      <span style={{ color: "#1a1a1b" }}>{n}</span>
      <span style={{ fontSize: "1.5vmax" }}>▼</span>
    </div>
  );
  const meta = { fontSize: "1.15vmax", color: "#787c7e", fontWeight: 600 } as const;
  const actions = (items: string[]) => (
    <div style={{ display: "flex", gap: "1.6vmax", marginTop: "0.7vmax", fontSize: "1.1vmax", fontWeight: 700, color: "#878a8c" }}>
      {items.map((t) => (
        <span>{t}</span>
      ))}
    </div>
  );
  const reply = (user: string, age: string, votes: number, text: string, indent = false) => (
    <div style={{ display: "flex", gap: "1.2vmax", marginLeft: indent ? "4.6vmax" : 0 }}>
      {vote(votes)}
      <div style={{ flex: 1, borderLeft: "0.25vmax solid #edeff1", paddingLeft: "1.2vmax" }}>
        <div style={meta}>
          {user} · {age}
        </div>
        <div style={{ fontSize: "1.4vmax", lineHeight: 1.4, marginTop: "0.3vmax", color: "#3a3a3c" }}>{text}</div>
        {actions(["Reply", "Share"])}
      </div>
    </div>
  );
  const bar = (w: number) => <div style={{ height: "1vmax", width: `${w}%`, borderRadius: "0.5vmax", background: "#edeff1" }} />;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#dae0e6", fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif', color: "#1a1a1b", overflow: "hidden" }}>
      <div style={{ height: "4.4vmax", background: "#fff", display: "flex", alignItems: "center", gap: "1vmax", padding: "0 2.4vmax", borderBottom: "0.1vmax solid #edeff1" }}>
        <div style={{ width: "2.4vmax", height: "2.4vmax", borderRadius: "50%", background: "#8a939b", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2vmax" }}>r/</div>
        <span style={{ fontSize: "1.6vmax", fontWeight: 800 }}>r/aivideo</span>
        <div style={{ marginLeft: "4vmax", flex: 1, maxWidth: "40vmax", height: "2.6vmax", borderRadius: "1.3vmax", background: "#f6f7f8", border: "0.1vmax solid #edeff1", display: "flex", alignItems: "center", padding: "0 1.2vmax", fontSize: "1.15vmax", color: "#878a8c" }}>
          multi-shot film
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "1vmax" }}>
          <div style={{ width: "6vmax", height: "2.4vmax", borderRadius: "1.2vmax", border: "0.15vmax solid #c9ced3" }} />
          <div style={{ width: "2.4vmax", height: "2.4vmax", borderRadius: "50%", background: "#d7dadc" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: "6vmax", width: "62vmax", top: "6.4vmax", bottom: 0, background: "#fff", borderRadius: "0.6vmax 0.6vmax 0 0", padding: "1.8vmax 2.2vmax", display: "flex", flexDirection: "column", gap: "1.5vmax" }}>
        <div style={{ display: "flex", gap: "1.2vmax" }}>
          {vote(18)}
          <div style={{ flex: 1 }}>
            <div style={meta}>Posted by u/rainy_storyboards · 2d</div>
            <div style={{ fontSize: "2.2vmax", fontWeight: 700, lineHeight: 1.3, marginTop: "0.4vmax" }}>Single clips are easy. Why is a multi-shot film so hard?</div>
            <div style={{ fontSize: "1.35vmax", lineHeight: 1.45, marginTop: "0.6vmax", color: "#3a3a3c" }}>Every clip looks great alone. Put 80 together and her face drifts, the takes pile up, and fixing one shot breaks the next.</div>
            {actions(["12 Comments", "Share", "Save"])}
          </div>
        </div>
        <div style={{ borderTop: "0.1vmax solid #edeff1" }} />
        <div style={{ display: "flex", gap: "1.2vmax" }}>
          {vote(7)}
          <div style={{ flex: 1, borderLeft: "0.25vmax solid #edeff1", paddingLeft: "1.2vmax" }}>
            <div style={meta}>u/frame_by_frame · 1d</div>
            <div style={{ fontSize: "1.8vmax", lineHeight: 1.4, marginTop: "0.4vmax" }}>
              Made my 40-shot short with konte. Claude Code ran it like a software project. I just reviewed takes and left notes. So much easier.{" "}
              <span style={{ color: "#0079d3", fontWeight: 800, textDecoration: "underline", textUnderlineOffset: "0.2em" }}>github.com/shiwano/konte</span>
            </div>
            <div style={{ marginTop: "0.8vmax", border: "0.1vmax solid #edeff1", borderRadius: "0.5vmax", padding: "0.9vmax 1.2vmax", display: "flex", alignItems: "baseline", fontSize: "1.4vmax", color: "#3a3a3c", fontWeight: 600 }}>
              <Clapper />
              <span>{KONTE_ABOUT}</span>
            </div>
            {actions(["Reply", "Share"])}
          </div>
        </div>
        {reply("u/rainy_storyboards", "1d", 2, "Huh. Does it work without a big GPU?", true)}
        {reply("u/clipcollector", "20h", 3, "Same problem here. I keep a spreadsheet of every take, it's a mess.")}
      </div>
      <div style={{ position: "absolute", left: "70vmax", right: "6vmax", top: "6.4vmax", display: "flex", flexDirection: "column", gap: "1.4vmax" }}>
        <div style={{ background: "#fff", borderRadius: "0.6vmax", overflow: "hidden" }}>
          <div style={{ height: "3vmax", background: "#c9ced3" }} />
          <div style={{ padding: "1.2vmax 1.4vmax", display: "flex", flexDirection: "column", gap: "0.8vmax" }}>
            <span style={{ fontSize: "1.3vmax", fontWeight: 800 }}>About Community</span>
            <span style={{ fontSize: "1.15vmax", color: "#3a3a3c", lineHeight: 1.4 }}>Making films, shorts and music videos with AI video tools.</span>
            <span style={{ fontSize: "1.15vmax", fontWeight: 700 }}>48.2k members</span>
            <div style={{ height: "2.4vmax", borderRadius: "1.2vmax", background: "#e4e7ea" }} />
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "0.6vmax", padding: "1.2vmax 1.4vmax", display: "flex", flexDirection: "column", gap: "0.8vmax" }}>
          <span style={{ fontSize: "1.3vmax", fontWeight: 800 }}>Rules</span>
          {bar(90)}
          {bar(70)}
          {bar(80)}
          {bar(60)}
        </div>
      </div>
    </div>
  );
}
