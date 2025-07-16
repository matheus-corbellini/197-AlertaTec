import { useState } from "react";
import { HiMail, HiLockClosed } from "react-icons/hi";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import { useNavigate } from "../../hooks/useNavigate";
import { useAuthContext } from "../../contexts/AuthContext";
import "./Auth.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await login({
        email: formData.email,
        password: formData.password,
      });

      setTimeout(() => {
        navigate("dashboard");
        setIsSubmitting(false);
      }, 1000);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Header showAuthButtons={false} />

      <button
        className="back-button"
        onClick={() => navigate("landing")}
        title="Voltar para página inicial"
      />

      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <h1>Fazer Login</h1>
            <p>Acesse sua conta</p>
            {error && <div className="auth-error">{error}</div>}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={handleChange}
              required
              icon={<HiMail />}
            />

            <Input
              name="password"
              placeholder="Sua senha"
              value={formData.password}
              onChange={handleChange}
              required
              icon={<HiLockClosed />}
              showPasswordToggle={true}
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Não tem uma conta?{" "}
              <button
                className="link-button"
                type="button"
                onClick={() => navigate("register")}
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
