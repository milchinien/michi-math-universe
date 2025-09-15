# Implementierung Schritt 5: Probe-Siegel Werkzeug

## Ziel
Implementiere das "Probe-Siegel" für automatische Lösungsvalidierung mit visueller Rückmeldung.

## Phase 5.1: Probe-Siegel Grundfunktion

- [ ] ProbeValidator-Klasse für detaillierte Lösungsprüfung
- [ ] Methode performFullProbe(solution, equation) implementieren
- [ ] Schritt-für-Schritt Validierung dokumentieren
- [ ] Rückgabe-Objekt mit Status, Schritten und Fehlern
- [ ] Integration in ToolSystem als zweites Werkzeug

## Phase 5.2: Detaillierte Validierungsschritte

- [ ] Schritt 1: Definitionsbereich-Check (ax + b ≥ 0)
- [ ] Schritt 2: Einsetzen der Lösung in Originalgleichung
- [ ] Schritt 3: Berechnung beider Seiten der Gleichung
- [ ] Schritt 4: Vergleich und Gleichheitsprüfung
- [ ] Schritt 5: Klassifizierung als echte Lösung oder Scheinlösung

## Phase 5.3: Visuelle Probe-Darstellung

- [ ] Probe-Panel als ausklappbares UI-Element erstellen
- [ ] Jeder Validierungsschritt als eigene Zeile mit Status-Icon
- [ ] Grüne Häkchen für erfolgreiche Schritte
- [ ] Rote X-Markierungen für fehlgeschlagene Schritte
- [ ] Mathematische Darstellung der Zwischenschritte mit KaTeX

## Phase 5.4: Scheinlösungs-Erkennung

- [ ] Spezielle Behandlung von Scheinlösungen implementieren
- [ ] Detaillierte Erklärung wo/warum Scheinlösung entsteht
- [ ] Orange Warnfarbe für Scheinlösungs-Schritte
- [ ] Bildungshinweis: "Beim Quadrieren können Scheinlösungen entstehen"
- [ ] Vergleich Original vs. quadrierte Gleichung

## Phase 5.5: Interaktive Probe-Features

- [ ] "Probe durchführen" Button aktiviert Schritt-für-Schritt Anzeige
- [ ] Animation der Probe-Schritte (nacheinander einblenden)
- [ ] Click auf Probe-Schritt zeigt detaillierte Erklärung
- [ ] "Probe überspringen" Option für fortgeschrittene Nutzer
- [ ] Export/Protokoll der Probe-Schritte für Lernzwecke

## Phase 5.6: Integration und Feedback

- [ ] Probe-Siegel funktioniert mit allen Gleichungstypen
- [ ] Automatische Probe-Aktivierung bei Boss-Kämpfen
- [ ] Probe-Ergebnis beeinflusst Boss-Schadenssystem
- [ ] Lernstatistiken: Häufigkeit korrekter Proben tracken
- [ ] Adaptive Hilfestellung basierend auf Probe-Fehlern

## Phase 5.7: Bildungsintegration

- [ ] Reflexions-Popup nach fehlgeschlagener Probe
- [ ] Häufige Probe-Fehler und deren Vermeidung erklären
- [ ] Quiz-Fragen zur Probe-Validierung
- [ ] Tipps für systematisches Probe-Durchführen

## Erfolgskriterien

- [ ] Probe-Siegel führt mathematisch korrekte Validierung durch
- [ ] Visuelle Darstellung ist verständlich und lehrreich
- [ ] Scheinlösungen werden korrekt erkannt und erklärt
- [ ] Tool integriert nahtlos in bestehende Kampf-Mechanik
- [ ] Benutzer verstehen Probe-Prozess durch Tool besser

## Erwartete Arbeitszeit
**3-4 Stunden**

## Nächster Schritt
Nach Abschluss → `Implementierung_Schritt_6.md` (Zweiter Boss - Stacker)
