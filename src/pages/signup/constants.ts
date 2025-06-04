
export const userTypes = [
  { 
    value: "player", 
    label: "Sports Enthusiast/Player",
    disabled: false 
  },
  { 
    value: "organizer", 
    label: "Tournament Organizer",
    disabled: false 
  },
  { 
    value: "team", 
    label: "Team Captain/Organizer",
    disabled: true 
  },
  { 
    value: "sponsor", 
    label: "Sponsor",
    disabled: true 
  }
];

export const sports = [
  { value: "football", label: "Football" },
  { value: "basketball", label: "Basketball" },
  { value: "tennis", label: "Tennis" },
  { value: "soccer", label: "Soccer" },
  { value: "cricket", label: "Cricket" },
  { value: "rugby", label: "Rugby" },
  { value: "baseball", label: "Baseball" },
  { value: "volleyball", label: "Volleyball" },
  { value: "swimming", label: "Swimming" },
  { value: "athletics", label: "Athletics" },
  { value: "cycling", label: "Cycling" },
  { value: "golf", label: "Golf" },
  { value: "hockey", label: "Hockey" },
  { value: "badminton", label: "Badminton" },
  { value: "table_tennis", label: "Table Tennis" },
  { value: "boxing", label: "Boxing" },
  { value: "martial_arts", label: "Martial Arts" },
  { value: "other", label: "Other" }
];

export const sportPositions = {
  football: [
    { value: "quarterback", label: "Quarterback" },
    { value: "running_back", label: "Running Back" },
    { value: "wide_receiver", label: "Wide Receiver" },
    { value: "tight_end", label: "Tight End" },
    { value: "offensive_line", label: "Offensive Line" },
    { value: "defensive_line", label: "Defensive Line" },
    { value: "linebacker", label: "Linebacker" },
    { value: "cornerback", label: "Cornerback" },
    { value: "safety", label: "Safety" },
    { value: "kicker", label: "Kicker" },
    { value: "punter", label: "Punter" }
  ],
  basketball: [
    { value: "point_guard", label: "Point Guard" },
    { value: "shooting_guard", label: "Shooting Guard" },
    { value: "small_forward", label: "Small Forward" },
    { value: "power_forward", label: "Power Forward" },
    { value: "center", label: "Center" }
  ],
  soccer: [
    { value: "goalkeeper", label: "Goalkeeper" },
    { value: "defender", label: "Defender" },
    { value: "midfielder", label: "Midfielder" },
    { value: "forward", label: "Forward" },
    { value: "striker", label: "Striker" },
    { value: "winger", label: "Winger" }
  ],
  tennis: [
    { value: "singles", label: "Singles Player" },
    { value: "doubles", label: "Doubles Player" }
  ],
  cricket: [
    { value: "batsman", label: "Batsman" },
    { value: "bowler", label: "Bowler" },
    { value: "wicket_keeper", label: "Wicket Keeper" },
    { value: "all_rounder", label: "All Rounder" }
  ],
  rugby: [
    { value: "prop", label: "Prop" },
    { value: "hooker", label: "Hooker" },
    { value: "lock", label: "Lock" },
    { value: "flanker", label: "Flanker" },
    { value: "number_eight", label: "Number Eight" },
    { value: "scrum_half", label: "Scrum Half" },
    { value: "fly_half", label: "Fly Half" },
    { value: "center", label: "Center" },
    { value: "wing", label: "Wing" },
    { value: "fullback", label: "Fullback" }
  ],
  default: [
    { value: "player", label: "Player" },
    { value: "captain", label: "Captain" },
    { value: "coach", label: "Coach" },
    { value: "other", label: "Other" }
  ]
};
