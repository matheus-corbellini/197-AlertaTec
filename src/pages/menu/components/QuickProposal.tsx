import QuickProposalModal from "./QuickProposal/QuickProposalModal";
import ProposalViewModal from "./QuickProposal/ProposalViewModal";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import type {
  QuickProposalFormData,
  QuickProposal,
} from "../../../types/QuickProposal";
import { useEffect, useState } from "react";
import {
  calculateMonthlyGeneration,
  calculateTotalSystemValue,
  calculateMonthlySavings,
  calculatePaybackPeriod,
} from "../../../utils/solarCalculation";
import "./QuickProposal.css";

export default function QuickProposal() {
  const [proposals, setProposals] = useState<QuickProposal[]>([
    {
      id: "1",
      clientId: "client1",
      clientName: "João Silva",
      systemPower: 3.5,
      monthlyConsumption: 500,
      energyTariff: 0.85,
      costPerKWp: 4000,
      monthlyGeneration: 324,
      totalSystemValue: 15000,
      monthlySavings: 275,
      paybackPeriod: 54,
      createdAt: "2024-01-15",
      status: "draft",
    },
    {
      id: "2",
      clientId: "client2",
      clientName: "Maria Santos",
      systemPower: 5.0,
      monthlyConsumption: 800,
      energyTariff: 0.92,
      costPerKWp: 3800,
      monthlyGeneration: 463,
      totalSystemValue: 20500,
      monthlySavings: 310,
      paybackPeriod: 66,
      createdAt: "2024-01-10",
      status: "sent",
    },
    {
      id: "3",
      clientId: "client3",
      clientName: "Carlos Oliveira",
      systemPower: 2.5,
      monthlyConsumption: 300,
      energyTariff: 0.78,
      costPerKWp: 4200,
      monthlyGeneration: 231,
      totalSystemValue: 12000,
      monthlySavings: 165,
      paybackPeriod: 72,
      createdAt: "2024-01-08",
      status: "accepted",
    },
    {
      id: "4",
      clientId: "client4",
      clientName: "Ana Costa",
      systemPower: 7.0,
      monthlyConsumption: 1200,
      energyTariff: 0.95,
      costPerKWp: 3600,
      monthlyGeneration: 648,
      totalSystemValue: 26800,
      monthlySavings: 525,
      paybackPeriod: 51,
      createdAt: "2024-01-05",
      status: "sent",
    },
    {
      id: "5",
      clientId: "client5",
      clientName: "Pedro Lima",
      systemPower: 4.2,
      monthlyConsumption: 650,
      energyTariff: 0.88,
      costPerKWp: 3900,
      monthlyGeneration: 389,
      totalSystemValue: 17880,
      monthlySavings: 230,
      paybackPeriod: 77,
      createdAt: "2024-01-03",
      status: "rejected",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<QuickProposal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCreateProposal = () => {
    setIsModalOpen(true);
  };

  const handleSubmitProposal = async (data: QuickProposalFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Calcular os valores usando as funções de cálculo
      const monthlyGeneration = calculateMonthlyGeneration(data.systemPower);
      const totalSystemValue = calculateTotalSystemValue(
        data.systemPower,
        data.costPerKWp
      );
      const monthlySavings = calculateMonthlySavings(
        data.monthlyConsumption,
        monthlyGeneration,
        data.energyTariff
      );
      const paybackPeriod = calculatePaybackPeriod(
        totalSystemValue,
        monthlySavings
      );

      const newProposal: QuickProposal = {
        id: Date.now().toString(), // ID temporário
        clientId: data.clientId,
        clientName: "Cliente Selecionado", // Você pode buscar o nome real
        systemPower: data.systemPower,
        monthlyConsumption: data.monthlyConsumption,
        energyTariff: data.energyTariff,
        costPerKWp: data.costPerKWp,
        monthlyGeneration: Math.round(monthlyGeneration),
        totalSystemValue: Math.round(totalSystemValue),
        monthlySavings: Math.round(monthlySavings),
        paybackPeriod: Math.round(paybackPeriod),
        createdAt: new Date().toISOString().split("T")[0],
        status: "draft",
      };

      setProposals((prev) => [newProposal, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewProposal = (proposal: QuickProposal) => {
    console.log("Clicou na proposta:", proposal.clientName);
    setSelectedProposal(proposal);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProposal(null);
  };

  const handleEditProposal = (proposal: QuickProposal) => {
    // Aqui você pode implementar a edição futuramente
    console.log("Editar proposta:", proposal);
  };

  const handleDeleteProposal = (proposalId: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== proposalId));
  };

  const handleSendProposal = (proposal: QuickProposal) => {
    // Atualizar status para "sent"
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposal.id ? { ...p, status: "sent" as const } : p
      )
    );
    setIsViewModalOpen(false);
  };

  return (
    <div className="quick-proposal-page">
      <div className="quick-proposal-header">
        <h1>Propostas Rápidas</h1>
        <Button onClick={handleCreateProposal}>+ Nova Proposta</Button>
      </div>

      <div className="proposals-list">
        {isLoading ? (
          <div className="loading">Carregando propostas...</div>
        ) : proposals.length > 0 ? (
          proposals.map((proposal) => (
            <Card
              key={proposal.id}
              className="proposal-card"
              onClick={() => handleViewProposal(proposal)}
            >
              <div className="proposal-header">
                <h3>{proposal.clientName}</h3>
                <span
                  className={`status-badge ${proposal.status.toLowerCase()}`}
                >
                  {proposal.status}
                </span>
              </div>
              <div className="proposal-details">
                <div className="detail-item">
                  <span className="label">Potência do sistema:</span>
                  <span className="value">{proposal.systemPower} kWp</span>
                </div>
                <div className="detail-item">
                  <span className="label">Valor:</span>
                  <span className="value">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(proposal.totalSystemValue)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Economia mensal:</span>
                  <span className="value">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(proposal.monthlySavings)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Data:</span>
                  <span className="value">{proposal.createdAt}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="empty-state">
            <p>Nenhuma proposta encontrada</p>
          </div>
        )}
      </div>

      <QuickProposalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProposal}
        isLoading={isSubmitting}
      />

      <ProposalViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        proposal={selectedProposal}
        onEdit={handleEditProposal}
        onDelete={handleDeleteProposal}
        onSend={handleSendProposal}
      />
    </div>
  );
}
