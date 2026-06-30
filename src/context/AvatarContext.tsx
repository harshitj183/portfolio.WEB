'use client';

import React, { ReactNode } from 'react';
import { create } from 'zustand';

type AvatarState = {
  currentMessage: string | null;
  currentMood: string | null;
  timeoutId: NodeJS.Timeout | null;
  activityLog: string[];
  lastApiCallLogLength: number;
  triggerAvatarReaction: (message: string, mood?: string, duration?: number) => void;
  logActivity: (action: string) => void;
  clearReaction: () => void;
};

export const useAvatarStore = create<AvatarState>((set) => ({
  currentMessage: null,
  currentMood: null,
  timeoutId: null,
  activityLog: [],
  lastApiCallLogLength: 0,
  
  logActivity: (action) => {
    set((state) => {
      const newLog = [...state.activityLog, action];
      if (newLog.length > 10) {
        newLog.shift();
        return { 
          activityLog: newLog, 
          lastApiCallLogLength: Math.max(0, state.lastApiCallLogLength - 1) 
        };
      }
      return { activityLog: newLog };
    });
  },
  
  triggerAvatarReaction: (message, mood, duration = 4000) => {
    set((state) => {
      if (state.timeoutId) clearTimeout(state.timeoutId);
      
      const id = setTimeout(() => {
        set({ currentMessage: null, currentMood: null });
      }, duration);
      
      return {
        currentMessage: message,
        currentMood: mood || state.currentMood,
        timeoutId: id,
      };
    });
  },
  
  clearReaction: () => {
    set((state) => {
      if (state.timeoutId) clearTimeout(state.timeoutId);
      return { currentMessage: null, currentMood: null, timeoutId: null };
    });
  }
}));

export function AvatarProvider({ children }: { children: ReactNode }) {
  React.useEffect(() => {
    const fetchInsight = async () => {
      if (document.visibilityState !== 'visible') return;
      
      const state = useAvatarStore.getState();
      const currentLog = state.activityLog;
      
      if (currentLog.length > state.lastApiCallLogLength) {
        useAvatarStore.setState({ lastApiCallLogLength: currentLog.length });
        
        try {
          const res = await fetch('/api/agent-insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activityLog: currentLog })
          });
          const data = await res.json();
          if (data.message && data.message !== "No activity to process.") {
            useAvatarStore.getState().triggerAvatarReaction(data.message, 'talking', 5000);
          }
        } catch (e) {
          console.error("Failed to fetch agent insight", e);
        }
      }
    };

    const interval = setInterval(fetchInsight, 30000);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}

export const useAvatar = () => {
  return useAvatarStore();
};
