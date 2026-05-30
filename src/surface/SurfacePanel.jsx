import { useState, useRef, useCallback, useEffect } from "react";
import { loadGoogleFont, loadCSSFont, loadFileFont, parseHref } from "../FontInput.jsx";

export const PALETTES = {
  slate:      { label: "Slate & Sage",    ground: "#E7EAE1", groundTint: "#dde1d6", ink: "#112B3A", accent: "#C3DCA3", onAccent: "#112B3A", hair: "rgba(17,43,58,.24)" },
  indigo:     { label: "Electric Indigo", ground: "#F0F0F0", groundTint: "#e6e6ea", ink: "#1A191A", accent: "#4B40CB", onAccent: "#F0F0F0", hair: "rgba(26,25,26,.22)" },
  olive:      { label: "Field Olive",     ground: "#E9EAE0", groundTint: "#dfe2d4", ink: "#3C3830", accent: "#357100", onAccent: "#E9EAE0", hair: "rgba(60,56,48,.26)" },
  wildflower: { label: "Wildflower Bone", ground: "#F5F1E8", groundTint: "#efe9da", ink: "#171717", accent: "#F67E24", onAccent: "#ffffff", hair: "rgba(23,23,23,.22)" },
};

function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.replace(/./g, c => c + c) : h;
  const n = parseInt(full.slice(0, 6), 16);
  if (isNaN(n)) return `rgba(0,0,0,${a})`;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

// ── Mini font loader row ────────────────────────────────────────────────────
function FontRow({ label, value, onLoad }) {
  const [inputVal, setInputVal] = useState("");
  const [status, setStatus] = useState(null); // null | {ok, msg}
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [mode, setMode] = useState("google");

  const setOk = msg => { setStatus({ ok: true, msg: `✓ ${msg}` }); setTimeout(() => setStatus(null), 3000); };
  const setErr = msg => setStatus({ ok: false, msg: `⚠ ${msg}` });

  const awaitFont = async (name) => {
    setStatus({ ok: null, msg: "loading..." });
    try {
      // Small gap for the stylesheet to be fetched and @font-face registered
      await new Promise(r => setTimeout(r, 250));
      await Promise.race([
        document.fonts.load(`400 16px "${name}"`),
        new Promise(r => setTimeout(r, 8000)),
      ]);
    } finally {
      setOk(name);
    }
  };

  const loadGoogle = async () => {
    if (!inputVal.trim()) return setErr("Enter a font name");
    const name = inputVal.trim();
    loadGoogleFont(name);
    onLoad(name);
    await awaitFont(name);
  };

  const loadCSS = async () => {
    if (!inputVal.trim()) return setErr("Enter a font name");
    const href = parseHref(inputVal.trim());
    if (!href) return setErr("Couldn't parse a URL");
    const name = prompt("CSS font-family name as declared in the stylesheet:");
    if (!name?.trim()) return;
    loadCSSFont(href, name.trim());
    onLoad(name.trim());
    await awaitFont(name.trim());
  };

  const loadFile = async () => {
    if (!fileObj) return setErr("Select a file first");
    if (!inputVal.trim()) return setErr("Enter a name for this font");
    await loadFileFont(fileObj, inputVal.trim());
    onLoad(inputVal.trim());
    setOk(inputVal.trim());
  };

  return (
    <div className="twk-row">
      <div className="twk-lbl">
        <span>{label}</span>
        {value && <span className="twk-val" style={{ fontFamily: `"${value}"`, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>}
      </div>
      <div className="twk-seg" style={{ marginBottom: 6 }}>
        <div className="twk-seg-thumb" style={{ left: `calc(2px + ${["google","css","file"].indexOf(mode)} * (100% - 4px) / 3)`, width: "calc((100% - 4px) / 3)" }} />
        {["google","css","file"].map(m => (
          <button key={m} type="button" onClick={() => { setMode(m); setInputVal(""); setFileObj(null); setFileName(null); setStatus(null); }}>
            {m === "google" ? "Google" : m === "css" ? "URL" : "File"}
          </button>
        ))}
      </div>
      {mode !== "file" ? (
        <div className="twk-font-input-wrap">
          <input
            className="twk-field"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") mode === "google" ? loadGoogle() : loadCSS(); }}
            placeholder={mode === "google" ? "e.g. Fraunces" : "Paste <link>, @import, or URL"}
            style={{ fontSize: 11 }}
          />
          <button className="twk-font-load-btn" onClick={mode === "google" ? loadGoogle : loadCSS}>Load</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <button
            type="button"
            className="twk-field"
            style={{ cursor: "pointer", textAlign: "left", color: fileName ? "inherit" : "rgba(41,38,27,.4)", fontSize: 11, height: "auto", padding: "5px 8px" }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFileObj(f); setFileName(f.name); } }}
          >
            {fileName || "Click or drop a font file"}
          </button>
          <input ref={fileRef} type="file" accept=".ttf,.woff2,.woff,.otf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files[0]; if (f) { setFileObj(f); setFileName(f.name); } }} />
          <div className="twk-font-input-wrap">
            <input className="twk-field" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Name this font" style={{ fontSize: 11 }} />
            <button className="twk-font-load-btn" onClick={loadFile}>Load</button>
          </div>
        </div>
      )}
      {status && <div className={`twk-status ${status.ok === true ? "ok" : status.ok === false ? "err" : "loading"}`}>{status.msg}</div>}
    </div>
  );
}

// ── Slider row ───────────────────────────────────────────────────────────────
function SliderRow({ label, value, min, max, step = 1, unit = "", onChange }) {
  return (
    <div className="twk-row">
      <div className="twk-lbl">
        <span>{label}</span>
        <span className="twk-val">{value}{unit}</span>
      </div>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
        value={value} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}

// ── Segmented control ────────────────────────────────────────────────────────
function SegRow({ label, value, options, onChange }) {
  const idx = options.findIndex(o => (typeof o === "object" ? o.value : o) === value);
  const n = options.length;
  return (
    <div className="twk-row">
      {label && <div className="twk-lbl"><span>{label}</span></div>}
      <div className="twk-seg">
        <div className="twk-seg-thumb" style={{ left: `calc(2px + ${Math.max(0,idx)} * (100% - 4px) / ${n})`, width: `calc((100% - 4px) / ${n})` }} />
        {options.map(o => {
          const v = typeof o === "object" ? o.value : o;
          const l = typeof o === "object" ? o.label : o;
          return <button key={v} type="button" onClick={() => onChange(v)}>{l}</button>;
        })}
      </div>
    </div>
  );
}

// ── Color row: swatch picker + hex input ─────────────────────────────────────
function ColorRow({ label, value, onChange }) {
  const [hex, setHex] = useState(value);
  useEffect(() => setHex(value), [value]);

  const commit = v => {
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  };

  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl" style={{ flex: 1 }}><span>{label}</span></div>
      <div className="twk-color-row">
        <input type="color" className="twk-swatch" value={/^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#888888"}
          onChange={e => { setHex(e.target.value); onChange(e.target.value); }} />
        <input className="twk-field" value={hex} onChange={e => setHex(e.target.value)}
          onBlur={e => commit(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") commit(hex); }}
          style={{ width: 76, fontSize: 11, fontFamily: "monospace" }} />
      </div>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────────
export default function SurfacePanel({
  open, onClose, onOpen,
  palette, onPalette,
  ground, onGround,
  groundTint, onGroundTint,
  ink, onInk,
  accent, onAccent,
  displayFont, onDisplayFont,
  bodyFont, onBodyFont,
  monoFont, onMonoFont,
  headlineStyle, onHeadlineStyle,
  texture, onTexture,
  texStrength, onTexStrength,
}) {
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clamp = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxR = Math.max(PAD, window.innerWidth - w - PAD);
    const maxB = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxR, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxB, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + "px";
    panel.style.bottom = offsetRef.current.y + "px";
  }, []);

  useEffect(() => {
    if (!open) return;
    clamp();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(clamp) : null;
    if (ro) { ro.observe(document.documentElement); return () => ro.disconnect(); }
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [open, clamp]);

  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startR = window.innerWidth - r.right;
    const startB = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = { x: startR - (ev.clientX - sx), y: startB - (ev.clientY - sy) };
      clamp();
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const applyPalette = key => {
    const p = PALETTES[key];
    onPalette(key);
    onGround(p.ground);
    onGroundTint(p.groundTint);
    onInk(p.ink);
    onAccent(p.accent);
  };

  if (!open) {
    return (
      <button className="surface-toggle" onClick={onOpen} title="Open tweaks panel" aria-label="Open tweaks panel">
        ⚙
      </button>
    );
  }

  return (
    <div ref={dragRef} className="twk-panel" style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>Surface Studio</b>
        <button className="twk-x" aria-label="Close panel" onMouseDown={e => e.stopPropagation()} onClick={onClose}>✕</button>
      </div>
      <div className="twk-body">

        {/* ── Fonts ── */}
        <div className="twk-sect">Fonts</div>
        <FontRow label="Display / Headline" value={displayFont} onLoad={onDisplayFont} />
        <SegRow label="Headline style" value={headlineStyle}
          options={[{ value: "serif", label: "Serif" }, { value: "sans", label: "Sans" }]}
          onChange={onHeadlineStyle} />
        <FontRow label="Body" value={bodyFont} onLoad={onBodyFont} />
        <FontRow label="Mono" value={monoFont} onLoad={onMonoFont} />

        {/* ── Palette ── */}
        <div className="twk-sect">Color palette</div>
        <div className="twk-row">
          <div className="twk-lbl"><span>Preset</span></div>
          <div className="twk-chips">
            {Object.entries(PALETTES).map(([key, p]) => (
              <button
                key={key}
                type="button"
                className="twk-chip"
                data-on={palette === key ? "1" : "0"}
                onClick={() => applyPalette(key)}
                title={p.label}
                style={{ background: p.ground, minWidth: 48 }}
              >
                <span style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "36%", background: p.accent }} />
                <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: p.ink, opacity: 0.85, fontSize: 8, fontWeight: 700, color: p.ground, letterSpacing: ".03em", padding: "2px 4px", textAlign: "center", textTransform: "uppercase" }}>{p.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Custom colors ── */}
        <div className="twk-sect">Custom colors</div>
        <ColorRow label="Ground" value={ground} onChange={v => { onGround(v); onGroundTint(hexToRgba(v, 0.7).replace("rgba", "rgb").replace(",0.7)", "").replace("rgb(", "#") || v); onGroundTint(v); }} />
        <ColorRow label="Ink" value={ink} onChange={v => { onInk(v); }} />
        <ColorRow label="Accent" value={accent} onChange={onAccent} />

        {/* ── Texture ── */}
        <div className="twk-sect">Paper texture</div>
        <SegRow label="Pattern" value={texture}
          options={[
            { value: "graph", label: "Grid" },
            { value: "dots", label: "Dots" },
            { value: "lines", label: "Lines" },
            { value: "dash", label: "Dash" },
          ]}
          onChange={onTexture}
        />
        <SliderRow label="Strength" value={texStrength} min={0} max={12} step={0.5} unit="%" onChange={onTexStrength} />

      </div>
    </div>
  );
}
