import { create } from 'zustand';

interface TokenData {
  id: string;
  tokenNumber: string;
  status: string;
  branchId: string;
  estimatedServeTime?: Date | null;
  priority: boolean;
}

interface QueueState {
  currentToken: TokenData | null;
  queuePosition: number | null;
  estimatedWaitTime: number | null; // in minutes
  setCurrentToken: (token: TokenData | null) => void;
  setQueueStats: (position: number, waitTime: number) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  currentToken: null,
  queuePosition: null,
  estimatedWaitTime: null,
  setCurrentToken: (token) => set({ currentToken: token }),
  setQueueStats: (position, waitTime) => set({ queuePosition: position, estimatedWaitTime: waitTime }),
}));
