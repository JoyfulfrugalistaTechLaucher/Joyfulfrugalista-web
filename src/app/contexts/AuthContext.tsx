"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

// TODO: Add avatar to this context and drop the user data hook
interface AuthContextType {
  uid: string | null;
  setUid: (uid: string | null) => void;
  isLoggedIn: boolean;
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
  const [uid, setUid] = useState<string | null>(() => {
    // 从 localStorage 恢复 uid
    if (typeof window !== "undefined") {
      return localStorage.getItem("uid");
    }
    return null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isLoggedIn") === "true";
    }
    return false;
  });

  useEffect(() => {
    // 检查并恢复用户状态
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setIsLoggedIn(true);
        localStorage.setItem("uid", user.uid); // 保存 uid
        localStorage.setItem("isLoggedIn", "true"); // 设置登录标志
      } else {
        setUid(null);
        setIsLoggedIn(false);
        localStorage.removeItem("uid"); // 移除 uid
        localStorage.removeItem("isLoggedIn"); // 移除登录标志
      }
    });

    return () => unsubscribe();
  }, []);

  return (
      <AuthContext.Provider value={{ uid, setUid, isLoggedIn }}>
        {children}
      </AuthContext.Provider>
  );
};
