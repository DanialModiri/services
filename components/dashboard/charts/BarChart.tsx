import React from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { OrganizationRoles } from '../../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC = () => {
  const { t } = useI18n();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Vazirmatn',
          }
        }
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
          stepSize: 1
        },
      },
    },
  };

  const labels = [
    'CUSTOMER', 
    'CONSULTANT', 
    'BANK', 
    'SOCIAL_SECURITY_OFFICE', 
    'INVESTMENT_FUND'
  ].map(role => t(`enum.orgRole.${role}`));

  const data = {
    labels,
    datasets: [
      {
        label: t('dashboard.chart.tooltip.personCount'),
        data: [4, 2, 1, 1, 1],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

export default BarChart;