'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { FiArrowRight, FiStar } from 'react-icons/fi';

const rooms = [
  {
    key: 'standard',
    image: '/images/standard-1.jpg',
    price: 3500,
    rating: 4.5,
    maxGuests: 2,
    size: 28,
  },
  {
    key: 'deluxe',
    image: '/images/deluxe-1.jpg',
    price: 6500,
    rating: 4.8,
    maxGuests: 3,
    size: 42,
  },
  {
    key: 'presidential',
    image: '/images/presidential-1.jpg',
    price: 12000,
    rating: 5.0,
    maxGuests: 4,
    size: 75,
  },
];

export default function FeaturedRooms() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-[#0B1120]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.room.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t.room.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {rooms.map((room, i) => {
            const name = t.room[room.key as keyof typeof t.room] as string;
            return (
              <motion.div
                key={room.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="group bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden shadow-md dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 card-hover"
              >
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <Image
                    src={room.image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                    <FiStar className="text-[#D4A853] fill-[#D4A853]" size={12} />
                    <span className="text-white text-xs font-semibold">{room.rating}</span>
                  </div>
                  {/* Price badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1.5 rounded-lg bg-[#D4A853] text-white">
                      <span className="text-lg font-bold">{room.price.toLocaleString()}</span>
                      <span className="text-xs ml-1 opacity-90">ETB{t.common.per_night}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{t.room.max_guests.replace('{count}', room.maxGuests.toString())}</span>
                    <span>•</span>
                    <span>{room.size} {t.room.sqm}</span>
                  </div>
                  <Link
                    href={`/rooms?type=${room.key}`}
                    className="inline-flex items-center gap-2 text-[#D4A853] hover:text-[#B8912E] font-semibold text-sm group/link transition-colors"
                  >
                    {t.room.view_details}
                    <FiArrowRight className="group-hover/link:translate-x-1 transition-transform" size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all hover:-translate-y-0.5"
          >
            {t.room.view_details}
            <FiArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
