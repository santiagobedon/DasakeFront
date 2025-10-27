// src/components/InputField.tsx
import React from "react";
import "./InputField.scss";
import clsx from "clsx";

/**
 * InputField component
 *
 * A reusable input component that supports labels, validation messages, and accessibility attributes.
 * 
 * Props:
 * - id: unique identifier for the input field (required)
 * - label: optional text label displayed above the input
 * - type: input type (default: "text")
 * - value: current value of the input
 * - onChange: event handler for input value changes
 * - placeholder: optional placeholder text
 * - error: optional error message shown below the input
 * - inputMode: specifies the type of virtual keyboard to display on mobile devices
 *
 * Features:
 * - Adds "has-error" class when `error` is present
 * - Uses aria attributes (`aria-invalid`, `aria-describedby`) for accessibility
 *
 * Example:
 * <InputField
 *   id="email"
 *   label="Email Address"
 *   type="email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="Enter your email"
 *   error={emailError}
 * />
 */
export default function InputField({
  id,
  label,
  type = "text",
  value = "",
  onChange,
  placeholder,
  error,
  inputMode,
}: {
  id: string;
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
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
