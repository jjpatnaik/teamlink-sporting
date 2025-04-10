
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GetStartedCTA from '@/components/GetStartedCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <GetStartedCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
