'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(t.contact.message_sent);
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/20 outline-none transition-all';

  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden bg-[#1A1A2E]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-white mb-3"
          >
            {t.contact.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-lg mx-auto"
          >
            {t.contact.subtitle}
          </motion.p>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gray-900 dark:text-white">
              {t.contact.get_in_touch}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t.contact.reach_out}</p>

            <div className="space-y-5">
              {[
                { icon: FiMapPin, title: t.contact.address_label, text: 'Bole Road, Addis Ababa, Ethiopia' },
                { icon: FiPhone, title: t.contact.phone_label, text: '+251 11 234 5678' },
                { icon: FiMail, title: t.contact.email_label, text: 'info@elitestay.com' },
                { icon: FiClock, title: t.contact.hours_label, text: t.contact.hours_value },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#D4A853]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="text-[#D4A853]" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t.contact.follow_us}</p>
              <div className="flex gap-3">
                {[FaFacebookF, FaInstagram, FaTwitter, FaTiktok].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-[#D4A853] hover:text-white transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50 shadow-lg dark:shadow-black/20"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t.contact.send_message}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.contact.your_name}</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.contact.your_email}</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="email@example.com" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.contact.subject}</label>
                <div className="relative">
                  <FiMessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} placeholder={t.contact.subject_placeholder} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.contact.message}</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/20 outline-none transition-all resize-none"
                  placeholder={t.contact.message_placeholder}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t.common.loading}
                  </>
                ) : (
                  <>
                    <FiSend size={16} /> {t.contact.send}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 h-[350px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.4773569856957!2d38.7468!3d9.0222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sBole%20Rd%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1635000000000!5m2!1sen!2set"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </div>
  );
}
