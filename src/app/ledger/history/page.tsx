'use client';
import { useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MainLayout from '@/app/layouts/MainLayout';
import { useRouter } from 'next/navigation';
import { useRecords } from '@/app/contexts/RecordsContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { formatNumericDate } from '@/app/utils';

const cols: GridColDef[] = [
  { field: 'category', headerName: 'Type', width: 130 },
  { field: 'moneyAdded', headerName: 'Saved', width: 140 },
  { field: 'date',
    headerName: 'Date',
    width: 130,
    valueGetter: (date) => formatNumericDate(date)
  },
  { field: 'description', headerName: 'Note', width: 180 },
]

function HistoryTable() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const { records, loading } = useRecords(); // rows

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full h-full flex justify-center items-center">
          <div>Loading records...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-w-full h-full m-2 p-2 flex-grow">
        <DataGrid
          rows={records}
          columns={cols}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
        />
      </div>
    </MainLayout>
  )
}

export default HistoryTable;
