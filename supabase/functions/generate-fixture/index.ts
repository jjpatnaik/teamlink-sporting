
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface FixtureInput {
  tournament_name: string;
  format: string; // 'round_robin' or 'knockout'
  teams: string[];
  start_date?: string;
  match_duration?: number; // minutes
  venue?: string;
  finals?: string; // 'top_2', 'top_4', 'round_robin'
}

interface FixtureMatch {
  match: string;
  venue: string;
  round: number;
}

function generateRoundRobin(teams: string[], venue: string): FixtureMatch[] {
  let teamsToUse = [...teams];
  
  // If odd number of teams, add a "Bye"
  if (teamsToUse.length % 2 !== 0) {
    teamsToUse.push("Bye");
  }
  
  const n = teamsToUse.length;
  const rounds = n - 1;
  const matchups: FixtureMatch[] = [];
  
  for (let r = 0; r < rounds; r++) {
    const roundMatches: FixtureMatch[] = [];
    
    for (let i = 0; i < n / 2; i++) {
      const team1 = teamsToUse[i];
      const team2 = teamsToUse[n - 1 - i];
      
      roundMatches.push({
        match: `${team1} vs ${team2}`,
        venue,
        round: r + 1
      });
    }
    
    // Rotate teams - keep first team fixed, rotate the rest
    const firstTeam = teamsToUse[0];
    const restTeams = teamsToUse.slice(1);
    teamsToUse = [firstTeam, ...restTeams.slice(-1), ...restTeams.slice(0, -1)];
    
    matchups.push(...roundMatches);
  }
  
  return matchups;
}

function generateKnockout(teams: string[], venue: string): FixtureMatch[] {
  let teamsToUse = [...teams];
  
  // Shuffle teams for random matchups
  teamsToUse.sort(() => Math.random() - 0.5);
  
  const totalTeams = teamsToUse.length;
  const rounds = Math.ceil(Math.log2(totalTeams));
  const required = Math.pow(2, rounds);
  const byes = required - totalTeams;
  
  // Add byes if needed
  teamsToUse = [...teamsToUse, ...Array(byes).fill("Bye")];
  
  const fixtures: FixtureMatch[] = [];
  let roundMatches = teamsToUse;
  let roundNum = 1;
  
  while (roundMatches.length > 1) {
    const nextRound: string[] = [];
    
    for (let i = 0; i < roundMatches.length; i += 2) {
      const matchIndex = Math.floor(i / 2) + 1;
      const match: FixtureMatch = {
        match: `${roundMatches[i]} vs ${roundMatches[i+1]}`,
        venue,
        round: roundNum
      };
      
      fixtures.push(match);
      const winner = `Winner of Match ${roundNum}.${matchIndex}`;
      nextRound.push(winner);
    }
    
    roundMatches = nextRound;
    roundNum += 1;
  }
  
  return fixtures;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
  
  try {
    console.log("Function invoked, processing request");
    const data: FixtureInput = await req.json();
    console.log("Received data:", JSON.stringify(data));
    
    if (!data.tournament_name || !data.format || !data.teams || !data.teams.length) {
      console.error("Missing required fields", data);
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    let fixtures: FixtureMatch[];
    
    if (data.format === "round_robin") {
      console.log("Generating round-robin fixtures for", data.teams.length, "teams");
      fixtures = generateRoundRobin(data.teams, data.venue || "Main Ground");
    } else if (data.format === "knockout") {
      console.log("Generating knockout fixtures for", data.teams.length, "teams");
      fixtures = generateKnockout(data.teams, data.venue || "Main Ground");
    } else {
      console.error("Unsupported format:", data.format);
      return new Response(
        JSON.stringify({ error: "Unsupported format" }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
    
    console.log("Generated", fixtures.length, "fixtures successfully");
    
    return new Response(
      JSON.stringify({ fixtures }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
});
