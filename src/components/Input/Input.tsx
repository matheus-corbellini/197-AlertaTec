"use client";

import type React from "react";
import "./Input.css";

interface InputProps {
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
}: InputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`input ${className}`}
    />
  );
}
