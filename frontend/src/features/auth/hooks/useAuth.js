import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { register, login, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;
  const [error, setError] = useState(null);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || "Register failed. Please try again!",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getOrSetUser = async () => {
      const data = await getMe();
      setUser(data ? data.user : null);

      setLoading(false);
    };

    getOrSetUser();
  }, []);

  return { user, loading, error, handleRegister, handleLogin };
};
