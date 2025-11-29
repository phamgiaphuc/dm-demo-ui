/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

export interface ApiResponse {
  [key: string]: any;
}

interface ApiContextType {
  isLoading: boolean;
  apiResponse: ApiResponse;
  testEndpoint: (endpoint: string, method?: string, body?: object) => Promise<void>;
  clearResponse: () => void;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error("useApi must be used inside ApiProvider");
  }
  return ctx;
};
