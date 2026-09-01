import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import type { Branch, Room } from '@/types/database';
import { getAllBranches, getRoomsByBranch } from '@/services/hotelService';

interface BranchContextValue {
  branches: Branch[];
  currentBranch: Branch | null;
  currentBranchRooms: Room[];
  setCurrentBranch: (branch: Branch | null) => void;
  setCurrentBranchById: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshBranches: () => Promise<void>;
  refreshRooms: () => Promise<void>;
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranchState] = useState<Branch | null>(null);
  const [currentBranchRooms, setCurrentBranchRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllBranches();
      setBranches(data);
      if (data.length > 0 && !currentBranch) {
        setCurrentBranchState(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch]);

  const loadRooms = useCallback(async () => {
    if (!currentBranch) {
      setCurrentBranchRooms([]);
      return;
    }
    try {
      const rooms = await getRoomsByBranch(currentBranch.id);
      setCurrentBranchRooms(rooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    }
  }, [currentBranch]);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const setCurrentBranch = useCallback((branch: Branch | null) => {
    setCurrentBranchState(branch);
  }, []);

  const setCurrentBranchById = useCallback(
    (id: string) => {
      const branch = branches.find((b) => b.id === id) ?? null;
      setCurrentBranchState(branch);
    },
    [branches]
  );

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        currentBranchRooms,
        setCurrentBranch,
        setCurrentBranchById,
        isLoading,
        error,
        refreshBranches: loadBranches,
        refreshRooms: loadRooms,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch(): BranchContextValue {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used within BranchProvider');
  return ctx;
}
