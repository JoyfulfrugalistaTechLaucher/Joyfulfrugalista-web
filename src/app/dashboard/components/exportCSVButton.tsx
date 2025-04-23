'use client';
import React from 'react';
import { useRecords } from '@/app/contexts/RecordsContext';

const ExportCSVButton: React.FC = () => {
    const { records } = useRecords();

    const exportToCSV = () => {
        if (!records || records.length === 0) return;

        const headers = ['Date', 'Amount', 'Category'];
        const rows = records.map(record => [
            new Date(record.date).toLocaleDateString(),
            record.saved,
            record.category
        ]);

        const csvContent =
            [headers, ...rows]
                .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
                .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'savings_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={exportToCSV}
            style={{
                position: 'fixed',
                top: '100px',
                right: '145px',
                zIndex: 1000,
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0',
                color: 'black',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
        >
            Export CSV
        </button>

    );
};

export default ExportCSVButton;
