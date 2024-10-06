import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';  // Use axios to request the API
import { useAuth } from '../context/AuthContext';
import { ChartData } from 'chart.js';

// Elements and plugins required to register Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);
interface PieChartComponentProps {
    onClose: () => void;
}

const categories = [
    '住房', '家居', '生活缴费', '交通', '休闲', '假期', '身心健康', '教育', '个人护理',
    '礼物', '圣诞节', '保险', '托儿', '食品', '健康', '外貌', '生活方式', '犒劳自己'
];

const categoryColorMap = {
    '住房': '#FF6384',
    '家居': '#36A2EB',
    '生活缴费': '#FFCE56',
    '交通': '#FF9F40',
    '休闲': '#4BC0C0',
    '假期': '#9966FF',
    '身心健康': '#FF6384',
    '教育': '#36A2EB',
    '个人护理': '#FFCE56',
    '礼物': '#FF9F40',
    '圣诞节': '#4BC0C0',
    '保险': '#9966FF',
    '托儿': '#FF6384',
    '食品': '#36A2EB',
    '健康': '#FFCE56',
    '外貌': '#FF9F40',
    '生活方式': '#4BC0C0',
    '犒劳自己': '#9966FF'
};



const styles: { [key: string]: React.CSSProperties } = {
    pieChartContainer: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1050,
        borderRadius: '10px',
        padding: '20px',
        boxSizing: 'border-box'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1040,
        cursor: 'pointer'
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
    userIdDisplay: {
        marginBottom: '20px',
        fontSize: '14px',
        color: '#333',
    },
    rawDataDisplay: {
        marginTop: '20px',
        fontSize: '12px',
        color: '#333',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        maxHeight: '200px',
        overflowY: 'auto'
    }
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ onClose }) => {
    const { uid } = useAuth();
    const [rawData, setRawData] = useState<any>(null);  // Save the raw data
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [chartData, setChartData] = useState<ChartData<'pie', number[], string>>({ datasets: [] });

    const fetchData = async (userId: string) => {
        try {
            const apiUrl = `/api/savings/${userId}/monthlySummary`;
            const response = await axios.get(apiUrl);
            console.log('API Response:', response.data);
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

                // Use fixed color mapping
                const backgroundColors = labels.map(label => categoryColorMap[label as keyof typeof categoryColorMap]);

                setChartData({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: backgroundColors,  // Use a fixed color
                            hoverBackgroundColor: backgroundColors // Use the same color as the hover color
                        }
                    ]
                });
            } else {
                setChartData({ datasets: [] });
            }
        }
    }, [rawData, year, month]);

    return (
        <>
            <div style={styles.overlay} onClick={onClose} />
            <div style={styles.pieChartContainer}>
{/*                <div style={styles.userIdDisplay}>
                    Current User ID: {uid ? uid : 'No User ID'}
                </div>*/}

                <div style={styles.selectContainer}>
                    <label style={styles.selectLabel}>Year:</label>
                    <select
                        style={styles.select}
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    >
                        {[2024, 2023, 2022].map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                                {yearOption}
                            </option>
                        ))}
                    </select>

                    <label style={styles.selectLabel}>Month:</label>
                    <select
                        style={styles.select}
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((monthOption) => (
                            <option key={monthOption} value={monthOption}>
                                {monthOption}
                            </option>
                        ))}
                    </select>
                </div>

                {chartData.labels ? (
                    <Pie data={chartData} />
                ) : (
                    <p>No data available for the selected month</p>
                )}

{/*                <div style={styles.rawDataDisplay}>
                    <h3>Raw Data:</h3>
                    <pre>{JSON.stringify(rawData, null, 2)}</pre>
                </div>*/}
            </div>
        </>
    );
};

export default PieChartComponent;
