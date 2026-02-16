'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register, isLoading: loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = t.errors.required;
    if (!form.email) errs.email = t.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t.errors.invalid_email;
    if (!form.phone) errs.phone = t.errors.required;
    if (!form.password) errs.password = t.errors.required;
    else if (form.password.length < 8) errs.password = t.errors.min_length;
    if (form.password !== form.password_confirmation) errs.password_confirmation = t.errors.passwords_mismatch;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form);
      toast.success(t.auth.register_success);
      router.push('/');
    } catch {
      toast.error(t.errors.register_failed);
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/20 outline-none transition-all';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-gray-50 dark:bg-[#0F172A]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-5 sm:p-8 shadow-xl dark:shadow-black/30 border border-gray-100 dark:border-gray-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <span className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-gradient-gold">
                EliteStay
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.auth.register}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.auth.register_subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.auth.full_name}
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" value={form.name} onChange={handleChange('name')} className={inputClass} placeholder="John Doe" />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.auth.email}
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="email" value={form.email} onChange={handleChange('email')} className={inputClass} placeholder="email@example.com" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.auth.phone}
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="tel" value={form.phone} onChange={handleChange('phone')} className={inputClass} placeholder="+251 9XX XXX XXX" />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.auth.password}
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange('password')}
                  className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#D4A853] focus:ring-2 focus:ring-[#D4A853]/20 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t.auth.confirm_password}
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={handleChange('password_confirmation')}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              {errors.password_confirmation && <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-1 accent-[#D4A853]" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.auth.agree_terms}{' '}
                <Link href="/terms" className="text-[#D4A853] hover:underline">{t.auth.terms_conditions}</Link>
                {' '}&{' '}
                <Link href="/privacy" className="text-[#D4A853] hover:underline">{t.auth.privacy_policy}</Link>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white font-semibold bg-gradient-gold rounded-xl hover:shadow-lg hover:shadow-[#D4A853]/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.common.loading}
                </span>
              ) : (
                t.auth.register
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {t.auth.have_account}{' '}
            <Link href="/auth/login" className="text-[#D4A853] font-semibold hover:underline">
              {t.auth.login}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
