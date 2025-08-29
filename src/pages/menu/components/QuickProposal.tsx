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
import { clientService } from "../../../services/clientServices";
import * as quickProposalService from "../../../services/quickProposalService";
import { useClientContext } from "../../../contexts/ClientContext";
import { useToast } from "../../../contexts/useToast";
import "./QuickProposal.css";

export default function QuickProposal() {
  const [proposals, setProposals] = useState<QuickProposal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<QuickProposal | null>(null);

  // Função para atualizar o consumo mensal do cliente
  const updateClientConsumption = async (
    clientId: string,
    monthlyConsumption: number
  ) => {
    try {
      console.log("Atualizando consumo do cliente:", {
        clientId,
        monthlyConsumption,
      });
      await clientService.updateClient(clientId, { monthlyConsumption });
      console.log("Consumo do cliente atualizado com sucesso!");

      // Triggar refresh dos clientes em outros componentes
      triggerClientRefresh();
    } catch (error) {
      console.error("Erro ao atualizar consumo do cliente:", error);
      throw error;
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { triggerClientRefresh } = useClientContext();
  const { showToast } = useToast();

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setIsLoading(true);
    try {
      const proposalsData = await quickProposalService.getQuickProposals();
      setProposals(proposalsData);
    } catch (error) {
      console.error("Erro ao carregar propostas:", error);
      showToast("Erro ao carregar propostas. Tente novamente.", "error");
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

      // Preparar dados da proposta
      const proposalData = {
        clientId: data.clientId,
        clientName: data.clientName || "Cliente Selecionado",
        systemPower: data.systemPower,
        monthlyConsumption: data.monthlyConsumption,
        energyTariff: data.energyTariff,
        costPerKWp: data.costPerKWp,
        monthlyGeneration: Math.round(monthlyGeneration),
        totalSystemValue: Math.round(totalSystemValue),
        monthlySavings: Math.round(monthlySavings),
        paybackPeriod: Math.round(paybackPeriod),
        status: "draft",
      };

      // Salvar no banco de dados
      const newProposalId = await quickProposalService.createQuickProposal(
        proposalData
      );

      // Buscar a proposta criada para obter todos os campos
      const newProposal = await quickProposalService.getQuickProposal(
        newProposalId
      );
      if (!newProposal) {
        throw new Error("Erro ao recuperar proposta criada");
      }

      // Atualizar o monthlyConsumption do cliente
      if (data.clientId && data.monthlyConsumption > 0) {
        try {
          await updateClientConsumption(data.clientId, data.monthlyConsumption);
        } catch (error) {
          console.error("Erro ao atualizar consumo do cliente:", error);
        }
      }

      // Atualizar estado local
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

  const handleDeleteProposal = async (proposalId: string) => {
    try {
      await quickProposalService.deleteQuickProposal(proposalId);
      setProposals((prev) => prev.filter((p) => p.id !== proposalId));
      showToast("Proposta removida com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao deletar proposta:", error);
      showToast("Erro ao remover proposta!", "error");
    }
  };

  const handleSendProposal = async (proposal: QuickProposal) => {
    try {
      // Atualizar status para "sent" no banco
      await quickProposalService.updateQuickProposal(proposal.id!, {
        status: "sent",
      });

      // Atualizar estado local
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposal.id ? { ...p, status: "sent" as const } : p
        )
      );
      setIsViewModalOpen(false);
      showToast("Proposta enviada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      showToast("Erro ao enviar proposta!", "error");
    }
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
        onDelete={handleDeleteProposal}
        onSend={handleSendProposal}
      />
    </div>
  );
}
