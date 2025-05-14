
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  
  try {
    const { messages, tournamentInfo } = await req.json();
    
    // Get OpenAI API Key from environment
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      throw new Error('OpenAI API key not found');
    }
    
    // Create system message with tournament context
    const systemMessage = {
      role: 'system',
      content: `You are FixtureBot, a friendly AI specialized in creating sports tournament fixtures. 
      ${tournamentInfo ? `You are currently working with a ${tournamentInfo.sport || 'sports'} tournament named "${tournamentInfo.name || 'Unknown'}" with ${tournamentInfo.teams_allowed || 'unknown number of'} teams allowed.` : 'You help organize sports tournaments and generate fair fixtures.'}
      Be conversational but concise. Focus on collecting necessary information for fixture generation such as tournament format (round-robin, knockout), team names, venue details, match duration, and rest days between matches.
      When you have enough information, suggest generating fixtures. Your goal is to help the tournament organizer create optimal fixture schedules.`
    };
    
    // Add system message to the beginning of messages array
    const fullMessages = [systemMessage, ...messages];
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 800
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        response: data.choices[0].message.content,
        usage: data.usage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fixture-chat function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
