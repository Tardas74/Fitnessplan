import React, { useState, useEffect } from 'react';
import { initDB } from './db/index';
import { SessionFeedback } from './features/SessionFeedback';
import { TrainingWeek } from './features/TrainingWeek';
import { Recipes } from './features/Recipes';
import { SleepTracking } from './features/SleepTracking';
import { WaterTracking } from './features/WaterTracking';
import { ProgressCharts } from './features/ProgressCharts';
import {
  HomeIcon,
  MessageIcon,
  MoonIcon,
  DropletIcon,
  TrendingIcon,
} from './components/Icons';
import './App.css';

const SCREENS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'sleep', label: 'Schlaf', Icon: MoonIcon },
  { id: 'water', label: 'Wasser', Icon: DropletIcon },
  { id: 'progress', label: 'Fortschritt', Icon: TrendingIcon },
];

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDB().then(() => {
      setDbReady(true);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
      }
    });
  }, []);

  if (!dbReady) {
    return (
      <div className="app loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>PULS.OS wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-screen">
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'sleep' && <SleepScreen />}
        {activeScreen === 'water' && <WaterScreen />}
        {activeScreen === 'progress' && <ProgressScreen />}
      </div>

      <nav className="app-nav">
        {SCREENS.map((screen) => (
          <button
            key={screen.id}
            className={`nav-item ${activeScreen === screen.id ? 'active' : ''}`}
            onClick={() => setActiveScreen(screen.id)}
            aria-label={screen.label}
          >
            <screen.Icon />
            <span className="nav-label">{screen.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="home-screen-legacy">
      {/* Hero */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="eyebrow">Fitness & Ernährung</div>
            <h1>Lars Fitnessplan</h1>
          </div>
        </div>
        <div className="stat-row">
          <div className="stat-chip">
            <div className="num">4</div>
            <div className="lbl">Sessions</div>
          </div>
          <div className="stat-chip">
            <div className="num">2.4K</div>
            <div className="lbl">kcal Ziel</div>
          </div>
          <div className="stat-chip">
            <div className="num">72</div>
            <div className="lbl">kg</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="sheet">
        {/* Training */}
        <div className="card">
          <h2><span className="bar"></span>Training diese Woche</h2>
          <TrainingWeek />
        </div>

        {/* Recipes */}
        <Recipes />
      </div>
    </div>
  );
}

function FeedbackScreen() {
  return (
    <div className="app-screen">
      <div className="screen-header">
        <h1>Training Feedback</h1>
      </div>
      <SessionFeedback workoutTitle="Oberkörper Kraft" />
    </div>
  );
}

function SleepScreen() {
  return (
    <div className="app-screen">
      <div className="screen-header">
        <h1>Schlaf Tracking</h1>
      </div>
      <SleepTracking />
    </div>
  );
}

function WaterScreen() {
  return (
    <div className="app-screen">
      <div className="screen-header">
        <h1>Wasser Tracking</h1>
      </div>
      <WaterTracking />
    </div>
  );
}

function ProgressScreen() {
  return (
    <div className="app-screen">
      <div className="screen-header">
        <h1>Fortschritt</h1>
      </div>
      <ProgressCharts />
    </div>
  );
}

function ComingSoonScreen({ title }) {
  return (
    <div className="screen">
      <div className="screen-header">
        <h1>{title}</h1>
      </div>
      <div className="screen-content">
        <div className="coming-soon">
          <div className="coming-icon">🔨</div>
          <h2>Kommt bald</h2>
          <p>Diese Funktion wird in Kürze verfügbar sein.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
