// src/components/ModalConfirm.tsx
import React from "react";
import "./ModalConfirm.scss";

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
