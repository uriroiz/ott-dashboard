// Competition display order. Competitions not listed here are sorted after these.
export const competitionDisplayOrder = [
  'ליגה לאומית Winner',
  'ליגת אתנה ווינר',
  'הליגה הלאומית לנשים',
  'ליגת מקדונלד\'ס לנוער',
  'הליגה לנערות א על',
  'הליגה לנערים א לאומית',
  'Jr. NBA',
  'Jr. WNBA',
  'גביעים',
  'הליגה לנערות ב על',
  'הליגה הלאומית לנערים ב'
];

const excludedCompetitionNames = new Set([
  'ילדות א דרום נבא',
  'ילדים א מרכז נבא',
  'לאומית נשים',
  'משחק אימון',
  'נערים א לאומית צפון'
]);

const excludedExcelRows = new Set([441, 589, 1448]);

const competitionSeparatorPattern = /\s+[-–—]\s+/;

function getCompetitionSortIndex(competition) {
  const index = competitionDisplayOrder.indexOf(competition);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export function compareCompetitions(a, b) {
  const indexA = getCompetitionSortIndex(a);
  const indexB = getCompetitionSortIndex(b);

  if (indexA !== indexB) {
    return indexA - indexB;
  }

  return a.localeCompare(b, 'he');
}

// Identify league/competition from event name
export function identifyLeague(eventName) {
  if (!eventName) return null;

  const parts = String(eventName).trim().split(competitionSeparatorPattern);
  if (parts.length < 2 || !parts[0]) {
    return null;
  }

  const competition = parts[0].trim();
  if (excludedCompetitionNames.has(competition)) {
    return null;
  }

  if (competition.startsWith('גביע')) {
    return 'גביעים';
  }

  return competition;
}

// Extract round from event name:
// - Regular season: "מחזור 7" -> 7
// - Playoffs/stages: "חצי גמר - משחק 1" -> "חצי גמר - משחק 1"
export function extractRound(eventName) {
  if (!eventName) return null;

  const upperLowerHousePatterns = ['בית עליון', 'בית תחתון'];
  for (const stage of upperLowerHousePatterns) {
    const stageRegex = new RegExp(`${stage}\\s*-\\s*מחזור\\s*\\d+`);
    const stageMatch = eventName.match(stageRegex);
    if (stageMatch && stageMatch[0]) {
      return stageMatch[0].trim();
    }
  }

  const playoffPatterns = ['רבע גמר', 'חצי גמר', 'גמר'];
  for (const stage of playoffPatterns) {
    const stageRegex = new RegExp(`${stage}\\s*-\\s*משחק\\s*\\d+`);
    const stageMatch = eventName.match(stageRegex);
    if (stageMatch && stageMatch[0]) {
      return stageMatch[0].trim();
    }
  }
  
  // Search for patterns like: "מחזור 4", "מחזור 12", etc.
  const roundMatch = eventName.match(/מחזור\s+(\d+)/);
  
  if (roundMatch && roundMatch[1]) {
    return parseInt(roundMatch[1]);
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

// Helper function to parse numbers that might have commas as thousands separators
function parseNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  
  // If it's already a number, return it
  if (typeof value === 'number') return value;
  
  // If it's a string, remove commas and parse
  if (typeof value === 'string') {
    // Remove all commas (thousands separators)
    const cleaned = value.replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
}

// Process raw Excel data
export function processData(rawData) {
  const processedData = rawData.map((row, index) => ({
    eventName: row['eventname'] || '',
    eventDate: parseExcelDate(row['Event Date']),
    homeTeam: row['HomeTeam'] || '',
    awayTeam: row['AwayTeam'] || '',
    views: parseNumber(row['Views']),
    uniqueUsers: parseNumber(row['unique users']),
    watchHours: parseNumber(row['Playtime Hours']),
    productionHours: parseNumber(row['Production Hours']),
    league: identifyLeague(row['eventname']),
    round: extractRound(row['eventname']),
    sourceRow: index + 2
  }));

  return processedData.filter(row => {
    const hasLeague = Boolean(row.league);
    const hasValidData = row.views >= 30 && row.uniqueUsers >= 0;
    const isExcludedRow = excludedExcelRows.has(row.sourceRow);
    return hasLeague && hasValidData && !isExcludedRow;
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
  }).sort((a, b) => compareCompetitions(a.league, b.league) || b.events - a.events);
}

export function calculateLeagueSummaryTotals(leagueSummary) {
  if (!leagueSummary || leagueSummary.length === 0) {
    return null;
  }

  const events = leagueSummary.reduce((sum, row) => sum + row.events, 0);
  const totalViews = leagueSummary.reduce((sum, row) => sum + row.totalViews, 0);
  const totalUsers = leagueSummary.reduce((sum, row) => sum + row.totalUsers, 0);
  const watchHours = leagueSummary.reduce((sum, row) => sum + row.watchHours, 0);

  return {
    league: 'סה״כ',
    events,
    totalViews,
    totalUsers,
    watchHours: Math.round(watchHours * 10) / 10,
    avgViewsPerEvent: Math.round(totalViews / events),
    avgUsersPerEvent: Math.round(totalUsers / events),
    avgWatchHours: Math.round((watchHours / events) * 10) / 10
  };
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
  }).sort((a, b) => {
    const leagueCompare = compareCompetitions(a.league, b.league);
    if (leagueCompare !== 0) return leagueCompare;
    return b.views - a.views;
  });
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
  }).sort((a, b) => {
    const leagueCompare = compareCompetitions(a.league, b.league);
    if (leagueCompare !== 0) return leagueCompare;
    return b.views - a.views;
  });
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
  }).sort((a, b) => {
    const leagueCompare = compareCompetitions(a.league, b.league);
    if (leagueCompare !== 0) return leagueCompare;
    return b.views - a.views;
  });
}

// Hebrew month names for display
const hebrewMonths = [
  'ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני',
  'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'
];

// Calculate monthly progress for views and users
export function calculateMonthlyProgress(data) {
  if (!data || data.length === 0) return [];

  const grouped = {};

  data.forEach(event => {
    if (!event.eventDate) return;

    const date = new Date(event.eventDate);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!grouped[key]) {
      grouped[key] = {
        year,
        month,
        monthLabel: `${hebrewMonths[month]} ${String(year).slice(-2)}`,
        totalViews: 0,
        totalUsers: 0,
        eventsCount: 0
      };
    }

    grouped[key].totalViews += event.views;
    grouped[key].totalUsers += event.uniqueUsers;
    grouped[key].eventsCount += 1;
  });

  // Sort chronologically
  const sorted = Object.values(grouped).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  // Calculate averages and percentage changes
  return sorted.map((item, index) => {
    const avgViewsPerGame = Math.round(item.totalViews / item.eventsCount);
    const avgUsersPerGame = Math.round(item.totalUsers / item.eventsCount);

    // Calculate percentage change from previous month
    let viewsChange = null;
    let usersChange = null;
    let avgViewsChange = null;
    let avgUsersChange = null;

    if (index > 0) {
      const prev = sorted[index - 1];
      const prevAvgViews = prev.totalViews / prev.eventsCount;
      const prevAvgUsers = prev.totalUsers / prev.eventsCount;

      viewsChange = prev.totalViews > 0 
        ? ((item.totalViews - prev.totalViews) / prev.totalViews * 100).toFixed(1)
        : null;
      usersChange = prev.totalUsers > 0 
        ? ((item.totalUsers - prev.totalUsers) / prev.totalUsers * 100).toFixed(1)
        : null;
      avgViewsChange = prevAvgViews > 0 
        ? ((avgViewsPerGame - prevAvgViews) / prevAvgViews * 100).toFixed(1)
        : null;
      avgUsersChange = prevAvgUsers > 0 
        ? ((avgUsersPerGame - prevAvgUsers) / prevAvgUsers * 100).toFixed(1)
        : null;
    }

    return {
      ...item,
      avgViewsPerGame,
      avgUsersPerGame,
      viewsChange: viewsChange !== null ? parseFloat(viewsChange) : null,
      usersChange: usersChange !== null ? parseFloat(usersChange) : null,
      avgViewsChange: avgViewsChange !== null ? parseFloat(avgViewsChange) : null,
      avgUsersChange: avgUsersChange !== null ? parseFloat(avgUsersChange) : null
    };
  });
}
