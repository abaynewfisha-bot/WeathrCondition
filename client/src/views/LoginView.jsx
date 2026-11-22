import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CloudSun, LogIn } from "lucide-react";
import { loginUser } from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";

export default function LoginView() {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginUser(email, password);
      setAuthenticated(response);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Welcome back" submitText={loading ? "Signing in..." : "Log in"} onSubmit={submit} error={error}>
      <AuthField label="Email" type="email" value={email} onChange={setEmail} />
      <AuthField label="Password" type="password" value={password} onChange={setPassword} />
      <p className="text-sm text-[var(--muted)]">
        New to WeatherWorld? <Link className="font-bold text-[#75a8ee]" to="/register">Create an account</Link>
      </p>
    </AuthCard>
  );
}

export function AuthCard({ title, submitText, onSubmit, error, children }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[460px] items-center">
      <form onSubmit={onSubmit} className="w-full rounded-[20px] border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[0_18px_45px_rgba(15,30,70,.12)] sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <CloudSun size={42} className="text-[#ffd45a]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">WeatherWorld</p>
            <h1 className="text-2xl font-extrabold">{title}</h1>
          </div>
        </div>
        <div className="grid gap-4">{children}</div>
        {error && <p className="mt-4 rounded-[10px] bg-[#ef8dad]/15 px-3 py-2 text-sm text-[#ef8dad]" role="alert">{error}</p>}
        <button disabled={Boolean(submitText.includes("..."))} type="submit" className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[12px] border-0 bg-[linear-gradient(135deg,#4e82df,#806cbf)] font-bold text-white disabled:opacity-60">
          <LogIn size={18} />
          {submitText}
        </button>
      </form>
    </main>
  );
}

export function AuthField({ label, type = "text", value, onChange }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input required minLength={type === "password" ? 8 : undefined} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[48px] rounded-[12px] border border-[var(--border)] bg-[var(--card)] px-4 text-[var(--text)] outline-none focus:border-[#75a5e7]" />
    </label>
  );
}
