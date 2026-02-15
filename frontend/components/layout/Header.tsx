'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiCalendar } from 'react-icons/fi';

// Pages that have a full-screen dark hero behind the fixed header
const heroPages = ['/'];

export default function Header() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isHeroPage = heroPages.includes(pathname);
  // When on a hero page and not scrolled, use white text so it's visible over dark backgrounds
  const isTransparentOnHero = isHeroPage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/rooms', label: t.nav.rooms },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  // Dynamic text classes based on scroll + hero state
  const logoTextClass = isTransparentOnHero
    ? 'text-white group-hover:text-[#D4A853]'
    : 'text-gray-900 dark:text-white group-hover:text-[#D4A853]';

  const navLinkClass = isTransparentOnHero
    ? 'text-white/90 hover:text-[#D4A853] hover:bg-white/10'
    : 'text-gray-700 dark:text-gray-300 hover:text-[#D4A853] dark:hover:text-[#D4A853] hover:bg-gray-100/50 dark:hover:bg-white/5';

  const iconBtnClass = isTransparentOnHero
    ? 'text-white/80 hover:bg-white/10'
    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10';

  const loginTextClass = isTransparentOnHero
    ? 'text-white/90 hover:text-[#D4A853]'
    : 'text-gray-700 dark:text-gray-300 hover:text-[#D4A853]';

  const profileBtnClass = isTransparentOnHero
    ? 'bg-white/10 hover:bg-white/20 text-white'
    : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15';

  const profileNameClass = isTransparentOnHero
    ? 'text-white'
    : 'text-gray-700 dark:text-gray-300';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20'
            : isHeroPage
              ? 'bg-transparent'
              : 'bg-white dark:bg-[#0F172A] shadow-sm shadow-black/5 dark:shadow-black/10'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-gold rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm md:text-base">ES</span>
              </div>
              <span className={`font-[family-name:var(--font-playfair)] text-lg md:text-xl font-bold transition-colors ${logoTextClass}`}>
                EliteStay
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${navLinkClass}`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  href="/dashboard/bookings"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${navLinkClass}`}
                >
                  {t.nav.dashboard}
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher isTransparent={isTransparentOnHero} />
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all ${iconBtnClass}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 pl-3 pr-4 py-2 rounded-xl transition-all ${profileBtnClass}`}
                  >
                    <div className="w-7 h-7 bg-gradient-gold rounded-full flex items-center justify-center">
                      <FiUser size={14} className="text-white" />
                    </div>
                    <span className={`text-sm font-medium max-w-[100px] truncate ${profileNameClass}`}>
                      {user?.name}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-48 bg-white dark:bg-[#1E293B] rounded-xl shadow-xl dark:shadow-black/30 border border-gray-100 dark:border-gray-700/50 py-2 overflow-hidden"
                      >
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <FiCalendar size={16} />
                          {t.nav.dashboard}
                        </Link>
                        <hr className="my-1 border-gray-100 dark:border-gray-700/50" />
                        <button
                          onClick={() => { setIsProfileOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors"
                        >
                          <FiLogOut size={16} />
                          {t.nav.logout}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className={`px-4 py-2 text-sm font-medium transition-colors ${loginTextClass}`}
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-gold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all hover:-translate-y-0.5"
                  >
                    {t.nav.register}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${iconBtnClass}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`p-2 rounded-lg transition-colors ${iconBtnClass}`}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-white dark:bg-[#0F172A] shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 pb-6 px-6">
                <nav className="flex flex-col gap-1 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#D4A853] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setIsMobileOpen(false)}
                      className="px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-200 hover:text-[#D4A853] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      {t.nav.dashboard}
                    </Link>
                  )}
                </nav>

                <div className="border-t border-gray-200 dark:border-gray-700/50 pt-4 space-y-3">
                  <LanguageSwitcher />
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                          <FiUser size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name}</span>
                      </div>
                      <button
                        onClick={() => { setIsMobileOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition-colors"
                      >
                        <FiLogOut size={16} />
                        {t.nav.logout}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        onClick={() => setIsMobileOpen(false)}
                        className="block w-full text-center px-4 py-3 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                      >
                        {t.nav.login}
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMobileOpen(false)}
                        className="block w-full text-center px-4 py-3 text-sm font-semibold text-white bg-gradient-gold rounded-xl transition-all"
                      >
                        {t.nav.register}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile dropdown backdrop */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
      )}
    </>
  );
}
