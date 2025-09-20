import React from 'react';
import { useI18n } from '../../../hooks/useI18n';
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
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart: React.FC = () => {
  const { t } = useI18n();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
          display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            family: 'Vazirmatn',
          },
        },
      },
      y: {
        ticks: {
          font: {
            family: 'Vazirmatn',
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.3, 
      },
    },
  };

  const labels = [1, 2, 3, 4, 5, 6].map(month => t(`datepicker.month.${month}`));

  const data = {
    labels,
    datasets: [
      {
        label: t('dashboard.chart.tooltip.newCustomers'),
        data: [5, 8, 6, 10, 7, 12],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        fill: true,
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default LineChart;