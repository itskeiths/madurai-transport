import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/AuthPage.css";

type Mode = "login" | "register" | "forgot";

// Floating background icons
const BG_ICONS = ["🚌", "🚍", "🎫", "📍", "🗺️", "🕐", "🚏"];

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const reset = () => {
    setError(null);
    setSuccess(null);
    setEmail("");
    setPassword("");
    setDisplayName("");
    setPhone("");
    setCity("");
    setShowPass(false);
  };

  const switchMode = (m: Mode) => {
    reset();
    setMode(m);
  };

  // ── Login ──────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Register ───────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password) { setError("Name, email and password are required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        displayName,
        email,
        phone: phone || "",
        city: city || "",
        createdAt: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ────────────────────────────────────────
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true); setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("Failed to send reset email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Floating ambient icons */}
      {BG_ICONS.map((icon, i) => (
        <span
          key={i}
          className="auth-bg-icon"
          style={{
            left: `${8 + i * 13}%`,
            bottom: "-40px",
            animationDuration: `${9 + i * 2.5}s`,
            animationDelay: `${i * 1.4}s`,
            fontSize: `${18 + (i % 3) * 8}px`,
          }}
        >
          {icon}
        </span>
      ))}

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-icon-badge">🚌</div>
        <h1 className="app-title">Madurai One</h1>
        <p className="tagline">Your smart companion for local bus travel</p>

        {/* ── LOGIN ──────────────────────────────────────── */}
        {mode === "login" && (
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                id="login-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="login-password"
                  className="auth-input"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-forgot-row">
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => switchMode("forgot")}
              >
                Forgot password?
              </button>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button id="login-submit" className="auth-primary-btn" type="submit" disabled={loading}>
              {loading ? <><div className="btn-spinner" /> Signing in…</> : "Sign In"}
            </button>

            <p className="auth-switch-text">
              Don't have an account?{" "}
              <button type="button" className="auth-link-btn auth-link-highlight" onClick={() => switchMode("register")}>
                Register
              </button>
            </p>
          </form>
        )}

        {/* ── REGISTER ───────────────────────────────────── */}
        {mode === "register" && (
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <div className="auth-form-group">
              <label className="auth-label">Full Name <span className="auth-required">*</span></label>
              <input
                id="reg-name"
                className="auth-input"
                type="text"
                placeholder="Arjun Kumar"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Email <span className="auth-required">*</span></label>
              <input
                id="reg-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password <span className="auth-required">*</span></label>
              <div className="auth-input-wrap">
                <input
                  id="reg-password"
                  className="auth-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Phone <span className="auth-optional">(optional)</span></label>
              <input
                id="reg-phone"
                className="auth-input"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">City <span className="auth-optional">(optional)</span></label>
              <input
                id="reg-city"
                className="auth-input"
                type="text"
                placeholder="Madurai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button id="register-submit" className="auth-primary-btn" type="submit" disabled={loading}>
              {loading ? <><div className="btn-spinner" /> Creating account…</> : "Create Account"}
            </button>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <button type="button" className="auth-link-btn auth-link-highlight" onClick={() => switchMode("login")}>
                Sign In
              </button>
            </p>
          </form>
        )}

        {/* ── FORGOT PASSWORD ─────────────────────────────── */}
        {mode === "forgot" && (
          <form className="auth-form" onSubmit={handleForgot} noValidate>
            <p className="auth-forgot-desc">
              Enter your registered email and we'll send a password reset link.
            </p>

            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                id="forgot-email"
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}

            <button id="forgot-submit" className="auth-primary-btn" type="submit" disabled={loading}>
              {loading ? <><div className="btn-spinner" /> Sending…</> : "Send Reset Link"}
            </button>

            <p className="auth-switch-text">
              <button type="button" className="auth-link-btn auth-link-highlight" onClick={() => switchMode("login")}>
                ← Back to Sign In
              </button>
            </p>
          </form>
        )}

        <p className="auth-privacy">Fast · Simple · Local Bus Booking</p>
      </div>
    </div>
  );
}
