const i18next = require('../config/i18n');
const path = require('path');
const fs = require('fs');

// Function to load module/global locales
function loadModuleLocales(module, lang = 'en') {
  try {
    const localesPath = module
      ? path.join(__dirname, '..', 'modules', module, 'locales', `${lang}.json`)
      : path.join(__dirname, '..', 'locales', `${lang}.json`);

    if (fs.existsSync(localesPath)) {
      const moduleLocales = require(localesPath);
      return (category, key) => moduleLocales?.[category]?.[key] || null;
    }
  } catch (err) {
    console.error(`Error loading locales for ${module || 'global'}:`, err);
  }
  return () => null; // Return a function that always returns null if loading fails
}

// Function to retrieve localized messages
const getMessage = (lang = 'en', category, key, module = null) => {
  const loadModule = loadModuleLocales(module, lang);
  const moduleMsg = loadModule(category, key);

  if (typeof moduleMsg === 'string') {
    return { code: 'UNKNOWN', message: moduleMsg, ariaLabel: moduleMsg };
  }

  return moduleMsg || { code: 'UNKNOWN', message: 'Message not found', ariaLabel: 'Error: Message not found' };
};

module.exports = { getMessage };
