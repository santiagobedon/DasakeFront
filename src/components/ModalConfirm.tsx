// src/components/ModalConfirm.tsx
import React from "react";
import "./ModalConfirm.scss";

/**
 * ModalConfirm component
 *
 * A reusable modal dialog for confirmation actions.
 *
 * Props:
 * - open: boolean flag to show or hide the modal
 * - title: optional modal title displayed at the top
 * - children: optional content displayed in the modal body
 * - onClose: callback invoked when the cancel button is clicked
 * - onConfirm: callback invoked when the confirm button is clicked
 * - confirmLabel: optional label for the confirm button (default: "Confirmar")
 *
 * Features:
 * - Renders only when `open` is true
 * - Accessible with `role="dialog"` and `aria-modal="true"`
 * - Includes cancel and confirm buttons
 *
 * Example:
 * <ModalConfirm
 *   open={isOpen}
 *   title="Delete item?"
 *   onClose={handleClose}
 *   onConfirm={handleConfirm}
 *   confirmLabel="Delete"
 * >
 *   Are you sure you want to delete this item?
 * </ModalConfirm>
 */
export default function ModalConfirm({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
}: {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="cm-modal-overlay" role="dialog" aria-modal="true">
      <div className="cm-modal">
        {title && <h3>{title}</h3>}
        <div className="cm-modal-body">{children}</div>
        <div className="cm-modal-actions">
          <button className="cm-btn cm-btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="cm-btn" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
