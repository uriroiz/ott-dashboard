import React from 'react';
import { useSortableTable } from '../hooks/useSortableTable';

function TopGames({ games, limit, title }) {
  const { items, requestSort, getSortIndicator } = useSortableTable(games);

  if (!games || games.length === 0) {
    return null;
  }

  const displayGames = limit ? items.slice(0, limit) : items;

  return (
    <div className="table-container">
      <table>
        <caption>{title}</caption>
      <thead>
        <tr>
          <th className="sortable" onClick={() => requestSort('eventDate')}>
            תאריך{getSortIndicator('eventDate')}
          </th>
          <th className="sortable" onClick={() => requestSort('league')}>
            ליגה{getSortIndicator('league')}
          </th>
          <th className="sortable" onClick={() => requestSort('homeTeam')}>
            קבוצת בית{getSortIndicator('homeTeam')}
          </th>
          <th className="sortable" onClick={() => requestSort('awayTeam')}>
            קבוצת חוץ{getSortIndicator('awayTeam')}
          </th>
          <th className="sortable" onClick={() => requestSort('views')}>
            צפיות{getSortIndicator('views')}
          </th>
          <th className="sortable" onClick={() => requestSort('uniqueUsers')}>
            משתמשים ייחודיים{getSortIndicator('uniqueUsers')}
          </th>
          <th className="sortable" onClick={() => requestSort('watchHours')}>
            שעות צפייה{getSortIndicator('watchHours')}
          </th>
        </tr>
      </thead>
      <tbody>
        {displayGames.map((game, idx) => (
          <tr key={idx}>
            <td>{game.eventDate ? new Date(game.eventDate).toLocaleDateString('he-IL') : '-'}</td>
            <td>{game.league}</td>
            <td>{game.homeTeam}</td>
            <td>{game.awayTeam}</td>
            <td>{game.views.toLocaleString('he-IL')}</td>
            <td>{game.uniqueUsers.toLocaleString('he-IL')}</td>
            <td>{Math.round(game.watchHours * 10) / 10}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}

export default TopGames;

