
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import PlayerInvitationModal from "@/components/team/PlayerInvitationModal";
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
  Phone,
  ArrowLeft,
  UserPlus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TeamData {
  id: string;
  name: string;
  description?: string;
  sport?: string;
  established_year?: number;
  achievements?: string;
  introduction?: string;
  owner_id: string;
  created_at: string;
  member_count: number;
}

const TeamProfile = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      console.log('TeamProfile: No teamId provided, navigating to teams');
      navigate('/teams');
      return;
    }

    fetchTeamData();
  }, [teamId]);

  const fetchTeamData = async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      console.log('TeamProfile: Fetching team data for ID:', teamId);

      // Fetch team details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) {
        console.error('TeamProfile: Error fetching team:', teamError);
        throw teamError;
      }

      if (!teamData) {
        console.error('TeamProfile: No team found with ID:', teamId);
        toast.error('Team not found');
        navigate('/teams');
        return;
      }

      // Get member count
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId);

      let memberCount = 0;
      if (membersError) {
        console.error('Error fetching member count:', membersError);
      } else {
        memberCount = membersData?.length || 0;
      }

      // Check current user's role in the team
      if (user) {
        const { data: memberData, error: memberError } = await supabase
          .from('team_members')
          .select('role')
          .eq('team_id', teamId)
          .eq('user_id', user.id)
          .single();

        if (!memberError && memberData) {
          setUserRole(memberData.role);
        }
      }

      const formattedTeam: TeamData = {
        id: teamData.id,
        name: teamData.name,
        description: teamData.description,
        sport: teamData.sport,
        established_year: teamData.established_year,
        achievements: teamData.achievements,
        introduction: teamData.introduction,
        owner_id: teamData.owner_id,
        created_at: teamData.created_at,
        member_count: memberCount
      };

      console.log('TeamProfile: Team data loaded:', formattedTeam);
      setTeam(formattedTeam);
    } catch (error: any) {
      console.error('Error fetching team data:', error);
      toast.error('Failed to load team data');
      navigate('/teams');
    } finally {
      setLoading(false);
    }
  };

  const canManageTeam = () => {
    if (!user || !team) return false;
    return user.id === team.owner_id || ['owner', 'captain'].includes(userRole || '');
  };

  const handleAddPlayer = () => {
    if (!canManageTeam()) {
      toast.error('Only team owners and captains can invite players');
      return;
    }
    setIsInvitationModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </>
    );
  }

  if (!team) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Not Found</h2>
            <p className="text-gray-600 mb-4">The team you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/teams')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/teams')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Button>
        </div>

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
                  <h1 className="text-3xl font-bold">{team.name}</h1>
                  <p className="text-xl text-sport-blue">{team.sport || 'Sports Team'}</p>
                  <div className="flex items-center mt-2 text-sport-gray">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Location not specified</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex space-x-2">
                  {canManageTeam() && (
                    <Button 
                      onClick={handleAddPlayer}
                      className="bg-sport-blue hover:bg-sport-blue/90 text-white"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  )}
                  <Button variant="outline" className="border-sport-blue text-sport-blue hover:bg-sport-soft-blue">
                    Message
                  </Button>
                </div>
              </div>
              
              {/* Team Description */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">About the Team</h2>
                <p className="text-sport-gray">
                  {team.description || team.introduction || 'No description available for this team.'}
                </p>
              </div>
              
              {/* Stats/Details */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Sport</p>
                  <p className="text-lg font-semibold">{team.sport || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Founded</p>
                  <p className="text-lg font-semibold">{team.established_year || 'Not specified'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Members</p>
                  <p className="text-lg font-semibold">{team.member_count}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-sport-gray">Created</p>
                  <p className="text-lg font-semibold">{new Date(team.created_at).getFullYear()}</p>
                </div>
              </div>
              
              {/* Achievements */}
              {team.achievements && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Team Achievements</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Trophy className="w-5 h-5 text-sport-blue mr-2 mt-0.5" />
                      <div>
                        <p className="text-sport-gray">{team.achievements}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact & Social Media */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-sport-gray mr-2" />
                      <span>Contact information not available</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-sport-gray mr-2" />
                      <span>Phone not available</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-sport-gray mr-2" />
                      <span>Address not available</span>
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

        {/* Player Invitation Modal */}
        <PlayerInvitationModal
          isOpen={isInvitationModalOpen}
          onClose={() => setIsInvitationModalOpen(false)}
          teamId={teamId || ''}
          teamName={team.name}
        />
      </div>
    </>
  );
};

export default TeamProfile;
