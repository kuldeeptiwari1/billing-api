const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

i18next.use(Backend).init({
  lng: 'en',
  fallbackLng: 'en',
  preload: ['en', 'es'], // Supported languages
  ns: ['common', 'auth'],
  backend: {
    loadPath: path.join(__dirname, '../locales/{{lng}}.json'),
  }
});

module.exports = i18next;
