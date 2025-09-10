# Quadratische Gleichungs-Dämonen 🔥👿

**Kategorie:** Algebra  
**Schwierigkeit:** 2 ⭐⭐  
**Status:** 📋 Bereit zur Implementierung

## Mathematische Grundlagen

Quadratische Gleichungen sind Gleichungen der Form **ax² + bx + c = 0** mit a ≠ 0.

### Lösungsverfahren
1. **Faktorisierung:** x² + 5x + 6 = 0 → (x + 2)(x + 3) = 0
2. **Quadratische Ergänzung:** x² + 6x + 5 = 0 → (x + 3)² = 4
3. **p-q-Formel:** x² + px + q = 0 → x = -p/2 ± √((p/2)² - q)
4. **abc-Formel:** ax² + bx + c = 0 → x = (-b ± √(b² - 4ac)) / (2a)

## Aufgabentypen

### Level 1: Einfache Faktorisierung
- `x² + 5x + 6 = 0` → `x₁ = -2, x₂ = -3`
- `x² - 7x + 12 = 0` → `x₁ = 3, x₂ = 4`
- `x² - 9 = 0` → `x₁ = 3, x₂ = -3`

### Level 2: p-q-Formel erforderlich
- `x² + 4x + 1 = 0` → `x₁ = -2 + √3, x₂ = -2 - √3`
- `x² - 6x + 7 = 0` → `x₁ = 3 + √2, x₂ = 3 - √2`
- `x² + 2x - 5 = 0` → `x₁ = -1 + √6, x₂ = -1 - √6`

### Level 3: Allgemeine Form (abc-Formel)
- `2x² + 5x - 3 = 0` → `x₁ = 0.5, x₂ = -3`
- `3x² - 7x + 2 = 0` → `x₁ = 2, x₂ = 1/3`
- `4x² + 4x - 3 = 0` → `x₁ = 0.5, x₂ = -1.5`

### Level 4: Keine reellen Lösungen
- `x² + 2x + 5 = 0` → `Keine reellen Lösungen`
- `2x² + x + 3 = 0` → `Keine reellen Lösungen`

## Schwierigkeitsgrade

### Stufe 1: Ganzzahlige Lösungen (Faktorisierung)
- Diskriminante ist Quadratzahl
- Lösungen sind ganze Zahlen
- Koeffizienten: a=1, b,c ∈ [-10, 10]

### Stufe 2: Irrationale Lösungen (p-q-Formel)
- Diskriminante ist keine Quadratzahl
- Wurzelausdrücke in der Lösung
- Koeffizienten: a=1, b,c ∈ [-15, 15]

### Stufe 3: Allgemeine Koeffizienten (abc-Formel)
- a ≠ 1, komplexere Berechnungen
- Brüche in den Lösungen möglich
- Koeffizienten: a ∈ [2, 5], b,c ∈ [-20, 20]

### Stufe 4: Gemischte Aufgaben + Sonderfälle
- Negative Diskriminante (keine Lösung)
- Doppelte Nullstellen
- Sehr große/kleine Koeffizienten

## Implementierungshinweise

### Formel-Generierung
```javascript
generateQuadraticEquation(difficulty) {
    const types = ['factorizable', 'pq-formula', 'abc-formula', 'no-solution'];
    const selectedType = weightedRandom(types, difficulty);
    
    switch(selectedType) {
        case 'factorizable':
            return generateFactorizableEquation(difficulty);
        case 'pq-formula':
            return generatePQFormulaEquation(difficulty);
        case 'abc-formula':
            return generateABCFormulaEquation(difficulty);
        case 'no-solution':
            return generateNoSolutionEquation(difficulty);
    }
}
```

### Validierungslogik
```javascript
validateQuadraticSolution(equation, userAnswer) {
    const correctSolutions = solveQuadratic(equation.a, equation.b, equation.c);
    
    // Verschiedene Eingabeformate akzeptieren:
    // "x1=2, x2=3" oder "2; 3" oder "x=2 oder x=3"
    const userSolutions = parseUserSolutions(userAnswer);
    
    return compareSolutions(correctSolutions, userSolutions, tolerance=0.01);
}
```

### Eingabe-Parsing
- **Zwei Lösungen:** `x₁=2, x₂=3` oder `2; 3` oder `x=2 oder x=3`
- **Eine Lösung:** `x=5` oder `5` (doppelte Nullstelle)
- **Keine Lösung:** `keine Lösung` oder `∅` oder `no solution`
- **Wurzelausdrücke:** `x=1+√2` oder `x=1+sqrt(2)`

## Gegner-Design

### Visuelle Eigenschaften
- **Farbe:** Tiefrot mit schwarzen Akzenten (dämonisch, gefährlich)
- **Form:** Gehörnte, kantige Kreaturen mit Gleichungs-Symbolen
- **Animation:** Aggressive Bewegungen, Feuer-Partikel
- **Größe:** 20% größer als Binomial-Bestien

### Spezial-Effekte
- **Spawn-Animation:** Aufsteigen aus Flammen-Portal
- **Angriff:** Feuerbälle mit Gleichungs-Fragmenten
- **Tod:** Explosive Implosion mit Lösungs-Anzeige

### Gameplay-Eigenschaften
- **Geschwindigkeit:** Langsamer als Binomial-Bestien (komplexere Aufgaben)
- **Lebenspunkte:** 1 (aber höhere Belohnung)
- **Spawn-Rate:** Mittel (schwierigere Gegner)
- **Besonderheit:** Kann andere Gegner "infizieren" (Kettenreaktion bei falscher Antwort)

## Balancing

### Zeitlimits
- **Tag-Modus (Multiple Choice):** 25-45 Sekunden
- **Nacht-Modus (Freie Eingabe):** 35-60 Sekunden
- **Bonus-Zeit:** +10s bei Stufe 4 (keine Lösung)

### Schadenswerte
- **Korrekte Antwort:** Gegner eliminiert + Bonus-XP
- **Falsche Antwort:** -2 HP, Combo-Reset, Gegner wird stärker
- **Zeitüberschreitung:** -2 HP, Gegner spaltet sich in 2 Binomial-Bestien

### Belohnungen
- **XP:** 25-50 (je nach Schwierigkeit)
- **Münzen:** 15-35
- **Combo-Multiplikator:** 1.3x pro korrekter Antwort
- **Spezial-Drop:** 5% Chance auf "Diskriminanten-Kristall" (Upgrade-Material)

## Audio-Design

### Sound-Effekte
- **Spawn:** Tiefes, dämonisches Brüllen
- **Angriff:** Prasselnde Flammen + Metall-Klirren
- **Korrekte Lösung:** Triumphaler Akkord + Explosion
- **Falsche Lösung:** Dissonanter Schrei + Schaden-Sound

### Musik-Integration
- Verstärkt Bass-Frequenzen wenn Dämonen spawnen
- Tempo erhöht sich bei Dämon-Wellen
- Spezielle "Dämon-Melodie" bei Boss-Dämonen
