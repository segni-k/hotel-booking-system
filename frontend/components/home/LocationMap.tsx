'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function LocationMap() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0F172A]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.contact.map_title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t.contact.map_subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-xl dark:shadow-black/30 border border-gray-100 dark:border-gray-700/50"
        >
          <iframe
            title="EliteStay Hotel Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.469524105763!2d38.74979107506681!3d9.03920489097795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85b0b0cc7507%3A0xa887ff1f12d0ccff!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[300px] md:h-[450px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
