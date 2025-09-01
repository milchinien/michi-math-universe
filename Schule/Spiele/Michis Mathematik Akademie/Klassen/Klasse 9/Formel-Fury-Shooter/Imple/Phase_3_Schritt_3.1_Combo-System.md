# Phase 3, Schritt 3.1: Combo-System

## Ziel
Implementierung eines explosiven Combo-Systems für exponentiell steigende Belohnungen und dramatische Bestrafungen.

## Beschreibung
Das Combo-System ist das Herzstück der Spannung im Spiel. Jede richtige Antwort baut die Combo auf, während jeder Fehler alles zerstört. Dies schafft intensive Risk-Reward-Momente und süchtig machende Gameplay-Loops.

## Konkrete Implementierung

### 1. Combo-Tracking-System
- **ComboSystem.js** Klasse für Combo-Management
- Kontinuierlicher Combo-Counter (0 bis theoretisch unendlich)
- Verschiedene Combo-Stufen mit unterschiedlichen Belohnungen
- Combo-Timer: Automatischer Verfall bei Inaktivität
- Perfect-Combo-Tracking: Spezielle Boni für fehlerfreie Serien

### 2. Exponentieller Belohnungs-Algorithmus
- **Schaden-Multiplikator**: 1x → 2x → 4x → 8x → 16x (exponentiell)
- **Punkte-Bonus**: Quadratische Steigerung pro Combo-Level
- **Spezial-Effekte**: Neue visuelle Effekte bei höheren Combos
- **Legendary-Drop-Chance**: Dramatisch erhöhte Upgrade-Wahrscheinlichkeit

### 3. Combo-Break-Bestrafung
- **Totaler Verlust**: Alle Combo-Boni verschwinden sofort
- **Screen-Distortion**: Dramatische visuelle Rückmeldung bei Break
- **Audio-Crash**: Brutaler Sound-Effekt bei Combo-Verlust
- **Momentum-Reset**: Verlust aller aufgebauten Geschwindigkeits-Boni

### 4. Combo-Stufen-System
- **Combo 5-9**: "Warming Up" - Leichte Boni, grüne Effekte
- **Combo 10-19**: "On Fire" - Deutliche Boni, orange Effekte
- **Combo 20-39**: "Unstoppable" - Massive Boni, rote Effekte
- **Combo 40-79**: "Legendary" - Extreme Boni, lila Effekte
- **Combo 80+**: "Godlike" - Maximale Boni, regenbogen Effekte

## Technische Details

### Combo-Berechnung
```javascript
// Combo-Multiplikator-Formel
{
    damageMultiplier: Math.pow(1.5, Math.floor(combo / 5)),
    scoreMultiplier: combo * combo * 10,
    legendaryChance: Math.min(combo * 0.5, 50), // Max 50%
    comboDecayTime: Math.max(5000 - (combo * 50), 1000) // 5s bis 1s
}
```

### Combo-Persistenz
- **Session-Tracking**: Höchste Combo der aktuellen Session
- **All-Time-Record**: Persönlicher Rekord über alle Sessions
- **Streak-History**: Verlauf der letzten 10 Combos
- **Achievement-Integration**: Combo-basierte Erfolge

### Visual-Feedback-Intensität
- **Combo 1-4**: Subtile Effekte, normale UI
- **Combo 5-9**: Leuchtende UI-Elemente, erste Partikel
- **Combo 10-19**: Screen-Shake bei Treffern, intensivere Partikel
- **Combo 20+**: Bildschirmweite Effekte, Aura um Spieler
- **Combo 40+**: Komplette Screen-Transformation

## Gameplay-Mechaniken

### Risk-Reward-Balance
- **High-Risk-Formeln**: Schwierigere Formeln für Combo-Erhaltung
- **Safe-Play-Option**: Einfachere Formeln mit geringerem Combo-Aufbau
- **All-or-Nothing**: Spezielle Herausforderungen für massive Combo-Sprünge
- **Combo-Insurance**: Seltene Power-ups schützen vor Combo-Break

### Strategische Entscheidungen
- **Combo-Preservation**: Vorsichtiges Spiel zum Combo-Erhalt
- **Aggressive-Building**: Riskantes Spiel für schnellen Combo-Aufbau
- **Optimal-Stopping**: Wann Combo "cashing" vs. weitermachen
- **Recovery-Strategy**: Comeback nach Combo-Break

### Psychologische Aspekte
- **Loss-Aversion**: Angst vor Combo-Verlust motiviert Vorsicht
- **Escalation**: Steigende Spannung mit höheren Combos
- **Flow-State**: Optimaler Zustand bei mittleren Combo-Levels
- **Addiction-Loop**: "Just one more combo" Mentalität

## Visuelle Combo-Effekte

### UI-Transformation
- **Combo-Counter**: Exponentiell wachsende Zahlen-Anzeige
- **Screen-Border**: Leuchtende Ränder bei hohen Combos
- **Color-Shift**: Gesamte UI ändert Farbe mit Combo-Level
- **Pulsing-Elements**: UI pulsiert im Rhythmus der Combo

### Partikel-Eskalation
- **Combo-Explosions**: Größere Explosionen bei höheren Combos
- **Symbol-Rain**: Mathematische Symbole regnen vom Himmel
- **Energy-Waves**: Energiewellen durchlaufen den Bildschirm
- **Combo-Aura**: Spieler wird von leuchtender Aura umgeben

### Screen-Effects
- **Combo-Shake**: Intensiverer Screen-Shake mit steigender Combo
- **Chromatic-Shift**: Farbverschiebungen bei hohen Combos
- **Zoom-Pulses**: Rhythmische Zoom-Effekte
- **Reality-Distortion**: Bildschirm "bricht" bei extremen Combos

## Audio-Design

### Combo-Audio-Progression
- **Combo 1-4**: Normale Erfolgs-Sounds
- **Combo 5-9**: Harmonische Akkorde
- **Combo 10-19**: Orchestrale Steigerung
- **Combo 20+**: Epische Musik-Transformation
- **Combo-Break**: Dramatischer Crash mit Stille

### Dynamic-Music-System
- **Adaptive-Tempo**: Musik wird schneller mit höheren Combos
- **Layer-Addition**: Neue Instrumente bei Combo-Steigerung
- **Tension-Building**: Steigende Spannung in der Musik
- **Climax-Moments**: Musikalische Höhepunkte bei Meilensteinen

## Testkriterien
- Combo baut sich korrekt auf und bricht bei Fehlern
- Multiplikatoren funktionieren exponentiell
- Visuelle Effekte eskalieren angemessen
- Audio-Feedback verstärkt Combo-Gefühl
- System motiviert zu riskantem aber belohnendem Gameplay

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 3, Schritt 3.2: Dynamic Events**
