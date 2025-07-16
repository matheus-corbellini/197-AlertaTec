import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import type { User } from "../types/User";

const USERS_COLLECTION = "users";

// Salvar dados do usuário no Firestore
export const saveUserData = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.id);
    await setDoc(userRef, {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao salvar dados do usuário:", error);
    throw new Error("Erro ao salvar dados do usuário");
  }
};

// Buscar dados do usuário no Firestore
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as DocumentData;
      return {
        id: userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        createdAt: data.createdAt,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw new Error("Erro ao buscar dados do usuário");
  }
};

// Atualizar dados do usuário
export const updateUserData = async (
  userId: string,
  updates: Partial<Omit<User, "id" | "createdAt">>
): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
    throw new Error("Erro ao atualizar dados do usuário");
  }
};

// Deletar dados do usuário
export const deleteUserData = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Erro ao deletar dados do usuário:", error);
    throw new Error("Erro ao deletar dados do usuário");
  }
};
