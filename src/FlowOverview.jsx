// FlowOverview.jsx — landing page showing every screen organized by section.
// Clients use this to navigate the prototype during review.
// Each screen card click jumps to its route. Scenario chips apply preset state.

// =========================================================
// Scenario presets — apply multiple state changes at once.
// Each scenario describes a coherent "moment" in the journey.
// =========================================================
const SCENARIOS = [
  {
    id: "fresh",
    label: "Just signed up",
    desc: "Brand-new account, survey complete, nothing submitted yet.",
    accent: "primary",
    icon: "fiber_new",
    state: {
      navUnlocked: false,
      channels: ["sms", "voice"],
      ehr: "dentrix",
      setup: { business: "todo", channels: "done", tollfree: "todo", ehr: "todo", review: "locked" },
      tfn: { state: "verify_needed" },
    },
  },
  {
    id: "mid",
    label: "Mid setup",
    desc: "Some steps submitted, others still pending. Common review state.",
    accent: "warning",
    icon: "edit_note",
    state: {
      navUnlocked: false,
      channels: ["sms", "voice"],
      ehr: "dentrix",
      setup: { business: "submitted", channels: "done", tollfree: "todo", ehr: "in_progress", review: "locked" },
      tfn: { state: "verify_needed" },
    },
  },
  {
    id: "review",
    label: "In Inphonite review",
    desc: "Everything submitted. Account is in Inphonite's review queue.",
    accent: "info",
    icon: "schedule",
    state: {
      navUnlocked: false,
      channels: ["sms", "voice"],
      ehr: "dentrix",
      setup: { business: "done", channels: "done", tollfree: "submitted", ehr: "done", review: "review" },
      tfn: { state: "carrier_review" },
    },
  },
  {
    id: "ready",
    label: "Approved & live",
    desc: "Account active, number provisioned, ready to send first message.",
    accent: "success",
    icon: "rocket_launch",
    state: {
      navUnlocked: true,
      channels: ["sms", "voice"],
      ehr: "dentrix",
      setup: { business: "done", channels: "done", tollfree: "done", ehr: "done", review: "done" },
      tfn: { state: "ready" },
    },
  },
  {
    id: "voice-only",
    label: "Voice-only practice",
    desc: "No SMS — toll-free setup hidden, voice flow shown.",
    accent: "primary",
    icon: "phone",
    state: {
      navUnlocked: false,
      channels: ["voice"],
      ehr: "athenahealth",
      setup: { business: "todo", channels: "done", tollfree: "todo", ehr: "todo", review: "locked" },
    },
  },
  {
    id: "concierge",
    label: "Concierge EHR path",
    desc: "Practice uses unlisted system — drives concierge onboarding.",
    accent: "info",
    icon: "support_agent",
    state: {
      navUnlocked: false,
      channels: ["sms", "voice"],
      ehr: "other",
      setup: { business: "todo", channels: "done", tollfree: "todo", ehr: "todo", review: "locked" },
    },
  },
];

// Apply a scenario by merging its state over current
function applyScenario(scenario, patch, state) {
  patch((prev) => ({
    ...prev,
    ...scenario.state,
    tfn: { ...prev.tfn, ...(scenario.state.tfn || {}) },
    setup: { ...prev.setup, ...(scenario.state.setup || {}) },
  }));
}

// =========================================================
// Screen catalog — used for the overview grid AND tweaks jump list.
// Edit labels/desc here and they show up everywhere.
// =========================================================
const SCREEN_SECTIONS = [
  {
    id: "auth",
    title: "Account creation",
    desc: "Lightweight signup before the onboarding survey.",
    screens: [
      { id: "signup",   label: "Sign up",            desc: "Create the Inphonite account", icon: "person_add", swatch: "auth" },
    ],
  },
  {
    id: "survey",
    title: "Onboarding survey",
    desc: "Three-step practice profile so we tailor the rest of setup.",
    screens: [
      { id: "survey/1", label: "Practice info",      desc: "Name, type, team size, role",   icon: "business",   swatch: "survey" },
      { id: "survey/2", label: "Channels & goals",   desc: "SMS / Voice / Email + use cases", icon: "settings_input_antenna", swatch: "survey" },
      { id: "survey/3", label: "Scheduling system",  desc: "EHR picker with supported chips", icon: "calendar_month", swatch: "survey" },
    ],
  },
  {
    id: "dashboard",
    title: "Pending account",
    desc: "Primary hub during setup. Drives every other step.",
    screens: [
      { id: "dashboard", label: "Pending dashboard", desc: "Hero, checklist, progress, support", icon: "dashboard", swatch: "dash", wide: true },
    ],
  },
  {
    id: "setup",
    title: "Setup detail screens",
    desc: "Each checklist item opens its own focused screen.",
    screens: [
      { id: "setup/business", label: "Business verification",  desc: "EIN, BAA, SMS consent",                 icon: "verified_user", swatch: "setup" },
      { id: "setup/channels", label: "Communication prefs",    desc: "Toggle SMS / Voice / Email",            icon: "tune",          swatch: "setup" },
      { id: "setup/tollfree", label: "Toll-free number",       desc: "Comm type, clinic location, number",     icon: "phone_iphone",  swatch: "setup" },
      { id: "setup/ehr",      label: "Connect data",           desc: "Supported API or concierge branch",      icon: "sync_alt",      swatch: "setup" },
      { id: "setup/review",   label: "Inphonite review",       desc: "Read-only — account in review",          icon: "fact_check",    swatch: "setup" },
    ],
  },
  {
    id: "msg",
    title: "Send first message",
    desc: "Unlocked once setup is approved. Four-step wizard.",
    screens: [
      { id: "first-message/1", label: "Name", desc: "Campaign name + Quick Tip",        icon: "edit_note",  swatch: "msg" },
      { id: "first-message/2", label: "Message", desc: "SMS content + variable inserts", icon: "chat",       swatch: "msg" },
      { id: "first-message/3", label: "Schedule", desc: "When reminders send",            icon: "schedule",   swatch: "msg" },
      { id: "first-message/4", label: "Launch", desc: "Campaign Launched 🎉 success",    icon: "celebration", swatch: "msg" },
    ],
  },
  {
    id: "live",
    title: "Approved & live",
    desc: "The product the account graduates into once verification clears.",
    screens: [
      { id: "live", label: "Live dashboard (empty)", desc: "Post-approval home, fresh empty state", icon: "dashboard", swatch: "dash", wide: true },
    ],
  },
];

// =========================================================
// Flow Overview screen — minimal landing
// =========================================================
function FlowOverview({ state, patch, go, reset }) {
  return (
    <div data-screen-label="00 Flow Overview" className="page-center" style={{ background: "#FAFAFA" }}>
      <div className="topbar">
        <img src="design-system/logo-inphonite.svg" alt="Inphonite" />
        <span style={{ marginLeft: 8, fontWeight: 500, color: "var(--mud-text-primary)" }}>Inphonite</span>
        <span className="status-chip-l" style={{
          background: "rgba(89,74,226,.08)", color: "var(--mud-primary)", marginLeft: 12,
        }}>
          <Icon name="design_services" outlined size={12} /> Onboarding Prototype
        </span>
        <div className="spacer" />
        <span className="muted-sm">v1 · {new Date().toLocaleDateString()}</span>
      </div>

      <div className="body-center">
        <div style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--mud-surface)",
          border: "1px solid rgba(0,0,0,.08)",
          borderRadius: 4,
          boxShadow: "var(--elev-1)",
          padding: "32px 36px",
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 4,
            background: "rgba(89,74,226,.08)", color: "var(--mud-primary)",
            display: "grid", placeItems: "center", marginBottom: 20,
          }}>
            <Icon name="design_services" outlined size={32} />
          </div>
          <div style={{
            font: "500 22px/30px var(--font-family-sans)",
            letterSpacing: .15, color: "var(--mud-text-primary)",
          }}>
            This is a working prototype.
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 28, width: "100%" }}>
            <MudButton variant="outlined" color="default"
                       onClick={() => { if (confirm("Reset all prototype state?")) { reset(); go("flow"); } }}
                       startIcon="restart_alt"
                       style={{ flex: 1 }}>
              Reset demo state
            </MudButton>
            <MudButton color="primary" onClick={() => go("signup")} endIcon="arrow_forward"
                       style={{ flex: 1 }}>
              Start at sign-up
            </MudButton>
          </div>
        </div>
      </div>

      <div className="footer-thin">
        <span>© 2026 Inphonite, Inc.</span>
        <div className="spacer-1" />
        <span className="muted-sm">Use the floating Tweaks panel to navigate scenarios and screens.</span>
      </div>
    </div>
  );
}

// Pretty card for one screen in the overview grid
function ScreenCard({ screen, onClick }) {
  const swatches = {
    auth:   { bg: "linear-gradient(135deg, rgba(89,74,226,.08), rgba(89,74,226,.02))", border: "rgba(89,74,226,.15)" },
    survey: { bg: "linear-gradient(135deg, rgba(255,64,129,.07), rgba(255,64,129,.02))", border: "rgba(255,64,129,.15)" },
    dash:   { bg: "linear-gradient(135deg, rgba(89,74,226,.10), rgba(89,74,226,.03))", border: "rgba(89,74,226,.25)" },
    setup:  { bg: "linear-gradient(135deg, rgba(33,150,243,.07), rgba(33,150,243,.02))", border: "rgba(33,150,243,.15)" },
    msg:    { bg: "linear-gradient(135deg, rgba(30,200,165,.08), rgba(30,200,165,.02))", border: "rgba(30,200,165,.18)" },
  };
  const sw = swatches[screen.swatch] || swatches.auth;
  return (
    <button onClick={onClick} style={{
      textAlign: "left", border: "1px solid " + sw.border, borderRadius: 4,
      background: "var(--mud-surface)", boxShadow: "var(--elev-1)",
      padding: 0, cursor: "pointer",
      overflow: "hidden",
      transition: "all .15s var(--easing-standard)",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--elev-4)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--elev-1)"; e.currentTarget.style.transform = ""; }}>
      <div style={{
        height: 96, background: sw.bg, padding: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid " + sw.border,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 4,
          background: "var(--mud-surface)", boxShadow: "var(--elev-2)",
          display: "grid", placeItems: "center",
          color: "var(--mud-primary)",
        }}>
          <Icon name={screen.icon} outlined size={28} />
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--mud-text-primary)", letterSpacing: .15 }}>
          {screen.label}
        </div>
        <div style={{ fontSize: 12, color: "var(--mud-text-secondary)", marginTop: 2, lineHeight: "17px" }}>
          {screen.desc}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10,
                      fontSize: 11, color: "var(--mud-primary)", fontWeight: 500,
                      textTransform: "uppercase", letterSpacing: .5 }}>
          Open
          <Icon name="arrow_forward" size={14} />
        </div>
      </div>
    </button>
  );
}

Object.assign(window, { FlowOverview, SCENARIOS, SCREEN_SECTIONS, applyScenario });
