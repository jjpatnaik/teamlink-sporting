
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  UserCircle,
  MapPin,
  Award,
  Calendar,
  Clock,
  Instagram,
  Twitter,
  Youtube,
  Link
} from 'lucide-react';

const PlayerProfile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-sport-purple to-sport-blue relative">
            <Button variant="ghost" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white">
              Edit Profile
            </Button>
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pt-16 pb-6">
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-sport-light-purple flex items-center justify-center overflow-hidden">
                <UserCircle className="w-24 h-24 text-sport-purple" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-3xl font-bold">John Smith</h1>
                <p className="text-xl text-sport-purple">Basketball Player</p>
                <div className="flex items-center mt-2 text-sport-gray">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Chicago, IL, USA</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button className="btn-primary">Connect</Button>
                <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
                  Message
                </Button>
              </div>
            </div>
            
            {/* Bio */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sport-gray">
                Professional basketball player with 5+ years of experience playing at collegiate and semi-professional levels. 
                Point guard with strong leadership skills, court vision, and defensive abilities.
                Looking for opportunities with professional teams in Europe or Asia.
              </p>
            </div>
            
            {/* Stats/Details */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Position</p>
                <p className="text-lg font-semibold">Point Guard</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Height</p>
                <p className="text-lg font-semibold">6'2" (188 cm)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Weight</p>
                <p className="text-lg font-semibold">185 lbs (84 kg)</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Age</p>
                <p className="text-lg font-semibold">27</p>
              </div>
            </div>
            
            {/* Career History */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Career History</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-sport-purple pl-4 pb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sport-purple mr-2" />
                    <span className="text-sm text-sport-gray">2020 - Present</span>
                  </div>
                  <h3 className="text-lg font-semibold mt-1">Chicago Breeze</h3>
                  <p className="text-sport-gray">Starting Point Guard</p>
                </div>
                
                <div className="border-l-4 border-sport-gray pl-4 pb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sport-gray mr-2" />
                    <span className="text-sm text-sport-gray">2018 - 2020</span>
                  </div>
                  <h3 className="text-lg font-semibold mt-1">Michigan Wolverines</h3>
                  <p className="text-sport-gray">Collegiate Athlete</p>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-sport-purple mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Regional League MVP</h3>
                    <p className="text-sm text-sport-gray">2022 Season</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="w-5 h-5 text-sport-purple mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">All-Star Selection</h3>
                    <p className="text-sm text-sport-gray">2021, 2022, 2023</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Connect</h2>
              
              <div className="flex space-x-4">
                <a href="#" className="text-sport-gray hover:text-[#1DA1F2] transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-sport-gray hover:text-[#E4405F] transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-sport-gray hover:text-[#FF0000] transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="text-sport-gray hover:text-sport-blue transition-colors">
                  <Link className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
