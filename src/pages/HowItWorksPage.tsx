
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import { Button } from "@/components/ui/button";
import { 
  UserCircle, 
  Users, 
  Trophy, 
  Briefcase,
  ArrowRight,
  CheckCircle,
  Star,
  MessageSquare,
  Share2,
  Search
} from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-sport-soft-blue py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                How <span className="text-sport-purple">Sportshive</span> Works
              </h1>
              <p className="text-lg md:text-xl text-sport-gray mb-8">
                Sportshive connects players, teams, tournaments, and sponsors in one professional sports network.
                Discover how our platform can help you advance your sports career or organization.
              </p>
            </div>
          </div>
        </section>
        
        {/* Core Features */}
        <HowItWorks />
        
        {/* User Journey */}
        <section className="py-16 md:py-24 bg-sport-soft-blue/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="section-title">Your Sportshive Journey</h2>
              <p className="text-lg text-sport-gray max-w-3xl mx-auto">
                Getting started with Sportshive is easy. Follow these simple steps to create your profile
                and start connecting with the sports community.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Timeline */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-sport-purple/30 transform -translate-x-1/2"></div>
                
                {/* Step 1 */}
                <div className="relative mb-12 md:mb-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                      <h3 className="text-2xl font-bold mb-3">Create Your Profile</h3>
                      <p className="text-sport-gray">
                        Sign up and select your profile type. Fill in your details, add photos, videos, and highlight your achievements.
                      </p>
                    </div>
                    
                    <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 bg-white rounded-full border-4 border-sport-purple p-3">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sport-purple text-white">
                        <span className="text-xl font-bold">1</span>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 md:pl-12 md:text-left flex md:block justify-center">
                      <div className="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-sport-light-purple">
                        <UserCircle className="w-8 h-8 md:w-16 md:h-16 text-sport-purple" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative mb-12 md:mb-24">
                  <div className="flex flex-col md:flex-row-reverse items-center">
                    <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 md:text-left">
                      <h3 className="text-2xl font-bold mb-3">Connect with Others</h3>
                      <p className="text-sport-gray">
                        Search for players, teams, tournaments, or sponsors. Send connection requests and grow your network.
                      </p>
                    </div>
                    
                    <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 bg-white rounded-full border-4 border-sport-purple p-3">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sport-purple text-white">
                        <span className="text-xl font-bold">2</span>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 md:pr-12 md:text-right flex md:block justify-center">
                      <div className="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-sport-light-purple">
                        <Users className="w-8 h-8 md:w-16 md:h-16 text-sport-purple" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative mb-12 md:mb-24">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 md:text-right">
                      <h3 className="text-2xl font-bold mb-3">Explore Opportunities</h3>
                      <p className="text-sport-gray">
                        Discover tournaments, team openings, sponsorship opportunities, and more through your network and our search features.
                      </p>
                    </div>
                    
                    <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 bg-white rounded-full border-4 border-sport-purple p-3">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sport-purple text-white">
                        <span className="text-xl font-bold">3</span>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 md:pl-12 md:text-left flex md:block justify-center">
                      <div className="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-sport-light-purple">
                        <Search className="w-8 h-8 md:w-16 md:h-16 text-sport-purple" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row-reverse items-center">
                    <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0 md:text-left">
                      <h3 className="text-2xl font-bold mb-3">Grow Your Career</h3>
                      <p className="text-sport-gray">
                        Engage with your connections, showcase your achievements, and take your sports career or organization to the next level.
                      </p>
                    </div>
                    
                    <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10 bg-white rounded-full border-4 border-sport-purple p-3">
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sport-purple text-white">
                        <span className="text-xl font-bold">4</span>
                      </div>
                    </div>
                    
                    <div className="md:w-1/2 md:pr-12 md:text-right flex md:block justify-center">
                      <div className="w-16 h-16 md:w-32 md:h-32 flex items-center justify-center rounded-full bg-sport-light-purple">
                        <Trophy className="w-8 h-8 md:w-16 md:h-16 text-sport-purple" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="section-title">Key Platform Features</h2>
              <p className="text-lg text-sport-gray max-w-3xl mx-auto">
                Sportshive offers a comprehensive set of features designed to connect the sports community
                and provide value to all users.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="card-container">
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sport-light-purple">
                    <UserCircle className="w-7 h-7 text-sport-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Professional Profiles</h3>
                <p className="text-sport-gray text-center">
                  Create detailed profiles showcasing your skills, achievements, stats, and career history.
                </p>
              </div>
              
              <div className="card-container">
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sport-light-purple">
                    <MessageSquare className="w-7 h-7 text-sport-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Direct Messaging</h3>
                <p className="text-sport-gray text-center">
                  Connect directly with players, teams, tournaments, and sponsors through our messaging system.
                </p>
              </div>
              
              <div className="card-container">
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sport-light-purple">
                    <Search className="w-7 h-7 text-sport-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Advanced Search</h3>
                <p className="text-sport-gray text-center">
                  Find exactly what you're looking for with our powerful search filters by sport, location, skill level, and more.
                </p>
              </div>
              
              <div className="card-container">
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sport-light-purple">
                    <Trophy className="w-7 h-7 text-sport-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Tournament Management</h3>
                <p className="text-sport-gray text-center">
                  Create, manage, and promote tournaments, with team registration and results tracking.
                </p>
              </div>
              
              <div className="card-container">
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sport-light-purple">
                    <Star className="w-7 h-7 text-sport-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Endorsements & Reviews</h3>
                <p className="text-sport-gray text-center">
                  Build credibility with endorsements and reviews from your connections and collaborators.
                </p>
              </div>
              
              <div className="card-container">
                <div className="mb-4 flex justify-center">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full bg-sport-light-purple">
                    <Share2 className="w-7 h-7 text-sport-purple" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Media Sharing</h3>
                <p className="text-sport-gray text-center">
                  Share photos, videos, and highlights directly on your profile to showcase your abilities.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="text-lg text-sport-gray max-w-3xl mx-auto">
                Have questions about Sportshive? Find answers to our most commonly asked questions below.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Is Sportshive free to use?</h3>
                <p className="text-sport-gray">
                  Sportshive offers both free and premium membership options. The free membership provides basic profile creation and networking features, while premium memberships unlock advanced features like priority placement in search results, detailed analytics, and enhanced media storage.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Which sports are supported on Sportshive?</h3>
                <p className="text-sport-gray">
                  Sportshive supports a wide range of sports including basketball, football, soccer, baseball, volleyball, tennis, cricket, rugby, hockey, and many more. We're constantly expanding our sport categories based on user demand.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">How can sponsors find athletes to sponsor?</h3>
                <p className="text-sport-gray">
                  Sponsors can use our advanced search functionality to find athletes based on sport, location, skill level, achievements, and more. They can also browse trending profiles and receive personalized recommendations based on their sponsorship preferences.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">How can teams use Sportshive for recruitment?</h3>
                <p className="text-sport-gray">
                  Teams can create recruitment listings specifying the positions they're looking to fill and the qualifications they're seeking. They can also search for players using our advanced filters, review player profiles, and directly message potential recruits.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Can I use Sportshive for youth sports?</h3>
                <p className="text-sport-gray">
                  Yes, Sportshive is designed for athletes of all ages. For users under 18, we offer special youth profiles with enhanced privacy protections and parental consent requirements. Youth teams and tournaments can also create profiles to connect with their community.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-sport-purple to-sport-blue">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join the Sportshive Community?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Create your profile today and start connecting with players, teams, tournaments, and sponsors.
              </p>
              <Button className="bg-white text-sport-purple hover:bg-gray-100 text-lg" size="lg">
                Create Your Profile
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
