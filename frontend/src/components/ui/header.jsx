// src/components/ui/header.jsx
import React, { useState } from "react";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";
import { AuthComponent } from "./auth-component";
import {
  GraduationCap,
  Info,
  Menu,
  X,
  User,
  MessagesSquare,
  MessageSquareText,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "info", label: "Справка", icon: Info, path: "/info" },
    { id: "chats", label: "Чаты", icon: MessagesSquare, path: "/chats" },
    { id: "profile", label: "Профиль", icon: User, path: "/profile" },
  ];

  // "chats" list page — exact match only
  const isChatsListActive = location.pathname === "/chats";

  // Inside a specific chat session
  const isInChat =
    location.pathname.startsWith("/rag-chat/") ||
    location.pathname === "/rag-chat";

  const isActive = (path) => {
    if (path === "/chats") return isChatsListActive || isInChat;
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold text-foreground hidden sm:block leading-tight">
              Ассистент абитуриента
            </span>
            <span className="text-base font-semibold text-foreground sm:hidden leading-tight">
              Ассистент
            </span>
          </div>

          {/* Desktop nav — centered */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              // For the "Чаты" item, show a sub-indicator when inside a chat
              const showChatBadge = item.id === "chats" && isInChat;

              return (
                <Button
                  key={item.id}
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-1.5 relative"
                >
                  {showChatBadge ? (
                    <MessageSquareText className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span>{item.label}</span>
                  {/* Subtle dot when inside a specific chat */}
                  {showChatBadge && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-white dark:border-gray-950" />
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <AuthComponent />
            </div>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <AuthComponent />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-2">
            <div className="flex flex-col gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const showChatBadge = item.id === "chats" && isInChat;

                return (
                  <Button
                    key={item.id}
                    variant={active ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.path)}
                    className="justify-start gap-2"
                  >
                    {showChatBadge ? (
                      <MessageSquareText className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                    <span>{item.label}</span>
                    {showChatBadge && (
                      <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        В чате
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
