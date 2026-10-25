const CSS = `
.cp{position:absolute;inset:0;background:#0f0f10;color:#ececec;font-family:Inter,system-ui,sans-serif;font-size:1.05vmax;overflow:hidden;}
.cp-top{height:3.6vmax;display:flex;align-items:center;gap:1vmax;padding:0 2vmax;border-bottom:1px solid #26262a;}
.cp-mark{width:1.7vmax;height:1.7vmax;border-radius:.4vmax;background:#f0ff41;color:#0f0f10;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1vmax;}
.cp-brand{font-weight:700;font-size:1.25vmax;}
.cp-brand span{color:#8a8a92;font-weight:500;margin-left:.6vmax;}
.cp-avatar{margin-left:auto;width:1.9vmax;height:1.9vmax;border-radius:50%;background:#7c6cf2;}
.cp-side{position:absolute;top:3.6vmax;bottom:0;left:0;width:15vmax;border-right:1px solid #26262a;padding:1.6vmax 1.2vmax;display:flex;flex-direction:column;gap:.35vmax;}
.cp-nav{padding:.55vmax .8vmax;border-radius:.45vmax;color:#a0a0a8;}
.cp-nav.on{background:#1f1f23;color:#fff;}
.cp-main{position:absolute;top:3.6vmax;left:15vmax;right:0;bottom:0;padding:2.4vmax 3vmax;}
.cp-h1{font-size:2vmax;font-weight:700;margin-bottom:.4vmax;}
.cp-sub{color:#8a8a92;margin-bottom:1.8vmax;}
.cp-btn{display:inline-flex;align-items:center;gap:.5vmax;padding:.65vmax 1.2vmax;border-radius:.5vmax;background:#f0ff41;color:#0f0f10;font-weight:700;}
.cp-table{margin-top:1.8vmax;border:1px solid #26262a;border-radius:.7vmax;overflow:hidden;}
.cp-row{display:grid;grid-template-columns:2fr 3fr 1.5fr;padding:.9vmax 1.2vmax;border-bottom:1px solid #26262a;color:#c8c8ce;}
.cp-row.head{background:#17171a;color:#8a8a92;font-size:.9vmax;text-transform:uppercase;letter-spacing:.06em;}
.cp-row:last-child{border-bottom:none;}
.cp-mono{font-family:"JetBrains Mono",ui-monospace,monospace;}
.cp-modal-bg{position:absolute;inset:0;background:rgba(0,0,0,.55);}
.cp-modal{position:absolute;left:50%;top:50%;transform:translate(-30%,-50%);width:34vmax;background:#18181b;border:1px solid #2e2e33;border-radius:.9vmax;padding:1.8vmax;box-shadow:0 2vmax 4vmax rgba(0,0,0,.5);}
.cp-modal h2{font-size:1.45vmax;font-weight:700;margin-bottom:.5vmax;}
.cp-key{display:flex;align-items:center;gap:.8vmax;margin:1.2vmax 0 .8vmax;padding:.8vmax 1vmax;border-radius:.5vmax;background:#0f0f10;border:1px solid #2e2e33;}
.cp-key .cp-mono{flex:1;letter-spacing:.08em;}
.cp-copy{padding:.4vmax .9vmax;border-radius:.4vmax;background:#26262a;font-weight:600;}
.cp-warn{color:#e8c558;font-size:.9vmax;}
`;

/** A mock of the Comfy Developer Platform's API keys page; `newKey` opens the just-created key dialog. */
export function ComfyApiKeys(p: { newKey?: boolean; modalClass?: string }) {
  return (
    <div className="cp">
      <style>{CSS}</style>
      <div className="cp-top">
        <div className="cp-mark">C</div>
        <div className="cp-brand">
          Comfy<span>Developer Platform</span>
        </div>
        <div className="cp-avatar" />
      </div>
      <div className="cp-side">
        <div className="cp-nav">Overview</div>
        <div className="cp-nav">Deployments</div>
        <div className="cp-nav on">API Keys</div>
        <div className="cp-nav">Usage</div>
        <div className="cp-nav">Credits</div>
      </div>
      <div className="cp-main">
        <div className="cp-h1">API Keys</div>
        <div className="cp-sub">Use an API key to run workflows on Comfy Cloud and your own deployments.</div>
        <div className="cp-btn">+ Create API Key</div>
        <div className="cp-table">
          <div className="cp-row head">
            <span>Name</span>
            <span>Key</span>
            <span>Created</span>
          </div>
          {p.newKey ? (
            <div className="cp-row">
              <span>konte</span>
              <span className="cp-mono">comfyui-••••••••••••••••</span>
              <span>Just now</span>
            </div>
          ) : (
            <div className="cp-row">
              <span style={{ color: "#8a8a92" }}>No API keys yet.</span>
              <span />
              <span />
            </div>
          )}
        </div>
      </div>
      {p.newKey && (
        <div className={p.modalClass}>
          <div className="cp-modal-bg" />
          <div className="cp-modal">
            <h2>Your new API key</h2>
            <div style={{ color: "#8a8a92" }}>Name: konte</div>
            <div className="cp-key">
              <span className="cp-mono">comfyui-••••••••••••••••••••••••••••</span>
              <span className="cp-copy">Copy</span>
            </div>
            <div className="cp-warn">Copy it now. You won't be able to see it again.</div>
          </div>
        </div>
      )}
    </div>
  );
}
