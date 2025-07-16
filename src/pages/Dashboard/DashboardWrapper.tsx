import Dashboard from "./dashboard";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "../../hooks/useNavigate";

export default function DashboardWrapper() {
  const { user, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  const isActuallyLoading = loading && !user;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("landing");
    } catch {
      navigate("landing");
    }
  };

  if (isActuallyLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8fafc",
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8fafc",
          gap: "1rem",
        }}
      >
        <div>Você precisa estar logado para acessar o dashboard</div>
        <button
          onClick={() => navigate("login")}
          style={{
            padding: "0.5rem 1rem",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
