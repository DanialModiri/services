import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Contract, ContractStatus, Person, ServiceArea } from '../../types';
import { EditIcon, DeleteIcon } from '../icons/AppleIcons';
import Pagination from '../admin/Pagination';

const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
};

const statusColors: { [key in ContractStatus]: { bg: string; text: string; ring: string } } = {
    'REGISTERED': { bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-300' },
    'CONFIRMED': { bg: 'bg-blue-100', text: 'text-blue-800', ring: 'ring-blue-300' },
    'IN_PROGRESS': { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-300' },
    'FINISHED': { bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-300' },
    'PENDING_FINISH': { bg: 'bg-orange-100', text: 'text-orange-800', ring: 'ring-orange-300' },
    'CLOSED': { bg: 'bg-slate-100', text: 'text-slate-800', ring: 'ring-slate-300' },
};

const areaColors: { [key in ServiceArea]: string } = {
    'ACCOUNTING': 'bg-blue-100 text-blue-800',
    'TAX': 'bg-red-100 text-red-800',
    'REGISTRATION': 'bg-purple-100 text-purple-800',
    'TRAINING': 'bg-yellow-100 text-yellow-800',
};

const getCustomerName = (customerId: number, people: Person[]): string => {
    const customer = people.find(p => p.id === customerId);
    if (!customer) return 'ناشناس';
    return customer.personType === 'REAL' ? `${customer.firstName} ${customer.lastName}` : customer.name;
};

const TimeProgressBar: React.FC<{ startDate: string, endDate: string }> = ({ startDate, endDate }) => {
    const { t } = useI18n();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    const totalDuration = Math.max(1, end - start);
    const elapsedDuration = Math.max(0, now - start);
    
    let progress = Math.min(100, (elapsedDuration / totalDuration) * 100);
    if (now > end) progress = 100;
    
    const remainingDays = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

    let bgColor = 'bg-blue-500';
    if (progress > 85) bgColor = 'bg-orange-500';
    if (progress >= 100) bgColor = 'bg-green-500';
    
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-semibold text-gray-700">{t('contractCard.duration')}</span>
                <span className="text-gray-500">{t('contractCard.remaining')}: <span className="font-bold text-gray-700">{remainingDays}</span> {t('contractCard.days')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${bgColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};


interface ContractCardProps {
  contract: Contract;
  customerName: string;
  onEdit: () => void;
  onDelete: () => void;
}
const ContractCard: React.FC<ContractCardProps> = ({ contract, customerName, onEdit, onDelete }) => {
  const { t } = useI18n();
  const editAriaLabel = t('contractCard.editAriaLabel', { title: contract.title });
  const deleteAriaLabel = t('contractCard.deleteAriaLabel', { title: contract.title });
  const statusStyle = statusColors[contract.status];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-lg rounded-3xl p-5 transition-all duration-300 flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow min-w-0">
          <h3 className="text-xl font-bold text-gray-900 truncate" title={contract.title}>{contract.title}</h3>
          <p className="text-sm text-gray-500 font-mono">{contract.contractCode}</p>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button onClick={onEdit} className="p-2.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200" aria-label={editAriaLabel}><EditIcon /></button>
          <button onClick={onDelete} className="p-2.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-all duration-200" aria-label={deleteAriaLabel}><DeleteIcon /></button>
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div className="flex justify-between items-center text-base">
            <span className="text-gray-500">{t('contractCard.customer')}:</span>
            <span className="font-semibold text-gray-800 truncate">{customerName}</span>
        </div>
         <div className="flex justify-between items-center text-base">
            <span className="text-gray-500">{t('contractCard.amount')}:</span>
            <span className="font-semibold text-gray-800">{formatPrice(contract.totalAmount)} <span className="text-xs">{t('serviceCard.currency')}</span></span>
        </div>
        <div>
            <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${areaColors[contract.serviceArea]}`}>
              {t(`enum.serviceArea.${contract.serviceArea}`)}
            </span>
        </div>
        <TimeProgressBar startDate={contract.startDate} endDate={contract.endDate} />
      </div>

      <div className="border-t border-gray-200/80 pt-3 mt-4 flex justify-end">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}>
            {t(`enum.contractStatus.${contract.status}`)}
          </span>
      </div>
    </div>
  );
};


interface ContractListProps {
  contracts: Contract[];
  people: Person[];
  onEdit: (contract: Contract) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}
const ContractTable: React.FC<ContractListProps> = ({ contracts, people, onEdit, onDelete, currentPage, totalPages, onPageChange, totalItems }) => {
  const { t } = useI18n();
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {contracts.length > 0 ? (
          contracts.map(contract => (
            <ContractCard 
              key={contract.id} 
              contract={contract}
              customerName={getCustomerName(contract.customerId, people)}
              onEdit={() => onEdit(contract)}
              onDelete={() => onDelete(contract.id)}
            />
          ))
        ) : (
          <div className="text-center p-10 bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg col-span-full">
              <p className="text-gray-500">{t('contractsPanel.notFound')}</p>
          </div>
        )}
      </div>
      {totalItems > 0 && totalPages > 1 && (
         <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default ContractTable;