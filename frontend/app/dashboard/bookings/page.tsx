'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { FiCalendar, FiClock, FiMapPin, FiAlertCircle, FiEye, FiX, FiLogIn } from 'react-icons/fi';

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const demoBookings = [
  { id: 'ES-ABC123', room: 'Deluxe Suite', checkIn: '2025-02-15', checkOut: '2025-02-18', nights: 3, total: 19500, status: 'confirmed' },
  { id: 'ES-DEF456', room: 'Standard Room - City View', checkIn: '2025-01-10', checkOut: '2025-01-12', nights: 2, total: 7000, status: 'completed' },
  { id: 'ES-GHI789', room: 'Presidential Suite - Royal', checkIn: '2025-03-05', checkOut: '2025-03-08', nights: 3, total: 36000, status: 'pending' },
];

export default function BookingsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-gray-50 dark:bg-[#0F172A]">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-[#D4A853] mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.auth.login_required}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t.auth.login_to_view_bookings}</p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all">
            <FiLogIn size={16} /> {t.auth.login}
          </Link>
        </div>
      </div>
    );
  }

  const filtered = filter === 'all' ? demoBookings : demoBookings.filter((b) => b.status === filter);

  return (
    <div className="pt-20 pb-16 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
      <div className="container-custom mt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.dashboard.my_bookings}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t.dashboard.bookings_subtitle}</p>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-[#D4A853] text-white'
                    : 'bg-white dark:bg-[#1E293B] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {f === 'all' ? t.common.all : t.dashboard[f as keyof typeof t.dashboard] || f}
              </button>
            ))}
          </div>

          {/* Bookings list */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-100 dark:border-gray-700/50">
              <FiCalendar className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">{t.dashboard.no_bookings}</p>
              <Link href="/rooms" className="inline-block mt-4 text-[#D4A853] font-semibold hover:underline">{t.dashboard.browse_rooms}</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 md:p-6 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{booking.room}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><FiCalendar size={14} /> {booking.checkIn} → {booking.checkOut}</span>
                        <span className="flex items-center gap-1"><FiClock size={14} /> {booking.nights} {t.booking.nights}</span>
                        <span className="flex items-center gap-1"><FiMapPin size={14} /> EliteStay Hotel</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.booking.total}</p>
                        <p className="text-lg font-bold text-gradient-gold">{booking.total.toLocaleString()} ETB</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#D4A853] transition-colors" title="View">
                          <FiEye size={18} />
                        </button>
                        {booking.status === 'pending' && (
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Cancel">
                            <FiX size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">Ref: {booking.id}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
