export interface Client {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
}
