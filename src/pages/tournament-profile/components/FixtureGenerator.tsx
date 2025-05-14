
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tournament, Team } from '../hooks/useTournamentData';

type Message = {
  role: 'user' | 'bot';
  content: string;
};

type Fixture = {
  matchNumber: number;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  venue: string;
};

type FixtureGeneratorProps = {
  tournament: Tournament;
  teams: Team[];
  isOrganizer: boolean;
};

const initialMessages: Message[] = [
  {
    role: 'bot',
    content: 'Hello! I can help you generate fixtures for your tournament. Let me review the current tournament details...'
  }
];

const FixtureGenerator = ({ tournament, teams, isOrganizer }: FixtureGeneratorProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [showFixtures, setShowFixtures] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState({
    tournamentType: tournament.format || '',
    venueDetails: tournament.location || '',
    matchDuration: '',
    restDays: '',
    finalsFormat: '',
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial bot message after analyzing tournament data
  useEffect(() => {
    const analyzeData = async () => {
      // Wait a bit to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let missingInfo = [];
      let initialAnalysis = `I've analyzed your tournament "${tournament.name}" (${tournament.sport}). `;
      
      if (!tournament.format) missingInfo.push("tournament format");
      if (!tournament.location || tournament.location.trim() === '') missingInfo.push("venue details");
      if (teams.length === 0) missingInfo.push("participating teams");
      if (!tournament.start_date || !tournament.end_date) missingInfo.push("tournament date range");
      
      if (missingInfo.length > 0) {
        initialAnalysis += `I need some additional information: ${missingInfo.join(", ")}. Can you provide these details?`;
      } else {
        initialAnalysis += `You have ${teams.length} teams registered. The tournament is scheduled from ${new Date(tournament.start_date).toLocaleDateString()} to ${new Date(tournament.end_date).toLocaleDateString()}. Would you like me to generate fixtures now or do you need to specify any additional details like match duration or rest days between matches?`;
      }
      
      setMessages([...initialMessages, { role: 'bot', content: initialAnalysis }]);
    };
    
    analyzeData();
  }, [tournament, teams]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);
    
    try {
      // Process the message and determine what to do
      if (userInput.toLowerCase().includes('generate') || userInput.toLowerCase().includes('create fixtures')) {
        await generateFixtures(newMessages);
      } else {
        // Process the input to update additional info
        const updatedInfo = processUserInput(userInput, additionalInfo);
        setAdditionalInfo(updatedInfo);
        
        // Add bot response
        const botResponse = generateBotResponse(updatedInfo);
        setMessages([...newMessages, { role: 'bot', content: botResponse }]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Something went wrong with the chat processing");
      setMessages([...newMessages, { 
        role: 'bot', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserInput = (input: string, currentInfo: any) => {
    const updatedInfo = { ...currentInfo };
    
    // Check for tournament type
    if (input.toLowerCase().includes('knockout')) updatedInfo.tournamentType = 'Knockout';
    else if (input.toLowerCase().includes('round robin')) updatedInfo.tournamentType = 'Round Robin';
    else if (input.toLowerCase().includes('group')) updatedInfo.tournamentType = 'Group + Knockout';
    
    // Check for venue details
    if (input.toLowerCase().includes('venue') || input.toLowerCase().includes('location')) {
      const venueMatch = input.match(/venue[s]?:?\s+([^.!?]+)/i);
      if (venueMatch) updatedInfo.venueDetails = venueMatch[1].trim();
    }
    
    // Check for match duration
    if (input.toLowerCase().includes('duration') || input.toLowerCase().includes('minutes')) {
      const durationMatch = input.match(/(\d+)\s*minutes?/i);
      if (durationMatch) updatedInfo.matchDuration = durationMatch[1] + ' minutes';
    }
    
    // Check for rest days
    if (input.toLowerCase().includes('rest') || input.toLowerCase().includes('gap')) {
      const restMatch = input.match(/(\d+)\s*day[s]?\s*rest/i);
      if (restMatch) updatedInfo.restDays = restMatch[1] + ' days';
    }
    
    // Check for finals format
    if (input.toLowerCase().includes('final')) {
      if (input.toLowerCase().includes('top 2')) updatedInfo.finalsFormat = 'Top 2';
      else if (input.toLowerCase().includes('top 4')) updatedInfo.finalsFormat = 'Top 4';
      else if (input.toLowerCase().includes('league winner')) updatedInfo.finalsFormat = 'League Winner';
    }
    
    return updatedInfo;
  };

  const generateBotResponse = (info: any) => {
    // Check what information is still missing
    const missingItems = [];
    
    if (!info.tournamentType || info.tournamentType === '') missingItems.push('tournament format (Knockout, Round Robin, etc.)');
    if (!info.venueDetails || info.venueDetails === '') missingItems.push('venue details');
    if (!info.matchDuration || info.matchDuration === '') missingItems.push('match duration');
    if (!info.restDays || info.restDays === '') missingItems.push('rest days between matches');
    if (!info.finalsFormat || info.finalsFormat === '') missingItems.push('finals format');
    
    if (missingItems.length > 0) {
      return `Thank you for the information. I still need to know about: ${missingItems.join(', ')}. Can you provide these details?`;
    } else {
      return `Great! I now have all the information I need. Would you like me to generate the fixtures now?`;
    }
  };

  const generateFixtures = async (currentMessages: Message[]) => {
    setIsLoading(true);
    try {
      // We'll simulate fixture generation - in a real app, this would call the OpenAI API
      // This is where you would make the API call to OpenAI using the tournament data
      
      // For demo purposes, generate some sample fixtures
      const sampleFixtures: Fixture[] = generateSampleFixtures(teams);
      setFixtures(sampleFixtures);
      
      const fixtureResponse = "I've generated the fixtures based on your tournament details. You can view them in the table below. Please let me know if you'd like to make any adjustments or if you want to approve these fixtures.";
      
      setMessages([...currentMessages, { role: 'bot', content: fixtureResponse }]);
      setShowFixtures(true);
    } catch (error) {
      console.error("Error generating fixtures:", error);
      toast.error("Failed to generate fixtures");
      setMessages([...currentMessages, { 
        role: 'bot', 
        content: 'Sorry, I encountered an error while generating fixtures. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleFixtures = (teams: Team[]) => {
    // This would be replaced with actual fixture generation logic or API call
    const fixtures: Fixture[] = [];
    const startDate = tournament.start_date ? new Date(tournament.start_date) : new Date();
    
    // Create a round-robin schedule for demo
    let matchNumber = 1;
    
    // For simplicity, we'll just pair teams sequentially
    for (let i = 0; i < teams.length; i += 2) {
      if (i + 1 < teams.length) {
        // Add a few days to the start date for each match
        const matchDate = new Date(startDate);
        matchDate.setDate(startDate.getDate() + Math.floor(matchNumber / 2));
        
        fixtures.push({
          matchNumber,
          date: matchDate.toLocaleDateString(),
          time: `${12 + (matchNumber % 8)}:00`,
          teamA: teams[i].team_name,
          teamB: teams[i + 1].team_name,
          venue: tournament.location || 'Main Venue'
        });
      }
      matchNumber++;
    }
    
    return fixtures;
  };

  const approveFixtures = async () => {
    toast.success("Fixtures approved and saved!");
    // Here you would save the fixtures to your database
    // For example:
    // await saveFixturesToDatabase(fixtures, tournament.id);
  };

  const regenerateFixtures = async () => {
    const regenerateMessage: Message = { role: 'user', content: 'Please regenerate the fixtures with different timings.' };
    setMessages([...messages, regenerateMessage]);
    await generateFixtures([...messages, regenerateMessage]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" /> Tournament Fixture Generator
      </h3>
      
      {/* Chat area */}
      <ScrollArea className="h-[300px] mb-4 border rounded-md p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-sport-purple text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {showFixtures && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Generated Fixtures</h4>
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Team A</TableHead>
                  <TableHead>Team B</TableHead>
                  <TableHead>Venue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixtures.map((fixture) => (
                  <TableRow key={fixture.matchNumber}>
                    <TableCell>{fixture.matchNumber}</TableCell>
                    <TableCell>{fixture.date}</TableCell>
                    <TableCell>{fixture.time}</TableCell>
                    <TableCell>{fixture.teamA}</TableCell>
                    <TableCell>{fixture.teamB}</TableCell>
                    <TableCell>{fixture.venue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button onClick={approveFixtures} disabled={!isOrganizer}>
              Approve Fixtures
            </Button>
            <Button variant="outline" onClick={regenerateFixtures}>
              <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
            </Button>
          </div>
        </div>
      )}
      
      {/* Chat input */}
      <div className="flex gap-2">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage} disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      {!isOrganizer && (
        <p className="text-sm text-gray-500 mt-2">Note: Only tournament organizers can approve fixtures.</p>
      )}
    </div>
  );
};

export default FixtureGenerator;
