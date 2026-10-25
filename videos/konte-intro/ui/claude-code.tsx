type Children = JSX.Element | string | number | boolean | null | undefined | Children[];

const CSS = `
.cc{position:absolute;inset:0;background:#141413;color:#e8e6dc;font-family:"JetBrains Mono",ui-monospace,Menlo,Consolas,monospace;font-size:1.85vmax;line-height:1.5;padding:2.2vmax 2.6vmax;overflow:hidden;}
.cc-bar{position:absolute;left:0;right:0;top:0;height:2.2vmax;background:#262624;display:flex;align-items:center;gap:.55vmax;padding:0 1vmax;}
.cc-dot{width:.75vmax;height:.75vmax;border-radius:50%;}
.cc-title{flex:1;text-align:center;color:#8f8d85;font-size:1vmax;margin-right:3vmax;}
.cc-body{position:absolute;left:2.6vmax;right:2.6vmax;top:4.4vmax;display:flex;flex-direction:column;}
.cc-banner{display:flex;gap:1.4vmax;align-items:center;margin-bottom:1.4vmax;}
.cc-logo{display:block;width:5.4em;height:3.45em;}
.cc-banner-text{display:flex;flex-direction:column;}
.cc-dim{color:#8f8d85;}
.cc-orange{color:#d97757;}
.cc-green{color:#7fb77e;}
.cc-red{color:#e5786d;}
.cc-violet{color:#a99fff;}
.cc-bold{font-weight:700;}
.cc-line{white-space:pre-wrap;min-height:1.55em;}
.cc-stream{display:block;}
.cc-user{background:#262624;border-radius:.3vmax;padding:.15vmax .6vmax;margin:.5vmax 0;}
.cc-tool::before{content:"● ";color:#7fb77e;}
.cc-say::before{content:"● ";color:#e8e6dc;}
.cc-out{padding-left:2.1ch;color:#b8b6ad;}
.cc-out::before{content:"⎿  ";color:#8f8d85;}
.cc-cont{padding-left:5.1ch;color:#b8b6ad;}
.cc-choice{border:1px solid #3a3a37;border-radius:.4vmax;padding:.8vmax 1vmax;margin:.6vmax 0;display:flex;flex-direction:column;gap:.2vmax;}
.cc-opt{padding-left:1ch;}
.cc-opt.sel{color:#a99fff;}
.cc-prompt{border-top:1px solid #3a3a37;border-bottom:1px solid #3a3a37;padding:.45vmax .4vmax;margin-top:1vmax;}
.cc-prompt::before{content:"❯ ";color:#8f8d85;}
.cc-caret{display:inline-block;width:.6em;height:1.1em;vertical-align:-.15em;background:#e8e6dc;margin-left:.1em;}
.cc-status{color:#8f8d85;font-size:1.4vmax;padding:.3vmax .4vmax 0;}
`;

/** The Claude Code mascot as the terminal draws it in quadrant blocks: 18 half-cells wide, 5 half-lines tall. */
const LOGO_ROWS = [
  [[3, 14]],
  [[3, 4], [6, 11], [13, 14]],
  [[1, 16]],
  [[3, 14]],
  [[4, 4], [6, 6], [11, 11], [13, 13]],
];

function Logo() {
  return (
    <svg className="cc-logo" viewBox="0 0 18 10" preserveAspectRatio="none" shapeRendering="crispEdges">
      {LOGO_ROWS.flatMap((runs, y) => runs.map(([a, b]) => <rect x={a} y={y * 2} width={b! - a! + 1} height={2} fill="#d97757" />))}
    </svg>
  );
}

/**
 * A Claude Code session in a terminal window. Lines carrying `at` start hidden and are revealed by
 * `terminalScript` in order, none before its `at`; `stream` lines arrive a few tokens at a time.
 */
export function ClaudeCode(p: { cwd: string; banner?: boolean; children?: Children; status?: string }) {
  return (
    <div className="cc">
      <style>{CSS}</style>
      <div className="cc-bar">
        <div className="cc-dot" style={{ background: "#ed6a5e" }} />
        <div className="cc-dot" style={{ background: "#f5bf4f" }} />
        <div className="cc-dot" style={{ background: "#62c554" }} />
        <div className="cc-title">{`${p.cwd} — claude`}</div>
      </div>
      <div className="cc-body">
        {p.banner && (
          <div className="cc-banner">
            <Logo />
            <div className="cc-banner-text">
              <span>
                <span className="cc-bold">Claude Code</span> <span className="cc-dim">v2.1.302</span>
              </span>
              <span className="cc-dim">Opus 5.5 · Claude Max</span>
              <span className="cc-dim">{p.cwd}</span>
            </div>
          </div>
        )}
        {p.children}
        {p.status !== undefined && <div className="cc-status">{p.status}</div>}
      </div>
    </div>
  );
}

type LineKind = "plain" | "user" | "tool" | "say" | "out" | "cont";

/** Assistant text (`say`) streams by default; a `cont` line continuing it passes `stream`. */
export function Line(p: { kind?: LineKind; at?: number; stream?: boolean; className?: string; children?: Children }) {
  const kind = p.kind ?? "plain";
  const stream = p.at !== undefined && (p.stream ?? kind === "say");
  const cls = ["cc-line", kind === "plain" ? "" : `cc-${kind}`, p.at !== undefined ? "cc-reveal" : "", stream ? "cc-stream" : "", p.className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} data-at={p.at}>
      {p.children}
    </div>
  );
}

/** The input box; `typed` text types out from `at` over `dur` seconds, then sits as a sent message. */
export function Prompt(p: { text?: string; at?: number; dur?: number; caret?: boolean }) {
  return (
    <div className="cc-prompt">
      {p.text && (
        <span className="cc-typed" data-at={p.at ?? 0} data-dur={p.dur ?? 1}>
          {p.text}
        </span>
      )}
      {p.caret !== false && <span className="cc-caret" />}
    </div>
  );
}

export function Choice(p: { title: string; options: string[]; selected?: number; at?: number }) {
  return (
    <div className={p.at !== undefined ? "cc-choice cc-reveal" : "cc-choice"} data-at={p.at}>
      <span className="cc-bold">{p.title}</span>
      {p.options.map((o, i) => (
        <span className={i === p.selected ? "cc-opt sel" : "cc-opt"}>{`${i === p.selected ? "❯" : " "} ${i + 1}. ${o}`}</span>
      ))}
    </div>
  );
}

/**
 * Pass to `<Animate script>`: reveals the `.cc-reveal` lines in document order, each at its `data-at` or once
 * the stream before it has finished; `.cc-stream` lines arrive in chunks of one to three words, and every
 * `.cc-typed` prompt types out over `data-dur` at an uneven, human pace.
 */
export const terminalScript = ({ timeline, split }: { timeline: any; split: any }) => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  let cursor = 0;
  document.querySelectorAll<HTMLElement>(".cc-reveal").forEach((el, i) => {
    const start = Math.max(Number(el.dataset.at), cursor);
    timeline.from(el, { opacity: 0, height: 0, duration: 0.08, ease: "power2.out" }, start);
    cursor = start;
    if (!el.classList.contains("cc-stream")) return;
    el.id = el.id || `cc-stream-${i}`;
    const words: HTMLElement[] = split(`#${el.id}`, { type: "words" }).words;
    let t = start + 0.06;
    for (let w = 0; w < words.length; ) {
      const n = 1 + Math.floor(rand() * 3);
      timeline.from(words.slice(w, w + n), { opacity: 0, duration: 0.01 }, t);
      w += n;
      t += 0.04 + rand() * 0.05;
    }
    cursor = t + 0.05;
  });
  document.querySelectorAll<HTMLElement>(".cc-typed").forEach((el, i) => {
    el.id = el.id || `cc-typed-${i}`;
    const chars: HTMLElement[] = split(`#${el.id}`, { type: "chars" }).chars;
    const gaps = chars.map((c, k) => {
      const prev = k > 0 ? chars[k - 1]!.textContent : "";
      const pause = prev === " " ? 1.6 : /[.,!?\]]/.test(prev ?? "") ? 3.2 : 1;
      return (0.45 + rand() * 1.1) * pause * (rand() < 0.06 ? 3.5 : 1);
    });
    const total = gaps.reduce((a, g) => a + g, 0);
    const scale = Number(el.dataset.dur) / total;
    let t = Number(el.dataset.at);
    chars.forEach((c, k) => {
      t += gaps[k]! * scale;
      timeline.from(c, { display: "none", duration: 0.01 }, t);
    });
  });
};
