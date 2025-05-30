import { NextResponse } from 'next/server';

interface ScorebatTeam {
  name: string;
}

interface ScorebatMatch {
  title: string;
  competition: string;
  date: string; // Could be in different formats
  side1?: ScorebatTeam;
  side2?: ScorebatTeam;
}

interface Match {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string; // YYYY-MM-DD format
  strTime: string;   // HH:MM:SS format
  strVenue: string;
}

// Helper function to safely parse dates
function parseApiDate(dateString: string): { date: string; time: string } {
  try {
    // Try ISO format first
    let dateObj = new Date(dateString);
    
    // If invalid, try other common formats
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(dateString.replace(' ', 'T'));
    }
    
    // If still invalid, use current date as fallback
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date();
      console.warn(`Invalid date format, using current date: ${dateString}`);
    }

    return {
      date: dateObj.toISOString().split('T')[0],
      time: dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    };
  } catch (error) {
    console.error('Date parsing error:', error);
    const now = new Date();
    return {
      date: now.toISOString().split('T')[0],
      time: '19:00'
    };
  }
}

export async function GET() {
  try {
    const res = await fetch('https://www.scorebat.com/video-api/v3/', {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error(`API failed with status ${res.status}`);

    const data = await res.json();

    if (!data?.response) throw new Error('Invalid API response');

    const matches: Match[] = data.response.map((match: ScorebatMatch) => {
      const { date, time } = parseApiDate(match.date);
      const [homeTeam, awayTeam] = match.title.split(' vs ');

      return {
        idEvent: match.title.replace(/\s+/g, '-').toLowerCase(),
        strEvent: match.title,
        strLeague: match.competition,
        strHomeTeam: match.side1?.name || homeTeam || 'Home Team',
        strAwayTeam: match.side2?.name || awayTeam || 'Away Team',
        dateEvent: date,
        strTime: time,
        strVenue: match.competition
      };
    });

    return NextResponse.json(matches);

  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback with properly formatted dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return NextResponse.json([
      {
        idEvent: 'fallback-1',
        strEvent: 'Arsenal vs Chelsea',
        strLeague: 'Premier League',
        strHomeTeam: 'Arsenal',
        strAwayTeam: 'Chelsea',
        dateEvent: tomorrow.toISOString().split('T')[0],
        strTime: '19:45',
        strVenue: 'Emirates Stadium'
      }
    ]);
  }
}