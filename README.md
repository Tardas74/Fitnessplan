# PULS.OS – Professional Fitness App

Eine Modern React-basierte Progressive Web App für mobiles Fitness Tracking mit allen wichtigen Features.

## 🚀 Features (Phase 1)

✅ **Session Feedback** – RPE, Energy, Soreness nach jedem Training  
🔨 **Sleep Tracking** – Sleep-Quality Logging  
🔨 **Water Tracking** – Daily Intake Logger  
🔨 **Fortschritts-Grafiken** – Leistungskurven + Photo Progress  
🔨 **Kalender-Übersicht** – Monat-Konsistenz-View  
🔨 **Vorausplanung** – Preview nächste Woche  

## 🛠️ Setup

### Voraussetzungen
- Node.js 16+
- npm oder yarn

### Installation

```bash
# Klone das Repo
git clone <repo-url>
cd Fitnessplan-React

# Installiere Dependencies
npm install

# Starte Dev-Server
npm run dev
```

Der Server läuft dann auf `http://localhost:5173`

### Build für Production

```bash
npm run build
```

Das erstellt einen optimierten `dist/` Ordner, bereit für GitHub Pages.

## 📁 Projektstruktur

```
Fitnessplan-React/
├── public/
│   ├── manifest.json      # PWA Manifest
│   └── service-worker.js  # Service Worker für Offline
├── src/
│   ├── components/        # Wiederverwendbare UI-Components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── *.css
│   ├── features/          # Feature-Module (6 Features)
│   │   ├── SessionFeedback.jsx
│   │   └── ...
│   ├── db/                # IndexedDB Wrapper
│   │   └── index.js
│   ├── App.jsx            # Haupt-App + Navigation
│   ├── App.css
│   ├── index.css          # Design System (Colors, Tokens)
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Design System

Farben (OKLch):
- **Primary**: `oklch(66% 0.19 45)` – Warm Orange
- **Text**: `oklch(18% 0.01 55)` – Dark
- **Background**: `oklch(98% 0.006 60)` – Light

Fonts:
- **Display**: Inter (400–800)
- **Mono**: IBM Plex Mono (für Labels/Data)

## 💾 Datenspeicherung

Alle Daten werden lokal in **IndexedDB** gespeichert:
- `sessions` – Training Feedback (RPE, Energy, Soreness)
- `sleep` – Schlaf-Daten
- `water` – Wasser-Intake
- `measurements` – Körpermessungen
- `workouts` – Workout-Logs
- `photos` – Progress-Fotos
- `syncQueue` – Sync-Warteschlange für GitHub

Die Daten bleiben 100% lokal, können aber optional zu GitHub synced werden.

## 📱 Mobile Installation

### Android (PWA)
1. Öffne die App im Chrome Browser
2. Klicke auf ⋯ (Menü) → "Zum Startbildschirm hinzufügen"
3. Die App ist nun wie eine native App installiert

### GitHub Pages Deployment

```bash
# Build
npm run build

# Push dist/ zu GitHub
git add dist/
git commit -m "Build: React App"
git push origin main
```

Dann GitHub Pages aktivieren: Repo Settings → Pages → Source: `main/dist`

## 🔧 Tech Stack

- **React 18** – UI Framework
- **Vite** – Bundler (schnell, modern)
- **Recharts** – Datenvisualisierung
- **idb** – IndexedDB Wrapper
- **OKLch Colors** – Moderne Farbräume
- **Service Worker** – PWA & Offline

## 📝 Nächste Schritte

1. ✅ Session Feedback fertig
2. 🔨 Sleep Tracking hinzufügen
3. 🔨 Water Tracking hinzufügen
4. 🔨 Fortschritts-Grafiken mit Recharts
5. 🔨 Kalender-Integration (calendar.ics)
6. 🔨 Photo Comparison mit Camera API
7. 🔨 GitHub Sync Layer
8. 🔨 Cordova/Capacitor für APK

## 📄 Lizenz

Privat – nur für Lars
