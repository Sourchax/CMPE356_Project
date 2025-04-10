import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = ({ darkMode = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(darkMode ? 'top' : 'bottom');
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    const url = new URL(window.location.href);
    url.searchParams.set('lng', lng);
    window.history.pushState({}, '', url);
    setIsOpen(false);
  };

  const handleLanguageClick = (lng, e) => {
    e.preventDefault();
    e.stopPropagation();
    changeLanguage(lng);
  };
  
  // Calculate optimal dropdown position based on available space
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 70; // Approximate height of dropdown
      
      if (darkMode) {
        // Default to top for footer
        setDropdownPosition('top');
      } else if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen, darkMode]);

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
    const currentLang = i18n.language;
    if (currentLang === 'tr' || currentLang.startsWith('tr-')) return 'TR';
    if (currentLang === 'en' || currentLang.startsWith('en-')) return 'EN';
    return 'EN'; // Default to EN if language is not recognized
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 min-w-[32px] min-h-[22px] ${
          darkMode 
            ? 'bg-white/20 text-white hover:bg-white/30 px-2 py-1 text-xs' 
            : 'text-gray-700 hover:bg-gray-100 px-1.5 py-0.5 text-xs'
        } rounded font-medium transition-all duration-150`}
        aria-label="Change language"
      >
        <span>{getCurrentLanguage()}</span>
        <ChevronDown size={darkMode ? 12 : 10} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className={`absolute ${
            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          } right-0 z-[100] w-24 rounded shadow-lg bg-white border border-gray-200 overflow-hidden`}
        >
          <div role="menu" aria-orientation="vertical">
            <button
              onClick={(e) => handleLanguageClick('en', e)}
              className={`flex items-center w-full text-left px-3 py-2 text-xs ${
                i18n.language === 'en' || i18n.language.startsWith('en-')
                  ? 'font-medium text-blue-700 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="menuitem"
            >
              English
            </button>
            <button
              onClick={(e) => handleLanguageClick('tr', e)}
              className={`flex items-center w-full text-left px-3 py-2 text-xs ${
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