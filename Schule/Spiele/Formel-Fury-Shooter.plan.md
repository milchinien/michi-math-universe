# Implementierungsplan: Formel-Fury-Shooter

## Spiel-Übersicht
Ein brutaler Rogue-like-Shooter, wo Spieler durch zufällig generierte Dungeons navigieren und Gegner durch das Eingeben korrekter binomischer Formeln besiegen.

## Technische Architektur

### Haupttechnologien
- **HTML5 Canvas** für Rendering und Animation
- **Vanilla JavaScript** für Spiellogik
- **CSS3** für UI-Styling und Animationen
- **Web Audio API** für Sound-Effekte
- **LocalStorage** für Persistent-Upgrades

### Externe Bibliotheken
- **Math.js** für mathematische Auswertung und Validierung
- **Howler.js** für Audio-Management
- **Particles.js** für Partikel-Effekte

## Kern-Komponenten

### 1. Game Engine (GameEngine.js)
```javascript
class GameEngine {
    - Haupt-Game-Loop (60 FPS)
    - State Management (Menu, Playing, GameOver, Paused)
    - Input-Handler
    - Collision Detection
    - Rendering Pipeline
}
```

### 2. Dungeon Generator (DungeonGenerator.js)
```javascript
class DungeonGenerator {
    - Procedural Room Generation
    - Korridor-Verbindungen
    - Enemy Spawn Points
    - Power-up Placement
    - Difficulty Scaling
}
```

### 3. Player System (Player.js)
```javascript
class Player {
    - Movement (WASD)
    - Health/Shield System
    - Weapon System
    - Combo Counter
    - Experience/Level System
}
```

### 4. Enemy System (Enemy.js)
```javascript
class Enemy {
    - AI Behavior (Chase, Patrol, Attack)
    - Formula Assignment
    - Animation States
    - Health System
    - Different Enemy Types:
        * Polynom-Zombies (Basic)
        * Gleichungs-Geister (Fast)
        * Elite-Mobs (Multiple formulas)
        * Math-Bosses (Complex formulas)
}
```

### 5. Formula System (FormulaSystem.js)
```javascript
class FormulaSystem {
    - Formula Generator (verschiedene Schwierigkeitsgrade)
    - Answer Validation
    - Hint System
    - Progress Tracking
    - Formula Types:
        * (a+b)² = a² + 2ab + b²
        * (a-b)² = a² - 2ab + b²
        * (a+b)(a-b) = a² - b²
        * Faktorisierung: a² - b² = (a+b)(a-b)
}
```

### 6. Weapon System (WeaponSystem.js)
```javascript
class WeaponSystem {
    - Formel-Waffen:
        * Faktorisierungs-Flinte (zeigt Hinweise)
        * Distributive-Maschinengewehr (mehr Zeit)
        * Quadrat-Kanone (doppelter Schaden)
    - Upgrade-System
    - Ammunition Management
}
```

### 7. Power-up System (PowerUpSystem.js)
```javascript
class PowerUpSystem {
    - Temporary Buffs:
        * Adrenalin-Shot (doppelte Tippgeschwindigkeit)
        * Algebra-Röntgen (zeigt Faktorisierung)
        * Time-Dilation (verlangsamt Gegner)
    - Duration Management
    - Visual Effects
}
```

### 8. UI System (UISystem.js)
```javascript
class UISystem {
    - HUD (Health, Combo, Score)
    - Formula Input Field
    - Weapon/Power-up Icons
    - Mini-Map
    - Death Screen / Upgrade Menu
}
```

## Detaillierte Implementierung

### Spielablauf
1. **Start Screen**: Menü mit Continue/New Game/Upgrades
2. **Dungeon Generation**: Neue zufällige Level
3. **Gameplay Loop**:
   - Player bewegung durch Dungeon
   - Enemy spawning und AI
   - Formula Challenge bei Gegner-Targeting
   - Input Validation und Feedback
   - Power-up/Weapon Collection
   - Level Progression
4. **Death/Victory**: Upgrade-System und Restart

### Mathematik-Engine
```javascript
class MathEngine {
    generateFormula(difficulty) {
        // Basierend auf Schwierigkeit:
        // Level 1: (x+1)², (x-2)²
        // Level 2: (2x+3)², (3x-1)²
        // Level 3: (x+y)², Faktorisierung
        // Level 4: Verschachtelte Formeln
        // Level 5: Multiple Gleichungen
    }
    
    validateAnswer(formula, userInput) {
        // Math.js für symbolische Mathematik
        // Verschiedene Eingabe-Formate akzeptieren
        // Teilweise richtige Antworten bewerten
    }
    
    generateHint(formula) {
        // Schritt-für-Schritt Hinweise
        // Basis auf Waffen-Typ
    }
}
```

### Rogue-like Mechaniken
- **Procedural Generation**: Seed-basierte Dungeon-Erstellung
- **Permadeath**: Verlust aller temporären Upgrades
- **Meta-Progression**: Permanente Skill-Freischaltungen
- **Run Variation**: Verschiedene Waffen/Power-up Kombinationen

### Difficulty Scaling
- **Time Pressure**: Weniger Zeit pro Formula bei höheren Leveln
- **Formula Complexity**: Komplexere mathematische Ausdrücke
- **Enemy Density**: Mehr Gegner gleichzeitig
- **Multi-Step Challenges**: Mehrere Formeln für einen Gegner

### Audio Design
- **Ambient**: Düstere Dungeon-Atmosphäre
- **SFX**: 
  - Richtige Antwort: Explosion, Erfolg-Sound
  - Falsche Antwort: Schaden-Sound, Combo-Break
  - Power-ups: Elektronische Pickup-Sounds
  - Weapon Fire: Verschiedene mathematische "Schuss"-Sounds

### Visual Design
- **Art Style**: Neon-Cyberpunk mit dunklen Dungeons
- **Particle Effects**: Explosionen bei richtigen Antworten
- **UI Elements**: Futuristische HUD-Elemente
- **Enemy Design**: Verschiedene mathematische Monster-Typen
- **Animations**: Smooth character movement, enemy death animations

## Datei-Struktur (Single HTML)
```html
<!DOCTYPE html>
<html>
<head>
    <!-- CSS Styles -->
    <style>
        /* Game UI Styling */
        /* Canvas Styling */
        /* Animation Keyframes */
    </style>
</head>
<body>
    <!-- Game Canvas -->
    <!-- UI Overlays -->
    <!-- Input Fields -->
    
    <!-- External Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
    
    <!-- Game Code -->
    <script>
        // All game classes and logic
        // Initialization code
    </script>
</body>
</html>
```

## Performance Optimierungen
- **Object Pooling** für Enemies und Bullets
- **Spatial Partitioning** für Collision Detection
- **LOD System** für entfernte Objekte
- **Canvas Layering** für UI und Gameplay
- **Efficient Rendering** mit RequestAnimationFrame

## Lernziele Integration
- **Automatisierung**: Zeitdruck entwickelt Reflexe
- **Wiederholung**: Rogue-like sorgt für endlose Übung
- **Motorisches Lernen**: Tippen aktiviert Muskelgedächtnis
- **Progression**: Schwierigkeit steigt graduell an
- **Engagement**: Spielmechaniken motivieren zum Weiterspielen

## Erweiterungsmöglichkeiten
- **Multiplayer**: Co-op Dungeon Runs
- **Editor**: Eigene Formeln erstellen
- **Leaderboards**: Beste Scores und Zeiten
- **Achievement System**: Verschiedene Herausforderungen
- **Daily Challenges**: Spezielle tägliche Dungeons

Dieses Design erstellt ein vollständiges, süchtig machendes Rogue-like-Spiel, das binomische Formeln durch intensive, wiederholte Praxis unter Zeitdruck lehrt.

