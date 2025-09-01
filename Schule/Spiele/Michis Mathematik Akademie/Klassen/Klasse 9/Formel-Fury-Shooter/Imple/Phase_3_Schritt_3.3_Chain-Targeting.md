# Phase 3, Schritt 3.3: Chain-Targeting

## Ziel
Implementierung eines Chain-Targeting-Systems für spektakuläre Multi-Gegner-Eliminierungen mit einer einzigen Formel-Lösung.

## Beschreibung
Das Chain-Targeting-System ermöglicht es, mehrere Gegner gleichzeitig anzuvisieren und mit einer korrekten Formel-Lösung alle markierten Feinde zu eliminieren. Dies schafft epische Momente und belohnt strategische Positionierung.

## Konkrete Implementierung

### 1. Multi-Target-Selection
- **ChainTargetingSystem.js** für Mehrfach-Zielverfolgung
- Maus-Hover oder Tab-Taste zum Markieren mehrerer Gegner
- Visuelle Verbindungslinien zwischen markierten Zielen
- Maximale Chain-Länge basierend auf Spieler-Level und Upgrades
- Smart-Targeting: Automatische Auswahl optimaler Ziel-Kombinationen

### 2. Chain-Reaction-Mechanik
- **Dominoeffekt**: Eliminierte Gegner lösen weitere Ketten aus
- **Proximity-Chains**: Nahe Gegner werden automatisch in Kette einbezogen
- **Element-Chains**: Gleiche Formel-Typen verstärken Chain-Effekte
- **Perfect-Chains**: Bonus für optimal geplante Ketten

### 3. Formel-zu-Chain-Mapping
- **Einfache Formeln**: 2-3 Gegner pro Chain
- **Mittlere Formeln**: 4-6 Gegner pro Chain
- **Komplexe Formeln**: 7-10 Gegner pro Chain
- **Legendary Formeln**: Unbegrenzte Chain-Länge

### 4. Chain-Reaction-Visuals
- **Lightning-Chains**: Blitze verbinden eliminierte Gegner
- **Explosion-Cascade**: Kettenreaktions-Explosionen
- **Energy-Waves**: Energiewellen durchlaufen die Chain
- **Symbol-Transfer**: Mathematische Symbole springen zwischen Zielen

## Technische Details

### Targeting-Algorithmus
```javascript
// Chain-Target-Selection
{
    maxChainLength: 3 + playerLevel,
    chainRange: 150,  // Pixel-Radius für Auto-Chain
    difficultyBonus: formulaDifficulty * 2,
    proximityWeight: 0.7,  // Gewichtung für nahe Gegner
    typeMatchBonus: 1.5    // Bonus für gleiche Gegner-Typen
}
```

### Chain-Damage-Berechnung
- **Erster Gegner**: 100% Schaden
- **Zweiter Gegner**: 90% Schaden
- **Dritter Gegner**: 80% Schaden
- **Weitere Gegner**: -10% pro zusätzlichem Ziel
- **Chain-Bonus**: +25% Gesamtschaden bei 5+ Kette

### Performance-Optimierungen
- **Line-of-Sight-Checks**: Nur sichtbare Gegner können gekettet werden
- **Distance-Culling**: Zu weit entfernte Gegner ausschließen
- **Update-Batching**: Chain-Berechnungen in Batches
- **Visual-LOD**: Reduzierte Effekte bei vielen Chains

## Gameplay-Mechaniken

### Strategische Positionierung
- **Optimal-Angles**: Beste Winkel für maximale Chain-Länge
- **Crowd-Control**: Gegner in Chain-Formation locken
- **Timing-Windows**: Perfekte Momente für Chain-Attacks
- **Risk-Assessment**: Abwägung zwischen Chain-Länge und Sicherheit

### Chain-Combo-Integration
- **Chain-Multiplier**: Längere Chains = höhere Combo-Boni
- **Perfect-Chain-Bonus**: Spezielle Boni für optimale Chains
- **Chain-Streak**: Aufeinanderfolgende Chains verstärken sich
- **Mega-Chain-Events**: Spezielle Belohnungen bei extremen Chains

### Skill-Progression
- **Chain-Mastery**: Verbesserte Chain-Fähigkeiten durch Übung
- **Range-Upgrades**: Größere Chain-Reichweite
- **Efficiency-Bonuses**: Weniger Schaden-Verlust in Chains
- **Special-Chain-Types**: Freischaltung neuer Chain-Varianten

## Visuelle Chain-Effekte

### Targeting-Visuals
- **Selection-Rings**: Leuchtende Ringe um markierte Gegner
- **Connection-Lines**: Dynamische Linien zwischen Zielen
- **Chain-Preview**: Vorschau der geplanten Chain-Route
- **Difficulty-Colors**: Farbkodierung basierend auf Chain-Schwierigkeit

### Execution-Effects
- **Lightning-Strike**: Blitz durchläuft die gesamte Chain
- **Explosion-Sequence**: Zeitversetzte Explosionen entlang der Chain
- **Energy-Cascade**: Energiewelle läuft durch alle Ziele
- **Symbol-Storm**: Mathematische Symbole wirbeln zwischen Gegnern

### Success-Feedback
- **Chain-Counter**: Große Zahlen-Anzeige für Chain-Länge
- **Damage-Numbers**: Schaden-Zahlen für jeden Chain-Treffer
- **Screen-Flash**: Intensiver Flash bei erfolgreichen Mega-Chains
- **Victory-Particles**: Spezielle Partikel bei perfekten Chains

## Audio-Design

### Chain-Audio-Progression
- **Target-Selection**: Subtile Töne beim Markieren
- **Chain-Building**: Aufsteigende Tonleiter bei Chain-Aufbau
- **Execution-Sound**: Dramatischer Sound bei Chain-Auslösung
- **Impact-Sequence**: Rhythmische Sounds für jeden Chain-Treffer

### Dynamic-Audio-Scaling
- **Chain-Length-Audio**: Intensivere Sounds bei längeren Chains
- **Pitch-Progression**: Steigende Tonhöhe entlang der Chain
- **Echo-Effects**: Nachhall-Effekte bei großen Chains
- **Climax-Audio**: Epische Sounds bei Mega-Chains

## Integration mit bestehenden Systemen

### Combo-System-Synergy
- **Chain-Combo-Multiplier**: Chains verstärken Combo-Aufbau
- **Perfect-Chain-Protection**: Perfekte Chains schützen vor Combo-Break
- **Chain-Streak-Bonus**: Aufeinanderfolgende Chains = höhere Combos

### Momentum-System-Integration
- **Speed-Chain-Bonus**: Höheres Momentum = längere Chains
- **Chain-Momentum-Boost**: Erfolgreiche Chains erhöhen Momentum
- **Movement-Chains**: Chains während Bewegung für Extra-Boni

## Testkriterien
- Multi-Target-Selection funktioniert flüssig
- Chain-Reactions lösen korrekt aus
- Visuelle Effekte sind spektakulär und klar verständlich
- Audio-Feedback verstärkt Chain-Gefühl
- System belohnt strategisches Denken und Positionierung

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 4, Schritt 4.1: Advanced Partikel-System**
