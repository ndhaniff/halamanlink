// Marketing landing page — soft cream paper, editorial type.

function Landing({ viewport = "desktop" }) {
  const mobile = viewport === "mobile";
  return (
    <div className="hl-grain" style={{
      background: "var(--hl-bg)",
      minHeight: "100%",
      width: "100%",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top nav */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "20px 22px" : "26px 56px",
        position: "relative", zIndex: 2,
      }}>
        <HLWordmark size={mobile ? 14 : 16} color="var(--hl-ink)" />
        {!mobile && (
          <nav style={{ display: "flex", gap: 30, fontSize: 14, color: "var(--hl-ink-2)" }}>
            <a style={{ color: "inherit", textDecoration: "none" }}>Features</a>
            <a style={{ color: "inherit", textDecoration: "none" }}>Themes</a>
            <a style={{ color: "inherit", textDecoration: "none" }}>Pricing</a>
            <a style={{ color: "inherit", textDecoration: "none" }}>Changelog</a>
          </nav>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!mobile && <a style={{ fontSize: 14, color: "var(--hl-ink-2)", textDecoration: "none" }}>Log in</a>}
          <button className="hl-btn hl-btn-primary" style={{ padding: mobile ? "8px 14px" : "10px 18px", fontSize: 13 }}>
            Claim your link
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        padding: mobile ? "40px 22px 56px" : "60px 80px 80px",
        position: "relative",
      }}>
        {/* Decorative blob */}
        <div aria-hidden style={{
          position: "absolute",
          top: mobile ? 80 : 40, right: mobile ? -120 : -100,
          width: mobile ? 280 : 480, height: mobile ? 280 : 480,
          borderRadius: "50%",
          background: "var(--hl-sage)",
          opacity: 0.18,
          filter: "blur(70px)",
        }} />
        <div aria-hidden style={{
          position: "absolute",
          bottom: mobile ? -40 : -80, left: mobile ? -100 : -60,
          width: mobile ? 200 : 380, height: mobile ? 200 : 380,
          borderRadius: "50%",
          background: "var(--hl-clay)",
          opacity: 0.16,
          filter: "blur(70px)",
        }} />

        <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
          <span className="hl-chip hl-chip-sage" style={{ marginBottom: 20 }}>
            <span className="hl-dot" style={{ background: "var(--hl-sage-deep)" }} />
            new — themed appearance editor
          </span>
          <h1 className="hl-display" style={{
            fontSize: mobile ? 56 : 112,
            margin: "16px 0 0",
            color: "var(--hl-ink)",
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            maxWidth: 940,
          }}>
            One quiet page<br />
            for everywhere<br />
            <em className="hl-italic" style={{ color: "var(--hl-sage-deep)" }}>you are.</em>
          </h1>
          <p style={{
            marginTop: 28, maxWidth: 520,
            fontSize: mobile ? 16 : 19,
            color: "var(--hl-ink-2)",
            lineHeight: 1.5,
          }}>
            Halamanlink is a calm link-in-bio for makers, writers and small studios. Bring your audience to a page that finally looks like you — on your own subdomain, with analytics that respect them.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
            <button className="hl-btn hl-btn-primary" style={{ padding: "13px 22px", fontSize: 14 }}>
              Start free
              <Icon.ArrowRight size={15} />
            </button>
            <button className="hl-btn hl-btn-ghost" style={{ padding: "13px 22px", fontSize: 14 }}>
              See a live page
            </button>
          </div>
          <div style={{
            marginTop: 22, display: "flex", gap: 18, alignItems: "center",
            color: "var(--hl-ink-3)", fontSize: 12.5,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon.Check size={14} color="var(--hl-sage-deep)" /> 5 links free, forever
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon.Check size={14} color="var(--hl-sage-deep)" /> No credit card
            </span>
            {!mobile && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon.Check size={14} color="var(--hl-sage-deep)" /> Your subdomain in 30s
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Feature row — three quiet tiles */}
      <section style={{
        padding: mobile ? "20px 22px 56px" : "20px 80px 100px",
        position: "relative",
      }}>
        <div style={{
          maxWidth: 1080, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
          gap: 16,
        }}>
          {[
            { eyebrow: "01 — Themes", title: "Five quiet presets.", body: "Linen, Sage, Dusk, Clay, Noir. Tune type, radius and accent without touching CSS." },
            { eyebrow: "02 — Analytics", title: "Clicks that don't creep.", body: "Hashed IPs, no third-party trackers. See the link that's working today, not last quarter." },
            { eyebrow: "03 — Domains", title: "Your subdomain ships first.", body: "you.halamanlink.app instantly. Bring your own domain when you upgrade to Pro." },
          ].map((f, i) => (
            <div key={i} className="hl-card hl-grain" style={{ padding: 26, position: "relative" }}>
              <div className="hl-eyebrow">{f.eyebrow}</div>
              <h3 className="hl-display" style={{ fontSize: 28, margin: "10px 0 8px", lineHeight: 1.05 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--hl-ink-2)", margin: 0, lineHeight: 1.55 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quiet pricing strip */}
      {!mobile && (
        <section style={{ padding: "0 80px 80px" }}>
          <div className="hl-card" style={{
            maxWidth: 1080, margin: "0 auto", padding: 40,
            display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 40,
            background: "var(--hl-sage-soft)",
            border: "1px solid oklch(from var(--hl-sage) calc(l - 0.05) c h / .25)",
          }}>
            <div>
              <div className="hl-eyebrow" style={{ color: "var(--hl-sage-deep)" }}>Pricing</div>
              <h3 className="hl-display" style={{ fontSize: 36, margin: "10px 0 6px" }}>
                Free, until you outgrow it.
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--hl-ink-2)", margin: 0 }}>
                Upgrade when you need a custom domain or more than five links. No surprises.
              </p>
            </div>
            <div>
              <div className="hl-eyebrow">Free</div>
              <div className="hl-display" style={{ fontSize: 44, margin: "6px 0" }}>$0</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", color: "var(--hl-ink-2)", fontSize: 13, lineHeight: 1.9 }}>
                <li>5 links</li>
                <li>2 themes</li>
                <li>7-day analytics</li>
              </ul>
            </div>
            <div>
              <div className="hl-eyebrow" style={{ color: "var(--hl-clay-deep)" }}>Pro</div>
              <div className="hl-display" style={{ fontSize: 44, margin: "6px 0" }}>
                $6<span style={{ fontSize: 18, color: "var(--hl-ink-3)" }}> /mo</span>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", color: "var(--hl-ink-2)", fontSize: 13, lineHeight: 1.9 }}>
                <li>Unlimited links · all themes</li>
                <li>Custom domain</li>
                <li>Full analytics history</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        padding: mobile ? "30px 22px" : "30px 80px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "var(--hl-ink-3)", fontSize: 12,
        borderTop: "1px solid var(--hl-line)",
      }}>
        <HLWordmark size={12} color="var(--hl-ink-3)" />
        <span>© 2026 · made slowly</span>
      </footer>
    </div>
  );
}

window.Landing = Landing;
