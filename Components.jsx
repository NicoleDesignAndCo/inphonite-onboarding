// Components.jsx — shared MudBlazor-style primitives
// Exposed on window so other Babel scripts can use them.

const Icon = ({ name, outlined = false, size, style, className = "" }) => (
  <span
    className={(outlined ? "material-icons-outlined" : "material-icons") + " " + className}
    style={size ? { fontSize: size, ...style } : style}
  >{name}</span>
);

const MudButton = ({
  variant = "filled",
  color = "primary",
  size = "md",
  startIcon, endIcon, startIconOutlined = false,
  children, onClick, disabled, style, type = "button",
}) => (
  <button
    type={type}
    className={`mb ${variant} ${color} size-${size}`}
    onClick={onClick}
    disabled={disabled}
    style={style}
  >
    {startIcon && <Icon name={startIcon} outlined={startIconOutlined} />}
    <span>{children}</span>
    {endIcon && <Icon name={endIcon} />}
  </button>
);

const MudIconButton = ({ icon, outlined, onClick, title, color = "default", size = "md", className = "", style }) => (
  <button
    className={`ib ${color === "default" ? "" : color} ${size === "sm" ? "size-sm" : ""} ${className}`}
    onClick={onClick}
    aria-label={title}
    title={title}
    style={style}
  >
    <Icon name={icon} outlined={outlined} />
  </button>
);

const MudFab = ({ icon, label, color = "secondary", onClick, style }) => (
  <button className={`fab ${color}`} onClick={onClick} style={style}>
    <Icon name={icon} />
    {label && <span>{label}</span>}
  </button>
);

const MudCard = ({ title, subtitle, action, children, footer, style }) => (
  <div className="card" style={style}>
    {(title || action) && (
      <div className="head">
        <div className="flex-1">
          {title && <div className="ttl">{title}</div>}
          {subtitle && <div className="sub">{subtitle}</div>}
        </div>
        {action}
      </div>
    )}
    {children && <div className="body">{children}</div>}
    {footer && <div className="actions">{footer}</div>}
  </div>
);

const MudAvatar = ({ children, color = "primary", size = "md", square, style }) => {
  const colors = {
    primary: "var(--mud-primary)",
    secondary: "var(--mud-secondary)",
    tertiary: "var(--mud-tertiary)",
    gray: "var(--mud-gray-500)",
    info: "var(--mud-info)",
    success: "var(--mud-success)",
  };
  return (
    <span
      className={`av ${size}` + (square ? " square" : "")}
      style={{ background: colors[color] || color, ...style }}
    >{children}</span>
  );
};

const MudChip = ({ children, color = "default", variant = "filled", icon, onDelete, onClick, style }) => {
  const cls = ["chip"];
  if (variant === "outlined") cls.push("outlined");
  if (color !== "default") cls.push(color);
  return (
    <span className={cls.join(" ")} style={style} onClick={onClick}>
      {icon && <Icon name={icon} />}
      <span>{children}</span>
      {onDelete && <Icon name="close" style={{ fontSize: 14, cursor: "pointer", opacity: .7, marginRight: -4 }} onClick={(e) => { e.stopPropagation(); onDelete(); }} />}
    </span>
  );
};

const MudTextField = ({ label, value, onChange, placeholder, icon, type = "text", helper, multiline, rows = 3, style }) => (
  <div style={style}>
    <div className={"tf" + (multiline ? " multi" : "")}>
      {icon && <Icon name={icon} outlined />}
      {multiline
        ? <textarea value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} rows={rows} />
        : <input type={type} value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} />}
      {label && <label>{label}</label>}
    </div>
    {helper && <div className="tf-helper">{helper}</div>}
  </div>
);

const MudSelect = ({ label, value, onChange, options = [], placeholder, icon, helper, style }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const opt = options.find((o) => (o.value ?? o) === value);
  const display = opt ? (opt.label ?? opt) : "";
  return (
    <div style={style} ref={ref}>
      <div className="tf" style={{ cursor: "pointer", position: "relative" }}
           onClick={() => setOpen((o) => !o)}>
        {icon && <Icon name={icon} outlined />}
        <div style={{
          flex: 1, font: "400 16px/1.4 var(--font-family-sans)",
          color: display ? "var(--mud-text-primary)" : "var(--mud-text-secondary)",
        }}>
          {display || placeholder || ""}
        </div>
        <Icon name={open ? "arrow_drop_up" : "arrow_drop_down"} style={{ color: "var(--mud-action-default)" }} />
        {label && <label>{label}</label>}
      </div>
      {open && (
        <div style={{
          position: "absolute", marginTop: 4, background: "var(--mud-surface)",
          borderRadius: 4, boxShadow: "var(--elev-8)", zIndex: 20,
          minWidth: 220, padding: "6px 0", maxHeight: 320, overflow: "auto",
        }}>
          {options.map((o) => {
            const val = o.value ?? o;
            const lbl = o.label ?? o;
            const sel = val === value;
            return (
              <div key={val}
                   onClick={() => { onChange?.(val); setOpen(false); }}
                   style={{
                     padding: "10px 16px", cursor: "pointer", fontSize: 14,
                     background: sel ? "rgba(89,74,226,.08)" : "transparent",
                     color: sel ? "var(--mud-primary)" : "var(--mud-text-primary)",
                     fontWeight: sel ? 500 : 400,
                   }}
                   onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "rgba(0,0,0,.04)"; }}
                   onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
                {lbl}
              </div>
            );
          })}
        </div>
      )}
      {helper && <div className="tf-helper">{helper}</div>}
    </div>
  );
};

const MudAlert = ({ severity = "info", icon, children, onClose }) => {
  const ic = icon ?? ({ info: "info", success: "check_circle", warning: "warning", error: "error" })[severity];
  return (
    <div className={`alert ${severity}`}>
      <Icon name={ic} />
      <span className="flex-1">{children}</span>
      {onClose && <Icon name="close" className="x" onClick={onClose} />}
    </div>
  );
};

const MudCheckbox = ({ checked, onChange, label, style }) => (
  <label className="row" style={{ cursor: "pointer", gap: 10, ...style }} onClick={() => onChange?.(!checked)}>
    <span className={"cb" + (checked ? " on" : "")}></span>
    {label && <span style={{ fontSize: 14 }}>{label}</span>}
  </label>
);

const MudSnackbar = ({ open, message, action, onAction, onClose }) => {
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), 4500);
    return () => clearTimeout(t);
  }, [open]);
  if (!open) return null;
  return (
    <div className="snackbar">
      <span className="flex-1">{message}</span>
      {action && <button className="act" onClick={onAction}>{action}</button>}
    </div>
  );
};

Object.assign(window, {
  Icon, MudButton, MudIconButton, MudFab, MudCard,
  MudAvatar, MudChip, MudTextField, MudSelect, MudAlert, MudCheckbox, MudSnackbar,
});
