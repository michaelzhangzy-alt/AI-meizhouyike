import React from 'react';
import { Hero } from '../components/home/Hero';
import { OpenClass } from '../components/home/OpenClass';
import { Teachers } from '../components/home/Teachers';
import { SEO } from '../components/SEO';
import { usePublicLayoutContext } from '../components/layout/PublicLayout';

const Home = () => {
  const { handleRegister } = usePublicLayoutContext();

  return (
    <>
      <SEO />
      <Hero onRegister={() => handleRegister('home_hero')} />
      <OpenClass onRegister={(course) => handleRegister('home_open_class', course)} />
      <Teachers onRegister={(teacher) => handleRegister('home_teacher', teacher)} />
    </>
  );
};

export default Home;
