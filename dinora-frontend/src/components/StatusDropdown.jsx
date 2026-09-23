import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconCheck } from "./ui/Icons";
import { Button } from "./ui/button";

const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_DOT_COLORS = {
  pending: "bg-amber-500",
  preparing: "bg-blue-500",
  ready: "bg-emerald-500",
  served: "bg-purple-500",
  completed: "bg-emerald-500",
  cancelled: "bg-destructive",
};

/**
 * Replaces the native <select> for manually moving an order through its
 * kitchen states. There is no automatic timer behind this any more (see
 * services/order_automation.py) — every change here is a deliberate staff
 * action, so the control itself should feel deliberate too: a real menu
 * with the current choice checked, not a bare OS dropdown.
 */
export default function StatusDropdown({ value, options, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(null);

  function updateMenuPosition() {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = Math.min(options.length * 42 + 16, 280);
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < menuHeight && rect.top > menuHeight ? rect.top - menuHeight - 6 : rect.bottom + 6;
    const left = Math.min(rect.left, window.innerWidth - 196);
    setMenuPosition({ top, left, minWidth: Math.max(rect.width, 180) });
  }

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (rootRef.current && !rootRef.current.contains(e.target) && !menuRef.current?.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return undefined;
    }
    updateMenuPosition();
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, options.length]);

  const currentLabel = STATUS_LABELS[value] || value || "Set status";
  const currentDotColor = STATUS_DOT_COLORS[value] || "bg-muted-foreground";

  return (
    <div className="relative inline-block text-left" ref={rootRef}>
      <Button
        type="button"
        variant="outline"
        className="h-9 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 justify-between border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        disabled={disabled}
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 ${currentDotColor}`} aria-hidden="true" />
          <span>{currentLabel}</span>
        </span>
        <svg
          className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 11 7"
          fill="none"
        >
          <path d="M1 1.2 5.5 5.7 10 1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>

      {open && menuPosition && createPortal(
        <div
          className="fixed z-50 flex flex-col gap-0.5 border border-border bg-popover text-popover-foreground p-1 shadow-md"
          role="listbox"
          ref={menuRef}
          style={{ top: menuPosition.top, left: menuPosition.left, minWidth: menuPosition.minWidth }}
        >
          {options.map((opt) => {
            const isSelected = opt === value;
            const dotColor = STATUS_DOT_COLORS[opt] || "bg-muted-foreground";
            return (
              <Button
                key={opt}
                type="button"
                variant="ghost"
                role="option"
                aria-selected={isSelected}
                className={`h-8 w-full justify-start gap-2 px-2.5 text-xs font-medium transition-colors ${
                  isSelected ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-accent/80 hover:text-accent-foreground"
                }`}
                onClick={() => {
                  setOpen(false);
                  if (opt !== value) onChange(opt);
                }}
              >
                <span className={`h-2 w-2 shrink-0 ${dotColor}`} aria-hidden="true" />
                <span className="flex-1 text-left">{STATUS_LABELS[opt] || opt}</span>
                {isSelected && (
                  <span className="ml-auto text-primary">
                    <IconCheck />
                  </span>
                )}
              </Button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}