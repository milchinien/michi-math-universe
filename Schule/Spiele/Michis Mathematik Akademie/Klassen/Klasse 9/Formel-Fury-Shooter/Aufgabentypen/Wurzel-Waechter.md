# Wurzel-Wächter 🌳🛡️

**Kategorie:** Radikale  
**Schwierigkeit:** 2 ⭐⭐  
**Status:** 📋 Geplant

## Mathematische Grundlagen

Wurzelrechnung und Radikale:
- **Quadratwurzeln:** √a, √(a²) = |a|
- **Wurzelgesetze:** √(a·b) = √a · √b, √(a/b) = √a / √b
- **Rationalisierung:** 1/√a = √a/a
- **Wurzelgleichungen:** √x = a → x = a² (mit Definitionsbereich)

### Kernkonzepte
- **Vereinfachung:** √18 = 3√2
- **Addition/Subtraktion:** 2√3 + 5√3 = 7√3
- **Multiplikation:** √2 · √8 = √16 = 4
- **Rationalisierung des Nenners:** 1/(2+√3) = (2-√3)/((2+√3)(2-√3))

## Aufgabentypen

### Level 1: Wurzeln vereinfachen
- `√12` → `2√3`
- `√50` → `5√2`
- `√72` → `6√2`

### Level 2: Wurzelterme addieren/subtrahieren
- `3√2 + 5√2` → `8√2`
- `7√3 - 2√3` → `5√3`
- `√8 + √18` → `2√2 + 3√2 = 5√2`

### Level 3: Wurzelterme multiplizieren/dividieren
- `√3 · √12` → `√36 = 6`
- `√15 / √3` → `√5`
- `(2√3) · (4√2)` → `8√6`

### Level 4: Nenner rationalisieren
- `1/√5` → `√5/5`
- `3/(2+√3)` → `3(2-√3)/(4-3) = 3(2-√3)`
- `√2/(√3-√2)` → `√2(√3+√2)/(3-2) = √6+2`

### Level 5: Wurzelgleichungen lösen
- `√x = 5` → `x = 25`
- `√(2x+3) = 7` → `x = 23`
- `√x + 3 = √(x+15)` → `x = 1`

## Schwierigkeitsgrade

### Stufe 1: Einfache Quadratwurzeln
- Perfekte Quadrate und einfache Vereinfachungen
- Radikanden ≤ 100
- Nur positive Zahlen

### Stufe 2: Wurzelterme kombinieren
- Addition/Subtraktion gleichartiger Wurzeln
- Einfache Multiplikation/Division
- Radikanden ≤ 200

### Stufe 3: Komplexe Operationen
- Gemischte Operationen
- Rationalisierung einfacher Nenner
- Radikanden ≤ 500

### Stufe 4: Erweiterte Techniken
- Binomische Formeln mit Wurzeln
- Komplexe Rationalisierung
- Wurzelgleichungen

### Stufe 5: Anwendungen
- Geometrische Probleme (Pythagoras)
- Physikalische Formeln
- Optimierungsaufgaben

## Implementierungshinweise

### Formel-Generierung
```javascript
generateRootTask(difficulty) {
    const taskTypes = ['simplify', 'combine', 'multiply', 'rationalize', 'equation'];
    const selectedType = weightedRandom(taskTypes, difficulty);
    
    switch(selectedType) {
        case 'simplify':
            return generateSimplifyTask(difficulty);
        case 'combine':
            return generateCombineTask(difficulty);
        case 'multiply':
            return generateMultiplyTask(difficulty);
        case 'rationalize':
            return generateRationalizeTask(difficulty);
        case 'equation':
            return generateRootEquationTask(difficulty);
    }
}
```

### Validierungslogik
```javascript
validateRootAnswer(task, userAnswer) {
    // Normalisierung verschiedener Schreibweisen
    const normalizedAnswer = normalizeRootExpression(userAnswer);
    const correctAnswer = normalizeRootExpression(task.solution);
    
    // Algebraische Äquivalenz prüfen
    return areRootExpressionsEquivalent(normalizedAnswer, correctAnswer);
}
```

### Eingabe-Parsing
- **Wurzelausdrücke:** `2√3` oder `2*sqrt(3)` oder `2√(3)`
- **Brüche:** `√5/5` oder `sqrt(5)/5`
- **Komplexe Ausdrücke:** `(2-√3)/(4-3)` oder `(2-sqrt(3))/(4-3)`
- **Gleichungslösungen:** `x=25` oder `25`

## Gegner-Design

### Visuelle Eigenschaften
- **Farbe:** Erdbraun mit grünen Akzenten (naturverbunden, verwurzelt)
- **Form:** Baumähnliche Kreaturen mit Wurzel-Symbolen als Äste
- **Animation:** Wachsen aus dem Boden, schwankende Bewegungen
- **Größe:** Hoch und schlank, variiert mit Wurzel-Komplexität

### Spezial-Effekte
- **Spawn-Animation:** Wächst aus Boden-Rissen mit Wurzel-Partikeln
- **Bewegung:** Langsam, aber kann sich "verwurzeln" (unbeweglich werden)
- **Angriff:** Schießt Wurzel-Ranken mit mathematischen Symbolen
- **Tod:** Zerfällt zu Blättern mit vereinfachten Wurzelausdrücken

### Gameplay-Eigenschaften
- **Geschwindigkeit:** Langsam, aber hohe Verteidigung wenn verwurzelt
- **Lebenspunkte:** 1, aber +1 HP wenn verwurzelt
- **Spawn-Rate:** Mittel
- **Besonderheit:** Kann sich "verwurzeln" und andere Gegner heilen

## Balancing

### Zeitlimits
- **Tag-Modus:** 25-45 Sekunden
- **Nacht-Modus:** 35-60 Sekunden
- **Bonus-Zeit:** +15s bei Rationalisierungsaufgaben

### Schadenswerte
- **Korrekte Antwort:** Gegner eliminiert
- **Falsche Antwort:** -1 HP, Wächter verwurzelt sich (+1 HP)
- **Zeitüberschreitung:** -1 HP, Wächter heilt nahestehende Gegner

### Belohnungen
- **XP:** 25-45 (je nach Aufgabentyp)
- **Münzen:** 15-30
- **Combo-Multiplikator:** 1.25x
- **Spezial-Drop:** 4% Chance auf "Wurzel-Essenz" (Heilungs-Item)

## Audio-Design

### Sound-Effekte
- **Spawn:** Knacken von Ästen + Rascheln von Blättern
- **Bewegung:** Schwere Schritte + Holz-Knarren
- **Verwurzelung:** Tiefes Grollen + Erd-Geräusche
- **Angriff:** Peitschende Ranken + Wind-Rauschen
- **Korrekte Lösung:** Harmonisches Naturgeräusch + Wachstum
- **Falsche Lösung:** Knacken + Ächzen von Holz
