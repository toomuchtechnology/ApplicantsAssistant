// src/components/ui/NotFound.jsx
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center mt-10">
      <div className="w-full max-w-md p-6">
        {/* Card */}
        <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 text-center p-6">
          {/* Icon badge */}
          <div className="flex justify-center mb-5">
            <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/50 inline-flex">
              <SearchX className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>

          {/* Status code */}
          <div className="mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-medium">
              404
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Страница не найдена
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Запрошенная страница не существует или была перемещена.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Назад
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/chats")}
              className="gap-2"
            >
              <Home className="h-3.5 w-3.5" />
              На главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
