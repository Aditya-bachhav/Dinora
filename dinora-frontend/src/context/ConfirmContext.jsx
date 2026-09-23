import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "cn";
import { Button } from "../components/ui/button";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null); // { message, title, danger, resolve }

  const confirm = useCallback((message, opts = {}) => {
    return new Promise((resolve) => {
      setState({ message, title: opts.title || "Are you sure?", danger: !!opts.danger, resolve });
    });
  }, []);

  function handle(result) {
    state?.resolve(result);
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity" 
          onClick={() => handle(false)}
        >
          <div 
            className="w-full max-w-md bg-card border border-border shadow-2xl rounded-none p-6 flex flex-col gap-4 animate-in fade-in-0 zoom-in-95 duration-200 text-card-foreground"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-extrabold tracking-tight">{state.title}</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed">{state.message}</p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
              <Button 
                variant="outline" 
                className="rounded-none border-border font-bold" 
                onClick={() => handle(false)}
              >
                Cancel
              </Button>
              <Button
                variant={state.danger ? "destructive" : "default"}
                className={cn(
                  "rounded-none font-bold",
                  !state.danger && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => handle(true)}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx;
}