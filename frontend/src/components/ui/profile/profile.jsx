import { useState, useEffect, useCallback } from "react";
import { Button } from "../button";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";
import { Alert, AlertDescription } from "../alert";
import {
  User,
  Mail,
  Calendar,
  Globe,
  AlertCircle,
  Loader2,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:8081";

const userAPI = {
  async getCurrentUser() {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      throw new Error("Authentication required. Please login.");
    }

    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user data");
    }

    return response.json();
  },
};

const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "U";
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

const formatDate = (dateString, locale = "ru") => {
  try {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", {
      locale: locale === "ru" ? ru : undefined,
    });
  } catch {
    return dateString;
  }
};

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
    <div className="flex-shrink-0 mt-0.5">
      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-base font-medium text-gray-900 dark:text-gray-100 break-all">
        {value || "—"}
      </p>
    </div>
  </div>
);

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    locale: "ru",
  });
  const [error, setError] = useState(null);

  const loadUserData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userAPI.getCurrentUser();
      setUser(data);
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        fullName: data.fullName || "",
        locale: data.locale || "ru",
      });
    } catch (err) {
      setError(err.message);
      console.error("Error loading user:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-sm text-gray-500">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" className="mt-2" onClick={loadUserData}>
              Попробовать снова
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = getInitials(formData.firstName, formData.lastName);
  const avatarUrl = user.pictureUrl;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Профиль пользователя
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Управление личной информацией
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  {avatarUrl && (
                    <AvatarImage
                      src={avatarUrl}
                      alt={user.fullName || "User avatar"}
                    />
                  )}
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.fullName ||
                    `${user.firstName} ${user.lastName}` ||
                    "Пользователь"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  ID: {user.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Личная информация</CardTitle>
                <CardDescription>
                  {"Основные данные пользователя"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {
                <div className="space-y-2">
                  <InfoCard label="Email" value={user.email} icon={Mail} />
                  <InfoCard
                    label="Имя"
                    value={user.firstName || "Не указано"}
                    icon={User}
                  />
                  <InfoCard
                    label="Фамилия"
                    value={user.lastName || "Не указано"}
                    icon={User}
                  />
                  <InfoCard
                    label="Полное имя"
                    value={user.fullName || "Не указано"}
                    icon={User}
                  />
                  <InfoCard
                    label="Язык"
                    value={
                      user.locale === "ru"
                        ? "Русский"
                        : user.locale === "en"
                          ? "English"
                          : user.locale
                    }
                    icon={Globe}
                  />
                  <InfoCard
                    label="Дата регистрации"
                    value={user.createdAt}
                    icon={Calendar}
                  />
                </div>
              }
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
