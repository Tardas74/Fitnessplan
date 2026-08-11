import React, { useState, useEffect } from 'react';
import { parseIcs, occurrencesInWeek, getWeekMonday, formatWeekRange } from '../utils/icsParser';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';
import './TrainingWeek.css';

const ICS_URL = './calendar.ics';
let icsEventsCache = null;

export function TrainingWeek() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [trainings, setTrainings] = useState([]);
  const [weekRange, setWeekRange] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [expandedIdx, setExpandedIdx] = useState(null);

  useEffect(() => {
    loadWeek();
  }, [weekOffset]);

  async function loadWeek() {
    setLoading(true);
    const monday = getWeekMonday(new Date(), weekOffset);
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);

    setWeekRange(formatWeekRange(monday));

    try {
      if (!icsEventsCache) {
        const res = await fetch(ICS_URL + '?t=' + Date.now());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        icsEventsCache = parseIcs(text);
        console.log('✅ ICS geladen, Events im Cache:', icsEventsCache.length);
      }

      const occ = occurrencesInWeek(icsEventsCache, monday, nextMonday);
      console.log('📅 Trainings für Woche:', occ.length, 'von', monday, 'bis', nextMonday);
      console.log('   Gefundene Events:', occ);
      console.log('   Cache Events insgesamt:', icsEventsCache.length);
      setTrainings(occ);
      console.log('✅ setTrainings() wurde aufgerufen mit', occ.length, 'Events');

      // Update sessionCount für diese Woche
      if (weekOffset === 0) {
        setSessionCount(occ.length);
        console.log('📊 SessionCount aktualisiert auf:', occ.length);
      }
    } catch (err) {
      console.error('❌ Fehler beim Laden der Kalender-Events:', err);
      setTrainings([]);
    }

    setLoading(false);
  }

  function handlePrevWeek() {
    setWeekOffset((w) => Math.max(w - 1, -4));
  }

  function handleNextWeek() {
    setWeekOffset((w) => Math.min(w + 1, 4));
  }

  const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  return (
    <div className="training-week">
      {/* Header mit Wochennavigation */}
      <div className="training-header">
        <button
          className="week-nav-btn"
          onClick={handlePrevWeek}
          disabled={weekOffset <= -4}
          title="Vorherige Woche"
        >
          <ChevronLeftIcon />
        </button>

        <div className="week-info">
          <div className="week-range">{weekRange}</div>
          {weekOffset === 0 && <div className="week-tag">diese Woche</div>}
          {weekOffset === 1 && <div className="week-tag">nächste Woche</div>}
          {weekOffset === -1 && <div className="week-tag">letzte Woche</div>}
          {weekOffset > 1 && <div className="week-tag">+{weekOffset} Wochen</div>}
          {weekOffset < -1 && <div className="week-tag">{weekOffset} Wochen</div>}
        </div>

        <button
          className="week-nav-btn"
          onClick={handleNextWeek}
          disabled={weekOffset >= 4}
          title="Nächste Woche"
        >
          <ChevronRightIcon />
        </button>
      </div>


      {/* Training List */}
      {console.log('🎯 Training List Render:', { loading, trainingsLength: trainings.length, trainings })}
      <div className="training-list">
        {loading ? (
          <div className="status-msg">Lade Termine…</div>
        ) : trainings.length === 0 ? (
          <div className="status-msg">Keine Termine für diese Woche gefunden.</div>
        ) : (
          trainings.map((training, idx) => {
            const dayLabel = dayNames[training.start.getDay()];
            const timeLabel = new Intl.DateTimeFormat('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            }).format(training.start);

            const desc = (training.description || '')
              .split('\n')
              .slice(0, 4)
              .join('\n');

            const isExpanded = expandedIdx === idx;
            console.log(`Training ${idx}:`, { expanded: isExpanded, hasDesc: !!desc, desc });
            return (
              <div
                key={idx}
                className={`training-item ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                style={{ cursor: 'pointer' }}
              >
                <div className="training-day">{dayLabel}</div>
                <div className="training-body">
                  <div className="training-title">
                    {training.summary || '(ohne Titel)'}
                    <span className="training-chevron">{isExpanded ? '▼' : '▶'}</span>
                  </div>
                  <div className="training-meta">
                    <span className="training-time">⏱ {timeLabel}</span>
                    {training.location && <span className="training-location">📍 {training.location}</span>}
                  </div>
                  {isExpanded && desc && <div className="training-desc">{desc}</div>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
