import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useAuth } from '@/app/contexts/AuthContext';
import { ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartComponentProps {
    onClose: () => void;
    editMode?: boolean;
}

const categories = [
    'Housing', 'Household', 'Utilities', 'Transport', 'Leisure', 'Holidays', 'Wellbeing', 'Education', 'Grooming',
    'Gifts', 'Christmas', 'Insurance', 'Childcare', 'Food', 'Health', 'Appearance', 'Lifestyle', 'Treat yourself'
];

const categoryColorMap = {
    'Housing': '#FF6384', 'Household': '#36A2EB', 'Utilities': '#FFCE56', 'Transport': '#FF9F40',
    'Leisure': '#4BC0C0', 'Holidays': '#9966FF', 'Wellbeing': '#FF6384', 'Education': '#36A2EB',
    'Grooming': '#FFCE56', 'Gifts': '#FF9F40', 'Christmas': '#4BC0C0', 'Insurance': '#9966FF',
    'Childcare': '#FF6384', 'Food': '#36A2EB', 'Health': '#FFCE56', 'Appearance': '#FF9F40',
    'Lifestyle': '#4BC0C0', 'Treat yourself': '#9966FF'
};

const styles: { [key: string]: React.CSSProperties } = {
    pieChartContainer: {
        position: 'absolute',
        top: '30px',
        left: '50px',
        width: '400px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        zIndex: 1050,
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
        boxSizing: 'border-box'
    },
    header: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    selectContainer: {
        margin: '10px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    selectLabel: {
        margin: '0 10px',
        fontSize: '16px'
    },
    select: {
        padding: '8px 16px',
        margin: '0 10px'
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: 24,
        height: 24,
        cursor: 'pointer',
        zIndex: 1100
    }
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ onClose, editMode = false }) => {
    const { uid } = useAuth();
    const [rawData, setRawData] = useState<any>(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [chartData, setChartData] = useState<ChartData<'pie', number[], string>>({ datasets: [] });
    const pieRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: -80, y: 30 });

    const fetchData = async (userId: string) => {
        try {
            const apiUrl = `/api/savings/${userId}/monthlySummary`;
            const response = await axios.get(apiUrl);
            setRawData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (uid) {
            fetchData(uid);
        }
    }, [uid]);

    useEffect(() => {
        if (rawData && rawData.groupedByMonth) {
            const selectedMonth = `${year}-${String(month).padStart(2, '0')}`;
            const monthData = rawData.groupedByMonth[selectedMonth];

            if (monthData) {
                const labels = categories.filter((category) => monthData[category]);
                const values = labels.map((label) => monthData[label]);

                const backgroundColors = labels.map(label => categoryColorMap[label as keyof typeof categoryColorMap]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: backgroundColors,
                            hoverBackgroundColor: backgroundColors
                        }
                    ]
                });
            } else {
                setChartData({ datasets: [] });
            }
        }
    }, [rawData, year, month]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!editMode || !pieRef.current || !(e.target as HTMLElement).dataset.drag) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const initialLeft = pos.x;
        const initialTop = pos.y;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            setPos({
                x: initialLeft + deltaX,
                y: initialTop + deltaY
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
            ref={pieRef}
            onMouseDown={handleMouseDown}
            style={{
                ...styles.pieChartContainer,
                top: pos.y,
                left: pos.x,
                cursor: editMode ? 'move' : 'default'
            }}
        >
            {editMode && (
                <button style={styles.closeButton} onClick={(e)=>{ e.stopPropagation(); onClose(); }}>×</button>
            )}
            <div style={styles.header}>Pie Chart Summary</div>
            <div style={styles.selectContainer}>
                <label style={styles.selectLabel}>Year:</label>
                <select style={styles.select} value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                    {[2025, 2024, 2023, 2022].map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <label style={styles.selectLabel}>Month:</label>
                <select style={styles.select} value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((name, index) => (
                        <option key={index + 1} value={index + 1}>{name}</option>
                    ))}
                </select>

            </div>

            {chartData.labels ? <Pie data={chartData} /> : <p>No data available for the selected month</p>}
        </div>
    );
};

export default PieChartComponent;
