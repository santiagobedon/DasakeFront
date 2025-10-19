// src/components/Spinner.tsx
import "./Spinner.scss";

export default function Spinner({ size = 18 }: { size?: number }) {
  return <div className="cm-spinner" style={{ width: size, height: size }} aria-hidden />;
}
