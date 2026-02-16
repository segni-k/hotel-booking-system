'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FaConciergeBell, FaWifi, FaSpa, FaSwimmingPool, FaUtensils, FaShieldAlt } from 'react-icons/fa';

const featureIcons = [
  { icon: FaConciergeBell, key: 'room_service' },
  { icon: FaWifi, key: 'wifi' },
  { icon: FaSpa, key: 'spa' },
  { icon: FaSwimmingPool, key: 'pool' },
  { icon: FaUtensils, key: 'dining' },
  { icon: FaShieldAlt, key: 'security' },
] as const;

export default function Features() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0F172A]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.features.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureIcons.map(({ icon: Icon, key }, i) => {
            const title = t.features[key as keyof typeof t.features];
            const desc = t.features[`${key}_desc` as keyof typeof t.features];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative p-6 md:p-8 rounded-2xl bg-gray-50 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-700/50 hover:border-[#D4A853]/30 dark:hover:border-[#D4A853]/30 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-[#D4A853]/10 dark:bg-[#D4A853]/5 flex items-center justify-center mb-5 group-hover:bg-gradient-gold group-hover:shadow-lg group-hover:shadow-[#D4A853]/20 transition-all duration-300">
                  <Icon className="text-[#D4A853] group-hover:text-white transition-colors duration-300" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
