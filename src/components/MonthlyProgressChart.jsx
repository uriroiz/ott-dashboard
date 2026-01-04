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

function MonthlyProgressChart({ monthlyData, leagueName }) {
  if (!monthlyData || monthlyData.length === 0) {
    return null;
  }

  // Need at least 2 months to show progression
  if (monthlyData.length < 2) {
    return null;
  }

  const labels = monthlyData.map(m => m.monthLabel);
  const lastMonth = monthlyData[monthlyData.length - 1];
  const prevMonth = monthlyData[monthlyData.length - 2];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        rtl: true
      },
      title: { display: false },
      tooltip: {
        rtl: true,
        callbacks: {
          afterLabel: function(context) {
            const dataIndex = context.dataIndex;
            const monthData = monthlyData[dataIndex];
            const changeValue = monthData.viewsChange;
            let changeText = '';
            if (changeValue !== null) {
              const arrow = changeValue >= 0 ? '↑' : '↓';
              changeText = `\n${arrow} ${Math.abs(changeValue)}% מהחודש הקודם`;
            }
            return `משחקים: ${monthData.eventsCount}${changeText}`;
          }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('he-IL');
          }
        }
      }
    }
  };

  const viewsData = {
    labels,
    datasets: [
      {
        label: 'צפיות',
        data: monthlyData.map(m => m.totalViews),
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }
    ]
  };

  const usersData = {
    labels,
    datasets: [
      {
        label: 'משתמשים ייחודיים',
        data: monthlyData.map(m => m.totalUsers),
        backgroundColor: '#10b981',
        borderRadius: 4
      }
    ]
  };

  const avgViewsData = {
    labels,
    datasets: [
      {
        label: 'ממוצע צפיות למשחק',
        data: monthlyData.map(m => m.avgViewsPerGame),
        backgroundColor: '#f59e0b',
        borderRadius: 4
      }
    ]
  };

  // Insights Summary Component
  const InsightsSummary = () => {
    const formatChange = (change) => {
      if (change === null) return null;
      const isPositive = change >= 0;
      const arrow = isPositive ? '↑' : '↓';
      const color = isPositive ? '#10b981' : '#ef4444';
      return (
        <span style={{ color, fontWeight: 'bold' }}>
          {arrow} {Math.abs(change)}%
        </span>
      );
    };

    return (
      <div className="insights-summary">
        <h4 className="insights-title">סיכום אינסייטים - {lastMonth.monthLabel} לעומת {prevMonth.monthLabel}</h4>
        
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-label">ממוצע צפיות למשחק</div>
            <div className="insight-values">
              <span className="insight-current">{lastMonth.avgViewsPerGame.toLocaleString('he-IL')}</span>
              <span className="insight-vs">vs</span>
              <span className="insight-previous">{prevMonth.avgViewsPerGame.toLocaleString('he-IL')}</span>
            </div>
            <div className="insight-change">
              {formatChange(lastMonth.avgViewsChange)}
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-label">ממוצע משתמשים למשחק</div>
            <div className="insight-values">
              <span className="insight-current">{lastMonth.avgUsersPerGame.toLocaleString('he-IL')}</span>
              <span className="insight-vs">vs</span>
              <span className="insight-previous">{prevMonth.avgUsersPerGame.toLocaleString('he-IL')}</span>
            </div>
            <div className="insight-change">
              {formatChange(lastMonth.avgUsersChange)}
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-label">סה״כ צפיות</div>
            <div className="insight-values">
              <span className="insight-current">{lastMonth.totalViews.toLocaleString('he-IL')}</span>
              <span className="insight-vs">vs</span>
              <span className="insight-previous">{prevMonth.totalViews.toLocaleString('he-IL')}</span>
            </div>
            <div className="insight-change">
              {formatChange(lastMonth.viewsChange)}
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-label">מספר משחקים</div>
            <div className="insight-values">
              <span className="insight-current">{lastMonth.eventsCount}</span>
              <span className="insight-vs">vs</span>
              <span className="insight-previous">{prevMonth.eventsCount}</span>
            </div>
            <div className="insight-change">
              {formatChange(
                prevMonth.eventsCount > 0 
                  ? parseFloat(((lastMonth.eventsCount - prevMonth.eventsCount) / prevMonth.eventsCount * 100).toFixed(1))
                  : null
              )}
            </div>
          </div>
        </div>

        <div className="insights-bottom-line">
          {lastMonth.avgViewsChange !== null && (
            lastMonth.avgViewsChange >= 0 
              ? <span className="trend-positive">📈 מגמה חיובית: ממוצע הצפיות למשחק עלה ב-{Math.abs(lastMonth.avgViewsChange)}%</span>
              : <span className="trend-negative">📉 שימו לב: ממוצע הצפיות למשחק ירד ב-{Math.abs(lastMonth.avgViewsChange)}%</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="monthly-progress-section">
      <h3 className="section-title">התקדמות חודשית - {leagueName}</h3>
      
      <InsightsSummary />
      
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-title">סה״כ צפיות לפי חודש</div>
          <Bar data={viewsData} options={chartOptions} />
        </div>
        
        <div className="chart-container">
          <div className="chart-title">משתמשים ייחודיים לפי חודש</div>
          <Bar data={usersData} options={chartOptions} />
        </div>

        <div className="chart-container full-width">
          <div className="chart-title">ממוצע צפיות למשחק לפי חודש</div>
          <Bar data={avgViewsData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default MonthlyProgressChart;
