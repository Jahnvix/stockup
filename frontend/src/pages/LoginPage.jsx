import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
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
        <h1>SoftStock keeps operations calm, clear, and current.</h1>
        <p>
          Manage products, watch stock movement, and respond to low-stock alerts from a
          dashboard designed in soft earthy tones.
        </p>
        <div className="showcase-pills">
          <span>JWT auth</span>
          <span>Low stock alerts</span>
          <span>Stock movement log</span>
          <span>MERN architecture</span>
        </div>
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
              <h2>{mode === "login" ? "Sign in to continue" : "Create your workspace"}</h2>
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
              ? "Enter dashboard"
              : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
