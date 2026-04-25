import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

/**
 * Инкапсулирует логику активного роута и навигации.
 *
 * isInChat  — пользователь находится внутри конкретного чата
 * isActive  — принимает path, возвращает true если роут активен
 * navigate  — переход с закрытием мобильного меню (передаётся onNavigate)
 */
export const useNavigation = (onNavigate) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isInChat =
    location.pathname.startsWith("/rag-chat/") ||
    location.pathname === "/rag-chat";

  const isActive = useCallback(
    (path) => {
      if (path === "/chats") {
        return location.pathname === "/chats" || isInChat;
      }
      return location.pathname === path;
    },
    [location.pathname, isInChat],
  );

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      onNavigate?.();
    },
    [navigate, onNavigate],
  );

  return { isActive, isInChat, handleNavigate };
};
