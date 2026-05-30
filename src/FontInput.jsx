import { useState, useRef } from "react";

export function loadGoogleFont(name) {
  if (!name?.trim()) return;
  const id = `gf-${name.replace(/[\s'"]/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const encoded = name.trim().replace(/\s+/g, "+");
  const link = document.createElement("link");
  Object.assign(link, { id, rel: "stylesheet", href: `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,700&display=swap` });
  document.head.appendChild(link);
}

export function parseHref(input) {
  // Prefer <link rel="stylesheet" href="..."> — attribute order in either direction
  const stylesheet =
    input.match(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/) ||
    input.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["']/);
  if (stylesheet) return stylesheet[1];
  const m = input.match(/@import\s+url\(["']?([^"')]+)["']?\)/);
  if (m) return m[1];
  return input.trim().startsWith("http") ? input.trim() : null;
}

export function loadCSSFont(href, familyName) {
  const id = `css-${familyName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  Object.assign(link, { id, rel: "stylesheet", href });
  document.head.appendChild(link);
}

export function loadFileFont(file, familyName) {
  return new Promise(res => {
    const id = `file-${familyName.replace(/\s+/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return res();
    const r = new FileReader();
    r.onload = e => {
      const s = document.createElement("style");
      s.id = id;
      s.textContent = `@font-face{font-family:"${familyName}";src:url("${e.target.result}");font-weight:100 900;}`;
      document.head.appendChild(s);
      res();
    };
    r.readAsDataURL(file);
  });
}

export function FontInput({ label, onLoad }) {
  const [mode, setMode] = useState("google");
  const [googleVal, setGoogleVal] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [customFamily, setCustomFamily] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ text: "", ok: true });
  const fileRef = useRef(null);

  const setOk = (msg) => { setStatus({ text: `✓ ${msg}`, ok: true }); setTimeout(() => setStatus({ text: "", ok: true }), 3000); };
  const setErr = (msg) => setStatus({ text: `⚠ ${msg}`, ok: false });

  const pill = (id, txt) => (
    <button
      key={id}
      onClick={() => { setMode(id); setStatus({ text: "", ok: true }); }}
      aria-pressed={mode === id}
      style={{
        fontFamily: "inherit", fontSize: 10, letterSpacing: "0.06em", padding: "3px 10px",
        borderRadius: 20, border: "0.5px solid var(--color-border-tertiary)", cursor: "pointer",
        background: mode === id ? "var(--color-background-secondary)" : "transparent",
        color: mode === id ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
      }}
    >{txt}</button>
  );

  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 8, fontWeight: 500 }}>{label}</div>
      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {pill("google", "Google Fonts")}
        {pill("css", "CSS / URL")}
        {pill("file", "File upload")}
      </div>

      {mode === "google" && (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={googleVal}
            onChange={e => setGoogleVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && googleVal.trim()) {
                loadGoogleFont(googleVal.trim());
                onLoad(googleVal.trim());
                setOk(googleVal.trim());
              }
            }}
            placeholder="e.g. Noto Serif, Fraunces, IBM Plex Sans"
            style={{ fontSize: 13, width: 260 }}
          />
          <button onClick={() => {
            if (!googleVal.trim()) return setErr("Enter a font name");
            loadGoogleFont(googleVal.trim());
            onLoad(googleVal.trim());
            setOk(googleVal.trim());
          }} style={{ fontSize: 12, whiteSpace: "nowrap" }}>Load ↗</button>
        </div>
      )}

      {mode === "css" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>
            Paste a <code style={{ fontSize: 10 }}>&lt;link&gt;</code> tag, <code style={{ fontSize: 10 }}>@import</code>, or stylesheet URL from any font service.
          </div>
          <textarea
            value={cssCode}
            onChange={e => setCssCode(e.target.value)}
            placeholder={`<link rel="stylesheet" href="https://...">\nor https://fonts.example.com/stylesheet.css`}
            rows={3}
            style={{ fontSize: 11, fontFamily: "var(--font-mono)", width: "100%", resize: "vertical", boxSizing: "border-box" }}
          />
          <input
            value={customFamily}
            onChange={e => setCustomFamily(e.target.value)}
            placeholder="CSS font-family name as defined in the stylesheet"
            style={{ fontSize: 13, width: "100%", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => {
              if (!customFamily.trim()) return setErr("Enter the font-family name");
              const href = parseHref(cssCode);
              if (!href) return setErr("Couldn't parse a URL from that input");
              loadCSSFont(href, customFamily.trim());
              onLoad(customFamily.trim());
              setOk(customFamily.trim());
            }} style={{ fontSize: 12 }}>Load ↗</button>
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Note: third-party CDNs may be blocked. File upload always works.</span>
          </div>
        </div>
      )}

      {mode === "file" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.5 }}>
            Upload a font file directly — no CDN needed. Works with downloaded Typographer, Adobe, or any locally licensed font.
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
            style={{
              border: "0.5px dashed var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              padding: "16px",
              cursor: "pointer",
              fontSize: 12,
              color: file ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
              textAlign: "center",
            }}
          >
            {file ? `${file.name} (${(file.size / 1024).toFixed(0)} KB)` : "Click or drag a font file here — .ttf .woff2 .woff .otf"}
          </div>
          <input ref={fileRef} type="file" accept=".ttf,.woff2,.woff,.otf" style={{ display: "none" }} onChange={e => { if (e.target.files[0]) setFile(e.target.files[0]); }} />
          <input
            value={customFamily}
            onChange={e => setCustomFamily(e.target.value)}
            placeholder="Name this font — e.g. Neue Haas, My Custom Sans"
            style={{ fontSize: 13, width: "100%", boxSizing: "border-box" }}
          />
          <button onClick={async () => {
            if (!file) return setErr("Select a font file first");
            if (!customFamily.trim()) return setErr("Give this font a name");
            await loadFileFont(file, customFamily.trim());
            onLoad(customFamily.trim());
            setOk(`${customFamily.trim()} loaded from file`);
          }} style={{ width: "fit-content", fontSize: 12 }}>Load ↗</button>
        </div>
      )}

      {status.text && (
        <div style={{ marginTop: 6, fontSize: 11, color: status.ok ? "var(--color-text-success)" : "var(--color-text-danger)" }}>
          {status.text}
        </div>
      )}
    </div>
  );
}
