import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinks = [
  { to: "/", label: "Dashboard", detail: "Overview" },
  { to: "/inventory", label: "Inventory", detail: "Catalog studio" },
];

const BoutiqueLayout = () => {
  const { user, logout } = useAuth();
  const todayLabel = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
  }).format(new Date());

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <p className="eyebrow">Retail inventory studio</p>
          <div className="brand-mark">
            <span className="brand-mark__seal">SS</span>
            <div>
              <h1>SoftStock</h1>
              <p className="brand-copy">
                Bold retail cards, cleaner stock views, and a faster dashboard for fashion teams.
              </p>
            </div>
          </div>
          <div className="brand-wave" />
        </div>

        <div className="season-card">
          <p className="eyebrow">Current focus</p>
          <h2>Clothes, skincare, and bags in one calm workspace.</h2>
          <p className="brand-copy">
            Keep fast-moving collections visible, spot low-stock items early, and update
            product movement without switching tools.
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
              <span>{link.label}</span>
              <small className="nav-meta">{link.detail}</small>
            </NavLink>
          ))}
        </nav>

        <div className="profile-card">
          <p className="eyebrow">Signed in as</p>
          <h2>{user?.name}</h2>
          <span className="profile-badge">{user?.role}</span>
          <p>{user?.email}</p>
          <button type="button" className="ghost-button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="page-shell">
        <header className="page-header">
          <div>
            <p className="eyebrow">Inventory management system</p>
            <h2>Retail operations with bold color, stronger hierarchy, and clearer cards</h2>
            <p className="muted-copy">
              Track stock, value, and movement across your boutique essentials in one place.
            </p>
          </div>
          <div className="page-header__meta">
            <span className="status-pill">Live stock workspace</span>
            <span className="date-chip">{todayLabel}</span>
            <span className="status-pill">Welcome, {user?.name?.split(" ")[0] || "Team"}</span>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default BoutiqueLayout;
