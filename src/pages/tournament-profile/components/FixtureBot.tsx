
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, MessageSquare, RefreshCw, FileDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tournament, Team } from '../hooks/useTournamentData';
import { useFixtureBot, Fixture, Message } from '../hooks/useFixtureBot';

type FixtureBotProps = {
  tournament: Tournament | null;
  teams: Team[];
  isOrganizer: boolean;
};

const FixtureBot = ({ tournament, teams, isOrganizer }: FixtureBotProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    userInput,
    setUserInput,
    isLoading,
    fixtures,
    showFixtures,
    handleSendMessage,
    approveFixtures,
    regenerateFixtures,
    exportAsPdf,
    initializeBot
  } = useFixtureBot(tournament, teams);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize the bot when component mounts
  useEffect(() => {
    initializeBot();
  }, [initializeBot]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" /> FixtureBot
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
            <Button variant="outline" onClick={exportAsPdf}>
              <FileDown className="w-4 h-4 mr-2" /> Export as PDF
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

export default FixtureBot;
