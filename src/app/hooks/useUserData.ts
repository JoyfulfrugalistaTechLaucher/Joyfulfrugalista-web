'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './hooks/useAuthContext';
import { User } from '../interface';
import { FB_URL, DEFAULT_AVATAR } from '../constants';

interface UserData {
  user: User,
  loading: boolean
};

export function useUserData(uid: string): UserData {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (uid) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get<User>(`${FB_URL}/users/${uid}.json`);
          const user: User = response.data;
          setUser(user || null);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [uid]);

  return { user, loading };
}
