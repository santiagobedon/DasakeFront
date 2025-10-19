// src/components/InputField.tsx
import React from "react";
import "./InputField.scss";
import clsx from "clsx";

type Props = {
  id: string;
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export default function InputField({ id, label, type = "text", value = "", onChange, placeholder, error, inputMode }: Props) {
  return (
    <div className={clsx("field-row", { "has-error": !!error })}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      {error && (
        <div id={`${id}-err`} className="field-error" role="status" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
}
