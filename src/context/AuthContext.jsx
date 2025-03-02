import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (token && isValidToken(token)) {
      const decoded = jwtDecode(token);
      setUser({ 
        id: decoded.id, 
        role: decoded.role,
        username: decoded.username
      });
    }
    setLoading(false);
  };

  const isValidToken = (token) => {
    try {
      const { exp } = jwtDecode(token);
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({
      id: decoded.id,
      role: decoded.role,
      username: decoded.username,
      fullName: decoded.fullName,
    });
    navigate(getDashboardPath(decoded.role));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const getDashboardPath = (role) => {
    switch(role) {
      case "admin": return "/admin";
      case "vendeur": return "/vendeur";
      default: return "/boutique";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);