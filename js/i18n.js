/**
 * PedalPal Multilingual Engine (js/i18n.js)
 * Supports English (en), Hindi (hi), and Marathi (mr).
 * Preserves choice in localStorage.
 */

const I18n = (function () {
  const STORAGE_KEY = 'pedalpal_lang';
  const DEFAULT_LANG = 'en';

  let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  let dictionaries = { en: null, hi: null, mr: null };

  async function loadDictionary(lang) {
    if (dictionaries[lang]) return dictionaries[lang];
    try {
      const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
      const res = await fetch(`${prefix}data/languages/${lang}.json`);
      if (res.ok) {
        dictionaries[lang] = await res.json();
        return dictionaries[lang];
      }
    } catch (e) {
      console.warn(`Could not fetch data/languages/${lang}.json:`, e);
    }
    return {};
  }

  return {
    async init() {
      await loadDictionary(currentLang);
      this.updateDOM();
      this.updateActiveButton();
    },

    async setLanguage(lang) {
      if (!['en', 'hi', 'mr'].includes(lang)) lang = 'en';
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      await loadDictionary(lang);
      this.updateDOM();
      this.updateActiveButton();
      window.dispatchEvent(new CustomEvent('pedalpal_lang_changed', { detail: { lang } }));
    },

    getLanguage() {
      return currentLang;
    },

    t(key) {
      const dict = dictionaries[currentLang] || {};
      const enDict = dictionaries['en'] || {};
      return dict[key] || enDict[key] || key;
    },

    updateDOM() {
      const dict = dictionaries[currentLang] || {};
      const enDict = dictionaries['en'] || {};

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = dict[key] || enDict[key];
        if (text) el.textContent = text;
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const text = dict[key] || enDict[key];
        if (text) el.setAttribute('placeholder', text);
      });

      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const text = dict[key] || enDict[key];
        if (text) el.setAttribute('title', text);
      });
    },

    updateActiveButton() {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  };
})();

window.PedalPalI18n = I18n;
