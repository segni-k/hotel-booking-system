'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import RoomCard from '@/components/rooms/RoomCard';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

// Static room data (used when API is not available)
const staticRooms = [
  {
    id: 1, name: 'Standard Room - City View', category: 'standard',
    description: 'Comfortable room with essential amenities and a beautiful city view. Perfect for solo travelers or couples.',
    image: '/images/standard-1.jpg', price: 3500, rating: 4.2, maxGuests: 2, size: 28, bedType: 'Queen',
  },
  {
    id: 2, name: 'Standard Room - Garden View', category: 'standard',
    description: 'Modern design with cozy interior and a serene garden view. A peaceful retreat in the city.',
    image: '/images/standard-2.jpg', price: 3800, rating: 4.0, maxGuests: 2, size: 28, bedType: 'Queen',
  },
  {
    id: 3, name: 'Standard Twin Room', category: 'standard',
    description: 'Affordable luxury for travelers with twin beds and modern amenities.',
    image: '/images/standard-3.jpg', price: 3200, rating: 4.1, maxGuests: 2, size: 25, bedType: 'Twin',
  },
  {
    id: 4, name: 'Standard Room - Corner', category: 'standard',
    description: 'Simple, clean, and convenient corner room with extra natural light.',
    image: '/images/standard-4.jpg', price: 4000, rating: 4.3, maxGuests: 2, size: 30, bedType: 'King',
  },
  {
    id: 5, name: 'Deluxe Suite', category: 'deluxe',
    description: 'Spacious and elegant with premium bedding, a sitting area, and luxury amenities.',
    image: '/images/deluxe-1.jpg', price: 6500, rating: 4.7, maxGuests: 3, size: 42, bedType: 'King',
  },
  {
    id: 6, name: 'Deluxe Room - Balcony', category: 'deluxe',
    description: 'Designed for couples with a private balcony offering stunning city views.',
    image: '/images/deluxe-2.jpg', price: 7000, rating: 4.6, maxGuests: 2, size: 45, bedType: 'King',
  },
  {
    id: 7, name: 'Deluxe Family Room', category: 'deluxe',
    description: 'Warm lighting and sophisticated finish, perfect for families with extra space.',
    image: '/images/deluxe-3.jpg', price: 7500, rating: 4.8, maxGuests: 4, size: 50, bedType: 'King + Twin',
  },
  {
    id: 8, name: 'Deluxe Corner Suite', category: 'deluxe',
    description: 'Elegant decor with a cozy feel and panoramic corner windows.',
    image: '/images/deluxe-4.jpg', price: 8000, rating: 4.9, maxGuests: 3, size: 48, bedType: 'King',
  },
  {
    id: 9, name: 'Presidential Suite - Royal', category: 'presidential',
    description: 'Ultimate luxury with personalized service, separate living area, and premium amenities.',
    image: '/images/presidential-1.jpg', price: 12000, rating: 4.9, maxGuests: 4, size: 75, bedType: 'King',
  },
  {
    id: 10, name: 'Presidential Suite - Sky', category: 'presidential',
    description: 'Spacious layout with stunning city views from the top floor.',
    image: '/images/presidential-2.jpg', price: 13000, rating: 4.9, maxGuests: 4, size: 80, bedType: 'King',
  },
  {
    id: 11, name: 'Presidential Suite - Heritage', category: 'presidential',
    description: 'Luxury retreat with all premium amenities and Ethiopian heritage decor.',
    image: '/images/presidential-3.jpg', price: 14000, rating: 5.0, maxGuests: 6, size: 90, bedType: 'King + Queen',
  },
  {
    id: 12, name: 'Presidential Suite - Grand', category: 'presidential',
    description: 'A touch of class and comfort combined in our largest and most exclusive suite.',
    image: '/images/presidential-4.jpg', price: 15000, rating: 5.0, maxGuests: 6, size: 100, bedType: 'King + Queen',
  },
];

const categories = ['all', 'standard', 'deluxe', 'presidential'] as const;

function RoomsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(typeParam || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (typeParam) setActiveCategory(typeParam);
  }, [typeParam]);

  const filteredRooms = staticRooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(search.toLowerCase()) ||
      room.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || room.category === activeCategory;
    const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categoryLabels: Record<string, string> = {
    all: t.common.all,
    standard: t.room.standard,
    deluxe: t.room.deluxe,
    presidential: t.room.presidential,
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.room.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t.room.subtitle}
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search.placeholder}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700/50 rounded-xl text-sm text-gray-700 dark:text-gray-300"
          >
            <FiFilter size={16} />
            {t.common.filter}
          </button>
        </div>

        {/* Categories */}
        <div className={`flex-wrap gap-2 mb-8 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-gold text-white shadow-md shadow-[#D4A853]/20'
                  : 'bg-white dark:bg-[#1E293B] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 hover:border-[#D4A853]/30'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}

          {/* Price Range */}
          <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ETB</span>
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full sm:w-32 accent-[#D4A853]"
            />
          </div>

          {(search || activeCategory !== 'all') && (
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setPriceRange([0, 20000]); }}
              className="flex items-center gap-1 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-lg transition-colors"
            >
              <FiX size={14} />
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t.search.results_count.replace('{count}', filteredRooms.length.toString())}
        </p>

        {/* Room Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room, i) => (
              <RoomCard
                key={room.id}
                id={room.id}
                name={room.name}
                image={room.image}
                price={room.price}
                rating={room.rating}
                maxGuests={room.maxGuests}
                size={room.size}
                description={room.description}
                bedType={room.bedType}
                index={i}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t.search.no_results}
            </h3>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); }}
              className="text-[#D4A853] hover:underline text-sm"
            >
              {t.common.retry}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16 container-custom">
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-[#D4A853]/30 border-t-[#D4A853] rounded-full animate-spin mx-auto" />
        </div>
      </div>
    }>
      <RoomsContent />
    </Suspense>
  );
}
