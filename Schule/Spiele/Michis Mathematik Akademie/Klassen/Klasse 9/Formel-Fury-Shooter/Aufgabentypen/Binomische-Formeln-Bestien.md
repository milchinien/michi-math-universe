# Binomische Formeln-Bestien 🧮👹

**Kategorie:** Algebra  
**Schwierigkeit:** 1 ⭐  
**Status:** ✅ Implementiert

## Mathematische Grundlagen

Die binomischen Formeln sind fundamentale algebraische Identitäten:
- **(a + b)² = a² + 2ab + b²** (Erste binomische Formel)
- **(a - b)² = a² - 2ab + b²** (Zweite binomische Formel)  
- **(a + b)(a - b) = a² - b²** (Dritte binomische Formel)

## Aufgabentypen

### Ausmultiplizieren (Expansion)
- `(2x + 3)²` → `4x² + 12x + 9`
- `(5y - 2)²` → `25y² - 20y + 4`
- `(3a + 4b)(3a - 4b)` → `9a² - 16b²`

### Faktorisierung
- `x² + 6x + 9` → `(x + 3)²`
- `4y² - 12y + 9` → `(2y - 3)²`
- `25a² - 16b²` → `(5a + 4b)(5a - 4b)`

## Schwierigkeitsgrade

### Level 1: Einfache Zahlen
- Koeffizienten: 1-5
- Beispiel: `(x + 2)²`, `(3y - 1)²`

### Level 2: Mittlere Komplexität
- Koeffizienten: 1-10
- Beispiel: `(2x + 7)²`, `(4a - 5b)²`

### Level 3: Hohe Komplexität
- Koeffizienten: 1-15, gemischte Terme
- Beispiel: `(3x + 8y)²`, `(7a - 4b)(7a + 4b)`

## Implementierungshinweise

### Formel-Generierung
```javascript
// Bereits implementiert in formula-system.js
generateBinomialFormula(difficulty) {
    // Zufällige Koeffizienten basierend auf Schwierigkeit
    // Zufällige Auswahl zwischen den drei Formeln
    // Zufällige Auswahl zwischen Expansion/Faktorisierung
}
```

### Validierungslogik
- Algebraische Äquivalenz-Prüfung
- Normalisierung der Eingabe
- Toleranz für verschiedene Schreibweisen

## Gegner-Design

### Visuelle Eigenschaften
- **Farbe:** Grün-bläulich (mathematisch, kühl)
- **Form:** Kristalline Strukturen mit Formel-Fragmenten
- **Animation:** Pulsieren entsprechend der Formel-Komplexität

### Gameplay-Eigenschaften
- **Geschwindigkeit:** Mittel
- **Lebenspunkte:** 1 (One-Hit-Kill bei korrekter Lösung)
- **Spawn-Rate:** Hoch (Basis-Gegner)

## Balancing

### Zeitlimits
- **Tag-Modus:** 15-30 Sekunden (Multiple Choice)
- **Nacht-Modus:** 20-45 Sekunden (Freie Eingabe)

### Schadenswerte
- **Korrekte Antwort:** Gegner eliminiert
- **Falsche Antwort:** -1 HP, Combo-Reset
- **Zeitüberschreitung:** -1 HP, Gegner flieht

### Belohnungen
- **XP:** 10-25 (je nach Schwierigkeit)
- **Münzen:** 5-15
- **Combo-Multiplikator:** 1.1x pro korrekter Antwort in Folge
