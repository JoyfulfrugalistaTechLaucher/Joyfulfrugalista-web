import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/contexts/AuthContext';

interface CategoryRanking {
    category: string;
    totalAmount: number;
}

interface SavingRecord {
    date: string;
    amount: number;
}

interface SavingRankingProps {
    editMode?: boolean;
    onClose: () => void;
}

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const categoryIcons: { [key: string]: string } = {
    Food: '🍕',
    Transport: '🚗',
    Leisure: '🎮',
    Education: '🎓',
    Health: '🩺',
    Housing: '🏠',
    Gifts: '🎁',
    Insurance: '🛡️',
    Utilities: '💡',
    Wellbeing: '🧘',
    Household: '🧹',
    Holidays: '🏖️',
    Grooming: '✂️',
    Christmas: '🎄',
    Childcare: '👶',
    Appearance: '💄',
    Lifestyle: '🎮',
    'Treat yourself': '🪙'
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: 'absolute',
        height: '480px',
        width: '510px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
        cursor: 'default'
    },
    header: {
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
    },
    medalList: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '10px',
    },
    medalCard: {
        flex: 1,
        padding: '15px',
        borderRadius: '10px',
        color: '#000',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s ease',
    },
    categoryName: {
        fontSize: '16px',
        fontWeight: 600,
    },
    icon: {
        fontSize: '30px',
        marginBottom: '10px',
    },
    amount: {
        marginTop: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    detail: {
        marginTop: '10px',
        fontSize: '14px',
        color: '#333',
        textAlign: 'left',
    },
    detailItem: {
        marginTop: '4px',
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

const SavingRanking: React.FC<SavingRankingProps> = ({ editMode = false, onClose }) => {
    const { uid } = useAuth();
    const [categoryRankings, setCategoryRankings] = useState<CategoryRanking[]>([]);
    const [activeDetail, setActiveDetail] = useState<string | null>(null);
    const [allRecords, setAllRecords] = useState<any[]>([]);
    const [pos, setPos] = useState({ x: 770, y: 570 });
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = `/api/savings/${uid}/monthlySummary`;
                const response = await axios.get(apiUrl);
                const groupedData = response.data.groupedByMonth;
                const categoryTotals: { [key: string]: number } = {};
                const all: any[] = [];

                Object.entries(groupedData).forEach(([month, categories]: [string, any]) => {
                    Object.entries(categories).forEach(([category, amount]) => {
                        categoryTotals[category] = (categoryTotals[category] || 0) + Number(amount);
                        all.push({ category, date: month + '-01', amount: amount });
                    });
                });

                const rankings = Object.entries(categoryTotals)
                    .map(([category, totalAmount]) => ({ category, totalAmount }))
                    .sort((a, b) => b.totalAmount - a.totalAmount)
                    .slice(0, 3);

                setCategoryRankings(rankings);
                setAllRecords(all);
            } catch (error) {
                console.error('Error fetching category rankings:', error);
            }
        };

        if (uid) {
            fetchData();
        }
    }, [uid]);

    const handleClick = (category: string) => {
        setActiveDetail(prev => (prev === category ? null : category));
    };

    const getDetailRecords = (category: string): SavingRecord[] => {
        return allRecords
            .filter(r => r.category === category)
            .slice(-5)
            .map(r => ({ date: r.date, amount: Number(r.amount) }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!editMode || !boxRef.current || !(e.target as HTMLElement).dataset.drag) return;

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
        <div data-drag="true"
            ref={boxRef}
            onMouseDown={handleMouseDown}
            style={{
                ...styles.container,
                top: pos.y,
                left: pos.x,
                cursor: editMode ? 'move' : 'default',
            }}
        >
            {editMode && (
                <button style={styles.closeButton} onClick={(e)=>{ e.stopPropagation(); onClose(); }}>×</button>
            )}
            <div style={styles.header}>🏅 Top 3 Saving Categories</div>
            <div style={styles.medalList}>
                {categoryRankings.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.medalCard,
                            backgroundColor: medalColors[index] || '#EEE',
                        }}
                        onClick={() => handleClick(item.category)}
                    >
                        <div style={styles.icon}>{categoryIcons[item.category] || '💰'}</div>
                        <div style={styles.categoryName}>{item.category}</div>
                        <div style={styles.amount}>${item.totalAmount.toFixed(2)}</div>
                        {activeDetail === item.category && (
                            <div style={styles.detail}>
                                <strong>Recent Records:</strong>
                                {getDetailRecords(item.category).map((rec, i) => (
                                    <div key={i} style={styles.detailItem}>
                                        📅 {rec.date} - 💵 ${rec.amount.toFixed(2)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavingRanking;
