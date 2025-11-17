import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationIT from './locales/it.json';
import translationEN from './locales/en.json';

const resources = {
  it: {
    translation: translationIT,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'it', // default language
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    debug: import.meta.env.DEV,
  });

export default i18n;
