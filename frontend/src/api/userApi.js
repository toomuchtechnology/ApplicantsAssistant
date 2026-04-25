const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";

/**
 * Возвращает заголовки с JWT-токеном.
 * Бросает ошибку если токена нет.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  if (!token) throw new Error("Authentication required. Please login.");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const userApi = {
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401)
        throw new Error("Session expired. Please login again.");
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user data");
    }

    return response.json();
  },
};
