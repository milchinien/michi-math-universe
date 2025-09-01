# Phase 3, Schritt 3.2: Dynamic Events

## Ziel
Implementierung unvorhersagbarer, dynamischer Events für konstante Spannung und Überraschungsmomente.

## Beschreibung
Dynamic Events durchbrechen vorhersagbare Gameplay-Patterns und sorgen für ständige Aufmerksamkeit. Diese zufälligen Ereignisse können das Spiel dramatisch verändern und erfordern sofortige Anpassung der Strategie.

## Konkrete Implementierung

### 1. Event-System-Framework
- **DynamicEventSystem.js** für Event-Management
- Gewichtetes Zufallssystem für Event-Auswahl
- Event-Cooldowns zur Vermeidung von Spam
- Kontext-sensitive Events basierend auf Spielsituation
- Event-Ketten: Ein Event kann weitere Events auslösen

### 2. Formel-Roulette-Events
- **Formula-Shuffle**: Alle aktiven Formeln ändern sich spontan
- **Type-Roulette**: Formel-Typen wechseln zufällig (Binomial ↔ Faktorisierung)
- **Difficulty-Spike**: Plötzlich deutlich schwierigere Formeln
- **Speed-Formulas**: Extrem einfache Formeln für schnelle Combo-Aufbau

### 3. Math-Storm-Events
- **Symbol-Rain**: Mathematische Symbole fallen vom Himmel
- **Equation-Flood**: Bildschirmweite Formel-Herausforderungen
- **Calculation-Chaos**: Mehrere Formeln müssen gleichzeitig gelöst werden
- **Perfect-Storm**: Kombination mehrerer Math-Events

### 4. Gegner-Mutation-Events
- **Mid-Fight-Change**: Gegner ändern ihre Formeln während des Kampfes
- **Evolution-Burst**: Gegner entwickeln sich zu stärkeren Varianten
- **Fusion-Event**: Mehrere Gegner verschmelzen zu Super-Gegnern
- **Berserker-Mode**: Gegner werden aggressiver aber verletzlicher

## Technische Details

### Event-Wahrscheinlichkeiten
```javascript
// Event-Gewichtung basierend auf Spielsituation
{
    lowCombo: {
        formulaRoulette: 30,
        mathStorm: 20,
        enemyMutation: 25,
        positiveEvent: 25
    },
    highCombo: {
        formulaRoulette: 40,
        mathStorm: 35,
        enemyMutation: 20,
        positiveEvent: 5  // Weniger Hilfe bei hohen Combos
    }
}
```

### Event-Trigger-Bedingungen
- **Zeit-basiert**: Events alle 30-60 Sekunden
- **Combo-basiert**: Spezielle Events bei bestimmten Combo-Levels
- **Leistungs-basiert**: Events reagieren auf Spieler-Performance
- **Zufalls-basiert**: Komplett unvorhersagbare Events

### Event-Dauer und Intensität
- **Micro-Events**: 3-5 Sekunden, subtile Änderungen
- **Standard-Events**: 10-15 Sekunden, deutliche Auswirkungen
- **Mega-Events**: 20-30 Sekunden, dramatische Transformationen
- **Permanent-Events**: Dauerhafte Änderungen für den Rest der Welle

## Spezifische Event-Typen

### Positive Events (Selten)
- **Formula-Hint-Rain**: Lösungshinweise fallen vom Himmel
- **Time-Dilation**: Alle Formeln bekommen mehr Zeit
- **Combo-Protection**: Nächster Fehler bricht Combo nicht
- **Double-Damage**: Temporär doppelter Schaden

### Neutrale Events (Häufig)
- **Arena-Rotation**: Spielfeld dreht sich langsam
- **Gravity-Shift**: Veränderte Bewegungsphysik
- **Visual-Distortion**: Bildschirm-Effekte ohne Gameplay-Impact
- **Color-Inversion**: Farbschema ändert sich komplett

### Negative Events (Häufig)
- **Formula-Corruption**: Formeln werden teilweise unleserlich
- **Input-Lag**: Künstliche Verzögerung bei Eingaben
- **Screen-Shake-Storm**: Extremer Screen-Shake
- **Darkness-Event**: Bildschirm wird teilweise dunkel

### Chaos Events (Sehr selten)
- **Reality-Break**: Alle Spielregeln ändern sich temporär
- **Multi-Dimension**: Mehrere Spielfelder gleichzeitig
- **Time-Paradox**: Vergangene Aktionen wiederholen sich
- **Math-Apocalypse**: Extreme Kombination aller Events

## Visuelle Event-Effekte

### Event-Ankündigungen
- **Warning-Flashes**: Kurze Vorwarnung vor Events
- **Event-Titles**: Dramatische Titel-Einblendungen
- **Countdown-Timers**: Sichtbare Timer für Event-Dauer
- **Intensity-Indicators**: Visuelle Stärke-Anzeige

### Transformation-Effekte
- **Reality-Ripples**: Welleneffekte bei Arena-Änderungen
- **Particle-Storms**: Intensive Partikel bei chaotischen Events
- **Color-Shifts**: Dramatische Farbänderungen
- **Distortion-Fields**: Verzerrungseffekte um Event-Zentren

## Audio-Integration

### Event-Audio-Design
- **Warning-Sounds**: Charakteristische Warntöne vor Events
- **Transformation-Audio**: Dramatische Sounds bei Änderungen
- **Ambient-Shifts**: Hintergrund-Audio passt sich Events an
- **Chaos-Soundscape**: Verzerrte Audio bei extremen Events

### Dynamic-Music-Response
- **Tempo-Changes**: Musik reagiert auf Event-Intensität
- **Instrument-Swaps**: Verschiedene Instrumente für Event-Typen
- **Harmony-Disruption**: Dissonanz bei negativen Events
- **Silence-Moments**: Strategische Stille vor großen Events

## Strategische Auswirkungen

### Anpassungsstrategien
- **Event-Recognition**: Schnelle Erkennung von Event-Typen
- **Adaptive-Gameplay**: Strategie-Anpassung an Events
- **Risk-Assessment**: Bewertung von Event-Risiken
- **Opportunity-Exploitation**: Nutzen positiver Events

### Skill-Development
- **Flexibility-Training**: Anpassung an unvorhersagbare Situationen
- **Stress-Management**: Umgang mit chaotischen Momenten
- **Pattern-Recognition**: Erkennung von Event-Mustern
- **Quick-Decision-Making**: Schnelle Entscheidungen unter Druck

## Testkriterien
- Events triggern in angemessenen Intervallen
- Visuelle und Audio-Effekte sind beeindruckend
- Events beeinflussen Gameplay spürbar aber fair
- Spieler können sich an Events anpassen
- Events erhöhen Spannung ohne zu frustrieren

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 3, Schritt 3.3: Chain-Targeting**
