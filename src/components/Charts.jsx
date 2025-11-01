import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Charts({ leagueSummary, showCharts }) {
  // Don't show charts if showCharts is false (when viewing a single league)
  if (!showCharts) {
    return null;
  }

  if (!leagueSummary || leagueSummary.length === 0) {
    return null;
  }

  const leagueLabels = leagueSummary.map(r => 
    r.league.length > 25 ? r.league.substring(0, 25) + '...' : r.league
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        rtl: true
      },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  const viewsUsersData = {
    labels: leagueLabels,
    datasets: [
      {
        label: 'צפיות',
        data: leagueSummary.map(r => r.totalViews),
        backgroundColor: '#3b82f6'
      },
      {
        label: 'משתמשים',
        data: leagueSummary.map(r => r.totalUsers),
        backgroundColor: '#10b981'
      }
    ]
  };

  const watchHoursData = {
    labels: leagueLabels,
    datasets: [
      {
        label: 'שעות צפייה',
        data: leagueSummary.map(r => r.watchHours),
        backgroundColor: '#8b5cf6'
      }
    ]
  };

  const avgViewsPerEventData = {
    labels: leagueLabels,
    datasets: [
      {
        label: 'ממוצע צפיות למשחק',
        data: leagueSummary.map(r => r.avgViewsPerEvent),
        backgroundColor: '#f59e0b'
      }
    ]
  };

  return (
    <div className="charts-grid">
      <div className="chart-container">
        <div className="chart-title">צפיות ומשתמשים לפי ליגה</div>
        <Bar data={viewsUsersData} options={chartOptions} />
      </div>
      
      <div className="chart-container">
        <div className="chart-title">שעות צפייה לפי ליגה</div>
        <Bar data={watchHoursData} options={chartOptions} />
      </div>
      
      <div className="chart-container full-width">
        <div className="chart-title">ממוצע צפיות למשחק לפי ליגה</div>
        <Bar data={avgViewsPerEventData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Charts;
