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

    loadData();
  }, [propsContracts]);

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

  const renderCommissionsReport = () => {
    const calculateMonthlyComissions = (contracts: Contract[]) => {
      const monthlyData: {
        [key: string]: {
          month: string;
          year: number;
          total: number;
          contracts: number;
        };
      } = {};

      contracts.forEach((contract) => {
        const contractDate = new Date(contract.date);
        const monthKey = `${contractDate.getFullYear()}-${contractDate.getMonth()}`;
        const monthName = contractDate.toLocaleString("pt-BR", {
          month: "long",
        });
        const year = contractDate.getFullYear();
        const comission = contract.commission || 0;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            year: year,
            total: 0,
            contracts: 0,
          };
        }

        monthlyData[monthKey].total += comission;
        monthlyData[monthKey].contracts += 1;
      });

      return Object.values(monthlyData).sort((a, b) => {
        const aDate = new Date(a.year, getMonthNumber(a.month));
        const bDate = new Date(b.year, getMonthNumber(b.month));
        return aDate.getTime() - bDate.getTime();
      });
    };

    const getMonthNumber = (month: string): number => {
      const monthNames = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ];
      return monthNames.indexOf(month.toLowerCase());
    };
    const filteredContracts = getFilteredContracts();

    const monthlyComissions = calculateMonthlyComissions(filteredContracts);

    // Debug temporário - pode remover depois
    console.log("Dados do gráfico:", {
      filteredContracts: filteredContracts.length,
      monthlyComissions,
      maxValue:
        monthlyComissions.length > 0
          ? Math.max(...monthlyComissions.map((m) => m.total))
          : 0,
    });

    const totalCommissions = monthlyComissions.reduce(
      (sum, month) => sum + month.total,
      0
    );
    const averageMonthly =
      totalCommissions / Math.max(monthlyComissions.length, 1);
    const bestMonth = monthlyComissions.reduce(
      (best, current) => (current.total > best.total ? current : best),
      { month: "", year: 0, total: 0, contracts: 0 }
    );

    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-cards">
            <Card className="summary-card">
              <div className="summary-header">
                <MdAttachMoney className="summary-icon" />
                <h3>Total de Comissões</h3>
              </div>
              <div className="summary-value">
                {formatCurrency(totalCommissions)}
              </div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdTrendingUp className="summary-icon" />
                <h3>Média Mensal</h3>
              </div>
              <div className="summary-value">
                {formatCurrency(averageMonthly)}
              </div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdAttachMoney className="summary-icon" />
                <h3>Melhor Mês</h3>
              </div>
              <div className="summary-value">
                {bestMonth.total > 0
                  ? `${bestMonth.month} ${bestMonth.year}`
                  : "N/A"}
              </div>
            </Card>
          </div>
        </div>

        <Card className="report-table-card">
          <div className="table-header">
            <h3>Detalhes das Comissões</h3>
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
                  <th>Valor Contrato</th>
                  <th>Comissão</th>
                  <th>Data</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts
                  .filter((contract) => contract.commission > 0)
                  .map((contract) => (
                    <tr key={contract.id}>
                      <td>{contract.clientName}</td>
                      <td>{contract.product}</td>
                      <td>{formatCurrency(contract.value)}</td>
                      <td className="commission-cell">
                        <strong>{formatCurrency(contract.commission)}</strong>
                      </td>
                      <td>{formatDate(contract.date)}</td>
                      <td>
                        <span
                          className={`status-badge status-${contract.status.toLowerCase()}`}
                        >
                          {contract.status}
                        </span>
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

  const getMonthNumber = (month: string): number => {
    const monthNames = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    return monthNames.indexOf(month.toLowerCase());
  };

  const renderPerformanceReport = () => {
    const filteredContracts = getFilteredContracts();

    // Calcular métricas de performance
    const totalContracts = filteredContracts.length;
    const activeContracts = filteredContracts.filter(
      (c) => c.status === "Ativo"
    ).length;
    const completedContracts = filteredContracts.filter(
      (c) => c.status === "Concluido"
    ).length;

    // Taxa de conversão (contratos ativos + concluídos / total)
    const conversionRate =
      totalContracts > 0
        ? ((activeContracts + completedContracts) / totalContracts) * 100
        : 0;

    // Ticket médio
    const totalValue = filteredContracts.reduce((sum, c) => sum + c.value, 0);
    const averageTicket = totalContracts > 0 ? totalValue / totalContracts : 0;

    // Performance por mês
    const monthlyPerformance = filteredContracts.reduce((acc, contract) => {
      const contractDate = new Date(contract.date);
      const monthKey = `${contractDate.getFullYear()}-${contractDate.getMonth()}`;
      const monthName = contractDate.toLocaleString("pt-BR", { month: "long" });
      const year = contractDate.getFullYear();

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          year: year,
          contracts: 0,
          value: 0,
          commission: 0,
        };
      }

      acc[monthKey].contracts += 1;
      acc[monthKey].value += contract.value;
      acc[monthKey].commission += contract.commission || 0;

      return acc;
    }, {} as Record<string, { month: string; year: number; contracts: number; value: number; commission: number }>);

    const monthlyData = Object.values(monthlyPerformance).sort((a, b) => {
      const aDate = new Date(a.year, getMonthNumber(a.month));
      const bDate = new Date(b.year, getMonthNumber(b.month));
      return aDate.getTime() - bDate.getTime();
    });

    // Meta mensal (exemplo: R$ 50.000 por mês)
    const monthlyGoal = 50000;
    const currentMonth = monthlyData[monthlyData.length - 1];
    const goalAchievement = currentMonth
      ? (currentMonth.value / monthlyGoal) * 100
      : 0;

    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-cards">
            <Card className="summary-card">
              <div className="summary-header">
                <MdTrendingUp className="summary-icon" />
                <h3>Taxa de Conversão</h3>
              </div>
              <div className="summary-value">{conversionRate.toFixed(1)}%</div>
              <div className="summary-subtitle">
                {activeContracts + completedContracts} de {totalContracts}{" "}
                contratos
              </div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdAttachMoney className="summary-icon" />
                <h3>Ticket Médio</h3>
              </div>
              <div className="summary-value">
                {formatCurrency(averageTicket)}
              </div>
              <div className="summary-subtitle">Valor médio por contrato</div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdBarChart className="summary-icon" />
                <h3>Meta Mensal</h3>
              </div>
              <div className="summary-value">{goalAchievement.toFixed(1)}%</div>
              <div className="summary-subtitle">
                {currentMonth ? formatCurrency(currentMonth.value) : "R$ 0,00"}{" "}
                / {formatCurrency(monthlyGoal)}
              </div>
            </Card>
          </div>
        </div>

        {/* Tabela de Performance Detalhada */}
        <Card className="report-table-card">
          <div className="table-header">
            <h3>Análise Detalhada de Performance</h3>
            <Button variant="secondary" size="small">
              <MdFileDownload />
              Exportar
            </Button>
          </div>

          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Contratos</th>
                  <th>Valor Total</th>
                  <th>Comissões</th>
                  <th>Ticket Médio</th>
                  <th>% da Meta</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((monthData, index) => (
                  <tr key={index}>
                    <td>
                      <strong>
                        {monthData.month} {monthData.year}
                      </strong>
                    </td>
                    <td>{monthData.contracts}</td>
                    <td>{formatCurrency(monthData.value)}</td>
                    <td>{formatCurrency(monthData.commission)}</td>
                    <td>
                      {formatCurrency(monthData.value / monthData.contracts)}
                    </td>
                    <td>
                      <span
                        className={`goal-badge ${
                          (monthData.value / monthlyGoal) * 100 >= 100
                            ? "goal-achieved"
                            : "goal-pending"
                        }`}
                      >
                        {((monthData.value / monthlyGoal) * 100).toFixed(1)}%
                      </span>
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

  const renderConsumptionReport = () => {
    const filteredContracts = getFilteredContracts();

    // Calcular métricas de consumo
    const clientsWithConsumption = clients.filter(
      (client) => client.monthlyConsumption && client.monthlyConsumption > 0
    );
    const totalConsumption = clientsWithConsumption.reduce(
      (sum, client) => sum + (client.monthlyConsumption || 0),
      0
    );
    const averageConsumption =
      clientsWithConsumption.length > 0
        ? totalConsumption / clientsWithConsumption.length
        : 0;

    // Projeção de economia (exemplo: 30% de economia com energia solar)
    const potentialSavings = totalConsumption * 0.3;
    const monthlySavings = potentialSavings / 12;

    return (
      <div className="report-content">
        <div className="report-summary">
          <div className="summary-cards">
            <Card className="summary-card">
              <div className="summary-header">
                <MdElectricBolt className="summary-icon" />
                <h3>Total de Consumo</h3>
              </div>
              <div className="summary-value">
                {totalConsumption.toLocaleString()} kWh/mês
              </div>
              <div className="summary-subtitle">
                {clientsWithConsumption.length} clientes com dados
              </div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdTrendingUp className="summary-icon" />
                <h3>Consumo Médio</h3>
              </div>
              <div className="summary-value">
                {averageConsumption.toLocaleString()} kWh/mês
              </div>
              <div className="summary-subtitle">Por cliente ativo</div>
            </Card>

            <Card className="summary-card">
              <div className="summary-header">
                <MdAttachMoney className="summary-icon" />
                <h3>Economia Potencial</h3>
              </div>
              <div className="summary-value">
                {monthlySavings.toLocaleString()} kWh/mês
              </div>
              <div className="summary-subtitle">30% com energia solar</div>
            </Card>
          </div>
        </div>

        {/* Tabela de Consumo Detalhada */}
        <Card className="report-table-card">
          <div className="table-header">
            <h3>Análise Detalhada de Consumo</h3>
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
                  <th>Empresa</th>
                  <th>Consumo Mensal</th>
                  <th>Status</th>
                  <th>Último Contrato</th>
                  <th>Economia Potencial</th>
                </tr>
              </thead>
              <tbody>
                {clientsWithConsumption.map((client) => {
                  const clientContracts = filteredContracts.filter(
                    (c) =>
                      c.clientId === client.id || c.clientEmail === client.email
                  );
                  const lastContract =
                    clientContracts.length > 0
                      ? clientContracts.sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )[0]
                      : null;
                  const potentialSavings =
                    (client.monthlyConsumption || 0) * 0.3;

                  return (
                    <tr key={client.id}>
                      <td>
                        <strong>{client.name}</strong>
                      </td>
                      <td>{client.company || "-"}</td>
                      <td className="consumption-cell">
                        {client.monthlyConsumption?.toLocaleString()} kWh/mês
                      </td>
                      <td>
                        <span
                          className={`status-badge status-${client.status.toLowerCase()}`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td>
                        {lastContract ? formatDate(lastContract.date) : "Nunca"}
                      </td>
                      <td className="savings-cell">
                        <strong>
                          {potentialSavings.toLocaleString()} kWh/mês
                        </strong>
                      </td>
                    </tr>
                  );
                })}
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
        return renderCommissionsReport();
      case "performance":
        return renderPerformanceReport();
      case "consumption":
        return renderConsumptionReport();
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
