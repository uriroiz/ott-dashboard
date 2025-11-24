import React from 'react';

function Notes({ latestDateString }) {
  return (
    <div className="notes">
      <strong>הערות מדידה:</strong>
      <ul>
        <li>הטבלה מציינת רק משחקים שנצפו בשידור ישיר ואינם כוללים צפייה מאוחרת ב-VOD.</li>
        <li>כל הנתונים מסוננים לטווח התחלת העונה ועד {latestDateString || 'סוף אוקטובר 2025'} ול-6 הליגות המפורטות מעלה.</li>
        <li><strong>חשוב:</strong> כל משחק נספר פעם אחת בלבד, גם אם מופיע בטבלאות בית וחוץ של קבוצות שונות.</li>
        <li>בטבלת "סיכום כולל" - מספר המשחקים מציג את סך כל המשחקים שהקבוצה השתתפה בהם (בית + חוץ).</li>
      </ul>
    </div>
  );
}

export default Notes;

