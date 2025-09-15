# Implementierung Schritt 6: Zweiter Boss - Stacker

## Ziel
Implementiere den "Stacker" Boss mit multiplen Wurzeln und komplexerer Isolations-Mechanik.

## Phase 6.1: Stacker-Boss-System

- [ ] Stacker-Klasse als Erweiterung des Boss-Systems erstellen
- [ ] Erhöhte Lebenspunkte (150 HP) für schwierigeren Boss
- [ ] Spezielle Eigenschaften: multipleRoots, isolationOrder
- [ ] Boss-spezifische Angriffsmuster und Animationen
- [ ] Neue Canvas-Darstellung mit "gestapelten" visuellen Elementen

## Phase 6.2: Multiple-Wurzel-Gleichungen

- [ ] Generator für Gleichungen mit 2+ Wurzeln implementieren
- [ ] Beispiel: √(x+1) + √(x-3) = 4
- [ ] Automatische Generierung verschiedener Kombinationen
- [ ] Sicherstellen dass Gleichungen lösbar bleiben
- [ ] Komplexitätsstufen (2, 3, oder 4 Wurzeln)

## Phase 6.3: Isolations-Reihenfolge-System

- [ ] IsolationTracker-Klasse für Reihenfolge-Verfolgung erstellen
- [ ] UI-Buttons für "Isoliere √(term)" für jede Wurzel
- [ ] Spieler muss richtige Reihenfolge wählen
- [ ] Falsche Reihenfolge erzeugt zusätzliche Scheinlösungen
- [ ] Optimale vs. suboptimale Pfade unterscheiden

## Phase 6.4: Schichteffekt-Visualisierung

- [ ] Boss-Sprite mit mehreren überlagernden Schichten
- [ ] Jede Schicht repräsentiert eine Wurzel in der Gleichung
- [ ] Richtige Isolation entfernt eine Schicht visuell
- [ ] Falsche Isolation verdoppelt eine Schicht (Fake-Multiplikation)
- [ ] Partikeleffekt beim "Entstapeln" von Schichten

## Phase 6.5: Erweiterte Kampf-Mechanik

- [ ] Mehrstufiger Kampf: Jede Wurzel muss einzeln isoliert werden
- [ ] Zwischenschritte zeigen partielle Gleichungsformen
- [ ] Boss wird schwächer wenn korrekte Isolation erfolgt
- [ ] Erhöhter Schaden (30 HP) bei optimaler Reihenfolge
- [ ] Bestrafung (-15 HP) bei unnötigen Komplizierungen

## Phase 6.6: Isolations-Kompass Werkzeug

- [ ] Neues Werkzeug: Isolations-Kompass hinzufügen
- [ ] Kompass zeigt empfohlene Reihenfolge für Isolation
- [ ] Hover-Effekt über Wurzeln zeigt Schwierigkeitsgrad
- [ ] Farbkodierung: Grün (einfach), Orange (mittel), Rot (schwer)
- [ ] Tutorial für optimale Isolations-Strategien

## Phase 6.7: Adaptives Schwierigkeits-System

- [ ] Boss passt Gleichungskomplexität an Spielerleistung an
- [ ] Bei mehreren Fehlern: Reduzierung auf 2 Wurzeln
- [ ] Bei guter Leistung: Steigerung auf 3-4 Wurzeln
- [ ] Lernkurven-Tracking für kontinuierliche Anpassung
- [ ] Belohnungssystem für besonders elegante Lösungen

## Phase 6.8: Stacker-spezifisches Feedback

- [ ] Boss-Kommentare zur gewählten Isolations-Strategie
- [ ] Reflexions-Screen erklärt optimale vs. suboptimale Wege
- [ ] Visualisierung der "Komplexitäts-Explosion" bei falscher Reihenfolge
- [ ] Tipps für systematische Herangehensweise an Multiple-Wurzel-Probleme

## Erfolgskriterien

- [ ] Stacker generiert sinnvolle Multiple-Wurzel-Gleichungen
- [ ] Isolations-Reihenfolge-System funktioniert korrekt
- [ ] Schichteffekt-Visualisierung ist verständlich und ansprechend
- [ ] Boss-Kampf ist herausfordernder aber fair lösbar
- [ ] Isolations-Kompass bietet sinnvolle Hilfestellung

## Erwartete Arbeitszeit
**4-5 Stunden**

## Nächster Schritt
Nach Abschluss → `Implementierung_Schritt_7.md` (Dritter Boss - Fraction Fiend)
