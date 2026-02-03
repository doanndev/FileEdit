import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '../contexts/ThemeContext';
import { useLanguage, Language } from '../contexts/LanguageContext';

export const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { language, setLanguage, t, availableLanguages } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: t.light, icon: 'light_mode' },
    { value: 'dark', label: t.dark, icon: 'dark_mode' },
    { value: 'system', label: t.system, icon: 'desktop_windows' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label={t.settings}
      >
        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">settings</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t.settings}</h3>
          </div>

          {/* Theme Section */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3 block">
              {t.theme}
            </label>
            <div className="flex gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    theme === option.value
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined !text-xl">{option.icon}</span>
                  <span className="text-[10px] font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Section */}
          <div className="p-4">
            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-3 block">
              {t.language}
            </label>
            <div className="space-y-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    language === lang.code
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="text-lg">{lang.code === 'en' ? '🇺🇸' : '🇻🇳'}</span>
                  <span className="text-sm">{lang.nativeName}</span>
                  {language === lang.code && (
                    <span className="material-symbols-outlined ml-auto !text-lg">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
