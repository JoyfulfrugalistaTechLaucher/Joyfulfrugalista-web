import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/contexts/AuthContext';

interface SavingRecord {
    id: string;
    date: string;
    amount: number;
    category: string;
}

interface SavingListProps {
    editMode?: boolean;
    onClose: () => void;
}

const styles: { [key: string]: React.CSSProperties } = {
    savingListContainer: {
        position: 'absolute',
        width: '500px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        cursor: 'default',
    },
    header: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    recordList: {
        maxHeight: '400px',
        overflowY: 'auto',
    },
    recordItem: {
        padding: '10px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recordDate: {
        flex: 1,
        color: '#888',
    },
    recordCategory: {
        flex: 1,
        textAlign: 'center',
        color: '#555',
    },
    recordAmount: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
    },
};

const SavingList: React.FC<SavingListProps> = ({ editMode = false, onClose }) => {
    const { uid } = useAuth();
    const [savingRecords, setSavingRecords] = useState<SavingRecord[]>([]);
    const [pos, setPos] = useState({ x: -80, y: 550 });
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchRecentSavings = async () => {
            try {
                const apiUrl = `/api/savings/${uid}/monthlySummary`;
                const response = await axios.get(apiUrl);
                const groupedData = response.data.groupedByMonth;
                const allRecords: SavingRecord[] = [];

                Object.entries(groupedData).forEach(([month, categories]: [string, any]) => {
                    Object.entries(categories).forEach(([category, amount]) => {
                        allRecords.push({
                            id: `${month}-${category}`,
                            date: `${month}-01`,
                            amount: Number(amount),
                            category,
                        });
                    });
                });

                allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setSavingRecords(allRecords.slice(0, 10));
            } catch (error) {
                console.error('Error fetching recent savings:', error);
            }
        };

        if (uid) {
            fetchRecentSavings();
        }
    }, [uid]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!editMode || !listRef.current) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const initialLeft = pos.x;
        const initialTop = pos.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            setPos({
                x: initialLeft + deltaX,
                y: initialTop + deltaY,
            });
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={listRef}
            onMouseDown={handleMouseDown}
            style={{
                ...styles.savingListContainer,
                top: pos.y,
                left: pos.x,
                cursor: editMode ? 'move' : 'default',
            }}
        >
            {editMode && (
                <button style={styles.closeButton} onClick={onClose}>×</button>
            )}
            <div style={styles.header}>Recent Saving Lists</div>
            <div style={styles.recordList}>
                {savingRecords.map((record) => (
                    <div key={record.id} style={styles.recordItem}>
                        <div style={styles.recordDate}>{new Date(record.date).toLocaleDateString()}</div>
                        <div style={styles.recordCategory}>{record.category}</div>
                        <div style={styles.recordAmount}>${record.amount.toFixed(2)}</div>
                    </div>
                ))}
                {savingRecords.length === 0 && <p>No recent saving records.</p>}
            </div>
        </div>
    );
};

export default SavingList;
