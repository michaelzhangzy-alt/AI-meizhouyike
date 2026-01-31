import React from 'react';
import { Hero } from '../components/home/Hero';
import { QuickEntry } from '../components/home/QuickEntry';
import { FeaturedContent } from '../components/home/FeaturedContent';
import { ConversionSection } from '../components/home/ConversionSection';
import { SEO } from '../components/SEO';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';

const Home = () => {
  const { handleRegister } = usePublicLayoutContext();

  return (
    <>
      <SEO />
      <Hero onRegister={() => handleRegister('home_hero')} />
      <QuickEntry />
      <FeaturedContent />
      <ConversionSection />
    </>
  );
};

export default Home;
