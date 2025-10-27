// src/components/ButtonPrimary.tsx
import React from "react";
import "./ButtonPrimary.scss";
import clsx from "clsx";

/**
 * ButtonPrimary component
 * 
 * A reusable primary button component with custom styling.
 * It merges the default class "cm-btn" with any additional classes passed via props.
 * 
 * Props:
 * - inherits all standard HTML button attributes (type, onClick, disabled, etc.)
 * - className (optional): adds extra classes for styling or layout customization
 * 
 * Example:
 * <ButtonPrimary onClick={handleClick} className="extra-style">Click me</ButtonPrimary>
 */
export default function ButtonPrimary(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx("cm-btn", props.className)} />;
}
