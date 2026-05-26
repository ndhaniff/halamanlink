// Dashboard — Appearance / theme editor.

function DashAppearance({ profile = SAMPLE_PROFILE, selectedTheme = "cream", onTheme }) {
  return (
    <DashShell active="appearance" profile={profile} showPreview={false}>
      <DashHeader
        title="Appearance"
        subtitle="Choose a theme, then fine-tune the details. Changes preview live."
        actions={
          <>
            <button className="hl-btn hl-btn-soft" style={{ padding: "9px 14px", fontSize: 13 }}>
              Discard
            </button>
            <button className="hl-btn hl-btn-primary" style={{ padding: "9px 16px", fontSize: 13 }}>
              <Icon.Check size={14} /> Publish
            </button>
          </>
        }
      />
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 380px", height: "calc(100% - 86px)",
      }}>
        {/* Editor */}
        <div style={{ padding: 28, overflow: "auto" }}>
          {/* Theme picker */}
          <div style={{ marginBottom: 28 }}>
            <SectionHeader eyebrow="01" title="Theme" />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 12, marginTop: 16,
            }}>
              {Object.entries(THEMES).map(([key, t]) => (
                <button key={key} onClick={() => onTheme && onTheme(key)} style={{
                  background: "transparent",
                  padding: 0, border: 0, cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  outline: selectedTheme === key ? "2px solid var(--hl-sage-deep)" : "none",
                  outlineOffset: 4,
                  borderRadius: 16,
                  transition: "outline .12s",
                }}>
                  <div style={{
                    background: t.bg, borderRadius: 12, padding: 16,
                    border: `1px solid ${t.btnBorder}`, height: 132,
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: -30, right: -20,
                      width: 100, height: 100, borderRadius: "50%",
                      background: t.accent, opacity: 0.2, filter: "blur(20px)",
                    }} />
                    <div style={{ display: "flex", gap: 4, position: "relative" }}>
                      {t.swatch.map((s, i) => (
                        <span key={i} style={{
                          width: 16, height: 16, borderRadius: "50%",
                          background: s, border: "1px solid rgba(0,0,0,.06)",
                        }} />
                      ))}
                    </div>
                    <div style={{
                      background: t.btnBg, color: t.btnFg, border: `1px solid ${t.btnBorder}`,
                      borderRadius: Math.min(t.radius, 10), padding: "6px 10px",
                      fontSize: 11, fontFamily: t.font, position: "relative",
                    }}>
                      Sample link
                    </div>
                  </div>
                  <div style={{
                    marginTop: 10, fontSize: 13, fontWeight: 500,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    {t.name}
                    {selectedTheme === key && <Icon.Check size={14} color="var(--hl-sage-deep)" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons / radius / font */}
          <div className="hl-card" style={{ padding: 22, marginBottom: 18 }}>
            <SectionHeader eyebrow="02" title="Button style" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 16 }}>
              {[
                { name: "Pillow", radius: 22 },
                { name: "Soft", radius: 14, on: true },
                { name: "Crisp", radius: 6 },
                { name: "Square", radius: 0 },
              ].map((s) => (
                <button key={s.name} style={{
                  padding: 14, border: s.on ? "1.5px solid var(--hl-sage-deep)" : "1px solid var(--hl-line-2)",
                  background: s.on ? "var(--hl-sage-soft)" : "var(--hl-bg)",
                  borderRadius: 10, cursor: "pointer", textAlign: "left",
                  fontFamily: "inherit", color: "var(--hl-ink)",
                }}>
                  <div style={{
                    height: 22,
                    background: "var(--hl-bg-2)",
                    border: "1px solid var(--hl-line-2)",
                    borderRadius: s.radius,
                    marginBottom: 10,
                  }} />
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{s.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hl-card" style={{ padding: 22, marginBottom: 18 }}>
            <SectionHeader eyebrow="03" title="Type" />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              {[
                { name: "Editorial", style: { fontFamily: "var(--hl-font-display)", fontSize: 22 }, on: true, sample: "Aa" },
                { name: "Modern", style: { fontFamily: "var(--hl-font-ui)", fontSize: 18, fontWeight: 600 }, sample: "Aa" },
                { name: "Mono", style: { fontFamily: "var(--hl-font-mono)", fontSize: 16 }, sample: "Aa" },
              ].map((f) => (
                <button key={f.name} style={{
                  flex: 1, padding: 16,
                  border: f.on ? "1.5px solid var(--hl-sage-deep)" : "1px solid var(--hl-line-2)",
                  background: f.on ? "var(--hl-sage-soft)" : "var(--hl-bg)",
                  borderRadius: 10, cursor: "pointer",
                  fontFamily: "inherit", color: "var(--hl-ink)",
                  textAlign: "center",
                }}>
                  <div style={{ ...f.style, lineHeight: 1, marginBottom: 8 }}>{f.sample}</div>
                  <div style={{ fontSize: 11.5, color: "var(--hl-ink-2)" }}>{f.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="hl-card" style={{ padding: 22 }}>
            <SectionHeader eyebrow="04" title="Background detail" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 16 }}>
              {[
                { name: "Plain", bg: "var(--hl-bg-2)", on: true },
                { name: "Grain", bg: "var(--hl-bg-2)" },
                { name: "Blob", bg: "radial-gradient(circle at 30% 20%, var(--hl-sage-soft), var(--hl-bg))" },
                { name: "Gradient", bg: "linear-gradient(135deg, var(--hl-sage-soft), var(--hl-clay-soft))" },
              ].map((b) => (
                <button key={b.name} style={{
                  border: b.on ? "1.5px solid var(--hl-sage-deep)" : "1px solid var(--hl-line-2)",
                  borderRadius: 10, cursor: "pointer", padding: 0, overflow: "hidden",
                  background: "var(--hl-bg)",
                }}>
                  <div style={{ height: 48, background: b.bg }} />
                  <div style={{ padding: "8px 10px", fontSize: 12, color: "var(--hl-ink)", textAlign: "left" }}>{b.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview rail (taller, themed) */}
        <div style={{
          padding: 22, background: "var(--hl-bg)",
          borderLeft: "1px solid var(--hl-line)",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <div className="hl-eyebrow" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Preview</span>
            <span style={{ color: "var(--hl-ink-3)", fontFamily: "var(--hl-font-mono)" }}>
              {THEMES[selectedTheme]?.name || "Linen"}
            </span>
          </div>
          <div style={{
            flex: 1,
            background: "var(--hl-bg-2)",
            borderRadius: 36,
            padding: 12,
            border: "1px solid var(--hl-line)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              borderRadius: 26, overflow: "hidden",
              border: "1px solid var(--hl-line)",
            }}>
              <PublicProfile theme={selectedTheme} profile={profile} viewport="mobile" />
            </div>
          </div>
        </div>
      </div>
    </DashShell>
  );
}

function SectionHeader({ eyebrow, title, kicker }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span className="hl-eyebrow" style={{ fontFamily: "var(--hl-font-mono)", letterSpacing: "0.08em" }}>{eyebrow}</span>
        <h3 className="hl-display" style={{ fontSize: 22, margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
        {kicker && <span style={{ color: "var(--hl-ink-3)", fontSize: 12.5 }}>{kicker}</span>}
      </div>
    </div>
  );
}

window.DashAppearance = DashAppearance;
window.SectionHeader = SectionHeader;
