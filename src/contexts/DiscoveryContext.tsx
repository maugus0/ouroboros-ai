import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { resultsApi } from "@/api/resultsApi";
import { getErrorMessage } from "@/api/client";
import type { DashboardResponse } from "@/types/results.types";

interface DiscoveryContextValue {
  dashboardData: DashboardResponse | null;
  isLoading: boolean;
  isDiscovering: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
  runDiscovery: () => Promise<void>;
  clearError: () => void;
}

const DiscoveryContext = createContext<DiscoveryContextValue | undefined>(undefined);

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await resultsApi.getDashboard({ includeHistory: false });
      setDashboardData(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runDiscovery = useCallback(async () => {
    if (isDiscovering) return;

    setIsDiscovering(true);
    setError(null);
    try {
      const response = await resultsApi.discover({
        limit: 10,
        include_attribution: true,
        force_refresh: true,
      });
      setDashboardData({
        has_results: true,
        latest_workflow_id: response.workflow_id,
        dashboard: response.dashboard,
        history: [],
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsDiscovering(false);
    }
  }, [isDiscovering]);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    void loadDashboard();
  }, [loadDashboard]);

  const value = useMemo<DiscoveryContextValue>(
    () => ({
      dashboardData,
      isLoading,
      isDiscovering,
      error,
      loadDashboard,
      runDiscovery,
      clearError: () => setError(null),
    }),
    [dashboardData, error, isDiscovering, isLoading, loadDashboard, runDiscovery]
  );

  return <DiscoveryContext.Provider value={value}>{children}</DiscoveryContext.Provider>;
}

export function useDiscovery() {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error("useDiscovery must be used within a DiscoveryProvider");
  }
  return context;
}
