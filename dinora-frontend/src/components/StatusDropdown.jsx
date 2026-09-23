import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IconCheck } from "./ui/Icons";

const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  completed: "Completed",
  cancelled: "Cancelled",
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

  return (
    <div className={`status-dropdown ${open ? "open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="status-dropdown-trigger"
        disabled={disabled}
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`status-dropdown-dot status-dot-${value}`} aria-hidden="true" />
        {currentLabel}
        <svg className="status-dropdown-chevron" width="11" height="7" viewBox="0 0 11 7" fill="none">
          <path d="M1 1.2 5.5 5.7 10 1.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && menuPosition && createPortal(
        <div
          className="status-dropdown-menu"
          role="listbox"
          ref={menuRef}
          style={{ top: menuPosition.top, left: menuPosition.left, minWidth: menuPosition.minWidth }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={opt === value}
              className={`status-dropdown-option ${opt === value ? "selected" : ""}`}
              onClick={() => {
                setOpen(false);
                if (opt !== value) onChange(opt);
              }}
            >
              <span className={`status-dropdown-dot status-dot-${opt}`} aria-hidden="true" />
              {STATUS_LABELS[opt] || opt}
              {opt === value && (
                <span className="status-dropdown-check icon"><IconCheck /></span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
