'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import { FaTelegram } from 'react-icons/fa';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 py-12 bg-gray-900 dark:bg-[#020617] text-gray-300">
      {/* Main Footer */}
      <div className="container-custom pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">ES</span>
              </div>
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
                EliteStay
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              {[
                { icon: <FiFacebook size={18} />, href: '#' },
                { icon: <FiInstagram size={18} />, href: '#' },
                { icon: <FiTwitter size={18} />, href: '#' },
                { icon: <FaTelegram size={18} />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#D4A853] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t.footer.quick_links}</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: t.nav.home },
                { href: '/rooms', label: t.nav.rooms },
                { href: '/about', label: t.nav.about },
                { href: '/contact', label: t.nav.contact },
                { href: '/dashboard/bookings', label: t.nav.dashboard },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t.footer.services}</h4>
            <ul className="space-y-3">
              {[t.footer.dining, t.footer.wellness, t.footer.fitness, t.footer.events, t.footer.privacy, t.footer.terms].map(
                (item) => (
                  <li key={item}>
                    <span className="text-sm text-gray-400 hover:text-[#D4A853] transition-colors duration-200 cursor-pointer">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">{t.footer.contact_info}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin size={18} className="text-[#D4A853] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">{t.contact.address_value}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={18} className="text-[#D4A853] flex-shrink-0" />
                <span className="text-sm text-gray-400">{t.contact.phone_value}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={18} className="text-[#D4A853] flex-shrink-0" />
                <span className="text-sm text-gray-400">{t.contact.email_value}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            {t.footer.copyright.replace('{year}', year.toString())}
          </p>
          <p className="text-xs text-gray-500">
            Built with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    </footer>
  );
}
