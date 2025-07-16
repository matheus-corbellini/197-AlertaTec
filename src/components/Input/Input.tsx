"use client";

import { useState } from "react";
import type React from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
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
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
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
  icon,
  showPasswordToggle = false,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`input-container ${className}`}>
      {icon && <span className="input-icon">{icon}</span>}

      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`input ${icon ? "with-icon" : ""} ${
          showPasswordToggle ? "with-toggle" : ""
        }`}
      />

      {showPasswordToggle && (
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
        >
          {showPassword ? <HiEye /> : <HiEyeOff />}
        </button>
      )}
    </div>
  );
}
