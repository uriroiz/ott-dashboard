import React from 'react';
import { useSortableTable } from '../hooks/useSortableTable';

function AllTeamsTable({ totalSummary }) {
  const { items, requestSort, getSortIndicator } = useSortableTable(totalSummary);

  if (!totalSummary || totalSummary.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <table>
        <caption>טבלה 2: טבלה כללית - כל הקבוצות</caption>
      <thead>
        <tr>
          <th className="sortable" onClick={() => requestSort('league')}>
            ליגה{getSortIndicator('league')}
          </th>
          <th className="sortable" onClick={() => requestSort('team')}>
            קבוצה{getSortIndicator('team')}
          </th>
          <th className="sortable" onClick={() => requestSort('games')}>
            משחקים (סה״כ){getSortIndicator('games')}
          </th>
          <th className="sortable" onClick={() => requestSort('views')}>
            צפיות (סה״כ){getSortIndicator('views')}
          </th>
          <th className="sortable" onClick={() => requestSort('users')}>
            משתמשים ייחודיים (סה״כ){getSortIndicator('users')}
          </th>
          <th className="sortable" onClick={() => requestSort('watchHours')}>
            שעות צפייה (סה״כ){getSortIndicator('watchHours')}
          </th>
          <th className="sortable" onClick={() => requestSort('avgViewsPerGame')}>
            ממוצע צפיות למשחק{getSortIndicator('avgViewsPerGame')}
          </th>
          <th className="sortable" onClick={() => requestSort('avgUsersPerGame')}>
            ממוצע משתמשים למשחק{getSortIndicator('avgUsersPerGame')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((row, idx) => (
          <tr key={idx}>
            <td>{row.league}</td>
            <td>{row.team}</td>
            <td>{row.games.toLocaleString('he-IL')}</td>
            <td>{row.views.toLocaleString('he-IL')}</td>
            <td>{row.users.toLocaleString('he-IL')}</td>
            <td>{row.watchHours.toLocaleString('he-IL')}</td>
            <td>{row.avgViewsPerGame.toLocaleString('he-IL')}</td>
            <td>{row.avgUsersPerGame.toLocaleString('he-IL')}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}

export default AllTeamsTable;

