# Implementierung Schritt 3: Erster Boss - Mirror Chief

## Ziel
Implementiere den ersten Boss "Mirror Chief" mit einfacher Canvas-Animation und Boss-spezifischen Gleichungen.

## Phase 3.1: Boss-System Grundlage

- [ ] BossManager-Klasse mit Constructor erstellen
- [ ] Boss-Datenstruktur (name, health, maxHealth, type, isDefeated)
- [ ] Methode createMirrorChief() mit spezifischen Eigenschaften
- [ ] Boss-Lebenspunkte-System (Start: 100 HP)
- [ ] Boss-Status-Verfolgung (alive, damaged, defeated)

## Phase 3.2: Mirror Chief Mechanik

- [ ] Spezielle Gleichungen mit Vorzeichen-Fallen generieren
- [ ] Beispiel: √(-2x + 8) = 4 (Falle: vergessenes Minuszeichen)
- [ ] Automatische Scheinlösungs-Generierung bei Vorzeichenfehlern
- [ ] Boss-spezifische Validierung für Vorzeichen-Checks
- [ ] Schadenssystem: 20 HP pro korrekte Lösung, -10 HP bei Scheinlösung

## Phase 3.3: Canvas-Animation Basis

- [ ] Boss-Sprite als einfaches geometrisches Shape (Kreis + Spiegeleffekt)
- [ ] Grundlegende Zeichenfunktion drawMirrorChief(ctx, boss)
- [ ] Animationsloop mit requestAnimationFrame
- [ ] Boss-Position und Größe entsprechend Lebenspunkten
- [ ] Farbwechsel basierend auf Boss-Status (gesund → verletzt → besiegt)

## Phase 3.4: Spiegeleffekt-Visualisierung

- [ ] Canvas-Transformationen für Spiegeleffekt implementieren
- [ ] Boss "flackert" wenn falsche Vorzeichen erkannt werden
- [ ] Partikeleffekt bei erfolgreichen Treffern (einfache Punkte)
- [ ] Bildschirm "wackelt" kurz bei Boss-Angriffen (CSS-Animation)

## Phase 3.5: Kampf-Integration

- [ ] Kampfmodus aktivieren wenn Boss ausgewählt wird
- [ ] Boss-spezifische Gleichungen werden bevorzugt generiert
- [ ] Lebenspunkte-Anzeige über Boss-Sprite
- [ ] Sieg-Bedingung: Boss HP = 0
- [ ] Niederlage-Bedingung: 3 Scheinlösungen hintereinander

## Phase 3.6: Boss-Feedback-System

- [ ] Boss "reagiert" auf korrekte/falsche Lösungen mit Animationen
- [ ] Erfolgreiche Treffer zeigen Schadenszahlen (-20 HP)
- [ ] Boss-spezifische Nachrichten ("Deine Vorzeichen sind schwach!")
- [ ] Sieg-Screen mit Boss-besiegt Animation

## Erfolgskriterien

- [ ] Mirror Chief erscheint als animierter Boss auf Canvas
- [ ] Boss-spezifische Gleichungen mit Vorzeichen-Fallen funktionieren
- [ ] Kampfsystem mit HP-Verlust/Gewinn ist implementiert
- [ ] Visuelle Feedback-Effekte für Treffer/Fehler sind sichtbar
- [ ] Boss kann besiegt werden und Sieg-Screen erscheint

## Erwartete Arbeitszeit
**4-5 Stunden**

## Nächster Schritt
Nach Abschluss → `Implementierung_Schritt_4.md` (Werkzeug-System - Definitions-Lampe)
