
import React from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import GetStartedCTA from '@/components/GetStartedCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <GetStartedCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
