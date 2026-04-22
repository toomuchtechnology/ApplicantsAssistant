// src/components/ui/header.jsx
import React, { useState } from "react";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";
import { AuthComponent } from "./auth-component";
import {
  GraduationCap,
  Info,
  MessageSquare,
  Menu,
  X,
  User,
  MessagesSquare,
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

  const isActive = (path) => {
    if (path === "/chats") {
      return (
        location.pathname === "/chats" ||
        location.pathname.startsWith("/rag-chat/")
      );
    }
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
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">
              Ассистент абитуриента
            </h1>
            <h1 className="text-xl font-bold text-foreground sm:hidden">
              Ассистент
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <ThemeToggle />
              <AuthComponent />
            </div>

            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <AuthComponent />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-2">
            <div className="flex flex-col space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.path)}
                    className="justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
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
