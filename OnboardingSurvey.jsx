// OnboardingSurvey.jsx — 3-step survey
// Step 1: Practice information
// Step 2: Communication channels
// Step 3: Scheduling system

const PRACTICE_TYPES = [
  { id: "Dental", icon: "medication", desc: "General, orthodontics, periodontics, oral surgery" },
  { id: "Medical", icon: "medical_services", desc: "Primary care, urgent care, specialty practices" },
  { id: "Behavioral Health", icon: "psychology", desc: "Therapy, counseling, psychiatry, recovery" },
  { id: "Multi-Specialty", icon: "hub", desc: "Multiple service lines or clinic groups" },
];

const USE_CASES = [
  { id: "reminders", label: "Appointment reminders", icon: "event" },
  { id: "confirmations", label: "Appointment confirmations", icon: "task_alt" },
  { id: "recalls", label: "Patient recalls", icon: "history" },
  { id: "followups", label: "Post-visit follow-ups", icon: "forum" },
  { id: "waitlist", label: "Waitlist notifications", icon: "schedule_send" },
  { id: "surveys", label: "Patient satisfaction surveys", icon: "thumbs_up_down" },
];

const CHANNELS = [
  { id: "sms",   label: "SMS / Text messages", icon: "sms",        desc: "Appointment reminders, confirmations and patient messaging.", badge: "Most popular", badgeKind: "success" },
  { id: "voice", label: "Voice calls",         icon: "phone",      desc: "Automated voice reminders and outbound calls.", badge: null },
  { id: "email", label: "Email",               icon: "mail",       desc: "Email reminders, surveys and patient updates.", badge: null },
];

const EHR_LIST = [
  { id: "dentrix",        name: "Dentrix",         abbr: "DX",  supported: "API Ready", quick: true },
  { id: "eaglesoft",      name: "Eaglesoft",       abbr: "ES",  supported: "API Ready", quick: true },
  { id: "open-dental",    name: "Open Dental",     abbr: "OD",  supported: "Quick Connect", quick: true },
  { id: "athenahealth",   name: "athenahealth",    abbr: "AH",  supported: "API Ready", quick: true },
  { id: "epic",           name: "Epic",            abbr: "EP",  supported: "API Ready", quick: false },
  { id: "cerner",         name: "Cerner",          abbr: "CE",  supported: "Supported",  quick: false },
  { id: "drchrono",       name: "DrChrono",        abbr: "DC",  supported: "API Ready",  quick: true },
  { id: "eclinicalworks", name: "eClinicalWorks",  abbr: "EW",  supported: "Supported",  quick: false },
  { id: "kareo",          name: "Tebra (Kareo)",   abbr: "KR",  supported: "API Ready",  quick: true },
  { id: "azalea",         name: "Azalea Health",   abbr: "AZ",  supported: "Supported",  quick: false },
  { id: "advancedmd",     name: "AdvancedMD",      abbr: "AM",  supported: "API Ready",  quick: true },
  { id: "nexthealth",     name: "NextGen Healthcare", abbr: "NG", supported: "Supported", quick: false },
];

// ============================================================
// Step 1 — Practice information
// ============================================================
function SurveyStep1({ state, patch, onNext }) {
  const p = state.practice;
  const setP = (k, v) => patch({ practice: { ...p, [k]: v } });
  const valid = p.name && p.type;

  return (
    <div className="survey-card slide-in">
      <SurveyStepper current={1} />
      <h2>Tell us about your practice</h2>
      <p className="lede">
        We use this to tailor your setup. You'll only see what's relevant for your kind of practice.
      </p>

      <div className="col" style={{ gap: 20 }}>
        <div>
          <div className="field-label">Practice or organization name</div>
          <MudTextField value={p.name} onChange={(v) => setP("name", v)} placeholder="e.g. Cedar Park Family Dental" icon="business" />
        </div>

        <div>
          <div className="field-label">What kind of practice is this?</div>
          <div className="choice-grid">
            {PRACTICE_TYPES.map((t) => (
              <div key={t.id}
                   className={"choice" + (p.type === t.id ? " selected" : "")}
                   onClick={() => setP("type", t.id)}>
                <div className="ic"><Icon name={t.icon} outlined /></div>
                <div className="col">
                  <div className="ttl">{t.id}</div>
                  <div className="desc">{t.desc}</div>
                </div>
                <div className="check" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid cols-2" style={{ gap: 16 }}>
          <div>
            <div className="field-label">Team size <span className="opt">(optional)</span></div>
            <MudTextField value={p.size} onChange={(v) => setP("size", v)} placeholder="e.g. 10-25" icon="groups" />
          </div>
          <div>
            <div className="field-label">Your role</div>
            <MudSelect value={p.role} onChange={(v) => setP("role", v)} icon="person"
              options={[
                { value: "Office Admin", label: "Office Admin" },
                { value: "Front Desk", label: "Front Desk" },
                { value: "IT", label: "IT" },
              ]} />
          </div>
        </div>
      </div>

      <div className="nav-row">
        <div className="muted-sm">Step 1 of 3</div>
        <div className="spacer" />
        <MudButton variant="text" color="default" onClick={() => window.location.hash = "#/signup"}>Back</MudButton>
        <MudButton onClick={onNext} disabled={!valid} endIcon="arrow_forward">Continue</MudButton>
      </div>
    </div>
  );
}

// ============================================================
// Step 2 — Communication channels + use cases
// ============================================================
function SurveyStep2({ state, patch, onNext, onBack }) {
  const channels = state.channels || [];
  const [useCases, setUseCases] = React.useState(["reminders", "confirmations"]);
  const toggleCh = (id) => {
    const next = channels.includes(id) ? channels.filter((c) => c !== id) : [...channels, id];
    patch({ channels: next });
  };
  const toggleUc = (id) =>
    setUseCases((u) => u.includes(id) ? u.filter((x) => x !== id) : [...u, id]);

  const valid = channels.length > 0 && useCases.length > 0;

  return (
    <div className="survey-card slide-in">
      <SurveyStepper current={2} />
      <h2>How do you want to reach patients?</h2>
      <p className="lede">
        Choose the channels you'd like to use. You can enable more anytime — we'll set up the right
        compliance and provisioning for each.
      </p>

      <div>
        <div className="field-label">Communication channels</div>
        <div className="choice-grid cols-1" style={{ gap: 10 }}>
          {CHANNELS.map((c) => (
            <div key={c.id}
                 className={"choice" + (channels.includes(c.id) ? " selected" : "")}
                 onClick={() => toggleCh(c.id)}>
              <div className="ic"><Icon name={c.icon} outlined /></div>
              <div className="col" style={{ gap: 2 }}>
                <div className="row" style={{ gap: 10 }}>
                  <div className="ttl">{c.label}</div>
                  {c.badge && <span className="badge">{c.badge}</span>}
                </div>
                <div className="desc">{c.desc}</div>
              </div>
              <div className="multi-check" />
            </div>
          ))}
        </div>
        <div className="helper">You can enable additional channels later from Settings.</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="field-label">What will you primarily use Inphonite for?</div>
        <div className="choice-grid cols-3" style={{ gap: 10 }}>
          {USE_CASES.map((u) => (
            <div key={u.id}
                 className={"choice" + (useCases.includes(u.id) ? " selected" : "")}
                 onClick={() => toggleUc(u.id)}
                 style={{ padding: 12 }}>
              <div className="ic" style={{ width: 32, height: 32 }}>
                <Icon name={u.icon} outlined size={18} />
              </div>
              <div className="col" style={{ flex: 1 }}>
                <div className="ttl" style={{ fontSize: 13 }}>{u.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nav-row">
        <div className="muted-sm">Step 2 of 3</div>
        <div className="spacer" />
        <MudButton variant="text" color="default" onClick={onBack}>Back</MudButton>
        <MudButton onClick={onNext} disabled={!valid} endIcon="arrow_forward">Continue</MudButton>
      </div>
    </div>
  );
}

// ============================================================
// Step 3 — Scheduling system / EHR
// ============================================================
function SurveyStep3({ state, patch, onComplete, onBack }) {
  const [query, setQuery] = React.useState("");
  const selected = state.ehr;
  const list = EHR_LIST.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));

  const sel = (id) => patch({ ehr: id });

  return (
    <div className="survey-card slide-in">
      <SurveyStepper current={3} />
      <h2>Which scheduling system do you use today?</h2>
      <p className="lede">
        Inphonite connects securely to your existing system — no spreadsheets, no manual uploads.
        We handle the integration so your data stays in sync automatically.
      </p>

      <div className="ehr-search">
        <MudTextField icon="search" value={query} onChange={setQuery} placeholder="Search 40+ supported systems…" />
      </div>

      <div className="ehr-list">
        {list.map((e) => (
          <div key={e.id}
               className={"ehr-row" + (selected === e.id ? " selected" : "")}
               onClick={() => sel(e.id)}>
            <div className="ehr-logo">{e.abbr}</div>
            <div className="ehr-nm">{e.name}</div>
            <span className={"status-chip-l " + (e.quick ? "ready" : "review")}>
              {e.supported}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div className={"ehr-row" + (selected === "other" ? " selected" : "")}
             onClick={() => sel("other")}
             style={{ flex: "1 1 240px" }}>
          <div className="ehr-logo"><Icon name="extension" outlined size={20} /></div>
          <div className="ehr-nm">My system isn't listed</div>
          <span className="status-chip-l locked">Concierge setup</span>
        </div>
        <div className={"ehr-row" + (selected === "manual" ? " selected" : "")}
             onClick={() => sel("manual")}
             style={{ flex: "1 1 240px" }}>
          <div className="ehr-logo"><Icon name="edit_calendar" outlined size={20} /></div>
          <div className="ehr-nm">We schedule manually</div>
          <span className="status-chip-l locked">Concierge setup</span>
        </div>
      </div>

      <div className="alert info" style={{ marginTop: 20 }}>
        <Icon name="info" outlined />
        <span className="flex-1">
          <strong>Don't see your system?</strong> No problem — our team will work with you directly
          to connect or import your schedule data. Setup is the same level of care.
        </span>
      </div>

      <div className="nav-row">
        <div className="muted-sm">Step 3 of 3</div>
        <div className="spacer" />
        <MudButton variant="text" color="default" onClick={onBack}>Back</MudButton>
        <MudButton onClick={onComplete} disabled={!selected} endIcon="check">Complete onboarding</MudButton>
      </div>
    </div>
  );
}

Object.assign(window, {
  SurveyStep1, SurveyStep2, SurveyStep3,
  PRACTICE_TYPES, CHANNELS, EHR_LIST, USE_CASES,
});
