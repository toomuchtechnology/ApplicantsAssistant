import { Info, User, MessagesSquare } from "lucide-react";

export const NAVIGATION_ITEMS = [
  { id: "info", label: "Справка", icon: Info, path: "/info" },
  { id: "chats", label: "Чаты", icon: MessagesSquare, path: "/chats" },
  { id: "profile", label: "Профиль", icon: User, path: "/profile" },
];
