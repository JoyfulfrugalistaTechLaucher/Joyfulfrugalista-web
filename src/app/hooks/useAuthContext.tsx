"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";


interface AuthContext {
  uid: string | null;
  setUid: (uid: string | null) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return useMemo(() => context, [context.uid, context.isLog]);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<{
    uid: string | null;
    isLoggedIn: boolean;
  }>(() => {
    if (typeof window !== "undefined") {
      return {
        uid: localStorage.getItem("uid"),
        isLoggedIn: localStorage.getItem("isLoggedIn") === "true"
      };
    }
    return { uid: null, isLoggedIn: false };
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({ uid: user.uid, isLoggedIn: true });
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("isLoggedIn", "true");
      } else {
        setAuthState({ uid: null, isLoggedIn: false });
        localStorage.removeItem("uid");
        localStorage.removeItem("isLoggedIn");
      }
    });

    return () => unsubscribe();
  }, []);

  const authContextValue = useMemo(() => ({
    ...authState,
    setUid: (newUid: string | null) => setAuthState(prev => ({ ...prev, uid: newUid }))
  }), [authState]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
