import { useState } from "react";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import { useNavigate } from "../../hooks/useNavigate";
import "./Auth.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-page">
      <Header showAuthButtons={false} />

      <div className="auth-container">
        <Card className="auth-card">
          <div className="auth-header">
            <h1>Criar Conta</h1>
            <p>Cadastre-se como vendedor</p>
          </div>

          <form className="auth-form">
            <Input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              type="email"
              name="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="tel"
              name="phone"
              placeholder="Seu telefone"
              value={formData.phone}
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

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="primary" size="large" fullWidth>
              Criar Conta
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Já tem uma conta?{" "}
              <button
                className="link-button"
                type="button"
                onClick={() => navigate("login")}
              >
                Fazer login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
