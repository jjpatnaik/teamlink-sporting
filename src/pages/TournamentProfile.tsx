
import React from 'react';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useTournamentData } from "@/hooks/useTournamentData";
import { 
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Users,
  Award,
  Instagram,
  Twitter,
  Youtube,
  Link,
  Mail,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const TournamentProfile = () => {
  const { tournament, teams, loading, isOrganizer, currentUserId, addTeam } = useTournamentData();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-sport-purple"></div>
    </div>;
  }

  if (!tournament) {
    return <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Tournament not found</h1>
      <Button onClick={() => navigate('/')}>Return to Home</Button>
    </div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-sport-purple/90 to-sport-blue/90 relative">
              {isOrganizer && (
                <Button variant="ghost" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white">
                  Edit Profile
                </Button>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="relative px-6 pt-16 pb-6">
              <div className="absolute -top-16 left-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-sport-light-purple flex items-center justify-center overflow-hidden">
                  <Trophy className="w-20 h-20 text-sport-purple" />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{tournament.name}</h1>
                  <p className="text-xl text-sport-purple">{tournament.sport} Tournament</p>
                  {tournament.location && (
                    <div className="flex items-center mt-2 text-sport-gray">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{tournament.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button className="btn-primary" onClick={() => {
                    if (currentUserId) {
                      // Show registration modal
                    } else {
                      navigate('/login');
                    }
                  }}>Register Team</Button>
                  <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
                    Contact
                  </Button>
                </div>
              </div>
              
              {/* Tournament Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">About the Tournament</h2>
                <p className="text-sport-gray">
                  {tournament.description || "No description available."}
                </p>
              </div>
              
              {/* Tournament Details */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Dates</p>
                  <p className="text-lg font-semibold">
                    {tournament.start_date && tournament.end_date ? 
                      `${new Date(tournament.start_date).toLocaleDateString()} - ${new Date(tournament.end_date).toLocaleDateString()}` : 
                      "TBD"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Teams</p>
                  <p className="text-lg font-semibold">{teams.length}/{tournament.teams_allowed}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Location</p>
                  <p className="text-lg font-semibold">{tournament.location || "TBD"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Format</p>
                  <p className="text-lg font-semibold">{tournament.format}</p>
                </div>
              </div>
              
              {/* Schedule */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Tournament Schedule</h2>
                
                <div className="space-y-4">
                  {tournament.start_date ? (
                    <>
                      <div className="border-l-4 border-sport-purple pl-4 pb-4">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-sport-purple mr-2" />
                          <span className="text-sm text-sport-gray">
                            {new Date(tournament.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mt-1">Opening Ceremony & Group Stage</h3>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 text-sport-gray mr-1" />
                          <span className="text-sm text-sport-gray">9:00 AM - 8:00 PM</span>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-sport-purple pl-4 pb-4">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-sport-purple mr-2" />
                          <span className="text-sm text-sport-gray">
                            {tournament.end_date && new Date(tournament.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mt-1">Finals & Award Ceremony</h3>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 text-sport-gray mr-1" />
                          <span className="text-sm text-sport-gray">3:00 PM - 9:00 PM</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-sport-gray">
                      Schedule will be announced soon
                    </div>
                  )}
                </div>
              </div>
              
              {/* Participating Teams */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Registered Teams</h2>
                
                {teams.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {teams.map((team) => (
                      <div key={team.id} className="bg-gray-50 p-4 rounded-lg flex items-center">
                        <div className="w-10 h-10 bg-sport-light-purple rounded-full flex items-center justify-center mr-3">
                          <span className="font-bold">
                            {team.team_name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{team.team_name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-sport-gray">
                    No teams registered yet. Be the first one to register!
                  </div>
                )}
                
                {teams.length > 6 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" className="border-sport-purple text-sport-purple hover:bg-sport-light-purple">
                      View All Teams
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Sponsors */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Sponsors</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg h-24 flex items-center justify-center">
                    <span className="font-bold text-xl text-sport-gray">Sponsor A</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg h-24 flex items-center justify-center">
                    <span className="font-bold text-xl text-sport-gray">Sponsor B</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg h-24 flex items-center justify-center">
                    <span className="font-bold text-xl text-sport-gray">Sponsor C</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg h-24 flex items-center justify-center">
                    <span className="font-bold text-xl text-sport-gray">Sponsor D</span>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-sport-blue text-sport-blue hover:bg-sport-soft-blue">
                    Become a Sponsor
                  </Button>
                </div>
              </div>
              
              {/* Contact & Social Media */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-sport-gray mr-2" />
                      <span>info@midwestchampionship.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-sport-gray mr-2" />
                      <span>+1 (312) 555-9876</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-sport-gray mr-2" />
                      <span>{tournament.location || "Location TBD"}</span>
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
    </>
  );
};

export default TournamentProfile;
