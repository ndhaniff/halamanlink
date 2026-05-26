// Dashboard — Links page (the linktree core).

function DashLinks({ profile = SAMPLE_PROFILE }) {
  return (
    <DashShell active="links" profile={profile}>
      <DashHeader
        title="Your links"
        subtitle={<>6 links · <span style={{ color: "var(--hl-sage-deep)" }}>5 active</span> · last edited 2 hours ago</>}
        actions={
          <>
            <button className="hl-btn hl-btn-soft" style={{ padding: "9px 14px", fontSize: 13 }}>
              <Icon.Sparkle size={14} /> Add from URL
            </button>
            <button className="hl-btn hl-btn-primary" style={{ padding: "9px 16px", fontSize: 13 }}>
              <Icon.Plus size={14} /> New link
            </button>
          </>
        }
      />
      <div style={{ padding: 28, overflow: "auto", height: "calc(100% - 86px)" }}>
        {/* Page header card */}
        <div className="hl-card" style={{
          padding: 20, marginBottom: 20,
          display: "flex", alignItems: "center", gap: 18,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--hl-clay)", color: "var(--hl-bg)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--hl-font-display)", fontSize: 26,
            flexShrink: 0,
          }}>{profile.avatarInitials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hl-eyebrow">Header block</div>
            <div className="hl-display" style={{ fontSize: 22, margin: "2px 0 4px" }}>{profile.displayName}</div>
            <div style={{ fontSize: 12.5, color: "var(--hl-ink-2)", maxWidth: 520, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {profile.bio}
            </div>
          </div>
          <button className="hl-btn hl-btn-soft" style={{ padding: "8px 12px", fontSize: 12.5 }}>
            <Icon.Pencil size={13} /> Edit profile
          </button>
        </div>

        {/* Links list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {profile.links.map((link, i) => {
            const Ico = Icon[link.icon] || Icon.Link;
            const isActive = link.active;
            return (
              <div key={link.id} className="hl-card" style={{
                padding: 14,
                display: "flex", alignItems: "center", gap: 14,
                opacity: isActive ? 1 : 0.62,
                position: "relative",
              }}>
                <button style={{
                  background: "transparent", border: 0, cursor: "grab",
                  padding: 4, color: "var(--hl-ink-3)",
                }}>
                  <Icon.Drag size={16} />
                </button>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "var(--hl-sage-soft)",
                  color: "var(--hl-sage-deep)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Ico size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{link.title}</div>
                    {link.hot && (
                      <span className="hl-chip hl-chip-clay" style={{ padding: "1px 8px", fontSize: 10.5 }}>
                        <Icon.ArrowUp size={10} /> trending
                      </span>
                    )}
                  </div>
                  <div className="hl-mono" style={{ fontSize: 11.5, color: "var(--hl-ink-3)", marginTop: 2 }}>
                    {link.url}
                  </div>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: "var(--hl-ink-2)", fontSize: 12,
                  paddingRight: 6,
                }}>
                  <Icon.Eye size={13} />
                  <span className="hl-num">{fmt(link.clicks)}</span>
                </div>
                <Toggle on={isActive} />
                <button style={{
                  background: "var(--hl-bg-2)", border: "1px solid var(--hl-line)",
                  borderRadius: 8, padding: 6, cursor: "pointer", color: "var(--hl-ink-2)",
                }}>
                  <Icon.Pencil size={13} />
                </button>
                <button style={{
                  background: "var(--hl-bg-2)", border: "1px solid var(--hl-line)",
                  borderRadius: 8, padding: 6, cursor: "pointer", color: "var(--hl-ink-2)",
                }}>
                  <Icon.Trash size={13} />
                </button>
              </div>
            );
          })}

          {/* Add link button */}
          <button style={{
            padding: 18,
            border: "1.5px dashed var(--hl-line-2)",
            borderRadius: "var(--hl-radius-lg)",
            background: "transparent",
            color: "var(--hl-ink-2)",
            fontSize: 13, fontFamily: "inherit",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "background .12s, border-color .12s",
          }}>
            <Icon.Plus size={15} /> Add a link
          </button>
        </div>

        {/* Plan limit hint */}
        <div className="hl-card" style={{
          marginTop: 18, padding: 14,
          display: "flex", alignItems: "center", gap: 12,
          background: "var(--hl-clay-soft)",
          borderColor: "oklch(from var(--hl-clay) calc(l - 0.05) c h / .25)",
        }}>
          <Icon.Sparkle size={16} color="var(--hl-clay-deep)" />
          <div style={{ flex: 1, fontSize: 12.5, color: "var(--hl-ink)" }}>
            You're using <b>5 of 5</b> free links. Upgrade for unlimited + scheduling.
          </div>
          <button className="hl-btn hl-btn-sage" style={{ padding: "7px 12px", fontSize: 12 }}>
            Upgrade
          </button>
        </div>
      </div>
    </DashShell>
  );
}

function Toggle({ on }) {
  return (
    <span style={{
      width: 36, height: 21, borderRadius: 999,
      background: on ? "var(--hl-sage-deep)" : "var(--hl-line-2)",
      position: "relative",
      transition: "background .15s",
      flexShrink: 0,
    }}>
      <span style={{
        position: "absolute",
        top: 2, left: on ? 17 : 2,
        width: 17, height: 17, borderRadius: 999,
        background: "white",
        boxShadow: "0 1px 2px rgba(0,0,0,.18)",
        transition: "left .15s",
      }} />
    </span>
  );
}

window.DashLinks = DashLinks;
window.Toggle = Toggle;
