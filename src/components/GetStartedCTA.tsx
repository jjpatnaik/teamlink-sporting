
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GetStartedCTA = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-sport-purple to-sport-blue">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Your Sports Career to the Next Level?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of players, teams, tournaments, and sponsors on Sportshive.
            Create your profile today and start connecting with the sports community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-sport-purple hover:bg-gray-100 text-lg" size="lg" asChild>
              <Link to="/signup">Create Your Profile</Link>
            </Button>
            <Button className="bg-white text-sport-purple hover:bg-gray-100 text-lg" size="lg" asChild>
              <Link to="/players">Explore Profiles</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedCTA;
