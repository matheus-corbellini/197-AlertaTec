"use client";

import { useState, useEffect } from "react";
import {
  MdBarChart,
  MdPeople,
  MdDescription,
  MdAttachMoney,
  MdTrendingUp,
  MdElectricBolt,
  MdFilterList,
  MdFileDownload,
} from "react-icons/md";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import type { Contract } from "../../../types/Contract";
import type { Client } from "../../../types/Client";
import { contractService } from "../../../services/contractService";
import { clientService } from "../../../services/clientServices";
import "./Reports.css";

interface ReportsProps {
  contracts?: Contract[];
}

type ReportTab =
  | "clients"
  | "contracts"
  | "commissions"
  | "performance"
  | "consumption";

export default function Reports({ contracts: propsContracts }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>("clients");
  const [contracts, setContracts] = useState<Contract[]>(propsContracts || []);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(!propsContracts);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const reportTabs = [
    {
      id: "clients" as ReportTab,
      label: "Clientes",
      icon: <MdPeople />,
      description: "Relatório detalhado de clientes",
    },
    {
      id: "contracts" as ReportTab,
      label: "Contratos",
      icon: <MdDescription />,
      description: "Análise de contratos por status",
    },
    {
      id: "commissions" as ReportTab,
      label: "Comissões",
      icon: <MdAttachMoney />,
      description: "Relatório de comissões e ganhos",
    },
    {
      id: "performance" as ReportTab,
      label: "Performance",
      icon: <MdTrendingUp />,
      description: "Métricas de performance de vendas",
    },
    {
      id: "consumption" as ReportTab,
      label: "Consumo",
      icon: <MdElectricBolt />,
      description: "Análise de consumo energético",
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [contractsData, clientsData] = await Promise.all([
        propsContracts
          ? Promise.resolve(propsContracts)
          : contractService.getContracts(),
        clientService.getClients(),
      ]);

      setContracts(contractsData);
      setClients(clientsData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getFilteredContracts = () => {
    return contracts.filter((contract) => {
      const contractDate = new Date(contract.date);
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);

      return contractDate >= startDate && contractDate <= endDate;
    });
  };

  const renderClientsReport = () => {
    const filteredContracts = getFilteredContracts();
    const clientsWithData = clients.map((client) => {
      const clientContracts = filteredContracts.filter(
        (c) => c.clientId === client.id || c.clientEmail === client.email
      );

      return {
        ...client,
        contractsCount: clientContracts.length,
        totalValue: clientContracts.reduce((sum, c) => sum + c.value, 0),
        lastContract:
          clientContracts.length > 0
            ? clientContracts.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )[0]
            : null,
      };
    });

    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-cards">
            <Card className="summary-card">
              <div className="summary-header">
                <MdPeople className="summary-icon" />
                <h3>Total de Clientes</h3>
              </div>
              <div className="summary-value">{clients.length}</div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdTrendingUp className="summary-icon" />
                <h3>Clientes Ativos</h3>
              </div>
              <div className="summary-value">
                {clients.filter((c) => c.status === "Ativo").length}
              </div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdAttachMoney className="summary-icon" />
                <h3>Valor Total</h3>
              </div>
              <div className="summary-value">
                {formatCurrency(
                  clientsWithData.reduce((sum, c) => sum + c.totalValue, 0)
                )}
              </div>
            </Card>
          </div>
        </div>

        <Card className="report-table-card">
          <div className="table-header">
            <h3>Detalhes dos Clientes</h3>
            <Button variant="secondary" size="small">
              <MdFileDownload />
              Exportar
            </Button>
          </div>

          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Empresa</th>
                  <th>Status</th>
                  <th>Contratos</th>
                  <th>Valor Total</th>
                  <th>Último Contrato</th>
                </tr>
              </thead>
              <tbody>
                {clientsWithData.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.company || "-"}</td>
                    <td>
                      <span
                        className={`status-badge status-${client.status.toLowerCase()}`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td>{client.contractsCount}</td>
                    <td>{formatCurrency(client.totalValue)}</td>
                    <td>
                      {client.lastContract
                        ? formatDate(client.lastContract.date)
                        : "Nunca"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderContractsReport = () => {
    const filteredContracts = getFilteredContracts();
    const contractsByStatus = filteredContracts.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusCards = [
      {
        status: "Ativo",
        color: "success",
        count: contractsByStatus["Ativo"] || 0,
      },
      {
        status: "Pendente",
        color: "warning",
        count: contractsByStatus["Pendente"] || 0,
      },
      {
        status: "Concluido",
        color: "info",
        count: contractsByStatus["Concluido"] || 0,
      },
      {
        status: "Cancelado",
        color: "danger",
        count: contractsByStatus["Cancelado"] || 0,
      },
    ];

    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-cards">
            {statusCards.map((item) => (
              <Card
                key={item.status}
                className={`summary-card status-${item.color}`}
              >
                <div className="summary-header">
                  <MdDescription className="summary-icon" />
                  <h3>{item.status}</h3>
                </div>
                <div className="summary-value">{item.count}</div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="report-table-card">
          <div className="table-header">
            <h3>Lista de Contratos</h3>
            <Button variant="secondary" size="small">
              <MdFileDownload />
              Exportar
            </Button>
          </div>

          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Comissão</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td>{contract.clientName}</td>
                    <td>{contract.product}</td>
                    <td>{formatCurrency(contract.value)}</td>
                    <td>
                      <span
                        className={`status-badge status-${contract.status.toLowerCase()}`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td>{formatDate(contract.date)}</td>
                    <td>{formatCurrency(contract.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "clients":
        return renderClientsReport();
      case "contracts":
        return renderContractsReport();
      case "commissions":
        return (
          <div className="report-placeholder">
            Relatório de Comissões em desenvolvimento...
          </div>
        );
      case "performance":
        return (
          <div className="report-placeholder">
            Relatório de Performance em desenvolvimento...
          </div>
        );
      case "consumption":
        return (
          <div className="report-placeholder">
            Relatório de Consumo em desenvolvimento...
          </div>
        );
      default:
        return renderClientsReport();
    }
  };

  if (loading) {
    return (
      <div className="reports-container">
        <div className="reports-header">
          <div className="header-title">
            <MdBarChart className="header-icon" />
            <h1>Relatórios</h1>
          </div>
        </div>
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Carregando dados dos relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-title">
          <MdBarChart className="header-icon" />
          <h1>Relatórios</h1>
        </div>

        <div className="date-filters">
          <div className="filter-group">
            <label htmlFor="start-date">Data Inicial:</label>
            <input
              id="start-date"
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                setDateFilter((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="date-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="end-date">Data Final:</label>
            <input
              id="end-date"
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                setDateFilter((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="date-input"
            />
          </div>

          <Button variant="secondary" size="small">
            <MdFilterList />
            Aplicar Filtros
          </Button>
        </div>
      </div>

      <div className="reports-tabs">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <div className="tab-content">
              <span className="tab-label">{tab.label}</span>
              <span className="tab-description">{tab.description}</span>
            </div>
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
