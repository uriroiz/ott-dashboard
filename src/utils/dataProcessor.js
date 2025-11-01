// League pattern matching
export const leaguePatterns = {
  'ליגת אתנה ווינר': ['ליגת אתנה ווינר', 'ליגת אתנה וינר', 'אתנה ווינר', 'אתנה וינר'],
  'ליגה לאומית Winner': ['ליגה לאומית Winner', 'ליגה לאומית וינר', 'ליגה לאומית winner'],
  'הליגה לנערים א לאומית': ['הליגה לנערים א לאומית', 'ליגה לנערים א לאומית', 'נערים א לאומית'],
  'ליגת מקדונלד\'ס לנוער': ['ליגת מקדונלד\'ס לנוער', 'ליגת מקדונלדס לנוער', 'מקדונלד\'ס לנוער', 'מקדונלדס לנוער'],
  'הליגה הלאומית לנשים': ['הליגה הלאומית לנשים', 'ליגה לאומית לנשים', 'ליגה לנשים'],
  'הליגה לנערות א על': ['הליגה לנערות א על', 'ליגה לנערות א על', 'נערות א על', 'ליגה לנערות א\' על']
};

// Identify league from event name
export function identifyLeague(eventName) {
  if (!eventName) return null;
  
  for (const [leagueName, patterns] of Object.entries(leaguePatterns)) {
    for (const pattern of patterns) {
      if (eventName.includes(pattern)) {
        return leagueName;
      }
    }
  }
  return null;
}

// Parse Excel date to JavaScript Date
function parseExcelDate(excelDate) {
  if (!excelDate) return null;
  
  // If it's already a Date object
  if (excelDate instanceof Date) {
    return excelDate;
  }
  
  // If it's a number (Excel serial date)
  if (typeof excelDate === 'number') {
    // Excel stores dates as days since 1900-01-01 (with leap year bug)
    // JavaScript Date uses milliseconds since 1970-01-01
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000);
    return jsDate;
  }
  
  // If it's a string, try to parse it
  if (typeof excelDate === 'string') {
    // Try common date formats
    const date = new Date(excelDate);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    // Try MM/DD/YYYY format
    const parts = excelDate.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0]) - 1; // JavaScript months are 0-indexed
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
  }
  
  return null;
}

// Process raw Excel data
export function processData(rawData) {
  const processedData = rawData.map(row => ({
    eventName: row['eventname'] || '',
    eventDate: parseExcelDate(row['Event Date']),
    homeTeam: row['HomeTeam'] || '',
    awayTeam: row['AwayTeam'] || '',
    views: parseFloat(row['Views']) || 0,
    uniqueUsers: parseFloat(row['unique users']) || 0,
    watchHours: parseFloat(row['Playtime Hours']) || 0,
    productionHours: parseFloat(row['Production Hours']) || 0,
    league: identifyLeague(row['eventname'])
  }));

  const cutoffDate = new Date('2025-10-31T23:59:59');
  const relevantLeagues = Object.keys(leaguePatterns);

  return processedData.filter(row => {
    const hasLeague = row.league && relevantLeagues.includes(row.league);
    const validDate = !row.eventDate || row.eventDate <= cutoffDate;
    const hasValidData = row.views >= 0 && row.uniqueUsers >= 0;
    return hasLeague && validDate && hasValidData;
  });
}

// Calculate league summary statistics
export function calculateLeagueSummary(data) {
  const grouped = {};
  data.forEach(event => {
    if (!grouped[event.league]) grouped[event.league] = [];
    grouped[event.league].push(event);
  });

  return Object.entries(grouped).map(([league, events]) => {
    const totalViews = events.reduce((sum, e) => sum + e.views, 0);
    const totalUsers = events.reduce((sum, e) => sum + e.uniqueUsers, 0);
    const totalWatchHours = events.reduce((sum, e) => sum + e.watchHours, 0);
    const totalProductionHours = events.reduce((sum, e) => sum + e.productionHours, 0);

    return {
      league,
      events: events.length,
      totalViews: Math.round(totalViews),
      totalUsers: Math.round(totalUsers),
      watchHours: Math.round(totalWatchHours * 10) / 10,
      productionHours: Math.round(totalProductionHours * 10) / 10,
      avgViewsPerEvent: Math.round(totalViews / events.length),
      avgUsersPerEvent: Math.round(totalUsers / events.length),
      avgWatchHours: Math.round((totalWatchHours / events.length) * 10) / 10
    };
  }).sort((a, b) => b.totalViews - a.totalViews);
}

// Calculate home team summary
export function calculateHomeSummary(data) {
  const grouped = {};
  data.forEach(event => {
    const key = `${event.league}|||${event.homeTeam}`;
    if (!grouped[key]) grouped[key] = { league: event.league, team: event.homeTeam, games: [] };
    grouped[key].games.push(event);
  });

  return Object.values(grouped).map(item => {
    const totalViews = item.games.reduce((sum, g) => sum + g.views, 0);
    const totalUsers = item.games.reduce((sum, g) => sum + g.uniqueUsers, 0);
    const totalWatchHours = item.games.reduce((sum, g) => sum + g.watchHours, 0);
    const gamesCount = item.games.length;

    return {
      league: item.league,
      team: item.team,
      games: gamesCount,
      views: Math.round(totalViews),
      users: Math.round(totalUsers),
      watchHours: Math.round(totalWatchHours * 10) / 10,
      avgViewsPerGame: Math.round(totalViews / gamesCount),
      avgUsersPerGame: Math.round(totalUsers / gamesCount)
    };
  }).sort((a, b) => b.views - a.views);
}

// Calculate away team summary
export function calculateAwaySummary(data) {
  const grouped = {};
  data.forEach(event => {
    const key = `${event.league}|||${event.awayTeam}`;
    if (!grouped[key]) grouped[key] = { league: event.league, team: event.awayTeam, games: [] };
    grouped[key].games.push(event);
  });

  return Object.values(grouped).map(item => {
    const totalViews = item.games.reduce((sum, g) => sum + g.views, 0);
    const totalUsers = item.games.reduce((sum, g) => sum + g.uniqueUsers, 0);
    const totalWatchHours = item.games.reduce((sum, g) => sum + g.watchHours, 0);
    const gamesCount = item.games.length;

    return {
      league: item.league,
      team: item.team,
      games: gamesCount,
      views: Math.round(totalViews),
      users: Math.round(totalUsers),
      watchHours: Math.round(totalWatchHours * 10) / 10,
      avgViewsPerGame: Math.round(totalViews / gamesCount),
      avgUsersPerGame: Math.round(totalUsers / gamesCount)
    };
  }).sort((a, b) => b.views - a.views);
}

// Calculate total team summary (home + away) - NO DUPLICATION
export function calculateTotalSummary(data) {
  const grouped = {};
  
  data.forEach(event => {
    const homeKey = `${event.league}|||${event.homeTeam}`;
    if (!grouped[homeKey]) grouped[homeKey] = { league: event.league, team: event.homeTeam, games: [] };
    grouped[homeKey].games.push(event);

    const awayKey = `${event.league}|||${event.awayTeam}`;
    if (!grouped[awayKey]) grouped[awayKey] = { league: event.league, team: event.awayTeam, games: [] };
    grouped[awayKey].games.push(event);
  });

  return Object.values(grouped).map(item => {
    const totalViews = item.games.reduce((sum, g) => sum + g.views, 0);
    const totalUsers = item.games.reduce((sum, g) => sum + g.uniqueUsers, 0);
    const totalWatchHours = item.games.reduce((sum, g) => sum + g.watchHours, 0);
    const gamesCount = item.games.length;

    return {
      league: item.league,
      team: item.team,
      games: gamesCount,
      views: Math.round(totalViews),
      users: Math.round(totalUsers),
      watchHours: Math.round(totalWatchHours * 10) / 10,
      avgViewsPerGame: Math.round(totalViews / gamesCount),
      avgUsersPerGame: Math.round(totalUsers / gamesCount)
    };
  }).sort((a, b) => b.views - a.views);
}

