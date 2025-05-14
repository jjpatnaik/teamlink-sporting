
import { useState, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { Tournament, Team } from './useTournamentData';
import { useFixtureRepository } from './useFixtureRepository';
import { exportFixturesToPdf } from '../utils/pdfExport';
import { supabase } from "@/integrations/supabase/client";

// Define the message type
export type Message = {
  role: 'user' | 'bot' | 'system';
  content: string;
};

// Define OpenAI message type for proper type handling
type OpenAIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// Define the fixture type
export type Fixture = {
  matchNumber: number;
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  venue: string;
};

// Define the additional info type
export type AdditionalInfo = {
  tournamentType: string;
  venueDetails: string;
  matchDuration: string;
  restDays: string;
  finalsFormat: string;
};

// Initial greeting message
const initialMessages: Message[] = [
  {
    role: 'bot',
    content: 'Hello! I\'m FixtureBot 👋 I can help you generate fixtures for your tournament. Let me review the tournament details...'
  }
];

export const useFixtureBot = (tournament: Tournament | null, teams: Team[]) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [showFixtures, setShowFixtures] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    tournamentType: tournament?.format || '',
    venueDetails: tournament?.location || '',
    matchDuration: '',
    restDays: '',
    finalsFormat: '',
  });
  
  // For AI chat - convert our format to OpenAI format
  const convertToOpenAIMessages = (messages: Message[]): OpenAIMessage[] => {
    return messages
      .filter(msg => msg.role !== 'system') // Filter out any system messages we might have
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' as const : msg.role,
        content: msg.content
      }));
  };

  // Convert from OpenAI format to our format
  const convertFromOpenAIFormat = (role: string): 'user' | 'bot' | 'system' => {
    if (role === 'assistant') return 'bot';
    return role as 'user' | 'system';
  };

  // Get fixture repository functions
  const { saveFixtures, loadFixtures } = useFixtureRepository(tournament?.id);

  // Load existing fixtures on initialization
  useEffect(() => {
    const loadExistingFixtures = async () => {
      const existingFixtures = await loadFixtures();
      
      if (existingFixtures && existingFixtures.length > 0) {
        setFixtures(existingFixtures);
        setShowFixtures(true);
        
        // Notify user about existing fixtures
        const existingFixturesMessage: Message = {
          role: 'bot',
          content: `I found ${existingFixtures.length} existing fixtures for this tournament. They are displayed below. Would you like to regenerate them?`
        };
        setMessages([...messages, existingFixturesMessage]);
      }
    };
    
    if (tournament?.id) {
      loadExistingFixtures();
    }
  }, [tournament?.id]);

  // Initialize the bot with tournament data
  const initializeBot = useCallback(() => {
    if (!tournament) return;

    setIsLoading(true);
    
    // Create the tournament info object for AI context
    const tournamentInfo = {
      name: tournament.name,
      sport: tournament.sport,
      format: tournament.format,
      teams_allowed: tournament.teams_allowed,
      location: tournament.location || '',
      start_date: tournament.start_date,
      end_date: tournament.end_date,
    };
    
    // Use AI for initial analysis
    const callAI = async () => {
      try {
        const initialPrompt = {
          role: 'user',
          content: `I need help creating fixtures for my tournament "${tournament.name}" (${tournament.sport}). 
          ${teams.length > 0 ? `I have ${teams.length} teams registered so far.` : ''}
          ${tournament.start_date ? `The tournament is scheduled from ${new Date(tournament.start_date).toLocaleDateString()} to ${new Date(tournament.end_date || '').toLocaleDateString()}.` : ''}
          ${tournament.format ? `The format is ${tournament.format}.` : ''}
          ${tournament.location ? `The venue is ${tournament.location}.` : ''}
          Please analyze what information I have and what I still need to provide.`
        };
        
        const aiMessages = [
          {
            role: 'assistant',
            content: initialMessages[0].content
          },
          {
            role: 'user',
            content: initialPrompt.content
          }
        ];
        
        const { data, error } = await supabase.functions.invoke('fixture-chat', {
          body: { 
            messages: aiMessages,
            tournamentInfo
          }
        });
        
        if (error) throw new Error(error.message);
        
        if (data && data.response) {
          const botMessage: Message = { 
            role: 'bot', 
            content: data.response
          };
          setMessages([...initialMessages, botMessage]);
        }
      } catch (err: any) {
        console.error("Error calling AI:", err);
        
        // Fallback to non-AI response if there's an error
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
        
        const botMessage: Message = { role: 'bot', content: initialAnalysis };
        setMessages([...initialMessages, botMessage]);
      } finally {
        setIsLoading(false);
      }
    };
    
    callAI();
  }, [tournament, teams]);

  // Process user input to extract additional information
  const processUserInput = (input: string, currentInfo: AdditionalInfo): AdditionalInfo => {
    const updatedInfo = { ...currentInfo };
    const lowerInput = input.toLowerCase();
    
    // Check for tournament type
    if (lowerInput.includes('knockout')) updatedInfo.tournamentType = 'Knockout';
    else if (lowerInput.includes('round robin')) updatedInfo.tournamentType = 'Round Robin';
    else if (lowerInput.includes('group')) updatedInfo.tournamentType = 'Group + Knockout';
    
    // Check for venue details
    if (lowerInput.includes('venue') || lowerInput.includes('location')) {
      const venueMatch = input.match(/venue[s]?:?\s+([^.!?]+)/i);
      if (venueMatch) updatedInfo.venueDetails = venueMatch[1].trim();
    }
    
    // Check for match duration
    if (lowerInput.includes('duration') || 
        lowerInput.includes('match') || 
        lowerInput.includes('hour') || 
        lowerInput.includes('minute')) {
      const hourMatch = input.match(/(\d+)\s*hour[s]?/i);
      if (hourMatch) {
        updatedInfo.matchDuration = hourMatch[1] + ' hour' + (hourMatch[1] === '1' ? '' : 's');
      } else {
        const minuteMatch = input.match(/(\d+)\s*minute[s]?/i);
        if (minuteMatch) updatedInfo.matchDuration = minuteMatch[1] + ' minutes';
      }
    }
    
    // Check for rest days
    if (lowerInput.includes('rest') || lowerInput.includes('gap') || lowerInput.includes('day')) {
      if (lowerInput.includes('no rest') || lowerInput.includes('without rest') || lowerInput.includes('0 day')) {
        updatedInfo.restDays = 'No rest days';
      } else {
        const restMatch = input.match(/(\d+)\s*day[s]?\s*rest/i);
        if (restMatch) updatedInfo.restDays = restMatch[1] + ' days';
      }
    }
    
    // Check for finals format
    if (lowerInput.includes('final') || 
        lowerInput.includes('knockout') || 
        lowerInput.includes('league') || 
        lowerInput.includes('top')) {
      if (lowerInput.includes('knockout')) updatedInfo.finalsFormat = 'Knockout';
      else if (lowerInput.includes('top 2')) updatedInfo.finalsFormat = 'Top 2';
      else if (lowerInput.includes('top 4')) updatedInfo.finalsFormat = 'Top 4';
      else if (lowerInput.includes('league winner')) updatedInfo.finalsFormat = 'League Winner';
    }
    
    return updatedInfo;
  };

  // Generate bot response based on available information (fallback)
  const generateBotResponse = (info: AdditionalInfo): string => {
    const missingItems = [];
    
    if (!info.tournamentType || info.tournamentType === '') missingItems.push('tournament format (Knockout, Round Robin, etc.)');
    if (!info.venueDetails || info.venueDetails === '') missingItems.push('venue details');
    if (!info.matchDuration || info.matchDuration === '') missingItems.push('match duration');
    if (!info.restDays || info.restDays === '') missingItems.push('rest days between matches');
    if (!info.finalsFormat || info.finalsFormat === '') missingItems.push('finals format');
    
    if (missingItems.length > 0) {
      return `Thank you for the information. I still need to know about: ${missingItems.join(', ')}. Can you provide these details?`;
    } else {
      return `Great! I now have all the information I need:
- Tournament type: ${info.tournamentType}
- Venue: ${info.venueDetails}
- Match duration: ${info.matchDuration}
- Rest days: ${info.restDays}
- Finals format: ${info.finalsFormat}

Would you like me to generate the fixtures now?`;
    }
  };

  // Generate fixtures based on tournament data using the Supabase Edge Function
  const generateFixtures = async (currentMessages: Message[]) => {
    setIsLoading(true);
    
    try {
      // Convert tournament format to API format
      let format = "knockout";
      if (additionalInfo.tournamentType.toLowerCase().includes("round robin")) {
        format = "round_robin";
      }

      // Create request payload
      const requestData = {
        tournament_name: tournament?.name || "Tournament",
        format: format,
        teams: teams.map(team => team.team_name),
        venue: additionalInfo.venueDetails,
        finals: additionalInfo.finalsFormat.toLowerCase().replace(" ", "_"),
        match_duration: parseInt(additionalInfo.matchDuration) || 60
      };

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('generate-fixture', {
        body: requestData
      });

      if (error) {
        throw new Error(`Error calling fixture generation API: ${error.message}`);
      }

      // Process the response
      if (!data || !data.fixtures) {
        throw new Error("Invalid response from fixture generator");
      }

      // Convert API fixtures to our Fixture format
      const processedFixtures: Fixture[] = data.fixtures.map((fixture: any, index: number) => {
        // Extract team names from "Team A vs Team B" format
        const teams = fixture.match.split(" vs ");
        
        // Calculate date based on round (use tournament start date as base)
        const matchDate = new Date(tournament?.start_date || new Date());
        matchDate.setDate(matchDate.getDate() + (fixture.round - 1) * (additionalInfo.restDays === 'No rest days' ? 0 : 1));
        
        // Generate a time between 9 AM and 7 PM
        const hour = 9 + (index % 11);
        
        return {
          matchNumber: index + 1,
          date: matchDate.toLocaleDateString(),
          time: `${hour}:00`,
          teamA: teams[0],
          teamB: teams[1],
          venue: fixture.venue,
        };
      });
      
      setFixtures(processedFixtures);
      
      // Use AI to generate a response about the fixtures
      try {
        const fixtureMessage = {
          role: 'user',
          content: `I've generated ${processedFixtures.length} fixtures for the tournament with ${teams.length} teams using ${format} format. The fixtures are spread across ${Math.max(...data.fixtures.map((f: any) => f.round))} rounds.`
        };
        
        const aiMessages = convertToOpenAIMessages([...currentMessages, fixtureMessage]);
        
        const { data: aiData, error: aiError } = await supabase.functions.invoke('fixture-chat', {
          body: { 
            messages: aiMessages,
            tournamentInfo: {
              ...tournament,
              fixtures: processedFixtures.length,
              teams: teams.length,
              format
            }
          }
        });
        
        if (aiError) throw new Error(aiError.message);
        
        const fixtureResponse = aiData?.response || "I've generated the fixtures based on your tournament details. You can view them in the table below. Please let me know if you'd like to make any adjustments or if you want to approve these fixtures.";
        
        const responseMessage: Message = { role: 'bot', content: fixtureResponse };
        setMessages([...currentMessages, responseMessage]);
      } catch (aiErr) {
        console.error("Error calling AI for fixture response:", aiErr);
        const fixtureResponse = "I've generated the fixtures based on your tournament details. You can view them in the table below. Please let me know if you'd like to make any adjustments or if you want to approve these fixtures.";
        const responseMessage: Message = { role: 'bot', content: fixtureResponse };
        setMessages([...currentMessages, responseMessage]);
      }
      
      setShowFixtures(true);
    } catch (error) {
      console.error("Error generating fixtures:", error);
      toast.error("Failed to generate fixtures");
      const errorMessage: Message = { 
        role: 'bot',
        content: 'Sorry, I encountered an error while generating fixtures. Please try again.' 
      };
      setMessages([...currentMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    const userMessage: Message = { role: 'user', content: userInput };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);
    
    try {
      // Check for keywords that would trigger fixture generation
      if (userInput.toLowerCase().includes('generate') || 
          userInput.toLowerCase().includes('create fixtures') ||
          userInput.toLowerCase().includes('yes')) {
        await generateFixtures(newMessages);
      } else {
        // Process the input to update additional info
        const updatedInfo = processUserInput(userInput, additionalInfo);
        setAdditionalInfo(updatedInfo);
        
        // Use AI for response
        try {
          const aiMessages = convertToOpenAIMessages(newMessages);
          
          const { data, error } = await supabase.functions.invoke('fixture-chat', {
            body: { 
              messages: aiMessages,
              tournamentInfo: tournament
            }
          });
          
          if (error) throw new Error(error.message);
          
          if (data && data.response) {
            const botMessage: Message = { 
              role: 'bot', 
              content: data.response 
            };
            setMessages([...newMessages, botMessage]);
          } else {
            throw new Error("No response from AI");
          }
        } catch (err) {
          console.error("Error calling AI:", err);
          
          // Fallback to non-AI response if there's an error
          const botResponse = generateBotResponse(updatedInfo);
          const botMessage: Message = { role: 'bot', content: botResponse };
          setMessages([...newMessages, botMessage]);
        }
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Something went wrong with the chat processing");
      const errorMessage: Message = { role: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save the approved fixtures
  const approveFixtures = async () => {
    try {
      if (!tournament) {
        toast.error("Tournament not found");
        return;
      }

      // Save fixtures to the database
      const result = await saveFixtures(fixtures);
      
      if (result.success) {
        toast.success("Fixtures approved and saved!");
        
        // Add confirmation message in chat
        const confirmMessage: Message = { 
          role: 'bot', 
          content: 'Fixtures have been saved successfully. Would you like to export them as a PDF?' 
        };
        setMessages([...messages, confirmMessage]);
      } else {
        throw new Error(result.error || "Failed to save fixtures");
      }
    } catch (error) {
      console.error("Error approving fixtures:", error);
      toast.error("Failed to save fixtures");
    }
  };

  // Regenerate fixtures with different timings
  const regenerateFixtures = async () => {
    const regenerateMessage: Message = { 
      role: 'user', 
      content: 'Please regenerate the fixtures with different timings.' 
    };
    setMessages([...messages, regenerateMessage]);
    await generateFixtures([...messages, regenerateMessage]);
  };

  // Export fixtures as PDF
  const exportAsPdf = () => {
    const success = exportFixturesToPdf(fixtures, tournament);
    
    if (success) {
      toast.success("Fixtures exported as PDF!");
      const exportMessage: Message = { 
        role: 'bot', 
        content: 'The fixtures have been exported as PDF and saved to your device.' 
      };
      setMessages([...messages, exportMessage]);
    } else {
      toast.error("Failed to export fixtures as PDF");
    }
  };

  return {
    messages,
    userInput,
    setUserInput,
    isLoading,
    fixtures,
    showFixtures,
    additionalInfo,
    handleSendMessage,
    approveFixtures,
    regenerateFixtures,
    exportAsPdf,
    initializeBot
  };
};
