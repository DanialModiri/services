import React from 'react';
import { useI18n } from '../../../hooks/useI18n';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC = () => {
    const { t } = useI18n();
    
    const data = {
      labels: [
        t('dashboard.chart.label.realPerson'), 
        t('dashboard.chart.label.legalPerson')
      ],
      datasets: [
        {
          label: t('dashboard.chart.tooltip.count'),
          data: [5, 5],
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(59, 130, 246, 0.7)',
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            font: {
              family: 'Vazirmatn',
              size: 14,
            },
          },
        },
      },
    };

    return <Doughnut data={data} options={options} />;
}

export default DoughnutChart;