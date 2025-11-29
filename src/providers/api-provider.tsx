import { ApiContext, type ApiResponse } from "@/contexts/api-context";
import { useServer } from "@/contexts/server-context";
import { useCallback, useState } from "react";

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { getSelectedServer } = useServer();

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse>({});

  const clearResponse = () => setApiResponse({});

  const testEndpoint = useCallback(
    async (endpoint: string, method: string = "GET", body?: object) => {
      const server = getSelectedServer();
      if (!server) return;

      setIsLoading(true);
      setApiResponse({});

      try {
        const options: RequestInit = {
          method,
          headers: { "Content-Type": "application/json" },
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(`${server.url}${server.basePath}${endpoint}`, options);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setApiResponse(data);
      } catch (err) {
        setApiResponse({ error: String(err) });
      } finally {
        setIsLoading(false);
      }
    },
    [getSelectedServer]
  );

  return (
    <ApiContext.Provider value={{ isLoading, apiResponse, testEndpoint, clearResponse }}>
      {children}
    </ApiContext.Provider>
  );
};
