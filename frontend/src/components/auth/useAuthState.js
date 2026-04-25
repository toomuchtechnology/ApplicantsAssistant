import { useState, useEffect, useCallback } from "react";
import { isTokenExpiredOrExpiring } from "../../utils/tokenUtils";
import { refreshToken, authFetch } from "../../api/authFetch";
import { authenticateWithGoogle, logout } from "../../api/authApi";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";

/**
 * Внутренний хук AuthComponent.
 * Управляет стейтом пользователя, логином, логаутом и периодическим refresh.
 */
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  // Проверка и восстановление сессии при монтировании
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem("jwt_token");
    const savedUser = localStorage.getItem("user_data");

    if (!token || !savedUser) {
      setIsCheckingAuth(false);
      return;
    }

    if (isTokenExpiredOrExpiring(token)) {
      try {
        await refreshToken();
        const refreshedUser = localStorage.getItem("user_data");
        if (refreshedUser) setUser(JSON.parse(refreshedUser));
      } catch {
        // Сессия невалидна — остаёмся в незалогиненном состоянии
      }
      setIsCheckingAuth(false);
      return;
    }

    // Токен свежий — получаем актуальные данные с сервера
    try {
      const response = await authFetch(`${API_BASE_URL}/api/users/me`);
      if (response.ok) {
        const userData = await response.json();
        saveUser(userData);
      } else {
        // API недоступен — используем кэш
        setUser(JSON.parse(savedUser));
      }
    } catch {
      setUser(JSON.parse(savedUser));
    }

    setIsCheckingAuth(false);
  }, []);

  // Вход через Google
  const handleGoogleLogin = async (idToken) => {
    try {
      setIsLoading(true);
      const authData = await authenticateWithGoogle(idToken);
      if (authData.user) setUser(authData.user);
      return authData;
    } finally {
      setIsLoading(false);
    }
  };

  // Выход
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Инициализация
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Периодический refresh (каждый час)
  useEffect(() => {
    const interval = setInterval(
      () => {
        const token = localStorage.getItem("jwt_token");
        if (token && isTokenExpiredOrExpiring(token)) {
          refreshToken().catch(() => {
            /* токен протух — следующий логин исправит */
          });
        }
      },
      60 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  return {
    user,
    isLoading,
    isCheckingAuth,
    handleGoogleLogin,
    handleLogout,
  };
};
