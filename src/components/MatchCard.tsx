import { Match } from '@/types';

export default function MatchCard({ match }: { match: Match }) {
  // Safely parse date - now guaranteed to be valid
  const matchDate = new Date(`${match.dateEvent}T${match.strTime}:00`);
  const isDateValid = !isNaN(matchDate.getTime());

  const displayDate = isDateValid
    ? matchDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    : 'Date TBD';

  const displayTime = isDateValid
    ? matchDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Time TBD';

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs bg-gray-100 px-2 text-gray-500 py-1 rounded">
          {match.strLeague}
        </span>
        <span className="text-xs text-gray-500">
          {displayDate} at {displayTime}
        </span>
      </div>
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="text-center">
          <p className="font-bold text-blue-400">{match.strHomeTeam}</p>
        </div>
        <div className="text-gray-400">vs</div>
        <div className="text-center">
          <p className="font-bold text-blue-400">{match.strAwayTeam}</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-2">
        {match.strVenue}
      </div>
    </div>
  );
}