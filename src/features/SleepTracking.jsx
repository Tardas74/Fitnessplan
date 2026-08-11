import React, { useState, useEffect } from 'react';
import { getSleepData, setSleepData, getSleepThisWeek, getSleepLastWeek } from '../db/index';
import './SleepTracking.css';

export function SleepTracking() {
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [thisWeek, setThisWeek] = useState([]);
  const [lastWeek, setLastWeek] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    loadTodayData();
    loadWeekData();
  }, []);

  const loadTodayData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const data = await getSleepData(today);
    if (data) {
      setSleepHours(data.hours || 7);
      setSleepQuality(data.quality || 5);
      setNotes(data.notes || '');
    }
  };

  const loadWeekData = async () => {
    const week = await getSleepThisWeek();
    setThisWeek(week || []);
    const prevWeek = await getSleepLastWeek();
    setLastWeek(prevWeek || []);
  };

  const handleSave = async () => {
    await setSleepData({
      date: new Date().toISOString().split('T')[0],
      hours: sleepHours,
      quality: sleepQuality,
      notes: notes,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    loadWeekData();
  };

  // This week stats
  const avgHours = thisWeek.length > 0
    ? (thisWeek.reduce((sum, d) => sum + (d.hours || 0), 0) / thisWeek.length).toFixed(1)
    : 0;

  const avgQuality = thisWeek.length > 0
    ? (thisWeek.reduce((sum, d) => sum + (d.quality || 0), 0) / thisWeek.length).toFixed(1)
    : 0;

  // Last week stats
  const avgHoursLast = lastWeek.length > 0
    ? (lastWeek.reduce((sum, d) => sum + (d.hours || 0), 0) / lastWeek.length).toFixed(1)
    : 0;

  const avgQualityLast = lastWeek.length > 0
    ? (lastWeek.reduce((sum, d) => sum + (d.quality || 0), 0) / lastWeek.length).toFixed(1)
    : 0;

  // Trend calculation
  const hoursTrend = avgHours > avgHoursLast ? '↑' : avgHours < avgHoursLast ? '↓' : '→';
  const qualityTrend = avgQuality > avgQualityLast ? '↑' : avgQuality < avgQualityLast ? '↓' : '→';

  // Sleep rating based on current week average
  const getSleepRating = () => {
    if (parseFloat(avgHours) >= 7 && parseFloat(avgQuality) >= 7) {
      return { label: 'Sehr ausgeruht', emoji: '😊', className: 'rating-excellent' };
    } else if (parseFloat(avgHours) >= 6 && parseFloat(avgQuality) >= 5) {
      return { label: 'Gut erholt', emoji: '🙂', className: 'rating-good' };
    } else {
      return { label: 'Müde', emoji: '😑', className: 'rating-tired' };
    }
  };

  const sleepRating = getSleepRating();

  return (
    <div className="sleep-tracking">
      {/* Today's Entry */}
      <div className="sleep-card">
        <h3 className="sleep-label">Schlafstunden heute</h3>
        <div className="sleep-slider">
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value))}
            className="slider"
          />
          <div className="sleep-value">{sleepHours} h</div>
        </div>
      </div>

      <div className="sleep-card">
        <h3 className="sleep-label">Schlafqualität</h3>
        <div className="quality-selector">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              className={`quality-btn ${sleepQuality === num ? 'active' : ''}`}
              onClick={() => setSleepQuality(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <div className="quality-scale">
          <span>Schlecht</span>
          <span>Mittel</span>
          <span>Sehr gut</span>
        </div>
      </div>

      {showNotes && (
        <div className="sleep-card">
          <h3 className="sleep-label">Notizen</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="z.B. Wach geworden, Stress, gute Erholung..."
            className="sleep-notes"
          />
        </div>
      )}

      <button
        className="notes-toggle-btn"
        onClick={() => setShowNotes(!showNotes)}
      >
        {showNotes ? '✕ Notizen ausblenden' : '+ Notizen hinzufügen'}
      </button>

      <button
        className={`sleep-save-btn ${saved ? 'saved' : ''}`}
        onClick={handleSave}
      >
        {saved ? '✓ Gespeichert' : 'Speichern'}
      </button>

      {/* Sleep Rating */}
      <div className={`sleep-rating-compact ${sleepRating.className}`}>
        {sleepRating.className === 'rating-tired' ? (
          <svg className="rating-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <span className="rating-emoji">{sleepRating.emoji}</span>
        )}
        <span className="rating-label">{sleepRating.label}</span>
      </div>

      {/* Weekly Stats */}
      <div className="sleep-stats">
        <h3>Diese Woche</h3>
        <div className="stat-boxes">
          <div className="stat-box">
            <div className="stat-value-with-trend">
              <span>{avgHours} h</span>
              <span className={`trend ${hoursTrend === '↑' ? 'up' : hoursTrend === '↓' ? 'down' : 'equal'}`}>
                {hoursTrend}
              </span>
            </div>
            <div className="stat-label">Ø Schlafstunden</div>
            {lastWeek.length > 0 && <div className="stat-compare">vs. {avgHoursLast} h (letzte Woche)</div>}
          </div>
          <div className="stat-box">
            <div className="stat-value-with-trend">
              <span>{avgQuality}</span>
              <span className={`trend ${qualityTrend === '↑' ? 'up' : qualityTrend === '↓' ? 'down' : 'equal'}`}>
                {qualityTrend}
              </span>
            </div>
            <div className="stat-label">Ø Qualität</div>
            {lastWeek.length > 0 && <div className="stat-compare">vs. {avgQualityLast} (letzte Woche)</div>}
          </div>
          <div className="stat-box">
            <div className="stat-value">{thisWeek.length}</div>
            <div className="stat-label">Einträge</div>
          </div>
        </div>
      </div>
    </div>
  );
}
