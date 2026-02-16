'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Liya T.',
    role: 'Business Traveler',
    feedback_en: 'One of the best hotel experiences I\'ve ever had! The staff were incredibly friendly and the food was just divine.',
    feedback_am: 'ካገኘኋቸው ምርጥ የሆቴል ልምዶች አንዱ ነው! ሰራተኞቹ በጣም ተግባቢ ነበሩ እና ምግቡ ድንቅ ነበር።',
    feedback_or: 'Muuxannoo hoteelaa hundaa ol gaarii argadhe! Hojjettootni baay\'ee mi\'aawaa turan nyaatnis ajaa\'iba ture.',
    image: '/images/testimonial-1.jpg',
    rating: 5,
  },
  {
    name: 'Henok G.',
    role: 'Tourist',
    feedback_en: 'Amazing rooms and facilities. The location is perfect for both tourists and business travelers.',
    feedback_am: 'አስደናቂ ክፍሎች እና ተቋማት። ቦታው ለቱሪስቶችም ሆነ ለንግድ ተጓዦች ፍጹም ነው።',
    feedback_or: 'Kutaalee fi dandeettiiwwan ajaa\'ibaa. Iddoon tuuristootaa fi namshoota daldalaatiif guutuu dha.',
    image: '/images/testimonial-2.jpg',
    rating: 5,
  },
  {
    name: 'Sara K.',
    role: 'Couple',
    feedback_en: 'Stunning decor, world-class service, and delicious cuisine. Highly recommended!',
    feedback_am: 'አስደናቂ ማስጌጫ፣ ዓለም ደረጃ አገልግሎት፣ እና ጣፋጭ ምግብ። በጣም ይመከራል!',
    feedback_or: 'Miidhagina ajaa\'ibaa, tajaajila sadarkaa addunyaa, fi nyaata mi\'aawaa. Baay\'ee ni gorsama!',
    image: '/images/testimonial-3.jpg',
    rating: 5,
  },
];

export default function Testimonials() {
  const { t, locale } = useLanguage();

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-[#0F172A]">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.testimonials.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((review, i) => {
            const feedback = locale === 'am' ? review.feedback_am : locale === 'or' ? review.feedback_or : review.feedback_en;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative p-6 md:p-8 rounded-2xl bg-gray-50 dark:bg-[#1E293B] border border-gray-100 dark:border-gray-700/50 card-hover"
              >
                {/* Quote mark */}
                <div className="absolute top-4 right-6 text-6xl text-[#D4A853]/10 font-serif leading-none">"</div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <FiStar key={j} className="text-[#D4A853] fill-[#D4A853]" size={16} />
                  ))}
                </div>

                {/* Feedback */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic text-sm md:text-base">
                  &ldquo;{feedback}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#D4A853]/30">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{review.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
