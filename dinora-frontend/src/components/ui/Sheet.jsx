import { useEffect } from "react";
import { Button } from "./button";

export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end sm:justify-center items-end sm:items-center transition-opacity" 
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-lg max-h-[90vh] bg-background border border-border flex flex-col shadow-2xl rounded-t-2xl sm:rounded-none overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true"
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto my-3 sm:hidden" />
        
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
            <Button variant="ghost" size="icon" className="rounded-none h-8 w-8 hover:bg-muted" onClick={onClose} aria-label="Close">
              ✕
            </Button>
          </div>
        )}
        
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}