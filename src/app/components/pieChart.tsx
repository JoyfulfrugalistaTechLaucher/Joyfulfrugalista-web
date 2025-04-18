import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';  // Use axios to request the API
import { useAuth } from '../contexts/AuthContext';
import { ChartData } from 'chart.js';

// Elements and plugins required to register Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);
interface PieChartComponentProps {
  onClose: () => void;
}

const categories = [
  'Housing', 'Household', 'Utilities', 'Transport', 'Leisure', 'Holidays', 'Wellbeing', 'Education', 'Grooming',
  'Gifts', 'Christmas', 'Insurance', 'Childcare', 'Food', 'Health', 'Appearance', 'Lifestyle', 'Treat yourself'
];

type MonthlyData = {
  userId: string;
  groupedByMonth: {
    [month: string]: {
      [category: string]: number;
    };
  };
}


// Create a mapping of types and colors to ensure that colors also correspond to types one to one
const categoryColorMap = {
  'Housing': '#FF6384',
  'Household': '#36A2EB',
  'Utilities': '#FFCE56',
  'Transport': '#FF9F40',
  'Leisure': '#4BC0C0',
  'Holidays': '#9966FF',
  'Wellbeing': '#FF6384',
  'Education': '#36A2EB',
  'Grooming': '#FFCE56',
  'Gifts': '#FF9F40',
  'Christmas': '#4BC0C0',
  'Insurance': '#9966FF',
  'Childcare': '#FF6384',
  'Food': '#36A2EB',
  'Health': '#FFCE56',
  'Appearance': '#FF9F40',
  'Lifestyle': '#4BC0C0',
  'Treat yourself': '#9966FF'
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
  const [rawData, setRawData] = useState<MonthlyData | null>(null);
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
