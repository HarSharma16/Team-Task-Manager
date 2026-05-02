import { useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, user, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
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
      await signup(form);
      toast.success("Account created");
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
      title="Create account"
      subtitle="Join a shared task workspace with a role that matches how your team works."
      backgroundImage={backgroundImage}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="label" htmlFor="name">
            Name
          </label>
          <input className="field bg-slate-950/80 text-white placeholder:text-white/70 border-white/10 focus:border-white/20 focus:ring-white/10" id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name" required />
        </div>

        <div className="space-y-2">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input className="field bg-slate-950/80 text-white placeholder:text-white/70 border-white/10 focus:border-white/20 focus:ring-white/10" id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />
        </div>

        <div className="space-y-2">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="field bg-slate-950/80 text-white placeholder:text-white/70 border-white/10 focus:border-white/20 focus:ring-white/10"
            id="password"
            name="password"
            type="password"
            minLength="6"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="label" htmlFor="role">
            Role
          </label>
          <select className="field" id="role" name="role" value={form.role} onChange={handleChange}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="btn-primary w-full" type="submit" disabled={submitting}>
          <UserPlus className="h-5 w-5" aria-hidden="true" />
          {submitting ? "Creating account" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link className="font-bold text-sky-700 hover:text-sky-800 dark:text-sky-300" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default Signup;
