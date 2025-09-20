import React, { useState } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { Person } from '../../types';
import { EditIcon, DeleteIcon, RealPersonIcon, LegalPersonIcon, ChevronDownIcon, EmailIcon, PhoneIcon, BuildingIcon } from '../icons/AppleIcons';
import Pagination from './Pagination';

// Helper function to convert Gregorian YYYY-MM-DD to Jalali YYYY/MM/DD for display
const toJalali = (gy: number, gm: number, gd: number): [number, number, number] => {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    gy -= (gy <= 1600) ? 621 : 1600;
    const gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return [jy, jm, jd];
}

const toJalaliDisplay = (gregorianDate?: string): string | undefined => {
    if (!gregorianDate || gregorianDate.split('-').length < 3) return undefined;
    try {
        const [gy, gm, gd] = gregorianDate.split('-').map(Number);
        if(isNaN(gy) || isNaN(gm) || isNaN(gd)) return gregorianDate;
        const [jy, jm, jd] = toJalali(gy, gm, gd);
        return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
    } catch(e) {
        return gregorianDate; // Fallback to original on error
    }
};

interface PersonListProps {
  people: Person[];
  onEdit: (person: Person) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

const PersonCard: React.FC<{ person: Person; isExpanded: boolean; onToggle: () => void; onEdit: () => void; onDelete: () => void; }> = ({ person, isExpanded, onToggle, onEdit, onDelete }) => {
  const { t } = useI18n();
  
  const typeStyles = {
    'REAL': {
      icon: <RealPersonIcon />,
      bgColor: 'bg-green-500',
      name: `${person.personType === 'REAL' ? person.firstName : ''} ${person.personType === 'REAL' ? person.lastName : ''}`
    },
    'LEGAL': {
      icon: <LegalPersonIcon />,
      bgColor: 'bg-blue-500',
      name: `${person.personType === 'LEGAL' ? person.name : ''}`
    }
  };

  const styles = typeStyles[person.personType];
  const hasDetails = person.email || person.mobile || person.landline;

  const DetailItem: React.FC<{ icon: React.ReactNode, labelId: string; value?: string }> = ({ icon, labelId, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start text-base py-1 group">
            <span className="text-gray-400 mt-1">{icon}</span>
            <div className="flex flex-col mr-3">
                <dt className="text-gray-500 text-sm">{t(labelId)}</dt>
                <dd className="text-gray-800 font-medium text-base text-left dir-ltr group-hover:text-blue-600 transition-colors">{value}</dd>
            </div>
        </div>
    );
  };
  
  const InfoRow: React.FC<{ labelId: string; value?: string; mono?: boolean }> = ({ labelId, value, mono = false }) => {
    if (!value) return null;
    return (
        <div className="grid grid-cols-[auto,1fr] gap-x-2">
            <dt className="text-gray-500">{t(labelId)}:</dt>
            <dd className={`text-gray-800 text-left ${mono ? 'tabular-nums' : ''}`}>{value}</dd>
        </div>
    );
  }

  const editAriaLabel = t('personCard.editAriaLabel', { name: styles.name });
  const deleteAriaLabel = t('personCard.deleteAriaLabel', { name: styles.name });
  const personTypeLabel = t(`enum.personType.${person.personType}`);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-lg rounded-3xl p-5 transition-all duration-300 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between space-x-4 space-x-reverse">
        <div className="flex items-start space-x-4 space-x-reverse flex-grow min-w-0">
          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center ${styles.bgColor} shadow-md`}>
            {styles.icon}
          </div>
          <div className="flex-grow min-w-0 pt-1">
            <p className="text-2xl font-bold text-gray-900 truncate">{styles.name}</p>
            <p className="text-base text-gray-500">{personTypeLabel}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button onClick={onEdit} className="p-2.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-200" aria-label={editAriaLabel}><EditIcon /></button>
          <button onClick={onDelete} className="p-2.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-all duration-200" aria-label={deleteAriaLabel}><DeleteIcon /></button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-base border-t border-gray-200/80 pt-4">
        <InfoRow labelId="personCard.nationalId" value={person.nationalId} mono />
        <InfoRow labelId="personCard.orgRole" value={t(`enum.orgRole.${person.organizationRole}`)} />
        {person.personType === 'REAL' && <InfoRow labelId="personCard.birthDate" value={toJalaliDisplay(person.birthDate)} mono />}
        {person.personType === 'LEGAL' && <InfoRow labelId="personCard.regDate" value={toJalaliDisplay(person.registrationDate)} mono />}
      </div>

       {/* Accordion for Contact Info */}
       <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'mt-4' : ''}`}>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
            <div className="border-t border-gray-200/80 pt-3">
                <dl className="space-y-1">
                    <DetailItem icon={<EmailIcon className="w-4 h-4" />} labelId="personCard.email" value={person.email} />
                    <DetailItem icon={<PhoneIcon className="w-4 h-4" />} labelId="personCard.mobile" value={person.mobile} />
                    <DetailItem icon={<BuildingIcon className="w-4 h-4" />} labelId="personCard.landline" value={person.landline} />
                </dl>
            </div>
        </div>
      </div>
      
      {hasDetails && (
        <div className="mt-auto pt-4 flex-grow flex items-end">
            <button onClick={onToggle} className="w-full flex justify-center items-center text-base text-gray-600 hover:text-blue-600 font-medium transition-colors group">
                <span className="group-hover:text-blue-500">
                    {isExpanded ? t('personCard.hideDetails') : t('personCard.showDetails')}
                </span>
                <ChevronDownIcon className={`w-5 h-5 mr-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
        </div>
      )}

    </div>
  );
};


const PersonList: React.FC<PersonListProps> = ({ people, onEdit, onDelete, currentPage, totalPages, onPageChange, totalItems }) => {
  const { t } = useI18n();
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {people.length > 0 ? (
          people.map(person => (
            <PersonCard 
              key={person.id} 
              person={person}
              isExpanded={expandedCardId === person.id}
              onToggle={() => handleToggle(person.id)}
              onEdit={() => onEdit(person)}
              onDelete={() => onDelete(person.id)}
            />
          ))
        ) : (
          <div className="text-center p-10 bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-2xl shadow-lg col-span-full">
              <p className="text-gray-500">{t('peoplePanel.notFound')}</p>
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

export default PersonList;