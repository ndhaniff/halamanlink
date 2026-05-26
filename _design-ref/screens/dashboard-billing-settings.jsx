// Dashboard — Billing + Settings.

function DashBilling({ profile = SAMPLE_PROFILE }) {
  return (
    <DashShell active="billing" profile={profile} showPreview={false}>
      <DashHeader
        title="Billing"
        subtitle="Currently on the Free plan."
      />
      <div style={{ padding: 28, overflow: "auto", height: "calc(100% - 86px)", maxWidth: 980 }}>
        {/* Current plan strip */}
        <div className="hl-card" style={{
          padding: 24, display: "flex", alignItems: "center", gap: 22,
          background: "var(--hl-bg)",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "var(--hl-sage-soft)", color: "var(--hl-sage-deep)",
            display: "grid", placeItems: "center",
          }}>
            <Icon.Sparkle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="hl-eyebrow">Current plan</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 4 }}>
              <span className="hl-display" style={{ fontSize: 26 }}>Free</span>
              <span style={{ color: "var(--hl-ink-2)", fontSize: 13 }}>· 5 of 5 links used · 2 themes</span>
            </div>
          </div>
          <button className="hl-btn hl-btn-soft" style={{ padding: "9px 14px", fontSize: 13 }}>
            Manage billing
          </button>
        </div>

        {/* Plan picker */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
          {/* Free */}
          <div className="hl-card" style={{ padding: 26, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="hl-eyebrow">Free</span>
              <span className="hl-chip hl-chip-sage" style={{ padding: "2px 10px", fontSize: 10.5 }}>current</span>
            </div>
            <div className="hl-display" style={{ fontSize: 52, lineHeight: 1, letterSpacing: "-0.02em" }}>
              $0<span style={{ fontSize: 16, color: "var(--hl-ink-3)" }}> /forever</span>
            </div>
            <p style={{ color: "var(--hl-ink-2)", fontSize: 13, margin: "10px 0 20px" }}>
              Everything you need to ship a page in a Sunday afternoon.
            </p>
            <FeatureList items={[
              "5 active links",
              "2 themes — Linen, Sage",
              "7-day analytics",
              "halamanlink.app subdomain",
              "Email support",
            ]} />
          </div>
          {/* Pro */}
          <div className="hl-card hl-grain" style={{
            padding: 26, position: "relative",
            background: "var(--hl-ink)",
            color: "var(--hl-bg)",
            borderColor: "var(--hl-ink)",
          }}>
            <div aria-hidden style={{
              position: "absolute", top: -40, right: -40,
              width: 200, height: 200, borderRadius: "50%",
              background: "var(--hl-clay)", opacity: 0.3, filter: "blur(50px)",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, position: "relative" }}>
              <span className="hl-eyebrow" style={{ color: "oklch(0.78 0.04 60)" }}>Pro</span>
              <span style={{
                fontSize: 10.5, padding: "3px 10px", borderRadius: 999,
                background: "var(--hl-clay)", color: "var(--hl-ink)",
                letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500,
              }}>recommended</span>
            </div>
            <div className="hl-display" style={{ fontSize: 52, lineHeight: 1, letterSpacing: "-0.02em", position: "relative" }}>
              $6<span style={{ fontSize: 16, opacity: 0.6 }}> /mo</span>
            </div>
            <p style={{ color: "oklch(0.78 0.02 60)", fontSize: 13, margin: "10px 0 20px", position: "relative" }}>
              For when one page is doing real work. Billed monthly, cancel anytime.
            </p>
            <FeatureList dark items={[
              "Unlimited links",
              "All 5 themes + future presets",
              "Full analytics history",
              "Custom domain (yourdomain.com)",
              "Priority support",
            ]} />
            <button className="hl-btn" style={{
              marginTop: 22, width: "100%", justifyContent: "center", padding: 14,
              background: "var(--hl-clay)", color: "var(--hl-ink)", fontSize: 13.5,
              position: "relative",
            }}>
              Upgrade to Pro
              <Icon.ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Invoices */}
        <div className="hl-card" style={{ marginTop: 18, padding: 22 }}>
          <SectionHeader eyebrow="history" title="Invoices" />
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column" }}>
            {[
              { date: "—", desc: "No invoices yet", amt: "—", status: "Free plan" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "120px 1fr 100px 120px 40px",
                gap: 12, alignItems: "center",
                padding: "12px 0", borderTop: "1px solid var(--hl-line)",
                fontSize: 13, color: "var(--hl-ink-2)",
              }}>
                <span className="hl-mono" style={{ fontSize: 12 }}>{row.date}</span>
                <span>{row.desc}</span>
                <span className="hl-num">{row.amt}</span>
                <span><span className="hl-chip">{row.status}</span></span>
                <span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashShell>
  );
}

function FeatureList({ items, dark }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5 }}>
          <span style={{
            width: 18, height: 18, borderRadius: "50%",
            background: dark ? "oklch(0.42 0.04 60)" : "var(--hl-sage-soft)",
            color: dark ? "var(--hl-bg)" : "var(--hl-sage-deep)",
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <Icon.Check size={11} strokeWidth={2.2} />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────
function DashSettings({ profile = SAMPLE_PROFILE }) {
  return (
    <DashShell active="settings" profile={profile} showPreview={false}>
      <DashHeader
        title="Settings"
        subtitle="Slug, custom domain, account. Nothing scary."
      />
      <div style={{ padding: 28, overflow: "auto", height: "calc(100% - 86px)", maxWidth: 880 }}>
        {/* Slug */}
        <div className="hl-card" style={{ padding: 24, marginBottom: 16 }}>
          <SectionHeader eyebrow="01" title="Your link" kicker="this is the URL of your public page" />
          <div style={{ marginTop: 16, display: "flex", alignItems: "stretch", border: "1px solid var(--hl-line-2)", borderRadius: "var(--hl-radius)", overflow: "hidden", background: "var(--hl-bg)" }}>
            <span style={{ padding: "11px 14px", color: "var(--hl-ink-3)", fontFamily: "var(--hl-font-mono)", fontSize: 13, background: "var(--hl-bg-2)", borderRight: "1px solid var(--hl-line)" }}>
              https://
            </span>
            <input className="hl-input" defaultValue="mayahern" style={{ border: 0, borderRadius: 0, flex: 1, background: "transparent" }} />
            <span style={{ padding: "11px 14px", color: "var(--hl-ink-3)", fontFamily: "var(--hl-font-mono)", fontSize: 13, background: "var(--hl-bg-2)", borderLeft: "1px solid var(--hl-line)" }}>
              .halamanlink.app
            </span>
          </div>
          <div style={{ marginTop: 10, color: "var(--hl-sage-deep)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon.Check size={13} /> Available · changing your slug breaks old links.
          </div>
        </div>

        {/* Custom domain */}
        <div className="hl-card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <SectionHeader eyebrow="02" title="Custom domain" />
            <span className="hl-chip hl-chip-clay" style={{ padding: "3px 10px" }}>
              <Icon.Lock size={11} /> Pro
            </span>
          </div>
          <p style={{ margin: "10px 0 18px", color: "var(--hl-ink-2)", fontSize: 13 }}>
            Add a domain you own. We'll show you the DNS record to add, then verify automatically.
          </p>
          <label className="hl-label">Domain</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="hl-input" placeholder="links.morningbread.shop" defaultValue="links.morningbread.shop" />
            <button className="hl-btn hl-btn-soft" style={{ padding: "9px 16px" }}>Verify</button>
          </div>

          {/* DNS instructions */}
          <div style={{
            marginTop: 16, padding: 16,
            background: "var(--hl-bg-2)",
            border: "1px dashed var(--hl-line-2)",
            borderRadius: "var(--hl-radius)",
            fontFamily: "var(--hl-font-mono)", fontSize: 12, color: "var(--hl-ink-2)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="hl-eyebrow" style={{ fontFamily: "var(--hl-font-mono)" }}>DNS — add this record</span>
              <span style={{ color: "var(--hl-clay-deep)" }}>● awaiting</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "80px 220px 1fr", gap: 8, lineHeight: 1.7 }}>
              <span style={{ color: "var(--hl-ink-3)" }}>type</span><span>CNAME</span><span></span>
              <span style={{ color: "var(--hl-ink-3)" }}>host</span><span>links</span><span></span>
              <span style={{ color: "var(--hl-ink-3)" }}>value</span><span>app.halamanlink.app</span><span></span>
              <span style={{ color: "var(--hl-ink-3)" }}>ttl</span><span>3600</span><span></span>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="hl-card" style={{ padding: 24, marginBottom: 16 }}>
          <SectionHeader eyebrow="03" title="Account" />
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label className="hl-label">Display name</label>
              <input className="hl-input" defaultValue={profile.displayName} />
            </div>
            <div>
              <label className="hl-label">Email</label>
              <input className="hl-input" defaultValue="maya@morningbread.shop" />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label className="hl-label">Bio</label>
            <textarea className="hl-input" defaultValue={profile.bio} rows={3} style={{ resize: "vertical", fontFamily: "inherit" }} />
          </div>
        </div>

        {/* Danger */}
        <div className="hl-card" style={{
          padding: 22, background: "var(--hl-bg)",
          borderColor: "oklch(from var(--hl-clay) calc(l - 0.05) c h / .3)",
        }}>
          <SectionHeader eyebrow="zone" title="Delete account" />
          <p style={{ margin: "10px 0 14px", color: "var(--hl-ink-2)", fontSize: 13 }}>
            Deletes your profile, links, themes and analytics. Cannot be undone.
          </p>
          <button className="hl-btn hl-btn-ghost" style={{
            color: "var(--hl-clay-deep)",
            borderColor: "oklch(from var(--hl-clay) calc(l - 0.05) c h / .35)",
          }}>
            <Icon.Trash size={14} /> Delete forever
          </button>
        </div>
      </div>
    </DashShell>
  );
}

window.DashBilling = DashBilling;
window.DashSettings = DashSettings;
window.FeatureList = FeatureList;
