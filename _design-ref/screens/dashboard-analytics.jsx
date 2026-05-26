// Dashboard — Analytics page.

function DashAnalytics({ profile = SAMPLE_PROFILE }) {
  // Generate plausible time-series for 28 days
  const days = 28;
  const data = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < days; i++) {
      // Baseline + weekly cycle + a small bump near the cookbook launch
      const base = 80 + Math.sin(i / 4.5) * 28 + Math.cos(i / 2.7) * 12;
      const launch = i > 17 ? Math.min(48, (i - 17) * 9) : 0;
      const noise = ((i * 17) % 11) - 5;
      out.push(Math.max(20, Math.round(base + launch + noise)));
    }
    return out;
  }, []);
  const total = data.reduce((a, b) => a + b, 0);
  const prevTotal = total * 0.78;
  const max = Math.max(...data);

  const topLinks = [...profile.links]
    .filter(l => l.active)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
  const topTotal = topLinks.reduce((s, l) => s + l.clicks, 0);

  return (
    <DashShell active="analytics" profile={profile} showPreview={false}>
      <DashHeader
        title="Analytics"
        subtitle="Privacy-safe clicks. IPs are hashed; nothing leaves your container."
        actions={
          <>
            <button className="hl-btn hl-btn-soft" style={{ padding: "9px 14px", fontSize: 13 }}>
              <Icon.Cal size={14} /> Last 28 days
              <Icon.Chevron size={12} />
            </button>
            <button className="hl-btn hl-btn-soft" style={{ padding: "9px 14px", fontSize: 13 }}>
              Export CSV
            </button>
          </>
        }
      />
      <div style={{ padding: 28, overflow: "auto", height: "calc(100% - 86px)" }}>
        {/* Stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { label: "Page views", value: fmt(total + 2840), delta: "+18%", up: true },
            { label: "Link clicks", value: fmt(total), delta: "+28%", up: true },
            { label: "Click-through rate", value: "32.1%", delta: "+3.4pts", up: true },
            { label: "Top referrer", value: "instagram", delta: "62% of traffic", up: false, mono: true },
          ].map((s, i) => (
            <div key={i} className="hl-card" style={{ padding: 18 }}>
              <div className="hl-eyebrow">{s.label}</div>
              <div className={s.mono ? "hl-mono" : ""} style={{
                fontFamily: s.mono ? "var(--hl-font-mono)" : "var(--hl-font-display)",
                fontSize: s.mono ? 24 : 36, marginTop: 6, lineHeight: 1, letterSpacing: "-0.01em",
              }}>{s.value}</div>
              <div style={{
                marginTop: 8, fontSize: 12,
                color: s.up ? "var(--hl-sage-deep)" : "var(--hl-ink-3)",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                {s.up && <Icon.ArrowUp size={12} />}
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="hl-card" style={{ padding: 24, marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <SectionHeader eyebrow="trend" title="Clicks over time" />
              <p style={{ margin: "6px 0 0", color: "var(--hl-ink-2)", fontSize: 13 }}>
                Daily sum across all active links · cookbook launch on day 18.
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="hl-chip" style={{ background: "var(--hl-ink)", color: "var(--hl-bg)", borderColor: "var(--hl-ink)" }}>Clicks</button>
              <button className="hl-chip">Views</button>
              <button className="hl-chip">Sources</button>
            </div>
          </div>

          {/* Area chart (SVG) */}
          <AreaChart data={data} height={220} />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, color: "var(--hl-ink-3)", fontSize: 11, fontFamily: "var(--hl-font-mono)" }}>
            <span>Apr 28</span>
            <span>May 5</span>
            <span>May 12</span>
            <span>May 19</span>
            <span>today</span>
          </div>
        </div>

        {/* Two column: top links + sources */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginTop: 18 }}>
          <div className="hl-card" style={{ padding: 22 }}>
            <SectionHeader eyebrow="rank" title="Top links" />
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {topLinks.map((l, i) => {
                const Ico = Icon[l.icon] || Icon.Link;
                const pct = (l.clicks / topTotal) * 100;
                return (
                  <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 22, textAlign: "right", color: "var(--hl-ink-3)",
                      fontFamily: "var(--hl-font-mono)", fontSize: 11,
                    }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "var(--hl-sage-soft)", color: "var(--hl-sage-deep)",
                      display: "grid", placeItems: "center", flexShrink: 0,
                    }}>
                      <Ico size={15} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                      <div style={{ height: 4, background: "var(--hl-bg-2)", borderRadius: 999, marginTop: 6, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "var(--hl-sage-deep)" }} />
                      </div>
                    </div>
                    <span className="hl-num" style={{ fontSize: 13, color: "var(--hl-ink)", minWidth: 56, textAlign: "right" }}>
                      {fmt(l.clicks)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hl-card" style={{ padding: 22 }}>
            <SectionHeader eyebrow="where from" title="Referrers" />
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { name: "instagram.com", pct: 62, c: "var(--hl-clay-deep)" },
                { name: "(direct)", pct: 18, c: "var(--hl-ink)" },
                { name: "open.spotify.com", pct: 8, c: "var(--hl-sage-deep)" },
                { name: "x.com", pct: 6, c: "var(--hl-plum)" },
                { name: "google.com", pct: 4, c: "var(--hl-ink-3)" },
                { name: "other", pct: 2, c: "var(--hl-ink-3)" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className="hl-dot" style={{ background: r.c, width: 8, height: 8 }} />
                  <span className="hl-mono" style={{ flex: 1, fontSize: 12, color: "var(--hl-ink-2)" }}>{r.name}</span>
                  <span className="hl-num" style={{ fontSize: 13, color: "var(--hl-ink)" }}>{r.pct}%</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--hl-line)", fontSize: 12, color: "var(--hl-ink-3)" }}>
              Tracked without cookies. <a style={{ color: "var(--hl-sage-deep)" }}>How this works ↗</a>
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

// Small SVG area chart with gradient + line
function AreaChart({ data, height = 200 }) {
  const w = 1000; // viewBox width; svg scales to 100% width
  const h = height;
  const max = Math.max(...data) * 1.15;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, h - (v / max) * (h - 12) - 8]);
  const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="hlChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--hl-sage-deep)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--hl-sage-deep)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* baseline */}
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line key={i} x1="0" y1={h * p} x2={w} y2={h * p} stroke="var(--hl-line)" strokeWidth="1" strokeDasharray="2 4" />
      ))}
      <path d={areaPath} fill="url(#hlChartFill)" />
      <path d={linePath} fill="none" stroke="var(--hl-sage-deep)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {/* last-point dot */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill="var(--hl-bg)" stroke="var(--hl-sage-deep)" strokeWidth="2" />
      {/* launch marker */}
      <line x1={17 * stepX} y1={0} x2={17 * stepX} y2={h} stroke="var(--hl-clay-deep)" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />
      <text x={17 * stepX + 6} y={16} fontSize="11" fontFamily="var(--hl-font-mono)" fill="var(--hl-clay-deep)">
        cookbook launch
      </text>
    </svg>
  );
}

window.DashAnalytics = DashAnalytics;
window.AreaChart = AreaChart;
