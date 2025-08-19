# Phase 2.3: Score-System und Combo-Mechanik

## Ziel
Implementiere Scoring, Combos und grundlegende Progression.

## Implementierung

- [x] Score-System für besiegte Gegner
- [x] Combo-Counter für aufeinanderfolgende richtige Antworten
- [x] Combo-Multiplikator für höhere Scores
- [x] Combo-Break bei falschen Antworten oder zu langem Warten
- [x] Anzeige von Score und Combo im HUD
- [x] Verschiedene Punkte für verschiedene Formel-Schwierigkeiten
- [x] High-Score-Tracking im LocalStorage

## Erwartetes Ergebnis
Funktionierendes Scoring-System mit Combos, das Spieler motiviert schnell und korrekt zu antworten.

## Technische Details
- Score-Berechnungslogik
- Combo-Timer-System
- LocalStorage für Persistierung
- UI-Updates für Score-Anzeige

## Builds auf
- Phase 2.2 (Kampf-System)

## ✅ Implementiert (Vollständig)

### Features umgesetzt:
- **Erweiterte Score-Berechnung**: Dynamisches Scoring basierend auf Schwierigkeit, Geschwindigkeit, Combo und Combat-Typ
- **Combo-System**: Aufeinanderfolgende richtige Antworten bauen Combos mit exponentiellen Bonusmultiplikatoren auf
- **Difficulty-based Scoring**: Formeln mit größeren Koeffizienten und komplexeren Zahlen geben mehr Punkte
- **Speed-Bonus**: Antworten unter 5 Sekunden erhalten Geschwindigkeitsboni
- **Combat-Bonus**: Zusätzliche 50 Punkte für Enemy-Kills im Combat-Modus
- **Combo-Timer**: 10-Sekunden-Limit pro Combo mit visueller Countdown-Anzeige
- **Auto-Combo-Break**: Combos brechen bei falschen Antworten oder Zeitüberschreitung
- **High-Score-Persistierung**: LocalStorage speichert persönliche Bestleistungen permanent
- **Live-HUD-Updates**: Echtzeit-Anzeige von Score, Combo, Timer und High-Score

### Scoring-Mechanik:
- **Base Score**: 100 Punkte pro korrekte Antwort
- **Difficulty Multiplier**: 1.0x bis 3.0x basierend auf Formel-Komplexität
- **Combo Multiplier**: +20% pro Combo-Level ab Combo 3 (z.B. Combo 5 = +40%)
- **Speed Bonus**: Bis zu 50 zusätzliche Punkte für schnelle Antworten
- **Combat Bonus**: Extra 50 Punkte für Enemy-Eliminierungen
- **Beispiel**: Schwere Formel (3x) + Combo 7 (+80%) + Speed Bonus (25) + Combat (50) = 100 × 3 × 1.8 + 25 + 50 = 615 Punkte!

### Combo-System:
- **Combo-Aufbau**: Jede richtige Antwort erhöht die Combo um 1
- **Combo-Anzeige**: Ab Combo 3 beginnt der orange Glow-Effekt mit Animation
- **Timer-System**: 10 Sekunden pro Combo-Level, Timer wird rot bei ≤3 Sekunden
- **Break-Conditions**: Falsche Antworten, Zeitüberschreitung oder Skip brechen die Combo
- **Motivational Feedback**: Spezielle Nachrichten bei Combo-Meilensteinen (3, 5, 7, 10, 15, 20)
- **Max-Combo-Tracking**: Persönlicher Rekord wird dauerhaft gespeichert

### Difficulty-Assessment:
- **Coefficient Analysis**: Große Zahlen (a≥4, b≥4) erhöhen Schwierigkeit
- **Result Complexity**: x²-Koeffizienten ≥16, x-Koeffizienten ≥20 = schwerer
- **Multi-Factor**: Kombinationen komplexer Koeffizienten = maximale Schwierigkeit
- **Scaling**: Schwierigkeit 1.0-3.0 beeinflusst direkt die Punkte-Multiplikation

### Visual Enhancements:
- **Combo Display**: Rechte Seite mit Combo-Counter, Max-Combo und Live-Timer
- **Combo Animation**: Orange Glow-Pulsing ab Combo 3 für visuelles Feedback
- **High-Score Banner**: Zentrierte Anzeige der persönlichen Bestleistung
- **Timer Warning**: Rot-blinkender Timer bei kritischer Zeit
- **Enhanced Feedback**: Detaillierte Score-Breakdowns in Success-Messages

### Performance & Persistence:
- **LocalStorage Integration**: High-Scores überleben Browser-Neustarts
- **Real-time Updates**: Alle HUD-Elemente aktualisieren sich live während des Spiels
- **Combo Timer Optimization**: Effiziente Timer-Updates ohne Performance-Verlust
- **Memory Management**: Saubere Event-Handling und State-Management

### Game Balance:
- **Risk/Reward**: Höhere Combos = mehr Punkte, aber größeres Verlustrisiko
- **Speed vs. Accuracy**: Spieler müssen zwischen Geschwindigkeit und Genauigkeit abwägen
- **Combat Incentive**: Combat-Bonus motiviert zu aktivem Enemy-Engagement
- **Progressive Difficulty**: Natürliche Schwierigkeitssteigerung durch Formel-Komplexität

Das Combo-System verwandelt das Spiel in einen hochmotivierenden Score-Attack-Modus! Spieler werden süchtig nach dem "Einen weiteren Combo"-Feeling und entwickeln dabei automatisch Geschwindigkeit und Genauigkeit in binomischen Formeln.
