# Phase 2.2: Kampf-System und Targeting

## Ziel
Verbinde das Formel-System mit dem Enemy-System für funktionierende Kämpfe.

## Implementierung

- [x] Enemy-Targeting-System implementieren (Mausklick oder Nähe)
- [x] Formel-Anzeige mit dem targeted Enemy verknüpfen
- [x] Kampf-Interface aktivieren wenn Enemy targeted
- [x] Korrekte Antwort → Enemy stirbt mit Animation
- [x] Falsche Antwort → Spieler nimmt Schaden
- [x] Basis-Health-System für Spieler
- [x] Game Over State bei Spieler-Tod

## Erwartetes Ergebnis
Vollständige Kampf-Mechanik: Gegner anvisieren, Formel lösen, Gegner besiegen oder Schaden nehmen.

## Technische Details
- Targeting-System mit Maus/Keyboard-Input
- Enemy-Player Damage-System
- Death-Animationen
- State-Management für Kampf

## Builds auf
- Phase 2.1 (Basis-Enemy-System)

## ✅ Implementiert (Vollständig)

### Features umgesetzt:
- **Mouse-Targeting-System**: Klicke auf Gegner um sie anzuvisieren und zu bekämpfen
- **Visual Target-Indicators**: Gelbe Crosshairs und "KLICKEN ZUM ANGRIFF" Text bei verfügbaren Zielen
- **Combat-Mode Integration**: Formula-System wird automatisch mit Enemy-Formeln verknüpft
- **Enhanced Combat Interface**: Roter Banner zeigt aktuelle Formel und Kampfmodus an
- **Target-Line Visualization**: Gestrichelte Linie vom Spieler zum anvisierten Gegner
- **Correct Answer → Enemy Death**: Richtige Antwort tötet Gegner sofort mit +150 Punkten
- **Wrong Answer → Player Damage**: Falsche Antwort verursacht 20 Schaden beim Spieler
- **Damage Immunity System**: 1 Sekunde Immunität nach Schaden verhindert Spam-Damage
- **Complete Game Over System**: Vollbildschirm Game-Over mit automatischem Restart nach 3s
- **Combat State Management**: Saubere Trennung zwischen Exploration und Combat-Modi

### Mouse & Targeting:
- **Precision Click-Detection**: 10px Toleranz für einfaches Anklicken von Gegnern
- **Proximity Indicators**: Gelbe Crosshairs erscheinen bei Gegnern in 80px Nähe
- **Visual Feedback**: Deutliche Unterscheidung zwischen verfügbaren und anvisierten Zielen
- **Click-to-Combat**: Ein Klick startet sofort den Kampfmodus mit der Enemy-Formel

### Combat Mechanics:
- **Formula Linking**: Enemy-Formeln werden direkt ins Combat-Interface übernommen
- **Damage Scaling**: Combat-Fehler verursachen mehr Schaden (20 HP) als Kollisionen (10 HP)
- **Bonus Scoring**: Combat-Kills geben 150 Punkte statt 100 für normales Üben
- **Skip Penalty**: Formeln überspringen im Kampf kostet 15 HP
- **Combat Lock**: Keine Kollisionsschäden während aktiver Kämpfe

### Health & Game State:
- **Player Health Management**: 100 HP mit visueller Gesundheitsleiste
- **Damage Immunity**: Verhindert unfaire Mehrfachschäden durch Timing
- **Game Over Screen**: Dramatic rot-schwarzes Design mit Endpunktzahl
- **Auto-Restart**: 3-Sekunden-Timer für nahtlosen Neustart
- **State Reset**: Kompletter Reset von Gesundheit, Position und Gegnern

### Visual Enhancements:
- **Combat Mode Banner**: Roter Vollbild-Banner zeigt aktuelle Kampf-Formel
- **Targeting Crosshairs**: Professionelle gelbe Fadenkreuze mit Animation
- **Target Lines**: Gestrichelte Verbindungslinien im Kampfmodus
- **Game Over Effects**: Dramatische Schatten und Glow-Effekte
- **Status Indicators**: Live-Updates aller relevanten Informationen

### Integration & Flow:
- **Seamless Combat Transition**: Klick → Targeting → Formula-UI → Kampf → Resolution
- **Non-Blocking Exploration**: Spieler kann weiterhin frei bewegen während Targeting
- **Clean State Management**: Automatic cleanup beim Beenden von Combat-Modi
- **Performance Optimized**: Effiziente Event-Handling und Rendering-Pipeline

Das vollständige Combat-System verwandelt das Spiel in einen echten Action-Puzzle-Shooter! Spieler müssen jetzt strategisch entscheiden: Welche Gegner angreifen? Wann kämpfen vs. fliehen? Das Risk/Reward-System mit Combat-Bonuspunkten motiviert zu aktiven Kämpfen, während das Schadenssystem für Spannung sorgt.