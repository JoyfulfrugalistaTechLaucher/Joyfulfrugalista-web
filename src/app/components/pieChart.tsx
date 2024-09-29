import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartComponentProps {
    onClose: () => void;  // Properly type the onClose prop
}

const styles = {
    pieChartContainer: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: "url('/assets/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1050, // High enough to be on top of other items
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        zIndex: 1040, // Below the pie chart container
        cursor: 'pointer' // Indicates clickable
    },
    chartHeader: {
        marginBottom: '20px'
    }
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({ onClose }) => {
    const data = {
        labels: ['Housing', 'Household', 'Utilities', 'Transport', 'Leisure', 'Holidays', 'Wellbeing', 'Education', 'Grooming', 'Gifts', 'Christmas', 'Insurance', 'Childcare', 'Food', 'Health', 'Appearance', 'Lifestyle', 'Treat yourself'],
        datasets: [{
            data: [5, 10, 5, 5, 5, 56, 5, 5, 5, 5, 5, 34, 5, 5, 5, 51, 5, 5],
            backgroundColor: [
                '#F1E0AC', '#F4D1AE', '#E6A57E', '#E39E85', '#E5B7A9',
                '#F0B9C8', '#EEA4A4', '#CEB1BE', '#B3A2C7', '#C1C1E0',
                '#9DAFDB', '#B8D8D8', '#8FB9A8', '#8EB08C', '#C7D59F',
                '#B4D2BA', '#D9EBCF', '#B2D7DB'
            ],
            hoverBackgroundColor: [
                '#F1E0AC', '#F4D1AE', '#E6A57E', '#E39E85', '#E5B7A9',
                '#F0B9C8', '#EEA4A4', '#CEB1BE', '#B3A2C7', '#C1C1E0',
                '#9DAFDB', '#B8D8D8', '#8FB9A8', '#8EB08C', '#C7D59F',
                '#B4D2BA', '#D9EBCF', '#B2D7DB'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                enabled: true
            }
        }
    };

    return (
        <>
            <div style={styles.overlay} onClick={onClose} />
            <div style={styles.pieChartContainer}>
                <h3 style={styles.chartHeader}>Weekly Pie Chart</h3>
                <Pie data={data} options={options} />
            </div>
        </>
    );
};

export default PieChartComponent;
