'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FiAward, FiHeart, FiStar, FiUsers, FiMapPin, FiClock } from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {t.about.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-200 max-w-2xl mx-auto"
          >
            {t.about.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#D4A853] font-semibold text-sm tracking-wider uppercase">{t.about.our_story}</span>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
                {t.about.story_title}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>{t.about.story_p1}</p>
                <p>{t.about.story_p2}</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden"
            >
              <Image src="/images/hero.jpg" alt="EliteStay" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-[#0F172A]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-[#D4A853] font-semibold text-sm tracking-wider uppercase">{t.about.our_values}</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {t.about.values_title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FiAward, title: t.about.excellence, desc: t.about.excellence_desc },
              { icon: FiHeart, title: t.about.hospitality, desc: t.about.hospitality_desc },
              { icon: FiStar, title: t.about.innovation, desc: t.about.innovation_desc },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[#D4A853]/10 rounded-xl flex items-center justify-center">
                  <item.icon className="text-[#D4A853]" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FiUsers, value: '10,000+', label: t.about.happy_guests },
              { icon: FiMapPin, value: 'Addis Ababa', label: t.about.prime_location },
              { icon: FiClock, value: '15+', label: t.about.years_exp },
              { icon: FiAward, value: '5.0', label: t.about.avg_rating },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center p-6"
              >
                <stat.icon className="text-[#D4A853] mx-auto mb-3" size={28} />
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50 dark:bg-[#0F172A]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-[#D4A853] font-semibold text-sm tracking-wider uppercase">{t.about.our_team}</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              {t.about.team_title}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Abebe Kebede', role: t.about.general_manager, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face' },
              { name: 'Sara Mulugeta', role: t.about.head_chef, image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=500&fit=crop&crop=face' },
              { name: 'Daniel Hailu', role: t.about.concierge, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face' },
              { name: 'Hiwot Teshome', role: t.about.spa_director, image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face' },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm text-[#D4A853]">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
