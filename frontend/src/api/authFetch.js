import { isTokenExpiredOrExpiring } from "../utils/tokenUtils";
import { logout } from "./authApi";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";
const nativeFetch = window.fetch.bind(window);

const isOurApiUrl = (url) =>
  typeof url === "string" && url.includes(API_BASE_URL);
const isAuthUrl = (url) =>
  typeof url === "string" && url.includes("/api/auth/");

/**
 * Обновляет JWT через /api/auth/refresh.
 * При неудаче очищает localStorage и бросает ошибку.
 */
export const refreshToken = async () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("No token available");

  const response = await nativeFetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
    throw new Error(`Refresh failed: ${response.status}`);
  }

  const authData = await response.json();
  if (authData.token) localStorage.setItem("jwt_token", authData.token);
  if (authData.user)
    localStorage.setItem("user_data", JSON.stringify(authData.user));

  return authData;
};

/**
 * fetch-обёртка с автоматическим refresh и подстановкой Authorization.
 * Используется только для наших API-эндпоинтов (не auth).
 */
export const authFetch = async (url, options = {}) => {
  let token = localStorage.getItem("jwt_token");

  // Проактивный refresh если токен скоро истекает
  if (token && isTokenExpiredOrExpiring(token)) {
    await refreshToken();
    token = localStorage.getItem("jwt_token");
  }

  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await nativeFetch(url, { ...options, headers });

  // Реактивный refresh при 401
  if (response.status === 401 && token) {
    try {
      await refreshToken();
      const newToken = localStorage.getItem("jwt_token");
      headers["Authorization"] = `Bearer ${newToken}`;
      return nativeFetch(url, { ...options, headers });
    } catch {
      logout();
      throw new Error("Authentication failed");
    }
  }

  return response;
};

/**
 * Патчит window.fetch один раз при старте приложения.
 * Вызывать в main.jsx / App.jsx, НЕ внутри компонентов.
 *
 * @example
 * // main.jsx
 * import { installFetchInterceptor } from "@/api/authFetch";
 * installFetchInterceptor();
 */
export const installFetchInterceptor = () => {
  window.fetch = async function (url, options = {}) {
    if (isOurApiUrl(url) && !isAuthUrl(url)) {
      return authFetch(url, options);
    }
    return nativeFetch(url, options);
  };
};
