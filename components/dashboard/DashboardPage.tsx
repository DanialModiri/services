import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import ChartCard from './ChartCard';
import BarChart from './charts/BarChart';
import DoughnutChart from './charts/DoughnutChart';
import LineChart from './charts/LineChart';

const DashboardPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t('dashboard.title')}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
            <ChartCard titleId="dashboard.chart.peopleByRole">
                <BarChart />
            </ChartCard>
        </div>

        <div>
            <ChartCard titleId="dashboard.chart.peopleByType">
                <DoughnutChart />
            </ChartCard>
        </div>
        
        <div className="lg:col-span-3">
             <ChartCard titleId="dashboard.chart.newCustomersTrend">
                <LineChart />
            </ChartCard>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;