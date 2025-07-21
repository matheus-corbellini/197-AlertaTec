import { useState, useEffect } from "react";
import Button from "../Button/Button";
import "./Toast.css";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type,
  onClose,
  duration,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  duration = duration ?? 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;
  return (
    <div className={`toast ${type}`}>
      <div className="toast-header">
        <strong className="mr-auto">
          {type === "success" ? "Sucesso" : "Erro"}
        </strong>
        <Button type="button" className="ml-2 mb-1 close" onClick={onClose}>
          <span aria-hidden="true">&times;</span>
        </Button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
}
