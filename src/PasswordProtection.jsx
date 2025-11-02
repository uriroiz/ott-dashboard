import React, { useState, useEffect } from 'react';
import './PasswordProtection.css';

function PasswordProtection({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('ott-dashboard-auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use environment variable or fallback to default
    const correctPassword = import.meta.env.VITE_DASHBOARD_PASSWORD || 'ibba2025';
    
    if (password === correctPassword) {
      sessionStorage.setItem('ott-dashboard-auth', 'authenticated');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (loading) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <div className="password-protection-overlay">
        <div className="login-container">
          <div className="logo">
            <h1>🏀 דשבורד נתוני OTT</h1>
            <p>איגוד הכדורסל הישראלי</p>
          </div>

          {error && (
            <div className="error-message">
              סיסמה שגויה. אנא נסה שנית.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">סיסמה</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="הזן סיסמה"
                autoComplete="current-password"
                autoFocus
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              כניסה לדשבורד
            </button>
          </form>

          <div className="footer">
            © 2025 איגוד הכדורסל הישראלי
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default PasswordProtection;

