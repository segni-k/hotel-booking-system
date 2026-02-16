'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiStar, FiUsers, FiMaximize } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface RoomCardProps {
  id: number | string;
  name: string;
  image: string;
  price: number;
  rating: number;
  maxGuests: number;
  size: number;
  description: string;
  bedType?: string;
  index?: number;
}

export default function RoomCard({
  id,
  name,
  image,
  price,
  rating,
  maxGuests,
  size,
  description,
  bedType,
  index = 0,
}: RoomCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden shadow-md dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 card-hover"
    >
      {/* Image */}
      <div className="relative h-52 md:h-60 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
          <FiStar className="text-[#D4A853] fill-[#D4A853]" size={12} />
          <span className="text-white text-xs font-semibold">{rating.toFixed(1)}</span>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4">
          <div className="px-3 py-1.5 rounded-lg bg-[#D4A853] text-white">
            <span className="text-lg font-bold">{price.toLocaleString()}</span>
            <span className="text-xs ml-1 opacity-90">ETB{t.common.per_night}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <FiUsers size={12} />
            {maxGuests}
          </span>
          <span className="flex items-center gap-1">
            <FiMaximize size={12} />
            {size} {t.room.sqm}
          </span>
          {bedType && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-xs">
              {bedType}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/rooms/${id}`}
            className="flex-1 py-2.5 text-center text-sm font-medium border border-gray-200 dark:border-gray-600/50 rounded-xl text-gray-700 dark:text-gray-300 hover:border-[#D4A853] hover:text-[#D4A853] transition-all"
          >
            {t.room.view_details}
          </Link>
          <Link
            href={`/booking/${id}`}
            className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-gradient-gold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all"
          >
            {t.room.book_now}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
