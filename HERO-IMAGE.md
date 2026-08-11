# Hero-Bild anpassen

## Aktueller Status
Die App lädt derzeit ein Standard-Windsurfing-Foto von Unsplash.

## Dein eigenes Bild verwenden

### Option 1: Bild in den public Ordner kopieren (EINFACH)

1. **Bild vorbereiten:**
   - Größe: mindestens 1200x400px (optimal für Desktop)
   - Format: JPG oder PNG
   - Größe: unter 500KB (für schnelleres Laden)

2. **Bild speichern:**
   - Kopiere dein Windsurfing-Foto in: `public/windsurfing-hero.jpg`
   - Datei muss exakt `windsurfing-hero.jpg` heißen

3. **App neu laden:**
   - Stoppe den Dev-Server (Ctrl+C)
   - Starte neu: `npm run dev`
   - Browser: F5 (Hard-Refresh mit Ctrl+F5)

### Option 2: URL anpassen (ALTERNATIV)

Bearbeite `src/App.css` Zeile 80:

```css
.hero {
  background: linear-gradient(...),
              url('DEINE_URL_HIER') center/cover no-repeat;
}
```

### Option 3: Bild direkt hochladen

Wenn du das Bild hochgeladen hast:
1. Öffne: `Fitnessplan-React/public/`
2. Ersetze `windsurfing-hero.jpg` mit deinem Foto
3. Stelle sicher, dass die Datei exakt `windsurfing-hero.jpg` heißt

---

## Tipps zur Bildoptimierung

**Beste Ergebnisse:**
- Format: JPG (komprimiert besser)
- Auflösung: 1200x400px für Desktop / 600x300px für Mobile
- Qualität: 80% (Balance zwischen Qualität und Dateigröße)

**Tools zum Komprimieren:**
- https://tinypng.com (Online)
- ImageMagick (Kommandozeile)
- Paint (Windows - "Speichern unter" mit hoher Kompression)

---

## Bildoptimierung manuell (Windows)

```powershell
# Mit Windows Paint:
1. Öffne dein Foto in Paint
2. Datei → Speichern unter
3. Format: JPG auswählen
4. Name: windsurfing-hero.jpg
5. Speichern in: public\
```

---

## Fallback

Sollte das Bild nicht laden:
- App zeigt trotzdem Gradient-Hintergrund
- Text bleibt lesbar durch dunkleren Overlay
- Kein Fehler → App funktioniert normal
