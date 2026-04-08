import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinks = [
  { to: "/", label: "Dashboard" },
  { to: "/inventory", label: "Inventory" },
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <p className="eyebrow">MERN inventory suite</p>
          <h1>SoftStock</h1>
          <p className="brand-copy">
            Calm visuals, live stock control, and a workspace that stays easy on the eyes.
          </p>
        </div>

        <nav className="sidebar-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                isActive ? "sidebar-link sidebar-link--active" : "sidebar-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="profile-card">
          <p className="eyebrow">Signed in as</p>
          <h2>{user?.name}</h2>
          <p>
            {user?.role} · {user?.email}
          </p>
          <button type="button" className="ghost-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="page-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">Inventory management system</p>
            <h2>Operational clarity with a softer visual rhythm</h2>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

