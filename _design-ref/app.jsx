// App — composes every screen on the design canvas.

function App() {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "previewTheme": "cream",
    "palette": ["oklch(0.72 0.068 145)", "oklch(0.78 0.082 50)", "oklch(0.978 0.012 84)"],
    "showMobileViews": true,
    "showDesktopViews": true,
    "density": "regular"
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Density tweak adjusts root font-size — most spacing/typography is in em-ish ratios
  const rootFont = t.density === "compact" ? 13 : t.density === "comfy" ? 15 : 14;

  return (
    <div className="hl-root" style={{ fontSize: rootFont }}>
      <DesignCanvas>
        {/* ─── HERO: Public profile theme variants ─── */}
        <DCSection
          id="profile-themes"
          title="Public profile · 5 themes"
          subtitle="The hero. The link-in-bio page is what your visitors actually see — same content, five moods."
        >
          {Object.entries(THEMES).map(([key, theme]) => (
            <DCArtboard key={key} id={`profile-${key}`} label={theme.name} width={390} height={780}>
              <PublicProfile theme={key} profile={SAMPLE_PROFILE} viewport="mobile" />
            </DCArtboard>
          ))}
          <DCArtboard id="profile-desktop" label="Desktop · shared view (Linen)" width={1240} height={780}>
            <PublicProfileDesktop theme={t.previewTheme} profile={SAMPLE_PROFILE} />
          </DCArtboard>
        </DCSection>

        {/* ─── Marketing + auth ─── */}
        <DCSection
          id="marketing"
          title="Marketing & onboarding"
          subtitle="Landing, sign-up, sign-in. Same paper, same voice."
        >
          <DCArtboard id="landing-desk" label="Landing · desktop" width={1280} height={1380}>
            <Landing viewport="desktop" />
          </DCArtboard>
          <DCArtboard id="landing-mob" label="Landing · mobile" width={390} height={1180}>
            <Landing viewport="mobile" />
          </DCArtboard>
          <DCArtboard id="signup" label="Sign up" width={980} height={680}>
            <AuthScreen mode="signup" />
          </DCArtboard>
          <DCArtboard id="login" label="Sign in" width={980} height={680}>
            <AuthScreen mode="login" />
          </DCArtboard>
        </DCSection>

        {/* ─── Dashboard ─── */}
        <DCSection
          id="dashboard"
          title="Dashboard"
          subtitle="Links · Appearance · Analytics · Billing · Settings. Live preview rail keeps the work honest."
        >
          <DCArtboard id="dash-links" label="Dashboard · Links" width={1440} height={900}>
            <DashLinks />
          </DCArtboard>
          <DCArtboard id="dash-appearance" label="Dashboard · Appearance" width={1440} height={900}>
            <DashAppearance selectedTheme={t.previewTheme} onTheme={(v) => setTweak("previewTheme", v)} />
          </DCArtboard>
          <DCArtboard id="dash-analytics" label="Dashboard · Analytics" width={1440} height={900}>
            <DashAnalytics />
          </DCArtboard>
          <DCArtboard id="dash-billing" label="Dashboard · Billing" width={1440} height={900}>
            <DashBilling />
          </DCArtboard>
          <DCArtboard id="dash-settings" label="Dashboard · Settings" width={1440} height={900}>
            <DashSettings />
          </DCArtboard>
        </DCSection>

        {/* ─── Mobile dashboard ─── */}
        <DCSection
          id="mobile-dash"
          title="Dashboard on mobile"
          subtitle="The dashboard is responsive too — most editing happens on a phone, between two coffees."
        >
          <DCArtboard id="m-dash-links" label="Mobile · Links" width={390} height={780}>
            <MobileDashLinks />
          </DCArtboard>
          <DCArtboard id="m-dash-stats" label="Mobile · Analytics" width={390} height={780}>
            <MobileDashAnalytics />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      {/* Tweaks panel */}
      <TweaksPanel>
        <TweakSection label="Public profile" />
        <TweakSelect
          label="Preview theme"
          value={t.previewTheme}
          options={Object.entries(THEMES).map(([k, v]) => ({ value: k, label: v.name }))}
          onChange={(v) => setTweak("previewTheme", v)}
        />
        <TweakSection label="App chrome" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)}
        />
        <TweakSection label="Notes" />
        <div style={{
          fontSize: 11, color: "rgba(40,30,20,.65)", lineHeight: 1.5,
          padding: "0 4px 4px",
        }}>
          <p style={{ margin: "0 0 8px" }}>
            Click any artboard's expand icon (top-right on hover) to view it fullscreen. Drag the grip to reorder.
          </p>
          <p style={{ margin: 0 }}>
            Preview theme drives the desktop hero and the appearance-editor right rail.
          </p>
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
