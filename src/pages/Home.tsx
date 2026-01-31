import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/home/Hero';
import { OpenClass } from '../components/home/OpenClass';
import { Teachers } from '../components/home/Teachers';
import { LeadModal } from '../components/home/LeadModal';
import { SEO } from '../components/SEO';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState('home_hero');
  const [interestedCourse, setInterestedCourse] = useState<string | undefined>(undefined);

  const handleRegister = (source: string, course?: string) => {
    setModalSource(source);
    setInterestedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO />
      <Navbar onRegisterClick={() => handleRegister('navbar')} />
      <main className="flex-1">
        <Hero onRegister={() => handleRegister('home_hero')} />
        <OpenClass onRegister={(course) => handleRegister('home_open_class', course)} />
        <Teachers onRegister={(teacher) => handleRegister('home_teacher', teacher)} />
      </main>
      <Footer />
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        source={modalSource}
        interestedCourse={interestedCourse}
      />
    </div>
  );
};

export default Home;
