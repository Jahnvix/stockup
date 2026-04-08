import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import BoutiqueLayout from "./components/BoutiqueLayout.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import AuthLandingPage from "./pages/AuthLandingPage.jsx";
import CatalogStudioPage from "./pages/CatalogStudioPage.jsx";
import RetailDashboardPage from "./pages/RetailDashboardPage.jsx";

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

  return <BoutiqueLayout />;
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

  return <AuthLandingPage />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<PublicOnlyRoute />} />
    <Route path="/" element={<ProtectedApp />}>
      <Route index element={<RetailDashboardPage />} />
      <Route path="inventory" element={<CatalogStudioPage />} />
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
