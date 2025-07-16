import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
  updateProfile,
  type AuthError,
} from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import type { User } from "../types/User";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const mapFirebaseUserToUser = (
  firebaseUser: FirebaseUser,
  userData?: Partial<User>
): User => {
  return {
    id: firebaseUser.uid,
    name:
      userData?.name ||
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Usuário",
    email: firebaseUser.email || "",
    phone: userData?.phone || firebaseUser.phoneNumber || undefined,
    role: userData?.role || "admin",
    createdAt:
      userData?.createdAt ||
      firebaseUser.metadata.creationTime ||
      new Date().toISOString(),
  };
};

// Registrar novo usuário
export const registerUser = async (data: RegisterData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    await updateProfile(userCredential.user, {
      displayName: data.name,
    });

    await userCredential.user.reload();

    const newUser: User = {
      id: userCredential.user.uid,
      name: data.name,
      email: userCredential.user.email || "",
      phone: data.phone,
      role: "admin",
      createdAt: new Date().toISOString(),
    };

    return newUser;
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    const authError = error as AuthError;
    throw new Error(getErrorMessage(authError.code));
  }
};

// Fazer login
export const loginUser = async (data: LoginData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    return mapFirebaseUserToUser(userCredential.user);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    const authError = error as AuthError;
    throw new Error(getErrorMessage(authError.code));
  }
};

// Fazer logout
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    throw new Error("Erro ao sair da conta");
  }
};

// Obter usuário atual
export const getCurrentUser = (): User | null => {
  const firebaseUser = auth.currentUser;
  return firebaseUser ? mapFirebaseUserToUser(firebaseUser) : null;
};

const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    "auth/email-already-in-use": "Este email já está em uso",
    "auth/weak-password": "A senha deve ter pelo menos 6 caracteres",
    "auth/invalid-email": "Email inválido",
    "auth/user-not-found": "Usuário não encontrado",
    "auth/wrong-password": "Senha incorreta",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet",
  };

  return errorMessages[errorCode] || "Erro desconhecido. Tente novamente";
};
