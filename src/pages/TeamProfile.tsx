
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Users,
  MapPin,
  Trophy,
  Calendar,
  Instagram,
  Twitter,
  Youtube,
  Link,
  Mail,
  Phone
} from 'lucide-react';

const TeamProfile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-sport-blue to-sport-purple relative">
            <Button variant="ghost" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white">
              Edit Profile
            </Button>
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pt-16 pb-6">
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-sport-light-purple flex items-center justify-center overflow-hidden">
                <Users className="w-20 h-20 text-sport-purple" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-3xl font-bold">Chicago Thunder</h1>
                <p className="text-xl text-sport-blue">Professional Basketball Team</p>
                <div className="flex items-center mt-2 text-sport-gray">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Chicago, IL, USA</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button className="btn-secondary">Connect</Button>
                <Button variant="outline" className="border-sport-blue text-sport-blue hover:bg-sport-soft-blue">
                  Message
                </Button>
              </div>
            </div>
            
            {/* Team Description */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About the Team</h2>
              <p className="text-sport-gray">
                Chicago Thunder is a professional basketball team competing in the National Basketball League. 
                Founded in 2010, the team has established itself as a strong contender with multiple playoff appearances. 
                The Thunder are known for their fast-paced offense and community engagement initiatives.
              </p>
            </div>
            
            {/* Stats/Details */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">League</p>
                <p className="text-lg font-semibold">National Basketball League</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Founded</p>
                <p className="text-lg font-semibold">2010</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Home Arena</p>
                <p className="text-lg font-semibold">Thunder Center</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Capacity</p>
                <p className="text-lg font-semibold">15,000</p>
              </div>
            </div>
            
            {/* Achievements */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Team Achievements</h2>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Trophy className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">NBL Champions</h3>
                    <p className="text-sm text-sport-gray">2018, 2021</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Trophy className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Division Champions</h3>
                    <p className="text-sm text-sport-gray">2016, 2017, 2018, 2020, 2021</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Trophy className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Playoff Appearances</h3>
                    <p className="text-sm text-sport-gray">8 consecutive seasons (2015-Present)</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Upcoming Games */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Upcoming Games</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-sport-blue mr-2" />
                    <span className="text-sm font-semibold">April 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-sport-light-purple rounded-full flex items-center justify-center mr-2">
                        <span className="font-bold">CT</span>
                      </div>
                      <span>Chicago Thunder</span>
                    </div>
                    <span className="text-sm">vs</span>
                    <div className="flex items-center">
                      <span>New York Stars</span>
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center ml-2">
                        <span className="font-bold">NS</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-sport-blue mr-2" />
                    <span className="text-sm font-semibold">April 22, 2025</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="font-bold">BS</span>
                      </div>
                      <span>Boston Sharks</span>
                    </div>
                    <span className="text-sm">vs</span>
                    <div className="flex items-center">
                      <span>Chicago Thunder</span>
                      <div className="w-10 h-10 bg-sport-light-purple rounded-full flex items-center justify-center ml-2">
                        <span className="font-bold">CT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact & Social Media */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-sport-gray mr-2" />
                    <span>info@chicagothunder.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-sport-gray mr-2" />
                    <span>+1 (312) 555-1234</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-sport-gray mr-2" />
                    <span>123 Thunder Blvd, Chicago, IL</span>
                  </div>
                </div>
              </div>
              
              <div>
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
    </div>
  );
};

export default TeamProfile;
