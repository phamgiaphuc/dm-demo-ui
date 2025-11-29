import { ServerContext, type HealthStatus, type ServerConfig } from "@/contexts/server-context";
import { useState, useEffect } from "react";

export const ServerProvider = ({ children }: { children: React.ReactNode }) => {
  const [servers, setServers] = useState<ServerConfig[]>(() => {
    const storedServers = localStorage.getItem("servers");
    return storedServers ? JSON.parse(storedServers) : [];
  });

  const [selectedServerId, setSelectedServerId] = useState<string>(() => {
    return localStorage.getItem("selected-server-id") || (servers[0]?.id ?? "1");
  });

  useEffect(() => {
    localStorage.setItem("selected-server-id", selectedServerId);
  }, [selectedServerId]);

  useEffect(() => {
    localStorage.setItem("servers", JSON.stringify(servers));
  }, [servers]);

  const getSelectedServer = () => {
    return servers.find((s) => s.id === selectedServerId);
  };

  const checkServerHealth = async (serverId: string) => {
    const server = servers.find((s) => s.id === serverId);
    if (!server) return;

    setServers((prev) => prev.map((s) => (s.id === serverId ? { ...s, isChecking: true } : s)));

    try {
      const response = await fetch(`${server.url}${server.basePath}/health`);
      const data: HealthStatus = await response.json();

      setServers((prev) => prev.map((s) => (s.id === serverId ? { ...s, health: data, isChecking: false } : s)));
    } catch (error) {
      console.error(error);
      setServers((prev) =>
        prev.map((s) =>
          s.id === serverId ? { ...s, health: { status: "down", modelLoaded: false }, isChecking: false } : s
        )
      );
    }
  };

  const removeServer = (serverId: string) => {
    if (servers.length === 1) return;

    setServers((prev) => prev.filter((s) => s.id !== serverId));

    if (selectedServerId === serverId) {
      const remainingServers = servers.filter((s) => s.id !== serverId);
      setSelectedServerId(remainingServers[0].id);
    }
  };

  const addServer = (server?: Partial<ServerConfig>) => {
    const newServer: ServerConfig = {
      id: Date.now().toString(),
      name: server?.name || "",
      url: server?.url || "",
      basePath: server?.basePath || "/api/v1",
      health: null,
      isChecking: false,
    };

    setServers((prev) => [...prev, newServer]);
    setSelectedServerId(newServer.id);
    checkServerHealth(newServer.id);
  };

  const editServer = (serverId: string, data: Partial<ServerConfig>) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? { ...s, name: data.name ?? s.name, url: data.url ?? s.url, basePath: data.basePath ?? s.basePath }
          : s
      )
    );
    if (data.url || data.basePath) {
      checkServerHealth(serverId);
    }
  };

  return (
    <ServerContext.Provider
      value={{
        servers,
        selectedServerId,
        setSelectedServerId,
        addServer,
        getSelectedServer,
        removeServer,
        editServer,
        checkServerHealth,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};
