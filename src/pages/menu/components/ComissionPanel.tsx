"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MdAttachMoney,
  MdDateRange,
  MdRefresh,
  MdTrendingUp,
  MdDescription,
  MdCalendarToday,
  MdAccountBalanceWallet,
} from "react-icons/md";
import type { Contract } from "../../../types/Contract";
import { contractService } from "../../../services/contractService";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import "./ComissionPanel.css";

interface MontlyComission {
  month: string;
  year: number;
  total: number;
  contracts: number;
}

interface ComissionPanelProps {
  contracts?: Contract[];
}

export default function ComissionPanel({
  contracts: propsContracts,
}: ComissionPanelProps) {
  const [contracts, setContracts] = useState<Contract[]>(propsContracts || []);
  const [monthlyComissions, setMonthlyComissions] = useState<MontlyComission[]>(
    []
  );
  const [totalAccumulated, setTotalAccumulated] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(!propsContracts);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const calculateComissions = useCallback(() => {
    const monthlyData: { [key: string]: MontlyComission } = {};
    let total = 0;

    const validContracts = contracts.filter((contract) => {
      const contractDate = new Date(contract.date);
      const contractYear = contractDate.getFullYear();
      return (
        contractYear === selectedYear &&
        (contract.status === "Ativo" ||
          contract.status === "Concluido" ||
          contract.status === "Pendente")
      );
    });

    validContracts.forEach((contract) => {
      const contractDate = new Date(contract.date);
      const monthKey = `${contractDate.getFullYear()}-${contractDate.getMonth()}`;
      const monthName = contractDate.toLocaleString("pt-BR", { month: "long" });
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
      total += comission;
    });

    const sortedMonthly = Object.values(monthlyData).sort((a, b) => {
      const aDate = new Date(a.year, getMonthNumber(a.month));
      const bDate = new Date(b.year, getMonthNumber(b.month));
      return aDate.getTime() - bDate.getTime();
    });

    setMonthlyComissions(sortedMonthly);
    setTotalAccumulated(total);
  }, [contracts, selectedYear]);

  useEffect(() => {
    if (contracts.length > 0) {
      calculateComissions();
    }
  }, [contracts, selectedYear, calculateComissions]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const contractsData = await contractService.getContracts();
      setContracts(contractsData);
    } catch (error) {
      console.error("Error loading contracts:", error);
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getAvailableYears = (): number[] => {
    const years = new Set<number>();
    contracts.forEach((contract) => {
      const year = new Date(contract.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const getAvailableMonths = (): string[] => {
    const months = new Set<string>();
    contracts.forEach((contract) => {
      const month = new Date(contract.date).toLocaleString("pt-BR", {
        month: "long",
      });
      months.add(month);
    });
    return Array.from(months).sort();
  };

  if (loading) {
    return (
      <div className="comission-panel">
        <div className="comission-panel-header">
          <div className="header-title">
            <MdAttachMoney className="header-icon" />
            <h2>Painel de Comissões</h2>
          </div>
        </div>
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <p>Carregando comissões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comission-panel">
      <div className="comission-panel-header">
        <div className="header-title">
          <MdAttachMoney className="header-icon" />
          <h1>Painel de Comissões</h1>
        </div>
        <div className="year-selector">
          <MdDateRange className="year-selector-icon" />
          <label htmlFor="year-select">Ano:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="year-select"
          >
            {getAvailableYears().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <MdDateRange className="year-selector-icon" />
          <label htmlFor="month-select">Mês:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="year-select"
          >
            {getAvailableMonths().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="comission-summary">
        <Card className="total-card">
          <div className="total-content">
            <div className="total-header">
              <MdAccountBalanceWallet className="total-icon" />
              <h3>Total Acumulado ({selectedYear})</h3>
            </div>
            <div className="total-amount">
              {formatCurrency(totalAccumulated)}
            </div>
            <div className="total-stats">
              <div className="stat-item">
                <MdDescription className="stat-icon" />
                <span>
                  {monthlyComissions.reduce(
                    (sum, month) => sum + month.contracts,
                    0
                  )}{" "}
                  contratos
                </span>
              </div>
              <div className="stat-item">
                <MdTrendingUp className="stat-icon" />
                <span>
                  {monthlyComissions.length > 0
                    ? `${monthlyComissions.length} ${
                        monthlyComissions.length === 1 ? "mês" : "meses"
                      } ativos`
                    : "Nenhum mês ativo"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="monthly-commissions">
        <h3>Comissões por Mês</h3>
        {monthlyComissions.length === 0 ? (
          <div className="no-data">
            <MdAttachMoney className="no-data-icon" />
            <h4>Nenhuma comissão encontrada</h4>
            <p>Não há comissões registradas para o ano de {selectedYear}</p>
          </div>
        ) : (
          <div className="monthly-grid">
            {monthlyComissions.map((monthData, index) => (
              <Card key={index} className="month-card">
                <div className="month-header">
                  <div className="month-title">
                    <MdCalendarToday className="month-icon" />
                    <h4>
                      {monthData.month.charAt(0).toUpperCase() +
                        monthData.month.slice(1)}
                    </h4>
                  </div>
                  <span className="month-year">{monthData.year}</span>
                </div>
                <div className="month-amount">
                  <MdAttachMoney className="amount-icon" />
                  {formatCurrency(monthData.total)}
                </div>
                <div className="month-contracts">
                  <MdDescription className="contracts-icon" />
                  <span>
                    {monthData.contracts} contrato
                    {monthData.contracts !== 1 ? "s" : ""}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="commission-actions">
        <Button variant="secondary" onClick={loadContracts}>
          <MdRefresh className="button-icon" />
          Atualizar Dados
        </Button>
      </div>
    </div>
  );
}
