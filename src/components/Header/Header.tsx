"use client";

import Button from "../Button/Button";
import "./Header.css";
import { useNavigate } from "../../hooks/useNavigate";
import type { User } from "../../types/User";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { useState } from "react";

interface HeaderProps {
  showAuthButtons?: boolean;
  user?: User;
  onLogout?: () => void;
}

export default function Header({
  showAuthButtons = true,
  user,
  onLogout,
}: HeaderProps) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate("landing")}>
          <span className="logo-icon">🚀</span>
          <span className="logo-text-header">AlertaTec</span>
        </div>

        <div className="nav">
          {user ? (
            <div className="user-menu">
              <span className="user-name"> Ola, {user.name}</span>
              <Button
                variant="secondary"
                onClick={() => setShowLogoutModal(true)}
              >
                Sair
              </Button>
            </div>
          ) : (
            showAuthButtons && (
              <div className="auth-buttons">
                <Button variant="secondary" onClick={() => navigate("login")}>
                  Login
                </Button>
                <Button variant="primary" onClick={() => navigate("register")}>
                  Cadastrar
                </Button>
              </div>
            )
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          onLogout && onLogout();
        }}
        title="Sair do sistema"
        message="Tem certeza que deseja sair da sua conta?"
        confirmText="Sim, sair"
        cancelText="Cancelar"
        variant="warning"
      />
    </header>
  );
}
