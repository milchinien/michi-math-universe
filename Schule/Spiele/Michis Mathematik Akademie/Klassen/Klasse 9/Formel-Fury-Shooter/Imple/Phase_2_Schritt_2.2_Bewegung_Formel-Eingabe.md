# Phase 2, Schritt 2.2: Bewegung + Formel-Eingabe

## Ziel
Implementierung simultaner Bewegung und Formel-Eingabe für dynamisches, aktives Gameplay ohne Stillstand.

## Beschreibung
Revolutionäres System, das es Spielern ermöglicht, sich während der Formel-Eingabe zu bewegen. Dies eliminiert passive Phasen und macht das Gameplay konstant aktiv und spannend.

## Konkrete Implementierung

### 1. Mobile Eingabefelder
- **FloatingInputSystem.js** für bewegliche UI-Elemente
- Eingabefeld folgt Spieler-Position mit Offset
- Smooth-Following mit Interpolation für flüssige Bewegung
- Collision-Avoidance: Eingabefeld weicht Hindernissen aus
- Adaptive Positionierung basierend auf Arena-Layout

### 2. Dual-Input-Handling
- **Simultane Eingabe**: Bewegung (WASD) + Formel-Eingabe gleichzeitig
- **Input-Priorität**: Bewegung hat Vorrang bei Konflikten
- **Context-Switching**: Nahtloser Wechsel zwischen Bewegung und Eingabe
- **Gesture-Support**: Bewegungsgesten während Eingabe

### 3. Dynamische Formel-Anzeige
- **Adaptive UI-Größe**: Eingabefeld passt sich Bewegungsgeschwindigkeit an
- **Visibility-Management**: Transparenz bei schneller Bewegung
- **Anchor-Points**: Eingabefeld "klebt" an optimalen Bildschirmpositionen
- **Multi-Target-Display**: Mehrere Formeln gleichzeitig sichtbar

### 4. Bewegungsgeschwindigkeit-Integration
- **Speed-Penalty**: Langsamere Bewegung während Eingabe
- **Accuracy-Bonus**: Präzisere Eingabe bei langsamerer Bewegung
- **Rush-Mode**: Schnelle Bewegung = weniger Zeit für Formel
- **Flow-State**: Optimale Geschwindigkeit für beste Performance

## Technische Details

### Input-System-Architektur
```javascript
// Dual-Input-Manager
{
    movementInput: {
        keys: ['w','a','s','d'],
        priority: 'high',
        continuous: true
    },
    formulaInput: {
        target: 'floating-field',
        priority: 'medium',
        contextual: true
    }
}
```

### UI-Positioning-Algorithmus
- **Player-Relative**: Eingabefeld relativ zur Spieler-Position
- **Screen-Boundary**: Eingabefeld bleibt im sichtbaren Bereich
- **Obstacle-Avoidance**: Ausweichen vor Arena-Elementen
- **Readability-Optimization**: Optimale Position für Lesbarkeit

### Performance-Optimierungen
- **UI-Culling**: Unsichtbare UI-Elemente werden nicht gerendert
- **Interpolation-Caching**: Vorberechnete Bewegungspfade
- **Input-Debouncing**: Vermeidung von Input-Spam
- **Render-Batching**: Effizientes UI-Rendering

## Gameplay-Mechaniken

### Bewegungs-Eingabe-Synergien
- **Typing-While-Moving**: Kontinuierliche Bewegung während Eingabe
- **Evasive-Typing**: Ausweichen während Formel-Lösung
- **Pursuit-Solving**: Verfolgen von Gegnern während Eingabe
- **Multi-Tasking-Combos**: Bonus für simultane Aktionen

### Schwierigkeits-Skalierung
- **Beginner**: Bewegung pausiert automatisch bei Eingabe
- **Intermediate**: Reduzierte Bewegungsgeschwindigkeit
- **Advanced**: Vollständige simultane Kontrolle
- **Expert**: Bewegung erforderlich für Formel-Lösung

### Strategische Elemente
- **Positioning-Tactics**: Optimale Position für Formel-Eingabe
- **Escape-Solving**: Lösen während Flucht
- **Aggressive-Solving**: Lösen während Verfolgung
- **Defensive-Solving**: Lösen während Ausweichen

## Visuelle Integration

### UI-Animation
- **Smooth-Following**: Flüssige Eingabefeld-Bewegung
- **Elastic-Positioning**: Federnde UI-Bewegungen
- **Fade-Transitions**: Sanfte Transparenz-Übergänge
- **Scale-Adaptation**: Größenänderung basierend auf Kontext

### Visual-Feedback
- **Movement-Trails**: Spur zwischen Spieler und Eingabefeld
- **Connection-Lines**: Visuelle Verbindung zu Ziel-Gegnern
- **Speed-Indicators**: Geschwindigkeits-Visualisierung
- **Accuracy-Feedback**: Visuelle Rückmeldung für Eingabe-Qualität

## Audio-Design
- **Typing-Rhythm**: Tastendruck-Sounds synchron zur Bewegung
- **Movement-Audio**: Schritte während Eingabe
- **Dual-Action-Feedback**: Spezielle Sounds für simultane Aktionen
- **Flow-Audio**: Harmonische Klänge bei optimaler Performance

## Testkriterien
- Flüssige Bewegung während Formel-Eingabe
- Eingabefeld folgt Spieler ohne Verzögerung
- Keine Input-Konflikte zwischen Bewegung und Eingabe
- UI bleibt lesbar bei allen Bewegungsgeschwindigkeiten
- Performance bleibt stabil bei komplexen Bewegungsmustern

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 2, Schritt 2.3: Momentum-System**
