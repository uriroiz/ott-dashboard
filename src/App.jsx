import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './components/FileUpload';
import LeagueTabs from './components/LeagueTabs';
import Charts from './components/Charts';
import LeagueTable from './components/LeagueTable';
import AllTeamsTable from './components/AllTeamsTable';
import TeamTables from './components/TeamTables';
import TopGames from './components/TopGames';
import Notes from './components/Notes';
import {
  processData,
  calculateLeagueSummary,
  calculateHomeSummary,
  calculateAwaySummary,
  calculateTotalSummary,
  leaguePatterns
} from './utils/dataProcessor';

// Check if we're in production mode (load from JSON instead of Excel)
const PRODUCTION_MODE = import.meta.env.VITE_PRODUCTION_MODE === 'true';
// For GitHub Pages: use absolute path with repo name
// Vite's import.meta.env.BASE_URL will be '/ott-dashboard/' in production
const DATA_FILE = import.meta.env.MODE === 'production' 
  ? '/ott-dashboard/data/ott-data.json'
  : '/data/ott-data.json';

// Sort leagues in the desired order
function sortLeagues(leagues) {
  const leagueOrder = Object.keys(leaguePatterns);
  return leagues.sort((a, b) => {
    const indexA = leagueOrder.indexOf(a);
    const indexB = leagueOrder.indexOf(b);
    // If league not in leagueOrder, put it at the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

function App() {
  const [state, setState] = useState({
    loading: PRODUCTION_MODE, // Start loading if in production mode
    error: null,
    filteredData: null,
    totalCount: 0,
    activeLeague: 'all',
    leagues: []
  });

  // Load data from JSON in production mode
  useEffect(() => {
    if (PRODUCTION_MODE) {
      loadDataFromJSON();
    }
  }, []);

  const loadDataFromJSON = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Fetching data from:', DATA_FILE);
      console.log('🔍 Production mode:', PRODUCTION_MODE);
      console.log('🔍 Environment:', import.meta.env.MODE);
      
      const response = await fetch(DATA_FILE);
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const jsonData = await response.json();
      const rawData = jsonData.data || jsonData; // Support both wrapped and unwrapped formats

      const filteredData = processData(rawData);

      if (filteredData.length === 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'לא נמצאו נתונים תקינים בקובץ.'
        }));
        return;
      }

      // Get unique leagues
      const leagues = sortLeagues([...new Set(filteredData.map(item => item.league))]);

      setState({
        loading: false,
        error: null,
        filteredData,
        totalCount: rawData.length,
        activeLeague: 'all',
        leagues
      });
    } catch (error) {
      console.error('Error loading JSON data:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: `שגיאה בטעינת הנתונים: ${error.message}`
      }));
    }
  };

  const handleFileLoad = (arrayBuffer) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(firstSheet, { defval: null, raw: false });

      const filteredData = processData(rawData);

      if (filteredData.length === 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'לא נמצאו נתונים תקינים בקובץ. אנא בדוק שהקובץ מכיל את העמודות הנדרשות.'
        }));
        return;
      }

      // Get unique leagues
      const leagues = sortLeagues([...new Set(filteredData.map(item => item.league))]);

      setState({
        loading: false,
        error: null,
        filteredData,
        totalCount: rawData.length,
        activeLeague: 'all',
        leagues
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: `שגיאה בעיבוד הקובץ: ${error.message}`
      }));
    }
  };

  const handleLeagueChange = (league) => {
    setState(prev => ({ ...prev, activeLeague: league }));
  };

  // Filter data based on active league
  const getFilteredData = () => {
    if (!state.filteredData) return null;
    if (state.activeLeague === 'all') return state.filteredData;
    return state.filteredData.filter(item => item.league === state.activeLeague);
  };

  const currentData = getFilteredData();
  const leagueSummary = currentData ? calculateLeagueSummary(currentData) : null;
  const homeSummary = currentData ? calculateHomeSummary(currentData) : null;
  const awaySummary = currentData ? calculateAwaySummary(currentData) : null;
  const totalSummary = currentData ? calculateTotalSummary(currentData) : null;
  
  // Get top games sorted by views
  const getTopGames = () => {
    if (!currentData) return null;
    return [...currentData].sort((a, b) => b.views - a.views);
  };
  
  const topGames = getTopGames();
  const topGamesLimit = state.activeLeague === 'all' ? 30 : 10;
  const topGamesTitle = state.activeLeague === 'all' 
    ? '30 המשחקים הנצפים ביותר' 
    : `10 המשחקים הנצפים ביותר - ${state.activeLeague}`;

  // Get the latest date from the data
  const getLatestDate = () => {
    if (!state.filteredData || state.filteredData.length === 0) return null;
    const dates = state.filteredData
      .map(item => item.eventDate)
      .filter(date => date !== null)
      .sort((a, b) => new Date(b) - new Date(a));
    return dates.length > 0 ? dates[0] : null;
  };

  const latestDate = getLatestDate();
  const dateString = latestDate 
    ? new Date(latestDate).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'סוף אוקטובר 2025';

  return (
    <div className="container">
      <div className="card">
        <h1>דשבורד נתוני OTT - איגוד הכדורסל הישראלי</h1>
        <p className="subtitle">הנתונים נכונים עד {dateString}</p>

        {!PRODUCTION_MODE && <FileUpload onFileLoad={handleFileLoad} />}

        {state.loading && (
          <div className="loading">מעבד קובץ...</div>
        )}

        {state.error && (
          <div className="error">{state.error}</div>
        )}

        {!state.loading && !state.error && !state.filteredData && (
          <div className="loading">אנא העלה קובץ Excel להתחלת העיבוד...</div>
        )}

        {state.filteredData && (
          <>
            <LeagueTabs
              leagues={state.leagues}
              activeLeague={state.activeLeague}
              onLeagueChange={handleLeagueChange}
            />

            <p className="subtitle">
              {currentData.length} אירועים
              {state.activeLeague !== 'all' && ` (${state.activeLeague})`}
              {state.activeLeague === 'all' && ` מתוך ${state.totalCount} שורות בקובץ`}
            </p>

            <Charts 
              leagueSummary={leagueSummary} 
              showCharts={state.activeLeague === 'all'} 
            />

            <LeagueTable leagueSummary={leagueSummary} />

            <TopGames 
              games={topGames}
              limit={topGamesLimit}
              title={topGamesTitle}
            />

            <AllTeamsTable totalSummary={totalSummary} />

            <TeamTables
              homeSummary={homeSummary}
              awaySummary={awaySummary}
            />

            <Notes />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
