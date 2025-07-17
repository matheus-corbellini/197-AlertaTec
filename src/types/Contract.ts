export interface Contract {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  product: string;
  value: number;
  description: string;
  paymentTerms: string;
  duration: string;
  status: string;
  date: string;
  commission: number;
}

export interface ContractFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  product: string;
  value: string;
  description: string;
  paymentTerms: string;
  duration: string;
}

export interface ContractFormProps {
  onSubmit: (contract: ContractFormData) => void;
}

export interface ContractListProps {
  contracts: Contract[];
}

export interface DashboardProps {
  contracts: Contract[];
}

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
