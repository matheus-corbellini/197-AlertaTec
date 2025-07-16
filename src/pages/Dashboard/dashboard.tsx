"use client";

import { useState } from "react";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import "./Dashboard.css";

import type { User } from "../../types/User";

interface DashboardProps {
  user: User | undefined;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Vendas do Mês", value: "R$ 45.230", change: "+12%" },
    { title: "Contratos Ativos", value: "23", change: "+5%" },
    { title: "Clientes", value: "156", change: "+8%" },
    { title: "Taxa de Conversão", value: "68%", change: "+3%" },
  ];

  const recentContracts = [
    {
      id: 1,
      client: "Maria Silva",
      value: "R$ 2.500",
      status: "Ativo",
      date: "15/01/2024",
    },
    {
      id: 2,
      client: "João Santos",
      value: "R$ 1.800",
      status: "Pendente",
      date: "14/01/2024",
    },
    {
      id: 3,
      client: "Ana Costa",
      value: "R$ 3.200",
      status: "Ativo",
      date: "13/01/2024",
    },
    {
      id: 4,
      client: "Pedro Lima",
      value: "R$ 1.500",
      status: "Finalizado",
      date: "12/01/2024",
    },
  ];

  return (
    <div className="dashboard">
      <Header showAuthButtons={false} user={user} onLogout={onLogout} />

      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Visão Geral
            </button>
            <button
              className={`nav-item ${
                activeTab === "contracts" ? "active" : ""
              }`}
              onClick={() => setActiveTab("contracts")}
            >
              📝 Contratos
            </button>
            <button
              className={`nav-item ${activeTab === "clients" ? "active" : ""}`}
              onClick={() => setActiveTab("clients")}
            >
              👥 Clientes
            </button>
            <button
              className={`nav-item ${activeTab === "reports" ? "active" : ""}`}
              onClick={() => setActiveTab("reports")}
            >
              📈 Relatórios
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {activeTab === "overview" && (
            <div className="overview">
              <div className="page-header">
                <h1>Visão Geral</h1>
                <p>Bem-vindo de volta, {user?.name}!</p>
              </div>

              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <Card key={index} className="stat-card">
                    <h3>{stat.title}</h3>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-change positive">{stat.change}</div>
                  </Card>
                ))}
              </div>

              <div className="dashboard-grid">
                <Card className="contracts-card">
                  <div className="card-header">
                    <h2>Contratos Recentes</h2>
                    <Button variant="secondary" size="small">
                      Ver Todos
                    </Button>
                  </div>
                  <div className="contracts-list">
                    {recentContracts.map((contract) => (
                      <div key={contract.id} className="contract-item">
                        <div className="contract-info">
                          <strong>{contract.client}</strong>
                          <span className="contract-date">{contract.date}</span>
                        </div>
                        <div className="contract-details">
                          <span className="contract-value">
                            {contract.value}
                          </span>
                          <span
                            className={`contract-status ${contract.status.toLowerCase()}`}
                          >
                            {contract.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="actions-card">
                  <h2>Ações Rápidas</h2>
                  <div className="quick-actions">
                    <Button variant="primary" fullWidth>
                      Novo Contrato
                    </Button>
                    <Button variant="secondary" fullWidth>
                      Adicionar Cliente
                    </Button>
                    <Button variant="secondary" fullWidth>
                      Gerar Relatório
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "contracts" && (
            <div className="contracts">
              <div className="page-header">
                <h1>Contratos</h1>
                <Button variant="primary">Novo Contrato</Button>
              </div>
              <Card>
                <p>Sistema de contratos em desenvolvimento...</p>
              </Card>
            </div>
          )}

          {activeTab === "clients" && (
            <div className="clients">
              <div className="page-header">
                <h1>Clientes</h1>
                <Button variant="primary">Novo Cliente</Button>
              </div>
              <Card>
                <p>Sistema de clientes em desenvolvimento...</p>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="reports">
              <div className="page-header">
                <h1>Relatórios</h1>
                <Button variant="primary">Gerar Relatório</Button>
              </div>
              <Card>
                <p>Sistema de relatórios em desenvolvimento...</p>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
