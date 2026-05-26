// Auth — signup + login. Editorial split layout.

function AuthScreen({ mode = "signup", viewport = "desktop" }) {
  const mobile = viewport === "mobile";
  const isSignup = mode === "signup";

  return (
    <div style={{
      height: "100%", width: "100%",
      display: "grid",
      gridTemplateColumns: mobile ? "1fr" : "1.05fr 1fr",
      background: "var(--hl-bg)",
      fontFamily: "var(--hl-font-ui)",
    }}>
      {/* Left — quiet brand panel */}
      {!mobile && (
        <div className="hl-grain" style={{
          background: "var(--hl-sage-soft)",
          padding: "44px 52px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          borderRight: "1px solid var(--hl-line)",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden style={{
            position: "absolute", top: -120, right: -80,
            width: 360, height: 360, borderRadius: "50%",
            background: "var(--hl-sage)", opacity: 0.35, filter: "blur(80px)",
          }} />
          <HLWordmark size={15} color="var(--hl-ink)" />
          <div style={{ position: "relative" }}>
            <div className="hl-eyebrow" style={{ color: "var(--hl-sage-deep)" }}>
              {isSignup ? "A new garden of links" : "Welcome back"}
            </div>
            <h2 className="hl-display" style={{
              fontSize: 56, margin: "12px 0 0", lineHeight: 1.0, letterSpacing: "-0.02em",
              color: "var(--hl-ink)",
            }}>
              {isSignup ? (
                <>Plant your<br /><em className="hl-italic">corner of the web.</em></>
              ) : (
                <>Pick up where<br /><em className="hl-italic">you left off.</em></>
              )}
            </h2>
            <p style={{ marginTop: 18, maxWidth: 360, color: "var(--hl-ink-2)", fontSize: 14, lineHeight: 1.55 }}>
              {isSignup
                ? "Your subdomain is yours in seconds. Five themes, no setup, no tracking pixels."
                : "Your links, themes and analytics are right where you left them."}
            </p>
          </div>
          <div style={{ position: "relative", color: "var(--hl-ink-3)", fontSize: 12, display: "flex", gap: 14 }}>
            <span>halamanlink.app</span>
            <span>·</span>
            <span>v2.4 — soft launch</span>
          </div>
        </div>
      )}

      {/* Right — form */}
      <div style={{
        padding: mobile ? "44px 22px" : "44px 60px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative",
      }}>
        {mobile && (
          <div style={{ position: "absolute", top: 20, left: 22 }}>
            <HLWordmark size={14} color="var(--hl-ink)" />
          </div>
        )}
        <div style={{ maxWidth: 380, width: "100%", margin: mobile ? "40px auto 0" : "0 auto 0", marginLeft: mobile ? "auto" : 0 }}>
          <h1 className="hl-display" style={{ fontSize: 40, margin: 0, letterSpacing: "-0.01em" }}>
            {isSignup ? "Create your page" : "Sign in"}
          </h1>
          <p style={{ color: "var(--hl-ink-2)", marginTop: 8, fontSize: 13.5 }}>
            {isSignup
              ? <>Already have one? <a style={{ color: "var(--hl-sage-deep)" }}>Sign in →</a></>
              : <>No account yet? <a style={{ color: "var(--hl-sage-deep)" }}>Start free →</a></>}
          </p>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            {isSignup && (
              <div>
                <label className="hl-label">Choose your link</label>
                <div style={{
                  display: "flex", alignItems: "stretch",
                  border: "1px solid var(--hl-line-2)",
                  borderRadius: "var(--hl-radius)",
                  background: "var(--hl-bg)",
                  overflow: "hidden",
                }}>
                  <input
                    defaultValue="mayahern"
                    className="hl-input"
                    style={{ border: 0, borderRadius: 0, background: "transparent", flex: 1 }}
                  />
                  <span style={{
                    display: "grid", placeItems: "center", padding: "0 14px",
                    background: "var(--hl-bg-2)",
                    borderLeft: "1px solid var(--hl-line)",
                    color: "var(--hl-ink-3)", fontSize: 13,
                    fontFamily: "var(--hl-font-mono)",
                  }}>
                    .halamanlink.app
                  </span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "var(--hl-sage-deep)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon.Check size={13} /> mayahern.halamanlink.app is available
                </div>
              </div>
            )}
            <div>
              <label className="hl-label">Email</label>
              <input className="hl-input" defaultValue="maya@morningbread.shop" />
            </div>
            <div>
              <label className="hl-label">Password</label>
              <input className="hl-input" type="password" defaultValue="••••••••" />
              {!isSignup && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  <a style={{ color: "var(--hl-ink-2)" }}>Forgot password?</a>
                </div>
              )}
            </div>

            <button className="hl-btn hl-btn-primary" style={{ padding: 14, width: "100%", justifyContent: "center", marginTop: 6 }}>
              {isSignup ? "Plant my page" : "Sign in"}
              <Icon.ArrowRight size={15} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--hl-ink-3)", fontSize: 11, margin: "6px 0" }}>
              <div style={{ flex: 1, height: 1, background: "var(--hl-line)" }} />
              <span>OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--hl-line)" }} />
            </div>

            <button className="hl-btn hl-btn-ghost" style={{ padding: 12, width: "100%", justifyContent: "center" }}>
              <Icon.Mail size={15} /> Continue with magic link
            </button>
          </div>

          <p style={{ marginTop: 24, color: "var(--hl-ink-3)", fontSize: 11.5, lineHeight: 1.55 }}>
            By continuing you agree to our terms and privacy notice. We don't sell visitor data, ever.
          </p>
        </div>
      </div>
    </div>
  );
}

window.AuthScreen = AuthScreen;
