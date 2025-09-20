import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../../hooks/useI18n';
import { ChevronDownIcon, CheckIcon } from '../icons/AppleIcons';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  buttonClassName?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selectedValues, onChange, placeholder, buttonClassName }) => {
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
    const handleScrollOrResize = () => updatePosition();

    document.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, updatePosition]);

  const handleToggleOption = (optionValue: string) => {
    const newSelected = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    onChange(newSelected);
  };

  const defaultPlaceholder = placeholder || t('select.placeholder');
  const displayLabel = selectedValues.length > 0
    ? `${selectedValues.length} مورد انتخاب شده`
    : <span className="text-gray-400">{defaultPlaceholder}</span>;
    
  const defaultClassName = `w-full flex justify-between items-center px-3 py-2.5 bg-white text-right border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors text-base`;

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
        {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
                <li
                    key={option.value}
                    className="px-4 py-2.5 text-base text-gray-800 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                    onClick={() => handleToggleOption(option.value)}
                    role="option"
                    aria-selected={isSelected}
                >
                    <div className="flex items-center">
                        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center mr-3 transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                        </div>
                        <span className="truncate">{option.label}</span>
                    </div>
                </li>
            );
        })}
        {options.length === 0 && <li className="px-4 py-2.5 text-base text-gray-500 text-center">موردی برای انتخاب وجود ندارد</li>}
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
                <span className="truncate">{displayLabel}</span>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ml-2 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && createPortal(DropdownList, document.body)}
        </div>
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

export default MultiSelect;