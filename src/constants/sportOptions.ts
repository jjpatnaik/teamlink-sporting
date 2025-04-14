
export const sportsOptions = [
  { value: "football", label: "Football" },
  { value: "rugby", label: "Rugby" },
  { value: "cricket", label: "Cricket" },
  { value: "basketball", label: "Basketball" },
  { value: "tennis", label: "Tennis" },
  { value: "golf", label: "Golf" },
  { value: "swimming", label: "Swimming" },
  { value: "athletics", label: "Athletics" },
  { value: "hockey", label: "Hockey" },
  { value: "boxing", label: "Boxing" },
  { value: "martial-arts", label: "Martial Arts" },
  { value: "other", label: "Other" },
];

export const positionsMap: Record<string, { value: string; label: string }[]> = {
  football: [
    { value: "goalkeeper", label: "Goalkeeper" },
    { value: "defender", label: "Defender" },
    { value: "midfielder", label: "Midfielder" },
    { value: "forward", label: "Forward" },
  ],
  rugby: [
    { value: "prop", label: "Prop" },
    { value: "hooker", label: "Hooker" },
    { value: "lock", label: "Lock" },
    { value: "flanker", label: "Flanker" },
    { value: "number8", label: "Number 8" },
    { value: "scrum-half", label: "Scrum Half" },
    { value: "fly-half", label: "Fly Half" },
    { value: "center", label: "Center" },
    { value: "wing", label: "Wing" },
    { value: "full-back", label: "Full Back" },
  ],
  cricket: [
    { value: "batsman", label: "Batsman" },
    { value: "bowler", label: "Bowler" },
    { value: "all-rounder", label: "All-Rounder" },
    { value: "wicket-keeper", label: "Wicket Keeper" },
  ],
  basketball: [
    { value: "point-guard", label: "Point Guard" },
    { value: "shooting-guard", label: "Shooting Guard" },
    { value: "small-forward", label: "Small Forward" },
    { value: "power-forward", label: "Power Forward" },
    { value: "center", label: "Center" },
  ],
  tennis: [
    { value: "singles", label: "Singles Player" },
    { value: "doubles", label: "Doubles Specialist" },
    { value: "mixed", label: "Mixed Doubles Player" },
  ],
  golf: [
    { value: "amateur", label: "Amateur" },
    { value: "professional", label: "Professional" },
  ],
  swimming: [
    { value: "freestyle", label: "Freestyle" },
    { value: "backstroke", label: "Backstroke" },
    { value: "breaststroke", label: "Breaststroke" },
    { value: "butterfly", label: "Butterfly" },
    { value: "individual-medley", label: "Individual Medley" },
  ],
  athletics: [
    { value: "sprinter", label: "Sprinter" },
    { value: "middle-distance", label: "Middle Distance" },
    { value: "long-distance", label: "Long Distance" },
    { value: "hurdler", label: "Hurdler" },
    { value: "jumper", label: "Jumper" },
    { value: "thrower", label: "Thrower" },
  ],
  hockey: [
    { value: "goalkeeper", label: "Goalkeeper" },
    { value: "defender", label: "Defender" },
    { value: "midfielder", label: "Midfielder" },
    { value: "forward", label: "Forward" },
  ],
  boxing: [
    { value: "amateur", label: "Amateur" },
    { value: "professional", label: "Professional" },
  ],
  "martial-arts": [
    { value: "striking", label: "Striking Specialist" },
    { value: "grappling", label: "Grappling Specialist" },
    { value: "mixed", label: "Mixed Martial Artist" },
  ],
  other: [
    { value: "other", label: "Other Position" },
  ],
};
