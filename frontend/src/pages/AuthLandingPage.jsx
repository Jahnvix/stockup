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
        <h1>A softer retail dashboard with more motion, depth, and clarity.</h1>
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
        <div className="auth-scene">
          <div className="auth-widget auth-widget--tall">
            <span className="auth-widget__label">Inventory Value</span>
            <strong>INR 68.7K</strong>
            <div className="auth-widget__bars">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="auth-widget auth-widget--rose">
            <span className="auth-widget__label">Low Stock</span>
            <strong>03</strong>
            <p>Flagged for replenishment</p>
          </div>
          <div className="auth-widget auth-widget--sage">
            <span className="auth-widget__label">Top Range</span>
            <strong>Clothes</strong>
            <p>Fastest-moving inventory family</p>
          </div>
          <div className="auth-widget auth-widget--mist">
            <span className="auth-widget__label">Movement</span>
            <strong>Live</strong>
            <p>Stock in, stock out, and adjustments</p>
          </div>
        </div>
        <p className="muted-copy">Sign in with your assigned account to open the workspace.</p>
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
