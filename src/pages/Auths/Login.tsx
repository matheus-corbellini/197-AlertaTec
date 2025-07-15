import { useState } from "react";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import { useNavigate } from "../../hooks/useNavigate";
import "./Auth.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page">
      <Header showAuthButtons={false} />

      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <h1>Fazer Login</h1>
            <p>Acesse sua conta de vendedor</p>
          </div>

          <form className="auth-form">
            <Input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="password"
              placeholder="Sua senha"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="primary" size="large" fullWidth>
              Entrar
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
