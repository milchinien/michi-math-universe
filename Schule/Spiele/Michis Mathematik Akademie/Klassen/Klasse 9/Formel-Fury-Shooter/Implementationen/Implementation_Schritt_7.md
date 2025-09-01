# Phase 3.1: Erweiterte Formel-Typen

## Ziel
Erweitere das Formel-System um verschiedene binomische Formel-Typen und Schwierigkeitsgrade.

## Implementierung

- [x] Erweiterte Formel-Generierung implementieren:
  - [x] (a+b)² = a² + 2ab + b²
  - [x] (a-b)² = a² - 2ab + b²
  - [x] (a+b)(a-b) = a² - b²
- [x] Faktorisierungs-Formeln hinzufügen (a² - b² = (a+b)(a-b))
- [x] Schwierigkeits-Level-System implementieren
- [x] Verschiedene Variable (x, y, Zahlen) verwenden
- [x] Komplexere Koeffizienten (2x+3, 3y-1, etc.)
- [x] Formel-Typ-Anzeige für besseres Verständnis

## ✅ Implementiert (Vollständig)

### Formel-Typen System
- **5 Verschiedene Formel-Typen** mit progressivem Freischalten:
  1. **Erste Binomische Formel** - `(a+b)² → a² + 2ab + b²`
  2. **Zweite Binomische Formel** - `(a-b)² → a² - 2ab + b²`
  3. **Dritte Binomische Formel** - `(a+b)(a-b) → a² - b²`
  4. **Faktorisierung (Differenz)** - `a² - b² → (a+b)(a-b)`
  5. **Faktorisierung (Quadrat)** - `a² + 2ab + b² → (a+b)²`

### Progressives Freischalt-System
- **Level 1** (Start): Erste Binomische Formel
- **Level 2** (Score ≥500 oder Combo ≥3): + Zweite Binomische Formel
- **Level 3** (Score ≥1000 oder Combo ≥5): + Dritte Binomische Formel
- **Level 4** (Score ≥1500 oder Combo ≥8): + Faktorisierung (Differenz)
- **Level 5** (Score ≥2000 oder Combo ≥10): + Faktorisierung (Quadrat)

### Erweiterte Schwierigkeit
- **Progressive Koeffizienten**: 1-3 → 1-5 → 1-7 basierend auf Score
- **Progressive Konstanten**: 1-4 → 1-6 → 1-10 basierend auf Score
- **Erweiterte Schwierigkeitsskala**: 1-5 Sterne (vorher 1-3)
- **Typ-spezifische Boni**: Faktorisierung = +1.0-1.5 Schwierigkeit

### Variable Vielfalt
- **6 Verschiedene Variablen**: x, y, z, a, b, c
- **Intelligente Koeffizienten**: Automatische Vereinfachung (1x → x)
- **Flexible Notation**: Unterstützt sowohl x² als auch x^2
- **Verschiedene Terme**: 2x, 3y, 4z, etc.

### Erweiterte Validierung
- **Typ-spezifische Validierung**: Jeder Formel-Typ hat eigene Validierungslogik
- **Flexible Eingabe-Formate**: Verschiedene Schreibweisen werden akzeptiert
- **Intelligente Normalisierung**: Entfernt Leerzeichen, standardisiert Notation
- **Umfassende Pattern-Erkennung**: Erkennt auch umgestellte Terme

### UI-Verbesserungen
- **Formel-Typ-Anzeige**: Zeigt Namen des Formel-Typs (z.B. "Erste Binomische Formel")
- **Schwierigkeits-Sterne**: Visuelle Darstellung der Schwierigkeit ⭐⭐⭐
- **Erweiterte Formel-Darstellung**: Mehrzeilige, strukturierte Anzeige
- **Typ-Kategorisierung**: Klare Unterscheidung zwischen Expansion und Faktorisierung

### Technische Features
- **Modulare Generierung**: Separate Generator-Methoden für jeden Typ
- **Robuste Validierung**: Mehrschichtige Validierung mit Fallback-Methoden
- **Pattern-Matching**: Intelligente Erkennung verschiedener Eingabe-Formate
- **Performance-Optimiert**: Effiziente Algorithmen für komplexe Validierung

### Pädagogische Verbesserungen
- **Schrittweise Komplexität**: Spieler lernen zunächst einfache, dann komplexe Formeln
- **Konzeptuelle Vielfalt**: Sowohl Expansion als auch Faktorisierung
- **Visuelle Klarheit**: Typ-Namen helfen beim Verständnis der Konzepte
- **Skill-basierte Progression**: Neue Formel-Typen als Belohnung für Fortschritt

## Erwartetes Ergebnis
✅ **ERREICHT**: Vielfältige binomische Formeln verschiedener Schwierigkeitsgrade werden generiert und korrekt validiert.

## Technische Details
✅ **IMPLEMENTIERT**:
- Erweiterte FormulaGenerator-Logik mit 5 Typen
- Umfassende Validierung für alle Formel-Typen
- Progressives Schwierigkeits-System (Score/Combo-basiert)
- Flexible Antwort-Format-Unterstützung

## Builds auf
- Phase 2.3 (Score-System)

### Beispiele der neuen Formeln:

**Erste Binomische**: `(3x + 2)² = 9x² + 12x + 4`
**Zweite Binomische**: `(2y - 3)² = 4y² - 12y + 9`
**Dritte Binomische**: `(4a + 1)(4a - 1) = 16a² - 1`
**Faktorisierung (Diff)**: `25z² - 4 = (5z + 2)(5z - 2)`
**Faktorisierung (Quadrat)**: `9b² + 6b + 1 = (3b + 1)²`

