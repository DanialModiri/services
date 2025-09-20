import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../hooks/useI18n';
import { ChevronDownIcon, CheckIcon } from '../icons/AppleIcons';
import { FieldError } from 'react-hook-form';

interface CustomSelectProps {
  label?: string;
  options: readonly (string | { label: string; value: string })[];
  value: string | undefined;
  onChange: (value: string) => void;
  error?: FieldError;
  placeholder?: string;
  buttonClassName?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, options, value, onChange, error, placeholder, buttonClassName }) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ top: -9999, left: 0, width: 0, transformOrigin: 'top center' });

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const listElement = listRef.current;
      const listHeight = listElement ? Math.min(listElement.scrollHeight, 240) : 240;
      const margin = 4;
      const minDropdownWidth = 200; 

      let newTop;
      let newTransformOrigin = 'top center';

      if (rect.bottom + listHeight + margin > window.innerHeight && rect.top - listHeight - margin > 0) {
        newTop = rect.top - listHeight - margin;
        newTransformOrigin = 'bottom center';
      } else {
        newTop = rect.bottom + margin;
      }

      setPosition({
        top: newTop,
        left: rect.left,
        width: Math.max(rect.width, minDropdownWidth),
        transformOrigin: newTransformOrigin,
      });
    }
  }, []); 

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
        listRef.current && !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, updatePosition]);

  const getOptionValue = (option: typeof options[number]): string => {
    return typeof option === 'string' ? option : option.value;
  }
  const getOptionLabel = (option: typeof options[number]): React.ReactNode => {
    return typeof option === 'string' ? option : option.label;
  }

  const handleSelect = (option: typeof options[number]) => {
    onChange(getOptionValue(option));
    setIsOpen(false);
  };
  
  const selectedOption = options.find(opt => getOptionValue(opt) === value);
  const defaultPlaceholder = placeholder || t('select.placeholder');
  const selectedLabel = selectedOption ? getOptionLabel(selectedOption) : <span className="text-gray-400">{defaultPlaceholder}</span>;
  const defaultClassName = `w-full flex justify-between items-center px-4 py-2.5 bg-white text-right border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors text-base`;

  const DropdownList = (
    <ul
        ref={listRef}
        className="fixed z-50 bg-white shadow-lg rounded-xl max-h-60 overflow-auto border border-gray-200 animate-scale-in"
        style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            transformOrigin: position.transformOrigin,
        }}
        role="listbox"
    >
        {options.map((option, index) => (
            <li
                key={getOptionValue(option) + '-' + index}
                className="px-4 py-2.5 text-base text-gray-800 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={value === getOptionValue(option)}
            >
                <span className="truncate">{getOptionLabel(option)}</span>
                {value === getOptionValue(option) && <CheckIcon className="w-5 h-5 text-blue-600" />}
            </li>
        ))}
    </ul>
  );

  return (
    <div>
        {label && <label className="block text-base font-medium text-gray-700 mb-1.5">{label}</label>}
        <div className="relative">
            <button
                ref={buttonRef}
                type="button"
                className={buttonClassName || defaultClassName}
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">{selectedLabel}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && createPortal(DropdownList, document.body)}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        <style>{`
            @keyframes scale-and-fade-in {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
            }
            .animate-scale-in { animation: scale-and-fade-in 0.15s ease-out; }
        `}</style>
    </div>
  );
};

export default CustomSelect;