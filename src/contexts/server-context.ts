import { createContext, useContext } from "react";

export interface HealthStatus {
  status: "up" | "down";
  modelLoaded: boolean;
}

export interface ServerConfig {
  id: string;
  name: string;
  url: string;
  basePath: string;
  health: HealthStatus | null;
  isChecking: boolean;
}

interface ServerContextType {
  servers: ServerConfig[];
  selectedServerId: string;
  setSelectedServerId: (id: string) => void;
  getSelectedServer: () => ServerConfig | undefined;
  addServer: (server?: Partial<ServerConfig>) => void;
  editServer: (id: string, data: Partial<ServerConfig>) => void;
  removeServer: (id: string) => void;
  checkServerHealth: (id: string) => Promise<void>;
}

export const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) throw new Error("useServer must be used within a ServerProvider");
  return context;
};
