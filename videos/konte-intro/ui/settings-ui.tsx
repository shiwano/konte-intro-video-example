type Children = JSX.Element | string | number | boolean | null | undefined | Children[];

const BASE_W = 1920;

const CSS = `
.ks{--font-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;--bg-app:#0b0c0f;--bg-panel:#141519;--bg-input:#0f1014;--border:#23252d;--border-strong:#2e323c;--text-primary:#e7e9ee;--text-secondary:#9aa0ac;--text-muted:#686f7d;--accent:#6e62f5;--accent-hover:#8378ff;--accent-soft:rgba(110,98,245,.15);--green:#30c98e;--green-soft:rgba(48,201,142,.14);--red:#f25c5c;--orange:#f59e4b;--orange-soft:rgba(245,158,75,.14);
  position:relative;width:1920px;overflow:hidden;background:var(--bg-app);color:var(--text-primary);font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased;}
.ks *{box-sizing:border-box;}
:where(.ks button){font:inherit;color:inherit;cursor:pointer;background:transparent;border:1px solid transparent;padding:0;}
.ks-app{max-width:760px;margin:0 auto;padding:0 24px 48px;}
.ks-header{position:relative;z-index:1;display:flex;align-items:center;gap:16px;padding:18px 0 14px;background:var(--bg-app);border-bottom:1px solid var(--border);}
.ks-title{font-size:15px;font-weight:600;letter-spacing:.01em;}
.ks-file{margin-left:auto;font-family:var(--font-mono);font-size:11px;color:var(--text-muted);}
.ks-tabs{display:flex;gap:4px;}
.ks-tab{font-size:13px;color:var(--text-secondary);border:1px solid transparent;border-radius:6px;padding:5px 12px;}
.ks-tab.on{color:var(--text-primary);background:var(--accent-soft);border-color:var(--accent);}
.ks-body{padding-top:20px;}
.ks-intro{font-size:12px;color:var(--text-muted);max-width:62ch;margin-bottom:20px;}
.ks-section{margin-bottom:28px;}
.ks-h2{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-secondary);margin-bottom:6px;}
.ks-section-note{font-size:12px;color:var(--text-muted);margin-bottom:12px;max-width:62ch;}
.ks-section-body{display:flex;flex-direction:column;gap:14px;background:var(--bg-panel);border:1px solid var(--border);border-radius:10px;padding:16px;}
.ks-field{display:flex;flex-direction:column;gap:5px;flex:1;}
.ks-row{display:flex;gap:14px;align-items:flex-end;}
.ks-label{font-size:12px;color:var(--text-secondary);}
.ks-input{font:inherit;font-size:13px;color:var(--text-primary);background:var(--bg-input);border:1px solid var(--border-strong);border-radius:6px;padding:7px 10px;width:100%;}
.ks-input.focus{outline:none;border-color:var(--accent);}
.ks-input::placeholder{color:var(--text-muted);}
.ks-note{display:block;font-size:11px;color:var(--text-muted);max-width:62ch;}
.ks-note a{color:var(--accent-hover);text-decoration:underline;}
.ks code{font-family:var(--font-mono);font-size:10.5px;}
.ks-toggle{display:flex;align-items:flex-start;gap:9px;font-size:13px;}
.ks-toggle input{flex:none;margin-top:3px;accent-color:var(--accent);}
.ks-link{align-self:flex-start;font-size:12px;color:var(--text-muted);text-decoration:underline;padding:0;border:none;}
.ks-cred{display:flex;flex-direction:column;gap:6px;padding-bottom:14px;border-bottom:1px solid var(--border);}
.ks-cred:last-child{padding-bottom:0;border-bottom:none;}
.ks-cred-head{display:flex;align-items:center;gap:10px;}
.ks-cred-name{font-family:var(--font-mono);font-size:12px;}
.ks-cred-label{font-size:12px;color:var(--text-secondary);}
.ks-badge{font-size:10px;text-transform:uppercase;letter-spacing:.06em;border-radius:999px;padding:2px 8px;}
.ks-badge.ok{color:var(--green);background:var(--green-soft);}
.ks-badge.warn{color:var(--orange);background:var(--orange-soft);}
.ks-badge.muted{color:var(--text-muted);background:rgba(255,255,255,.05);}
.ks-footer{display:flex;align-items:center;justify-content:flex-end;gap:14px;padding-top:4px;}
.ks-status{font-size:12px;}
.ks-status.saved{color:var(--green);}
.ks-status.error{color:var(--red);}
.ks-primary{font-size:13px;font-weight:500;color:#fff;background:var(--accent);border:none;border-radius:6px;padding:8px 18px;}
`;

// ───────────────────────── primitives ─────────────────────────

export function Input(p: { value?: string; placeholder?: string; focus?: boolean }) {
  return <input className={p.focus ? "ks-input focus" : "ks-input"} value={p.value ?? ""} placeholder={p.placeholder} />;
}

export function Field(p: { label: string; value?: string; placeholder?: string; focus?: boolean; note?: Children }) {
  return (
    <div className="ks-field">
      <span className="ks-label">{p.label}</span>
      <Input value={p.value} placeholder={p.placeholder} focus={p.focus} />
      {p.note && <span className="ks-note">{p.note}</span>}
    </div>
  );
}

export function Checkbox(p: { label: string; checked: boolean; note?: Children }) {
  return (
    <div className="ks-toggle">
      <input type="checkbox" checked={p.checked} />
      <span>
        {p.label}
        {p.note && (
          <span className="ks-note" style={{ marginTop: "2px" }}>
            {p.note}
          </span>
        )}
      </span>
    </div>
  );
}

export function Section(p: { title?: string; note?: Children; children?: Children }) {
  return (
    <div className="ks-section">
      {p.title && <div className="ks-h2">{p.title}</div>}
      {p.note && <div className="ks-section-note">{p.note}</div>}
      <div className="ks-section-body">{p.children}</div>
    </div>
  );
}

export type SaveStatus = { kind: "saved" | "error"; text: string };

function Footer({ label, status }: { label: string; status?: SaveStatus }) {
  return (
    <div className="ks-footer">
      {status && <span className={`ks-status ${status.kind}`}>{status.text}</span>}
      <button className="ks-primary">{label}</button>
    </div>
  );
}

export interface SettingsFrameProps {
  /** The jsxImage canvas width; the page is laid out at 1920 wide and scaled to it. */
  width: number;
  /** Logical page height at 1920 wide. The canvas height is `height * width / 1920`. */
  height?: number;
  tab: "config" | "credentials";
  /** Pixels the page is scrolled down; the header stays put. */
  scroll?: number;
  children?: Children;
}

export function SettingsFrame(p: SettingsFrameProps) {
  return (
    <div style={{ zoom: p.width / BASE_W }}>
      <style>{CSS}</style>
      <div className="ks" style={{ height: `${p.height ?? 1080}px` }}>
        <div className="ks-app">
          <div className="ks-header">
            <span className="ks-title">konte settings</span>
            <div className="ks-tabs">
              <button className={p.tab === "config" ? "ks-tab on" : "ks-tab"}>Config</button>
              <button className={p.tab === "credentials" ? "ks-tab on" : "ks-tab"}>Credentials</button>
            </div>
            <span className="ks-file">{p.tab === "config" ? "konte.config.json" : "konte.credentials.json"}</span>
          </div>
          <div className="ks-body" style={{ marginTop: `${-(p.scroll ?? 0)}px` }}>
            {p.children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── config tab ─────────────────────────

export interface ConfigValues {
  serverUrl?: string;
  headers?: { name: string; value: string }[];
  autoInstallModels?: boolean;
  autoInstallNodes?: boolean;
  autoReboot?: boolean;
  unreachableTimeout?: string;
  ffmpegPath?: string;
  ffprobePath?: string;
  bindAddress?: string;
  allowedHosts?: string;
  /** The field drawn with the focus ring. */
  focus?: "serverUrl" | "unreachableTimeout" | "ffmpegPath" | "ffprobePath" | "bindAddress" | "allowedHosts";
  status?: SaveStatus;
}

/** The Config tab, with konte's own copy; only the values change. */
export function ConfigTab(p: Omit<SettingsFrameProps, "tab" | "children"> & { values: ConfigValues }) {
  const v = p.values;
  return (
    <SettingsFrame {...p} tab="config">
      <Section
        title="ComfyUI"
        note="A server URL is what lets a comfy adapter route to comfyui. Comfy API — Comfy Cloud and your own deployments — is turned on by COMFY_API_KEY under Credentials; which adapter goes where is comfy.adapters in konte.config.json."
      >
        <Field label="Server URL" value={v.serverUrl} placeholder="http://127.0.0.1:8188" focus={v.focus === "serverUrl"} />
        <div className="ks-field">
          <span className="ks-label">Request headers</span>
          <span className="ks-note">
            Sent on every request to this server, for a ComfyUI behind an auth front. Write the value as <code>{"${VAR}"}</code> and set the variable under Credentials; konte.config.json is not gitignored.
          </span>
          {(v.headers ?? []).map((h) => (
            <div className="ks-row">
              <Field label="Name" value={h.name} placeholder="Authorization" />
              <Field label="Value" value={h.value} placeholder="value or ${VAR}" />
              <button className="ks-link" style={{ marginBottom: "8px" }}>
                Remove
              </button>
            </div>
          ))}
          <button className="ks-link">Add header</button>
        </div>
        <Checkbox label="Install missing models automatically" checked={v.autoInstallModels ?? true} />
        <Checkbox label="Install missing custom node packs automatically" checked={v.autoInstallNodes ?? true} />
        <Checkbox label="Reboot ComfyUI after installing a node pack" checked={v.autoReboot ?? true} note="A newly installed pack only loads on restart." />
        <Field
          label="Unreachable timeout (minutes)"
          value={v.unreachableTimeout}
          placeholder="15"
          focus={v.focus === "unreachableTimeout"}
          note="How long a job keeps polling a ComfyUI it cannot reach. 0 waits forever: right for a remote server, wrong for a local one."
        />
      </Section>
      <Section title="Local tools" note="Leave blank to use the ffmpeg/ffprobe konte manages under .konte/tools/.">
        <Field label="ffmpeg path" value={v.ffmpegPath} focus={v.focus === "ffmpegPath"} />
        <Field label="ffprobe path" value={v.ffprobePath} focus={v.focus === "ffprobePath"} />
      </Section>
      <Section
        title="Preview access"
        note="Every route that is not loopback asks for a 4-digit PIN, printed when the preview starts. konte.config.json is not gitignored, so these travel with the repo."
      >
        <Field
          label="Bind address"
          value={v.bindAddress}
          placeholder="127.0.0.1"
          focus={v.focus === "bindAddress"}
          note="0.0.0.0 also listens on your local network, which is how a phone reaches the preview. The private addresses it listens on are admitted with it."
        />
        <Field
          label="Allowed hosts"
          value={v.allowedHosts}
          placeholder="review.example.com"
          focus={v.focus === "allowedHosts"}
          note="Host names admitted on top of those, comma-separated, for a proxy you front the server with yourself. Such a proxy must pass the original Host through. A tunnel needs nothing here: it names its own host. * stands for one label, and a bare * admits any name."
        />
      </Section>
      <Footer label="Save config" status={v.status} />
    </SettingsFrame>
  );
}

// ───────────────────────── credentials tab ─────────────────────────

/** `stored` is in konte.credentials.json; `env` is a real environment variable, which wins. */
export type CredentialState = "stored" | "env" | "unset" | "removing";

export interface CredentialData {
  name: string;
  label: string;
  state: CredentialState;
  /** What the reviewer is typing, drawn as dots; omitted shows the empty or keep-placeholder input. */
  typing?: number;
  focus?: boolean;
  note?: Children;
}

const BADGE: Record<CredentialState, [string, string]> = {
  stored: ["ok", "set"],
  env: ["warn", "set in environment"],
  unset: ["muted", "not set"],
  removing: ["muted", "will be removed"],
};

const ENV_WINS = " An environment variable of this name is set and takes precedence over the stored value.";

export function Credential({ c }: { c: CredentialData }) {
  const [cls, text] = BADGE[c.state];
  return (
    <div className="ks-cred">
      <div className="ks-cred-head">
        <span className="ks-cred-name">{c.name}</span>
        <span className={`ks-badge ${cls}`}>{text}</span>
      </div>
      <span className="ks-cred-label">{c.label}</span>
      <Field
        label="Value"
        value={c.typing ? "•".repeat(c.typing) : undefined}
        placeholder={c.state === "stored" ? "•••••••• (leave blank to keep)" : undefined}
        focus={c.focus}
        note={c.note}
      />
    </div>
  );
}

/** konte's built-in keys with their own copy; `state` and the rest are yours. */
export function builtinCredentials(
  state: Partial<Record<"FAL_KEY" | "COMFY_API_KEY" | "HF_TOKEN" | "COMFYUI_TOKEN" | "CIVITAI_TOKEN", Partial<CredentialData>>>,
): CredentialData[] {
  const env = (name: keyof typeof state) => (state[name]?.state === "env" ? ENV_WINS : "");
  const base: CredentialData[] = [
    {
      name: "FAL_KEY",
      label: "fal.ai API key",
      state: "unset",
      note: [<>Authenticates every fal.ai generation. </>, <a href="https://fal.ai/dashboard/keys">https://fal.ai/dashboard/keys</a>, env("FAL_KEY")],
    },
    {
      name: "COMFY_API_KEY",
      label: "Comfy API key",
      state: "unset",
      note: [
        <>Authenticates Comfy API: Comfy Cloud (comfyapi:cloud) and your own deployments (comfyapi:&lt;name&gt;). Setting it is what lets a comfy adapter route to either. </>,
        <a href="https://platform.comfy.org/profile/api-keys">https://platform.comfy.org/profile/api-keys</a>,
        env("COMFY_API_KEY"),
      ],
    },
    {
      name: "HF_TOKEN",
      label: "HuggingFace access token",
      state: "unset",
      note: [
        <>Only needed for gated or private repos. konte sends it as the bearer credential when it downloads a model from huggingface.co — keep the URL in the adapter plain. </>,
        <a href="https://huggingface.co/settings/tokens">https://huggingface.co/settings/tokens</a>,
        env("HF_TOKEN"),
      ],
    },
    {
      name: "COMFYUI_TOKEN",
      label: "ComfyUI server credential",
      state: "unset",
      note: [
        <>Only needed for a ComfyUI behind an auth front (a remote pod, a reverse proxy). Reference it from konte.config.json: "comfy": {"{"} "comfyui": {"{"} "headers": {"{"} "Authorization": "Bearer {"${COMFYUI_TOKEN}"}" {"} } }"} </>,
        <a href="https://docs.comfy.org/development/comfyui-server/comms_overview">https://docs.comfy.org/development/comfyui-server/comms_overview</a>,
        env("COMFYUI_TOKEN"),
      ],
    },
    {
      name: "CIVITAI_TOKEN",
      label: "Civitai API token",
      state: "unset",
      note: [
        <>Used as the `?token=` query param, so an adapter's model URL writes it in: https://civitai.com/api/download/models/&lt;id&gt;?token={"${CIVITAI_TOKEN}"} </>,
        <a href="https://civitai.com/user/account">https://civitai.com/user/account</a>,
        env("CIVITAI_TOKEN"),
      ],
    },
  ];
  return base.map((c) => ({ ...c, ...state[c.name as keyof typeof state] }));
}

/** The Credentials tab: konte's keys, any custom ones, and the add-a-key form. */
export function CredentialsTab(
  p: Omit<SettingsFrameProps, "tab" | "children"> & {
    credentials: CredentialData[];
    custom?: CredentialData[];
    newKey?: { name?: string; typing?: number };
    status?: SaveStatus;
  },
) {
  return (
    <SettingsFrame {...p} tab="credentials">
      <div className="ks-intro">
        A stored value is never shown here, only whether it is set. konte loads these into the environment on every run, so a variable you export yourself always wins over the file.
      </div>
      <Section title="Backends and model hosts">
        {p.credentials.map((c) => (
          <Credential c={c} />
        ))}
      </Section>
      {p.custom && p.custom.length > 0 && (
        <Section title="Custom keys">
          {p.custom.map((c) => (
            <Credential c={c} />
          ))}
        </Section>
      )}
      <Section title="Add a key" note="A custom adapter can name any variable in a model URL's ${VAR}.">
        <Field label="Name" value={p.newKey?.name} placeholder="MY_TOKEN" />
        <Field label="Value" value={p.newKey?.typing ? "•".repeat(p.newKey.typing) : undefined} />
      </Section>
      <Footer label="Save credentials" status={p.status} />
    </SettingsFrame>
  );
}
