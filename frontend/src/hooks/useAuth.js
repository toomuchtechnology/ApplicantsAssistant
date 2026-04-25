import { useState, useEffect } from "react";
import { isTokenExpiredOrExpiring, getValidToken } from "../utils/tokenUtils";
import { refreshToken } from "../api/authFetch";

/**
 * Публичный хук для проверки статуса аутентификации.
 * Используется в любом компоненте приложения.
 *
 * @returns {{ user, isAuthenticated, isLoading, getToken }}
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("jwt_token");
      const savedUser = localStorage.getItem("user_data");

      if (!token || !savedUser) {
        setIsLoading(false);
        return;
      }

      if (!isTokenExpiredOrExpiring(token)) {
        setUser(JSON.parse(savedUser));
        setIsLoading(false);
        return;
      }

      // Токен истёк — пробуем обновить
      try {
        await refreshToken();
        const refreshedUser = localStorage.getItem("user_data");
        if (refreshedUser) setUser(JSON.parse(refreshedUser));
      } catch {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user_data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    getToken: getValidToken,
  };
};
