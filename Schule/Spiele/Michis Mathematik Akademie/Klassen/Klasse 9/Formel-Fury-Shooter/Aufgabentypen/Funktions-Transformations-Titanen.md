# Funktions-Transformations-Titanen ⚡🏛️

**Kategorie:** Funktionen  
**Schwierigkeit:** 2 ⭐⭐  
**Status:** 📋 Geplant

## Mathematische Grundlagen

Transformationen von Funktionen durch Parameter-Änderungen:
- **Verschiebung:** f(x) + d (vertikal), f(x + c) (horizontal)
- **Streckung/Stauchung:** a·f(x) (vertikal), f(b·x) (horizontal)
- **Spiegelung:** -f(x) (x-Achse), f(-x) (y-Achse)

### Transformationsregeln
- **f(x) → f(x) + d:** Verschiebung um d nach oben
- **f(x) → f(x + c):** Verschiebung um c nach links
- **f(x) → a·f(x):** Streckung um Faktor a (vertikal)
- **f(x) → f(b·x):** Stauchung um Faktor 1/b (horizontal)

## Aufgabentypen

### Level 1: Einfache Verschiebungen
- `f(x) = x²` → `g(x) = x² + 3` (3 nach oben)
- `f(x) = x²` → `g(x) = (x - 2)²` (2 nach rechts)
- `f(x) = √x` → `g(x) = √x - 1` (1 nach unten)

### Level 2: Streckungen und Stauchungen
- `f(x) = x²` → `g(x) = 2x²` (Streckung Faktor 2)
- `f(x) = x²` → `g(x) = (2x)²` (Stauchung Faktor 1/2)
- `f(x) = |x|` → `g(x) = 0.5|x|` (Stauchung Faktor 0.5)

### Level 3: Spiegelungen
- `f(x) = x²` → `g(x) = -x²` (Spiegelung an x-Achse)
- `f(x) = 2^x` → `g(x) = 2^(-x)` (Spiegelung an y-Achse)
- `f(x) = √x` → `g(x) = -√(-x)` (Punktspiegelung)

### Level 4: Kombinierte Transformationen
- `f(x) = x²` → `g(x) = -2(x + 1)² - 3`
- `f(x) = |x|` → `g(x) = 0.5|2x - 4| + 1`
- `f(x) = sin(x)` → `g(x) = 3sin(0.5x + π) - 2`

## Schwierigkeitsgrade

### Stufe 1: Einzelne Transformationen
- Nur eine Transformation pro Aufgabe
- Ganzzahlige Parameter
- Grundfunktionen: x², |x|, √x

### Stufe 2: Doppelte Transformationen
- Zwei Transformationen kombiniert
- Parameter ∈ {0.5, 2, 3, -1, -2}
- Erweiterte Funktionen: sin(x), cos(x), 2^x

### Stufe 3: Komplexe Transformationen
- 3+ Transformationen kombiniert
- Bruchzahlige Parameter
- Alle Grundfunktionen

### Stufe 4: Inverse Transformationen
- Von transformierter zu ursprünglicher Funktion
- Parameter bestimmen aus Graphen
- Anwendungskontext

## Implementierungshinweise

### Formel-Generierung
```javascript
generateTransformationTask(difficulty) {
    const baseFunction = selectBaseFunction(difficulty);
    const transformations = generateTransformations(difficulty);
    
    return {
        baseFunction: baseFunction,
        transformations: transformations,
        resultFunction: applyTransformations(baseFunction, transformations),
        taskType: selectTaskType(difficulty)
    };
}
```

### Validierungslogik
```javascript
validateTransformation(task, userAnswer) {
    switch(task.taskType) {
        case 'identify-transformation':
            return validateTransformationDescription(task, userAnswer);
        case 'apply-transformation':
            return validateResultFunction(task, userAnswer);
        case 'find-parameters':
            return validateParameters(task, userAnswer);
    }
}
```

### Eingabe-Parsing
- **Funktionsgleichung:** `g(x)=2(x-1)²+3` oder `y=2(x-1)^2+3`
- **Transformationsbeschreibung:** `2 nach rechts, 3 nach oben, Streckung Faktor 2`
- **Parameter:** `a=2, h=1, k=3` oder `Streckung: 2, Verschiebung: (1|3)`

## Gegner-Design

### Visuelle Eigenschaften
- **Farbe:** Gold-bronze mit elektrischen Akzenten (titanisch, mächtig)
- **Form:** Massive, geometrische Konstrukte mit beweglichen Teilen
- **Animation:** Mechanische Transformationen (Rotation, Skalierung, Translation)
- **Größe:** Groß und imposant (150% der Basis-Gegner)

### Spezial-Effekte
- **Spawn-Animation:** Materialisierung durch geometrische Transformation
- **Bewegung:** Transformiert sich während der Bewegung
- **Angriff:** Schießt transformierte Projektil-Muster
- **Tod:** Zerfällt in geometrische Fragmente mit Transformations-Gleichungen

### Gameplay-Eigenschaften
- **Geschwindigkeit:** Langsam, aber unaufhaltsam
- **Lebenspunkte:** 2 (robuster als andere Gegner)
- **Spawn-Rate:** Niedrig (Elite-Gegner)
- **Besonderheit:** Kann Arena-Geometrie temporär verändern

## Balancing

### Zeitlimits
- **Tag-Modus:** 30-50 Sekunden
- **Nacht-Modus:** 40-70 Sekunden
- **Bonus-Zeit:** +20s bei kombinierten Transformationen

### Schadenswerte
- **Korrekte Antwort:** Gegner eliminiert + Doppel-XP
- **Falsche Antwort:** -1 HP, Titan wird größer und stärker
- **Zeitüberschreitung:** -2 HP, Titan transformiert andere Gegner

### Belohnungen
- **XP:** 40-80 (höchste Belohnung)
- **Münzen:** 25-50
- **Combo-Multiplikator:** 1.5x
- **Spezial-Drop:** 8% Chance auf "Transformations-Matrix" (seltenes Upgrade)

## Audio-Design

### Sound-Effekte
- **Spawn:** Mechanisches Summen + Metall-Transformation
- **Bewegung:** Schwere Schritte + Hydraulik-Geräusche
- **Transformation:** Elektronische Synthesizer-Sweeps
- **Angriff:** Kraftvolle Energie-Entladung
- **Korrekte Lösung:** Triumphaler Orchestral-Hit
- **Falsche Lösung:** Verzerrtes Metall-Kreischen
