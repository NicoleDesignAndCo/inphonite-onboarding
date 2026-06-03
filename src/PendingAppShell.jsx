// PendingAppShell.jsx — app shell shown after onboarding survey completes,
// with restricted nav while the account is in pending verification.

const NAV_AVAILABLE = [
  { id: "home",    icon: "home",     outlined: true, label: "Home" },
  { id: "setup",   icon: "checklist_rtl", outlined: true, label: "Setup" },
  { id: "account", icon: "person",   outlined: true, label: "Account" },
  { id: "support", icon: "support_agent", outlined: true, label: "Support" },
];

const NAV_LOCKED = [
  { id: "messaging",   icon: "campaign",      label: "Messaging" },
  { id: "schedule",    icon: "calendar_today",label: "Schedule View" },
  { id: "providers",   icon: "groups",        label: "Providers" },
  { id: "rules",       icon: "rule",          label: "Rules Engine" },
  { id: "data-maps",   icon: "schema",        label: "Data Maps" },
  { id: "reports",     icon: "analytics",     label: "Reports" },
  { id: "contacts",    icon: "contacts",      label: "Contacts" },
];

function pendingAppLabel(route, state) {
  if (route === "dashboard")       return state.navUnlocked ? "05 Dashboard (Live)" : "05 Pending Dashboard";
  if (route === "setup/business")  return "06 Setup — Business";
  if (route === "setup/channels")  return "06b Setup — Channels";
  if (route === "setup/tollfree")  return "07 Setup — Toll-Free";
  if (route === "setup/ehr")       return "08 Setup — EHR";
  if (route === "setup/review")    return "09 Setup — Review";
  if (route === "first-message/1") return "10 First Message — Name";
  if (route === "first-message/2") return "11 First Message — Message";
  if (route === "first-message/3") return "12 First Message — Schedule";
  if (route === "first-message/4") return "13 First Message — Launch";
  if (route === "first-message")   return "10 First Message — Name";
  return "Inphonite";
}

function PendingAppShell({ route, go, state, children, onContactSupport }) {
  // Route → which nav item to highlight
  const activeId =
    route.startsWith("setup")          ? "setup" :
    route.startsWith("first-message")  ? "home" :
    route === "dashboard"              ? "home" :
    route === "account"                ? "account" :
    route === "support"                ? "support" :
                                          "home";

  const onNavClick = (id) => {
    if (id === "home")    go("dashboard");
    if (id === "setup")   go("dashboard"); // setup tasks live on the dashboard
    if (id === "account") go("dashboard"); // demo: stays on dashboard
    if (id === "support") onContactSupport?.();
  };

  const navUnlocked = state.navUnlocked;
  const isLocked = (item) => !navUnlocked;

  return (
    <div className="pending-app app" data-screen-label={pendingAppLabel(route, state)}>
      <aside className="drawer">
        <div className="brand">
          <img src="design-system/logo-inphonite.svg" alt="Inphonite" style={{ height: 28 }} />
          <span style={{ fontWeight: 500, fontSize: 18, letterSpacing: .15, color: "var(--mud-text-primary)" }}>
            Inphonite
          </span>
        </div>

        <nav className="nav">
          {NAV_AVAILABLE.map((it) => (
            <a key={it.id}
               className={"item" + (activeId === it.id ? " active" : "")}
               onClick={() => onNavClick(it.id)}>
              <Icon name={it.icon} outlined={it.outlined && activeId !== it.id} />
              <span>{it.label}</span>
            </a>
          ))}

          <div className={"group" + (!navUnlocked ? " locked" : "")}>
            {!navUnlocked && <Icon name="lock" size={14} />}
            <span>{navUnlocked ? "Communications" : "Available after setup"}</span>
          </div>
          {NAV_LOCKED.map((it) => (
            <a key={it.id}
               className={"item" + (isLocked(it) ? " locked" : "")}
               onClick={() => { if (!isLocked(it)) onNavClick(it.id); }}>
              <Icon name={it.icon} outlined />
              <span>{it.label}</span>
              {isLocked(it) && <Icon name="lock" className="lock-ic" />}
            </a>
          ))}
        </nav>

        <div className="footer">
          <div className="me">EM</div>
          <div className="col" style={{ gap: 0, minWidth: 0 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Eleanor Mason</span>
            <span style={{ fontSize: 12, color: "var(--mud-text-secondary)" }}>{state.practice.name}</span>
          </div>
        </div>
      </aside>

      <header className="appbar">
        <MudIconButton icon="apps" className="appbar-ib" title="Flow overview"
                       onClick={() => go("flow")} />
        <div className="title">
          {activeId === "home"    ? "Home" :
           activeId === "setup"   ? "Setup" :
           activeId === "account" ? "Account" : "Inphonite"}
        </div>
        {!state.navUnlocked && (
          <span className="pending-badge">
            <span className="dot" />
            Pending Verification
          </span>
        )}
        <div className="spacer" />
        <div className="actions">
          <MudButton variant="text" color="default" size="sm" startIcon="apps"
                     style={{ color: "rgba(255,255,255,.85)" }}
                     onClick={() => go("flow")}>
            Flow Overview
          </MudButton>
          <MudIconButton icon="help_outline" className="appbar-ib" title="Help" />
        </div>
      </header>

      <main className="main">{children}</main>
    </div>
  );
}

Object.assign(window, { PendingAppShell, NAV_AVAILABLE, NAV_LOCKED });
