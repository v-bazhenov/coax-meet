import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: localStorage.getItem('language') || 'en',
  resources: {
    en: {
      translations: require('./locales/en/translation.json')
    },
    uk: {
      translations: require('./locales/uk/translation.json')
    }
  },
  ns: ['translations'],
  defaultNS: 'translations'
});

i18n.languages = ['en', 'uk'];

export default i18n;
