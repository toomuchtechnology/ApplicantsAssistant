const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";

// Нативный fetch без перехватчика — для auth-эндпоинтов он не нужен
const nativeFetch = window.fetch.bind(window);

/**
 * Аутентифицирует пользователя через Google ID token.
 * Сохраняет jwt_token и user_data в localStorage.
 * @returns {Promise<{ token: string, user: object }>}
 */
export const authenticateWithGoogle = async (idToken) => {
  const response = await nativeFetch(`${API_BASE_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: idToken }),
  });

  if (!response.ok) {
    let message = `HTTP error: ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      /* ignore parse error */
    }
    throw new Error(message);
  }

  const authData = await response.json();

  if (authData.token) localStorage.setItem("jwt_token", authData.token);
  if (authData.user)
    localStorage.setItem("user_data", JSON.stringify(authData.user));

  return authData;
};

/**
 * Вызывает logout-эндпоинт и очищает localStorage.
 * Не бросает ошибку если запрос упал — логаут локально всегда происходит.
 */
export const logout = () => {
  nativeFetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST" }).catch(
    () => {
      /* best-effort */
    },
  );
  localStorage.clear();
};
