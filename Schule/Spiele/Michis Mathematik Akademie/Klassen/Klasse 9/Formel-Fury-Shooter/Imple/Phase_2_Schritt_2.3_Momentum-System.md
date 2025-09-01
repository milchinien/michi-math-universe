# Phase 2, Schritt 2.3: Momentum-System

## Ziel
Implementierung eines Momentum-basierten Systems, das Bewegungsgeschwindigkeit mit Spielmechaniken verknüpft.

## Beschreibung
Das Momentum-System belohnt aktive Bewegung und bestraft Stillstand. Geschwindigkeit wird zu einem strategischen Element, das Schaden, Formel-Zeit und andere Gameplay-Aspekte beeinflusst.

## Konkrete Implementierung

### 1. Momentum-Tracking
- **MomentumSystem.js** Klasse für Geschwindigkeits-Tracking
- Kontinuierliche Messung der Spieler-Geschwindigkeit
- Momentum-Aufbau über Zeit bei konstanter Bewegung
- Momentum-Verlust bei Stillstand oder Richtungsänderungen
- Verschiedene Momentum-Stufen (Stationary, Walking, Running, Sprinting)

### 2. Geschwindigkeits-Schaden-Multiplikator
- **Speed-Damage-Bonus**: Höhere Geschwindigkeit = mehr Schaden
- **Momentum-Multiplier**: 1.0x (stillstehend) bis 2.5x (maximales Momentum)
- **Critical-Speed-Threshold**: Spezielle Boni bei sehr hoher Geschwindigkeit
- **Stillstand-Penalty**: Reduzierter Schaden bei langsamem/stillstehendem Spiel

### 3. Formel-Zeit-Modifikation
- **Speed-Time-Pressure**: Schnellere Bewegung = weniger Zeit für Formeln
- **Stillstand-Bonus**: Mehr Zeit bei langsamerer Bewegung
- **Optimal-Speed-Zone**: Perfekte Geschwindigkeit für beste Balance
- **Rush-Mode**: Extrem schnelle Bewegung = Blitz-Formel-Modus

### 4. Momentum-Visuals
- **Speed-Lines**: Geschwindigkeitslinien bei hohem Momentum
- **Aura-Effects**: Leuchtende Aura um schnell bewegende Spieler
- **Trail-Intensity**: Intensivere Trails bei höherem Momentum
- **Screen-Blur**: Motion-Blur-Effekte bei maximaler Geschwindigkeit

## Technische Details

### Momentum-Berechnung
```javascript
// Momentum-Algorithmus
{
    currentSpeed: 0,         // Aktuelle Geschwindigkeit
    momentum: 0,             // Aufgebautes Momentum (0-100)
    buildRate: 2.5,          // Momentum-Aufbau pro Frame
    decayRate: 5.0,          // Momentum-Verlust bei Stillstand
    maxMomentum: 100,        // Maximales Momentum
    speedThresholds: {       // Geschwindigkeits-Schwellen
        walking: 50,
        running: 100,
        sprinting: 150
    }
}
```

### Damage-Multiplier-Kurve
- **0-25% Momentum**: 1.0x Schaden (Basis)
- **25-50% Momentum**: 1.2x Schaden (Leichter Bonus)
- **50-75% Momentum**: 1.5x Schaden (Deutlicher Bonus)
- **75-100% Momentum**: 2.0x Schaden (Maximaler Bonus)
- **100% + Perfect Movement**: 2.5x Schaden (Perfektions-Bonus)

### Integration mit bestehenden Systemen
- **Player-Movement**: Geschwindigkeits-Tracking
- **Combat-System**: Schaden-Multiplikation
- **Formula-System**: Zeit-Modifikation
- **Visual-Effects**: Momentum-basierte Effekte

## Gameplay-Mechaniken

### Strategische Bewegung
- **Aggressive-Movement**: Konstante Bewegung für maximalen Schaden
- **Tactical-Positioning**: Balance zwischen Geschwindigkeit und Präzision
- **Hit-and-Run**: Schnelle Angriffe mit hohem Momentum
- **Defensive-Stillstand**: Opfern von Schaden für präzise Formel-Eingabe

### Momentum-Combos
- **Speed-Streaks**: Bonus für konstante hohe Geschwindigkeit
- **Direction-Changes**: Malus für häufige Richtungswechsel
- **Perfect-Flow**: Bonus für optimale Bewegungsmuster
- **Momentum-Breaks**: Dramatische Strafen für plötzlichen Stillstand

### Risk-Reward-Balance
- **High-Speed-Risk**: Weniger Zeit für Formeln bei hoher Geschwindigkeit
- **Movement-Reward**: Deutlich höherer Schaden bei aktiver Bewegung
- **Precision-Trade-off**: Schwierigere Zielverfolgung bei hohem Tempo
- **Stamina-Management**: Momentum-Aufbau kostet Energie

## Visuelle Momentum-Indikatoren

### UI-Elemente
- **Momentum-Bar**: Visueller Indikator für aktuelles Momentum
- **Speed-Meter**: Geschwindigkeits-Anzeige mit Farbkodierung
- **Multiplier-Display**: Aktueller Schaden-Multiplikator
- **Optimal-Zone-Indicator**: Markierung der optimalen Geschwindigkeit

### Partikel-Effekte
- **Speed-Particles**: Mehr Partikel bei höherem Momentum
- **Momentum-Trails**: Intensivere Spuren bei schneller Bewegung
- **Velocity-Sparks**: Funken bei Richtungsänderungen
- **Max-Speed-Aura**: Spezielle Effekte bei maximalem Momentum

## Audio-Integration
- **Speed-Audio**: Intensivere Sounds bei höherer Geschwindigkeit
- **Momentum-Music**: Musik-Tempo passt sich Bewegung an
- **Whoosh-Effects**: Wind-Geräusche bei schneller Bewegung
- **Heartbeat-Sync**: Herzschlag synchron zu Momentum-Level

## Testkriterien
- Momentum baut sich flüssig auf und ab
- Schaden-Multiplikator funktioniert korrekt
- Formel-Zeit passt sich Geschwindigkeit an
- Visuelle Effekte reagieren auf Momentum-Änderungen
- System motiviert zu aktiver Bewegung

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 3, Schritt 3.1: Combo-System**
