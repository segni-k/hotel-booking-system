'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  FiCalendar, FiUsers, FiArrowLeft, FiArrowRight, FiCheck, FiCreditCard, FiUser, FiMail, FiPhone,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const roomsMap: Record<string, { name: string; price: number; image: string; bedType: string; maxGuests: number }> = {
  '1': { name: 'Standard Room - City View', price: 3500, image: '/images/standard-1.jpg', bedType: 'Queen', maxGuests: 2 },
  '2': { name: 'Standard Room - Garden View', price: 3800, image: '/images/standard-2.jpg', bedType: 'Queen', maxGuests: 2 },
  '3': { name: 'Standard Twin Room', price: 3200, image: '/images/standard-3.jpg', bedType: 'Twin', maxGuests: 2 },
  '4': { name: 'Standard Room - Corner', price: 4000, image: '/images/standard-4.jpg', bedType: 'King', maxGuests: 2 },
  '5': { name: 'Deluxe Suite', price: 6500, image: '/images/deluxe-1.jpg', bedType: 'King', maxGuests: 3 },
  '6': { name: 'Deluxe Room - Balcony', price: 7000, image: '/images/deluxe-2.jpg', bedType: 'King', maxGuests: 2 },
  '7': { name: 'Deluxe Family Room', price: 7500, image: '/images/deluxe-3.jpg', bedType: 'King + Twin', maxGuests: 4 },
  '8': { name: 'Deluxe Corner Suite', price: 8000, image: '/images/deluxe-4.jpg', bedType: 'King', maxGuests: 3 },
  '9': { name: 'Presidential Suite - Royal', price: 12000, image: '/images/presidential-1.jpg', bedType: 'King', maxGuests: 4 },
  '10': { name: 'Presidential Suite - Sky', price: 13000, image: '/images/presidential-2.jpg', bedType: 'King', maxGuests: 4 },
  '11': { name: 'Presidential Suite - Heritage', price: 14000, image: '/images/presidential-3.jpg', bedType: 'King + Queen', maxGuests: 6 },
  '12': { name: 'Presidential Suite - Grand', price: 15000, image: '/images/presidential-4.jpg', bedType: 'King + Queen', maxGuests: 6 },
};

const steps = ['dates', 'guest', 'review'] as const;

export default function BookingPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const room = roomsMap[id];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    checkIn: '', checkOut: '', guests: 1,
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    specialRequests: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!room) {
    return (
      <div className="pt-24 pb-16 container-custom text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t.errors.not_found}</h2>
        <Link href="/rooms" className="text-[#D4A853] hover:underline">{t.common.back}</Link>
      </div>
    );
  }

  const nights =
    form.checkIn && form.checkOut
      ? Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
      : 0;
  const totalPrice = room.price * nights;

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!form.checkIn) errs.checkIn = t.errors.required;
      if (!form.checkOut) errs.checkOut = t.errors.required;
      if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn))
        errs.checkOut = t.errors.checkout_after_checkin;
    }
    if (step === 1) {
      if (!form.firstName) errs.firstName = t.errors.required;
      if (!form.lastName) errs.lastName = t.errors.required;
      if (!form.email) errs.email = t.errors.required;
      if (!form.phone) errs.phone = t.errors.required;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1)); };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleConfirm = () => {
    toast.success(t.booking.booking_success);
    router.push(`/booking/${id}/confirmation?checkIn=${form.checkIn}&checkOut=${form.checkOut}&nights=${nights}&total=${totalPrice}`);
  };

  const today = new Date().toISOString().split('T')[0];

  const inputClass =
    'w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/20 outline-none transition-all';

  return (
    <div className="pt-20 pb-16 bg-gray-50 dark:bg-[#0F172A] min-h-screen">
      <div className="container-custom mt-4">
        <Link href={`/rooms/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#D4A853] transition-colors mb-6">
          <FiArrowLeft size={16} /> {t.common.back}
        </Link>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-[#D4A853] text-white' : i === step ? 'bg-[#D4A853]/20 text-[#D4A853] ring-2 ring-[#D4A853]' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {i < step ? <FiCheck size={16} /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`w-12 md:w-20 h-0.5 mx-1.5 transition-colors ${i < step ? 'bg-[#D4A853]' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main form area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#1E293B] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700/50"
              >
                {/* Step 0: Dates */}
                {step === 0 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiCalendar className="text-[#D4A853]" /> {t.booking.select_dates}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.search.check_in}</label>
                        <input type="date" min={today} value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                          className={inputClass.replace('pl-11', 'pl-4')} />
                        {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.search.check_out}</label>
                        <input type="date" min={form.checkIn || today} value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                          className={inputClass.replace('pl-11', 'pl-4')} />
                        {errors.checkOut && <p className="text-xs text-red-500 mt-1">{errors.checkOut}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.search.guests}</label>
                      <div className="relative">
                        <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select value={form.guests} onChange={(e) => setForm({ ...form, guests: +e.target.value })}
                          className={inputClass}>
                          {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? t.search.guest_singular : t.search.guests}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Guest Info */}
                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiUser className="text-[#D4A853]" /> {t.booking.guest_details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.booking.first_name}</label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} placeholder="John" />
                        </div>
                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.booking.last_name}</label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} placeholder="Doe" />
                        </div>
                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.auth.email}</label>
                      <div className="relative">
                        <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="email@example.com" />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.auth.phone}</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} placeholder="+251 9XX XXX XXX" />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t.booking.special_requests}</label>
                      <textarea value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/20 outline-none transition-all resize-none h-24"
                        placeholder={t.booking.special_requests_placeholder} />
                    </div>
                  </div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FiCreditCard className="text-[#D4A853]" /> {t.booking.review_booking}
                    </h2>
                    <div className="space-y-4">
                      {[
                        { label: t.search.check_in, value: form.checkIn },
                        { label: t.search.check_out, value: form.checkOut },
                        { label: t.booking.nights, value: `${nights}` },
                        { label: t.search.guests, value: `${form.guests}` },
                        { label: t.booking.guest_name, value: `${form.firstName} ${form.lastName}` },
                        { label: t.auth.email, value: form.email },
                        { label: t.auth.phone, value: form.phone },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">{label}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                    {form.specialRequests && (
                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t.booking.special_requests}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{form.specialRequests}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  {step > 0 ? (
                    <button onClick={prevStep} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <FiArrowLeft size={16} /> {t.common.back}
                    </button>
                  ) : <div />}
                  {step < steps.length - 1 ? (
                    <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all">
                      {t.common.next} <FiArrowRight size={16} />
                    </button>
                  ) : (
                    <button onClick={handleConfirm} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-gold text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all">
                      <FiCheck size={16} /> {t.booking.confirm_booking}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar: Room summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 shadow-lg dark:shadow-black/20">
              <div className="relative h-44">
                <Image src={room.image} alt={room.name} fill className="object-cover" sizes="400px" />
              </div>
              <div className="p-5 space-y-4">
                <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-gray-900 dark:text-white">
                  {room.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t.room.bed_type}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{room.bedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t.room.per_night}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{room.price.toLocaleString()} ETB</span>
                  </div>
                  {nights > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">{t.booking.nights}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{nights}</span>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700/50 pt-2 flex justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">{t.booking.total}</span>
                        <span className="font-bold text-gradient-gold text-lg">{totalPrice.toLocaleString()} ETB</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
