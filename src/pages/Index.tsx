
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedTournaments from '@/components/FeaturedTournaments';
import HowItWorks from '@/components/HowItWorks';
import GetStartedCTA from '@/components/GetStartedCTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedTournaments />
        <HowItWorks />
        <GetStartedCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
