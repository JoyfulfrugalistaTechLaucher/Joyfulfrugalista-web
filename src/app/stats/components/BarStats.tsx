'use client';
import React, { useMemo, useState, useReducer } from 'react';
import { Category, categories } from '@/data/Category';
import { SortKey } from '@/app/constants';
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

function BarChat({ records }: { records: SavingsRecord[] }) {
  const [timeRange, setTimeRange] = useState<TimeRange>('Today');

  // Create a category map for quick lookup
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, Category>);
  }, []);

  // Filter records based on the selected time range
  const filteredRecords = useMemo(() => {
    const now = DateTime.now();

    return records.filter(record => {
      const recordDate = DateTime.fromJSDate(new Date(record.date));

      switch (timeRange) {
        case 'Today':
          return recordDate.hasSame(now, 'day');
        case '1Week':
          return recordDate >= now.minus({ weeks: 1 });
        case '1Month':
          return recordDate >= now.minus({ months: 1 });
        case '1Year':
          return recordDate >= now.minus({ years: 1 });
        default:
          return false;
      }
    });
  }, [records, timeRange]);

  // Prepare chart data based on the selected time range
  const chartData = useMemo(() => {
    // For "Today" view: aggregate by category
    if (timeRange === 'Today') {
      const categoryTotals: Record<string, number> = {};

      filteredRecords.forEach(record => {
        if (!categoryTotals[record.category]) {
          categoryTotals[record.category] = 0;
        }
        categoryTotals[record.category] += record.moneyAdded;
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
    let dateFormat = '';
    let timeUnit: 'day' | 'month' = 'day';

    if (timeRange === '1Week') {
      dateFormat = 'EEE';
      timeUnit = 'day';
      // Generate last 7 days
      labels = Array.from({ length: 7 }, (_, i) => {
        return DateTime.now().minus({ days: 6 - i }).toFormat(dateFormat);
      });
    } else if (timeRange === '1Month') {
      dateFormat = 'LLL dd';
      timeUnit = 'day';
      // Generate last 30 days
      labels = Array.from({ length: 30 }, (_, i) => {
        return DateTime.now().minus({ days: 29 - i }).toFormat(dateFormat);
      });
    } else if (timeRange === '1Year') {
      dateFormat = 'LLL';
      timeUnit = 'month';
      // Generate last 12 months
      labels = Array.from({ length: 12 }, (_, i) => {
        return DateTime.now().minus({ months: 11 - i }).toFormat(dateFormat);
      });
    }

    // Group records by date and category
    const groupedData: Record<string, Record<string, number>> = {};
    const uniqueCategories = new Set<string>();

    filteredRecords.forEach(record => {
      const recordDate = DateTime.fromJSDate(new Date(record.date));
      const dateKey = timeUnit === 'day'
        ? recordDate.toFormat(dateFormat)
        : recordDate.toFormat('LLL'); // Month format

      if (!groupedData[dateKey]) {
        groupedData[dateKey] = {};
      }

      if (!groupedData[dateKey][record.category]) {
        groupedData[dateKey][record.category] = 0;
      }

      groupedData[dateKey][record.category] += record.moneyAdded;
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
  }, [filteredRecords, timeRange, categoryMap]);

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
      },
    },
    plugins: {
      title: {
        display: true,
        text: `Savings by ${timeRange === 'Today' ? 'Category' : 'Time Period'}`,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.raw}`;
          }
        }
      }
    },
  };

  // Handle time range change
  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4 flex justify-center space-x-4">
        {(['Today', '1Week', '1Month', '1Year'] as TimeRange[]).map(range => (
          <button
            key={range}
            onClick={() => handleRangeChange(range)}
            className={`px-3 py-1 rounded-md transition-colors ${
              timeRange === range
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="h-[400px]">
        {filteredRecords.length > 0 ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <p className="text-gray-500">No data available for the selected time range</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BarChat;
