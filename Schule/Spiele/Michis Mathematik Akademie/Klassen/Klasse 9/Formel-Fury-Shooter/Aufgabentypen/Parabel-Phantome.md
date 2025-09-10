# Parabel-Phantome 👻📈

**Kategorie:** Funktionen  
**Schwierigkeit:** 2 ⭐⭐  
**Status:** 📋 Geplant

## Mathematische Grundlagen

Quadratische Funktionen der Form **f(x) = ax² + bx + c** und ihre graphischen Eigenschaften.

### Kernkonzepte
- **Scheitelpunkt:** S(xs, ys) mit xs = -b/(2a)
- **Nullstellen:** f(x) = 0 lösen
- **y-Achsenabschnitt:** f(0) = c
- **Öffnungsrichtung:** a > 0 (nach oben), a < 0 (nach unten)
- **Scheitelpunktform:** f(x) = a(x - xs)² + ys

## Aufgabentypen

### Level 1: Scheitelpunkt bestimmen
- `f(x) = x² + 4x + 3` → `S(-2, -1)`
- `f(x) = 2x² - 8x + 5` → `S(2, -3)`
- `f(x) = -x² + 6x - 8` → `S(3, 1)`

### Level 2: Nullstellen berechnen
- `f(x) = x² - 5x + 6` → `x₁ = 2, x₂ = 3`
- `f(x) = 2x² + 3x - 2` → `x₁ = 0.5, x₂ = -2`
- `f(x) = x² + 2x + 5` → `Keine Nullstellen`

### Level 3: Scheitelpunktform umwandeln
- `f(x) = x² + 6x + 11` → `f(x) = (x + 3)² + 2`
- `f(x) = 2x² - 4x + 7` → `f(x) = 2(x - 1)² + 5`
- `f(x) = -x² + 8x - 12` → `f(x) = -(x - 4)² + 4`

### Level 4: Funktionsgleichung aus Eigenschaften
- `S(2, 3), durch P(0, 7)` → `f(x) = (x - 2)² + 3`
- `Nullstellen bei x = 1 und x = 5, a = 2` → `f(x) = 2(x - 3)² - 8`

## Schwierigkeitsgrade

### Stufe 1: Einfache Parabeln (a = 1)
- Ganzzahlige Koeffizienten
- Scheitelpunkt mit ganzzahligen Koordinaten
- b, c ∈ [-10, 10]

### Stufe 2: Gestreckte/Gestauchte Parabeln
- a ∈ {0.5, 2, 3, -1, -2}
- Irrationale Scheitelpunkte möglich
- Komplexere Nullstellenberechnung

### Stufe 3: Allgemeine Parabeln
- a ∈ [-5, 5] \ {0}
- Bruchzahlige Koeffizienten
- Gemischte Aufgabentypen

### Stufe 4: Anwendungsaufgaben
- Wurfparabeln, Brückenbogen
- Optimierungsprobleme
- Parameterabhängige Funktionen

## Implementierungshinweise

### Formel-Generierung
```javascript
generateQuadraticFunction(difficulty) {
    const taskTypes = ['vertex', 'zeros', 'vertex-form', 'from-properties'];
    const selectedType = weightedRandom(taskTypes, difficulty);
    
    switch(selectedType) {
        case 'vertex':
            return generateVertexTask(difficulty);
        case 'zeros':
            return generateZerosTask(difficulty);
        case 'vertex-form':
            return generateVertexFormTask(difficulty);
        case 'from-properties':
            return generateFromPropertiesTask(difficulty);
    }
}
```

### Validierungslogik
```javascript
validateParabolaAnswer(task, userAnswer) {
    switch(task.type) {
        case 'vertex':
            return validateVertex(task.function, userAnswer);
        case 'zeros':
            return validateZeros(task.function, userAnswer);
        case 'vertex-form':
            return validateVertexForm(task.function, userAnswer);
        case 'from-properties':
            return validateFunction(task.properties, userAnswer);
    }
}
```

### Eingabe-Parsing
- **Scheitelpunkt:** `S(2, 3)` oder `(2|3)` oder `2; 3`
- **Nullstellen:** `x₁=1, x₂=3` oder `1; 3` oder `x=1 oder x=3`
- **Funktionsgleichung:** `f(x)=2x²+3x-1` oder `y=2x^2+3x-1`
- **Scheitelpunktform:** `f(x)=(x-2)²+3` oder `y=(x-2)^2+3`

## Gegner-Design

### Visuelle Eigenschaften
- **Farbe:** Durchscheinend violett-blau (geisterhaft)
- **Form:** Parabelförmige Silhouetten, die sich wellenförmig bewegen
- **Animation:** Schweben, Phasen zwischen sichtbar/unsichtbar
- **Größe:** Variabel je nach Funktionsparameter a

### Spezial-Effekte
- **Spawn-Animation:** Materialisierung entlang einer Parabelbahn
- **Bewegung:** Folgt parabelförmigen Pfaden
- **Angriff:** Schießt parabelförmige Projektile
- **Tod:** Zerfällt in Koordinatenpunkte

### Gameplay-Eigenschaften
- **Geschwindigkeit:** Mittel, aber unvorhersagbare Bewegung
- **Lebenspunkte:** 1
- **Spawn-Rate:** Mittel
- **Besonderheit:** Kann durch Wände "phasen" (Geist-Eigenschaft)

## Balancing

### Zeitlimits
- **Tag-Modus:** 20-40 Sekunden
- **Nacht-Modus:** 30-50 Sekunden
- **Bonus-Zeit:** +15s bei Anwendungsaufgaben

### Schadenswerte
- **Korrekte Antwort:** Gegner eliminiert
- **Falsche Antwort:** -1 HP, Phantom wird aggressiver
- **Zeitüberschreitung:** -1 HP, Phantom teilt sich in 2 kleinere

### Belohnungen
- **XP:** 20-40 (je nach Aufgabentyp)
- **Münzen:** 12-25
- **Combo-Multiplikator:** 1.2x
- **Spezial-Drop:** 3% Chance auf "Parabel-Kristall"

## Audio-Design

### Sound-Effekte
- **Spawn:** Ätherisches Wispern + Windgeräusch
- **Bewegung:** Subtiles Schweben-Geräusch
- **Angriff:** Pfeifender Projektil-Sound
- **Korrekte Lösung:** Harmonischer Akkord + Auflösung
- **Falsche Lösung:** Dissonantes Echo
