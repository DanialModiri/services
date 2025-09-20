import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons/AppleIcons';

// --- Jalali Calendar Utilities ---
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
};

const toGregorian = (jy: number, jm: number, jd: number): [number, number, number] => {
    let gy = (jy <= 979) ? 621 : 1600;
    jy -= (jy <= 979) ? 0 : 979;
    let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
    gy += 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) {
        gy += 100 * Math.floor(--days / 36524);
        days %= 36524;
        if (days >= 365) days++;
    }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        gy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    let gd = days + 1;
    const sal_a = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm;
    for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
    return [gy, gm, gd];
};

const isJalaliLeap = (jy: number): boolean => (((((jy - 474) % 2820) + 474) + 38) * 682) % 2816 < 682;
const jalaliMonthLength = (jy: number, jm: number): number => {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    if (isJalaliLeap(jy)) return 30;
    return 29;
};
// --- End of Jalali Calendar Utilities ---

interface CustomDatePickerProps {
  labelId: string;
  value: string | undefined; // Gregorian YYYY-MM-DD
  onChange: (value: string) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ labelId, value, onChange }) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const todayG = new Date();
  const [todayJ, todayJMonth] = toJalali(todayG.getFullYear(), todayG.getMonth() + 1, todayG.getDate());
  const [viewDate, setViewDate] = useState({ year: todayJ, month: todayJMonth }); // Jalali year and month (1-based)
  const [inputValue, setInputValue] = useState('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
        try {
            const [gy, gm, gd] = value.split('-').map(Number);
            const [jy, jm, jd] = toJalali(gy, gm, gd);
            setInputValue(`${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`);
        } catch {
            setInputValue(value); // Fallback on error
        }
    } else {
        setInputValue('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
        if(value){
            const [gy, gm, gd] = value.split('-').map(Number);
            const [jy, jm] = toJalali(gy, gm, gd);
            setViewDate({ year: jy, month: jm });
        } else {
            const todayG = new Date();
            const [jy, jm] = toJalali(todayG.getFullYear(), todayG.getMonth() + 1, todayG.getDate());
            setViewDate({ year: jy, month: jm });
        }
    }
  }, [isOpen, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^0-9]/g, '');
    let formatted = '';
    if (input.length > 0) formatted = input.substring(0, 4);
    if (input.length > 4) formatted += '/' + input.substring(4, 6);
    if (input.length > 6) formatted += '/' + input.substring(6, 8);
    setInputValue(formatted);
    if (formatted.length === 10) {
      const [jy, jm, jd] = formatted.split('/').map(Number);
      if (jy > 1000 && jm > 0 && jm <= 12 && jd > 0 && jd <= jalaliMonthLength(jy, jm)) {
        const [gy, gm, gd] = toGregorian(jy, jm, jd);
        onChange(`${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`);
      }
    }
  };
  
  const handleDateSelect = (day: number) => {
    const [gy, gm, gd] = toGregorian(viewDate.year, viewDate.month, day);
    onChange(`${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`);
    setIsOpen(false);
  };
  
  const renderCalendar = () => {
    const { year, month } = viewDate;
    const daysInMonth = jalaliMonthLength(year, month);
    const [gy, gm, gd] = toGregorian(year, month, 1);
    const firstDayOfWeek = new Date(gy, gm - 1, gd).getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const blanks = Array((firstDayOfWeek + 1) % 7).fill(null); // Shanbe = 0
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const selectedJ = value ? toJalali(...value.split('-').map(Number) as [number, number, number]) : null;
    const weekdays = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    return (
      <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-2xl p-4 border border-gray-200 animate-fade-in-down">
        <div className="flex justify-between items-center mb-3">
          <button type="button" onClick={() => setViewDate(d => ({...d, year: d.year - 1}))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5"/></button>
          <div className="font-semibold text-base">{year}</div>
          <button type="button" onClick={() => setViewDate(d => ({...d, year: d.year + 1}))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5"/></button>
        </div>
        <div className="flex justify-between items-center mb-3">
          <button type="button" onClick={() => setViewDate(d => ({ year: d.month === 1 ? d.year-1 : d.year, month: d.month === 1 ? 12 : d.month-1}))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon className="w-5 h-5"/></button>
          <div className="font-semibold text-base">{t(`datepicker.month.${month}`)}</div>
          <button type="button" onClick={() => setViewDate(d => ({ year: d.month === 12 ? d.year+1 : d.year, month: d.month === 12 ? 1 : d.month+1}))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon className="w-5 h-5"/></button>
        </div>
        <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
            {weekdays.map(day => <div key={day}>{t(`datepicker.weekday.${day}`)}</div>)}
        </div>
        <div className="grid grid-cols-7 text-center text-base">
            {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
            {days.map(day => {
                const isSelected = selectedJ && selectedJ[0] === year && selectedJ[1] === month && selectedJ[2] === day;
                return (<div key={day} className="py-1">
                    <button
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`w-8 h-8 rounded-full transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                    >{day}</button>
                </div>);
            })}
        </div>
      </div>
    );
  };

  return (
    <div ref={datePickerRef}>
        <label className="block text-base font-medium text-gray-700 mb-1.5">{t(labelId)}</label>
        <div className="relative">
            <input
                type="text"
                className="w-full pr-4 pl-12 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors text-left text-base"
                placeholder="____/__/__"
                value={inputValue}
                onChange={handleInputChange}
                maxLength={10}
                dir="ltr"
            />
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
                aria-label={t('datepicker.openCalendarAriaLabel')}
            >
                <CalendarIcon className="w-5 h-5 text-gray-400 hover:text-blue-600" />
            </button>
            {isOpen && renderCalendar()}
        </div>
         <style>{`
            @keyframes fade-in-down {
                0% { opacity: 0; transform: translateY(-10px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down { animation: fade-in-down 0.2s ease-out; }
        `}</style>
    </div>
  );
};

export default CustomDatePicker;