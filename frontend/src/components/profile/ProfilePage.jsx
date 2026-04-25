import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { ProfileCard } from "./ProfileCard";
import { useUser } from "./useUser";

export const ProfilePage = () => {
  const { user, isLoading, error, reload } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-3">
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={reload}>
                Попробовать снова
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-10 max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Профиль
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Личная информация аккаунта
          </p>
        </div>

        {/* Ошибка при фоновом рефетче (user уже есть, но reload упал) */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ProfileCard user={user} />
      </div>
    </div>
  );
};
