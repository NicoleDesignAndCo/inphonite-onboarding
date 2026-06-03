// SetupScreens.jsx — detail pages opened from the dashboard checklist
// Each renders into the main panel of PendingAppShell.

function SetupBack({ go }) {
  return (
    <a className="setup-back" onClick={() => go("dashboard")}>
      <Icon name="arrow_back" /> Back to setup
    </a>
  );
}

// ===========================================================
// 1. Business information
// ===========================================================
function SetupBusiness({ state, patch, go }) {
  const [form, setForm] = React.useState({
    legal: state.practice.name,
    ein: "84-3047192",
    address: "1240 N Bell Blvd, Suite 200",
    city: "Cedar Park",
    region: "TX",
    zip: "78613",
    rep: "Eleanor Mason",
    repTitle: "Office Manager",
    purpose: "Send appointment reminders, confirmations, and post-visit follow-ups to existing patients.",
    optIn: true,
    baa: false,
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    patch((s) => ({
      setup: { ...s.setup, business: "submitted" },
    }));
    go("dashboard");
  };

  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <SetupBack go={go} />
      <h1 className="setup-h1">Verify Business Information</h1>
      <p className="setup-sub">
        Carriers require this information before they'll allow SMS from your account. Our team handles
        the carrier submission — you just need to provide the details once.
      </p>

      <div className="setup-section">
        <h3>Business identity</h3>
        <div className="section-desc">Legal name, address and tax ID for carrier verification.</div>
        <div className="col" style={{ gap: 16 }}>
          <MudTextField label="Legal business name" value={form.legal} onChange={set("legal")} />
          <div className="grid cols-2" style={{ gap: 16 }}>
            <MudTextField label="Federal EIN" value={form.ein} onChange={set("ein")} helper="9 digits, with or without dash." />
            <MudTextField label="Business phone" value="(512) 555-0144" onChange={() => {}} />
          </div>
          <MudTextField label="Street address" value={form.address} onChange={set("address")} />
          <div className="grid cols-3" style={{ gap: 16 }}>
            <MudTextField label="City" value={form.city} onChange={set("city")} />
            <MudTextField label="State / Region" value={form.region} onChange={set("region")} />
            <MudTextField label="ZIP / Postal" value={form.zip} onChange={set("zip")} />
          </div>
        </div>
      </div>

      <div className="setup-section">
        <h3>Authorized representative</h3>
        <div className="section-desc">The person authorized to agree to telecom and HIPAA terms on behalf of the practice.</div>
        <div className="grid cols-2" style={{ gap: 16 }}>
          <MudTextField label="Full name" value={form.rep} onChange={set("rep")} />
          <MudTextField label="Title" value={form.repTitle} onChange={set("repTitle")} />
        </div>
      </div>

      <div className="setup-section">
        <h3>Messaging purpose &amp; consent</h3>
        <div className="section-desc">
          Tell carriers what you'll send and confirm how patients opt in. Plain language — we'll format
          it for the submission.
        </div>
        <div className="col" style={{ gap: 16 }}>
          <MudTextField label="What will you message patients about?"
                        value={form.purpose} onChange={set("purpose")}
                        multiline rows={3}
                        helper="Used verbatim in the carrier registration." />
          <div className="col" style={{ gap: 10 }}>
            <MudCheckbox checked={form.optIn} onChange={set("optIn")} label={
              <span>I confirm patients explicitly opt in to messaging during intake or via signed forms.</span>
            } />
            <MudCheckbox checked={form.baa} onChange={set("baa")} label={
              <span>I'm authorized to execute Inphonite's <a className="mud-link">HIPAA Business Associate Agreement</a>.</span>
            } />
          </div>
        </div>
      </div>

      <div className="alert info" style={{ marginBottom: 16 }}>
        <Icon name="info" outlined />
        <span className="flex-1">
          <strong>What we do with this.</strong> Our compliance team formats and submits your registration
          to mobile carriers. Most submissions are approved within 1–2 business days.
        </span>
      </div>

      <div className="row" style={{ gap: 12 }}>
        <MudButton variant="text" color="default" onClick={() => go("dashboard")}>Save and finish later</MudButton>
        <div className="spacer-1" />
        <MudButton color="primary" onClick={submit} disabled={!form.baa} endIcon="check">
          Submit for verification
        </MudButton>
      </div>
    </div>
  );
}

// ===========================================================
// 2. Channels (read/edit)
// ===========================================================
function SetupChannels({ state, patch, go }) {
  const [chs, setChs] = React.useState(state.channels);
  const toggle = (id) =>
    setChs((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);
  const save = () => { patch({ channels: chs }); go("dashboard"); };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <SetupBack go={go} />
      <h1 className="setup-h1">Communication Preferences</h1>
      <p className="setup-sub">
        These are the channels you'll use to reach patients. Each channel has its own setup — we'll
        handle compliance for any you enable.
      </p>

      <div className="setup-section">
        <h3>Active channels</h3>
        <div className="section-desc">Toggle a channel on or off. Changes apply once your account is active.</div>
        <div className="choice-grid cols-1" style={{ gap: 10 }}>
          {(window.CHANNELS || []).map((c) => (
            <div key={c.id}
                 className={"choice" + (chs.includes(c.id) ? " selected" : "")}
                 onClick={() => toggle(c.id)}>
              <div className="ic"><Icon name={c.icon} outlined /></div>
              <div className="col" style={{ gap: 2 }}>
                <div className="row" style={{ gap: 10 }}>
                  <div className="ttl">{c.label}</div>
                  {c.id === "sms" && chs.includes("sms") && (
                    <span className="status-chip-l pending">
                      <span className="dot" />Toll-free number required
                    </span>
                  )}
                </div>
                <div className="desc">{c.desc}</div>
              </div>
              <div className="multi-check" />
            </div>
          ))}
        </div>
      </div>

      <div className="row" style={{ gap: 12 }}>
        <MudButton variant="text" color="default" onClick={() => go("dashboard")}>Cancel</MudButton>
        <div className="spacer-1" />
        <MudButton color="primary" onClick={save}>Save changes</MudButton>
      </div>
    </div>
  );
}

// ===========================================================
// 3. Toll-free number setup — pick a number, assign location & text app
// ===========================================================
const TFN_NUMBERS = [
  { number: "(833) 628-8188", code: "833" },
  { number: "(833) 204-6650", code: "833" },
  { number: "(844) 519-7702", code: "844" },
  { number: "(855) 360-4412", code: "855" },
  { number: "(877) 815-2240", code: "877" },
  { number: "(888) 247-3091", code: "888" },
];
const TFN_LOCATIONS = [
  { value: "all",             label: "[All] — every location" },
  { value: "cedar-park-main", label: "Cedar Park — Main" },
  { value: "leander",         label: "Leander Office" },
  { value: "round-rock",      label: "Round Rock Office" },
];
const TFN_TEXT_APPS = [
  { value: "none",      label: "[None]" },
  { value: "reminders", label: "Appointment Reminders" },
  { value: "messaging", label: "Two-Way Messaging" },
  { value: "surveys",   label: "Patient Surveys" },
];

function SetupTollFree({ state, patch, go }) {
  const [codeFilter, setCodeFilter] = React.useState("all");
  const [number, setNumber]   = React.useState(TFN_NUMBERS[0].number);
  const [location, setLocation] = React.useState("all");
  const [textApp, setTextApp] = React.useState("none");

  const codes = ["all", ...Array.from(new Set(TFN_NUMBERS.map((n) => n.code)))];
  const visible = TFN_NUMBERS.filter((n) => codeFilter === "all" || n.code === codeFilter);

  const submit = () => {
    patch((s) => ({
      setup: { ...s.setup, tollfree: "submitted" },
      tfn: { ...s.tfn, state: "carrier_review", number, location: tfnLocationName(location), textApp },
    }));
    go("dashboard");
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <SetupBack go={go} />
      <h1 className="setup-h1">Toll-Free Number Setup</h1>
      <p className="setup-sub">
        Choose a dedicated messaging number, then assign it to a location and the application
        that will send through it.
      </p>

      {/* ---------- Step A: pick a number ---------- */}
      <div className="setup-section">
        <h3>Choose your number</h3>
        <div className="section-desc">
          Pick an available toll-free number. Filter by prefix, then select one to assign.
        </div>

        <div className="code-filter">
          {codes.map((c) => (
            <button key={c} className={"code-chip" + (codeFilter === c ? " on" : "")}
                    onClick={() => setCodeFilter(c)}>
              {c === "all" ? "All prefixes" : c}
            </button>
          ))}
        </div>

        <div className="col" style={{ gap: 8 }}>
          {visible.map((n) => (
            <div key={n.number}
                 className={"ehr-row num-row" + (number === n.number ? " selected" : "")}
                 onClick={() => setNumber(n.number)}>
              <div className="ehr-logo"><Icon name="phone_iphone" outlined size={18} /></div>
              <div className="num-val">{n.number}</div>
              {number === n.number
                ? <span className="status-chip-l ready"><Icon name="check" size={12} />Selected</span>
                : <span className="status-chip-l locked">Available</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Step B: General config (matches product) ---------- */}
      <div className="setup-section">
        <h3>General</h3>
        <div className="section-desc">Where this number routes and which application handles its texts.</div>

        <div className="col" style={{ gap: 20 }}>
          <div>
            <div className="field-label">Phone number</div>
            <div className="tf is-disabled">
              <Icon name="phone" outlined style={{ color: "var(--mud-text-disabled)" }} />
              <span className="ro-value">{number}</span>
              <Icon name="lock" size={18} style={{ color: "var(--mud-text-disabled)" }} />
            </div>
            <div className="tf-helper">Assigned to your account once setup is submitted.</div>
          </div>

          <div>
            <div className="field-label">Location</div>
            <MudSelect value={location} onChange={setLocation} options={TFN_LOCATIONS} icon="place" />
            <div className="tf-helper">Which office this number is associated with. Choose [All] to share it across locations.</div>
          </div>

          <div>
            <div className="field-label">Text application</div>
            <MudSelect value={textApp} onChange={setTextApp} options={TFN_TEXT_APPS} icon="chat" />
            <div className="tf-helper">The app that handles inbound and outbound texts on this number. You can set this up later.</div>
          </div>
        </div>
      </div>

      <div className="alert info" style={{ marginBottom: 16 }}>
        <Icon name="shield" outlined />
        <span className="flex-1">
          You don't have to configure any telecom settings. Our team handles provisioning, carrier
          submission, and activation. We'll let you know when {number} is ready.
        </span>
      </div>

      <div className="row" style={{ gap: 12, marginTop: 8 }}>
        <MudButton variant="text" color="default" onClick={() => go("dashboard")}>Save for later</MudButton>
        <div className="spacer-1" />
        <MudButton color="primary" onClick={submit} endIcon="arrow_forward">
          Submit for setup
        </MudButton>
      </div>
    </div>
  );
}

function tfnLocationName(id) {
  return ({
    "all": "All locations",
    "cedar-park-main": "Cedar Park — Main",
    "leander": "Leander Office",
    "round-rock": "Round Rock Office",
  })[id] || "Selected location";
}

// ===========================================================
// 4. EHR connection — supported vs. unsupported branches
// ===========================================================
function SetupEHR({ state, patch, go }) {
  const ehr = state.ehr;
  const ehrInfo = (window.EHR_LIST || []).find((e) => e.id === ehr);
  const supported = !!ehrInfo;

  // Local state for "supported" branch — guided API connect
  const [apiKey, setApiKey] = React.useState("");
  const [connecting, setConnecting] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  const startConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1400);
  };
  const finish = () => {
    patch((s) => ({ setup: { ...s.setup, ehr: "submitted" } }));
    go("dashboard");
  };
  const scheduleCall = () => {
    patch((s) => ({ setup: { ...s.setup, ehr: "submitted" } }));
    go("dashboard");
  };

  if (!supported) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SetupBack go={go} />
        <h1 className="setup-h1">Connect Your Existing Data</h1>
        <p className="setup-sub">
          {ehr === "manual"
            ? "Manual scheduling is fully supported."
            : "Your scheduling system isn't on our quick-connect list yet — but it's fully supported."}
          A member of our team will work with you directly to set up your sync.
        </p>

        <div className="setup-section">
          <h3>Concierge connection</h3>
          <div className="section-desc">Pick a time. We'll do the rest — no IT work on your end.</div>

          <div className="grid cols-2" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 18, border: "1px solid rgba(89,74,226,.2)" }}>
              <div className="row" style={{ gap: 10, marginBottom: 8 }}>
                <Icon name="calendar_month" outlined style={{ color: "var(--mud-primary)" }} />
                <div style={{ fontWeight: 500 }}>30-minute setup call</div>
              </div>
              <div className="muted" style={{ fontSize: 13, lineHeight: "19px", marginBottom: 14 }}>
                Walk through your scheduling workflow with our setup team. We'll outline the connection
                method that fits — direct API, SFTP feed, or guided import.
              </div>
              <MudButton color="primary" size="sm" onClick={scheduleCall} endIcon="arrow_forward">
                Schedule a call
              </MudButton>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div className="row" style={{ gap: 10, marginBottom: 8 }}>
                <Icon name="upload_file" outlined />
                <div style={{ fontWeight: 500 }}>Share a sample export</div>
              </div>
              <div className="muted" style={{ fontSize: 13, lineHeight: "19px", marginBottom: 14 }}>
                Got an export from your system? Send it in advance and we'll pre-map your data
                before the call.
              </div>
              <MudButton variant="outlined" color="default" size="sm" startIcon="attach_file">
                Upload export
              </MudButton>
            </div>
          </div>

          <div className="h-divider" />

          <div className="section-head" style={{ margin: "8px 0 12px" }}>
            <div className="h">Supported connection methods</div>
            <div className="ln" />
          </div>
          <div className="grid cols-3" style={{ gap: 10 }}>
            {[
              { ic: "api", t: "Direct API", d: "If your system has an API, we'll connect to it." },
              { ic: "lan", t: "SFTP feed", d: "Encrypted nightly schedule drops." },
              { ic: "table_chart", t: "Managed import", d: "We build a custom mapping for your system." },
            ].map((m) => (
              <div key={m.t} className="card" style={{ padding: 14 }}>
                <Icon name={m.ic} outlined style={{ color: "var(--mud-primary)", marginBottom: 8 }} />
                <div style={{ fontWeight: 500, fontSize: 14 }}>{m.t}</div>
                <div className="muted-sm" style={{ marginTop: 2 }}>{m.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="alert success">
          <Icon name="verified_user" outlined />
          <span className="flex-1">
            Every connection method is HIPAA-compliant. Your patient data stays encrypted in transit
            and at rest.
          </span>
        </div>
      </div>
    );
  }

  // Supported / quick-connect branch
  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      <SetupBack go={go} />
      <h1 className="setup-h1">Connect to {ehrInfo.name}</h1>
      <p className="setup-sub">
        We've got a direct integration with {ehrInfo.name}. Just generate an API key from your admin
        panel — Inphonite handles the rest of the sync setup.
      </p>

      <div className="grid cols-2" style={{ gap: 24, alignItems: "start" }}>
        <div>
          <div className="setup-section">
            <h3>How to find your API key</h3>
            <div className="section-desc">{ehrInfo.name} admin → Integrations → Inphonite → Generate key.</div>
            <ol style={{ margin: "0 0 14px 20px", padding: 0, fontSize: 14, lineHeight: "22px", color: "var(--mud-text-secondary)" }}>
              <li>Sign in to your {ehrInfo.name} admin account</li>
              <li>Open <strong>Settings → Integrations</strong></li>
              <li>Find <strong>Inphonite</strong> in the partners list and click <strong>Connect</strong></li>
              <li>Generate a new API key and copy it here</li>
            </ol>
            <a className="mud-link" style={{ fontSize: 13 }}>
              <Icon name="open_in_new" size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Open the {ehrInfo.name} step-by-step guide
            </a>
          </div>

          <div className="setup-section">
            <h3>Paste your API key</h3>
            <div className="section-desc">We'll test the connection in real time before saving.</div>
            <MudTextField label="API key" value={apiKey} onChange={setApiKey}
                          icon="key" placeholder="ip_live_••••••••••••" />
            <div style={{ marginTop: 12 }}>
              {!connected ? (
                <MudButton color="primary" onClick={startConnect} disabled={!apiKey || connecting}
                           startIcon={connecting ? "sync" : "link"}>
                  {connecting ? "Testing connection…" : "Test & connect"}
                </MudButton>
              ) : (
                <div className="alert success" style={{ marginTop: 4 }}>
                  <Icon name="check_circle" />
                  <span className="flex-1">
                    Connected. We found <strong>4 providers</strong> and <strong>1,847 patients</strong>.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="setup-section">
            <h3>What we sync</h3>
            <div className="section-desc">Inphonite pulls only what's needed to reach patients.</div>
            {[
              { ic: "groups", t: "Patients", d: "Name, phone, email, opt-in status." },
              { ic: "event", t: "Appointments", d: "Time, type, provider, status." },
              { ic: "person", t: "Providers", d: "Provider names and schedules." },
              { ic: "place", t: "Locations", d: "Practice and office addresses." },
            ].map((r) => (
              <div key={r.t} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: "1px solid var(--mud-divider-light)",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 4,
                  background: "rgba(89,74,226,.08)", color: "var(--mud-primary)",
                  display: "grid", placeItems: "center",
                }}>
                  <Icon name={r.ic} outlined size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{r.t}</div>
                  <div className="muted-sm">{r.d}</div>
                </div>
                <Icon name="lock" size={16} style={{ color: "var(--mud-text-secondary)" }} />
              </div>
            ))}
            <div className="muted-sm" style={{ marginTop: 10 }}>
              Read-only sync. We don't write back to {ehrInfo.name}.
            </div>
          </div>

          <div className="alert info" style={{ marginTop: 16 }}>
            <Icon name="schedule" outlined />
            <span className="flex-1">
              First sync usually takes 5–15 minutes. We'll email you when it completes.
            </span>
          </div>
        </div>
      </div>

      <div className="row" style={{ gap: 12 }}>
        <MudButton variant="text" color="default" onClick={() => go("dashboard")}>Save for later</MudButton>
        <div className="spacer-1" />
        <MudButton color="primary" onClick={finish} disabled={!connected} endIcon="check">
          Save & continue
        </MudButton>
      </div>
    </div>
  );
}

// ===========================================================
// 5. Review (read-only)
// ===========================================================
function SetupReview({ state, go }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", paddingTop: 32 }}>
      <SetupBack go={go} />
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "rgba(33,150,243,.1)", color: "var(--mud-info)",
        display: "grid", placeItems: "center", margin: "20px auto 16px",
      }}>
        <Icon name="hourglass_top" size={36} />
      </div>
      <h1 className="setup-h1">In Inphonite review</h1>
      <p className="setup-sub" style={{ textAlign: "left" }}>
        Your submissions are with our team. We're finalizing carrier verification, confirming your
        EHR connection, and running delivery tests before your account goes live.
      </p>
      <div className="card" style={{ textAlign: "left", marginTop: 24 }}>
        <div className="body" style={{ padding: 20 }}>
          <div className="row" style={{ marginBottom: 8 }}>
            <Icon name="check_circle" style={{ color: "var(--mud-success)" }} />
            <span style={{ fontWeight: 500 }}>Business verification submitted</span>
            <div className="spacer-1" />
            <span className="muted-sm">Reviewed by our compliance team</span>
          </div>
          <div className="row" style={{ marginBottom: 8 }}>
            <Icon name="check_circle" style={{ color: "var(--mud-success)" }} />
            <span style={{ fontWeight: 500 }}>Toll-free registration submitted</span>
            <div className="spacer-1" />
            <span className="muted-sm">Awaiting carrier approval</span>
          </div>
          <div className="row">
            <Icon name="check_circle" style={{ color: "var(--mud-success)" }} />
            <span style={{ fontWeight: 500 }}>EHR connection verified</span>
            <div className="spacer-1" />
            <span className="muted-sm">First sync complete</span>
          </div>
        </div>
      </div>
      <MudButton variant="outlined" color="primary" style={{ marginTop: 24 }} onClick={() => go("dashboard")}>
        Back to setup
      </MudButton>
    </div>
  );
}

Object.assign(window, { SetupBusiness, SetupChannels, SetupTollFree, SetupEHR, SetupReview });
