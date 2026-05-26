// Dashboard shell — sidebar nav + content slot.

function DashShell({ active = "links", profile = SAMPLE_PROFILE, children, hideSidebar = false, showPreview = true }) {
  const navItems = [
    { id: "links", label: "Links", icon: Icon.Link },
    { id: "appearance", label: "Appearance", icon: Icon.Palette },
    { id: "analytics", label: "Analytics", icon: Icon.Chart },
    { id: "billing", label: "Billing", icon: Icon.Credit },
    { id: "settings", label: "Settings", icon: Icon.Settings },
  ];
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: hideSidebar ? "1fr" : (showPreview ? "232px 1fr 380px" : "232px 1fr"),
      height: "100%", width: "100%",
      background: "var(--hl-bg-2)",
      fontFamily: "var(--hl-font-ui)",
      color: "var(--hl-ink)",
    }}>
      {/* Sidebar */}
      {!hideSidebar && (
        <aside style={{
          padding: "20px 14px 16px",
          background: "var(--hl-bg)",
          borderRight: "1px solid var(--hl-line)",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          <div style={{ padding: "6px 8px 18px" }}>
            <HLWordmark size={13} color="var(--hl-ink)" />
          </div>

          {/* Workspace switcher */}
          <button style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px",
            background: "var(--hl-bg-2)",
            border: "1px solid var(--hl-line)",
            borderRadius: "var(--hl-radius)",
            width: "100%", textAlign: "left", cursor: "pointer",
            color: "var(--hl-ink)",
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: "var(--hl-clay)", color: "var(--hl-bg)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--hl-font-display)", fontSize: 14, flexShrink: 0,
            }}>{profile.avatarInitials}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13 }}>
              <div style={{ fontWeight: 500 }}>{profile.displayName}</div>
              <div style={{ fontSize: 11, color: "var(--hl-ink-3)", fontFamily: "var(--hl-font-mono)" }}>
                {profile.handle}.halamanlink.app
              </div>
            </span>
            <Icon.Chevron size={14} color="var(--hl-ink-3)" />
          </button>

          {/* Nav */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
            {navItems.map((it) => {
              const Ico = it.icon;
              const isActive = it.id === active;
              return (
                <a key={it.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 10px",
                  borderRadius: 10,
                  fontSize: 13,
                  color: isActive ? "var(--hl-ink)" : "var(--hl-ink-2)",
                  background: isActive ? "var(--hl-bg-2)" : "transparent",
                  fontWeight: isActive ? 500 : 400,
                  cursor: "pointer",
                  textDecoration: "none",
                }}>
                  <Ico size={16} color={isActive ? "var(--hl-sage-deep)" : "currentColor"} />
                  {it.label}
                  {it.id === "billing" && (
                    <span style={{
                      marginLeft: "auto", fontSize: 10, padding: "2px 7px", borderRadius: 999,
                      background: "var(--hl-clay-soft)", color: "var(--hl-clay-deep)",
                      letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500,
                    }}>Free</span>
                  )}
                </a>
              );
            })}
          </div>

          <div style={{ flex: 1 }} />

          {/* Plan upsell card */}
          <div className="hl-grain" style={{
            padding: 14,
            background: "var(--hl-sage-soft)",
            border: "1px solid oklch(from var(--hl-sage) calc(l - 0.05) c h / .25)",
            borderRadius: "var(--hl-radius)",
            color: "var(--hl-ink)",
          }}>
            <div className="hl-eyebrow" style={{ color: "var(--hl-sage-deep)" }}>Upgrade</div>
            <div className="hl-display" style={{ fontSize: 18, margin: "4px 0 6px", lineHeight: 1.1 }}>
              Unlock unlimited links.
            </div>
            <p style={{ fontSize: 11.5, color: "var(--hl-ink-2)", margin: "0 0 10px", lineHeight: 1.5 }}>
              Pro adds all themes, custom domain and full analytics history.
            </p>
            <button className="hl-btn hl-btn-sage" style={{ padding: "8px 12px", fontSize: 12, width: "100%", justifyContent: "center" }}>
              See Pro
            </button>
          </div>

          <a style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", color: "var(--hl-ink-3)", fontSize: 12.5, marginTop: 8 }}>
            <Icon.Logout size={14} /> Sign out
          </a>
        </aside>
      )}

      {/* Main content */}
      <main style={{ minWidth: 0, overflow: "hidden" }}>
        {children}
      </main>

      {/* Live preview rail */}
      {showPreview && !hideSidebar && (
        <aside style={{
          background: "var(--hl-bg)",
          borderLeft: "1px solid var(--hl-line)",
          padding: 18,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="hl-eyebrow">Live preview</div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className="hl-btn hl-btn-soft" style={{ padding: "6px 10px", fontSize: 11.5 }}>
                <Icon.External size={12} /> Open
              </button>
              <button className="hl-btn hl-btn-soft" style={{ padding: "6px 10px", fontSize: 11.5 }}>
                <Icon.Share size={12} />
              </button>
            </div>
          </div>
          <div style={{
            background: "var(--hl-bg-2)",
            borderRadius: 32,
            padding: 10,
            border: "1px solid var(--hl-line)",
            flex: 1,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            <div style={{
              flex: 1,
              borderRadius: 22,
              overflow: "hidden",
              border: "1px solid var(--hl-line)",
              transform: "scale(0.78)",
              transformOrigin: "top center",
              width: "calc(100% / 0.78)",
              marginBottom: "calc(-1 * (1 - 0.78) * 100%)",
            }}>
              <PublicProfile theme="cream" profile={profile} viewport="mobile" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11.5, color: "var(--hl-ink-3)" }}>
            <Icon.Globe size={13} />
            <span className="hl-mono">{profile.handle}.halamanlink.app</span>
            <button style={{ marginLeft: "auto", background: "none", border: 0, cursor: "pointer", color: "var(--hl-ink-2)" }}>
              <Icon.Copy size={13} />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

// Standard page header used across dashboard surfaces
function DashHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      padding: "26px 32px 18px",
      borderBottom: "1px solid var(--hl-line)",
      background: "var(--hl-bg)",
      display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24,
    }}>
      <div>
        <h1 className="hl-display" style={{ fontSize: 34, margin: 0, letterSpacing: "-0.015em" }}>{title}</h1>
        {subtitle && <p style={{ margin: "4px 0 0", color: "var(--hl-ink-2)", fontSize: 13.5 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}

window.DashShell = DashShell;
window.DashHeader = DashHeader;
