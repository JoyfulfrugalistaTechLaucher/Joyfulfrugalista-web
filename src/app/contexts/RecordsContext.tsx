'use client';
import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  ReactNode
} from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { FB_URL } from '@/app/constants';
import { SavingsRecord } from '@/app/interface';
import { recordsReducer } from '@/app/reducers/recordsReducer';

type RecordsContextType = {
  records: SavingsRecord[];
  loading: boolean;
  error: string | null;
  addRecord: (record: SavingsRecord) => Promise<boolean>;
  refreshRecords: () => Promise<void>;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);
// const RecordsDispatchContext = createContext(null);

// convenient helper to use the context
export const useRecords = () => {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error("useRecords must be used within a RecordsProvider");
  }
  return context;
};

export const RecordsProvider = ({ children }: { children: ReactNode }) => {
  const { uid, isLoggedIn } = useAuth();
  const [records, dispatch] = useReducer(recordsReducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize the refreshRecords function
  const refreshRecords = React.useCallback(async () => {
    if (!isLoggedIn || !uid) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${FB_URL}/addInfo/${uid}.json`);
      const recordsData = response.data;
      const fetchedRecords: SavingsRecord[] = recordsData
        ? Object.entries(recordsData).map(([id, data]) => ({
          id,
          ...(data as SavingsRecord),
          date: new Date((data as SavingsRecord).date)
          }))
        : [];

      dispatch({ kind: 'loaded', data: fetchedRecords.reverse() });

      // Cache the records
      localStorage.setItem(`records_${uid}`, JSON.stringify(fetchedRecords));

    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to load your savings records');
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, uid]);

  // Load records from cache initially
  useEffect(() => {
    let mounted = true;

    if (isLoggedIn && uid) {
      const cachedRecords = localStorage.getItem(`records_${uid}`);
      if (cachedRecords && mounted) {
        try {
          const parsedRecords = JSON.parse(cachedRecords);
          dispatch({ kind: 'loaded', data: parsedRecords });
        } catch (e) {
          console.error('Error parsing cached records');
        }
      }
    }

    return () => {
      mounted = false;
    };
  }, [isLoggedIn, uid]);

  // Separate effect for data fetching
  useEffect(() => {
    let isMounted = true;

    // Use a small delay to ensure component is mounted
    const fetchTimer = setTimeout(() => {
      if (isLoggedIn && uid && isMounted) {
        const fetchTimer = setTimeout(() => {
          refreshRecords();
        }, 10);
      }
    }, 10);

    return () => {
      isMounted = false;
      clearTimeout(fetchTimer);
    };
  }, [isLoggedIn, uid, refreshRecords]);

  // Use callback for addRecord too
  const addRecord = React.useCallback(async (record: SavingsRecord): Promise<boolean> => {
    if (!isLoggedIn || !uid) return false;

    try {
      const response = await axios.post(
        `${FB_URL}/addInfo/${uid}.json`,
        {...record, date: record.date.toISOString().split('T')[0]}
      );
      if (response.data && response.status === 200) {
        const newRecord = {
          ...record,
          id: response.data.name
        };

        dispatch({ kind: 'added', record: newRecord });

        // Update the cache with the new records list
        const updatedRecords = [newRecord, ...records];
        localStorage.setItem(`records_${uid}`, JSON.stringify(updatedRecords));

        return true;
      }
    } catch (err) {
      console.error('Error adding record:', err);
      setError('Failed to add your savings record');
    }
    return false;
  }, [isLoggedIn, uid, records]);

  const value = {
    records,
    loading,
    error,
    addRecord,
    refreshRecords
  };

  return (
    <RecordsContext.Provider value={value}>
      {children}
    </RecordsContext.Provider>
  );
};
