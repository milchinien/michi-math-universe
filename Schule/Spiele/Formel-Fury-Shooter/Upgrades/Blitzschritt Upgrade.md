# Blitzschritt Upgrade

## Beschreibung
Erhöht die Bewegungsgeschwindigkeit des Spielers, wodurch er sich schneller über das Spielfeld bewegen kann. Jeder Kauf dieses Upgrades macht den Spieler agiler und ermöglicht es, Gegnern besser auszuweichen.

## Upgrade-Details

**Titel:** Blitzschritt  
**Symbol:** ⚡ (Blitz - repräsentiert Geschwindigkeit und Bewegung)  
**Preis:** 0 Coins (nur durch Level-Up erhältlich)  
**Stapelbar:** Ja (mehrfach kaufbar)

## Seltenheits-Stufen

### Common (Häufig)
- **Geschwindigkeits-Bonus:** +10% Bewegungsgeschwindigkeit
- **Visuelle Effekte:** Kleine blaue Funken um die Füße beim Laufen
- **Beschreibung:** "Leicht verbesserte Beweglichkeit"

### Rare (Selten) 
- **Geschwindigkeits-Bonus:** +18% Bewegungsgeschwindigkeit
- **Visuelle Effekte:** Mittlere elektrische Partikel mit leichtem Nachzieheffekt
- **Beschreibung:** "Deutlich erhöhte Agilität"

### Epic (Episch)
- **Geschwindigkeits-Bonus:** +28% Bewegungsgeschwindigkeit  
- **Visuelle Effekte:** Starke Blitz-Partikel mit kurzer Leuchtdauer beim Sprint
- **Beschreibung:** "Außergewöhnliche Schnelligkeit"

### Legendary (Legendär)
- **Geschwindigkeits-Bonus:** +40% Bewegungsgeschwindigkeit
- **Visuelle Effekte:** Intensive Blitz-Explosion mit Geschwindigkeitslinien und langanhaltender Leuchteffekt
- **Beschreibung:** "Blitzschnelle Bewegung - wie der Wind!"

## Balancing

### Stapelungs-Mechanik
- Jeder Kauf addiert den Bonus (nicht multiplikativ)
- Beispiel: 2x Common = +20% Speed, 1x Rare + 1x Epic = +46% Speed
- Maximum: 5 Stacks pro Seltenheit (verhindert Übermacht)

### Progression
- **Early Game:** Common/Rare Versionen helfen beim Ausweichen von Gegnern
- **Mid Game:** Epic Versionen ermöglichen bessere Positionierung  
- **Late Game:** Legendary Versionen für maximale Mobilität

### Visuelle Skalierung
Die visuellen Effekte werden basierend auf der Gesamtgeschwindigkeit angepasst:

- **0-25% Bonus:** Kleine blaue Funken
- **26-50% Bonus:** Mittlere Partikel mit Nachzieheffekt
- **51-100% Bonus:** Starke Blitz-Partikel mit Leuchten
- **100%+ Bonus:** Explosive Effekte mit Geschwindigkeitslinien

## Implementierung

### Code-Integration
```javascript
// In player-input.js bei Bewegung
const baseSpeed = this.baseSpeed;
const speedMultiplier = window.game.playerStats?.speedMultiplier || 1.0;
this.currentSpeed = baseSpeed * speedMultiplier;
```

### Upgrade-Effekt
```javascript
// In levelup-system.js
applySpeedUpgrade(speedIncrease) {
    if (!window.game.playerStats) window.game.playerStats = {};
    if (!window.game.playerStats.speedMultiplier) window.game.playerStats.speedMultiplier = 1.0;
    
    window.game.playerStats.speedMultiplier += speedIncrease;
    console.log('⚡ Speed increased:', window.game.playerStats.speedMultiplier);
}
```

### Balance-Überlegungen
- **Nicht zu schnell:** Spiel soll kontrollierbar bleiben
- **Progressiv:** Spürbare aber nicht überwältigende Verbesserung
- **Synergien:** Funktioniert gut mit anderen Upgrades
- **Gameplay-Impact:** Verbessert Ausweichen ohne Combat zu trivialisieren

## Strategische Bedeutung
- **Defensive Spielweise:** Besseres Ausweichen von Projektilen
- **Aggressive Spielweise:** Schnellere Positionierung für Angriffe
- **Exploration:** Effizientere Bewegung über das Spielfeld
- **Combo-Potential:** Synergiert mit Heilungs- und HP-Upgrades

## Visuelle Feedback-Ideen
- **Bewegungsspuren:** Kurze Nachzieheffekte bei hoher Geschwindigkeit
- **Partikel-System:** Elektrische Funken proportional zur Geschwindigkeit
- **Sound-Effekte:** Leises Summen oder Zischen bei Bewegung
- **UI-Indikator:** Geschwindigkeits-Anzeige im Stats-Panel
