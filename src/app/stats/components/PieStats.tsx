'use client';
import React, { useState, useMemo } from 'react';
import { Category, categories } from '@/data/Category';
import { SavingsRecord } from '@/app/interface';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { DateTime } from 'luxon';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { formatCurrency } from '@/app/utils';
import { TimeRange } from '@/app/constants';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

type SummaryBoxProps = {
  timeRange: TimeRange;
  selectedYear: number;
  totalAmount: number;
  categoryData: {
    id: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  comparison?: { amount: number; percentage: number };
}

// Summary Box Component
function SummaryBox({
  timeRange,
  selectedYear,
  totalAmount,
  categoryData,
  comparison
}: SummaryBoxProps ) {
  const now = DateTime.now();

  // Format date information based on time range
  const timeInfo = useMemo(() => {
    if (timeRange === 'Today') {
      return now.toFormat('MMMM d, yyyy');
    } else if (timeRange === '1Week') {
      const startOfWeek = now.startOf('week').set({ year: selectedYear });
      const endOfWeek = startOfWeek.plus({ days: 6 });
      return `${startOfWeek.toFormat('MMM d')} - ${endOfWeek.toFormat('MMM d, yyyy')}`;
    } else if (timeRange === '1Month') {
      return now.set({ year: selectedYear }).toFormat('MMMM yyyy');
    } else {
      return `${selectedYear}`;
    }
  }, [timeRange, selectedYear, now]);

  // Get top 3 categories
  const topCategories = useMemo(() => {
    return [...categoryData]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [categoryData]);

  return (
    <div className="w-full h-full p-4">
      <div>
        <h2 className="text-xl text-center font-semibold my-2">Summary</h2>
        <p className="text-sm text-center my-3">
          {timeInfo}
        </p>
        <p className="text-3xl text-primary text-center font-bold my-4">
          {formatCurrency(totalAmount)}
        </p>

        {topCategories.length > 0 ? (
          <>
           <p className="text-sm font-medium mb-2">Top Categories:</p>

            {topCategories.map(category => (
             <div key={category.id} className="flex justify-between mb-1 text-sm">
               <div className="flex items-center justify-start">
                 <div
                   className="w-3 h-3 rounded-full mr-2"
                   style={{ backgroundColor: category.color }}
                 />
                 <span>{category.id}</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-left">{formatCurrency(category.amount)}</span>
                 <span className="text-gray-500">
                   {Math.round(category.percentage)}%
                 </span>
               </div>
             </div>
            ))}
          </>
        ) : (
          <Typography
            align="center"
            color="text.secondary"
          >No data available</Typography>
        )}
      </div>
    </div>
  );
};

function PieStats({ records }: { records: SavingsRecord[] }) {
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

  // Calculate previous period comparison
  const comparisonData = useMemo(() => {
    if (filteredRecords.length === 0) return undefined;

    const now = DateTime.now();
    let previousPeriodRecords: SavingsRecord[] = [];

    // Define previous period based on current time range
    switch (timeRange) {
      case 'Today': {
        // Yesterday
        const yesterday = now.minus({ days: 1 });
        previousPeriodRecords = records.filter(record => {
          const recordDate = record.date instanceof Date
            ? DateTime.fromJSDate(record.date)
            : DateTime.fromISO(record.date.toString());
          return recordDate.hasSame(yesterday, 'day');
        });
        break;
      }
      case '1Week': {
        // Previous week
        const startOfPrevWeek = now.startOf('week').minus({ weeks: 1 });
        const endOfPrevWeek = startOfPrevWeek.plus({ days: 6 });
        previousPeriodRecords = records.filter(record => {
          const recordDate = record.date instanceof Date
            ? DateTime.fromJSDate(record.date)
            : DateTime.fromISO(record.date.toString());
          return recordDate >= startOfPrevWeek && recordDate <= endOfPrevWeek;
        });
        break;
      }
      case '1Month': {
        // Previous month
        const prevMonth = now.minus({ months: 1 });
        previousPeriodRecords = records.filter(record => {
          const recordDate = record.date instanceof Date
            ? DateTime.fromJSDate(record.date)
            : DateTime.fromISO(record.date.toString());
          return recordDate.year === prevMonth.year && recordDate.month === prevMonth.month;
        });
        break;
      }
      case '1Year': {
        // Previous year
        const prevYear = selectedYear - 1;
        previousPeriodRecords = records.filter(record => {
          const recordDate = record.date instanceof Date
            ? DateTime.fromJSDate(record.date)
            : DateTime.fromISO(record.date.toString());
          return recordDate.year === prevYear;
        });
        break;
      }
    }

    // Calculate totals
    const currentTotal = filteredRecords.reduce((sum, record) => sum + record.saved, 0);
    const previousTotal = previousPeriodRecords.reduce((sum, record) => sum + record.saved, 0);

    // Calculate percentage change
    let percentageChange = 0;
    if (previousTotal > 0) {
      percentageChange = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
    }

    return {
      amount: previousTotal,
      percentage: percentageChange
    };
  }, [filteredRecords, records, timeRange, selectedYear]);

  // Prepare pie chart data
  const { chartData, categoryData, totalAmount } = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    let total = 0;

    // Aggregate totals by category
    filteredRecords.forEach(record => {
      if (!categoryTotals[record.category]) {
        categoryTotals[record.category] = 0;
      }
      categoryTotals[record.category] += record.saved;
      total += record.saved;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const backgroundColor = labels.map(
      catId => categoryMap[catId]?.color || '#CCCCCC'
    );

    // Create detailed category data for summary box
    const catData = labels.map((id, index) => ({
      id,
      amount: data[index],
      percentage: total > 0 ? (data[index] / total * 100) : 0,
      color: backgroundColor[index]
    }));

    return {
      chartData: {
        labels,
        datasets: [{
          data,
          backgroundColor,
          borderWidth: 1,
        }]
      },
      categoryData: catData,
      totalAmount: total
    };
  }, [filteredRecords, categoryMap]);

  // Handle year change
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(Number(event.target.value));
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="w-full p-2 mb-6">
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
          <InputLabel id="pie-year-select-label">Year</InputLabel>
          <Select
            labelId="pie-year-select-label"
            id="pie-year-select"
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

      <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} gap-4 ${isSmallScreen ? '' : 'h-[400px]'}`}>
        {isSmallScreen && (
          <div className="mb-4">
            <SummaryBox
              timeRange={timeRange}
              selectedYear={selectedYear}
              totalAmount={totalAmount}
              categoryData={categoryData}
              comparison={comparisonData}
            />
          </div>
        )}

        <div className={isSmallScreen ? "h-[300px]" : "h-full w-1/2"}>
          {filteredRecords.length > 0 ? (
            <Pie data={chartData} options={options} />
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

        {!isSmallScreen && (
          <div className="h-full w-1/2">
            <SummaryBox
              timeRange={timeRange}
              selectedYear={selectedYear}
              totalAmount={totalAmount}
              categoryData={categoryData}
              comparison={comparisonData}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PieStats;
