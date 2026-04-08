import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const ProtectedApp = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const previewScreen = new URLSearchParams(location.search).get("screen");

  if (loading) {
    return (
      <div className="screen-loader">
        <div className="screen-loader__bubble" />
        <p>Preparing your soft-stock workspace...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (location.pathname === "/" && previewScreen === "inventory") {
    return <Navigate to="/inventory?previewMock=1" replace />;
  }

  return <Layout />;
};

const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="screen-loader">
        <div className="screen-loader__bubble" />
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginPage />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<PublicOnlyRoute />} />
    <Route path="/" element={<ProtectedApp />}>
      <Route index element={<DashboardPage />} />
      <Route path="inventory" element={<InventoryPage />} />
    </Route>
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
