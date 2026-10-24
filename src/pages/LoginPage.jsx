import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  boxSizing: "border-box",
};

/**
 * LoginPage Component:
 * Combined login / sign-up form. Talks to the Express + MongoDB backend
 * through the AuthProvider and calls onSuccess once the user is logged in.
 */
export default function LoginPage({ onSuccess, onBack }) {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(name, email, password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Could not reach the server. Is the backend running?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "80px 1rem", position: "relative", zIndex: 1 }}>
      <button onClick={onBack} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13, marginBottom: 32, padding: 0, fontFamily: "'DM Sans', sans-serif" }}>← Back</button>

      <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
        {mode === "login" ? "Welcome back" : "Join in"}
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 400, color: "var(--text)", marginBottom: 12 }}>
        {mode === "login" ? "Log in" : "Create account"}
      </h2>
      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 32 }}>
        Save your playlist history to your account and open it on any device.
      </p>

      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        {mode === "signup" && (
          <input style={inputStyle} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={inputStyle} type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && (
          <p style={{ color: "#e27070", fontSize: 13, padding: "10px 14px", borderRadius: 8, background: "rgba(226,112,112,0.08)", border: "1px solid rgba(226,112,112,0.2)", margin: 0 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          style={{ padding: "12px 28px", borderRadius: 999, border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", cursor: busy ? "default" : "pointer", fontSize: 14, fontFamily: "'DM Sans', sans-serif", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 13, color: "var(--muted)" }}>
        {mode === "login" ? "New here? " : "Already registered? "}
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", padding: 0 }}
        >
          {mode === "login" ? "Create an account" : "Log in"}
        </button>
      </p>
    </div>
  );
}
