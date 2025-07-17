"use client";

import { useState } from "react";
import Dashboard from "./components/Dashboard";
import ContractList from "./components/ContractList";
import ContractForm from "./components/ContractForm";
import Sidebar from "./components/Sidebar";
import type { Contract, ContractFormData } from "../../types/Contract";
import "./Menu.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "../../hooks/useNavigate";
import Clients from "./components/Clients";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      clientName: "João Silva",
      clientEmail: "joao@email.com",
      clientPhone: "(11) 99999-9999",
      product: "Software ERP",
      value: 15000,
      description: "Implementação de sistema ERP completo",
      paymentTerms: "30 dias",
      duration: "12",
      status: "Ativo",
      date: "2024-01-15",
      commission: 1500,
    },
    {
      id: 2,
      clientName: "Maria Santos",
      clientEmail: "maria@email.com",
      clientPhone: "(11) 88888-8888",
      product: "Sistema CRM",
      value: 8500,
      description: "Sistema de gestão de relacionamento com cliente",
      paymentTerms: "à vista",
      duration: "6",
      status: "Pendente",
      date: "2024-01-20",
      commission: 850,
    },
    {
      id: 3,
      clientName: "Pedro Costa",
      clientEmail: "pedro@email.com",
      clientPhone: "(11) 77777-7777",
      product: "Consultoria TI",
      value: 12000,
      description: "Consultoria em infraestrutura de TI",
      paymentTerms: "60 dias",
      duration: "3",
      status: "Finalizado",
      date: "2024-01-10",
      commission: 1200,
    },
  ]);

  const addContract = (newContract: ContractFormData) => {
    const contractValue = Number.parseFloat(newContract.value);
    const contract: Contract = {
      ...newContract,
      id: contracts.length + 1,
      value: contractValue,
      status: "Pendente",
      date: new Date().toISOString().split("T")[0],
      commission: contractValue * 0.1,
    };
    setContracts([...contracts, contract]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard contracts={contracts} />;
      case "contracts":
        return <ContractList contracts={contracts} />;
      case "new-contract":
        return <ContractForm onSubmit={addContract} />;
      case "clients":
        return <Clients />;
      default:
        return <Dashboard contracts={contracts} />;
    }
  };

  const navigate = useNavigate();

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <header className="header">
          <h1>Sistema de Vendas</h1>
          <Button
            variant="danger"
            className="logout-button"
            size="medium"
            onClick={() => navigate("/")}
          >
            Sair
          </Button>
          <div className="user-info">
            <span className="user-welcome">Bem-vindo, Vendedor</span>
            <div className="avatar">V</div>
          </div>
        </header>
        <div className="content">{renderContent()}</div>
      </main>
    </div>
  );
}
