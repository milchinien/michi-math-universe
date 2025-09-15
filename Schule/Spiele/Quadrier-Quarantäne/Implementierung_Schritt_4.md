# Implementierung Schritt 4: Werkzeug-System - Definitions-Lampe

## Ziel
Implementiere das erste Werkzeug "Definitions-Lampe" zur visuellen Darstellung erlaubter x-Bereiche.

## Phase 4.1: ToolSystem-Grundlage

- [ ] ToolSystem-Klasse mit Constructor erstellen
- [ ] Werkzeug-Datenstruktur (name, type, isActive, cooldown)
- [ ] Werkzeugleiste-UI mit klickbaren Tool-Buttons
- [ ] Tool-Aktivierung/Deaktivierung über Button-Clicks
- [ ] Visueller Indikator für aktives Werkzeug (highlight)

## Phase 4.2: Definitions-Lampe Logik

- [ ] calculateDefinitionDomain(equation) Funktion implementieren
- [ ] Für √(ax + b): Bedingung ax + b ≥ 0 lösen
- [ ] Für multiple Wurzeln: Schnittmenge der Bereiche berechnen
- [ ] Intervall-Darstellung als [min, max] oder (-∞, max] etc.
- [ ] Edge-Cases behandeln (keine Lösung, alle reellen Zahlen)

## Phase 4.3: Visuelle Bereichsdarstellung

- [ ] Zahlenstrahl-Canvas unterhalb der Gleichung hinzufügen
- [ ] Zahlenstrahl mit Markierungen (-10 bis +10) zeichnen
- [ ] Erlaubten Bereich grün einfärben/hervorheben
- [ ] Verbotenen Bereich rot markieren oder ausgrauen
- [ ] Kritische Punkte (Grenzen) mit speziellen Markern

## Phase 4.4: Interaktive Features

- [ ] Hover-Effekt über Zahlenstrahl zeigt x-Wert an
- [ ] Click auf Zahlenstrahl setzt Wert in Eingabefeld
- [ ] Definitions-Lampe Button togglet Zahlenstrahl-Sichtbarkeit
- [ ] Animation beim Ein-/Ausblenden des Zahlenstrahls
- [ ] Tool-Tooltip erklärt Funktionalität

## Phase 4.5: Integration mit Gleichungs-System

- [ ] Automatische Neuberechnung bei neuer Gleichung
- [ ] Warnung wenn eingegebene Lösung außerhalb Definitionsbereich
- [ ] Spezielle Behandlung für Scheinlösungen (orange markieren)
- [ ] Tool funktioniert mit allen Boss-Gleichungstypen
- [ ] Performance-Optimierung für komplexere Gleichungen

## Phase 4.6: Benutzerführung

- [ ] Tutorial-Tooltip beim ersten Tool-Einsatz
- [ ] Beispiel-Gleichung zum Testen der Definitions-Lampe
- [ ] Help-Button mit Erklärung des Definitionsbereichs
- [ ] Fehlermeldung wenn Tool bei ungeeigneter Gleichung verwendet

## Erfolgskriterien

- [ ] Definitions-Lampe berechnet korrekte Definitionsbereiche
- [ ] Zahlenstrahl visualisiert erlaubte/verbotene Bereiche korrekt
- [ ] Tool-Integration funktioniert nahtlos mit bestehendem System
- [ ] Interaktive Features (Hover, Click) arbeiten zuverlässig
- [ ] Benutzer können Tool intuitiv verwenden

## Erwartete Arbeitszeit
**3-4 Stunden**

## Nächster Schritt
Nach Abschluss → `Implementierung_Schritt_5.md` (Probe-Siegel Werkzeug)
