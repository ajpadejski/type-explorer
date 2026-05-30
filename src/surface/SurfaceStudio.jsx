import { useState, useEffect, useRef } from "react";
import { loadGoogleFont } from "../FontInput.jsx";
import SurfacePanel, { PALETTES } from "./SurfacePanel.jsx";
import "./surface.css";

export default function SurfaceStudio({ onBack }) {
  const [palette, setPalette] = useState("slate");
  const [ground, setGround] = useState(PALETTES.slate.ground);
  const [groundTint, setGroundTint] = useState(PALETTES.slate.groundTint);
  const [ink, setInk] = useState(PALETTES.slate.ink);
  const [accent, setAccent] = useState(PALETTES.slate.accent);

  const [displayFont, setDisplayFont] = useState("");
  const [bodyFont, setBodyFont] = useState("");
  const [monoFont, setMonoFont] = useState("");
  const [headlineStyle, setHeadlineStyle] = useState("serif");

  const [texture, setTexture] = useState("graph");
  const [texStrength, setTexStrength] = useState(5.5);
  const [panelOpen, setPanelOpen] = useState(true);

  const pctRef = useRef(null);
  const pfillRef = useRef(null);
  const cursecRef = useRef(null);
  const wrapRef = useRef(null);

  // Lazy-load Typekit (new-spirit)
  useEffect(() => {
    const id = "typekit-vcq0enp";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      link.href = "https://use.typekit.net/vcq0enp.css";
      document.head.appendChild(link);
    }
    // Pre-load local fallback fonts
    loadGoogleFont("");
  }, []);

  // Sync body background so fixed children match
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = ground;
    return () => { document.body.style.backgroundColor = prev; };
  }, [ground]);

  // Scroll progress + TOC + reveal observers
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? Math.min(100, Math.round((h.scrollTop / max) * 100)) : 0;
      if (pctRef.current) pctRef.current.textContent = String(p).padStart(2, "0");
      if (pfillRef.current) pfillRef.current.style.width = p + "%";
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const secEls = [...document.querySelectorAll("section[id^='s0']")];
    const tocLinks = [...document.querySelectorAll("#surf-toc a")];
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          const n = id.replace("s", "");
          if (cursecRef.current) cursecRef.current.textContent = n;
          const activeIdx = secEls.indexOf(e.target);
          tocLinks.forEach((a, i) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            a.classList.toggle("read", i < activeIdx);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    secEls.forEach(s => secObs.observe(s));

    const revEls = [...document.querySelectorAll(".surface-page .reveal")];
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); revObs.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revEls.forEach(el => revObs.observe(el));

    return () => { secObs.disconnect(); revObs.disconnect(); };
  }, []);

  // Derived CSS variables
  const hair = PALETTES[palette]?.hair ?? `rgba(17,43,58,.24)`;
  const headlineFontVar = () => {
    const custom = displayFont ? `"${displayFont}",` : "";
    return headlineStyle === "sans"
      ? `${custom}'Space Grotesk', system-ui, sans-serif`
      : `${custom}"new-spirit", "Instrument Serif", serif`;
  };
  const cssVars = {
    "--accent": accent,
    "--fg-on-accent": PALETTES[palette]?.onAccent ?? "#ffffff",
    "--ink": ink,
    "--ground": ground,
    "--ground-tint": groundTint,
    "--hair": hair,
    "--tex-opacity": (texStrength / 100).toString(),
    "--headline-font": headlineFontVar(),
    "--headline-style": "normal",
    "--headline-weight": headlineStyle === "sans" ? "700" : "500",
    "--body-font": bodyFont ? `"${bodyFont}", 'Space Grotesk', system-ui, sans-serif` : "'Space Grotesk', system-ui, sans-serif",
    "--mono-font": monoFont ? `"${monoFont}", 'Space Mono', monospace` : "'Space Mono', monospace",
  };

  const texClass = { graph: "", dots: "tex-dots", lines: "tex-vlines", dash: "tex-dash" }[texture] ?? "";

  return (
    <div className={`surface-page ${texClass}`} style={cssVars} ref={wrapRef}>
      <div className="texture" />
      <div className="punch-rail" />

      {/* Chrome HUD */}
      <div className="chrome chrome--tl">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <b>TEMPO</b>
          <span className="dim">/ FIELD MANUAL</span>
          <span style={{ opacity: 0.35, margin: "0 4px" }}>·</span>
          <button
            onClick={onBack}
            style={{ fontFamily: "var(--mono-font)", fontSize: 10, background: "none", border: "none", cursor: "pointer", color: "var(--ink)", opacity: 0.5, letterSpacing: ".05em", textTransform: "uppercase", padding: 0 }}
          >← Type Explorer</button>
        </div>
        <div className="dim">29 MAY 2026 — CHICAGO</div>
      </div>
      <div className="chrome chrome--tr">
        <div>REV <b>0.9</b> <span className="dim">— PRE-RELEASE</span></div>
        <div className="dim">STATUS: FIELD TRIAL OPEN</div>
      </div>
      <div className="chrome chrome--bl">
        <div className="scrollpct"><b><span ref={pctRef}>00</span>%</b> <span className="dim">READ</span></div>
        <div className="progress-track"><div className="progress-fill" ref={pfillRef} /></div>
      </div>
      <div className="chrome chrome--br">
        <div><span className="dim">SECTION</span> <b><span ref={cursecRef}>00</span></b> / 06</div>
        <div className="dim">A4 — NOT TO SCALE</div>
      </div>

      <div className="wrap">
        <div className="doc">
          <main className="doc__main">

            {/* MASTHEAD / HERO */}
            <header style={{ paddingTop: 54 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, fontFamily: "var(--mono-font)", fontSize: 12, letterSpacing: ".22em", textTransform: "uppercase" }}>
                <span style={{ fontWeight: 700 }}>TEMPO</span>
                <span style={{ opacity: .5 }}>— a writing instrument</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 48, alignItems: "end", marginTop: 34 }}>
                <div>
                  <h1 className="hero">Write with<br />the engine<br />running.</h1>
                  <p className="lead par" style={{ marginTop: 30 }}>A writing desk that measures exactly one thing — your momentum — and then has the decency to get out of the way.</p>
                  <p className="small mono" style={{ marginTop: 22, opacity: .6, maxWidth: "46ch" }}>No streaks. No badges. No little red dots at 9&nbsp;p.m. <span className="paren">(We checked: nobody ever wrote anything good because of a notification.)</span></p>
                  <p style={{ marginTop: 30 }}><a className="inline" href="#s06">Request a seat in the field trial →</a></p>
                </div>
                <div className="reveal" aria-hidden="true">
                  <svg viewBox="0 0 360 300" width="100%" style={{ display: "block" }}>
                    <rect x="1" y="1" width="358" height="298" className="ln" />
                    <g className="dash"><line x1="40" y1="40" x2="40" y2="260" /><line x1="40" y1="260" x2="340" y2="260" /></g>
                    <text x="46" y="36" fontSize="9" opacity=".6">OUTPUT</text>
                    <text x="300" y="276" fontSize="9" opacity=".6">TIME →</text>
                    <path className="ln" d="M40,200 L70,150 L90,210 L120,165 L150,225 L185,195 L230,238 L290,220 L340,245" />
                    <text x="246" y="210" fontSize="8.5" opacity=".55">MOTIVATION</text>
                    <path className="acc" d="M40,250 C120,250 150,200 210,140 S300,55 340,46" />
                    <circle cx="340" cy="46" r="4.5" className="accf" />
                    <text x="232" y="92" fontSize="8.5" className="accf" fontWeight="700">MOMENTUM</text>
                    <g className="ln"><circle cx="40" cy="250" r="2.5" className="inkf" /></g>
                    <text x="120" y="288" fontSize="8" opacity=".45">FIG. 0 — WHY ONE LINE BEATS THE OTHER</text>
                  </svg>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, marginTop: 54, borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)" }}>
                <div style={{ padding: "14px 0", borderRight: "1px solid var(--hair)" }}><div className="mono small" style={{ opacity: .55 }}>DISCIPLINE</div><div style={{ fontWeight: 700, marginTop: 2 }}>Writing</div></div>
                <div style={{ padding: "14px 18px", borderRight: "1px solid var(--hair)" }}><div className="mono small" style={{ opacity: .55 }}>PLATFORM</div><div style={{ fontWeight: 700, marginTop: 2 }}>Desktop</div></div>
                <div style={{ padding: "14px 18px", borderRight: "1px solid var(--hair)" }}><div className="mono small" style={{ opacity: .55 }}>PRICE</div><div style={{ fontWeight: 700, marginTop: 2 }}>$9 / mo</div></div>
                <div style={{ padding: "14px 18px" }}><div className="mono small" style={{ opacity: .55 }}>TELEMETRY</div><div style={{ fontWeight: 700, marginTop: 2 }}>None</div></div>
              </div>
            </header>

            {/* 01 — MOMENTUM */}
            <div className="rule"><span className="line" /><span className="brk">01 / Momentum Matters</span><span className="line" /></div>
            <section className="sec" id="s01">
              <div className="sec__num">01</div>
              <div className="sec__body">
                <p className="eyebrow reveal">The thesis</p>
                <h2 className="head reveal">Motivation is weather.<br />Momentum is climate.</h2>
                <div className="cols cols-2" style={{ marginTop: 8 }}>
                  <div className="reveal">
                    <p className="par">Most writing tools sell you motivation: streaks, confetti, a chipper banner when you hit a number. Motivation is a spike. It arrives loud, leaves quietly, and is gone by Thursday.</p>
                    <p className="par">Tempo backs the other horse. <strong>Momentum</strong> is the boring, compounding thing — the difference between a session that ends because you ran out of road and one that ends because the phone buzzed. We measure the road. <span className="paren">(The phone, you'll have to handle yourself.)</span></p>
                  </div>
                  <div className="reveal">
                    <div className="margin-note" style={{ marginBottom: 22 }}>A SESSION HAS THREE PARTS:<br />— the cold start<br />— the warm middle<br />— the part where you'd quit if a number told you to.<br /><br />TEMPO PROTECTS THE MIDDLE.</div>
                    <div className="cols cols-2" style={{ gap: 18 }}>
                      <div className="stat"><div className="stat__n">3.4×</div><div className="stat__l">Longer warm middle</div></div>
                      <div className="stat"><div className="stat__n">0</div><div className="stat__l">Streaks to break</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 02 — THE SURFACE */}
            <div className="rule"><span className="line" /><span className="brk">02 / Fast, Not Furious</span><span className="line" /></div>
            <section className="sec" id="s02">
              <div className="sec__num">02</div>
              <div className="sec__body">
                <p className="eyebrow reveal">The surface</p>
                <h2 className="head reveal">A page that gets<br />out of your way.</h2>
                <p className="par reveal" style={{ marginBottom: 34 }}>The whole instrument is one writing surface and a single quiet gauge. No formatting toolbar, no sidebar of folders, no AI elf offering to finish your sentence. The only live number is your tempo — and even that fades when you stop looking at it.</p>
                <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 34, alignItems: "start" }}>
                  <div>
                    <figure className="figure" style={{ margin: 0 }}>
                      <div className="figure__bar"><span>TEMPO.app — untitled draft</span><span style={{ opacity: .55 }}>⌥ FOCUS</span></div>
                      <div style={{ position: "relative", padding: "30px 34px 26px", minHeight: 320 }}>
                        <div style={{ fontFamily: "var(--headline-font)", fontSize: 21, lineHeight: 1.6, maxWidth: "48ch" }}>
                          <p style={{ margin: "0 0 14px", maxWidth: "none" }}>The steppe doesn't care whether you meant to come. It simply opens, hour after hour, the same pale gold in every direction, and waits to see what you'll do with all that room.</p>
                          <p style={{ margin: 0, maxWidth: "none", opacity: .92 }}>By the third day the horses had stopped startling at the wind, and so, more slowly, had I. There is a kind of attention that only<span style={{ borderLeft: "2px solid var(--ink)", marginLeft: 1 }}>&nbsp;</span></p>
                        </div>
                        <div style={{ position: "absolute", right: 20, bottom: 18, display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--mono-font)", fontSize: 11 }}>
                          <span style={{ opacity: .55, letterSpacing: ".06em" }}>TEMPO</span>
                          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 22 }}>
                            <span style={{ width: 4, height: 8, background: "var(--accent)", display: "block" }} />
                            <span style={{ width: 4, height: 13, background: "var(--accent)", display: "block" }} />
                            <span style={{ width: 4, height: 19, background: "var(--accent)", display: "block" }} />
                            <span style={{ width: 4, height: 22, background: "var(--accent)", display: "block" }} />
                            <span style={{ width: 4, height: 15, background: "var(--accent)", display: "block" }} />
                          </div>
                          <span style={{ fontWeight: 700, color: "var(--accent)" }}>running</span>
                        </div>
                        <span className="fig-mark" style={{ position: "absolute", left: 16, top: 14 }}>1</span>
                        <span className="fig-mark" style={{ position: "absolute", right: 128, bottom: 18 }}>2</span>
                        <span className="fig-mark" style={{ position: "absolute", left: 34, bottom: 64 }}>3</span>
                      </div>
                    </figure>
                    <figcaption className="figure__caption"><span className="fc-id">FIG. 2.0</span><span>The writing surface in focus mode. Everything you are not currently doing has been removed from the screen.</span></figcaption>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 6 }}>
                    <div><div className="callout"><span className="ci">1</span> NO TOOLBAR</div><p className="small par" style={{ margin: "9px 0 0" }}>Formatting lives in keystrokes, not in a ribbon you scan. The chrome you see is the chrome there is.</p></div>
                    <div><div className="callout"><span className="ci">2</span> LIVE TEMPO</div><p className="small par" style={{ margin: "9px 0 0" }}>The one floating element. A five-bar read of words-per-minute against your own baseline — not a leaderboard.</p></div>
                    <div><div className="callout"><span className="ci">3</span> THE FADE</div><p className="small par" style={{ margin: "9px 0 0" }}>Lines you wrote more than a screen ago dim by 8%. The present sentence is always the brightest thing in the room.</p></div>
                  </div>
                </div>
              </div>
            </section>

            {/* 03 — CADENCE */}
            <div className="rule"><span className="line" /><span className="brk">03 / Dial It In</span><span className="line" /></div>
            <section className="sec" id="s03">
              <div className="sec__num">03</div>
              <div className="sec__body">
                <p className="eyebrow reveal">Cadence</p>
                <h2 className="head reveal">Set the rhythm once.<br />Forget it forever.</h2>
                <p className="par reveal" style={{ marginBottom: 34, maxWidth: "54ch" }}>Everyone's engine idles at a different speed. Tempo gives you four dials, asks you to set them on day one, and then never brings them up again. <span className="paren">(Settings that nag you are just notifications wearing a trench coat.)</span></p>
                <div className="reveal" style={{ display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: 38, alignItems: "center" }}>
                  <div aria-hidden="true">
                    <svg viewBox="0 0 340 320" width="100%" style={{ display: "block" }}>
                      <text x="0" y="14" fontSize="9" opacity=".5">FIG. 3.1 — THE CADENCE SOLID, UNFOLDED</text>
                      <g className="ln-2" transform="translate(96,40)">
                        <rect x="44" y="0" width="44" height="44" /><rect x="0" y="44" width="44" height="44" />
                        <rect x="44" y="44" width="44" height="44" /><rect x="88" y="44" width="44" height="44" />
                        <rect x="44" y="88" width="44" height="44" /><rect x="44" y="132" width="44" height="44" />
                      </g>
                      <g className="dash" transform="translate(96,40)">
                        <line x1="44" y1="0" x2="22" y2="-18" /><line x1="88" y1="0" x2="110" y2="-18" />
                      </g>
                      <g transform="translate(150,238)">
                        <ellipse cx="0" cy="0" rx="62" ry="30" className="ln" />
                        <ellipse cx="0" cy="-10" rx="62" ry="30" className="ln-2" />
                        <line x1="0" y1="-10" x2="0" y2="-46" className="ln-2" />
                        <line x1="0" y1="-10" x2="38" y2="6" className="acc" />
                        <circle cx="38" cy="6" r="4" className="accf" />
                        <circle cx="0" cy="-10" r="2.6" className="inkf" />
                      </g>
                      <text x="118" y="318" fontSize="8" opacity=".45">ONE FACE PER DIAL — SIX IN ALL, FOUR IN USE</text>
                    </svg>
                  </div>
                  <div>
                    <figure className="figure" style={{ margin: 0 }}>
                      <div className="figure__bar"><span>Cadence</span><span style={{ opacity: .55 }}>SET ONCE</span></div>
                      <div style={{ padding: "6px 18px 10px" }}>
                        <div className="cad-row"><div><div className="cad-t">Session length</div><div className="cad-s">How long the road runs before a natural stop.</div></div><div className="cad-v">50 min</div></div>
                        <div className="cad-row"><div><div className="cad-t">Warm-up grace</div><div className="cad-s">Tempo isn't measured until you're moving.</div></div><div className="cad-v">4 min</div></div>
                        <div className="cad-row"><div><div className="cad-t">The fade</div><div className="cad-s">How fast old lines dim behind you.</div></div><div className="cad-v">8%</div></div>
                        <div className="cad-row" style={{ borderBottom: "none" }}><div><div className="cad-t">Quiet hours</div><div className="cad-s">When the desk refuses to open at all.</div></div><div className="cad-v" style={{ color: "var(--accent)" }}>21:00 →</div></div>
                      </div>
                    </figure>
                    <figcaption className="figure__caption"><span className="fc-id">FIG. 3.2</span><span>Four dials. The studio default ships sensible; most writers change one and leave the rest.</span></figcaption>
                  </div>
                </div>
              </div>
            </section>

            {/* 04 — THE LEDGER */}
            <div className="rule"><span className="line" /><span className="brk">04 / Measure What Moves</span><span className="line" /></div>
            <section className="sec" id="s04">
              <div className="sec__num">04</div>
              <div className="sec__body">
                <p className="eyebrow reveal">The ledger</p>
                <h2 className="head reveal">A record, not<br />a report card.</h2>
                <p className="par reveal" style={{ marginBottom: 34, maxWidth: "54ch" }}>Tempo keeps a plain ledger of every session — when, how long, how fast. It draws the cloud and lets you read it. There is no grade at the bottom, because you are an adult.</p>
                <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 38, alignItems: "start" }}>
                  <div>
                    <svg viewBox="0 0 360 280" width="100%" style={{ display: "block" }} aria-hidden="true">
                      <text x="0" y="12" fontSize="9" opacity=".5">FIG. 4.1 — SESSIONS, PLOTTED</text>
                      <g className="dash"><line x1="34" y1="30" x2="34" y2="244" /><line x1="34" y1="244" x2="350" y2="244" /></g>
                      <text x="6" y="40" fontSize="8" opacity=".55">FAST</text>
                      <text x="6" y="240" fontSize="8" opacity=".55">SLOW</text>
                      <text x="312" y="262" fontSize="8" opacity=".55">WEEKS →</text>
                      <path className="acc" d="M44,210 C140,180 220,120 344,70" />
                      <g className="inkf">
                        <circle cx="52" cy="214" r="3" /><circle cx="70" cy="198" r="3" /><circle cx="64" cy="222" r="3" />
                        <circle cx="96" cy="186" r="3" /><circle cx="112" cy="200" r="3" /><circle cx="128" cy="172" r="3" />
                        <circle cx="150" cy="178" r="3" /><circle cx="166" cy="150" r="3" /><circle cx="182" cy="166" r="3" />
                        <circle cx="204" cy="140" r="3" /><circle cx="222" cy="128" r="3" /><circle cx="238" cy="144" r="3" />
                        <circle cx="262" cy="112" r="3" /><circle cx="284" cy="120" r="3" /><circle cx="300" cy="96" r="3" />
                        <circle cx="322" cy="84" r="3" />
                      </g>
                      <circle cx="344" cy="70" r="4.5" className="accf" />
                      <text x="250" y="60" fontSize="8.5" className="accf" fontWeight="700">YOUR DRIFT, UPWARD</text>
                    </svg>
                    <p className="margin-note" style={{ marginTop: 8 }}>EACH DOT IS ONE SITTING. THE LINE IS NOT A GOAL. IT IS JUST WHERE YOU'VE BEEN GOING.</p>
                  </div>
                  <div>
                    <figure className="figure" style={{ margin: 0 }}>
                      <div className="figure__bar"><span>Ledger — last 5 sessions</span><span style={{ opacity: .55 }}>LOCAL ONLY</span></div>
                      <div style={{ padding: "4px 16px 8px" }}>
                        <div className="led-row led-head"><span>DATE</span><span>MIN</span><span>WORDS</span><span style={{ textAlign: "right" }}>TEMPO</span></div>
                        {[
                          { d: "28 MAY", m: 62, w: "1,140", s: [60, 80, 100, 70] },
                          { d: "27 MAY", m: 50, w: "905",   s: [50, 70, 60, 90] },
                          { d: "25 MAY", m: 48, w: "820",   s: [40, 55, 75, 65] },
                          { d: "24 MAY", m: 55, w: "1,010", s: [45, 85, 70, 95] },
                          { d: "22 MAY", m: 40, w: "640",   s: [35, 50, 60, 55] },
                        ].map((r, i) => (
                          <div key={i} className="led-row" style={i === 4 ? { borderBottom: "none" } : {}}>
                            <span>{r.d}</span><span>{r.m}</span><span>{r.w}</span>
                            <div className="led-spark">{r.s.map((h, j) => <i key={j} style={{ height: h + "%" }} />)}</div>
                          </div>
                        ))}
                      </div>
                    </figure>
                    <figcaption className="figure__caption"><span className="fc-id">FIG. 4.2</span><span>Stored on your machine. We do not have a copy. We do not want one.</span></figcaption>
                  </div>
                </div>
              </div>
            </section>

            {/* 05 — HOW IT'S MADE */}
            <div className="rule"><span className="line" /><span className="brk">05 / How It's Made</span><span className="line" /></div>
            <section className="sec" id="s05">
              <div className="sec__num">05</div>
              <div className="sec__body">
                <p className="eyebrow reveal">Principles</p>
                <h2 className="head reveal">Three rules,<br />drawn to scale.</h2>
                <p className="par reveal" style={{ marginBottom: 38, maxWidth: "54ch" }}>Tempo is small on purpose. Every feature has to earn its pixels against the same three rules. Most ideas don't make it past the second one.</p>
                <div className="cols cols-3 reveal" style={{ gap: 34 }}>
                  <div>
                    <svg viewBox="0 0 140 120" width="100%" height="110" aria-hidden="true">
                      <g className="ln-2"><rect x="20" y="34" width="78" height="58" /></g>
                      <g className="ln"><rect x="36" y="18" width="78" height="58" /><line x1="20" y1="34" x2="36" y2="18" /><line x1="98" y1="34" x2="114" y2="18" /><line x1="98" y1="92" x2="114" y2="76" /></g>
                    </svg>
                    <div className="callout" style={{ marginTop: 10 }}><span className="ci">5.1</span> ONE SURFACE</div>
                    <p className="small par" style={{ marginTop: 10 }}>If it needs a second window, it isn't a writing tool anymore. The draft is the interface.</p>
                  </div>
                  <div>
                    <svg viewBox="0 0 140 120" width="100%" height="110" aria-hidden="true">
                      <g className="ln"><line x1="14" y1="96" x2="126" y2="96" /></g>
                      <g className="ln-2"><rect x="26" y="78" width="20" height="18" /><rect x="54" y="58" width="20" height="38" /><rect x="82" y="40" width="20" height="56" /></g>
                      <path className="acc" d="M30,86 L64,66 L96,46" /><circle cx="96" cy="46" r="3.5" className="accf" />
                    </svg>
                    <div className="callout" style={{ marginTop: 10 }}><span className="ci">5.2</span> COMPOUNDS QUIETLY</div>
                    <p className="small par" style={{ marginTop: 10 }}>A feature should pay off more the longer you use it, and demand nothing on day one.</p>
                  </div>
                  <div>
                    <svg viewBox="0 0 140 120" width="100%" height="110" aria-hidden="true">
                      <g className="ln-2"><circle cx="70" cy="58" r="30" /></g>
                      <g className="dash"><circle cx="70" cy="58" r="44" /></g>
                      <line x1="70" y1="58" x2="70" y2="20" className="ln" />
                      <text x="60" y="106" fontSize="9" className="inkf">∅ TELEMETRY</text>
                    </svg>
                    <div className="callout" style={{ marginTop: 10 }}><span className="ci">5.3</span> KEEPS ITS DISTANCE</div>
                    <p className="small par" style={{ marginTop: 10 }}>Your words stay on your machine. We can't read them, sell them, or train on them. By design, not by promise.</p>
                  </div>
                </div>
                <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 30, alignItems: "center", marginTop: 46, borderTop: "1px solid var(--ink)", paddingTop: 26 }}>
                  <p style={{ fontFamily: "var(--headline-font)", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.4rem,2.4vw,2rem)", lineHeight: 1.3, maxWidth: "30ch" }}>"We kept cutting until the only thing left to ship was the part that worked."</p>
                  <svg viewBox="0 0 150 120" width="150" height="100" aria-hidden="true">
                    <path className="ln" d="M30,70 C10,50 30,18 60,22 C84,25 96,8 116,22 C138,37 132,72 112,84 C96,94 100,112 78,108 C52,103 50,90 30,70 Z" />
                    <path className="ln" d="M48,64 C60,52 78,54 84,66 C90,78 76,90 62,84 C52,80 44,74 48,64 Z" strokeOpacity=".5" />
                  </svg>
                </div>
              </div>
            </section>

            {/* 06 — FIELD TRIAL */}
            <div className="rule"><span className="line" /><span className="brk">06 / Field Trial</span><span className="line" /></div>
            <section className="sec" id="s06">
              <div className="sec__num">06</div>
              <div className="sec__body">
                <p className="eyebrow reveal">Join in</p>
                <h2 className="head reveal" style={{ maxWidth: "16ch" }}>The field trial is open. The seats are not infinite.</h2>
                <p className="par reveal" style={{ maxWidth: "50ch" }}>We're letting a small group write on Tempo before it ships, and reading every note they send back. No demo call. No sales sequence. One link, one reply.</p>
                <p className="reveal" style={{ marginTop: 26, fontSize: "clamp(1.1rem,1.6vw,1.3rem)" }}>
                  <a className="inline" href="mailto:trial@tempo.example?subject=Field%20trial">Write to trial@tempo.example →</a>
                </p>
                <p className="small mono reveal paren" style={{ marginTop: 18 }}>We reply in plain sentences, usually within a day. <span className="paren">(If we don't, assume we were writing.)</span></p>
              </div>
            </section>

            <footer className="reveal">
              <div><b>TEMPO</b> <span className="dim">— a writing instrument</span><br /><span className="dim">Built in Chicago · Rev 0.9 · 2026</span></div>
              <div className="dim" style={{ textAlign: "right" }}>No streaks · No telemetry · No elf<br />FIG. END — 100% READ</div>
            </footer>
          </main>

          {/* Right-rail TOC */}
          <aside className="toc" id="surf-toc">
            <div className="toc__label">Contents</div>
            {[
              ["#s01", "01", "Momentum"],
              ["#s02", "02", "The Surface"],
              ["#s03", "03", "Cadence"],
              ["#s04", "04", "The Ledger"],
              ["#s05", "05", "How It's Made"],
              ["#s06", "06", "Field Trial"],
            ].map(([href, n, label]) => (
              <a key={n} href={href} data-sec={n}>
                <span className="dot" />
                <span><span className="tnum">{n}</span> {label}</span>
              </a>
            ))}
          </aside>
        </div>
      </div>

      <SurfacePanel
        open={panelOpen}
        onOpen={() => setPanelOpen(true)}
        onClose={() => setPanelOpen(false)}
        palette={palette} onPalette={setPalette}
        ground={ground} onGround={setGround}
        groundTint={groundTint} onGroundTint={setGroundTint}
        ink={ink} onInk={setInk}
        accent={accent} onAccent={setAccent}
        displayFont={displayFont} onDisplayFont={setDisplayFont}
        bodyFont={bodyFont} onBodyFont={setBodyFont}
        monoFont={monoFont} onMonoFont={setMonoFont}
        headlineStyle={headlineStyle} onHeadlineStyle={setHeadlineStyle}
        texture={texture} onTexture={setTexture}
        texStrength={texStrength} onTexStrength={setTexStrength}
      />
    </div>
  );
}
