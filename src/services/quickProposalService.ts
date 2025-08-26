import {
  addDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  type QueryOptions,
} from "./dataService";
import type {
  QuickProposal,
  QuickProposalFormData,
} from "../types/QuickProposal";

const COLLECTION_NAME = "quickProposals";

// Criar nova proposta rápida
export const createQuickProposal = async (
  data: QuickProposalFormData
): Promise<string> => {
  try {
    const proposalData = {
      ...data,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const id = await addDocument(COLLECTION_NAME, proposalData);
    console.log("Proposta rápida criada com sucesso:", id);
    return id;
  } catch (error) {
    console.error("Erro ao criar proposta rápida:", error);
    throw new Error("Erro ao criar proposta rápida");
  }
};

// Buscar todas as propostas rápidas
export const getQuickProposals = async (
  options?: QueryOptions
): Promise<QuickProposal[]> => {
  try {
    const proposals = await getDocuments(COLLECTION_NAME, {
      ...options,
      orderByField: "createdAt",
      orderDirection: "desc",
    });

    return proposals as QuickProposal[];
  } catch (error) {
    console.error("Erro ao buscar propostas rápidas:", error);
    throw new Error("Erro ao buscar propostas rápidas");
  }
};

// Buscar proposta específica por ID
export const getQuickProposal = async (
  id: string
): Promise<QuickProposal | null> => {
  try {
    const proposal = await getDocument(COLLECTION_NAME, id);
    return proposal as QuickProposal | null;
  } catch (error) {
    console.error("Erro ao buscar proposta rápida:", error);
    throw new Error("Erro ao buscar proposta rápida");
  }
};

// Atualizar proposta rápida
export const updateQuickProposal = async (
  id: string,
  updates: Partial<QuickProposal>
): Promise<void> => {
  try {
    await updateDocument(COLLECTION_NAME, id, updates);
    console.log("Proposta rápida atualizada com sucesso:", id);
  } catch (error) {
    console.error("Erro ao atualizar proposta rápida:", error);
    throw new Error("Erro ao atualizar proposta rápida");
  }
};

// Deletar proposta rápida
export const deleteQuickProposal = async (id: string): Promise<void> => {
  try {
    await deleteDocument(COLLECTION_NAME, id);
    console.log("Proposta rápida deletada com sucesso:", id);
  } catch (error) {
    console.error("Erro ao deletar proposta rápida:", error);
    throw new Error("Erro ao deletar proposta rápida");
  }
};

// Buscar propostas por cliente
export const getQuickProposalsByClient = async (
  clientId: string
): Promise<QuickProposal[]> => {
  try {
    const proposals = await getDocuments(COLLECTION_NAME, {
      field: "clientId",
      operator: "==",
      value: clientId,
      orderByField: "createdAt",
      orderDirection: "desc",
    });

    return proposals as QuickProposal[];
  } catch (error) {
    console.error("Erro ao buscar propostas do cliente:", error);
    throw new Error("Erro ao buscar propostas do cliente");
  }
};

// Buscar propostas por status
export const getQuickProposalsByStatus = async (
  status: string
): Promise<QuickProposal[]> => {
  try {
    const proposals = await getDocuments(COLLECTION_NAME, {
      field: "status",
      operator: "==",
      value: status,
      orderByField: "createdAt",
      orderDirection: "desc",
    });

    return proposals as QuickProposal[];
  } catch (error) {
    console.error("Erro ao buscar propostas por status:", error);
    throw new Error("Erro ao buscar propostas por status");
  }
};
