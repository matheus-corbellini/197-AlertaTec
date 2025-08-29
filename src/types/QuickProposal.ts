export interface QuickProposal {
  id?: string;
  clientId: string;
  clientName: string;
  systemPower: number;
  monthlyConsumption: number;
  energyTariff: number;
  costPerKWp: number;
  monthlyGeneration: number;
  totalSystemValue: number;
  monthlySavings: number;
  paybackPeriod: number;

  createdAt: string;
  updatedAt?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  notes?: string;
}

export interface QuickProposalFormData {
  clientId: string;
  clientName?: string;
  monthlyConsumption: number;
  systemPower: number;
  energyTariff: number;
  costPerKWp: number;
}

export interface ProposalCalculations {
  monthlyGeneration: number;
  totalSystemValue: number;
  monthlySavings: number;
  paybackPeriod: number;
  annualSavings: number; // Bônus: economia anual
  roiPercentage: number; // Bônus: retorno sobre investimento
}

export interface SolarSystemConfig {
  efficiencyFactor: number; // Fator de eficiência (0.75-0.85)
  radiationFactor: number; // Radiação solar da região (KWh/m²/dia)
  installationCost: number; // Custo fixo de instalação
  maintenanceCost: number; // Custo mensal de manutenção
}

export interface QuickProposalResponse {
  success: boolean;
  data?: QuickProposal;
  error?: string;
  calculations?: ProposalCalculations;
}

export interface QuickProposalFormProps {
  onSubmit: (data: QuickProposalFormData & { clientName: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
  initialData?: QuickProposal;
}
