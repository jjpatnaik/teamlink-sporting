import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Users, MapPin, Search, Plus, Crown, Shield, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTeams } from '@/hooks/useTeams';
import { sportsOptions } from '@/constants/sportOptions';
import { useAuth } from '@/hooks/useAuth';
import CreateTeamModal from '@/components/team/CreateTeamModal';

const TeamsPage = () => {
  const navigate = useNavigate();
  const { teams, loading } = useTeams();
  const { hasRole, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const canCreateTeams = hasRole('team_admin') || hasRole('player') || user;

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'all' || team.sport === selectedSport;
    const matchesOwnership = ownershipFilter === 'all' || 
                           (ownershipFilter === 'owned' && team.isOwned) ||
                           (ownershipFilter === 'not_owned' && !team.isOwned);
    const matchesMembership = membershipFilter === 'all' ||
                            (membershipFilter === 'member' && team.isMember) ||
                            (membershipFilter === 'not_member' && !team.isMember);
    return matchesSearch && matchesSport && matchesOwnership && matchesMembership;
  });

  const handleTeamCreated = () => {
    setShowCreateModal(false);
    // Refresh teams list would happen automatically through useTeams
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sport-purple mx-auto mb-4"></div>
            <p className="text-sport-gray">Loading teams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-sport-blue to-sport-purple bg-clip-text text-transparent">
              Discover Teams
            </h1>
            <p className="text-sport-gray text-lg">
              Find and join exciting sports teams in your community
            </p>
          </div>
          {canCreateTeams && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-sport-purple hover:bg-sport-purple/90 text-white flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Team</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-sport-light-purple/20 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sport-gray h-4 w-4" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-sport-light-purple/50 focus-visible:ring-sport-purple/40"
              />
            </div>
          </div>
          
          <div>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">All Sports</SelectItem>
                {sportsOptions.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={ownershipFilter} onValueChange={setOwnershipFilter}>
              <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                <SelectValue placeholder="Ownership" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="owned">My Teams</SelectItem>
                <SelectItem value="not_owned">Other Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger className="border-sport-light-purple/50 focus-visible:ring-sport-purple/40">
                <SelectValue placeholder="Membership" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="member">Teams I'm In</SelectItem>
                <SelectItem value="not_member">Teams I Can Join</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-sport-gray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-sport-gray mb-2">No teams found</h3>
          <p className="text-sport-gray">
            {searchTerm || selectedSport !== 'all' ? 
              'Try adjusting your search criteria to find more teams.' :
              'No teams are currently available. Be the first to create one!'
            }
          </p>
          {canCreateTeams && !searchTerm && selectedSport === 'all' && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 bg-sport-purple hover:bg-sport-purple/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer border border-sport-light-purple/20">
              <div className="relative h-48 bg-gradient-to-r from-sport-blue to-sport-purple rounded-t-lg">
                <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-white/90 text-sport-purple">
                    {team.sport}
                  </Badge>
                  {team.isOwned && (
                    <Badge className="bg-yellow-500/90 text-white flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Owner
                    </Badge>
                  )}
                  {team.isMember && !team.isOwned && (
                    <Badge className="bg-green-500/90 text-white flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {team.membershipRole || 'Member'}
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{team.name}</CardTitle>
                {team.description && (
                  <p className="text-sport-gray text-sm line-clamp-2">
                    {team.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-sport-gray">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{team.member_count || 0} members</span>
                    </div>
                    <div className="flex items-center text-sport-gray">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(team.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigate(`/team/${team.id}`)}
                        className="bg-sport-purple hover:bg-sport-purple/90 text-white"
                      >
                        View Details
                      </Button>
                      {team.isOwned && (
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/team/${team.id}`)}
                          className="border-sport-purple text-sport-purple hover:bg-sport-purple/10"
                        >
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTeamModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

export default TeamsPage;