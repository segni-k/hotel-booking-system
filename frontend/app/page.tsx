'use client';

import HeroSection from '@/components/home/HeroSection';
import SearchBar from '@/components/home/SearchBar';
import Features from '@/components/home/Features';
import FeaturedRooms from '@/components/home/FeaturedRooms';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import CallToAction from '@/components/home/CallToAction';
import LocationMap from '@/components/home/LocationMap';
import Newsletter from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <Features />
      <FeaturedRooms />
      <Stats />
      <Testimonials />
      <CallToAction />
      <LocationMap />
      <Newsletter />
    </>
  );
}
