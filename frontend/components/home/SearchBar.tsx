'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { getMinDate, getTomorrowDate } from '@/lib/utils';
import { FiCalendar, FiUsers, FiSearch, FiHome } from 'react-icons/fi';

export default function SearchBar() {
  const { t } = useLanguage();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(getMinDate());
  const [checkOut, setCheckOut] = useState(getTomorrowDate());
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      check_in_date: checkIn,
      check_out_date: checkOut,
      guests: guests.toString(),
      rooms: rooms.toString(),
    });
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <section className="relative -mt-24 z-20 container-custom px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <form
          onSubmit={handleSearch}
          className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 p-4 md:p-6 border border-gray-100 dark:border-gray-700/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Check-in */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <FiCalendar size={12} />
                {t.search.check_in}
              </label>
              <input
                type="date"
                value={checkIn}
                min={getMinDate()}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (e.target.value >= checkOut) {
                    const next = new Date(e.target.value);
                    next.setDate(next.getDate() + 1);
                    setCheckOut(next.toISOString().split('T')[0]);
                  }
                }}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600/50 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#D4A853]/20"
              />
            </div>

            {/* Check-out */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <FiCalendar size={12} />
                {t.search.check_out}
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || getTomorrowDate()}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600/50 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#D4A853]/20"
              />
            </div>

            {/* Guests */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <FiUsers size={12} />
                {t.search.guests}
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600/50 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#D4A853]/20 appearance-none"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            {/* Rooms */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <FiHome size={12} />
                {t.search.rooms}
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600/50 rounded-xl text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#D4A853]/20 appearance-none"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <FiSearch size={18} />
                <span>{t.search.search_btn}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </section>
  );
}
