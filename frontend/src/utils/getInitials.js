/**
 * Возвращает инициалы из имени и фамилии.
 * @example getInitials("Иван", "Петров") // "ИП"
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "U";
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};
