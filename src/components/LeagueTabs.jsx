import React from 'react';

function LeagueTabs({ leagues, activeLeague, onLeagueChange }) {
  if (!leagues || leagues.length === 0) {
    return null;
  }

  return (
    <div className="league-tabs">
      <button
        className={`tab-button ${activeLeague === 'all' ? 'active' : ''}`}
        onClick={() => onLeagueChange('all')}
      >
        כל הליגות
      </button>
      {leagues.map((league) => (
        <button
          key={league}
          className={`tab-button ${activeLeague === league ? 'active' : ''}`}
          onClick={() => onLeagueChange(league)}
        >
          {league}
        </button>
      ))}
    </div>
  );
}

export default LeagueTabs;

