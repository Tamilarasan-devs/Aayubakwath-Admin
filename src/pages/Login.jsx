import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login, register } = useAuth();
  const { addToast } = useToast();

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
  const [showSecret, setShowSecret] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

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
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Account creation failed. Please check your details and secret key."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Header stripe */}
          <div className="h-1 w-full bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">
                  Admin Panel
                </h1>
                <p className="text-[11px] text-gray-400 tracking-wide">
                  Aayubakwath
                </p>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-lg bg-gray-100 p-0.5 mb-6 gap-0.5">
              {["login", "register"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchMode(tab)}
                  className={`flex-1 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150 ${
                    mode === tab
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* ═══ LOGIN FORM ═══ */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <Field label="Email">
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoFocus
                    className={inputCls}
                  />
                </Field>

                <Field label="Password">
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`${inputCls} pr-10`}
                    />
                    <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </div>
                </Field>

                {error && <ErrorBox message={error} />}

                <button type="submit" disabled={loading} className={btnCls}>
                  {loading ? <><Spinner /> Signing in...</> : "Sign In"}
                </button>
              </form>
            )}

            {/* ═══ REGISTER FORM ═══ */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Info note */}
                <div className="flex gap-2 items-start bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-[11.5px] text-blue-700 leading-relaxed">
                    Creates an <strong>ADMIN</strong> account. Requires the server admin secret key.
                  </p>
                </div>

                <Field label="Full Name">
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    autoFocus
                    className={inputCls}
                  />
                </Field>

                <Field label="Email">
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className={inputCls}
                  />
                </Field>

                <Field label="Password">
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className={`${inputCls} pr-10`}
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
                    className={inputCls}
                  />
                </Field>

                <Field label="Admin Secret Key">
                  <div className="relative">
                    <input
                      id="reg-secret"
                      type={showSecret ? "text" : "password"}
                      value={regSecretKey}
                      onChange={(e) => setRegSecretKey(e.target.value)}
                      placeholder="Server admin secret"
                      className={`${inputCls} pr-10`}
                    />
                    <EyeToggle show={showSecret} onToggle={() => setShowSecret(!showSecret)} />
                  </div>
                </Field>

                {error && <ErrorBox message={error} />}

                <button type="submit" disabled={loading} className={`${btnCls} mt-1`}>
                  {loading ? <><Spinner /> Creating account...</> : "Create Admin Account"}
                </button>
              </form>
            )}

            {/* Footer */}
            <p className="mt-6 text-center text-[11px] text-gray-400">
              Access restricted to authorized administrators
            </p>
          </div>
        </div>

        {/* Bottom label */}
        <p className="mt-4 text-center text-[11px] text-gray-400">
          © {new Date().getFullYear()} Aayubakwath. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/* ── Shared Tailwind class strings ─────────────────────────────────────────── */

const inputCls =
  "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 " +
  "outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:bg-white " +
  "transition-colors placeholder:text-gray-400 text-gray-900";

const btnCls =
  "w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium " +
  "text-white bg-gray-900 rounded-lg hover:bg-black transition-colors " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

/* ── Helper components ─────────────────────────────────────────────────────── */

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
