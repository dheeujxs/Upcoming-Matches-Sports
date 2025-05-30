import { Match } from '@/types';
import MatchCard from '@/components/MatchCard';

// This disables static generation and makes it server-side rendered
export const dynamic = 'force-dynamic';

// Mock data for build time
const mockMatches: Match[] = [
  {
    idEvent: '1',
    strEvent: 'Arsenal vs Chelsea',
    strLeague: 'Premier League',
    strHomeTeam: 'Arsenal',
    strAwayTeam: 'Chelsea',
    dateEvent: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow's date
    strTime: '19:45:00',
    strVenue: 'Emirates Stadium'
  },
  {
    idEvent: '2',
    strEvent: 'Man Utd vs Liverpool',
    strLeague: 'Premier League',
    strHomeTeam: 'Manchester United',
    strAwayTeam: 'Liverpool',
    dateEvent: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
    strTime: '20:00:00',
    strVenue: 'Old Trafford'
  }
];

async function getUpcomingMatches(): Promise<Match[]> {
  try {
    const res = await fetch('http://localhost:3000/api/matches', {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!res.ok) throw new Error('Failed to fetch matches');
    
    const data = await res.json();
    return data.length > 0 ? data : mockMatches;
  } catch (error) {
    console.error('Using mock data due to error:', error);
    return mockMatches;
  }
}

export default async function Home() {
  const matches = await getUpcomingMatches();

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Upcoming Soccer Matches</h1>
        
        <div className="grid gap-6">
          {matches.map((match) => (
            <MatchCard key={match.idEvent} match={match} />
          ))}
        </div>
      </div>
    </main>
  );
}