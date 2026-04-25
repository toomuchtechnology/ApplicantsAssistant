/**
 * Декодирует payload JWT без верификации подписи.
 * Возвращает null если токен невалиден.
 */
export const parseToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

/**
 * Возвращает true если токен истёк или истекает в течение bufferMs.
 * Возвращает true если токен отсутствует или невалиден.
 */
export const isTokenExpiredOrExpiring = (token, bufferMs = 5 * 60 * 1000) => {
  const payload = parseToken(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000 - bufferMs;
};

/**
 * Возвращает токен из localStorage если он ещё валиден, иначе null.
 */
export const getValidToken = () => {
  const token = localStorage.getItem("jwt_token");
  return token && !isTokenExpiredOrExpiring(token) ? token : null;
};
