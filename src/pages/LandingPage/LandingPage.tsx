"use client";

import { MdDashboard, MdDescription, MdPeople, MdBarChart } from "react-icons/md";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import { Footer } from "borderless";
import "./LandingPage.css";
import { useNavigate } from "../../hooks/useNavigate";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <Header showAuthButtons={true} />
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Automatize seus Contratos de Vendas</h1>
          <p className="hero-subtitle">
            Plataforma completa para vendedores gerenciarem contratos, clientes
            e vendas de forma automatizada e eficiente.
          </p>
          <div className="hero-buttons">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate("register")}
            >
              Comecar Agora
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => navigate("login")}
            >
              Fazer Login
            </Button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="Dashboard Preview"
            className="dashboard-preview"
          />
        </div>
      </main>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Principais Funcionalidades</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><MdDashboard /></div>
              <h3 className="feature=icon">Dashboard Completo</h3>
              <p>
                Visualize todas as suas vendas, contratos e metricas em um único
                lugar.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdDescription /></div>
              <h3>Contratos Automatizados</h3>
              <p>
                Gere contratos automaticamente com base nos dados dos clientes
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdPeople /></div>
              <h3>Gestão de Clientes</h3>
              <p>Mantenha todos os dados dos seus clientes organizados</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdBarChart /></div>
              <h3>Relatórios e Analytics</h3>
              <p>Acompanhe seu desempenho com relatórios completos</p>
            </div>
          </div>
        </div>
      </section>

      <Footer
        theme="light"
        useGradient={true}
        gradientColors={["#667eea", "#764ba2"]}
        gradientDirection="to right"
        logoVariant="dark"
      />
    </div>
  );
}
