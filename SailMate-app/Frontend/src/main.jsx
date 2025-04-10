import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react'
import { trTR, enUS } from '@clerk/localizations';
import { initSmoothScrolling } from './assets/scripts/smoothScroll';
// Import i18n configuration
import './i18n';
import i18n from 'i18next';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env.local file')
}

// Initialize smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScrolling();
});

// LocalizedClerkProvider component that listens for language changes
const LocalizedClerkProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  useEffect(() => {
    // Update language state when i18n language changes
    const handleLanguageChange = (lng) => {
      console.log('Language changed to:', lng);
      setCurrentLanguage(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    // Cleanup listener
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      localization={currentLanguage === 'tr' ? trTR : enUS}
    >
      {children}
    </ClerkProvider>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LocalizedClerkProvider>
      <App />
    </LocalizedClerkProvider>
  </StrictMode>
);