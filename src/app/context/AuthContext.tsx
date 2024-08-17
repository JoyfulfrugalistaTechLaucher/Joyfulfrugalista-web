"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  uid: string | null;
  setUid: (uid: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [uid, setUid] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ uid, setUid }}>
      {children}
    </AuthContext.Provider>
  );
};
