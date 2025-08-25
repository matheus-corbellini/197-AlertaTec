import { useState } from "react";
import { HiUser, HiMail, HiPhone, HiLockClosed } from "react-icons/hi";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import { useNavigate } from "../../hooks/useNavigate";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/useToast";
import "./Auth.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, error, clearError } = useAuthContext();
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validar se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      showToast("As senhas não coincidem!", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      console.log("Registration completed, navigating to dashboard...");
      setTimeout(() => {
        navigate("dashboard");
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error("Erro no registro:", error);
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
            <h1>Criar Conta</h1>
            <p>Cadastre-se na plataforma</p>
            {error && <div className="auth-error">{error}</div>}
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              required
              icon={<HiUser />}
            />

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
              type="tel"
              name="phone"
              placeholder="Seu telefone"
              value={formData.phone}
              onChange={handleChange}
              required
              icon={<HiPhone />}
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

            <Input
              name="confirmPassword"
              placeholder="Confirme sua senha"
              value={formData.confirmPassword}
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
              {isSubmitting ? "Criando conta..." : "Criar Conta"}
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
