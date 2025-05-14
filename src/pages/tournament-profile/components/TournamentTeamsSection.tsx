
import React, { useState } from 'react';
import { Users, CalendarDays, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tournament, Team } from '../hooks/useTournamentData';

interface TournamentTeamsSectionProps {
  tournament: Tournament;
  teams: Team[];
  isOrganizer: boolean;
  currentUserId: string | null;
  addTeam: (teamName: string, contactEmail: string | null) => Promise<any>;
  fixturesApproved?: boolean;
}

const TournamentTeamsSection: React.FC<TournamentTeamsSectionProps> = ({ 
  tournament, 
  teams, 
  isOrganizer, 
  currentUserId,
  addTeam,
  fixturesApproved = false
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [addingTeam, setAddingTeam] = useState(false);
  
  const registrationDeadline = tournament.registration_deadline ? 
    new Date(tournament.registration_deadline).toLocaleDateString() : 
    tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'Not specified';
  
  const isRegistrationClosed = tournament.registration_deadline ? 
    new Date(tournament.registration_deadline) < new Date() : false;

  const handleAddTeam = async () => {
    try {
      if (!newTeamName.trim()) {
        return;
      }
      
      setAddingTeam(true);
      const result = await addTeam(newTeamName.trim(), newTeamEmail.trim() || null);
      
      if (result) {
        setNewTeamName('');
        setNewTeamEmail('');
      }
    } catch (error) {
      console.error("Error in handleAddTeam:", error);
    } finally {
      setAddingTeam(false);
    }
  };

  // If fixtures are approved, we don't show teams section anymore
  if (fixturesApproved) {
    return (
      <div>
        <h2 className="text-xl font-semibold flex items-center mb-4">
          <Users className="h-5 w-5 mr-2" />
          Teams and Fixtures
        </h2>
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-600">Fixtures have been finalized. Please check the tournament schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold flex items-center mb-4">
        <Users className="h-5 w-5 mr-2" />
        Participating Teams ({teams.length}/{tournament?.teams_allowed || 0})
      </h2>
      
      <div className="mb-4 flex items-center text-sm">
        <Calendar className="h-4 w-4 mr-1 text-sport-purple" />
        <span>Registration deadline: </span>
        <span className="font-medium ml-1">{registrationDeadline}</span>
        {isRegistrationClosed && (
          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
            Closed
          </span>
        )}
      </div>
      
      {teams.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-600">No teams have registered yet.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Status</TableHead>
              {isOrganizer && <TableHead>Contact</TableHead>}
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.team_name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {team.status}
                  </span>
                </TableCell>
                {isOrganizer && (
                  <TableCell>{team.contact_email || 'Not provided'}</TableCell>
                )}
                <TableCell>
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Recently
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Add team form - only for organizer and logged in users */}
      {isOrganizer && currentUserId && !isRegistrationClosed && teams.length < tournament.teams_allowed && (
        <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-md">
          <h3 className="text-lg font-medium mb-3">Add Team</h3>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Team Name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="max-w-xs"
            />
            <Input
              placeholder="Contact Email (optional)"
              value={newTeamEmail}
              onChange={(e) => setNewTeamEmail(e.target.value)}
              className="max-w-xs"
            />
            <Button 
              onClick={handleAddTeam} 
              disabled={addingTeam || !newTeamName.trim()} 
              className="bg-sport-purple hover:bg-sport-purple/90"
            >
              {addingTeam ? "Adding..." : "Add Team"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentTeamsSection;
