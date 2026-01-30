
import React, { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LeadModal } from '../home/LeadModal';

type PublicLayoutContextType = {
  handleRegister: (source: string, course?: string) => void;
};

export function PublicLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState('navbar');
  const [interestedCourse, setInterestedCourse] = useState<string | undefined>(undefined);

  const handleRegister = (source: string, course?: string) => {
    setModalSource(source);
    setInterestedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onRegisterClick={() => handleRegister('navbar')} />
      <main className="flex-1">
        <Outlet context={{ handleRegister }} />
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
}

export function usePublicLayoutContext() {
  return useOutletContext<PublicLayoutContextType>();
}
