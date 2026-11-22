import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";
import { AuthCard, AuthField } from "./LoginView";

export default function RegisterView() {
  const navigate = useNavigate();
  const { setAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await registerUser(name, email, password);
      setAuthenticated(response);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Create account" submitText={loading ? "Creating account..." : "Register"} onSubmit={submit} error={error}>
      <AuthField label="Full name" value={name} onChange={setName} />
      <AuthField label="Email" type="email" value={email} onChange={setEmail} />
      <AuthField label="Password" type="password" value={password} onChange={setPassword} />
      <p className="text-sm text-[var(--muted)]">
        Already have an account? <Link className="font-bold text-[#75a8ee]" to="/login">Log in</Link>
      </p>
    </AuthCard>
  );
}
