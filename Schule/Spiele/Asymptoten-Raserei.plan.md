# Asymptoten-Raserei - Implementierungsplan

## Spielkonzept
Ein rasantes Rennspiel auf dem Graphen einer gebrochenrationalen Funktion mit Cyberpunk-Ästhetik. Der Spieler steuert einen Punkt auf der Funktion und muss Polstellen ausweichen, Sprünge über Definitionslücken meistern und Asymptoten als Boost-Zonen nutzen.

## Technische Anforderungen
- **Ziel**: Eine einzige HTML-Datei mit allem (HTML, CSS, JavaScript)
- **Grafik**: Canvas-basiert für flüssige Animation
- **Bibliotheken**: Minimal - nur native JavaScript oder leichtgewichtige Libs
- **Stil**: Neon/Cyberpunk-Ästhetik

## Gewählte Technologien
- **HTML5 Canvas** für Rendering
- **Vanilla JavaScript** für Logik
- **CSS3** für UI-Styling
- **Optional**: Math.js für komplexere Funktionsauswertung (falls nötig)

## Kernkomponenten

### 1. Mathematische Engine
- **Funktionsparser**: Parst gebrochenrationale Funktionen (z.B. `f(x) = (2x²)/(x²-4)`)
- **Polstellenerkennung**: Findet Nullstellen des Nenners
- **Asymptotenerkennung**: 
  - Vertikale Asymptoten (Polstellen)
  - Horizontale/schiefe Asymptoten (Grenzwertanalyse)
- **Definitionslückenerkennung**: Hebbare Unstetigkeiten
- **Funktionsauswertung**: Sichere Berechnung von f(x) mit Grenzwertbehandlung

### 2. Grafik-Engine
- **Koordinatensystem**: Transformation zwischen mathematischen und Canvas-Koordinaten
- **Funktionsplot**: Dynamisches Zeichnen der Kurve
- **Visualisierungen**:
  - Polstellen: Rote, pulsierende Energiewände
  - Definitionslücken: Kleine Löcher mit Sprungmarkierungen
  - Asymptoten: Leuchtende Boost-Schienen
  - Spieler: Neon-Gleiter auf der Kurve

### 3. Spielmechanik
- **Bewegungssteuerung**: 
  - Pfeiltasten/WASD für x-Wert-Änderung
  - Automatische y-Berechnung über f(x)
- **Kollisionserkennung**:
  - Polstellen: Sofortiger Tod bei Berührung
  - Definitionslücken: Sprung erforderlich (Leertaste)
- **Boost-System**: Geschwindigkeitsbonus bei Asymptoten-Nähe
- **Scoring**: Punkte für Distanz, Sprünge, Boosts

### 4. Level-System
- **Level 1**: Einfache Funktion mit 1-2 Polstellen
- **Level 2-5**: Komplexere Funktionen mit mehr Hindernissen
- **Schwierigkeitssteigerung**: Mehr Polstellen, engere Asymptoten

## Detaillierte Implementierung

### HTML-Struktur
```html
<!DOCTYPE html>
<html>
<head>
    <title>Asymptoten-Raserei</title>
    <style>/* Cyberpunk CSS */</style>
</head>
<body>
    <div id="gameContainer">
        <canvas id="gameCanvas"></canvas>
        <div id="ui">
            <div id="score">Score: 0</div>
            <div id="level">Level: 1</div>
            <div id="function">f(x) = ...</div>
        </div>
        <div id="controls">
            <p>← → Bewegung | Leertaste: Sprung</p>
        </div>
    </div>
    <script>/* Game Logic */</script>
</body>
</html>
```

### JavaScript-Architektur

#### Klassen-Design
```javascript
class Game {
    constructor()
    init()
    gameLoop()
    render()
    update()
}

class MathEngine {
    parseFunction(functionString)
    findPoles(function)
    findAsymptotes(function)
    findRemovableDiscontinuities(function)
    evaluateFunction(x)
}

class Player {
    constructor(x, y)
    update()
    jump()
    checkCollisions()
}

class Level {
    constructor(functionString)
    loadFunction()
    generateObstacles()
}

class Renderer {
    drawFunction()
    drawPlayer()
    drawPoles()
    drawAsymptotes()
    drawUI()
}
```

#### Kern-Algorithmen

**1. Polstellenerkennung**
```javascript
findPoles(numerator, denominator) {
    // Finde Nullstellen des Nenners
    // Prüfe ob auch Nullstelle des Zählers (→ hebbare Lücke)
    // Bestimme Vorzeichen links/rechts der Polstelle
}
```

**2. Asymptotenerkennung**
```javascript
findHorizontalAsymptote(function) {
    // Gradvergleich Zähler/Nenner
    // Leitkoeffizientenvergleich
}

findObliqueAsymptote(function) {
    // Polynomdivision für Grad(Zähler) = Grad(Nenner) + 1
}
```

**3. Kollisionserkennung**
```javascript
checkPoleCollision(playerX, poles) {
    for(let pole of poles) {
        if(Math.abs(playerX - pole.x) < COLLISION_THRESHOLD) {
            return true; // Game Over
        }
    }
}
```

### Grafik-Design

#### Cyberpunk-Ästhetik
- **Farbschema**: Neon-Blau (#00FFFF), Neon-Pink (#FF00FF), Schwarz (#000000)
- **Effekte**: Glowing, Pulsieren, Partikel
- **Schriftart**: Monospace, futuristisch
- **Hintergrund**: Dunkles Raster, Matrix-Stil

#### Animationen
- **Polstellen**: Rote Energiewände mit Blitzeffekten
- **Asymptoten**: Fließende Neon-Linien
- **Spieler**: Leuchtender Punkt mit Schweif
- **Partikel**: Bei Sprüngen und Boosts

### Level-Progression

#### Level 1: Tutorial
```
f(x) = 1/(x-2)
- Eine Polstelle bei x=2
- Einfache horizontale Asymptote y=0
```

#### Level 2: Doppelte Gefahr
```
f(x) = 1/((x-1)(x+1))
- Zwei Polstellen bei x=±1
- Verschiedene Vorzeichen-Verhalten
```

#### Level 3: Hebbare Lücke
```
f(x) = (x-1)/((x-1)(x-2))
- Hebbare Lücke bei x=1
- Polstelle bei x=2
```

#### Level 4: Schiefe Asymptote
```
f(x) = (x²+1)/(x-1)
- Schiefe Asymptote y=x+1
- Polstelle bei x=1
```

#### Level 5: Chaos
```
f(x) = (x²-4)/((x-1)(x+2)(x-3))
- Mehrere Polstellen
- Komplexes Verhalten
```

## Implementierungsreihenfolge

### Phase 1: Grundgerüst (2-3 Stunden)
1. HTML-Struktur erstellen
2. Canvas-Setup und Koordinatensystem
3. Basis-Funktionsplotter
4. Einfache Spielersteuerung

### Phase 2: Mathematik-Engine (3-4 Stunden)
1. Funktionsparser implementieren
2. Polstellenerkennung
3. Asymptotenerkennung
4. Sichere Funktionsauswertung

### Phase 3: Spielmechanik (2-3 Stunden)
1. Kollisionserkennung
2. Sprung-Mechanik
3. Boost-System
4. Scoring

### Phase 4: Visuals & Polish (2-3 Stunden)
1. Cyberpunk-Styling
2. Animationen und Effekte
3. UI-Verbesserungen
4. Sound-Effekte (optional)

### Phase 5: Level & Testing (1-2 Stunden)
1. Level-System implementieren
2. Balancing
3. Bug-Fixes
4. Performance-Optimierung

## Herausforderungen & Lösungen

### Problem: Numerische Stabilität
**Lösung**: Grenzwertberechnung für Polstellen-Nähe, epsilon-Vergleiche

### Problem: Performance bei komplexen Funktionen
**Lösung**: Adaptive Sampling, Caching von Funktionswerten

### Problem: Benutzerfreundlichkeit der Mathematik
**Lösung**: Visuelle Hinweise, Tutorial-Level, Tooltips

### Problem: Responsive Design
**Lösung**: Canvas-Skalierung, Touch-Controls für Mobile

## Erfolgsmetriken
- **Lerneffekt**: Spieler verstehen Polstellen/Asymptoten intuitiv
- **Engagement**: Mindestens 10 Minuten Spielzeit pro Session
- **Schwierigkeit**: Ausgewogene Progression ohne Frustration
- **Performance**: 60 FPS auf modernen Browsern

## Erweiterungsmöglichkeiten
- **Multiplayer**: Rennen gegen andere Spieler
- **Level-Editor**: Eigene Funktionen erstellen
- **Achievements**: Sammle alle Asymptoten-Typen
- **Physik**: Realistische Beschleunigung/Bremsung
- **3D-Modus**: Funktionen von zwei Variablen
