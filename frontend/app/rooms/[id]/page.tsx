'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiStar, FiUsers, FiMaximize, FiWifi, FiCoffee, FiTv, FiWind, FiDroplet, FiArrowLeft, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaSpa, FaParking, FaConciergeBell } from 'react-icons/fa';

// Room details data
const roomsData: Record<string, {
  name: string; images: string[]; price: number; rating: number; maxGuests: number; size: number;
  bedType: string; floor: string; view: string; description: string; amenities: { icon: React.ElementType; name: string }[];
}> = {
  '1': { name: 'Standard Room - City View', images: ['/images/standard-1.jpg', '/images/standard-2.jpg', '/images/standard-3.jpg'], price: 3500, rating: 4.2, maxGuests: 2, size: 28, bedType: 'Queen', floor: '3-5', view: 'City View', description: 'Our Standard City View room offers a comfortable retreat with modern amenities and stunning views of Addis Ababa. Featuring a plush queen-size bed, elegant decor, and all essential amenities for a pleasant stay. Perfect for solo travelers or couples looking for quality accommodation at an excellent value.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiCoffee, name: 'Coffee Maker' }, { icon: FiTv, name: 'Smart TV' }, { icon: FiWind, name: 'AC' }, { icon: FiDroplet, name: 'Rain Shower' }] },
  '2': { name: 'Standard Room - Garden View', images: ['/images/standard-2.jpg', '/images/standard-1.jpg', '/images/standard-4.jpg'], price: 3800, rating: 4.0, maxGuests: 2, size: 28, bedType: 'Queen', floor: '2-4', view: 'Garden View', description: 'Enjoy the tranquility of our garden view standard room. Wake up to the sight of lush greenery and spend your days relaxing in a beautifully appointed space. Features modern furnishings, comfortable bedding, and all amenities needed for a restful stay.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiCoffee, name: 'Coffee Maker' }, { icon: FiTv, name: 'Smart TV' }, { icon: FiWind, name: 'AC' }] },
  '3': { name: 'Standard Twin Room', images: ['/images/standard-3.jpg', '/images/standard-1.jpg', '/images/standard-2.jpg'], price: 3200, rating: 4.1, maxGuests: 2, size: 25, bedType: 'Twin', floor: '3-6', view: 'City View', description: 'Ideal for friends or colleagues traveling together. Twin beds with premium linens, modern workspace, and all essential amenities for a comfortable stay.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiTv, name: 'Smart TV' }, { icon: FiWind, name: 'AC' }, { icon: FiCoffee, name: 'Mini Bar' }] },
  '4': { name: 'Standard Room - Corner', images: ['/images/standard-4.jpg', '/images/standard-1.jpg', '/images/standard-3.jpg'], price: 4000, rating: 4.3, maxGuests: 2, size: 30, bedType: 'King', floor: '4-7', view: 'Panoramic', description: 'Our corner rooms feature expansive windows flooding the space with natural light. A king-size bed, sitting area, and premium amenities make this room an excellent upgrade from standard.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiCoffee, name: 'Coffee Maker' }, { icon: FiTv, name: 'Smart TV' }, { icon: FiWind, name: 'AC' }, { icon: FiDroplet, name: 'Rain Shower' }, { icon: FaConciergeBell, name: 'Room Service' }] },
  '5': { name: 'Deluxe Suite', images: ['/images/deluxe-1.jpg', '/images/deluxe-2.jpg', '/images/deluxe-3.jpg', '/images/deluxe-4.jpg'], price: 6500, rating: 4.7, maxGuests: 3, size: 42, bedType: 'King', floor: '5-8', view: 'City Panorama', description: 'Indulge in luxury with our Deluxe Suite. Featuring a spacious layout with a separate sitting area, premium king-size bed with luxury linens, marble bathroom with soaking tub and rain shower, and stunning panoramic views of the city.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiCoffee, name: 'Nespresso' }, { icon: FiTv, name: '55" Smart TV' }, { icon: FiWind, name: 'Climate Control' }, { icon: FiDroplet, name: 'Soaking Tub' }, { icon: FaSpa, name: 'Bath Amenities' }, { icon: FaConciergeBell, name: '24/7 Service' }, { icon: FaParking, name: 'Free Parking' }] },
  '6': { name: 'Deluxe Room - Balcony', images: ['/images/deluxe-2.jpg', '/images/deluxe-1.jpg', '/images/deluxe-3.jpg'], price: 7000, rating: 4.6, maxGuests: 2, size: 45, bedType: 'King', floor: '6-9', view: 'Balcony City View', description: 'Romance meets luxury in our Balcony Deluxe Room. Step out onto your private balcony and enjoy breathtaking views while sipping your morning coffee. Inside, find elegant furnishings and all premium amenities.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiCoffee, name: 'Nespresso' }, { icon: FiTv, name: '55" Smart TV' }, { icon: FiWind, name: 'Climate Control' }, { icon: FiDroplet, name: 'Rain Shower' }, { icon: FaSpa, name: 'Spa Amenities' }, { icon: FaConciergeBell, name: '24/7 Service' }] },
  '7': { name: 'Deluxe Family Room', images: ['/images/deluxe-3.jpg', '/images/deluxe-1.jpg', '/images/deluxe-4.jpg'], price: 7500, rating: 4.8, maxGuests: 4, size: 50, bedType: 'King + Twin', floor: '4-7', view: 'Garden View', description: 'Designed for families, this spacious room features a king bed and twin bed, plus ample space for the whole family. Enjoy family-friendly amenities and our dedicated family services.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiCoffee, name: 'Mini Kitchen' }, { icon: FiTv, name: '2x Smart TV' }, { icon: FiWind, name: 'Climate Control' }, { icon: FiDroplet, name: 'Family Bathroom' }, { icon: FaConciergeBell, name: '24/7 Service' }] },
  '8': { name: 'Deluxe Corner Suite', images: ['/images/deluxe-4.jpg', '/images/deluxe-1.jpg', '/images/deluxe-2.jpg'], price: 8000, rating: 4.9, maxGuests: 3, size: 48, bedType: 'King', floor: '7-10', view: 'Panoramic Corner', description: 'Our most popular deluxe option, the Corner Suite offers wraparound views and an extra-spacious layout. Premium in every detail with elegant decor and top-tier amenities.', amenities: [{ icon: FiWifi, name: 'Wi-Fi' }, { icon: FiCoffee, name: 'Nespresso' }, { icon: FiTv, name: '65" Smart TV' }, { icon: FiWind, name: 'Climate Control' }, { icon: FiDroplet, name: 'Soaking Tub' }, { icon: FaSpa, name: 'Premium Amenities' }, { icon: FaConciergeBell, name: 'Butler Service' }, { icon: FaParking, name: 'Valet Parking' }] },
  '9': { name: 'Presidential Suite - Royal', images: ['/images/presidential-1.jpg', '/images/presidential-2.jpg', '/images/presidential-3.jpg', '/images/presidential-4.jpg'], price: 12000, rating: 4.9, maxGuests: 4, size: 75, bedType: 'King', floor: '10-12', view: 'Sky View', description: 'The epitome of luxury. Our Royal Presidential Suite offers unparalleled opulence with a master bedroom, living room, dining area, private study, and a marble bathroom with jacuzzi. Experience personalized butler service and exclusive amenities.', amenities: [{ icon: FiWifi, name: 'Premium Wi-Fi' }, { icon: FiCoffee, name: 'Full Kitchen' }, { icon: FiTv, name: '75" OLED TV' }, { icon: FiWind, name: 'Multi-Zone AC' }, { icon: FiDroplet, name: 'Jacuzzi' }, { icon: FaSpa, name: 'Private Spa' }, { icon: FaConciergeBell, name: 'Private Butler' }, { icon: FaParking, name: 'VIP Parking' }] },
  '10': { name: 'Presidential Suite - Sky', images: ['/images/presidential-2.jpg', '/images/presidential-1.jpg', '/images/presidential-3.jpg'], price: 13000, rating: 4.9, maxGuests: 4, size: 80, bedType: 'King', floor: 'Penthouse', view: '360° City View', description: 'Perched at the top of EliteStay, the Sky Suite offers unrivaled 360-degree views of Addis Ababa. Ultra-luxurious finishes, state-of-the-art technology, and world-class service define this extraordinary space.', amenities: [{ icon: FiWifi, name: 'Premium Wi-Fi' }, { icon: FiCoffee, name: 'Full Kitchen' }, { icon: FiTv, name: '85" OLED TV' }, { icon: FiWind, name: 'Smart Climate' }, { icon: FiDroplet, name: 'Infinity Tub' }, { icon: FaSpa, name: 'In-Room Spa' }, { icon: FaConciergeBell, name: 'Private Butler' }, { icon: FaParking, name: 'VIP Parking' }] },
  '11': { name: 'Presidential Suite - Heritage', images: ['/images/presidential-3.jpg', '/images/presidential-1.jpg', '/images/presidential-4.jpg'], price: 14000, rating: 5.0, maxGuests: 6, size: 90, bedType: 'King + Queen', floor: '11', view: 'Mountain View', description: 'Celebrating Ethiopian heritage with contemporary luxury, this suite features handcrafted local artistry, premium materials, and the finest hospitality. Two bedrooms ensure space for distinguished guests and their companions.', amenities: [{ icon: FiWifi, name: 'Premium Wi-Fi' }, { icon: FiCoffee, name: 'Full Kitchen' }, { icon: FiTv, name: 'Multi-Room AV' }, { icon: FiWind, name: 'Smart Climate' }, { icon: FiDroplet, name: 'Dual Bathroom' }, { icon: FaSpa, name: 'Private Spa' }, { icon: FaConciergeBell, name: 'Dedicated Team' }, { icon: FaParking, name: 'Chauffeured' }] },
  '12': { name: 'Presidential Suite - Grand', images: ['/images/presidential-4.jpg', '/images/presidential-1.jpg', '/images/presidential-2.jpg', '/images/presidential-3.jpg'], price: 15000, rating: 5.0, maxGuests: 6, size: 100, bedType: 'King + Queen', floor: 'Penthouse', view: '360° Panoramic', description: 'Our crown jewel. The Grand Presidential Suite is the largest and most exclusive accommodation at EliteStay. With over 100 square meters of pure luxury, private terrace, personal cinema room, and a team of dedicated staff, this is hospitality at its absolute finest.', amenities: [{ icon: FiWifi, name: 'Premium Wi-Fi' }, { icon: FiCoffee, name: 'Chef\'s Kitchen' }, { icon: FiTv, name: 'Cinema Room' }, { icon: FiWind, name: 'Smart Climate' }, { icon: FiDroplet, name: 'Spa Bathroom' }, { icon: FaSpa, name: 'Private Spa' }, { icon: FaConciergeBell, name: 'Dedicated Team' }, { icon: FaParking, name: 'Helicopter Pad' }] },
};

export default function RoomDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const room = roomsData[id];
  const [activeImage, setActiveImage] = useState(0);

  if (!room) {
    return (
      <div className="pt-24 pb-16 container-custom text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.errors.not_found}</h2>
        <Link href="/rooms" className="text-[#D4A853] hover:underline">{t.common.back}</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="container-custom">
        {/* Back button */}
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#D4A853] transition-colors mb-6 mt-4"
        >
          <FiArrowLeft size={16} />
          {t.common.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Gallery & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div className="relative h-[300px] md:h-[450px]">
                <Image
                  src={room.images[activeImage]}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                {/* Nav arrows */}
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev - 1 + room.images.length) % room.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev + 1) % room.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-3">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i ? 'border-[#D4A853]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50"
            >
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {room.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FiStar className="text-[#D4A853] fill-[#D4A853]" size={14} />
                  {room.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <FiUsers size={14} />
                  {t.room.max_guests.replace('{count}', room.maxGuests.toString())}
                </span>
                <span className="flex items-center gap-1">
                  <FiMaximize size={14} />
                  {room.size} {t.room.sqm}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t.room.description}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {room.description}
              </p>

              {/* Room specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: t.room.bed_type, value: room.bedType },
                  { label: t.room.room_size, value: `${room.size} ${t.room.sqm}` },
                  { label: t.room.floor, value: room.floor },
                  { label: t.room.view_type, value: room.view },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.room.room_amenities}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {room.amenities.map(({ icon: Icon, name }) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl"
                  >
                    <Icon className="text-[#D4A853]" size={18} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 bg-white dark:bg-[#1E293B] rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-lg dark:shadow-black/20"
            >
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-gradient-gold">{room.price.toLocaleString()}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">ETB {t.room.per_night}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className={i < Math.floor(room.rating) ? 'text-[#D4A853] fill-[#D4A853]' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{room.rating.toFixed(1)}</span>
              </div>

              {/* Quick specs */}
              <div className="space-y-3 mb-6">
                {[
                  { label: t.room.bed_type, value: room.bedType },
                  { label: t.room.view_type, value: room.view },
                  { label: t.common.guests, value: `${room.maxGuests} max` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>

              {/* Book button */}
              <Link
                href={`/booking/${id}`}
                className="block w-full py-3.5 text-center text-base font-semibold text-white bg-gradient-gold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all hover:-translate-y-0.5"
              >
                {t.room.book_now}
              </Link>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                {t.room.select_dates}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
