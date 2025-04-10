"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from 'axios';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { User } from '@/app/interface';
import { FB_URL } from '@/app/constants';

// TODO: Add avatar to this context and drop the user data hook
type AuthContextType = {
  uid: string | null;
  setUid: (uid: string | null) => void;
  isLoggedIn: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(() => {
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setIsLoggedIn(true);
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("isLoggedIn", "true");
      } else {
        setUid(null);
        setIsLoggedIn(false);
        localStorage.removeItem("uid");
        localStorage.removeItem("isLoggedIn");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user data when uid changes
  useEffect(() => {
    if (uid) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get<User>(`${FB_URL}/users/${uid}.json`);
          setUser(response.data || null);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      };

      fetchProfile();
    }
  }, [uid]);


  return (
    <AuthContext.Provider value={{ uid, user, isLoggedIn, setUid }}>
      {children}
    </AuthContext.Provider>
  );
};
