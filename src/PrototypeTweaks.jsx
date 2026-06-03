// PrototypeTweaks.jsx — exposes state toggles in a floating Tweaks panel.
// Drives the prototype's demo state: setup phase, EHR selection, nav lock.

function PrototypeTweaks({ state, patch, reset, go, route }) {
  // setup phase as a single radio: "collecting" | "review" | "ready"
  const setPhase = (phase) => {
    if (phase === "collecting") {
      patch({
        phase: "collecting",
        navUnlocked: false,
        setup: { business: "todo", channels: "done", tollfree: "todo", ehr: "todo", review: "locked" },
        tfn: { ...state.tfn, state: "verify_needed" },
      });
    } else if (phase === "submitted") {
      patch({
        phase: "collecting",
        navUnlocked: false,
        setup: { business: "submitted", channels: "done", tollfree: "submitted", ehr: "submitted", review: "review" },
        tfn: { ...state.tfn, state: "carrier_review" },
      });
    } else if (phase === "review") {
      patch({
        phase: "review",
        navUnlocked: false,
        setup: { business: "done", channels: "done", tollfree: "submitted", ehr: "done", review: "review" },
        tfn: { ...state.tfn, state: "carrier_review" },
      });
    } else if (phase === "ready") {
      patch({
        phase: "ready",
        navUnlocked: true,
        setup: { business: "done", channels: "done", tollfree: "done", ehr: "done", review: "done" },
        tfn: { ...state.tfn, state: "ready" },
      });
    }
  };

  // What phase string the radio shows right now
  const phase =
    state.setup.review === "done"      ? "ready" :
    state.setup.review === "review"    ? "review" :
    state.setup.business === "submitted" ? "submitted" :
                                          "collecting";

  const channels = state.channels || [];
  const toggleCh = (id) => {
    const next = channels.includes(id) ? channels.filter((c) => c !== id) : [...channels, id];
    patch({ channels: next });
  };

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Flow overview">
        <button onClick={() => go("flow")}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 12px",
                  borderRadius: 4, border: "1px solid var(--mud-primary)",
                  background: route === "flow" ? "rgba(89,74,226,.08)" : "var(--mud-surface)",
                  color: "var(--mud-primary)", fontSize: 13, fontWeight: 500,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                }}>
          <Icon name="apps" size={18} />
          Back to all screens
        </button>
        <div className="muted-sm" style={{ marginTop: 8, fontSize: 12 }}>
          Browse every screen with one click and apply preset demo scenarios.
        </div>
      </TweakSection>

      <TweakSection title="Apply scenario">
        <div className="col" style={{ gap: 6 }}>
          {(window.SCENARIOS || []).map((s) => (
            <button key={s.id}
                    onClick={() => (window.applyScenario || (() => {}))(s, patch, state)}
                    style={{
                      textAlign: "left", padding: "8px 10px", borderRadius: 4,
                      border: "1px solid rgba(0,0,0,.12)",
                      background: "transparent",
                      color: "var(--mud-text-primary)",
                      fontSize: 12, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
              <Icon name={s.icon} outlined size={16}
                    style={{ color: "var(--mud-text-secondary)" }} />
              <span style={{ flex: 1 }}>{s.label}</span>
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Jump to screen">
        <div className="col" style={{ gap: 6 }}>
          {[
            { id: "signup", label: "1. Sign up" },
            { id: "survey/1", label: "2. Survey — Practice" },
            { id: "survey/2", label: "3. Survey — Channels" },
            { id: "survey/3", label: "4. Survey — EHR" },
            { id: "dashboard", label: "5. Pending dashboard" },
            { id: "setup/business", label: "6. Setup — Business" },
            { id: "setup/tollfree", label: "7. Setup — Toll-free" },
            { id: "setup/ehr", label: "8. Setup — EHR" },
            { id: "setup/review", label: "9. Setup — Review" },
            { id: "first-message/1", label: "10. First message — Name" },
            { id: "first-message/2", label: "11. First message — Message" },
            { id: "first-message/3", label: "12. First message — Schedule" },
            { id: "first-message/4", label: "13. First message — Launch" },
            { id: "live", label: "14. Live dashboard (empty)" },
          ].map((r) => (
            <button key={r.id}
                    onClick={() => go(r.id)}
                    style={{
                      textAlign: "left", padding: "6px 10px", borderRadius: 4,
                      border: "1px solid " + (route === r.id ? "var(--mud-primary)" : "rgba(0,0,0,.12)"),
                      background: route === r.id ? "rgba(89,74,226,.08)" : "transparent",
                      color: route === r.id ? "var(--mud-primary)" : "var(--mud-text-primary)",
                      fontSize: 12, cursor: "pointer", fontWeight: route === r.id ? 500 : 400,
                    }}>
              {r.label}
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Setup phase">
        <div className="col" style={{ gap: 6 }}>
          {[
            { id: "collecting", label: "Collecting info (default)" },
            { id: "submitted",  label: "All submitted, in review" },
            { id: "review",     label: "Inphonite review (mostly done)" },
            { id: "ready",      label: "Fully approved — account live" },
          ].map((opt) => (
            <button key={opt.id}
                    onClick={() => setPhase(opt.id)}
                    style={{
                      textAlign: "left", padding: "8px 10px", borderRadius: 4,
                      border: "1px solid " + (phase === opt.id ? "var(--mud-primary)" : "rgba(0,0,0,.12)"),
                      background: phase === opt.id ? "rgba(89,74,226,.08)" : "transparent",
                      color: phase === opt.id ? "var(--mud-primary)" : "var(--mud-text-primary)",
                      fontSize: 13, cursor: "pointer", fontWeight: phase === opt.id ? 500 : 400,
                    }}>
              {opt.label}
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Communication channels">
        <div className="col" style={{ gap: 6 }}>
          {[
            { id: "sms",   label: "SMS / Text" },
            { id: "voice", label: "Voice" },
            { id: "email", label: "Email" },
          ].map((c) => (
            <label key={c.id} className="row" style={{ gap: 8, cursor: "pointer", fontSize: 13 }}
                   onClick={() => toggleCh(c.id)}>
              <span className={"cb" + (channels.includes(c.id) ? " on" : "")}></span>
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Scheduling system">
        <div className="col" style={{ gap: 6 }}>
          {[
            { id: "dentrix",   label: "Dentrix (supported)" },
            { id: "athenahealth", label: "athenahealth (supported)" },
            { id: "epic",      label: "Epic (supported)" },
            { id: "other",     label: "Not listed (concierge)" },
            { id: "manual",    label: "Manual scheduling (concierge)" },
          ].map((opt) => (
            <button key={opt.id}
                    onClick={() => patch({ ehr: opt.id })}
                    style={{
                      textAlign: "left", padding: "6px 10px", borderRadius: 4,
                      border: "1px solid " + (state.ehr === opt.id ? "var(--mud-primary)" : "rgba(0,0,0,.12)"),
                      background: state.ehr === opt.id ? "rgba(89,74,226,.08)" : "transparent",
                      color: state.ehr === opt.id ? "var(--mud-primary)" : "var(--mud-text-primary)",
                      fontSize: 12, cursor: "pointer", fontWeight: state.ehr === opt.id ? 500 : 400,
                    }}>
              {opt.label}
            </button>
          ))}
        </div>
      </TweakSection>

      <TweakSection title="Navigation">
        <label className="row" style={{ gap: 8, cursor: "pointer", fontSize: 13 }}
               onClick={() => patch({ navUnlocked: !state.navUnlocked })}>
          <span className={"cb" + (state.navUnlocked ? " on" : "")}></span>
          <span>Unlock full product nav</span>
        </label>
        <div className="muted-sm" style={{ marginTop: 6 }}>
          When off, the drawer shows locked items below the "Available after setup" group.
        </div>
      </TweakSection>

      <TweakSection title="Demo controls">
        <button
          onClick={() => { reset(); go("signup"); }}
          style={{
            width: "100%", padding: "8px 10px", borderRadius: 4,
            border: "1px solid rgba(244,67,54,.5)",
            background: "transparent", color: "var(--mud-error)",
            fontSize: 13, cursor: "pointer", fontWeight: 500,
            textTransform: "uppercase", letterSpacing: .4,
          }}>
          Reset demo state
        </button>
      </TweakSection>
    </TweaksPanel>
  );
}

Object.assign(window, { PrototypeTweaks });
