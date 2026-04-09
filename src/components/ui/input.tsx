"use client";

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, className, id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div
          className={cn(
            "input-wrapper",
            focused && "input-wrapper-focused",
            error && "input-wrapper-error",
            props.disabled && "input-wrapper-disabled"
          )}
        >
          {icon && <span className="input-icon">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn("input-field", className)}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {suffix && <span className="input-suffix">{suffix}</span>}
        </div>
        {error && (
          <p className="input-error" role="alert">
            {error}
          </p>
        )}
        {!error && hint && <p className="input-hint">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input, type InputProps };
