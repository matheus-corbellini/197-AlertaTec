"use client";

import { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "../../hooks/useNavigate";
import Menu from "../menu/Menu";

export default function DashboardWrapper() {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Menu />;
}
