import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QuerySnapshot,
  type WhereFilterOp,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";

export interface QueryOptions {
  field?: string;
  operator?: WhereFilterOp;
  value?: unknown;
  orderByField?: string;
  orderDirection?: "asc" | "desc";
  limitCount?: number;
}

// Adicionar documento a uma coleção
export const addDocument = async (
  collectionName: string,
  data: DocumentData
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar documento:", error);
    throw new Error("Erro ao adicionar documento");
  }
};

// Buscar documentos de uma coleção
export const getDocuments = async (
  collectionName: string,
  options?: QueryOptions
): Promise<DocumentData[]> => {
  try {
    let q = collection(db, collectionName);

    // Aplicar filtros se fornecidos
    if (options?.field && options?.operator && options?.value !== undefined) {
      q = query(q, where(options.field, options.operator, options.value));
    }

    // Aplicar ordenação se fornecida
    if (options?.orderByField) {
      q = query(
        q,
        orderBy(options.orderByField, options.orderDirection || "asc")
      );
    }

    // Aplicar limite se fornecido
    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const querySnapshot: QuerySnapshot = await getDocs(q);
    const documents: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return documents;
  } catch (error) {
    console.error("Erro ao buscar documentos:", error);
    throw new Error("Erro ao buscar documentos");
  }
};

// Buscar documento específico
export const getDocument = async (
  collectionName: string,
  documentId: string
): Promise<DocumentData | null> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar documento:", error);
    throw new Error("Erro ao buscar documento");
  }
};

// Atualizar documento
export const updateDocument = async (
  collectionName: string,
  documentId: string,
  updates: DocumentData
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao atualizar documento:", error);
    throw new Error("Erro ao atualizar documento");
  }
};

// Deletar documento
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Erro ao deletar documento:", error);
    throw new Error("Erro ao deletar documento");
  }
};
