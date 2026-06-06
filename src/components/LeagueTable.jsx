import React from 'react';
import { useSortableTable } from '../hooks/useSortableTable';
import { calculateLeagueSummaryTotals } from '../utils/dataProcessor';

function LeagueTable({ leagueSummary, showTotals = false }) {
  const { items, requestSort, getSortIndicator } = useSortableTable(leagueSummary);
  const totals = showTotals ? calculateLeagueSummaryTotals(leagueSummary) : null;

  if (!leagueSummary || leagueSummary.length === 0) {
    return null;
  }

  return (
    <div className="table-container">
      <table>
        <caption>טבלה 1: סיכום לפי ליגה/תחרות</caption>
      <thead>
        <tr>
          <th className="sortable" onClick={() => requestSort('league')}>
            ליגה/תחרות{getSortIndicator('league')}
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
      {totals && (
        <tfoot>
          <tr className="summary-row">
            <td>{totals.league}</td>
            <td>{totals.events.toLocaleString('he-IL')}</td>
            <td>{totals.totalViews.toLocaleString('he-IL')}</td>
            <td>{totals.totalUsers.toLocaleString('he-IL')}</td>
            <td>{totals.watchHours.toLocaleString('he-IL')}</td>
            <td>{totals.avgViewsPerEvent.toLocaleString('he-IL')}</td>
            <td>{totals.avgUsersPerEvent.toLocaleString('he-IL')}</td>
            <td>{totals.avgWatchHours.toLocaleString('he-IL')}</td>
          </tr>
        </tfoot>
      )}
      </table>
    </div>
  );
}

export default LeagueTable;
