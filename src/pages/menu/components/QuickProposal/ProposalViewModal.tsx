import Modal from "../../../../components/AddClient/Modal";
import Button from "../../../../components/Button/Button";
import type { QuickProposal } from "../../../../types/QuickProposal";
import {
  HiSun,
  HiCurrencyDollar,
  HiLightningBolt,
  HiCalculator,
  HiCalendar,
  HiUser,
  HiPencil,
  HiTrash,
  HiMail,
} from "react-icons/hi";
import { MdBarChart } from "react-icons/md";
import "./ProposalViewModal.css";

interface ProposalViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: QuickProposal | null;
  onEdit?: (proposal: QuickProposal) => void;
  onDelete?: (proposalId: string) => void;
  onSend?: (proposal: QuickProposal) => void;
}

export default function ProposalViewModal({
  isOpen,
  onClose,
  proposal,
  onEdit,
  onDelete,
  onSend,
}: ProposalViewModalProps) {
  if (!proposal) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "draft";
      case "sent":
        return "sent";
      case "accepted":
        return "accepted";
      case "rejected":
        return "rejected";
      default:
        return "draft";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "sent":
        return "Enviada";
      case "accepted":
        return "Aceita";
      case "rejected":
        return "Rejeitada";
      default:
        return status;
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(proposal);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete && proposal.id) {
      const confirmed = window.confirm(
        `Tem certeza que deseja excluir a proposta de ${proposal.clientName}?`
      );
      if (confirmed) {
        onDelete(proposal.id);
        onClose();
      }
    }
  };

  const handleSend = () => {
    if (onSend) {
      onSend(proposal);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Proposta - ${proposal.clientName}`}
    >
      <div className="proposal-view-modal">
        {/* Header da Proposta */}
        <div className="proposal-view-header">
          <div className="client-info">
            <div className="client-icon">
              <HiUser />
            </div>
            <div>
              <h3>{proposal.clientName}</h3>
              <p>ID: {proposal.id}</p>
            </div>
          </div>

          <div className="proposal-status">
            <span
              className={`status-badge-large ${getStatusColor(
                proposal.status
              )}`}
            >
              {getStatusText(proposal.status)}
            </span>
            <span className="proposal-date">
              <HiCalendar />
              {formatDate(proposal.createdAt)}
            </span>
          </div>
        </div>

        {/* Dados do Sistema */}
        <div className="proposal-section">
          <h4>📋 Dados do Sistema</h4>
          <div className="system-grid">
            <div className="system-item">
              <span className="label">Potência do Sistema</span>
              <span className="value">{proposal.systemPower} kWp</span>
            </div>
            <div className="system-item">
              <span className="label">Consumo Mensal</span>
              <span className="value">{proposal.monthlyConsumption} kWh</span>
            </div>
            <div className="system-item">
              <span className="label">Tarifa de Energia</span>
              <span className="value">
                {formatCurrency(proposal.energyTariff)}/kWh
              </span>
            </div>
            <div className="system-item">
              <span className="label">Custo por kWp</span>
              <span className="value">
                {formatCurrency(proposal.costPerKWp)}
              </span>
            </div>
          </div>
        </div>

        {/* Resultados Calculados */}
        <div className="proposal-section">
          <h4>💡 Resultados da Proposta</h4>
          <div className="results-grid-detailed">
            <div className="result-card-detailed generation">
              <div className="result-icon-detailed">
                <HiSun />
              </div>
              <div className="result-content-detailed">
                <h5>Geração Mensal</h5>
                <p className="result-value-large">
                  {proposal.monthlyGeneration} kWh
                </p>
                <span className="result-subtitle">
                  {(proposal.monthlyGeneration * 12).toLocaleString()} kWh/ano
                </span>
              </div>
            </div>

            <div className="result-card-detailed value">
              <div className="result-icon-detailed">
                <HiCurrencyDollar />
              </div>
              <div className="result-content-detailed">
                <h5>Valor do Sistema</h5>
                <p className="result-value-large">
                  {formatCurrency(proposal.totalSystemValue)}
                </p>
                <span className="result-subtitle">
                  {formatCurrency(
                    proposal.totalSystemValue / proposal.systemPower
                  )}
                  /kWp
                </span>
              </div>
            </div>

            <div className="result-card-detailed savings">
              <div className="result-icon-detailed">
                <HiLightningBolt />
              </div>
              <div className="result-content-detailed">
                <h5>Economia Mensal</h5>
                <p className="result-value-large">
                  {formatCurrency(proposal.monthlySavings)}
                </p>
                <span className="result-subtitle">
                  {formatCurrency(proposal.monthlySavings * 12)}/ano
                </span>
              </div>
            </div>

            <div className="result-card-detailed payback">
              <div className="result-icon-detailed">
                <HiCalculator />
              </div>
              <div className="result-content-detailed">
                <h5>Tempo de Retorno</h5>
                <p className="result-value-large">
                  {proposal.paybackPeriod} meses
                </p>
                <span className="result-subtitle">
                  {Math.round((proposal.paybackPeriod / 12) * 10) / 10} anos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Economia Projetada */}
        <div className="proposal-section">
          <h4><MdBarChart /> Projeção de Economia</h4>
          <div className="projection-grid">
            <div className="projection-item">
              <span className="period">1 Ano</span>
              <span className="economy">
                {formatCurrency(proposal.monthlySavings * 12)}
              </span>
            </div>
            <div className="projection-item">
              <span className="period">5 Anos</span>
              <span className="economy">
                {formatCurrency(proposal.monthlySavings * 60)}
              </span>
            </div>
            <div className="projection-item">
              <span className="period">10 Anos</span>
              <span className="economy">
                {formatCurrency(proposal.monthlySavings * 120)}
              </span>
            </div>
            <div className="projection-item">
              <span className="period">20 Anos</span>
              <span className="economy">
                {formatCurrency(proposal.monthlySavings * 240)}
              </span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="proposal-actions">
          <div className="action-group">
            {proposal.status === "draft" && (
              <Button variant="primary" onClick={handleSend}>
                <HiMail />
                Enviar Proposta
              </Button>
            )}

            <Button variant="secondary" onClick={handleEdit}>
              <HiPencil />
              Editar
            </Button>
          </div>

          <Button variant="danger" onClick={handleDelete}>
            <HiTrash />
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
