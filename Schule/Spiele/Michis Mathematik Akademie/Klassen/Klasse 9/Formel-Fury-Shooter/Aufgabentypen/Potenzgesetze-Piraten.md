# Potenzgesetze-Piraten 🏴‍☠️⚡

**Kategorie:** Radikale  
**Schwierigkeit:** 2 ⭐⭐  
**Status:** 📋 Geplant

## Mathematische Grundlagen

Potenzgesetze und Exponentialrechnung:
- **Produktregel:** a^m · a^n = a^(m+n)
- **Quotientenregel:** a^m / a^n = a^(m-n)
- **Potenzregel:** (a^m)^n = a^(m·n)
- **Negative Exponenten:** a^(-n) = 1/a^n
- **Nullexponent:** a^0 = 1 (für a ≠ 0)

### Erweiterte Regeln
- **Produktregel für Basen:** (a·b)^n = a^n · b^n
- **Quotientenregel für Basen:** (a/b)^n = a^n / b^n
- **Wurzeln als Potenzen:** ⁿ√a = a^(1/n)
- **Rationale Exponenten:** a^(m/n) = ⁿ√(a^m)

## Aufgabentypen

### Level 1: Grundlegende Potenzgesetze
- `2³ · 2⁵` → `2⁸ = 256`
- `x⁷ / x³` → `x⁴`
- `(3²)⁴` → `3⁸ = 6561`

### Level 2: Negative und rationale Exponenten
- `5⁻³` → `1/125`
- `x⁻² · x⁵` → `x³`
- `8^(2/3)` → `4`

### Level 3: Kombinierte Operationen
- `(2x³)² · (3x⁻¹)³` → `4x⁶ · 27x⁻³ = 108x³`
- `(a²b⁻¹)⁻³ / (a⁻¹b²)²` → `a⁻⁶b³ / a⁻²b⁴ = a⁻⁴b⁻¹`
- `√(x⁶) · x^(1/3)` → `x³ · x^(1/3) = x^(10/3)`

### Level 4: Exponentialgleichungen
- `2^x = 32` → `x = 5`
- `3^(2x-1) = 27` → `x = 2`
- `4^x · 2^(x+1) = 64` → `x = 2`

### Level 5: Anwendungen
- Zinseszinsrechnung: `K = K₀ · (1+p)^t`
- Exponentielles Wachstum: `N(t) = N₀ · e^(kt)`
- Halbwertszeit: `N(t) = N₀ · (1/2)^(t/T)`

## Schwierigkeitsgrade

### Stufe 1: Einfache Potenzgesetze
- Ganzzahlige positive Exponenten
- Gleiche Basen
- Exponenten ≤ 10

### Stufe 2: Erweiterte Exponenten
- Negative Exponenten
- Rationale Exponenten (1/2, 1/3, 2/3)
- Verschiedene Basen

### Stufe 3: Komplexe Terme
- Mehrere Variablen
- Kombinierte Operationen
- Bruchterme mit Potenzen

### Stufe 4: Gleichungen und Anwendungen
- Exponentialgleichungen
- Logarithmus-Umkehrung
- Realitätsbezogene Probleme

### Stufe 5: Fortgeschrittene Techniken
- Substitution bei komplexen Exponenten
- Parameterabhängige Exponenten
- Grenzwerte mit Exponentialfunktionen

## Implementierungshinweise

### Formel-Generierung
```javascript
generatePowerLawTask(difficulty) {
    const taskTypes = ['basic-rules', 'negative-exp', 'combined-ops', 'equations', 'applications'];
    const selectedType = weightedRandom(taskTypes, difficulty);
    
    switch(selectedType) {
        case 'basic-rules':
            return generateBasicPowerTask(difficulty);
        case 'negative-exp':
            return generateNegativeExpTask(difficulty);
        case 'combined-ops':
            return generateCombinedOpsTask(difficulty);
        case 'equations':
            return generateExpEquationTask(difficulty);
        case 'applications':
            return generateApplicationTask(difficulty);
    }
}
```

### Validierungslogik
```javascript
validatePowerAnswer(task, userAnswer) {
    // Verschiedene Darstellungsformen normalisieren
    const normalizedAnswer = normalizePowerExpression(userAnswer);
    const correctAnswer = normalizePowerExpression(task.solution);
    
    // Exponentialausdrücke vereinfachen und vergleichen
    return arePowerExpressionsEquivalent(normalizedAnswer, correctAnswer);
}
```

### Eingabe-Parsing
- **Potenzen:** `2^8` oder `2⁸` oder `2**8`
- **Negative Exponenten:** `x^(-2)` oder `x⁻²` oder `1/x²`
- **Rationale Exponenten:** `x^(2/3)` oder `x^(2/3)` oder `∛(x²)`
- **Brüche:** `1/125` oder `0.008`
- **Gleichungslösungen:** `x=5` oder `5`

## Gegner-Design

### Visuelle Eigenschaften
- **Farbe:** Schwarz-rot mit goldenen Akzenten (piratisch, gefährlich)
- **Form:** Piratenschiffe mit Exponenten als Segel und Kanonen
- **Animation:** Schaukelnde Bewegung, Segel flattern im Wind
- **Größe:** Mittelgroß, aber imposante Silhouette

### Spezial-Effekte
- **Spawn-Animation:** Auftauchen aus Nebel mit Piraten-Flagge
- **Bewegung:** Wellenförmige Bewegung, kann "segeln" (schneller werden)
- **Angriff:** Kanonenkugeln mit Exponential-Gleichungen
- **Tod:** Explosion mit Goldmünzen und Potenz-Symbolen

### Gameplay-Eigenschaften
- **Geschwindigkeit:** Mittel, kann durch "Wind" beschleunigen
- **Lebenspunkte:** 1, aber +1 HP bei "Sturm-Wetter"
- **Spawn-Rate:** Mittel, erscheinen in Gruppen
- **Besonderheit:** Können "Beutezüge" starten (Münzen stehlen)

## Balancing

### Zeitlimits
- **Tag-Modus:** 20-40 Sekunden
- **Nacht-Modus:** 30-55 Sekunden
- **Bonus-Zeit:** +10s bei Exponentialgleichungen

### Schadenswerte
- **Korrekte Antwort:** Gegner eliminiert + Münz-Bonus
- **Falsche Antwort:** -1 HP, Pirat stiehlt Münzen
- **Zeitüberschreitung:** -1 HP, Pirat ruft Verstärkung

### Belohnungen
- **XP:** 20-40 (je nach Aufgabentyp)
- **Münzen:** 10-25 (höhere Münz-Belohnung als andere Gegner)
- **Combo-Multiplikator:** 1.2x
- **Spezial-Drop:** 6% Chance auf "Piraten-Schatz" (Extra-Münzen)

## Audio-Design

### Sound-Effekte
- **Spawn:** Nebel-Horn + Piraten-Gesang
- **Bewegung:** Wellen-Plätschern + Segel-Flattern
- **Angriff:** Kanonen-Donner + Pfeifende Kugeln
- **Münz-Diebstahl:** Klirren von Münzen + Piraten-Lachen
- **Korrekte Lösung:** Triumphale Piraten-Melodie
- **Falsche Lösung:** Enttäuschtes Piraten-Fluchen
