import { useState } from "react";
import { Button } from "../ui/button";
import { UserMenu } from "./UserMenu";
import { LoginDialog } from "./LoginDialog";
import { useAuthState } from "./useAuthState";

export const AuthComponent = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const { user, isLoading, isCheckingAuth, handleGoogleLogin, handleLogout } =
    useAuthState();

  if (isCheckingAuth) {
    return (
      <Button variant="ghost" disabled>
        Загрузка...
      </Button>
    );
  }

  if (user) {
    return <UserMenu user={user} onLogout={handleLogout} />;
  }

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      alert("Ошибка: Google не вернул токен");
      return;
    }
    try {
      await handleGoogleLogin(idToken);
      setIsLoginDialogOpen(false);
      window.location.reload();
    } catch (err) {
      alert(`Ошибка при входе: ${err.message}`);
    }
  };

  const handleError = () => {
    alert("Ошибка при входе через Google. Проверьте консоль для деталей.");
  };

  return (
    <>
      <Button onClick={() => setIsLoginDialogOpen(true)} disabled={isLoading}>
        {isLoading ? "Загрузка..." : "Войти"}
      </Button>
      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </>
  );
};
