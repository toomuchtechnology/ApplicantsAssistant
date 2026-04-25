import { GoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

/**
 * Диалог входа через Google.
 * Не знает про токены или стейт — только вызывает колбэки.
 */
export const LoginDialog = ({ open, onOpenChange, onSuccess, onError }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Вход в систему</DialogTitle>
        <DialogDescription>Войдите через ваш Google аккаунт</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
        <p className="text-sm text-muted-foreground text-center">
          Ваши данные будут сохранены в нашей базе данных
        </p>
      </div>
    </DialogContent>
  </Dialog>
);
