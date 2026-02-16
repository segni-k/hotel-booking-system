'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiCheckCircle, FiCalendar, FiHome, FiPrinter } from 'react-icons/fi';

function ConfirmationContent() {
  const { t } = useLanguage();
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.id as string;
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const nights = searchParams.get('nights') || '1';
  const total = searchParams.get('total') || '0';
  const bookingRef = `ES-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="pt-20 pb-16 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
      <div className="container-custom max-w-2xl mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700/50 shadow-xl dark:shadow-black/30 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
          >
            <FiCheckCircle className="text-green-500" size={40} />
          </motion.div>

          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.booking.booking_confirmed}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t.booking.confirmation_message}</p>

          {/* Booking reference */}
          <div className="inline-block px-6 py-3 bg-[#D4A853]/10 rounded-xl mb-8">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.booking.booking_reference}</p>
            <p className="text-xl font-bold text-[#D4A853] tracking-wider">{bookingRef}</p>
          </div>

          {/* Details */}
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 text-left space-y-3 mb-8">
            {[
              { label: t.search.check_in, value: checkIn },
              { label: t.search.check_out, value: checkOut },
              { label: t.booking.nights, value: nights },
              { label: t.booking.total, value: `${Number(total).toLocaleString()} ETB` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {t.booking.confirmation_email}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/bookings"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all"
            >
              <FiCalendar size={16} /> {t.dashboard.my_bookings}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <FiHome size={16} /> {t.common.home}
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <FiPrinter size={16} /> {t.common.print}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#D4A853] border-t-transparent rounded-full" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
