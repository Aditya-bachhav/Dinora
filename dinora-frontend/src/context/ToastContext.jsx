import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "cn";

const ToastContext = createContext(null);
let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const show = useCallback(
    (message, { type = "info", duration = 3200 } = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const toast = {
    show,
    success: (msg, opts) => show(msg, { ...opts, type: "success" }),
    error: (msg, opts) => show(msg, { ...opts, type: "error" }),
    info: (msg, opts) => show(msg, { ...opts, type: "info" }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div 
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0" 
        role="status" 
        aria-live="polite"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-center justify-between gap-3 p-4 border shadow-xl rounded-none transition-all duration-300 cursor-pointer font-medium text-xs sm:text-sm bg-card text-card-foreground animate-in slide-in-from-bottom-2",
                isSuccess && "border-l-4 border-l-primary border-border bg-card",
                isError && "border-l-4 border-l-destructive border-border bg-card",
                !isSuccess && !isError && "border-l-4 border-l-muted-foreground border-border bg-card"
              )}
              onClick={() => dismiss(t.id)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={cn(
                  "flex items-center justify-center w-5 h-5 shrink-0 font-extrabold text-xs",
                  isSuccess && "text-primary",
                  isError && "text-destructive",
                  !isSuccess && !isError && "text-muted-foreground"
                )}>
                  {isSuccess ? "✓" : isError ? "!" : "i"}
                </span>
                <span className="flex-1 leading-snug font-bold truncate sm:whitespace-normal">{t.message}</span>
              </div>
              <span className="text-muted-foreground hover:text-foreground text-xs font-bold shrink-0 ml-2">
                ✕
              </span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}