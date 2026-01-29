// src/contexts/TrailTokensContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { EarnedToken } from "../components/TokenPopup";
import { useTrailTokens as useTrailTokensHook } from "../hooks/useTrailTokens";

interface TrailTokensContextType {
  tokensByTrail: Record<string, EarnedToken[]>; // trailId -> tokens
  refreshTokens: (trailId: string) => void;
}

const TrailTokensContext = createContext<TrailTokensContextType | undefined>(
  undefined
);

export const TrailTokensProvider: React.FC<{
  userId?: string;
  children: React.ReactNode;
}> = ({ userId, children }) => {
  const [tokensByTrail, setTokensByTrail] = useState<
    Record<string, EarnedToken[]>
  >({});

  const refreshTokens = useCallback(
    async (trailId: string) => {
      if (!userId || !trailId) return;

      const { tokens } = useTrailTokensHook(userId, trailId); // can be slightly refactored to just fetch
      setTokensByTrail((prev) => ({ ...prev, [trailId]: tokens }));
    },
    [userId]
  );

  return (
    <TrailTokensContext.Provider value={{ tokensByTrail, refreshTokens }}>
      {children}
    </TrailTokensContext.Provider>
  );
};

export const useTrailTokensContext = () => {
  const context = useContext(TrailTokensContext);
  if (!context)
    throw new Error(
      "useTrailTokensContext must be used within TrailTokensProvider"
    );
  return context;
};
