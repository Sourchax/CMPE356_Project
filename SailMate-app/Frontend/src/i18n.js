import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// English translations
import enTranslation from './locales/en/translation.json';
// Turkish translations
import trTranslation from './locales/tr/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  tr: {
    translation: trTranslation
  }
};

i18n
  // load translation using http (default public/locales)
  .use(Backend)
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n; 