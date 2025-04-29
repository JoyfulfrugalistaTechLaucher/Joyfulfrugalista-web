'use client';
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '@/app/config/firebaseConfig';
import { User } from '@/app/interface';
import { DUSER } from '@/app/constants';
import { FB_URL } from '@/app/constants';

type AuthContextType = {
  uid: string | null;
  setUid: (uid: string | null) => void;
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
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
  const [loading, setLoading] = useState<boolean>(true);

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
        setUser(null);
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
          const userData = response.data;
          // Combine default user values, data from Firebase, and add id
          setUser(userData ? { ...DUSER, ...userData, id: uid } : null);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [uid]);

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!uid || !user) {
      console.error("Cannot update profile: no user logged in");
      return;
    }

    setLoading(true);
    try {
      const userRef = ref(db, `users/${uid}`);
      const updatedUser = { ...user, ...userData };

      // Remove id before saving to Firebase
      const { id, ...userWithoutId } = updatedUser;

      await set(userRef, userWithoutId);
      setUser(updatedUser);

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ uid, user, isLoggedIn, setUid, loading, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
