// For Scorebat API response
export interface ScorebatMatch {
  title: string;
  competition: string;
  date: string;
  side1: {
    name: string;
  };
  side2: {
    name: string;
  };
  // Add other fields you need
}

// For our transformed match data
export interface Match {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string;
  strTime: string;
  strVenue: string;
}