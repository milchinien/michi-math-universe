# Phase 3.2: Enemy-Typen und Variationen

## Ziel
Implementiere verschiedene Enemy-Typen mit unterschiedlichen Eigenschaften und Formeln.

## Implementierung

- [x] Verschiedene Enemy-Klassen erstellen:
  - [x] Polynom-Zombies (Basis, langsam, einfache Formeln)
  - [x] Gleichungs-Geister (schnell, mittlere Formeln)
  - [x] Elite-Mobs (stark, komplexe Formeln)
- [x] Unterschiedliche Bewegungsgeschwindigkeiten
- [x] Verschiedene Health-Werte
- [x] Spezielle Enemy-Färbung/Sprites je nach Typ
- [x] Typ-spezifische Formel-Zuweisungen
- [x] Spawn-Wahrscheinlichkeiten basierend auf Spiel-Fortschritt

## ✅ Implementiert (Vollständig)

### Enemy-Typen System
- **4 Verschiedene Enemy-Typen** mit einzigartigen Eigenschaften:

#### 🧟 **Polynom-Zombie (PZ)**
- **Eigenschaften**: Langsam, robust, Anfänger-freundlich
- **Größe**: 35x35px (größer als Standard)
- **Geschwindigkeit**: 60-90 (langsam)
- **Gesundheit**: 80 HP
- **Farbe**: Grün (#00ff00) mit grünem Glow
- **Form**: Hexagon
- **Formeln**: Bevorzugt einfache Expansions-Formeln (1. & 2. Binomische)
- **Schwierigkeit**: -0.5 Bias (einfacher)
- **Score-Multiplier**: 1.0x (Standard)

#### 👻 **Gleichungs-Geist (GG)**
- **Eigenschaften**: Schnell, mittlere Schwierigkeit
- **Größe**: 25x25px (kleiner, schwerer zu treffen)
- **Geschwindigkeit**: 120-180 (schnell)
- **Gesundheit**: 60 HP
- **Farbe**: Cyan (#00ffff) mit cyan Glow
- **Form**: Diamant
- **Formeln**: Bevorzugt mittlere Komplexität (2. Binomische, 3. Binomische)
- **Schwierigkeit**: 0 Bias (normal)
- **Score-Multiplier**: 1.3x

#### 👹 **Elite-Algebra-Bestie (EB)**
- **Eigenschaften**: Langsam aber gefährlich, hohe Belohnung
- **Größe**: 45x45px (imposant groß)
- **Geschwindigkeit**: 40-70 (sehr langsam)
- **Gesundheit**: 150 HP
- **Farbe**: Magenta (#ff0080) mit magenta Glow
- **Form**: Stern (5-zackig)
- **Formeln**: Bevorzugt komplexe Faktorisierungen
- **Schwierigkeit**: +1.0 Bias (schwieriger)
- **Score-Multiplier**: 2.0x

#### ⚫ **Standard-Gegner**
- **Eigenschaften**: Ausgewogene Baseline
- **Größe**: 30x30px
- **Geschwindigkeit**: 80-120
- **Gesundheit**: 100 HP
- **Farbe**: Rot (#ff3300)
- **Form**: Hexagon
- **Formeln**: Normale Verteilung
- **Score-Multiplier**: 1.0x

### Progressive Spawn-Wahrscheinlichkeiten

#### **Early Game** (Score < 500):
```
Polynom-Zombie: 70%    (Lernphase)
Gleichungs-Geist: 20%  
Elite-Mob: 5%          
Standard: 5%
```

#### **Mid Game** (500-1500):
```
Polynom-Zombie: 40%    (Ausgewogen)
Gleichungs-Geist: 40%  
Elite-Mob: 15%         
Standard: 5%
```

#### **Late Game** (1500+):
```
Polynom-Zombie: 20%    (Herausforderung)
Gleichungs-Geist: 40%  
Elite-Mob: 35%         
Standard: 5%
```

#### **Combo-Bonus-Spawning**:
- **Combo ≥5**: +10% Elite-Mobs
- **Combo ≥10**: +15% Elite-Mobs

### Visuelle Unterscheidung

#### **Form-Differenzierung**:
- **Hexagon**: Polynom-Zombies, Standard
- **Diamant**: Gleichungs-Geister  
- **5-Zack-Stern**: Elite-Bestien

#### **Farb-System**:
- **Grün**: Einfach/Anfänger (Polynom-Zombies)
- **Cyan**: Mittel/Schnell (Gleichungs-Geister)
- **Magenta**: Schwer/Elite (Elite-Bestien)
- **Rot**: Standard/Neutral

#### **Core-Pattern**:
- **Polynom-Zombie**: Einfacher Punkt
- **Gleichungs-Geist**: Kreuz-Muster
- **Elite-Bestie**: Komplexes Kreuz mit Zentrum
- **Standard**: Standard-Punkt

#### **Typ-Indikatoren**:
- **PZ**, **GG**, **EB** Labels über Gegnern
- Unterschiedliche Glow-Intensitäten
- Typ-spezifische Bewegungs-Pattern

### Formel-Zuweisungs-System

#### **Intelligente Typ-Zuordnung**:
- **Polynom-Zombies** → Einfache Expansions-Formeln
- **Gleichungs-Geister** → Mittlere Komplexität
- **Elite-Bestien** → Schwierige Faktorisierungen

#### **Difficulty-Bias-System**:
```javascript
Polynom-Zombie: -0.5  (Koeffizienten reduziert)
Gleichungs-Geist: 0   (Normal)
Elite-Bestie: +1.0    (Koeffizienten erhöht)
```

#### **Typ-spezifische Formel-Filter**:
- **PZ**: Nur expansion_plus, expansion_minus
- **GG**: expansion_minus, difference_squares  
- **EB**: factorization_difference, factorization_square

### Performance & Balance

#### **Score-Multiplier-System**:
- **Schwierigere Gegner** = **Höhere Belohnung**
- **Elite-Bestien**: 2.0x Score-Bonus
- **Gleichungs-Geister**: 1.3x Score-Bonus  
- **Polynom-Zombies**: 1.0x Standard

#### **Dynamisches Spawning**:
- **Score > 1000**: Spawn-Intervall 2.5s (schneller)
- **Score > 2000**: Spawn-Intervall 2.0s (noch schneller)
- **Mehr Gegner** = **Mehr Action**

#### **Typ-Balance**:
- **Langsame Elite-Bestien**: Schwer zu treffen, hohe Belohnung
- **Schnelle Geister**: Leicht zu verfehlen, mittlere Belohnung
- **Robuste Zombies**: Viel Leben, Standard-Belohnung

### Technische Features

#### **Modulare Typ-Eigenschaften**:
```javascript
setTypeProperties() {
    const types = {
        'polynom_zombie': { ... },
        'gleichungs_geist': { ... },
        'elite_mob': { ... }
    };
}
```

#### **Dynamic Formula Generation**:
- Typ-spezifische Koeffizienten-Anpassung
- Intelligente Formel-Typ-Auswahl
- Difficulty-Bias-Integration

#### **Visual Rendering System**:
- Typ-spezifische Shape-Renderer
- Individuelle Core-Pattern
- Dynamische Typ-Indikatoren

#### **Spawn-Wahrscheinlichkeits-Engine**:
- Score/Combo-basierte Anpassungen
- Kumulative Wahrscheinlichkeits-Berechnung
- Dynamische Balance-Anpassungen

## Erwartetes Ergebnis
✅ **ERREICHT**: Visuelle und mechanische Vielfalt durch verschiedene Enemy-Typen mit angepassten Formeln.

## Technische Details
✅ **IMPLEMENTIERT**:
- Enemy-Typ-Vererbungssystem mit 4 eindeutigen Klassen
- Typ-basierte Eigenschaften (Speed, Health, Visuals, Formeln)
- Progressive Spawning-Logic mit Score/Combo-Integration
- Vollständige visuelle Differenzierung (Form, Farbe, Pattern)

## Builds auf
- Phase 3.1 (Erweiterte Formeln)

### Gameplay-Impact:
- **Strategische Tiefe**: Spieler müssen verschiedene Gegner-Typen unterschiedlich angehen
- **Visuelle Klarheit**: Sofortige Erkennung von Gegner-Schwierigkeit
- **Progressive Herausforderung**: Schwierigere Gegner erscheinen mit Fortschritt
- **Belohnungs-System**: Höhere Belohnungen für schwierigere Gegner
- **Lern-Progression**: Einfache Gegner für Anfänger, komplexe für Experten


