import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMeasurementsThisMonth, addMeasurement } from '../db/index';
import './ProgressCharts.css';

export function ProgressCharts() {
  const [weight, setWeight] = useState('72');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [saved, setSaved] = useState(false);

  // Vergleich-Modus
  const [compareMode, setCompareMode] = useState(false);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [selectedDate2, setSelectedDate2] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMeasurementsThisMonth();
    setMeasurements(data || []);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setPhoto(base64);
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!photo) {
      alert('Bitte lade zuerst ein Foto hoch!');
      return;
    }

    await addMeasurement({
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(weight),
      photo: photo,
    });

    setSaved(true);
    setPhoto(null);
    setPhotoPreview(null);
    setWeight('72');
    setTimeout(() => setSaved(false), 2000);
    loadData();
  };

  const chartData = measurements.slice(-30).map(m => ({
    date: m.date ? m.date.split('-')[2] : '',
    weight: m.weight,
    fullDate: m.date,
  }));

  const currentWeight = measurements.length > 0
    ? measurements[measurements.length - 1].weight
    : parseFloat(weight);

  const startWeight = measurements.length > 0
    ? measurements[0].weight
    : 0;

  const weightChange = (currentWeight - startWeight).toFixed(1);

  // Vergleich-Berechnung
  const getEntryByDate = (date) => measurements.find(m => m.date === date);

  const entry1 = selectedDate1 ? getEntryByDate(selectedDate1) : null;
  const entry2 = selectedDate2 ? getEntryByDate(selectedDate2) : null;

  const weightDiff = entry1 && entry2
    ? (parseFloat(entry2.weight) - parseFloat(entry1.weight)).toFixed(1)
    : null;

  return (
    <div className="progress-charts">
      {!compareMode ? (
        <>
          {/* Kombinierte Erfassung */}
          <div className="measure-card">
            <div className="card-section">
              <h3 className="section-title">📸 Foto hochladen</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px dashed var(--color-primary)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-primary-light)',
                }}
              />
              {photoPreview && (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" />
                  <button
                    className="remove-photo-btn"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                  >
                    ✕ Entfernen
                  </button>
                </div>
              )}
            </div>

            <div className="card-divider"></div>

            <div className="card-section">
              <h3 className="section-title">⚖️ Gewicht messen</h3>
              <div className="input-group">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="z.B. 72.5"
                />
                <span className="input-unit">kg</span>
              </div>
            </div>

            <button
              className={`measure-save-btn ${saved ? 'saved' : ''}`}
              onClick={handleSave}
              disabled={!photo}
            >
              {saved ? '✓ Gespeichert' : 'Eintrag speichern'}
            </button>
          </div>

          {/* Stats */}
          <div className="progress-stats">
            <h3>Fortschritt</h3>
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-label">Aktuelles Gewicht</div>
                <div className="stat-value">{currentWeight.toFixed(1)} kg</div>
                <div
                  className="stat-change"
                  style={{
                    color: weightChange < 0 ? '#10b981' : weightChange > 0 ? '#ef4444' : '#6b7280'
                  }}
                >
                  {weightChange > 0 ? '+' : ''}{weightChange} kg
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Einträge</div>
                <div className="stat-value">{measurements.length}</div>
                <div className="stat-subtitle">diesen Monat</div>
              </div>
            </div>
          </div>

          {/* Gewichtsverlauf Chart */}
          {chartData.length > 1 && (
            <div className="chart-container">
              <h3>Gewichtsverlauf</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain="dataMin - 2" />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-primary)', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Vergleich-Modus Button */}
          {measurements.length >= 2 && (
            <button
              className="compare-mode-btn"
              onClick={() => setCompareMode(true)}
            >
              📸 Before/After vergleichen
            </button>
          )}

          {/* Fotogalerie */}
          {measurements.length > 0 && (
            <div className="photo-gallery">
              <h3>Deine Einträge</h3>
              <div className="photos-grid">
                {measurements.slice().reverse().map((m, idx) => (
                  <div key={idx} className="photo-item">
                    {m.photo && <img src={m.photo} alt={`Eintrag ${m.date}`} />}
                    <div className="photo-info">
                      <span className="photo-date">{m.date}</span>
                      <span className="photo-weight">{m.weight} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Vergleich-Modus */}
          <div className="compare-section">
            <button
              className="back-btn"
              onClick={() => {
                setCompareMode(false);
                setSelectedDate1(null);
                setSelectedDate2(null);
              }}
            >
              ← Zurück
            </button>

            <h2>Before/After Vergleich</h2>

            <h3>Wähle zwei Daten zum Vergleichen</h3>

            <div className="compare-selectors">
              <div className="selector">
                <label>📅 Before</label>
                <select
                  value={selectedDate1 || ''}
                  onChange={(e) => setSelectedDate1(e.target.value || null)}
                >
                  <option value="">-- Datum wählen --</option>
                  {measurements.map((m) => (
                    <option key={m.date} value={m.date}>
                      {m.date} • {m.weight} kg
                    </option>
                  ))}
                </select>
              </div>

              <div className="selector">
                <label>📅 After</label>
                <select
                  value={selectedDate2 || ''}
                  onChange={(e) => setSelectedDate2(e.target.value || null)}
                >
                  <option value="">-- Datum wählen --</option>
                  {measurements.map((m) => (
                    <option key={m.date} value={m.date}>
                      {m.date} • {m.weight} kg
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {entry1 && entry2 && (
              <>
                {/* Fotos Vergleich - Nebeneinander */}
                <div className="comparison-photos-grid">
                  <div className="comparison-photo-card">
                    <div className="photo-label">BEFORE</div>
                    {entry1.photo ? (
                      <img src={entry1.photo} alt="Before" className="comparison-img" />
                    ) : (
                      <div className="no-photo">Kein Foto</div>
                    )}
                    <div className="photo-info-bottom">
                      <div className="info-date">{entry1.date}</div>
                      <div className="info-weight">{entry1.weight} kg</div>
                    </div>
                  </div>

                  <div className="comparison-photo-card">
                    <div className="photo-label">AFTER</div>
                    {entry2.photo ? (
                      <img src={entry2.photo} alt="After" className="comparison-img" />
                    ) : (
                      <div className="no-photo">Kein Foto</div>
                    )}
                    <div className="photo-info-bottom">
                      <div className="info-date">{entry2.date}</div>
                      <div className="info-weight">{entry2.weight} kg</div>
                    </div>
                  </div>
                </div>

                {/* Statistiken */}
                <div className="comparison-stats">
                  <div className="stat-item">
                    <span className="stat-label">Zeitraum</span>
                    <span className="stat-value">
                      {Math.abs(new Date(entry2.date) - new Date(entry1.date)) / (1000 * 60 * 60 * 24)} Tage
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Gewichtsänderung</span>
                    <span
                      className="stat-value"
                      style={{
                        color: weightDiff < 0 ? '#10b981' : weightDiff > 0 ? '#ef4444' : '#6b7280'
                      }}
                    >
                      {weightDiff > 0 ? '+' : ''}{weightDiff} kg
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
