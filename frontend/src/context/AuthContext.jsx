import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiRequest } from "../api/client.js";
import { isPreviewMock, previewSession } from "../api/mockPreview.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "softstock-session";

export const AuthProvider = ({ children }) => {
  const previewMode = isPreviewMock();
  const [token, setToken] = useState(() =>
    previewMode ? previewSession.token : localStorage.getItem(STORAGE_KEY) || ""
  );
  const [user, setUser] = useState(() => (previewMode ? previewSession.user : null));
  const [loading, setLoading] = useState(() => (previewMode ? false : Boolean(token)));

  useEffect(() => {
    if (previewMode) {
      return undefined;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const hydrate = async () => {
      try {
        const data = await apiRequest("/auth/me", { token });
        if (mounted) {
          startTransition(() => {
            setUser(data.user);
            setLoading(false);
          });
        }
      } catch (_error) {
        if (mounted) {
          localStorage.removeItem(STORAGE_KEY);
          setToken("");
          setUser(null);
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, [previewMode, token]);

  const persistSession = (payload) => {
    if (previewMode) {
      setToken(previewSession.token);
      setUser(previewSession.user);
      return;
    }

    localStorage.setItem(STORAGE_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (values) => {
    const payload = await apiRequest("/auth/login", {
      method: "POST",
      body: values,
    });
    persistSession(payload);
    return payload;
  };

  const register = async (values) => {
    const payload = await apiRequest("/auth/register", {
      method: "POST",
      body: values,
    });
    persistSession(payload);
    return payload;
  };

  const logout = () => {
    if (previewMode) {
      setToken(previewSession.token);
      setUser(previewSession.user);
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
