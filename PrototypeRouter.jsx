// PrototypeRouter.jsx — hash-based router + shared state across the prototype
// Manages: current screen, survey answers, setup progress phase, EHR selection, nav lock state.

const ROUTES = [
  "signup", "survey/1", "survey/2", "survey/3",
  "dashboard",
  "setup/business", "setup/channels", "setup/tollfree", "setup/ehr", "setup/review",
  "first-message", "first-message/templates", "first-message/composer", "first-message/sent",
];

// ---------- Initial demo state ----------
const DEFAULT_STATE = {
  practice: {
    name: "Cedar Park Family Dental",
    category: "Dental",
    type: "Dental",
    size: "10-25",
    role: "Office Admin",
  },
  channels: ["sms", "voice"], // sms, voice, email
  ehr: "dentrix", // id from EHR_LIST or "manual"
  // overall setup phase: 'collecting' (user filling in), 'review' (in inphonite review), 'ready' (everything done)
  phase: "collecting",
  // per-card status, drives checklist + dashboard
  setup: {
    business: "todo",   // todo | in_progress | submitted | done
    channels: "done",   // captured during survey
    tollfree: "todo",
    ehr: "todo",
    review: "locked",
  },
  // toll-free state machine
  tfn: {
    state: "verify_needed", // verify_needed | reserving | carrier_review | ready
    number: "+1 (888) 247-3091",
    location: "Cedar Park, TX",
  },
  // message wizard draft
  msgDraft: {
    name: "Weekly Appointment Reminders",
    body: "Hi (FIRST_NAME), this is a reminder about your appointment with (PROVIDER_NAME) on (APPOINTMENT_DATE) at (APPOINTMENT_TIME). Reply YES to confirm or call us at (555) 123-4567.",
    schedule: "24",
  },
  // nav lock global — overall product unlocked or not
  navUnlocked: false,
};

// Persist in sessionStorage so demo state survives reloads
function useDemoState() {
  const [s, setS] = React.useState(() => {
    try {
      const raw = sessionStorage.getItem("inphonite_demo_state");
      if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } catch (_) {}
    return DEFAULT_STATE;
  });
  React.useEffect(() => {
    try { sessionStorage.setItem("inphonite_demo_state", JSON.stringify(s)); } catch (_) {}
  }, [s]);
  const patch = (updates) => setS((prev) => ({ ...prev, ...(typeof updates === "function" ? updates(prev) : updates) }));
  const reset = () => setS(DEFAULT_STATE);
  return [s, patch, reset];
}

// ---------- Hash router ----------
function useHashRoute(defaultRoute = "flow") {
  const get = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return h || defaultRoute;
  };
  const [route, setRoute] = React.useState(get);
  React.useEffect(() => {
    const onHash = () => setRoute(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (r) => {
    window.location.hash = "#/" + r;
    // scroll to top of main content
    setTimeout(() => {
      const main = document.querySelector(".main");
      if (main) main.scrollTop = 0;
      window.scrollTo({ top: 0 });
    }, 30);
  };
  return [route, go];
}

// Compute derived progress (% done over the 5 checklist items)
function computeProgress(s) {
  const items = ["business", "channels", "tollfree", "ehr", "review"];
  let pts = 0; let total = items.length;
  for (const k of items) {
    const st = s.setup[k];
    if (st === "done") pts += 1;
    else if (st === "submitted" || st === "in_progress") pts += 0.5;
  }
  return Math.round((pts / total) * 100);
}

Object.assign(window, { useDemoState, useHashRoute, computeProgress, DEFAULT_STATE, ROUTES });
