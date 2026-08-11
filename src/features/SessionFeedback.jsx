import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Card, CardBody, CardHeader } from '../components/Card';
import { addSession, getSessionsThisWeek } from '../db/index';
import './SessionFeedback.css';

export function SessionFeedback({ onSave, workoutTitle = 'Training' }) {
  const [rpe, setRpe] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [soreness, setSoreness] = useState(3);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await addSession({
      rpe: parseInt(rpe),
      energy: parseInt(energy),
      soreness: parseInt(soreness),
      notes,
      workoutTitle,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (onSave) onSave();
  };

  const renderSlider = (value, onChange, label, min = 1, max = 10) => (
    <div className="feedback-slider">
      <div className="feedback-slider-header">
        <span className="feedback-label">{label}</span>
        <span className="feedback-value">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider"
      />
      <div className="feedback-labels">
        <span>Niedrig</span>
        <span>Hoch</span>
      </div>
    </div>
  );

  return (
    <div className="session-feedback">
      <Card variant="elevated">
        <CardHeader>
          <div>
            <div className="feedback-title">Training abgeschlossen!</div>
            <div className="feedback-subtitle">Wie war dein {workoutTitle}?</div>
          </div>
        </CardHeader>

        <CardBody>
          {renderSlider(rpe, setRpe, 'RPE (Anstrengung)', 1, 10)}
          {renderSlider(energy, setEnergy, 'Energie-Level', 1, 10)}
          {renderSlider(soreness, setSoreness, 'Muskelkater', 1, 10)}

          <div className="feedback-notes">
            <label>Notizen (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wie hast du dich gefühlt? Irgendwelche Schmerzen?"
              rows="4"
            />
          </div>

          <div className="feedback-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              className={saved ? 'btn--saved' : ''}
            >
              {saved ? '✓ Gespeichert' : 'Feedback speichern'}
            </Button>
          </div>
        </CardBody>
      </Card>

      <SessionStats />
    </div>
  );
}

function SessionStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadStats = async () => {
      const sessions = await getSessionsThisWeek();
      if (sessions.length > 0) {
        const avgRPE = (sessions.reduce((sum, s) => sum + s.rpe, 0) / sessions.length).toFixed(1);
        const avgEnergy = (sessions.reduce((sum, s) => sum + s.energy, 0) / sessions.length).toFixed(1);
        const avgSoreness = (sessions.reduce((sum, s) => sum + s.soreness, 0) / sessions.length).toFixed(1);

        setStats({
          count: sessions.length,
          avgRPE,
          avgEnergy,
          avgSoreness,
        });
      }
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) return null;
  if (!stats) return null;

  return (
    <Card variant="default" className="stats-card">
      <CardBody>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Trainings diese Woche</div>
            <div className="stat-value">{stats.count}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Ø Anstrengung</div>
            <div className="stat-value">{stats.avgRPE}/10</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Ø Energie</div>
            <div className="stat-value">{stats.avgEnergy}/10</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Ø Muskelkater</div>
            <div className="stat-value">{stats.avgSoreness}/10</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
