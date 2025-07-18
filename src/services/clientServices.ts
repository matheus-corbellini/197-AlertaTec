import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "./dataService";
import type { Client, ClientFormData } from "../types/Client";

const COLLECTION_NAME = "clients";

export const clientService = {
  async createClient(clientData: ClientFormData): Promise<string> {
    return await addDocument(COLLECTION_NAME, clientData);
  },

  async getClients(): Promise<Client[]> {
    return (await getDocuments(COLLECTION_NAME, {
      orderByField: "createdAt",
      orderDirection: "desc",
    })) as Client[];
  },

  async updateClient(
    clientId: string,
    updates: Partial<Client>
  ): Promise<void> {
    await updateDocument(COLLECTION_NAME, clientId, updates);
  },

  async deleteClient(clientId: string): Promise<void> {
    await deleteDocument(COLLECTION_NAME, clientId);
  },
};
