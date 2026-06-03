// CenteredShell.jsx — minimal chrome for unauthenticated / pre-setup pages

function CenteredShell({ children, rightTopSlot, signedInAs, onSignOut, tight, screenLabel }) {
  const goFlow = () => { window.location.hash = "#/flow"; };
  return (
    <div className="page-center" data-screen-label={screenLabel}>
      <div className="topbar">
        <img src="design-system/logo-inphonite.svg" alt="Inphonite" />
        <span className="muted" style={{ marginLeft: 8, fontWeight: 500, color: "var(--mud-text-primary)" }}>Inphonite</span>
        <div className="spacer" />
        <MudButton variant="text" color="default" size="sm" startIcon="apps" onClick={goFlow}>
          Flow Overview
        </MudButton>
        {rightTopSlot}
        {signedInAs && (
          <div className="row" style={{ gap: 10 }}>
            <span className="muted">Signed in as {signedInAs}</span>
            <MudButton variant="text" color="default" size="sm" onClick={onSignOut}>Sign out</MudButton>
          </div>
        )}
      </div>
      <div className={"body-center" + (tight ? " tight" : "")}>{children}</div>
      <div className="footer-thin">
        <span>© 2026 Inphonite, Inc.</span>
        <span>·</span>
        <a className="mud-link" style={{ fontWeight: 400, color: "var(--mud-text-secondary)" }}>Privacy</a>
        <a className="mud-link" style={{ fontWeight: 400, color: "var(--mud-text-secondary)" }}>Terms</a>
        <a className="mud-link" style={{ fontWeight: 400, color: "var(--mud-text-secondary)" }}>Status</a>
        <div className="spacer-1" />
        <a className="mud-link" style={{ fontWeight: 400, color: "var(--mud-text-secondary)" }}>Need help? Contact support</a>
      </div>
    </div>
  );
}

// Stepper for the survey — 3 steps
function SurveyStepper({ current }) {
  const steps = [
    { id: 1, label: "Practice information" },
    { id: 2, label: "Communication channels" },
    { id: 3, label: "Scheduling system" },
  ];
  return (
    <div className="mud-stepper-h">
      {steps.map((st, i) => {
        const done = current > st.id;
        const active = current === st.id;
        return (
          <React.Fragment key={st.id}>
            <div className={"s" + (active ? " active" : "") + (done ? " done" : "")}>
              <div className="num" style={{ position: "relative" }}>
                <span>{st.id}</span>
              </div>
              <div className="lbl">{st.label}</div>
            </div>
            {i < steps.length - 1 && <div className={"line" + (done ? " done" : "")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

Object.assign(window, { CenteredShell, SurveyStepper });
