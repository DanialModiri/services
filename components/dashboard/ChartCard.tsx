import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import Card from '../common/Card';

interface ChartCardProps {
  titleId: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ titleId, children }) => {
  const { t } = useI18n();
  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t(titleId)}</h2>
      <div className="flex-grow">
        {children}
      </div>
    </Card>
  );
};

export default ChartCard;
