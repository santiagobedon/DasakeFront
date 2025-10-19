// src/components/ButtonPrimary.tsx
import React from "react";
import "./ButtonPrimary.scss";
import clsx from "clsx";

export default function ButtonPrimary(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={clsx("cm-btn", props.className)} />;
}
