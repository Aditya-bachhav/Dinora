import { createContext, useCallback, useContext, useState } from "react";

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
        <div className="sheet-backdrop" onClick={() => handle(false)}>
          <div className="confirm-sheet" onClick={(e) => e.stopPropagation()}>
            <h3>{state.title}</h3>
            <p>{state.message}</p>
            <div className="confirm-actions">
              <button className="btn btn-ghost" onClick={() => handle(false)}>
                Cancel
              </button>
              <button
                className={`btn ${state.danger ? "btn-danger" : "btn-primary"}`}
                onClick={() => handle(true)}
              >
                Confirm
              </button>
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
