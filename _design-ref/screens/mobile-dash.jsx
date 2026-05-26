// Mobile dashboard views — links editor + analytics, plus a tabbed bottom nav.

function MobileDashLinks({ profile = SAMPLE_PROFILE }) {
  return (
    <div style={{
      background: "var(--hl-bg-2)", height: "100%", width: "100%",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--hl-font-ui)", color: "var(--hl-ink)",
    }}>
      {/* Header */}
      <header style={{
        background: "var(--hl-bg)", borderBottom: "1px solid var(--hl-line)",
        padding: "20px 18px 14px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--hl-clay)", color: "var(--hl-bg)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--hl-font-display)", fontSize: 14,
          }}>{profile.avatarInitials}</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={navBtn}><Icon.Bell size={16} /></button>
            <button style={navBtn}><Icon.Share size={16} /></button>
          </div>
        </div>
        <h1 className="hl-display" style={{ fontSize: 30, margin: "8px 0 4px", letterSpacing: "-0.015em" }}>
          Your links
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--hl-ink-3)", fontSize: 12 }}>
          <Icon.Globe size={12} />
          <span className="hl-mono">{profile.handle}.halamanlink.app</span>
          <span style={{ marginLeft: "auto" }}>5/5 used</span>
        </div>
      </header>

      {/* Quick stats strip */}
      <div style={{
        padding: "14px 18px 4px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
      }}>
        <div className="hl-card" style={{ padding: 12 }}>
          <div className="hl-eyebrow" style={{ fontSize: 10 }}>7d clicks</div>
          <div className="hl-display" style={{ fontSize: 22, marginTop: 4 }}>1,842</div>
          <div style={{ fontSize: 11, color: "var(--hl-sage-deep)" }}>+18%</div>
        </div>
        <div className="hl-card" style={{ padding: 12 }}>
          <div className="hl-eyebrow" style={{ fontSize: 10 }}>CTR</div>
          <div className="hl-display" style={{ fontSize: 22, marginTop: 4 }}>32.1%</div>
          <div style={{ fontSize: 11, color: "var(--hl-ink-3)" }}>steady</div>
        </div>
      </div>

      {/* Links */}
      <div style={{ flex: 1, padding: "10px 18px 90px", overflow: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {profile.links.slice(0, 5).map((link) => {
            const Ico = Icon[link.icon] || Icon.Link;
            return (
              <div key={link.id} className="hl-card" style={{
                padding: 12, display: "flex", alignItems: "center", gap: 12,
                opacity: link.active ? 1 : 0.6,
              }}>
                <Icon.Drag size={14} color="var(--hl-ink-3)" />
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: "var(--hl-sage-soft)", color: "var(--hl-sage-deep)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Ico size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.title}</div>
                    {link.hot && <Icon.ArrowUp size={11} color="var(--hl-clay-deep)" />}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--hl-ink-3)" }}>
                    <span className="hl-num">{fmt(link.clicks)}</span> clicks
                  </div>
                </div>
                <Toggle on={link.active} />
              </div>
            );
          })}
        </div>

        <button className="hl-btn hl-btn-primary" style={{
          marginTop: 14, width: "100%", justifyContent: "center", padding: 14,
        }}>
          <Icon.Plus size={15} /> New link
        </button>
      </div>

      {/* Bottom tab bar */}
      <MobileTabBar active="links" />
    </div>
  );
}

function MobileDashAnalytics({ profile = SAMPLE_PROFILE }) {
  const data = React.useMemo(() => {
    const out = [];
    for (let i = 0; i < 28; i++) {
      const base = 80 + Math.sin(i / 4.5) * 28 + Math.cos(i / 2.7) * 12;
      const launch = i > 17 ? Math.min(48, (i - 17) * 9) : 0;
      out.push(Math.max(20, Math.round(base + launch + ((i * 17) % 11) - 5)));
    }
    return out;
  }, []);
  const total = data.reduce((a, b) => a + b, 0);
  const topLinks = [...profile.links].filter(l => l.active).sort((a, b) => b.clicks - a.clicks).slice(0, 4);
  const topTotal = topLinks.reduce((s, l) => s + l.clicks, 0);

  return (
    <div style={{
      background: "var(--hl-bg-2)", height: "100%", width: "100%",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--hl-font-ui)", color: "var(--hl-ink)",
    }}>
      <header style={{ background: "var(--hl-bg)", borderBottom: "1px solid var(--hl-line)", padding: "20px 18px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: "var(--hl-ink-3)" }} className="hl-eyebrow">overview</span>
          <button style={navBtn}>
            <Icon.Cal size={14} />
          </button>
        </div>
        <h1 className="hl-display" style={{ fontSize: 30, margin: "8px 0 4px", letterSpacing: "-0.015em" }}>
          Last 28 days
        </h1>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="hl-display" style={{ fontSize: 44 }}>{fmt(total)}</span>
          <span style={{ fontSize: 12, color: "var(--hl-sage-deep)" }}>
            <Icon.ArrowUp size={11} /> 28%
          </span>
        </div>
      </header>

      <div style={{ flex: 1, padding: "16px 18px 90px", overflow: "auto" }}>
        <div className="hl-card" style={{ padding: 14, marginBottom: 14 }}>
          <AreaChart data={data} height={140} />
        </div>

        <div className="hl-card" style={{ padding: 16, marginBottom: 14 }}>
          <SectionHeader eyebrow="rank" title="Top links" />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {topLinks.map((l, i) => {
              const Ico = Icon[l.icon] || Icon.Link;
              const pct = (l.clicks / topTotal) * 100;
              return (
                <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--hl-sage-soft)", color: "var(--hl-sage-deep)",
                    display: "grid", placeItems: "center",
                  }}>
                    <Ico size={13} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</div>
                    <div style={{ height: 3, background: "var(--hl-bg-2)", borderRadius: 999, marginTop: 5, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "var(--hl-sage-deep)" }} />
                    </div>
                  </div>
                  <span className="hl-num" style={{ fontSize: 12 }}>{fmt(l.clicks)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hl-card" style={{ padding: 16 }}>
          <SectionHeader eyebrow="sources" title="Referrers" />
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: "instagram.com", pct: 62, c: "var(--hl-clay-deep)" },
              { name: "(direct)", pct: 18, c: "var(--hl-ink)" },
              { name: "open.spotify.com", pct: 8, c: "var(--hl-sage-deep)" },
              { name: "x.com", pct: 6, c: "var(--hl-plum)" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="hl-dot" style={{ background: r.c, width: 6, height: 6 }} />
                <span className="hl-mono" style={{ flex: 1, fontSize: 11.5, color: "var(--hl-ink-2)" }}>{r.name}</span>
                <span className="hl-num" style={{ fontSize: 12.5 }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MobileTabBar active="analytics" />
    </div>
  );
}

const navBtn = {
  width: 34, height: 34, borderRadius: 10,
  background: "var(--hl-bg-2)", border: "1px solid var(--hl-line)",
  display: "grid", placeItems: "center", cursor: "pointer",
  color: "var(--hl-ink-2)",
};

function MobileTabBar({ active = "links" }) {
  const tabs = [
    { id: "links", label: "Links", icon: Icon.Link },
    { id: "appearance", label: "Theme", icon: Icon.Palette },
    { id: "analytics", label: "Stats", icon: Icon.Chart },
    { id: "settings", label: "More", icon: Icon.Settings },
  ];
  return (
    <nav style={{
      position: "absolute", left: 12, right: 12, bottom: 12,
      background: "var(--hl-ink)",
      borderRadius: 22,
      padding: 6,
      display: "flex",
      justifyContent: "space-around",
      boxShadow: "0 12px 32px -10px rgba(40,30,20,.4)",
    }}>
      {tabs.map((t) => {
        const Ico = t.icon;
        const isActive = t.id === active;
        return (
          <button key={t.id} style={{
            flex: 1, padding: "10px 4px",
            border: 0, background: isActive ? "oklch(from var(--hl-ink) calc(l + 0.1) c h)" : "transparent",
            borderRadius: 16,
            color: isActive ? "var(--hl-bg)" : "oklch(0.7 0.012 70)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            cursor: "pointer",
            fontFamily: "inherit", fontSize: 10.5, fontWeight: 500,
            letterSpacing: 0.02,
          }}>
            <Ico size={17} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}

window.MobileDashLinks = MobileDashLinks;
window.MobileDashAnalytics = MobileDashAnalytics;
window.MobileTabBar = MobileTabBar;
