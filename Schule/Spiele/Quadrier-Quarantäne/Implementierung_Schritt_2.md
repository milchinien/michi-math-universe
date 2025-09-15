# Implementierung Schritt 2: Gleichungs-Engine Basis

## Ziel
Implementiere eine einfache Gleichungs-Engine, die Wurzelgleichungen generiert und grundlegende Validierung durchführt.

## Phase 2.1: Gleichungsgenerator

- [ ] EquationEngine-Klasse mit Constructor erstellen
- [ ] Methode generateSimpleRootEquation() für √(ax + b) = c implementieren
- [ ] Parameter-Randomisierung für a, b, c (ganzzahlige Werte)
- [ ] Sicherstellen, dass generierte Gleichungen lösbar sind
- [ ] Array mit 5 vorgenerierte Testgleichungen erstellen

## Phase 2.2: Mathematische Validierung

- [ ] Funktion validateSolution(x, equation) implementieren
- [ ] Definitionsbereich-Prüfung für Radikand ≥ 0 
- [ ] Probe durch Einsetzen in Originalgleichung
- [ ] Rückgabe von Validierungsstatus (true/false + Fehlermeldung)
- [ ] Unit-Tests für bekannte Lösungen erstellen

## Phase 2.3: Scheinlösungen-System

- [ ] Methode generateEquationWithSpuriousSolution() erstellen
- [ ] Systematisches Einbauen von Scheinlösungen beim Quadrieren
- [ ] Markierung von echten vs. Scheinlösungen in Datenstruktur
- [ ] Testfall: √(x-1) = x-3 (hat Scheinlösung x=5, echte Lösung x=10)

## Phase 2.4: UI-Integration

- [ ] Aktuelle Gleichung in KaTeX-div anzeigen
- [ ] Input-Feld für Lösungseingabe hinzufügen
- [ ] Button "Lösung prüfen" mit Event-Handler
- [ ] Feedback-div für Validierungsergebnis (grün/rot)
- [ ] Button "Neue Gleichung" für Generator-Test

## Phase 2.5: Interaktive Tests

- [ ] Mindestens 3 verschiedene Gleichungstypen testen
- [ ] Sowohl echte als auch Scheinlösungen eingeben können
- [ ] Benutzerfreundliche Fehlermeldungen anzeigen
- [ ] Erfolgreiche Lösungen visuell hervorheben

## Erfolgskriterien

- [ ] Generator erstellt mathematisch korrekte Wurzelgleichungen
- [ ] Validierung erkennt echte und Scheinlösungen zuverlässig
- [ ] UI zeigt Gleichungen schön formatiert an
- [ ] Benutzer kann Lösungen eingeben und Feedback erhalten
- [ ] Mindestens 5 verschiedene Gleichungen funktionieren fehlerfrei

## Erwartete Arbeitszeit
**3-4 Stunden**

## Nächster Schritt
Nach Abschluss → `Implementierung_Schritt_3.md` (Erster Boss - Mirror Chief)
