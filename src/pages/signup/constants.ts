
export const userTypes = [
  { value: "player", label: "Player" },
  { value: "team", label: "Club/Team (Coming Soon)", disabled: true },
  { value: "organizer", label: "Tournament Organiser", disabled: false },
  { value: "sponsor", label: "Sponsor (Coming Soon)", disabled: true },
];

export const sports = [
  "Basketball",
  "Cricket",
  "Soccer",
  "Tennis",
  "Badminton",
  "Volleyball",
  "Hockey",
  "Rugby"
];

export const sportPositions: Record<string, string[]> = {
  "Basketball": ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"],
  "Cricket": ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"],
  "Soccer": ["Forward", "Midfielder", "Defender", "Goalkeeper"],
  "Tennis": ["Singles", "Doubles"],
  "Badminton": ["Singles", "Doubles"],
  "Volleyball": ["Setter", "Outside Hitter", "Middle Blocker", "Libero"],
  "Hockey": ["Forward", "Defender", "Goaltender"],
  "Rugby": ["Prop", "Hooker", "Lock", "Flanker", "Number 8", "Scrum-half", "Fly-half", "Center", "Wing", "Full-back"]
};

export const clubs = [
  "Chicago Breeze", 
  "Michigan Wolverines",
  "LA Lakers",
  "Boston Celtics",
  "Mumbai Indians",
  "Royal Challengers",
  "Manchester United",
  "Barcelona FC"
];

export const tournamentFormats = [
  { value: "round_robin", label: "Round Robin" },
  { value: "knockout", label: "Knockout" }
];
