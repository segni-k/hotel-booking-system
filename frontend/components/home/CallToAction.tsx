'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function CallToAction() {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#1A1A2E]/85" />
      </div>

      {/* Decorative */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4A853]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4A853]/5 rounded-full blur-3xl" />

      <div className="relative z-10 container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {t.cta.title}
          </h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            {t.cta.subtitle}
          </p>
          <Link href="/rooms">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-gradient-gold text-white font-semibold rounded-xl shadow-lg shadow-[#D4A853]/30 text-lg transition-shadow"
            >
              {t.cta.button}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
