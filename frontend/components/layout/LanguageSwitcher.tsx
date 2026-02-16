'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { localeOptions } from '@/i18n';
import type { Locale } from '@/types';
import { FiGlobe, FiCheck } from 'react-icons/fi';

export default function LanguageSwitcher({ isTransparent = false }: { isTransparent?: boolean }) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = localeOptions.find(l => l.code === locale);

  const btnClass = isTransparent
    ? 'text-white/80 hover:bg-white/10'
    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${btnClass}`}
        aria-label="Change language"
      >
        <FiGlobe size={16} />
        <span className="hidden sm:inline">{current?.flag} {current?.nativeName}</span>
        <span className="sm:hidden">{current?.flag}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-52 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl dark:shadow-black/30 border border-gray-100 dark:border-gray-700/50 py-2 overflow-hidden z-50"
          >
            {localeOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => {
                  setLocale(option.code as Locale);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === option.code
                    ? 'text-[#D4A853] bg-[#D4A853]/5'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{option.flag}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{option.nativeName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{option.name}</div>
                </div>
                {locale === option.code && <FiCheck size={16} className="text-[#D4A853]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
