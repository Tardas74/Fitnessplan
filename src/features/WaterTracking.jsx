import React, { useState, useEffect } from 'react';
import { addWaterIntake, getWaterToday, getWaterThisWeek } from '../db/index';
import './WaterTracking.css';

export function WaterTracking() {
  const [waterToday, setWaterToday] = useState(0);
  const [waterWeek, setWaterWeek] = useState([]);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const today = await getWaterToday();
    setWaterToday(today || 0);
    const week = await getWaterThisWeek();
    setWaterWeek(week || []);
  };

  const addWater = async (amount) => {
    await addWaterIntake(amount);
    setWaterToday(waterToday + amount);
    setSavedMsg(`+${amount}ml`);
    setTimeout(() => setSavedMsg(''), 1500);
  };

  const waterLiters = (waterToday / 1000).toFixed(2);
  const waterPercent = Math.min((waterToday / 2000) * 100, 100);
  const weekTotal = waterWeek.reduce((sum, d) => sum + (d || 0), 0);
  const weekAvg = weekTotal > 0 ? Math.round(weekTotal / waterWeek.length) : 0;

  return (
    <div className="water-tracking">
      {/* Daily Goal */}
      <div className="water-goal-card">
        <h3 className="water-label">Tagesziel: 2000 ml</h3>
        <div className="water-progress-container">
          <div className="water-progress">
            <div className="water-fill" style={{ height: `${waterPercent}%` }}></div>
            <div className="water-text">{waterLiters} L</div>
          </div>
        </div>
        <div className="water-info">
          <span>{Math.round(waterPercent)}% Ziel erreicht</span>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="water-buttons">
        <button className="water-btn" onClick={() => addWater(250)}>
          250 ml
        </button>
        <button className="water-btn" onClick={() => addWater(500)}>
          500 ml
        </button>
        <button className="water-btn" onClick={() => addWater(750)}>
          750 ml
        </button>
        <button className="water-btn" onClick={() => addWater(1000)}>
          1 L
        </button>
      </div>

      {savedMsg && <div className="water-saved">{savedMsg}</div>}

      {/* Weekly Stats */}
      <div className="water-stats">
        <h3>Diese Woche</h3>
        <div className="weekly-bars">
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, idx) => {
            const amount = waterWeek[idx] || 0;
            const percent = Math.min((amount / 2000) * 100, 100);
            return (
              <div key={day} className="bar-item">
                <div className="bar-chart">
                  <div
                    className="bar-fill"
                    style={{ height: `${percent}%` }}
                  ></div>
                </div>
                <div className="bar-label">{day}</div>
                <div className="bar-amount">{Math.round(amount / 100)}0 ml</div>
              </div>
            );
          })}
        </div>
        <div className="week-average">
          <span>Ø diese Woche:</span>
          <span className="avg-value">{(weekAvg / 1000).toFixed(2)} L</span>
        </div>
      </div>
    </div>
  );
}
