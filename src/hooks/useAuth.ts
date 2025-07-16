import { useState, useEffect } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import {
  loginUser,
  registerUser,
  logoutUser,
  type LoginData,
  type RegisterData,
} from "../services/authService";
import { saveUserData, getUserData } from "../services/userService";
import type { User } from "../types/User";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Monitorar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (!user) {
          setLoading(true);
        }

        if (firebaseUser) {
          try {
            const userData = await getUserData(firebaseUser.uid);

            if (userData) {
              setUser(userData);
            } else {
              const basicUser: User = {
                id: firebaseUser.uid,
                name:
                  firebaseUser.displayName ||
                  firebaseUser.email?.split("@")[0] ||
                  "Usuário",
                email: firebaseUser.email || "",
                phone: firebaseUser.phoneNumber || undefined,
                role: "admin",
                createdAt:
                  firebaseUser.metadata.creationTime ||
                  new Date().toISOString(),
              };

              await saveUserData(basicUser);
              setUser(basicUser);
            }
          } catch (error) {
            console.error("Erro ao carregar dados do usuário:", error);
            setError("Erro ao carregar dados do usuário");
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    try {
      setError(null);
      await loginUser(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao fazer login");
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      setError(null);
      const user = await registerUser(data);

      const fullUserData: User = {
        ...user,
        phone: data.phone,
      };

      await saveUserData(fullUserData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta");
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await logoutUser();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao sair");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
