// Signup.jsx — lightweight account creation entry-point

function Signup({ onContinue }) {
  const [form, setForm] = React.useState({
    first: "Eleanor",
    last: "Mason",
    email: "eleanor@cedarparkdental.com",
    org: "Cedar Park Family Dental",
    password: "••••••••",
  });
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <CenteredShell screenLabel="01 Sign Up">
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h2 className="mud" style={{ fontSize: 28, fontWeight: 400, margin: 0, letterSpacing: 0 }}>
            Create your Inphonite account
          </h2>
          <p style={{ fontSize: 15, color: "var(--mud-text-secondary)", marginTop: 8, lineHeight: "22px" }}>
            We'll set up your patient communications in a few simple steps.
          </p>
        </div>

        <div className="card" style={{ padding: "28px 28px 20px" }}>
          <div className="col" style={{ gap: 16 }}>
            <div className="grid cols-2" style={{ gap: 12 }}>
              <MudTextField label="First name" value={form.first} onChange={set("first")} />
              <MudTextField label="Last name" value={form.last} onChange={set("last")} />
            </div>
            <MudTextField label="Work email" value={form.email} onChange={set("email")} icon="mail" type="email" />
            <MudTextField label="Practice or organization" value={form.org} onChange={set("org")} icon="business" />
            <MudTextField label="Password" value={form.password} onChange={set("password")} icon="lock" type="password"
                          helper="At least 12 characters, one number, one symbol." />

            <MudCheckbox checked label={
              <span style={{ fontSize: 13, color: "var(--mud-text-secondary)" }}>
                I agree to Inphonite's <a className="mud-link">Terms of Service</a> and{" "}
                <a className="mud-link">Privacy Policy</a>, including HIPAA Business Associate Agreement.
              </span>
            } />

            <MudButton size="lg" onClick={onContinue} style={{ width: "100%", marginTop: 4 }}>
              Create account
            </MudButton>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--mud-text-secondary)" }}>
          Already have an account? <a className="mud-link">Sign in</a>
        </div>
      </div>
    </CenteredShell>
  );
}

Object.assign(window, { Signup });
