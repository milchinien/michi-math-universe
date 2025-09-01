# Phase 5, Schritt 5.1: Punishment-System

## Ziel
Implementierung eines brutalen Bestrafungssystems für Fehler, das das Spiel zu einer intensiven, unforgiving Erfahrung macht.

## Beschreibung
Das Punishment-System macht jeden Fehler schmerzhaft spürbar und erhöht dramatisch die Konsequenzen falscher Entscheidungen. Dies schafft eine Atmosphäre extremer Spannung, wo jede Formel-Eingabe über Leben und Tod entscheidet.

## Konkrete Implementierung

### 1. Permanenter Schaden-System
- **PermanentDamageSystem.js** für irreversible Schadens-Mechaniken
- Falsche Antworten verursachen permanenten HP-Verlust
- Keine Heilung für Punishment-Schaden während der Welle
- Schaden-Akkumulation: Wiederholte Fehler verstärken sich exponentiell
- Scar-System: Visuelle Narben auf UI bei permanentem Schaden

### 2. Fähigkeits-Degradation
- **SkillDegradationSystem.js** für Fähigkeits-Verschlechterung
- Wiederholte Fehler verschlechtern Spieler-Fähigkeiten temporär
- Reduced-Accuracy: Eingabe wird ungenauer
- Slower-Reflexes: Reaktionszeit wird künstlich verlangsamt
- Blurred-Vision: Formeln werden unschärfer dargestellt
- Memory-Loss: Bereits gelöste Formel-Typen werden "vergessen"

### 3. Stress-Akkumulations-System
- **StressSystem.js** für psychologischen Druck
- Stress baut sich bei Fehlern auf und beeinflusst Performance negativ
- High-Stress-Penalties: Reduzierte Zeit, zittrige Eingabe, Panik-Effekte
- Stress-Induced-Errors: System fügt künstliche Tippfehler ein
- Breakdown-Threshold: Bei maximalem Stress temporäre Spielunfähigkeit

### 4. Permadeath-Elemente
- **PermadeathSystem.js** für dauerhafte Verluste
- Bestimmte wertvolle Upgrades gehen bei kritischen Fehlern verloren
- Legendary-Item-Loss: Seltene Items können permanent verschwinden
- Skill-Point-Drain: Erfahrungspunkte werden bei Fehlern abgezogen
- Progress-Rollback: Schwere Fehler setzen Fortschritt zurück

## Technische Details

### Punishment-Eskalation
```javascript
// Bestrafungs-Algorithmus
{
    errorCount: 0,
    permanentDamage: errorCount * 5,        // 5 HP pro Fehler
    stressLevel: Math.min(errorCount * 10, 100),
    degradationFactor: 1 - (errorCount * 0.05),  // 5% schlechter pro Fehler
    permadeathRisk: errorCount > 10 ? 0.02 : 0    // 2% Risiko nach 10 Fehlern
}
```

### Punishment-Kategorien
- **Minor-Punishment**: 1-3 Fehler - Leichte Strafen
- **Major-Punishment**: 4-7 Fehler - Deutliche Konsequenzen
- **Severe-Punishment**: 8-12 Fehler - Schwere Bestrafung
- **Catastrophic-Punishment**: 13+ Fehler - Existenzbedrohende Strafen

### Recovery-Mechanismen (Begrenzt)
- **Perfect-Streaks**: Fehlerfreie Serien reduzieren Strafen langsam
- **Redemption-Challenges**: Spezielle schwere Aufgaben für Vergebung
- **Sacrifice-Options**: Opfern wertvoller Items für Straf-Reduktion
- **Time-Healing**: Sehr langsame natürliche Erholung zwischen Sessions

## Spezifische Bestrafungs-Typen

### Sofortige Bestrafungen
- **Health-Drain**: Sofortiger, permanenter HP-Verlust
- **Combo-Obliteration**: Komplette Combo-Zerstörung + Malus
- **Screen-Punishment**: Bildschirm wird temporär unleserlich
- **Control-Chaos**: Steuerung wird temporär invertiert oder verzögert

### Aufbauende Bestrafungen
- **Cumulative-Damage**: Jeder weitere Fehler schmerzt mehr
- **Snowball-Effect**: Fehler machen weitere Fehler wahrscheinlicher
- **Spiral-Descent**: Negative Feedback-Loops verstärken sich
- **Doom-Clock**: Countdown zu katastrophalen Konsequenzen

### Psychologische Bestrafungen
- **Shame-Display**: Öffentliche Anzeige der Fehler-Anzahl
- **Mockery-System**: Spiel "verspottet" schlechte Performance
- **Disappointment-Audio**: Enttäuschte Seufzer und Kommentare
- **Failure-Memories**: Vergangene Fehler werden wieder gezeigt

## Visuelle Punishment-Effekte

### Schaden-Visualisierung
- **Blood-Effects**: Blut-Spritzer bei permanentem Schaden
- **Crack-Propagation**: Risse breiten sich über UI aus
- **Decay-Animation**: UI-Elemente verfallen und rosten
- **Scar-Formation**: Permanente visuelle Narben entstehen

### Stress-Visualisierung
- **Panic-Distortion**: Bildschirm zittert und verzerrt sich
- **Tunnel-Vision**: Sichtfeld verengt sich bei Stress
- **Color-Desaturation**: Welt wird grauer bei hohem Stress
- **Hallucination-Effects**: Falsche visuelle Informationen

### Degradation-Effekte
- **Blur-Increase**: Formeln werden zunehmend unscharf
- **Lag-Visualization**: Sichtbare Verzögerung bei Eingaben
- **Glitch-Effects**: UI beginnt zu "glitchen" und zu versagen
- **Corruption-Spread**: Digitale Korruption breitet sich aus

## Audio-Punishment-Design

### Schmerz-Audio
- **Pain-Sounds**: Realistische Schmerz-Geräusche bei Fehlern
- **Heartbreak-Audio**: Herzzerreißende Sounds bei großen Verlusten
- **Despair-Music**: Verzweifelte, deprimierende Hintergrund-Musik
- **Silence-Punishment**: Komplette Stille als psychologische Strafe

### Degradation-Audio
- **Static-Increase**: Zunehmende Audio-Verzerrung
- **Frequency-Loss**: Audio verliert Frequenzbereiche
- **Echo-Distortion**: Verzerrte Echos bei Stress
- **Audio-Corruption**: Digitale Audio-Artefakte

## Balancing-Mechanismen

### Fairness-Grenzen
- **Maximum-Punishment**: Obergrenze für Bestrafungs-Intensität
- **Recovery-Windows**: Gelegenheiten zur Rehabilitation
- **Skill-Consideration**: Bestrafung angepasst an Spieler-Level
- **Accessibility-Modes**: Reduzierte Bestrafung für Lern-Modi

### Motivation-Erhaltung
- **Hope-Mechanics**: Kleine Hoffnungsschimmer in dunklen Momenten
- **Comeback-Opportunities**: Möglichkeiten für dramatische Wendungen
- **Achievement-Recognition**: Anerkennung trotz Bestrafung
- **Learning-Support**: Bestrafung als Lern-Werkzeug, nicht nur Strafe

## Testkriterien
- Bestrafungen fühlen sich fair aber brutal an
- System motiviert zu perfektem Spiel ohne zu frustrieren
- Visuelle und Audio-Effekte verstärken Bestrafungs-Gefühl
- Recovery-Mechanismen bieten realistische Hoffnung
- Balancing verhindert unfaire Todesspiralen

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 5, Schritt 5.2: Adaptive Difficulty**
