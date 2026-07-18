import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login, register } = useAuth();
  const { addToast } = useToast();

  // "login" | "register"
  const [mode, setMode] = useState("login");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regSecretKey, setRegSecretKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  // ─── Login ────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      addToast("Logged in successfully", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ─────────────────────────────────────────────────────────────
  // Calls /auth/admin/register → creates ADMIN role user, returns token immediately
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (regPassword !== regConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!regSecretKey.trim()) {
      setError("Admin secret key is required");
      return;
    }

    setLoading(true);
    try {
      await register(regName, regEmail, regPassword, regSecretKey);
      addToast("Admin account created! You are now logged in.", "success");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Account creation failed. Please check your details and secret key.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <div style={pageStyle}>
      {/* Ambient glows */}
      <div style={glowTop} />
      <div style={glowBottom} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        <div style={cardStyle}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <div style={logoIconStyle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9", margin: 0, letterSpacing: "-0.3px" }}>
                Admin Panel
              </h1>
              <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.7)", margin: 0, letterSpacing: "0.05em" }}>
                Aayubakwath
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={tabBarStyle}>
            {["login", "register"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => switchMode(tab)}
                style={{
                  ...tabBtnBase,
                  fontWeight: mode === tab ? "600" : "500",
                  color: mode === tab ? "#fff" : "rgba(148,163,184,0.7)",
                  background: mode === tab
                    ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                    : "transparent",
                  boxShadow: mode === tab ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                }}
              >
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* ════════════════ LOGIN FORM ════════════════ */}
          {mode === "login" && (
            <form onSubmit={handleLogin} style={formStyle}>
              <Field label="Email">
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@example.com"
                  autoFocus
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </Field>

              <Field label="Password">
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, paddingRight: "44px" })}
                    onBlur={(e) => Object.assign(e.target.style, { ...inputStyle, paddingRight: "44px" })}
                  />
                  <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
              </Field>

              {error && <ErrorBox message={error} />}

              <button type="submit" disabled={loading} style={btnStyle}>
                {loading
                  ? <SpinRow><Spinner /> Signing in...</SpinRow>
                  : "Sign In"
                }
              </button>
            </form>
          )}

          {/* ════════════════ REGISTER FORM ════════════════ */}
          {mode === "register" && (
            <form onSubmit={handleRegister} style={formStyle}>
              {/* Info banner */}
              <div style={infoBannerStyle}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ fontSize: "12px", color: "rgba(165,180,252,0.85)", lineHeight: "1.5" }}>
                  Creates an <strong style={{ color: "#a5b4fc" }}>ADMIN</strong> account. Requires the admin secret key set on the server.
                </span>
              </div>

              <Field label="Full Name">
                <input
                  id="reg-name"
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="John Doe"
                  autoFocus
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </Field>

              <Field label="Email">
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="admin@example.com"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </Field>

              <Field label="Password">
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, paddingRight: "44px" })}
                    onBlur={(e) => Object.assign(e.target.style, { ...inputStyle, paddingRight: "44px" })}
                  />
                  <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                </div>
              </Field>

              <Field label="Confirm Password">
                <input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                />
              </Field>

              <Field label="Admin Secret Key">
                <div style={{ position: "relative" }}>
                  <input
                    id="reg-secret"
                    type="password"
                    value={regSecretKey}
                    onChange={(e) => setRegSecretKey(e.target.value)}
                    placeholder="Server admin secret"
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => Object.assign(e.target.style, { ...inputFocusStyle, paddingRight: "44px" })}
                    onBlur={(e) => Object.assign(e.target.style, { ...inputStyle, paddingRight: "44px" })}
                  />
                  <div style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    color: "rgba(148,163,184,0.5)",
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                </div>
              </Field>

              {error && <ErrorBox message={error} />}

              <button type="submit" disabled={loading} style={btnStyle}>
                {loading
                  ? <SpinRow><Spinner /> Creating account...</SpinRow>
                  : "Create Admin Account"
                }
              </button>
            </form>
          )}

          {/* Footer */}
          <p style={footerStyle}>
            Access restricted to authorized administrators
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Helper components ───────────────────────────────────────────────────────── */

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "12px", fontWeight: "500", color: "rgba(203,213,225,0.85)", letterSpacing: "0.02em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function SpinRow({ children }) {
  return (
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
      {children}
    </span>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      tabIndex={-1}
      style={{
        position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
        background: "none", border: "none", cursor: "pointer",
        color: "rgba(148,163,184,0.6)", padding: "4px", display: "flex", alignItems: "center",
      }}
    >
      {show ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

function ErrorBox({ message }) {
  return (
    <div style={{
      fontSize: "12.5px", color: "#fca5a5",
      background: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: "8px", padding: "10px 14px",
      display: "flex", alignItems: "flex-start", gap: "8px",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        style={{ flexShrink: 0, marginTop: "1px" }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────────── */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #0f0f11 0%, #1a1a2e 50%, #16213e 100%)",
  padding: "1rem",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  position: "relative",
  overflow: "hidden",
};

const glowTop = {
  position: "fixed", top: "15%", left: "10%",
  width: "350px", height: "350px",
  background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
  borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)",
};

const glowBottom = {
  position: "fixed", bottom: "10%", right: "8%",
  width: "300px", height: "300px",
  background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)",
  borderRadius: "50%", pointerEvents: "none", filter: "blur(40px)",
};

const cardStyle = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "20px",
  padding: "36px 32px",
  boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
};

const logoIconStyle = {
  width: "42px", height: "42px", borderRadius: "12px",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 8px 20px rgba(99,102,241,0.4)", flexShrink: 0,
};

const tabBarStyle = {
  display: "flex",
  background: "rgba(255,255,255,0.05)",
  borderRadius: "10px",
  padding: "4px",
  marginBottom: "24px",
  border: "1px solid rgba(255,255,255,0.07)",
};

const tabBtnBase = {
  flex: 1, padding: "8px 0", fontSize: "13px",
  border: "none", borderRadius: "7px",
  cursor: "pointer", transition: "all 0.2s ease",
  letterSpacing: "0.01em",
};

const formStyle = { display: "flex", flexDirection: "column", gap: "14px" };

const inputStyle = {
  width: "100%", padding: "10px 14px", fontSize: "13.5px",
  color: "#e2e8f0", background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px",
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
  caretColor: "#6366f1",
};

const inputFocusStyle = {
  ...inputStyle,
  borderColor: "rgba(99,102,241,0.6)",
  boxShadow: "0 0 0 3px rgba(99,102,241,0.15)",
  background: "rgba(255,255,255,0.07)",
};

const btnStyle = {
  width: "100%", padding: "11px 0", fontSize: "14px",
  fontWeight: "600", color: "#fff",
  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  border: "none", borderRadius: "10px", cursor: "pointer",
  letterSpacing: "0.01em", boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
  transition: "opacity 0.2s, transform 0.15s",
  marginTop: "2px",
};

const infoBannerStyle = {
  display: "flex", gap: "10px", alignItems: "flex-start",
  background: "rgba(99,102,241,0.08)",
  border: "1px solid rgba(99,102,241,0.2)",
  borderRadius: "10px", padding: "12px 14px",
};

const footerStyle = {
  marginTop: "20px", textAlign: "center",
  fontSize: "11px", color: "rgba(148,163,184,0.45)",
  letterSpacing: "0.02em",
};
