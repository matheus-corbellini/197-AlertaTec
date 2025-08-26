import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface ClientContextType {
  refreshClients: boolean;
  triggerClientRefresh: () => void;
  resetClientRefresh: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [refreshClients, setRefreshClients] = useState(false);

  const triggerClientRefresh = () => {
    setRefreshClients(true);
  };

  const resetClientRefresh = () => {
    setRefreshClients(false);
  };

  return (
    <ClientContext.Provider
      value={{
        refreshClients,
        triggerClientRefresh,
        resetClientRefresh,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClientContext must be used within a ClientProvider");
  }
  return context;
};
