// PendingDashboard.jsx — the main onboarding hub
// Hero + progress ring + setup checklist + concierge + "what happens next" + first-message gate

// ---------- Circular progress ring (SVG) ----------
function ProgressRing({ value = 0, size = 96, stroke = 8, color = "var(--mud-primary)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r}
                stroke="rgba(0,0,0,.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r}
                stroke={color} strokeWidth={stroke} fill="none"
                strokeDasharray={c} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset .4s var(--easing-standard)" }} />
      </svg>
      <div className="pct">{value}<span className="sm">%</span></div>
    </div>
  );
}

// ---------- Linear progress bar ----------
function LinearProgress({ value, color = "var(--mud-primary)", height = 6 }) {
  return (
    <div style={{
      height, background: "rgba(0,0,0,.08)",
      borderRadius: 9999, overflow: "hidden", width: "100%",
    }}>
      <div style={{
        width: `${value}%`, height: "100%",
        background: color, borderRadius: 9999,
        transition: "width .35s var(--easing-decelerate)",
      }} />
    </div>
  );
}

// ---------- One checklist item (simplified — title / desc / status / CTA) ----------
function ChecklistItem({ item, onAction }) {
  const sIcon = {
    todo: "radio_button_unchecked",
    in_progress: "hourglass_bottom",
    submitted: "schedule",
    done: "check",
    review: "schedule",
    locked: "lock",
  };
  const chip = {
    todo: <span className="status-chip-l locked"><span className="dot" />Not started</span>,
    in_progress: <span className="status-chip-l pending"><span className="dot" />In progress</span>,
    submitted: <span className="status-chip-l review"><span className="dot" />In review</span>,
    done: <span className="status-chip-l ready"><Icon name="check" size={12} />Done</span>,
    review: <span className="status-chip-l review"><span className="dot" />In review</span>,
    locked: <span className="status-chip-l locked"><Icon name="lock" size={12} />Locked</span>,
  };
  const cls =
    item.status === "done"        ? "done" :
    item.status === "in_progress" ? "active" :
    item.status === "submitted" || item.status === "review" ? "review" :
    item.status === "locked"      ? "locked" : "";

  const primaryLabel =
    item.status === "done"        ? "View" :
    item.status === "submitted"   ? "Edit" :
    item.status === "in_progress" ? "Continue" :
    item.status === "locked"      ? "Locked" :
                                    "Start";

  return (
    <div className={"item " + cls}>
      <div className="status-ic">
        <Icon name={sIcon[item.status]} outlined={item.status === "todo"} />
      </div>
      <div className="body">
        <div className="ttl-row">
          <div className="ttl">{item.title}</div>
          {chip[item.status]}
        </div>
        <div className="desc">{item.desc}</div>
      </div>
      <div className="right-action">
        {item.status !== "locked" ? (
          <MudButton variant={item.status === "done" ? "outlined" : "filled"}
                     color="primary" size="sm"
                     endIcon={item.status === "done" ? null : "arrow_forward"}
                     onClick={() => onAction(item)}>
            {primaryLabel}
          </MudButton>
        ) : (
          <span className="muted-sm" style={{ fontSize: 12 }}>
            <Icon name="lock" size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
            Locked
          </span>
        )}
      </div>
    </div>
  );
}

// ---------- Build checklist from current state ----------
function buildChecklist(state) {
  const ehrInfo =
    state.ehr === "manual" || state.ehr === "other"
      ? { label: "Concierge sync setup", supported: false }
      : { label: (window.EHR_LIST || []).find((e) => e.id === state.ehr)?.name || "Selected system", supported: true };

  const items = [
    {
      id: "business",
      title: "Verify Business Information",
      desc: "Provide your EIN, signed BAA, and SMS consent so carriers can verify your practice.",
      status: state.setup.business,
      goto: "setup/business",
    },
    {
      id: "channels",
      title: "Communication Preferences",
      desc: `Confirmed: ${state.channels.map((c) => c.toUpperCase()).join(" · ") || "—"}.`,
      status: state.setup.channels,
      goto: "setup/channels",
    },
    {
      id: "tollfree",
      title: "Toll-Free Number Setup",
      desc: state.channels.includes("sms")
        ? "Choose a clinic location and confirm the number to use for SMS."
        : "Not required — SMS isn't enabled. Add it from Communication Preferences.",
      status: state.channels.includes("sms") ? state.setup.tollfree : "done",
      goto: "setup/tollfree",
    },
    {
      id: "ehr",
      title: "Connect Your Existing Data",
      desc: ehrInfo.supported
        ? `Sync schedules and patient data from ${ehrInfo.label}.`
        : "We'll arrange a call to connect or import your scheduling data.",
      status: state.setup.ehr,
      goto: "setup/ehr",
    },
    {
      id: "review",
      title: "Inphonite Review & Activation",
      desc: "Our team verifies your account and unlocks messaging once everything is submitted.",
      status: state.setup.review,
      goto: "setup/review",
    },
  ];
  return items;
}

// ---------- Main dashboard ----------
function PendingDashboard({ state, patch, go }) {
  const items = buildChecklist(state);
  const progress = computeProgress(state);
  const allDone = items.every((i) => i.status === "done");

  return (
    <div className="col" style={{ gap: 24, maxWidth: 1240, margin: "0 auto" }}>

      {/* ---------- Hero ---------- */}
      <div className="dash-hero slide-in">
        <div className="eyebrow">
          {allDone ? <><Icon name="check_circle" size={14} /> Account Active</>
                   : <><Icon name="hourglass_top" size={14} /> Pending Verification</>}
        </div>
        <h1>
          {allDone ? `Welcome, Eleanor — you're all set.`
                   : `Welcome, Eleanor — let's finish setting up ${state.practice.name}.`}
        </h1>
        <p>
          {allDone
            ? "Your account is verified and your toll-free number is live. Send your first message below."
            : "We're preparing your account while you complete these steps. Our team handles the heavy lifting — carriers, integrations, compliance — so you can focus on patients."}
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="lbl">Setup progress</div>
            <div className="val">{progress}%</div>
          </div>
          <div className="hero-stat">
            <div className="lbl">Steps remaining</div>
            <div className="val">{items.filter((i) => i.status !== "done").length}</div>
          </div>
          <div className="hero-stat">
            <div className="lbl">Practice type</div>
            <div className="val" style={{ fontSize: 18, lineHeight: "32px" }}>{state.practice.type}</div>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* ---------- LEFT: checklist ---------- */}
        <div className="col" style={{ gap: 16 }}>
          <div className="row" style={{ marginBottom: -4 }}>
            <div style={{ font: "500 16px/24px var(--font-family-sans)", letterSpacing: .15 }}>
              Setup checklist
            </div>
            <div className="muted-sm">
              {items.filter((i) => i.status === "done").length} of {items.length} complete
            </div>
            <div className="spacer-1" />
          </div>

          <div className="checklist">
            {items.map((it) => (
              <ChecklistItem key={it.id}
                item={it}
                onAction={(item) => {
                  if (item.id === "review" && item.status === "locked") return;
                  go(item.goto);
                }}
              />
            ))}
          </div>

          {/* First message gate (visible once everything is done) */}
          <div style={{
            background: "var(--mud-surface)",
            border: "1px solid " + (allDone ? "rgba(89,74,226,.3)" : "rgba(0,0,0,.08)"),
            borderRadius: 4,
            boxShadow: "var(--elev-1)",
            padding: "24px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            position: "relative",
            opacity: allDone ? 1 : .85,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 4,
              background: allDone ? "var(--mud-primary)" : "rgba(0,0,0,.08)",
              color: allDone ? "#fff" : "var(--mud-text-disabled)",
              display: "grid", placeItems: "center", flex: "none",
            }}>
              <Icon name={allDone ? "send" : "lock"} size={28} />
            </div>
            <div className="col" style={{ flex: 1, gap: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: .15 }}>
                Send your first message
              </div>
              <div className="muted" style={{ fontSize: 14, lineHeight: "20px" }}>
                {allDone
                  ? "Set up your first appointment reminder campaign in under 2 minutes."
                  : "Unlocks automatically once your account is verified and your number is provisioned."}
              </div>
            </div>
            <MudButton color="primary" size="lg" disabled={!allDone}
                       endIcon={allDone ? "arrow_forward" : null}
                       startIcon={allDone ? null : "lock"}
                       onClick={() => go("first-message")}>
              {allDone ? "Create your first message" : "Locked"}
            </MudButton>
          </div>
        </div>

        {/* ---------- RIGHT: sidebar ---------- */}
        <div className="col" style={{ gap: 16 }}>
          {/* Progress ring card */}
          <div className="card" style={{ padding: 0 }}>
            <div className="progress-ring-wrap">
              <ProgressRing value={progress} />
              <div className="col" style={{ gap: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>
                  {allDone ? "Setup complete" : "Setup in progress"}
                </div>
                <div className="muted-sm">
                  {allDone ? "Account active" : "We'll notify you as each step verifies."}
                </div>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="card">
            <div className="head" style={{ paddingBottom: 8 }}>
              <div className="ttl">What happens next</div>
            </div>
            <div className="body">
              <div className="next-timeline">
                <div className={"nt-item " + (progress > 0 ? "done" : "cur")}>
                  <div className="nt-ttl">You complete required setup steps</div>
                  <div className="nt-desc">Verify business info, confirm channels, and pick a scheduling system.</div>
                </div>
                <div className={"nt-item " + (progress >= 50 && !allDone ? "cur" : progress >= 100 ? "done" : "")}>
                  <div className="nt-ttl">Inphonite handles provisioning</div>
                  <div className="nt-desc">We submit your toll-free number to carriers and set up your EHR connection.</div>
                </div>
                <div className={"nt-item " + (allDone ? "done" : "")}>
                  <div className="nt-ttl">Our team reviews and approves</div>
                  <div className="nt-desc">A specialist confirms everything is right and runs a delivery test.</div>
                </div>
                <div className={"nt-item " + (allDone ? "cur" : "")}>
                  <div className="nt-ttl">Send your first message</div>
                  <div className="nt-desc">Messaging unlocks and you go live with patients.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Generic support card */}
          <div className="card">
            <div className="head" style={{ paddingBottom: 8 }}>
              <div className="ttl">Need help?</div>
            </div>
            <div className="body" style={{ paddingBottom: 12 }}>
              <div className="muted" style={{ fontSize: 13, lineHeight: "19px", marginBottom: 12 }}>
                Get answers fast — from articles, guides, or a real person.
              </div>
              <div className="col" style={{ gap: 4 }}>
                <div className="support-link">
                  <Icon name="menu_book" outlined />
                  <div className="col" style={{ gap: 0, flex: 1 }}>
                    <span className="lbl">Knowledge base</span>
                    <span className="sub">Browse onboarding & setup articles</span>
                  </div>
                  <Icon name="arrow_forward" size={16} />
                </div>
                <div className="support-link">
                  <Icon name="support_agent" outlined />
                  <div className="col" style={{ gap: 0, flex: 1 }}>
                    <span className="lbl">Contact support</span>
                    <span className="sub">Reply within 1 business day</span>
                  </div>
                  <Icon name="arrow_forward" size={16} />
                </div>
                <div className="support-link">
                  <Icon name="chat" outlined />
                  <div className="col" style={{ gap: 0, flex: 1 }}>
                    <span className="lbl">Live chat</span>
                    <span className="sub">Mon–Fri, 8am–6pm CT</span>
                  </div>
                  <Icon name="arrow_forward" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PendingDashboard, ProgressRing, LinearProgress, ChecklistItem, buildChecklist,
});
