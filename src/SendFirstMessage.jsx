// SendFirstMessage.jsx — 4-step lightweight wizard: Name → Message → Schedule → Launch
// Matches the existing Inphonite messaging flow pattern.
// Routes:
//   first-message            — auto-redirects to first-message/1
//   first-message/1          — Step 1: Name
//   first-message/2          — Step 2: Message
//   first-message/3          — Step 3: Schedule
//   first-message/4          — Step 4: Launch (success)

const WIZ_STEPS = [
  { n: 1, label: "Name" },
  { n: 2, label: "Message" },
  { n: 3, label: "Schedule" },
  { n: 4, label: "Launch" },
];

// Inline numbered stepper that mirrors the reference Inphonite design
function NumberedStepper({ current }) {
  return (
    <div className="mud-stepper-h" style={{ padding: "8px 0 32px" }}>
      {WIZ_STEPS.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <React.Fragment key={s.n}>
            <div className={"s" + (active ? " active" : "") + (done ? " done" : "")}>
              <div className="num" style={{ position: "relative" }}>
                <span>{s.n}</span>
              </div>
              <div className="lbl">{s.label}</div>
            </div>
            {i < WIZ_STEPS.length - 1 && (
              <div className={"line" + (done ? " done" : "")} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Shared page chrome: "← Back to Dashboard   Create Your First Message"
function WizardPageHeader({ go }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "12px 0 16px",
      borderBottom: "1px solid var(--mud-divider)",
      marginBottom: 32,
    }}>
      <a className="setup-back" onClick={() => go("dashboard")} style={{ padding: 0 }}>
        <Icon name="arrow_back" /> Back to Dashboard
      </a>
      <div style={{
        fontSize: 18, fontWeight: 500, letterSpacing: .15,
        color: "var(--mud-text-primary)",
        paddingLeft: 16, borderLeft: "1px solid var(--mud-divider)",
      }}>
        Create Your First Message
      </div>
    </div>
  );
}

// Wraps the wizard card with consistent style
function WizardCard({ children, narrow }) {
  return (
    <div style={{
      maxWidth: narrow ? 520 : 720,
      margin: "0 auto",
      background: "var(--mud-surface)",
      border: "1px solid rgba(0,0,0,.08)",
      borderRadius: 4,
      boxShadow: "var(--elev-1)",
      padding: "36px 40px",
    }}>
      {children}
    </div>
  );
}

// ============================================================
// Step 1 — Name the campaign
// ============================================================
function MsgStep1({ state, patch, go }) {
  const draft = state.msgDraft || { name: "", body: "", schedule: "24" };
  const setName = (v) => patch({ msgDraft: { ...draft, name: v } });

  const valid = (draft.name || "").trim().length > 0;
  const next = () => { if (valid) go("first-message/2"); };

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <WizardPageHeader go={go} />
      <NumberedStepper current={1} />
      <WizardCard narrow>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 4,
            background: "rgba(89,74,226,.08)", color: "var(--mud-primary)",
            display: "grid", placeItems: "center", margin: "0 auto 12px",
          }}>
            <Icon name="event" outlined size={28} />
          </div>
          <h2 style={{
            font: "500 22px/30px var(--font-family-sans)", letterSpacing: .15,
            margin: 0, color: "var(--mud-text-primary)",
          }}>
            Let's start simple
          </h2>
          <div className="muted" style={{ fontSize: 14, marginTop: 6, lineHeight: "20px" }}>
            We'll help you create an appointment reminder campaign.
          </div>
        </div>

        <div className="field-label">Campaign Name</div>
        <MudTextField value={draft.name} onChange={setName}
                      placeholder="e.g., Weekly Appointment Reminders" />
        <div className="muted-sm" style={{ marginTop: 6 }}>
          Give your campaign a name you'll recognize.
        </div>

        <div className="alert info" style={{ marginTop: 24, background: "rgba(89,74,226,.06)", color: "var(--mud-primary)" }}>
          <Icon name="lightbulb" outlined style={{ color: "var(--mud-primary)" }} />
          <span className="flex-1" style={{ color: "var(--mud-text-primary)" }}>
            <strong>Quick tip.</strong> Appointment reminders reduce no-shows by up to 30%. We'll
            help you set one up in under 2 minutes.
          </span>
        </div>

        <div style={{ marginTop: 28 }}>
          <MudButton color="primary" size="lg" disabled={!valid} onClick={next}
                     endIcon="arrow_forward" style={{ width: "100%" }}>
            Continue
          </MudButton>
        </div>
      </WizardCard>
    </div>
  );
}

// ============================================================
// Step 2 — Message content + variables
// ============================================================
const VARIABLES = [
  { token: "FIRST_NAME",      label: "First name" },
  { token: "LAST_NAME",       label: "Last name" },
  { token: "APPOINTMENT_DATE",label: "Appointment date" },
  { token: "APPOINTMENT_TIME",label: "Appointment time" },
];
const DEFAULT_BODY = "Hi (FIRST_NAME), this is a reminder about your appointment with (PROVIDER_NAME) on (APPOINTMENT_DATE) at (APPOINTMENT_TIME). Reply YES to confirm or call us at (555) 123-4567.";

function MsgStep2({ state, patch, go }) {
  const draft = state.msgDraft || { name: "", body: DEFAULT_BODY };
  const body = draft.body || DEFAULT_BODY;
  const setBody = (v) => patch({ msgDraft: { ...draft, body: v } });
  const taRef = React.useRef(null);
  const [preview, setPreview] = React.useState(false);

  const insertToken = (token) => {
    const ta = taRef.current?.querySelector("textarea");
    if (!ta) {
      setBody(body + ` (${token})`);
      return;
    }
    const start = ta.selectionStart, end = ta.selectionEnd;
    const next = body.slice(0, start) + `(${token})` + body.slice(end);
    setBody(next);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + token.length + 2;
    }, 0);
  };

  const previewBody = body
    .replace(/\(FIRST_NAME\)/g, "James")
    .replace(/\(LAST_NAME\)/g, "Patel")
    .replace(/\(PROVIDER_NAME\)/g, "Dr. Hsu")
    .replace(/\(APPOINTMENT_DATE\)/g, "May 28")
    .replace(/\(APPOINTMENT_TIME\)/g, "10:15 AM");

  const valid = body.trim().length > 0;

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <WizardPageHeader go={go} />
      <NumberedStepper current={2} />

      <WizardCard>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{
            font: "500 20px/28px var(--font-family-sans)", letterSpacing: .15,
            margin: 0, color: "var(--mud-text-primary)",
          }}>
            Message Setup
          </h2>
          <div className="muted-sm" style={{ marginTop: 4, fontSize: 13 }}>
            Set up your message blast with basic information, delivery method, and message content.
          </div>
        </div>

        <div className="h-divider" style={{ margin: "16px 0 20px" }} />

        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: .15 }}>
            SMS Message Content <span style={{ color: "var(--mud-error)" }}>*</span>
          </div>
          <div className="spacer-1" />
          <label className="row" style={{ gap: 8, cursor: "pointer", fontSize: 13, color: "var(--mud-text-secondary)" }}
                 onClick={() => setPreview((p) => !p)}>
            <Icon name="visibility" outlined size={18} />
            <span>Preview</span>
            <span style={{
              width: 32, height: 18, borderRadius: 9999,
              background: preview ? "var(--mud-primary)" : "rgba(0,0,0,.26)",
              position: "relative", transition: "background .15s",
            }}>
              <span style={{
                position: "absolute", top: 2, left: preview ? 16 : 2,
                width: 14, height: 14, borderRadius: "50%", background: "#fff",
                boxShadow: "var(--elev-1)", transition: "left .15s",
              }} />
            </span>
          </label>
        </div>

        <div className="field-label">SMS Text Message <span style={{ color: "var(--mud-error)" }}>*</span></div>
        {!preview ? (
          <div ref={taRef}>
            <MudTextField value={body} onChange={setBody} multiline rows={4} />
          </div>
        ) : (
          <div className="composer-preview">
            <div className="sender">{state.practice.name} · {state.tfn.number}</div>
            <div className="bubble">{previewBody}</div>
            <div className="muted-sm" style={{ alignSelf: "flex-end" }}>
              <Icon name="check" size={12} /> Just now
            </div>
          </div>
        )}
        <div className="muted-sm" style={{ marginTop: 6 }}>
          {body.length}/320 characters · Sends as {Math.max(1, Math.ceil(body.length / 160))} SMS segment{body.length > 160 ? "s" : ""}
        </div>

        <div style={{ marginTop: 22 }}>
          <div className="field-label" style={{ marginBottom: 8 }}>Insert Variable</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {VARIABLES.map((v) => (
              <button key={v.token}
                      className="mb outlined default size-sm"
                      onClick={() => insertToken(v.token)}
                      style={{ borderColor: "rgba(0,0,0,.23)" }}>
                <Icon name="add" size={16} />
                <span>{v.label.toUpperCase()}</span>
              </button>
            ))}
            <button className="mb outlined default size-sm" style={{ borderColor: "rgba(0,0,0,.23)" }}>
              <span>MORE VARIABLES</span>
            </button>
          </div>
          <div className="muted-sm" style={{ marginTop: 8 }}>
            Click to insert personalized data like patient names, appointment details, and more.
          </div>
        </div>
      </WizardCard>

      <div style={{ maxWidth: 720, margin: "24px auto 0", display: "flex", gap: 8 }}>
        <MudButton variant="outlined" color="default" onClick={() => go("first-message/1")}>Cancel</MudButton>
        <MudButton variant="outlined" color="default" startIcon="arrow_back" onClick={() => go("first-message/1")}>
          Back
        </MudButton>
        <div className="spacer-1" />
        <MudButton color="primary" disabled={!valid} endIcon="arrow_forward"
                   onClick={() => go("first-message/3")}>
          Next
        </MudButton>
      </div>
    </div>
  );
}

// ============================================================
// Step 3 — Schedule
// ============================================================
const SCHEDULE_OPTIONS = [
  { value: "1",  label: "1 hour before appointment" },
  { value: "2",  label: "2 hours before appointment" },
  { value: "4",  label: "4 hours before appointment" },
  { value: "24", label: "24 hours before appointment" },
  { value: "48", label: "48 hours before appointment" },
];

function MsgStep3({ state, patch, go }) {
  const draft = state.msgDraft || { name: "", body: "", schedule: "24" };
  const setSchedule = (v) => patch({ msgDraft: { ...draft, schedule: v } });
  const sched = draft.schedule || "24";

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <WizardPageHeader go={go} />
      <NumberedStepper current={3} />

      <WizardCard narrow>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "rgba(89,74,226,.08)", color: "var(--mud-primary)",
            display: "grid", placeItems: "center", margin: "0 auto 14px",
          }}>
            <Icon name="schedule" outlined size={32} />
          </div>
          <h2 style={{
            font: "500 22px/30px var(--font-family-sans)", letterSpacing: .15,
            margin: 0, color: "var(--mud-text-primary)",
          }}>
            When should we send?
          </h2>
          <div className="muted" style={{ fontSize: 14, marginTop: 6, lineHeight: "20px" }}>
            Choose when to send your reminder messages.
          </div>
        </div>

        <div className="field-label">Send reminders</div>
        <MudSelect value={sched} onChange={setSchedule} options={SCHEDULE_OPTIONS} icon="schedule" />

        <div className="alert success" style={{ marginTop: 24 }}>
          <Icon name="check_circle" />
          <span className="flex-1">
            Reminders will be sent automatically based on appointments synced from your scheduling
            system. <strong>Approximately 250 patients</strong> with upcoming appointments will receive
            this campaign.
          </span>
        </div>

        <div style={{ marginTop: 28, display: "flex", gap: 8 }}>
          <MudButton variant="outlined" color="default" startIcon="arrow_back"
                     onClick={() => go("first-message/2")}>
            Back
          </MudButton>
          <div className="spacer-1" />
          <MudButton color="primary" endIcon="send" onClick={() => go("first-message/4")}>
            Review &amp; Launch
          </MudButton>
        </div>
      </WizardCard>
    </div>
  );
}

// ============================================================
// Step 4 — Launch (success)
// ============================================================
function MsgStep4({ state, go }) {
  const draft = state.msgDraft || { name: "Weekly Appointment Reminders", schedule: "24" };
  const sched = draft.schedule || "24";
  const sendTime = sched + "h";

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <WizardPageHeader go={go} />
      <NumberedStepper current={5 /* draw all 4 as complete */} />

      <WizardCard narrow>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "var(--mud-success)", color: "#fff",
            display: "grid", placeItems: "center", margin: "0 auto 20px",
          }}>
            <Icon name="check_circle" size={36} />
          </div>
          <h2 style={{
            font: "500 26px/34px var(--font-family-sans)", letterSpacing: .15,
            margin: 0, color: "var(--mud-text-primary)",
          }}>
            Campaign Launched 🎉
          </h2>
          <div className="muted" style={{ fontSize: 14, marginTop: 10, lineHeight: "20px", maxWidth: 380, margin: "10px auto 0" }}>
            Your <strong style={{ color: "var(--mud-text-primary)" }}>{draft.name || "campaign"}</strong> campaign
            is now active and will automatically send appointment reminders {sched} hours before each
            appointment.
          </div>
        </div>

        <div className="grid cols-2" style={{ gap: 12, marginTop: 28 }}>
          <div style={{
            background: "var(--mud-gray-100)",
            borderRadius: 4,
            padding: 16,
          }}>
            <div className="muted-sm" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
              Estimated Recipients
            </div>
            <div style={{ fontSize: 24, fontWeight: 500, marginTop: 4 }}>250</div>
          </div>
          <div style={{
            background: "var(--mud-gray-100)",
            borderRadius: 4,
            padding: 16,
          }}>
            <div className="muted-sm" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
              Send Time
            </div>
            <div style={{ fontSize: 24, fontWeight: 500, marginTop: 4 }}>{sendTime}</div>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <MudButton color="primary" size="lg" style={{ width: "100%" }}
                     onClick={() => go("dashboard")}>
            View Campaign Dashboard
          </MudButton>
          <MudButton variant="text" color="default" style={{ width: "100%", marginTop: 8 }}
                     onClick={() => go("dashboard")}>
            Back to Home
          </MudButton>
        </div>
      </WizardCard>
    </div>
  );
}

Object.assign(window, {
  MsgStep1, MsgStep2, MsgStep3, MsgStep4, NumberedStepper,
});
