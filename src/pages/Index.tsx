
import React from 'react';
import HeroSection from '@/components/HeroSection';
import HowItWorks from '@/components/HowItWorks';
import GetStartedCTA from '@/components/GetStartedCTA';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <HowItWorks />
        <GetStartedCTA />
      </main>
    </div>
  );
};

export default Index;
