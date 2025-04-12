
import React from 'react';
import { 
  UserCircle, 
  Users, 
  Trophy, 
  Briefcase, 
  CheckCircle,
  MessageSquare, 
  Globe, 
  PenTool
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const profileTypes = [
    {
      title: "Players",
      icon: UserCircle,
      description: "Create your professional profile to showcase your skills, achievements, and career history.",
      features: ["Highlight your stats", "Share game footage", "Connect with teams", "Get discovered by scouts"],
      path: "/players"
    },
    {
      title: "Teams",
      icon: Users,
      description: "Build your team profile to attract talent, engage with fans, and connect with sponsors.",
      features: ["Recruit new players", "Announce team news", "Promote team events", "Connect with sponsors"],
      path: "/teams"
    },
    {
      title: "Tournaments",
      icon: Trophy,
      description: "Organize and promote your tournaments, recruit teams, and attract sponsors.",
      features: ["Create tournament pages", "Manage registrations", "Live updates", "Sponsor integration"],
      path: "/tournaments"
    },
    {
      title: "Sponsors",
      icon: Briefcase,
      description: "Find athletes and teams that align with your brand values for successful partnerships.",
      features: ["Discover talent", "Track engagement", "Measure ROI", "Build relationships"],
      path: "/sponsors"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="section-title">How Sportshive Works</h2>
          <p className="text-lg text-sport-gray max-w-3xl mx-auto">
            Our platform connects all parts of the sports ecosystem in one professional network.
            Build your profile, grow your network, and advance your sports career.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {profileTypes.map((profile, index) => (
            <Link key={index} to={profile.path} className="card-container flex flex-col h-full hover:shadow-md transition-shadow duration-300 hover:border-sport-purple">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-sport-light-purple">
                  <profile.icon className="w-8 h-8 text-sport-purple" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-center mb-3">{profile.title}</h3>
              <p className="text-sport-gray text-center mb-6">{profile.description}</p>
              
              <div className="mt-auto">
                <ul className="space-y-2">
                  {profile.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-sport-purple mr-2 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 md:mt-24 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Why Join Sportshive?</h3>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <Globe className="w-12 h-12 text-sport-purple mb-4" />
              <h4 className="text-lg font-semibold mb-2">Global Reach</h4>
              <p className="text-sport-gray text-center">Connect with the sports community worldwide</p>
            </div>
            
            <div className="flex flex-col items-center">
              <MessageSquare className="w-12 h-12 text-sport-purple mb-4" />
              <h4 className="text-lg font-semibold mb-2">Direct Communication</h4>
              <p className="text-sport-gray text-center">Message teams, players, and sponsors directly</p>
            </div>
            
            <div className="flex flex-col items-center">
              <PenTool className="w-12 h-12 text-sport-purple mb-4" />
              <h4 className="text-lg font-semibold mb-2">Professional Profiles</h4>
              <p className="text-sport-gray text-center">Create a professional digital presence</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 text-sport-purple mb-4" />
              <h4 className="text-lg font-semibold mb-2">Community</h4>
              <p className="text-sport-gray text-center">Join a growing network of sports professionals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
