# Implementierungsplan: Polstellen-Panik

## Spielkonzept Zusammenfassung
Ein Tower-Defense-Spiel, bei dem der Spieler im Koordinatenursprung (x=0) steht und ankommende "Funktions-Monster" (gebrochenrationale Funktionen) analysieren und nur die gefährlichen abschießen muss - nämlich die mit Polstellen bei x=0.

## Technische Anforderungen
- **Format**: Eine einzige HTML-Datei mit eingebettetem CSS und JavaScript
- **Zielgruppe**: Schüler der 11. Klasse (Mathematik Oberstufe)
- **Plattform**: Webbrowser (Desktop/Tablet)

## Ausgewählte Bibliotheken
1. **Math.js** (CDN) - Für mathematische Funktionsauswertung und Parsing
2. **KaTeX** (CDN) - Für schöne LaTeX-Darstellung der Funktionen
3. **Canvas API** (nativ) - Für Spielgrafiken und Animationen
4. **Web Audio API** (nativ) - Für Soundeffekte

## Architektur & Komponenten

### 1. HTML-Struktur
```html
- Game Container
  - Header (Titel, Score, Leben)
  - Game Canvas (Hauptspielbereich)
  - Function Display (aktuelle Funktionen)
  - Controls (Pause, Restart)
  - Instructions Panel (ausklappbar)
```

### 2. CSS-Design
- **Theme**: Dunkler, digitaler Raum (Cyberpunk-Ästhetik)
- **Farben**: 
  - Hintergrund: Dunkelblau/Schwarz
  - Spieler: Helles Blau
  - Gefährliche Monster: Rot
  - Harmlose Monster: Grün
  - Hebbare Lücken: Orange
- **Animationen**: Glowing-Effekte, Partikel bei Explosionen

### 3. JavaScript-Module

#### 3.1 Game Engine (`GameEngine`)
- Hauptspielschleife (requestAnimationFrame)
- Zustandsverwaltung (Menu, Playing, Paused, GameOver)
- Kollisionserkennung
- Score-System

#### 3.2 Function Generator (`FunctionGenerator`)
```javascript
class FunctionGenerator {
  generateFunction(difficulty) {
    // Erstellt zufällige gebrochenrationale Funktionen
    // Schwierigkeitsgrade:
    // 1: Einfache Funktionen wie x/(x-a), (x-b)/x
    // 2: Funktionen mit Faktorisierung nötig
    // 3: Komplexere Polynome im Zähler/Nenner
  }
  
  analyzeFunction(functionString) {
    // Bestimmt Polstellen, hebbare Lücken
    // Gibt zurück: { hasPolAt0: boolean, hasRemovableGapAt0: boolean }
  }
}
```

#### 3.3 Monster System (`Monster`)
```javascript
class Monster {
  constructor(functionString, startX, speed) {
    this.function = functionString;
    this.x = startX;
    this.speed = speed;
    this.type = this.analyzeType(); // 'dangerous', 'harmless', 'removable'
  }
  
  update() {
    // Bewegt Monster entlang des Funktionsgraphen zur y-Achse
    // Berechnet y-Wert basierend auf aktueller x-Position
  }
  
  draw(canvas) {
    // Zeichnet Monster mit entsprechender Farbe/Animation
  }
}
```

#### 3.4 Player System (`Player`)
```javascript
class Player {
  constructor() {
    this.x = 0; // Immer bei x=0
    this.y = 0;
    this.health = 3;
    this.score = 0;
    this.cannonAngle = 0;
  }
  
  shoot(targetMonster) {
    // Schießt auf Monster, prüft ob richtig/falsch
  }
}
```

#### 3.5 Math Analyzer (`MathAnalyzer`)
```javascript
class MathAnalyzer {
  static hasPolstelle(functionString, x = 0) {
    // Prüft ob Funktion Polstelle bei x hat
    // Verwendet Math.js für Parsing und Auswertung
  }
  
  static hasRemovableGap(functionString, x = 0) {
    // Prüft ob hebbare Lücke bei x existiert
    // Faktorisiert Zähler und Nenner
  }
  
  static evaluateFunction(functionString, x) {
    // Wertet Funktion an Stelle x aus
  }
}
```

## Spielmechanik Implementation

### Level-Progression
1. **Level 1-3**: Einfache Funktionen, langsame Geschwindigkeit
   - `f(x) = 1/x`, `g(x) = x/(x-1)`, `h(x) = (x-1)/x`
2. **Level 4-6**: Mehr Monster gleichzeitig, höhere Geschwindigkeit
3. **Level 7+**: Komplexere Funktionen, die Faktorisierung erfordern
   - `f(x) = (x²-1)/(x³-x)`, `g(x) = (x²)/(x²-4x)`

### Scoring-System
- **Richtiger Abschuss** (gefährliches Monster): +100 Punkte
- **Power-Up** (hebbare Lücke erreicht y-Achse): +50 Punkte
- **Falscher Abschuss** (harmloses Monster): -50 Punkte
- **Schaden** (gefährliches Monster erreicht y-Achse): -1 Leben, -100 Punkte

### Visual Feedback
- **Funktionsanzeige**: KaTeX-gerenderte Formeln über jedem Monster
- **Explosionseffekte**: Canvas-Partikelanimationen
- **Energiestrahl**: Animierte Linie von y-Achse nach oben/unten bei Polstellen-Treffer
- **Power-Up-Animation**: Glitzernde Partikel bei hebbaren Lücken

## Dateistruktur (Alles in einer HTML-Datei)

```html
<!DOCTYPE html>
<html>
<head>
  <!-- KaTeX CSS -->
  <!-- Custom CSS -->
</head>
<body>
  <!-- Game HTML -->
  
  <!-- KaTeX JS -->
  <!-- Math.js -->
  <!-- Game JavaScript -->
  <script>
    // Alle Klassen und Spiellogik hier
  </script>
</body>
</html>
```

## Implementierungsreihenfolge

### Phase 1: Grundgerüst (2-3 Stunden)
1. HTML-Struktur und CSS-Styling
2. Canvas-Setup und Grundanimationen
3. Einfache Monster-Bewegung (gerade Linie)

### Phase 2: Mathematik-Integration (3-4 Stunden)
1. Math.js Integration für Funktionsauswertung
2. Polstellen-/Lücken-Erkennung implementieren
3. Monster bewegen sich entlang Funktionsgraphen
4. KaTeX für Funktionsanzeige

### Phase 3: Spielmechanik (2-3 Stunden)
1. Schießsystem implementieren
2. Kollisionserkennung
3. Scoring und Leben-System
4. Level-Progression

### Phase 4: Polish & UX (1-2 Stunden)
1. Soundeffekte
2. Partikeleffekte
3. Anweisungen und Tutorial
4. Responsive Design

## Herausforderungen & Lösungsansätze

### 1. Funktionsgraph-Bewegung
**Problem**: Monster sollen sich entlang des Funktionsgraphen bewegen
**Lösung**: Schrittweise x-Werte verringern und entsprechende y-Werte berechnen

### 2. Mathematische Analyse
**Problem**: Zuverlässige Erkennung von Polstellen vs. hebbaren Lücken
**Lösung**: Math.js für symbolische Manipulation, Grenzwertberechnung

### 3. Performance
**Problem**: Viele Monster mit Echtzeit-Funktionsauswertung
**Lösung**: Vorberechnung von Funktionswerten, effiziente Canvas-Rendering

### 4. Benutzerfreundlichkeit
**Problem**: Komplexe Mathematik für Schüler verständlich machen
**Lösung**: Klare visuelle Hinweise, Tutorial-Modus, Hilfetexte

## Erweiterungsmöglichkeiten
- Multiplayer-Modus
- Verschiedene Waffentypen
- Boss-Monster (komplexere Funktionen)
- Achievements-System
- Funktions-Editor für eigene Level
