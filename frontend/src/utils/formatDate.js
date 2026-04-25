/**
 * Форматирует дату в читаемый русский формат.
 * @example formatDate("2024-01-15") // "15 января 2024 г."
 */
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};
