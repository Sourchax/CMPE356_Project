import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current language display text
  const getCurrentLanguage = () => {
    return i18n.language === 'tr' || i18n.language.startsWith('tr-') ? 'TR' : 'EN';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-all duration-150"
        aria-label="Change language"
      >
        <span>{getCurrentLanguage()}</span>
        <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-24 rounded shadow-sm bg-white border border-gray-200 overflow-hidden">
          <div role="menu" aria-orientation="vertical">
            <button
              onClick={() => changeLanguage('en')}
              className={`flex items-center w-full text-left px-2.5 py-1 text-xs ${
                i18n.language === 'en' || i18n.language.startsWith('en-')
                  ? 'font-medium text-blue-700 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="menuitem"
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('tr')}
              className={`flex items-center w-full text-left px-2.5 py-1 text-xs ${
                i18n.language === 'tr' || i18n.language.startsWith('tr-')
                  ? 'font-medium text-blue-700 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="menuitem"
            >
              Türkçe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 