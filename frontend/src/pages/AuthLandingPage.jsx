import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AuthLandingPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (mode === "login") {
        await login({
          email: values.email,
          password: values.password,
        });
      } else {
        await register(values);
      }

      startTransition(() => {
        navigate("/");
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-showcase">
        <p className="eyebrow">Inventory management system</p>
        <h1>A softer retail dashboard for clothes, skincare, and bags.</h1>
        <p>
          Manage premium product lines, monitor stock movement, and react to low-stock
          signals from a calm workspace that feels closer to a brand studio than a plain
          admin panel.
        </p>
        <div className="showcase-pills">
          <span>Clothes</span>
          <span>Skincare</span>
          <span>Bags</span>
          <span>MERN stack</span>
        </div>
        <div className="showcase-grid">
          <div className="showcase-card">
            <strong>Live dashboard</strong>
            <p>See inventory value, category spread, and movement at a glance.</p>
          </div>
          <div className="showcase-card">
            <strong>Catalog editor</strong>
            <p>Add new product lines, change pricing, and update stock thresholds fast.</p>
          </div>
          <div className="showcase-card">
            <strong>Movement log</strong>
            <p>Track stock in, stock out, and adjustments in a single timeline.</p>
          </div>
        </div>
        <p className="login-hint">
          Starter admin: <code>admin@softstock.com</code> / <code>Admin@123</code>
        </p>
      </section>

      <section className="auth-card">
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "login" ? "toggle-button toggle-button--active" : "toggle-button"}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={
              mode === "register" ? "toggle-button toggle-button--active" : "toggle-button"
            }
            onClick={() => setMode("register")}
          >
            Create account
          </button>
        </div>

        <form className="soft-form" onSubmit={handleSubmit}>
          <div className="panel-header panel-header--tight">
            <div>
              <p className="eyebrow">{mode === "login" ? "Welcome back" : "Fresh setup"}</p>
              <h2>{mode === "login" ? "Enter your workspace" : "Create your workspace"}</h2>
            </div>
          </div>

          {mode === "register" ? (
            <label>
              <span>Full name</span>
              <input
                className="soft-input"
                name="name"
                value={values.name}
                onChange={handleChange}
                required
              />
            </label>
          ) : null}

          <label>
            <span>Email</span>
            <input
              className="soft-input"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              className="soft-input"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="feedback feedback--error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Open dashboard"
                : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default AuthLandingPage;
