import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, signup as apiSignup, fetchMe, getToken } from "../api/auth";

const AuthContext = createContext(null);

/**
 * AuthProvider:
 * Holds the logged-in user for the whole app. On page load it checks for a
 * saved token and asks the server who the user is, so login survives refresh.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("token")) // expired or invalid token
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const login = async (email, password) => handleAuth(await apiLogin(email, password));
  const signup = async (name, email, password) =>
    handleAuth(await apiSignup(name, email, password));

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
