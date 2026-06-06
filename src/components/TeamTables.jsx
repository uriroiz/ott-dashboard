import React from 'react';
import { useSortableTable } from '../hooks/useSortableTable';
import CollapsibleSection from './CollapsibleSection';

function TeamTables({ homeSummary, awaySummary }) {
  const { items: homeItems, requestSort: requestHomeSort, getSortIndicator: getHomeSortIndicator } = useSortableTable(homeSummary);
  const { items: awayItems, requestSort: requestAwaySort, getSortIndicator: getAwaySortIndicator } = useSortableTable(awaySummary);

  return (
    <>
      {/* Home Teams Table - ALL TEAMS */}
      {homeSummary && homeSummary.length > 0 && (
        <CollapsibleSection title="טבלה 3: סיכום בית לפי קבוצה (כל הקבוצות)">
          <div className="table-container">
            <table>
              <caption>טבלה 3: סיכום בית לפי קבוצה (כל הקבוצות)</caption>
          <thead>
            <tr>
              <th className="sortable" onClick={() => requestHomeSort('teamFramework')}>
                מסגרת{getHomeSortIndicator('teamFramework')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('competitionsLabel')}>
                תחרויות{getHomeSortIndicator('competitionsLabel')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('team')}>
                קבוצה{getHomeSortIndicator('team')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('games')}>
                משחקים{getHomeSortIndicator('games')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('views')}>
                צפיות (בית){getHomeSortIndicator('views')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('users')}>
                משתמשים ייחודיים (בית){getHomeSortIndicator('users')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('watchHours')}>
                שעות צפייה (בית){getHomeSortIndicator('watchHours')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('avgViewsPerGame')}>
                ממוצע צפיות למשחק{getHomeSortIndicator('avgViewsPerGame')}
              </th>
              <th className="sortable" onClick={() => requestHomeSort('avgUsersPerGame')}>
                ממוצע משתמשים למשחק{getHomeSortIndicator('avgUsersPerGame')}
              </th>
            </tr>
          </thead>
          <tbody>
            {homeItems.map((row, idx) => (
              <tr key={idx}>
                <td>{row.teamFramework}</td>
                <td>{row.competitionsLabel}</td>
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
        </CollapsibleSection>
      )}

      {/* Away Teams Table - ALL TEAMS */}
      {awaySummary && awaySummary.length > 0 && (
        <CollapsibleSection title="טבלה 4: סיכום חוץ לפי קבוצה (כל הקבוצות)">
          <div className="table-container">
            <table>
              <caption>טבלה 4: סיכום חוץ לפי קבוצה (כל הקבוצות)</caption>
          <thead>
            <tr>
              <th className="sortable" onClick={() => requestAwaySort('teamFramework')}>
                מסגרת{getAwaySortIndicator('teamFramework')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('competitionsLabel')}>
                תחרויות{getAwaySortIndicator('competitionsLabel')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('team')}>
                קבוצה{getAwaySortIndicator('team')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('games')}>
                משחקים{getAwaySortIndicator('games')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('views')}>
                צפיות (חוץ){getAwaySortIndicator('views')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('users')}>
                משתמשים ייחודיים (חוץ){getAwaySortIndicator('users')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('watchHours')}>
                שעות צפייה (חוץ){getAwaySortIndicator('watchHours')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('avgViewsPerGame')}>
                ממוצע צפיות למשחק{getAwaySortIndicator('avgViewsPerGame')}
              </th>
              <th className="sortable" onClick={() => requestAwaySort('avgUsersPerGame')}>
                ממוצע משתמשים למשחק{getAwaySortIndicator('avgUsersPerGame')}
              </th>
            </tr>
          </thead>
          <tbody>
            {awayItems.map((row, idx) => (
              <tr key={idx}>
                <td>{row.teamFramework}</td>
                <td>{row.competitionsLabel}</td>
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
        </CollapsibleSection>
      )}
    </>
  );
}

export default TeamTables;
