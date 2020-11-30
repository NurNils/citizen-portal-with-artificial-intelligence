import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  /** Available languages */
  languages = [
    {
      lang: 'de',
      country: 'Germany',
      name: 'Deutsch',
    },
    {
      lang: 'en',
      country: 'USA',
      name: 'English',
    },
  ];

  /** Constructor */
  constructor(private translate: TranslateService) {}

  /**
   * Initializes i18n
   * @returns {undefined}
   * */
  initializeI18n() {
    this.translate.setDefaultLang(env.i18n.defaultLanguage);
    const savedLanguage = localStorage.getItem(env.storage.keys.i18n);
    if (savedLanguage && this.isLangAvailable(savedLanguage)) {
      this.translate.use(savedLanguage);
    } else if (this.isLangAvailable(this.translate.getBrowserLang())) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use(env.i18n.defaultLanguage);
    }
  }

  /**
   * Checks if language is available
   * @param {string} lang Language code to check
   * @returns {boolean}
   * */
  isLangAvailable(lang: string) {
    for (const language of this.getLanguages()) {
      if (language.lang === lang) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get all available languages with flags
   * @returns {undefined}
   * */
  getLanguages() {
    return this.languages;
  }

  /**
   * Checks current language
   * @param {string} lang Language code to check
   * @returns {boolean}
   * */
  isLanguage(lang: string) {
    return lang === this.translate.currentLang;
  }

  /**
   * Changes the current language
   * @param {string} lang Language code to change
   * @returns {undefined}
   * */
  changeLanguage(lang: string) {
    localStorage.setItem(env.storage.keys.i18n, lang);
    this.translate.use(lang);
  }
}
