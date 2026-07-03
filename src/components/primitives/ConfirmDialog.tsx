import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

/** Minimal, accessible confirmation modal. Sharp-cornered per project rules. */
export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/70 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md bg-card border border-border p-6 shadow-xl"
      >
        <h2 id="confirm-title" className="font-heading text-lg font-bold text-foreground">
          {title}
        </h2>
        {description && (
          <div className="mt-2 font-body text-sm text-muted-foreground">{description}</div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 font-subheading text-sm text-foreground hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={
              tone === "danger"
                ? "rounded-lg bg-destructive text-destructive-foreground px-4 py-2 font-subheading text-sm font-semibold hover:opacity-90 transition-opacity"
                : "btn-cherry rounded-lg px-4 py-2 font-subheading text-sm font-semibold"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
