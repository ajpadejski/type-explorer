import { useState, useEffect, useRef } from "react";

function loadGoogleFont(name) {
  if (!name?.trim()) return;
  const id = `gf-${name.replace(/[\s'"]/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const encoded = name.trim().replace(/\s+/g, "+");
  const link = document.createElement("link");
  Object.assign(link, { id, rel: "stylesheet", href: `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,700&display=swap` });
  document.head.appendChild(link);
}

function parseHref(input) {
  const m = input.match(/href=["']([^"']+)["']/) || input.match(/@import\s+url\(["']?([^"')]+)["']?\)/);
  if (m) return m[1];
  return input.trim().startsWith("http") ? input.trim() : null;
}

function loadCSSFont(href, familyName) {
  const id = `css-${familyName.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  Object.assign(link, { id, rel: "stylesheet", href });
  document.head.appendChild(link);
}

function loadFileFont(file, familyName) {
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

function ff(name) { return `"${name}", Georgia, serif`; }

function T(dark) {
  return {
    bg: dark ? "#111111" : "#fafaf8", surface: dark ? "#1c1c1a" : "#ffffff",
    fg: dark ? "#ede9e0" : "#1a1a1a", mid: dark ? "#888" : "#777",
    sub: dark ? "#444" : "#c4bfb4", border: dark ? "#252522" : "#e4e0d8",
    accent: dark ? "#c09a50" : "#7c4f1e",
  };
}

function HeroSection({ disp, body, dark }) {
  const t = T(dark);
  return (
    <div style={{ background: t.bg, color: t.fg }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", borderBottom: `1px solid ${t.border}`, fontFamily: ff(body), fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: t.mid }}>
        <span style={{ fontFamily: ff(disp), fontSize: 20, fontWeight: 600, letterSpacing: "-0.01em", color: t.fg, textTransform: "none" }}>Meridian</span>
        <div style={{ display: "flex", gap: 32 }}>{["Archive", "Issues", "Events", "Subscribe"].map(x => <span key={x} style={{ cursor: "pointer" }}>{x}</span>)}</div>
      </nav>
      <div style={{ padding: "80px 48px 64px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ fontFamily: ff(body), fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: t.accent, marginBottom: 20 }}>Issue 07 — Memory & Migration</div>
        <h1 style={{ fontFamily: ff(disp), fontSize: "clamp(52px, 7.5vw, 88px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.025em", color: t.fg, margin: "0 0 28px", maxWidth: 780 }}>The Language of Everywhere</h1>
        <p style={{ fontFamily: ff(body), fontSize: 20, lineHeight: 1.6, color: t.mid, maxWidth: 540, margin: "0 0 36px", fontWeight: 300 }}>A cultural platform where memory, migration, and meaning converge. We tell stories cities forget to tell themselves.</p>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button style={{ fontFamily: ff(body), fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", padding: "13px 30px", background: t.fg, color: t.bg, border: "none", cursor: "pointer" }}>Explore the Collection</button>
          <span style={{ fontFamily: ff(body), fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: t.mid, cursor: "pointer" }}>Current Issue →</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${t.border}`, gap: "1px", background: t.border }}>
        {[{ tag: "Essay", title: "What We Carry", desc: "On language, loss, and the architecture of belonging" }, { tag: "Photography", title: "Visible Cities", desc: "A documentary series across seven port towns" }, { tag: "Interview", title: "The Translator", desc: "In conversation with Leila Ghahramani" }].map(c => (
          <div key={c.title} style={{ background: t.bg, padding: "28px 36px" }}>
            <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>{c.tag}</div>
            <div style={{ fontFamily: ff(disp), fontSize: 21, fontWeight: 600, lineHeight: 1.2, color: t.fg, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontFamily: ff(body), fontSize: 13, lineHeight: 1.55, color: t.mid }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorialSection({ disp, body, dark }) {
  const t = T(dark);
  return (
    <div style={{ background: t.bg, color: t.fg, padding: "56px 48px" }}>
      <div style={{ maxWidth: 660, margin: "0 auto" }}>
        <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: t.accent, marginBottom: 14 }}>Essay · Identity · Cities</div>
        <h1 style={{ fontFamily: ff(disp), fontSize: 42, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.01em", color: t.fg, margin: "0 0 18px" }}>What We Carry: On Language, Loss, and the Places We Leave</h1>
        <div style={{ fontFamily: ff(body), fontSize: 13, color: t.mid, display: "flex", gap: 16, marginBottom: 36 }}><span>By Mira Okonkwo</span><span>·</span><span>May 2026</span><span>·</span><span>12 min read</span></div>
        <p style={{ fontFamily: ff(body), fontSize: 20, lineHeight: 1.65, fontWeight: 300, fontStyle: "italic", color: dark ? "#a09880" : "#555", borderLeft: `3px solid ${t.accent}`, paddingLeft: 22, marginBottom: 36 }}>Language is not just communication — it is the architecture of memory, the structure inside which we store our losses and our longings.</p>
        {["There is a word in Portuguese — saudade — that refuses translation. It names a melancholy that is also a kind of sweetness, the feeling of missing something you might never have fully had. My grandmother used it the way other people use punctuation: to end sentences, to close conversations, to explain the particular atmosphere of her kitchen on winter afternoons.",
          "I grew up between languages. At home we spoke a patched-together dialect of three countries, heavy with words that existed only in context — words that worked like keys for rooms that don't exist anywhere else. Moving to a new city meant not just losing place but losing the specific vocabulary of that place. The slang. The shortcuts. The names people gave to things that have no other names.",
          "Cities are built from exactly this kind of untranslatable knowledge. The shorthand between longtime residents. The specific emotional meaning of an intersection where something happened once. The way a neighborhood's name changes depending on who's saying it."
        ].map((p, i) => <p key={i} style={{ fontFamily: ff(body), fontSize: 18, lineHeight: 1.78, color: t.fg, marginBottom: 26 }}>{p}</p>)}
        <blockquote style={{ margin: "44px 0", padding: "28px 0", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
          <p style={{ fontFamily: ff(disp), fontSize: 27, fontWeight: 600, lineHeight: 1.3, fontStyle: "italic", color: t.fg, margin: 0 }}>"To speak a language fully is to inherit its particular way of being afraid."</p>
        </blockquote>
        <p style={{ fontFamily: ff(body), fontSize: 18, lineHeight: 1.78, color: t.fg, marginBottom: 36 }}>This is what gets lost in the migration story as usually told: not the dramatic rupture, but the slow erosion of the untranslatable. The way second-generation children sometimes look at their parents and find them slightly illegible, written in a language that runs in a direction you never quite learned to follow.</p>
        <div style={{ background: dark ? "#1a1a18" : "#edeae2", height: 160, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, fontFamily: ff(body), fontSize: 12, color: t.mid, letterSpacing: "0.05em" }}>[ Image ]</div>
        <p style={{ fontFamily: ff(body), fontSize: 12, color: t.mid, fontStyle: "italic" }}>Installation view, Archipelago (2025), mixed media. Collection of the artist.</p>
      </div>
    </div>
  );
}

function UISection({ disp, body, dark }) {
  const t = T(dark);
  return (
    <div style={{ background: t.bg, color: t.fg, padding: 48 }}>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: t.mid, marginBottom: 36 }}>UI Components</div>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: t.sub, fontFamily: ff(body), marginBottom: 8 }}>Navigation</div>
          <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", background: t.surface, border: `1px solid ${t.border}` }}>
            <span style={{ fontFamily: ff(disp), fontSize: 18, fontWeight: 600, color: t.fg }}>Meridian</span>
            <div style={{ display: "flex", gap: 28, fontFamily: ff(body), fontSize: 11, letterSpacing: "0.08em", color: t.mid }}>
              {["Archive", "Issues", "Events"].map(i => <span key={i}>{i}</span>)}
              <span style={{ background: t.fg, color: t.bg, padding: "5px 14px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>Subscribe</span>
            </div>
          </nav>
        </div>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: t.sub, fontFamily: ff(body), marginBottom: 8 }}>Buttons</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {[{ label: "Subscribe Now", bg: t.fg, color: t.bg, bd: "none" }, { label: "Read Issue", bg: "transparent", color: t.fg, bd: `1px solid ${t.fg}` }, { label: "Learn More", bg: "transparent", color: t.accent, bd: `1px solid ${t.accent}` }, { label: "Archive ↗", bg: "transparent", color: t.mid, bd: "none", td: "underline" }].map(btn => (
              <button key={btn.label} style={{ fontFamily: ff(body), fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 24px", cursor: "pointer", background: btn.bg, color: btn.color, border: btn.bd, textDecoration: btn.td }}>{btn.label}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: t.sub, fontFamily: ff(body), marginBottom: 8 }}>Tags</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Culture", "Identity", "Migration", "Language", "Cities", "Memory", "Essay"].map(tag => (
              <span key={tag} style={{ fontFamily: ff(body), fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${t.border}`, color: t.mid }}>{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: t.sub, fontFamily: ff(body), marginBottom: 8 }}>Cards</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[{ tag: "Essay", title: "What We Carry", desc: "On language, loss, and the architecture of belonging", author: "Mira Okonkwo", time: "12 min" }, { tag: "Interview", title: "The Translator", desc: "In conversation with Leila Ghahramani on untranslatable words", author: "Editors", time: "8 min" }].map(c => (
              <div key={c.title} style={{ background: t.surface, border: `1px solid ${t.border}`, padding: "22px 24px" }}>
                <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: t.accent, marginBottom: 8 }}>{c.tag}</div>
                <div style={{ fontFamily: ff(disp), fontSize: 20, fontWeight: 600, lineHeight: 1.2, color: t.fg, marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontFamily: ff(body), fontSize: 13, lineHeight: 1.5, color: t.mid, marginBottom: 14 }}>{c.desc}</div>
                <div style={{ fontFamily: ff(body), fontSize: 11, color: t.sub }}>{c.author} · {c.time} read</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: t.sub, fontFamily: ff(body), marginBottom: 8 }}>Type scale</div>
          <div style={{ background: t.surface, border: `1px solid ${t.border}`, padding: "24px 28px" }}>
            {[{ name: "Display", sz: 52, wt: 700, f: "disp", text: "The Language of Everywhere" }, { name: "H1", sz: 36, wt: 700, f: "disp", text: "What We Carry" }, { name: "H2", sz: 26, wt: 600, f: "disp", text: "On Memory and Migration" }, { name: "H3", sz: 20, wt: 500, f: "disp", text: "The Untranslatable" }, { name: "Body/L", sz: 18, wt: 400, f: "body", text: "Language is the architecture of memory, the structure inside which we store our losses." }, { name: "Body", sz: 16, wt: 400, f: "body", text: "A new kind of cultural platform — where memory, migration, and meaning converge." }, { name: "Caption", sz: 11, wt: 400, f: "body", text: "CULTURE · IDENTITY · MIGRATION · 12 MIN READ" }].map(row => (
              <div key={row.name} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 16, alignItems: "baseline", borderBottom: `1px solid ${t.border}`, padding: "12px 0" }}>
                <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: t.mid }}>{row.name}</div>
                <div style={{ fontFamily: ff(row.f === "disp" ? disp : body), fontSize: row.sz, fontWeight: row.wt, color: t.fg, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintSection({ disp, body, dark }) {
  const t = T(dark);
  return (
    <div style={{ background: t.bg, color: t.fg, padding: 48 }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: t.mid, marginBottom: 32 }}>Print / Poster</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div style={{ background: t.fg, color: t.bg, padding: "44px 36px", aspectRatio: "3/4", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: ff(disp), fontSize: 20, fontWeight: 700 }}>Meridian</span>
              <span style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4 }}>No. 07</span>
            </div>
            <div>
              <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14, opacity: 0.4 }}>Memory & Migration</div>
              <div style={{ fontFamily: ff(disp), fontSize: 48, fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.02em", marginBottom: 20 }}>The Language of Every-<br />where</div>
              <div style={{ fontFamily: ff(body), fontSize: 13, lineHeight: 1.55, opacity: 0.55, maxWidth: 260 }}>Essays on belonging, untranslatable words, and the cities we carry inside us</div>
            </div>
            <div style={{ fontFamily: ff(body), fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.35 }}>Spring 2026 — €14</div>
          </div>
          <div style={{ background: t.bg, border: `2px solid ${t.fg}`, padding: "44px 36px", aspectRatio: "3/4", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: t.mid, marginBottom: 28 }}>Panel Discussion</div>
              <div style={{ fontFamily: ff(disp), fontSize: 42, fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.02em", color: t.fg, marginBottom: 20 }}>What Remains After Translation</div>
              <div style={{ width: 40, height: 2, background: t.fg, marginBottom: 20 }} />
              <div style={{ fontFamily: ff(body), fontSize: 14, lineHeight: 1.6, color: t.mid }}>A conversation on cultural memory, language loss, and the politics of belonging</div>
            </div>
            <div>
              <div style={{ fontFamily: ff(body), fontSize: 13, color: t.fg, marginBottom: 4 }}>June 12, 2026</div>
              <div style={{ fontFamily: ff(body), fontSize: 13, color: t.mid }}>7:00 PM · Cultural Center · Chicago</div>
            </div>
          </div>
        </div>
        <div style={{ border: `1px solid ${t.border}`, padding: 36, background: t.surface }}>
          <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: t.mid, marginBottom: 24 }}>Glyph specimen</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            {[{ label: `Display: ${disp}`, name: disp }, { label: `Body: ${body}`, name: body }].map(({ label, name }) => (
              <div key={label}>
                <div style={{ fontFamily: ff(name), fontSize: 60, fontWeight: 800, lineHeight: 0.9, color: t.fg, marginBottom: 16, letterSpacing: "-0.03em" }}>Aa Bb</div>
                {["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ", "0123456789 .,:;?!"].map(row => (
                  <div key={row} style={{ fontFamily: ff(name), fontSize: 15, color: t.fg, lineHeight: 1.5 }}>{row}</div>
                ))}
                <div style={{ fontFamily: ff(body), fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: t.mid, marginTop: 12 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FontInput({ label, onLoad }) {
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

const CTXS = [{ id: "hero", label: "Hero" }, { id: "editorial", label: "Editorial" }, { id: "ui", label: "UI" }, { id: "print", label: "Print" }];

export default function TypeExplorer() {
  const [displayFont, setDisplayFont] = useState("Noto Serif");
  const [bodyFont, setBodyFont] = useState("Noto Serif");
  const [pairing, setPairing] = useState(false);
  const [ctx, setCtx] = useState("hero");
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadGoogleFont("Noto Serif"); }, []);

  const pushFont = (slot, name) => {
    const newDisp = slot === "display" ? name : displayFont;
    const newBody = slot === "body" ? name : (pairing ? bodyFont : name);
    setDisplayFont(newDisp);
    setBodyFont(pairing ? newBody : newDisp);
    setHistory(prev => {
      const entry = { display: newDisp, body: pairing ? newBody : newDisp };
      return [entry, ...prev.filter(h => !(h.display === entry.display && h.body === entry.body))].slice(0, 8);
    });
  };

  const recall = (h) => {
    setDisplayFont(h.display);
    setBodyFont(h.body);
    setPairing(h.display !== h.body);
  };

  const copyCombo = async () => {
    const text = pairing && bodyFont !== displayFont ? `${displayFont} / ${bodyFont}` : displayFont;
    try { await navigator.clipboard.writeText(text); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const activeLabel = pairing && bodyFont !== displayFont ? `${displayFont} / ${bodyFont}` : displayFont;

  const tabStyle = (id) => ({
    background: "none", border: "none",
    borderBottom: ctx === id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
    color: ctx === id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
    padding: "8px 16px", fontSize: 11, letterSpacing: "0.09em", textTransform: "uppercase",
    cursor: "pointer", fontFamily: "inherit", fontWeight: ctx === id ? 500 : 400,
  });

  return (
    <div style={{ background: "var(--color-background-tertiary)", minHeight: "100vh" }}>
      <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "16px 20px 0" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-text-tertiary)", fontWeight: 500 }}>Type Explorer</span>
          <div style={{ width: "0.5px", height: 14, background: "var(--color-border-tertiary)" }} />
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "var(--color-text-secondary)" }}>
            <input type="checkbox" checked={pairing} onChange={e => setPairing(e.target.checked)} />
            Pairing mode
          </label>
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "var(--color-text-secondary)" }}>
              <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
              Dark preview
            </label>
            <button onClick={copyCombo} style={{ fontSize: 11, padding: "4px 12px" }}>
              {copied ? "Copied ✓" : "Copy combo"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: pairing ? "1fr 1fr" : "1fr", gap: 24, marginBottom: 16, paddingBottom: 16, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          <FontInput label={pairing ? "Display font" : "Font"} onLoad={name => pushFont("display", name)} />
          {pairing && <FontInput label="Body font" onLoad={name => pushFont("body", name)} />}
        </div>

        {history.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 12, alignItems: "center" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>History</span>
            {history.map((h, i) => (
              <button key={i} onClick={() => recall(h)} style={{ fontSize: 11, padding: "2px 10px", borderRadius: 20 }}>
                {h.display}{h.body !== h.display ? ` + ${h.body}` : ""}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", borderTop: "0.5px solid var(--color-border-tertiary)", alignItems: "center" }}>
          {CTXS.map(c => <button key={c.id} onClick={() => setCtx(c.id)} style={tabStyle(c.id)}>{c.label}</button>)}
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--color-text-tertiary)", paddingRight: 4 }}>{activeLabel}</span>
        </div>
      </div>

      <div style={{ margin: 16, border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" }}>
        {ctx === "hero" && <HeroSection disp={displayFont} body={bodyFont} dark={dark} />}
        {ctx === "editorial" && <EditorialSection disp={displayFont} body={bodyFont} dark={dark} />}
        {ctx === "ui" && <UISection disp={displayFont} body={bodyFont} dark={dark} />}
        {ctx === "print" && <PrintSection disp={displayFont} body={bodyFont} dark={dark} />}
      </div>
    </div>
  );
}
