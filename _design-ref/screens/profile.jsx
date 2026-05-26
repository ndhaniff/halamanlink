// Public profile — the hero of this design.
// Renders a themed link-in-bio page using the THEMES presets from shared.jsx.

function PublicProfile({ theme = "cream", profile = SAMPLE_PROFILE, viewport = "mobile" }) {
  const t = THEMES[theme];
  const isDark = theme === "dusk" || theme === "noir";

  const pageStyle = {
    background: t.bg,
    color: t.ink,
    minHeight: "100%",
    width: "100%",
    padding: viewport === "mobile" ? "44px 22px 40px" : "60px 28px 48px",
    fontFamily: "var(--hl-font-ui)",
    position: "relative",
    overflow: "hidden",
  };

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    padding: "16px 18px",
    background: t.btnBg,
    border: `1px solid ${t.btnBorder}`,
    color: t.btnFg,
    borderRadius: t.radius,
    fontFamily: "var(--hl-font-ui)",
    fontSize: 14.5,
    fontWeight: 500,
    textAlign: "left",
    cursor: "pointer",
    boxShadow: isDark ? "none" : "0 1px 0 rgba(255,255,255,.4) inset, 0 1px 2px rgba(0,0,0,.04)",
    transition: "transform .15s",
  };

  const ActiveLinks = profile.links.filter((l) => l.active);

  return (
    <div style={pageStyle}>
      {/* Decorative blob — abstract, no plant */}
      <div aria-hidden style={{
        position: "absolute",
        top: -120, right: -80, width: 280, height: 280,
        borderRadius: "50%",
        background: t.accent,
        opacity: theme === "noir" ? 0.15 : (isDark ? 0.18 : 0.12),
        filter: "blur(50px)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", maxWidth: 380, margin: "0 auto" }}>
        {/* Avatar */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: t.accent,
          color: t.bg,
          display: "grid", placeItems: "center",
          margin: "0 auto 18px",
          fontFamily: t.font,
          fontSize: 30,
          fontWeight: t.font.includes("display") ? 400 : 500,
          letterSpacing: t.font.includes("display") ? "0" : "0.04em",
          boxShadow: isDark ? "0 8px 32px rgba(0,0,0,.4)" : "0 8px 32px rgba(40,30,20,.12)",
        }}>
          {profile.avatarInitials}
        </div>

        {/* Name + handle */}
        <h1 style={{
          fontFamily: t.font,
          fontSize: theme === "cream" || theme === "clay" ? 32 : 22,
          fontWeight: 500,
          margin: 0,
          textAlign: "center",
          letterSpacing: t.font.includes("display") ? "-0.01em" : "-0.005em",
          lineHeight: 1.05,
        }}>
          {theme === "cream" || theme === "clay" ? (
            <>{profile.displayName.split(" ")[0]}{" "}<em style={{ fontStyle: "italic" }}>{profile.displayName.split(" ")[1]}</em></>
          ) : profile.displayName}
        </h1>
        <div style={{
          textAlign: "center",
          color: t.muted,
          fontSize: 13,
          marginTop: 6,
          fontFamily: theme === "noir" ? "var(--hl-font-mono)" : "var(--hl-font-ui)",
        }}>
          {theme === "noir" ? `> @${profile.handle}` : `@${profile.handle}`}
        </div>

        {/* Bio */}
        <p style={{
          margin: "18px auto 28px",
          maxWidth: 320,
          textAlign: "center",
          color: t.muted,
          fontSize: 13.5,
          lineHeight: 1.55,
        }}>
          {profile.bio}
        </p>

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ActiveLinks.map((link) => {
            const Ico = Icon[link.icon] || Icon.Link;
            return (
              <a key={link.id} style={linkStyle} href="#" onClick={(e) => e.preventDefault()}>
                <span style={{
                  width: 36, height: 36, borderRadius: t.radius * 0.55,
                  background: isDark ? `${t.accent}22` : `${t.accent}1f`,
                  display: "grid", placeItems: "center",
                  color: t.accent,
                  flexShrink: 0,
                }}>
                  <Ico size={18} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {link.title}
                  </div>
                </span>
                <span style={{ color: t.muted, flexShrink: 0 }}>
                  <Icon.ArrowUpRight size={15} />
                </span>
              </a>
            );
          })}
        </div>

        {/* Footer mark */}
        <div style={{
          marginTop: 36,
          textAlign: "center",
          color: t.muted,
          fontSize: 11,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}>
          <span style={{ fontFamily: t.font, textTransform: "none", letterSpacing: 0, fontSize: 12, opacity: 0.85 }}>
            made on <span style={{ fontStyle: "italic" }}>halamanlink</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// Desktop "shared in browser" view of the profile
function PublicProfileDesktop({ theme = "cream", profile = SAMPLE_PROFILE }) {
  const t = THEMES[theme];
  return (
    <div style={{ height: "100%", width: "100%", background: t.bg, position: "relative", overflow: "hidden" }}>
      {/* Decorative split: left = oversized name, right = mobile-ish stack */}
      <div style={{
        position: "absolute", inset: 0,
        background: t.accent, opacity: 0.06,
      }} />
      <div style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 460px",
        gap: 60,
        padding: "80px 80px",
        height: "100%",
      }}>
        <div style={{ alignSelf: "center", color: t.ink }}>
          <div style={{
            fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: t.muted, marginBottom: 18,
          }}>
            {profile.handle}.halamanlink.app
          </div>
          <h1 style={{
            fontFamily: t.font,
            fontSize: 120,
            lineHeight: 0.92,
            margin: 0,
            letterSpacing: "-0.025em",
            fontWeight: 400,
          }}>
            {profile.displayName.split(" ")[0]}
            <br />
            <em style={{ fontStyle: "italic", color: t.accent }}>
              {profile.displayName.split(" ")[1]}
            </em>
          </h1>
          <p style={{ marginTop: 28, maxWidth: 420, color: t.muted, fontSize: 16, lineHeight: 1.55 }}>
            {profile.bio}
          </p>
        </div>
        <div style={{ alignSelf: "center" }}>
          <PublicProfile theme={theme} profile={profile} viewport="desktop" />
        </div>
      </div>
    </div>
  );
}

window.PublicProfile = PublicProfile;
window.PublicProfileDesktop = PublicProfileDesktop;
