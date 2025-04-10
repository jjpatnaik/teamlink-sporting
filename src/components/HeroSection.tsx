
import React from 'react';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-sport-soft-blue">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-sport-dark">Sports</span> meets 
              <span className="text-sport-purple"> Social</span>
            </h1>
            <p className="text-lg md:text-xl text-sport-gray mb-8 max-w-lg mx-auto lg:mx-0">
              Connect with players, teams, tournaments, and sponsors. Build your professional sports network and take your career to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="btn-primary text-lg" size="lg">
                Join Now
              </Button>
              <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple text-lg" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform transition duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-sport-purple/30 to-sport-blue/30 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80"
                alt="Athletes networking"
                className="w-full h-auto"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-lg overflow-hidden shadow-xl transform -rotate-6 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80"
                alt="Team huddle"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-lg overflow-hidden shadow-xl transform rotate-6 hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80"
                alt="Stadium"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
