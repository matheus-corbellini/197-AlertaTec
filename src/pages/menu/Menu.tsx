"use client";

import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import ContractList from "./components/ContractList";
import ContractForm from "./components/ContractForm";
import Sidebar from "./components/Sidebar";
import type { Contract, ContractFormData } from "../../types/Contract";
import "./Menu.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "../../hooks/useNavigate";
import Clients from "./components/Clients";
import { contractService } from "../../services/contractService";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);

  const loadContracts = async () => {
    try {
      setLoading(true);
      const contractsData = await contractService.getContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error("Erro ao carregar contratos:", error);
      alert("Erro ao carregar contratos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const addContract = async (newContract: ContractFormData) => {
    try {
      setLoading(true);
      const contractValue = Number.parseFloat(newContract.value);
      const contractData: Omit<Contract, "id"> = {
        ...newContract,
        value: contractValue,
        status: "Pendente",
        date: new Date().toISOString().split("T")[0],
        commission: contractValue * 0.1,
      };
      await contractService.createContract(contractData);
      await loadContracts();
      alert("Contrato criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar contrato:", error);
      alert("Erro ao criar contrato!");
    } finally {
      setLoading(false);
    }
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
        <div className="content">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <div className="spinner" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </main>
    </div>
  );
}
