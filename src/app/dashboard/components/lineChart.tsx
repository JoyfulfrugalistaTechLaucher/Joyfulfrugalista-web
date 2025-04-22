import React, {useState, useEffect, useRef} from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';
import axios from 'axios';
import { useAuth } from '@/app/contexts/AuthContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineChartComponentProps {
    onClose: () => void;
    editMode?: boolean;
}

const styles: { [key: string]: React.CSSProperties } = {
    lineChartContainer: {
        position: 'absolute',
        top: '30px',
        right: '50px',
        width: '600px',
        height: '500px',
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
        boxSizing: 'border-box'
    },
    selectContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
    },
    selectLabel: {
        fontSize: '16px',
        marginRight: '10px',
    },
    select: {
        padding: '8px 16px',
        fontSize: '14px'
    },
    header: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
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

const LineChartComponent: React.FC <LineChartComponentProps> = ({ onClose, editMode = false }) => {
    const { uid } = useAuth();
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [chartData, setChartData] = useState<ChartData<'line', number[], string>>({
        labels: [],
        datasets: []
    });
    const lineRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 360, y: 30 });



    const fetchData = async (userId: string, selectedYear: number) => {
        try {
            const apiUrl = `/api/savings/${userId}/monthlySummary`;
            const response = await axios.get(apiUrl);
            const data = response.data.groupedByMonth;

            // Display 12 month data
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthsKeys = Array.from({ length: 12 }, (_, i) => `${selectedYear}-${String(i + 1).padStart(2, '0')}`);

            const totals = monthsKeys.map(monthKey => {
                const categories = data[monthKey];
                if (categories) {
                    return Object.values(categories).reduce((acc: number, curr: any) => acc + (curr || 0), 0);
                } else {
                    return 0;
                }
            });

            setChartData({
                labels: monthNames,
                datasets: [
                    {
                        label: `Total Saving per Month (${selectedYear})`,
                        data: totals,
                        borderColor: '#36A2EB',
                        backgroundColor: '#36A2EB88',
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5
                    }
                ]
            });




        } catch (error) {
            console.error("Error fetching line chart data:", error);
        }
    };

    useEffect(() => {
        if (uid) {
            fetchData(uid, year);
        }
    }, [uid, year]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!editMode || !lineRef.current) return;

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
        <div
            ref={lineRef}
            onMouseDown={handleMouseDown}
            style={{
                ...styles.lineChartContainer,
                top: pos.y,
                left: pos.x,
                cursor: editMode ? 'move' : 'default'
            }}
        >
            {editMode && (
                <button style={styles.closeButton} onClick={onClose}>×</button>
            )}
            <div style={styles.header}>Line Chart Summary</div>
            <div style={styles.selectContainer}>
                <label style={styles.selectLabel}>Year:</label>
                <select
                    style={styles.select}
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                >
                    {[2025, 2024, 2023, 2022].map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
            <Line
                data={chartData}
                options={{
                    scales: {
                        x: {
                            ticks: {
                                autoSkip: false,
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    }
                }}
            />
        </div>
    );
};

export default LineChartComponent;
