"use client";

import Button from "../Button/Button";
import "./Header.css";
import { useNavigate } from "../../hooks/useNavigate";
import type { User } from "../../types/User";

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
              <Button variant="secondary" onClick={onLogout}>
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
    </header>
  );
}
