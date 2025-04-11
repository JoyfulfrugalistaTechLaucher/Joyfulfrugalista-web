'use client';
import React, { useState, useMemo } from 'react';
import { Category, categories } from '@/data/Category';
import { SavingsRecord } from '@/app/interface';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DateTime } from 'luxon';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { formatCurrency } from '@/app/utils';
import { useTheme, useMediaQuery } from '@mui/material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = 'Today' | '1Week' | '1Month' | '1Year';

function BarStats({ records }: { records: SavingsRecord[] }) {
  const currentYear = DateTime.now().year;
  const [timeRange, setTimeRange] = useState<TimeRange>('Today');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

  // Generate year options
  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    // Add current year by default
    years.add(currentYear);

    // Add years from records
    records.forEach(record => {
      const recordDate = record.date instanceof Date
        ? DateTime.fromJSDate(record.date)
        : DateTime.fromISO(record.date.toString());

      if (recordDate.isValid) {
        years.add(recordDate.year);
      }
    });

    return Array.from(years).sort((a, b) => b - a); // Sort descending
  }, [records, currentYear]);

  // Create a category map for quick lookup
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, Category>);
  }, []);

  // Filter records based on the selected time range and year
  const filteredRecords = useMemo(() => {
    const now = DateTime.now();

    return records.filter(record => {
      // Skip records with invalid data
      if (!record.date || record.saved < 0) {
        return false;
      }

      const recordDate = record.date instanceof Date
        ? DateTime.fromJSDate(record.date)
        : DateTime.fromISO(record.date.toString());

      if (!recordDate.isValid) {
        return false;
      }

      // Filter by selected year first (except for Today which can cross year boundary)
      if (timeRange !== 'Today' && recordDate.year !== selectedYear) {
        return false;
      }

      // Then filter by time range
      switch (timeRange) {
        case 'Today':
          return recordDate.hasSame(now, 'day') && recordDate.year === selectedYear;
        case '1Week': {
          const startOfWeek = DateTime.now().startOf('week').set({ year: selectedYear });
          const endOfWeek = startOfWeek.plus({ days: 6 });
          return recordDate >= startOfWeek && recordDate <= endOfWeek;
        }
        case '1Month': {
          // Show full month for the current date
          const monthToShow = now.month;
          return recordDate.year === selectedYear && recordDate.month === monthToShow;
        }
        case '1Year':
          return recordDate.year === selectedYear;
        default:
          return false;
      }
    });
  }, [records, timeRange, selectedYear]);

  // Prepare chart data based on the selected time range
  const chartData = useMemo(() => {
    // For "Today" view: aggregate by category
    if (timeRange === 'Today') {
      const categoryTotals: Record<string, number> = {};

      filteredRecords.forEach(record => {
        if (!categoryTotals[record.category]) {
          categoryTotals[record.category] = 0;
        }
        categoryTotals[record.category] += record.saved;
      });

      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);
      const backgroundColor = labels.map(
        catId => categoryMap[catId]?.color || '#CCCCCC'
      );

      return {
        labels,
        datasets: [{
          label: 'Amount Saved',
          data,
          backgroundColor,
        }]
      };
    }

    // For other views: aggregate by time period and category
    let labels: string[] = [];

    if (timeRange === '1Week') {
      // Generate week days (Monday to Sunday)
      const startOfWeek = DateTime.now().startOf('week').set({ year: selectedYear });
      labels = Array.from({ length: 7 }, (_, i) => {
        return startOfWeek.plus({ days: i }).toFormat('EEE');
      });
    } else if (timeRange === '1Month') {
      // Generate days of the current month
      const now = DateTime.now();
      const daysInMonth = DateTime.local(selectedYear, now.month).daysInMonth || 30;

      labels = Array.from({ length: daysInMonth }, (_, i) => {
        return DateTime.local(selectedYear, now.month, i + 1).toFormat('d');
      });
    } else if (timeRange === '1Year') {
      // Generate months of the year
      labels = Array.from({ length: 12 }, (_, i) => {
        return DateTime.local(selectedYear, i + 1).toFormat('LLL');
      });
    }

    // Group records by date and category
    const groupedData: Record<string, Record<string, number>> = {};
    const uniqueCategories = new Set<string>();

    filteredRecords.forEach(record => {
      const recordDate = record.date instanceof Date
        ? DateTime.fromJSDate(record.date)
        : DateTime.fromISO(record.date.toString());

      let dateKey: string;

      if (timeRange === '1Week') {
        dateKey = recordDate.toFormat('EEE');
      } else if (timeRange === '1Month') {
        dateKey = recordDate.toFormat('d');
      } else { // 1Year
        dateKey = recordDate.toFormat('LLL');
      }

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {};
      }

      if (!groupedData[dateKey][record.category]) {
        groupedData[dateKey][record.category] = 0;
      }

      groupedData[dateKey][record.category] += record.saved;
      uniqueCategories.add(record.category);
    });

    // Create datasets (one for each category)
    const datasets = Array.from(uniqueCategories).map(categoryId => {
      const categoryColor = categoryMap[categoryId]?.color || '#CCCCCC';

      return {
        label: categoryId,
        data: labels.map(label => groupedData[label]?.[categoryId] || 0),
        backgroundColor: categoryColor,
      };
    });

    return { labels, datasets };
  }, [filteredRecords, timeRange, categoryMap, selectedYear]);

  // Handle year change
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: timeRange !== 'Today',
      },
      y: {
        stacked: timeRange !== 'Today',
        beginAtZero: true,
        ticks: {
          callback: function(value: number) {
            return formatCurrency(value);
          }
        }
      },
    },
    plugins: {
      title: {
        display: true,
        text: `${selectedYear} ${timeRange === 'Today' ? 'Today' : ''} Savings by ${timeRange === 'Today' ? 'Category' : 'Time Period'}`,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
  };

  return (
    <div className="w-full p-2">
      <div className="mb-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex space-x-2 md:space-x-4">
          {(['Today', '1Week', '1Month', '1Year'] as TimeRange[]).map(range => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              variant={timeRange === range ? "contained" : "outlined"}
              size="small"
            >
             {isSmallScreen
               ? range === 'Today'
                 ? '1D'
                 : range === '1Week'
                   ? '1W'
                   : range === '1Month'
                     ? '1M'
                     : '1Y'
               : range
             }
            </Button>
          ))}
        </div>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            label="Year"
            onChange={handleYearChange}
          >
            {yearOptions.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="h-[400px]">
        {filteredRecords.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
             No data available for {
               timeRange === 'Today' ? 'today' : `${timeRange} in ${selectedYear}`
             }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BarStats;
