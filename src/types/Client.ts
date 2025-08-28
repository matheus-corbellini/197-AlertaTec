export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
  status: string;
  monthlyConsumption?: number;
}

export interface ClientConsumptionData {
  month: string;
  year: number;
  consumption: number;
  contractId?: string;
  contractStatus?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  status: string;
  monthlyConsumption?: number;
}
