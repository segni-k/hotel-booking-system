'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';

export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t.newsletter.success);
      setEmail('');
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-[#0B1120]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 bg-[#D4A853]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiSend className="text-[#D4A853]" size={28} />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.newsletter.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {t.newsletter.subtitle}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletter.placeholder}
              required
              className="flex-1 px-5 py-3.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all flex items-center justify-center gap-2"
            >
              {t.newsletter.button}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
