import React from 'react';
import { useSortableTable } from '../hooks/useSortableTable';

function LeagueTable({ leagueSummary }) {
  const { items, requestSort, getSortIndicator } = useSortableTable(leagueSummary);

  if (!leagueSummary || leagueSummary.length === 0) {
    return null;
  }

  return (
    <table>
      <caption>טבלה 1: סיכום לפי ליגה</caption>
      <thead>
        <tr>
          <th className="sortable" onClick={() => requestSort('league')}>
            ליגה{getSortIndicator('league')}
          </th>
          <th className="sortable" onClick={() => requestSort('events')}>
            אירועים{getSortIndicator('events')}
          </th>
          <th className="sortable" onClick={() => requestSort('totalViews')}>
            סה״כ צפיות{getSortIndicator('totalViews')}
          </th>
          <th className="sortable" onClick={() => requestSort('totalUsers')}>
            משתמשים ייחודיים{getSortIndicator('totalUsers')}
          </th>
          <th className="sortable" onClick={() => requestSort('watchHours')}>
            שעות צפייה{getSortIndicator('watchHours')}
          </th>
          <th className="sortable" onClick={() => requestSort('avgViewsPerEvent')}>
            ממוצע צפיות למשחק{getSortIndicator('avgViewsPerEvent')}
          </th>
          <th className="sortable" onClick={() => requestSort('avgUsersPerEvent')}>
            ממוצע משתמשים למשחק{getSortIndicator('avgUsersPerEvent')}
          </th>
          <th className="sortable" onClick={() => requestSort('avgWatchHours')}>
            ממוצע שעות צפייה למשחק{getSortIndicator('avgWatchHours')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((row, idx) => (
          <tr key={idx}>
            <td>{row.league}</td>
            <td>{row.events.toLocaleString('he-IL')}</td>
            <td>{row.totalViews.toLocaleString('he-IL')}</td>
            <td>{row.totalUsers.toLocaleString('he-IL')}</td>
            <td>{row.watchHours.toLocaleString('he-IL')}</td>
            <td>{row.avgViewsPerEvent.toLocaleString('he-IL')}</td>
            <td>{row.avgUsersPerEvent.toLocaleString('he-IL')}</td>
            <td>{row.avgWatchHours.toLocaleString('he-IL')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LeagueTable;
