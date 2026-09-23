import * as React from "react";
import { cn } from "cn";

export default function Spinner({ size = 18, className = "" }) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-current border-t-transparent",
        className
      )}
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 9) }}
      aria-hidden="true"
    />
  );
}