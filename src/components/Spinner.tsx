// src/components/Spinner.tsx
import "./Spinner.scss";

/**
 * Spinner component
 *
 * A small loading indicator with configurable size.
 *
 * Props:
 * - size: optional number representing width and height in pixels (default: 18)
 *
 * Features:
 * - Uses "cm-spinner" class for styling and animation
 * - Accessibility: `aria-hidden` set to true
 *
 * Example:
 * <Spinner size={24} />
 */
export default function Spinner({ size = 18 }: { size?: number }) {
  return <div className="cm-spinner" style={{ width: size, height: size }} aria-hidden />;
}
