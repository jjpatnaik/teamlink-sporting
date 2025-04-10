
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Briefcase,
  MapPin,
  Users,
  Building,
  Award,
  Instagram,
  Twitter,
  Youtube,
  Link as LinkIcon,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

const SponsorProfile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-sport-bright-blue to-sport-blue relative">
            <Button variant="ghost" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white">
              Edit Profile
            </Button>
          </div>
          
          {/* Profile Info */}
          <div className="relative px-6 pt-16 pb-6">
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-sport-soft-blue flex items-center justify-center overflow-hidden">
                <Briefcase className="w-20 h-20 text-sport-blue" />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-3xl font-bold">SportsTech Inc.</h1>
                <p className="text-xl text-sport-blue">Sports Equipment & Technology</p>
                <div className="flex items-center mt-2 text-sport-gray">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Chicago, IL, USA</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-2">
                <Button className="btn-secondary">Connect</Button>
                <Button variant="outline" className="border-sport-blue text-sport-blue hover:bg-sport-soft-blue">
                  Partnership Inquiry
                </Button>
              </div>
            </div>
            
            {/* Company Description */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">About SportsTech</h2>
              <p className="text-sport-gray">
                SportsTech Inc. is a leading provider of sports equipment and performance monitoring technology. 
                Founded in 2010, we've been at the forefront of innovation in sports technology, 
                helping athletes at all levels improve their performance through data-driven insights and premium equipment. 
                We sponsor teams and tournaments across the Midwest region and are actively looking to expand our sponsorship portfolio.
              </p>
            </div>
            
            {/* Company Details */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Founded</p>
                <p className="text-lg font-semibold">2010</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Employees</p>
                <p className="text-lg font-semibold">250+</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Industry</p>
                <p className="text-lg font-semibold">Sports Technology</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-sport-gray">Website</p>
                <p className="text-lg font-semibold truncate">sportstech.com</p>
              </div>
            </div>
            
            {/* Sponsorship Information */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Sponsorship Opportunities</h2>
              
              <div className="space-y-4">
                <div className="bg-sport-soft-blue/30 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-sport-bright-blue mb-2">What We Offer</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Financial sponsorship for teams and tournaments</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Equipment and technology provision</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Performance analytics and coaching support</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Marketing and promotional collaboration</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-sport-soft-blue/30 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-sport-bright-blue mb-2">What We Look For</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Teams and athletes that align with our brand values</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Tournaments with regional or national visibility</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Opportunities for product testing and feedback</span>
                    </li>
                    <li className="flex items-start">
                      <Award className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <span>Long-term partnership potential</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Current Partnerships */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Current Partnerships</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-sport-light-purple rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">CT</span>
                  </div>
                  <span className="font-medium">Chicago Thunder</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <Trophy className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-medium">Midwest Championship</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-medium">Youth Sports League</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">JS</span>
                  </div>
                  <span className="font-medium">John Smith (Player)</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <span className="font-bold">MP</span>
                  </div>
                  <span className="font-medium">Minneapolis Power</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Trophy className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="font-medium">College Basketball Series</span>
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
                    <span>sponsorships@sportstech.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-sport-gray mr-2" />
                    <span>+1 (312) 555-8765</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-sport-gray mr-2" />
                    <a href="#" className="text-sport-blue hover:underline">www.sportstech.com</a>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-sport-gray mr-2" />
                    <span>456 Tech Blvd, Chicago, IL</span>
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
                    <LinkIcon className="w-6 h-6" />
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

export default SponsorProfile;
