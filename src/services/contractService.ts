import {
  addDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "./dataService";
import type { Contract } from "../types/Contract";

const COLLECTION_NAME = "contracts";

export const contractService = {
  async createContract(contractData: Omit<Contract, "id">): Promise<string> {
    return await addDocument(COLLECTION_NAME, contractData);
  },

  async getContracts(): Promise<Contract[]> {
    return (await getDocuments(COLLECTION_NAME, {
      orderByField: "createdAt",
      orderDirection: "desc",
    })) as Contract[];
  },

  async updateContract(
    contractId: string,
    updates: Partial<Contract>
  ): Promise<void> {
    await updateDocument(COLLECTION_NAME, contractId, updates);
  },

  async deleteContract(contractId: string): Promise<void> {
    await deleteDocument(COLLECTION_NAME, contractId);
  },
};
