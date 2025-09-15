# Quadrier-Quarantäne – Implementierungsplan

## Spielkonzept Übersicht
Puzzle-Boss-Rush um Wurzelgleichungen mit dem Ziel, Wurzeln zu isolieren, sinnvoll zu quadrieren und Scheinlösungen zu entlarven. Jeder Boss "infiziert" Gleichungen mit Fallen, die nur durch saubere Definitionsprüfung geheilt werden.

## Technische Architektur

### Dateistruktur
- **Eine einzige HTML-Datei** mit eingebettetem CSS und JavaScript
- Modulare JavaScript-Struktur für bessere Wartbarkeit
- Canvas-basierte Grafiken für dynamische Visualisierungen

### Bibliotheken
- **Math.js** - Für mathematische Ausdrücke und Gleichungsverarbeitung
- **KaTeX** - Für schöne mathematische Notation (CDN)
- **Canvas API** - Für Boss-Animationen und visuelle Effekte
- **Web Audio API** - Für Soundeffekte und Feedback

## Core-Systeme

### 1. Gleichungs-Engine
```javascript
class EquationEngine {
  // Wurzelgleichungen generieren und verwalten
  // Scheinlösungen systematisch einbauen
  // Definitionsbereiche prüfen
}
```

**Features:**
- Gleichungsgenerator für verschiedene Schwierigkeitsgrade
- Automatische Scheinlösungserkennung
- Definitionsbereich-Validator
- Schritt-für-Schritt Lösungsvalidierung

### 2. Boss-System
```javascript
class BossManager {
  // Drei Boss-Typen mit unterschiedlichen Mechaniken
  // Boss-spezifische Gleichungstypen
  // Adaptive Schwierigkeit basierend auf Spielerleistung
}
```

**Boss-Typen:**
1. **Mirror Chief** 
   - Spezialisiert auf Vorzeichen-Fallen (a < 0, b < 0)
   - Visueller Stil: Spiegeleffekte und Verzerrungen
   - Mechanik: Falsche Vorzeichen erzeugen Scheinlösungen

2. **Stacker**
   - Multiple Wurzeln in einer Gleichung
   - Visueller Stil: Schichteffekte und Überlagerungen
   - Mechanik: Falsche Isolierreihenfolge multipliziert Fakes

3. **Fraction Fiend**
   - Rationale Exponenten x^(m/n)
   - Visueller Stil: Fraktale und gebrochene Muster
   - Mechanik: Gerade/ungerade Exponenten korrekt berücksichtigen

### 3. Werkzeug-System
```javascript
class ToolSystem {
  // Definitions-Lampe: Hervorhebung erlaubter x-Bereiche
  // Probe-Siegel: Lösungsvalidierung mit visueller Rückmeldung
  // Upgrade-System für Werkzeuge
}
```

**Werkzeuge:**
- **Definitions-Lampe**: Interaktive Bereichsvisualisierung
- **Probe-Siegel**: Automatische Lösungsprüfung mit Farbkodierung
- **Isolations-Kompass**: Hilft bei der Reihenfolge der Wurzelisolation

### 4. Gameplay-Loop Engine
```javascript
class GameplayLoop {
  // 1. Wurzel isolieren
  // 2. Quadrierentscheidung
  // 3. Definitionsprüfung
  // 4. Lösungsvalidierung
}
```

## UI/UX Design

### 1. Haupt-Interface
- **Gleichungsbereich**: Zentral, mit KaTeX-Rendering
- **Werkzeugleiste**: Links, mit Drag & Drop Funktionalität
- **Boss-Arena**: Rechts, mit Canvas-Animationen
- **Fortschrittsleiste**: Oben, zeigt Boss-Leben und Spielerfortschritt

### 2. Interaktionssystem
- **Drag & Drop**: Für Terme und Operationen
- **Klick-basierte Auswahl**: Für Quadrierentscheidungen
- **Hover-Effekte**: Für Definitionsbereichs-Vorschau
- **Animation Feedback**: Für richtige/falsche Aktionen

### 3. Visuelles Design
- **Farb-Schema**: 
  - Grün für korrekte Lösungen
  - Rot für Scheinlösungen
  - Blau für Definitionsbereiche
  - Gold für Boss-Schwachstellen
- **Partikeleffekte** für Erfolge und Misserfolge
- **Screen-Shake** für Boss-Angriffe

## Scoring & Progression

### 1. Punktesystem
```javascript
class ScoreSystem {
  // + Punkte: Minimale Quadrier-Schritte, korrekte Reihenfolge, vollständige Probe
  // - Punkte: Scheinlösungen, vergessene Definitionsprüfung, unnötige Quadrate
  // Combo-Multiplier für aufeinanderfolgende korrekte Lösungen
}
```

### 2. Lern-Progression
- **Reflexionsscreens** nach jedem Boss
- **Fehleranalyse** mit konkreten Tipps
- **Schwierigkeitsanpassung** basierend auf Spielerleistung

## Implementierungsphasen

### Phase 1: Grundgerüst (2-3 Stunden)
1. **HTML-Struktur** mit Canvas und UI-Elementen
2. **CSS-Styling** für grundlegendes Layout
3. **JavaScript-Module** für Kernfunktionalität
4. **KaTeX-Integration** für Gleichungsdarstellung

### Phase 2: Mathematik-Engine (3-4 Stunden)
1. **Gleichungsgenerator** für Wurzelgleichungen
2. **Lösungsalgorithmus** mit Scheinlösungserkennung
3. **Definitionsbereich-Berechnung**
4. **Validierungssystem** für Spielereingaben

### Phase 3: Boss-System (4-5 Stunden)
1. **Boss-Klassen** mit individuellen Mechaniken
2. **Canvas-Animationen** für Boss-Darstellung
3. **Boss-spezifische Gleichungstypen**
4. **Kampf-Logik** und Gesundheitssystem

### Phase 4: Werkzeuge & Interaktion (3-4 Stunden)
1. **Definitions-Lampe** Implementation
2. **Probe-Siegel** mit visueller Rückmeldung
3. **Drag & Drop** Interaktionssystem
4. **Werkzeug-Upgrades** und Progression

### Phase 5: UI/UX Polish (2-3 Stunden)
1. **Animationen** und Übergangseffekte
2. **Sound-Integration** für Feedback
3. **Responsive Design** für verschiedene Bildschirmgrößen
4. **Accessibility** Features

### Phase 6: Balance & Testing (2-3 Stunden)
1. **Schwierigkeitsbalancing** für alle Boss-Typen
2. **Bug-Fixes** und Performance-Optimierung
3. **Reflexionsscreen-Inhalte** finalisieren
4. **Finale Tests** und Polishing

## Technische Spezifikationen

### JavaScript-Module
```javascript
// Hauptmodule
const GameEngine = {
  equation: new EquationEngine(),
  boss: new BossManager(),
  tools: new ToolSystem(),
  score: new ScoreSystem(),
  ui: new UIManager()
};
```

### CSS-Framework
- **Grid Layout** für responsive Struktur
- **CSS Variables** für konsistente Farben
- **Animations** mit CSS Transitions
- **Media Queries** für mobile Kompatibilität

### Performance-Optimierungen
- **Canvas-Optimierung** mit RequestAnimationFrame
- **Event Delegation** für bessere Performance
- **Lazy Loading** für Boss-Assets
- **Memory Management** für lange Spielsessions

## Erweiterte Features (Optional)

### 1. Tutorial-System
- **Interaktive Einführung** in Spielmechaniken
- **Schrittweise Freischaltung** von Werkzeugen
- **Guided Practice** für jeden Boss-Typ

### 2. Achievements
- **Perfektionist**: Keine Scheinlösungen in einem Level
- **Speedrunner**: Level unter Zeitlimit abgeschlossen
- **Mathematiker**: Alle Definitionsprüfungen korrekt

### 3. Statistiken
- **Lösungsgenauigkeit** über Zeit
- **Häufigste Fehlertypen** für gezieltes Training
- **Fortschritt-Tracking** für Lernende

## Zeitschätzung
**Gesamtdauer**: 16-22 Stunden für vollständige Implementation
**MVP-Version**: 8-10 Stunden für spielbare Grundversion

## Erfolgskriterien
1. **Mathematisch korrekte** Gleichungsgenerierung und -validierung
2. **Intuitive Benutzerführung** durch den Lösungsprozess
3. **Engagierende Boss-Kämpfe** mit klarer Lernzielverbindung
4. **Effektive Fehleraufklärung** durch Reflexionsscreens
5. **Smooth Performance** auf Standard-Browsern

## Zielgruppe
- **Primär**: Schüler der Oberstufe (Klasse 11-12)
- **Sekundär**: Studenten in Vorkursen Mathematik
- **Vorwissen**: Grundlagen der Algebra und Potenzgesetze
