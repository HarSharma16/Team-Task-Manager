import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login(form);
      toast.success("Welcome back");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const backgroundImage =
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80";

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your projects, assigned tasks, and team progress from one workspace."
      backgroundImage={backgroundImage}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label text-white" htmlFor="email">
            Email
          </label>
          <input
            className="field bg-slate-950/80 text-white placeholder:text-white/70 border-white/10 focus:border-white/20 focus:ring-white/10"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="label text-white" htmlFor="password">
            Password
          </label>
          <input
            className="field bg-slate-950/80 text-white placeholder:text-white/70 border-white/10 focus:border-white/20 focus:ring-white/10"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          <LogIn className="h-5 w-5" aria-hidden="true" />
          {submitting ? "Signing in" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        New to Team Task Manager?{" "}
        <Link className="font-bold text-sky-700 hover:text-sky-800 dark:text-sky-300" to="/signup">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
