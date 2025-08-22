import Modal from "../../../../components/AddClient/Modal";
import QuickProposalForm from "./QuickProposalForm";
import type { QuickProposalFormData } from "../../../../types/QuickProposal";

interface QuickProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuickProposalFormData) => void;
  isLoading?: boolean;
}

export default function QuickProposalModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: QuickProposalModalProps) {
  const handleSubmit = async (data: QuickProposalFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      return (
        <div className="error-message">
          <p>
            Erro ao enviar proposta rápida:{" "}
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      );
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Proposta Rápida"
      description="Preencha os campos abaixo para gerar uma proposta rápida"
    >
      <QuickProposalForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </Modal>
  );
}
