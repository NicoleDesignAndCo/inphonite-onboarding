// LiveDashboard.jsx — the post-approval ("all green light") product dashboard.
// Shown the moment the account is verified and unlocked. Rendered in its EMPTY
// state: account is live but no messages have been sent and no data exists yet.
// Recreates the real Inphonite product chrome (navy app bar + full feature nav)
// rather than the purple onboarding shell.

// ----- Full product navigation (everything unlocked) -----
const LIVE_NAV = [
  { id: "dashboard", icon: "home",            label: "Dashboard", plus: false },
  { id: "messaging", icon: "edit",            label: "Messaging", plus: true },
  { id: "voice",     icon: "call",            label: "Voice",     plus: true },
  { id: "email",     icon: "mail_outline",    label: "Email",     plus: true },
  { id: "surveys",   icon: "folder_open",     label: "Surveys",   plus: true },
  { id: "schedules", icon: "calendar_today",  label: "Schedules", plus: true },
  { id: "contacts",  icon: "contacts",        label: "Contacts",  plus: true },
  { id: "reports",   icon: "analytics",       label: "Monitoring & Reports", plus: true },
  { id: "websites",  icon: "language",        label: "Websites",  plus: true },
  { id: "settings",  icon: "settings",        label: "Settings",  plus: true },
  { id: "account",   icon: "person_outline",  label: "Account",   plus: true },
  { id: "admin",     icon: "build",           label: "Admin Tools", plus: true },
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const RANGE_OPTIONS = [
  { value: "week",    label: "This Week" },
  { value: "month",   label: "This Month" },
  { value: "quarter", label: "This Quarter" },
];

function LiveAppBar({ state }) {
  return (
    <header className="live-appbar">
      <div className="menu-ic"><Icon name="menu" /></div>
      <span className="wordmark">inphonite</span>
      <div className="acct-select" title="Account selector">
        <span>Account</span>
        <Icon name="arrow_drop_down" />
      </div>
      <div className="search-ic"><Icon name="search" /></div>
      <div className="spacer" />
      <div className="ab-right">
        <div className="kb-link">
          <Icon name="menu_book" outlined />
          <span>Knowledge Base</span>
        </div>
        <div className="ab-ic" title="Notifications">
          <Icon name="notifications" outlined />
          <span className="badge-dot" />
        </div>
        <div className="ab-ic" title="Announcements">
          <Icon name="campaign" outlined />
        </div>
        <div className="me-av" title="Eleanor Mason">EM</div>
      </div>
    </header>
  );
}

function LiveDrawer() {
  return (
    <aside className="live-drawer">
      {LIVE_NAV.map((it) => (
        <div key={it.id} className={"l-item" + (it.id === "dashboard" ? " active" : "")}>
          <Icon name={it.icon} outlined={it.id !== "dashboard"} />
          <span className="l-lbl">{it.label}</span>
          {it.plus && <span className="l-plus"><Icon name="add" /></span>}
        </div>
      ))}
    </aside>
  );
}

// Empty message-volume chart — axes + gridlines, no bars yet.
function MessageVolumeEmpty({ go }) {
  const [range, setRange] = React.useState("week");
  return (
    <div className="live-card">
      <div className="lc-head">
        <div className="lc-title">Message Volume by Channel</div>
        <div style={{ width: 168 }}>
          <MudSelect value={range} onChange={setRange} options={RANGE_OPTIONS} />
        </div>
      </div>

      <div className="chart-empty">
        <div className="y-axis">
          {[80, 60, 40, 20, 0].map((n) => <span key={n}>{n}</span>)}
        </div>
        <div className="plot">
          {[0, 25, 50, 75, 100].map((t) => (
            <div key={t} className="gridline" style={{ top: `${t}%` }} />
          ))}
        </div>
        <div className="x-axis">
          {DAY_LABELS.map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="empty-overlay">
          <div className="ic"><Icon name="bar_chart" outlined /></div>
          <div className="ttl">No message data yet</div>
          <div className="sub">
            Once you send your first SMS, voice, or email campaign, your channel
            volume will chart here.
          </div>
        </div>
      </div>

      <div className="chart-legend">
        <span className="lg"><span className="sw" style={{ background: "#2979FF" }} /> SMS</span>
        <span className="lg"><span className="sw" style={{ background: "#43A047" }} /> Phone</span>
        <span className="lg"><span className="sw" style={{ background: "#FBC02D" }} /> Email</span>
      </div>
    </div>
  );
}

function AppointmentsEmpty() {
  return (
    <div className="live-card">
      <div className="lc-head">
        <div className="lc-title">Today's Appointments</div>
        <div className="lc-link">View Schedule <Icon name="arrow_forward" size={15} /></div>
      </div>
      <div className="card-empty">
        <div className="ic"><Icon name="event_available" outlined /></div>
        <div className="ttl">No appointments today</div>
        <div className="sub">
          Appointments synced from your scheduling system will appear here, grouped
          by provider and location.
        </div>
      </div>
    </div>
  );
}

function MessagesEmpty() {
  return (
    <div className="live-card">
      <div className="lc-head">
        <div className="lc-title">Recent Messages</div>
        <div className="lc-link">View Activity <Icon name="arrow_forward" size={15} /></div>
      </div>
      <div className="card-empty">
        <div className="ic"><Icon name="forum" outlined /></div>
        <div className="ttl">No messages yet</div>
        <div className="sub">
          When patients reply to your reminders, the latest conversations show up
          right here.
        </div>
      </div>
    </div>
  );
}

function LiveDashboard({ state, go }) {
  const [showApproved, setShowApproved] = React.useState(true);
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
  })();

  return (
    <div className="live-app" data-screen-label="14 Live Dashboard (Empty)">
      <LiveAppBar state={state} />
      <LiveDrawer />

      <main className="live-main">
        <div className="live-wrap col" style={{ gap: 24 }}>

          {/* Greeting */}
          <div>
            <h1 className="live-greeting">{greeting}, Eleanor</h1>
            <p className="live-greeting-sub">Welcome to Inphonite — here's your dashboard overview.</p>
          </div>

          {/* Approved confirmation (the "all green light" moment) */}
          {showApproved && (
            <div className="live-approved fade-in">
              <div className="ck"><Icon name="check" /></div>
              <div className="txt">
                <b>Your account is approved and live.</b>
                <span>
                  {state?.tfn?.number || "+1 (888) 247-3091"} is provisioned and messaging is
                  unlocked. Send your first reminder whenever you're ready.
                </span>
              </div>
              <Icon name="close" className="x" onClick={() => setShowApproved(false)} />
            </div>
          )}

          {/* Chart */}
          <MessageVolumeEmpty go={go} />

          {/* Two empty cards */}
          <div className="live-2col">
            <AppointmentsEmpty />
            <MessagesEmpty />
          </div>

          {/* Message Blast CTA */}
          <div className="msg-blast">
            <div className="mb-ic"><Icon name="send" outlined /></div>
            <div className="mb-body">
              <div className="mb-title">Send Your First Message</div>
              <div className="mb-sub">
                Reach all your patients instantly — perfect for appointment reminders,
                clinic closures, or important announcements.
              </div>
            </div>
            <MudButton color="primary" size="lg" endIcon="arrow_forward"
                       onClick={() => go("first-message")}>
              Start Sending Messages
            </MudButton>
          </div>

        </div>
      </main>
    </div>
  );
}

Object.assign(window, { LiveDashboard, LIVE_NAV, MessageVolumeEmpty, AppointmentsEmpty, MessagesEmpty });
