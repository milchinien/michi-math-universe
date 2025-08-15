# Asymptoten-Raserei – Entwicklungs-Historie (chronologisch)

Dieses Dokument fasst die wichtigsten Änderungen und Entscheidungen im Projekt "Asymptoten-Raserei" in zeitlicher Reihenfolge zusammen.

## Phase 1 – Initiale Umsetzung
- __Projektstruktur__: Einfache Single-File-App `Asymptoten-Raserei.html` mit eingebettetem CSS/JS, Canvas-Rendering.
- __Grundfunktionen__:
  - Rendering von Koordinatengitter, Funktionsgraph, Polstellen, Asymptoten, Definitionslücken.
  - `MathEngine` zur sicheren Funktionsauswertung (`safeEvaluate`) und Erkennung von Pol-/Asymptoten-Nähe.
  - `Player` als Punkt mit Bewegung, anfänglichem Sprungsystem, Lebenspunkten, Score.
  - Levelsystem (1–5) mit fest vorgegebenen gebrochenrationalen Funktionen.
  - UI (Score, Level, Lives, GameOver/LevelComplete), Neon/Cyberpunk-Optik.

## Phase 2 – Bewegungs- und Schwierigkeitsanpassungen
- __Automatische Vorwärtsbewegung__: Spieler fährt automatisch nach rechts; manuelle Modulation via ←/→ (Bremsen/Beschleunigen).
- __Levelbasierte Geschwindigkeit__: `baseSpeed` steigt mit dem Level.
- __Score-Logik__: Punkte nur für aktive Aktionen (Boost an Asymptote, erfolgreicher Sprung), kein passiver Score-Tick.

## Phase 3 – Sprungmechanik (physikbasiert)
- __Erste Iteration__: Vy/Gravity-Ansatz, Schwerkraftrichtung korrigiert (negative Gravity zieht wieder auf die Kurve), längere Sprungdauer.
- __Spielbarkeit__: Jump-Buffer ("Coyote Time") eingeführt, Success-Fenster an Lücken verbreitert.
- __Air-Assist__: Vorwärts-Impuls beim Absprung + leichter Schub während Sprung, um die andere Kurvenseite zu erreichen.

## Phase 4 – Stabilität und Feedback
- __Partikel-Effekte__: Für Boosts und Sprünge hinzugefügt.
- __Kollisionslogik__: Kollisionen mit Polstellen, Asymptoten (Boost), Definitionslücken (Erfolg/Fehlschlag) verfeinert.

## Phase 5 – Sprungsystem komplett überarbeitet (deterministischer Arc)
- __Bezier-Arc statt Physik__: 
  - `Player.startArcJump(targetX, targetY)`: definiert Start-/Ziel-/Kontrollpunkt.
  - `Player.update()`: steuert im Sprung x/y entlang eines quadratischen Bezier-Bogens (kein `x += vx` in der Luft).
  - Sanfter Snap auf die Kurve am Ende des Sprungs.
- __Zielberechnung__:
  - `Game.computeJumpTargetX()`: findet Hindernisse (Pol/Lücke) rechts und setzt Landepunkt leicht dahinter.
  - `Game.startJump()`: bestimmt `targetY` robust (Fallbacks, Suche bei `null`).
- __Bedienung__: Space triggert `startJump()`; Luft-Schub entfernt (nicht mehr nötig).
- __Sicherheit__: Pol-Kollision während Sprung deaktiviert.

## Phase 6 – Levelwechsel-/Restart-Robustheit
- __Reset bei Levelstart/Respawn__: 
  - Sprung-/Boost-/Arc-Status vollständig zurücksetzen, Trails leeren, Inputs/Coyote-Buffer löschen.
  - __LevelStartCooldown__: kurzer Start-Cooldown (30 Frames), damit Level nicht sofort auto-komplettiert.
- __Lives-Korrektur__: `lives` wieder auf 3 gesetzt (versehentlich auf 7 geraten).

## Phase 7 – Level 3 Rework: Teleporter an der Definitionslücke
- __Teleporter-Mechanik__: 
  - `Game.tryTeleportAtDiscontinuity(prevX)`: Teleport, wenn Spieler nahe an der Lücke ist oder die Lücke zwischen Frames überquert (Crossing-Check mit `prevX`).
  - Landepunkt: rechts der Lücke (`disc + 0.7`), bei `null` Suche nach erstem gültigen x.
  - `teleportCooldown` (18 Frames) verhindert Mehrfach-Trigger.
- __Kollisionsanpassung__: In Level 3 keine `discontinuity_fail`-Strafe; Teleporter übernimmt, Sprung gibt Bonus.
- __Visuals__: `Renderer.drawTeleporterMarkers()` zeichnet leuchtende Ringe um die Lücke (nur in L3).
- __Tempo-Tuning__: L3 etwas langsamer (`baseSpeed *= 0.8`) zum Üben von Teleport/Sprung.
- __UI-Hinweis__: Leveltext erläutert Teleporter und Bonus beim Springen.

## Phase 8 – Erweiterung auf 10 Level mit einzigartigen Mechaniken
- __Level 6: Zeitverzögerung__: 
  - Funktion: `f(x) = (x³-2x)/(x²-4)`
  - Mechanik: Zeitlupe in grünen Zonen bei x = -1 und x = 1
  - Visualisierung: Pulsierende grüne Kreise mit `drawTimeWarpZones()`
- __Level 7: Gravitationswechsel__:
  - Funktion: `f(x) = 1/(x²-1)`
  - Mechanik: Schwerkraft ändert sich je nach x-Position
  - Visualisierung: Gravitationslinien mit `drawGravityZones()`
- __Level 8: Multi-Path__:
  - Funktion: `f(x) = (x²-1)/(x-1)` (mit hebbarer Lücke)
  - Mechanik: Zwei Pfade zur Auswahl, Tasten 1/2 für Pfad-Wechsel
  - Visualisierung: Farbige Pfad-Markierungen mit `drawMultiPath()`
- __Level 9: Inverser Boost__:
  - Funktion: `f(x) = (x³+1)/(x²-1)`
  - Mechanik: Asymptoten verlangsamen statt beschleunigen
  - Implementierung: `inverseBoost: true` in der Funktionsdefinition
- __Level 10: Chaos-Modus__:
  - Funktion: `f(x) = (x⁴-5x²+4)/(x³-2x²-x+2)`
  - Mechanik: Alle 2 Sekunden zufällige Effekte (Zeitlupe, Gravitationswechsel, Farbwechsel, Größenänderung)
  - Visualisierung: Dynamische Spieler-Eigenschaften und Partikel-Effekte

## Phase 9 – Spawn-Positions-Anpassung für schwierigere Level
- __Levelabhängige Spawn-Positionen__:
  - Level 1-3: Spawn bei x = -5 (Standard)
  - Level 4-6: Spawn bei x = -12 (viel weiter links für mittlere Schwierigkeit)
  - Level 7-9: Spawn bei x = -18 (noch weiter links für hohe Schwierigkeit)
  - Level 10: Spawn bei x = -25 (am weitesten links für Chaos-Modus)
- __Konsistente Respawn-Logik__: Bei Verlust eines Lebens respawnt der Spieler an der levelabhängigen Position
- __Hilfsfunktion `getSpawnPosition(level)`__: Zentrale Verwaltung der Spawn-Positionen für bessere Wartbarkeit
- __Verbesserte Spielerfahrung__: Deutlich mehr Zeit zum Einarbeiten in komplexe Level-Mechaniken
- __Reaktionszeit-Verbesserung__: Spieler haben jetzt genug Zeit, um Hindernisse zu erkennen und zu planen

## Aktueller Stand (heute)
- __10 Level__ mit einzigartigen Mechaniken und steigender Komplexität
- __Automatikfahrt__ mit levelabhängiger Geschwindigkeit
- __Manueller Sprung__ via Space, deterministischer Arc mit sicherer Landung
- __Asymptoten-Boost__ (normal oder invers in Level 9)
- __Level 3__: Teleporter an der Lücke
- __Level 6__: Zeitlupe in grünen Zonen
- __Level 7__: Gravitationswechsel je nach Position
- __Level 8__: Multi-Path mit Pfad-Wechsel (Tasten 1/2)
- __Level 9__: Inverser Boost (Asymptoten verlangsamen)
- __Level 10__: Chaos-Modus mit zufälligen Effekten
- __Robustheit__: Levelstart-Cooldown, Resets, polkollisionssicher während Sprung

## Parameter, die häufig getuned wurden
- `Player.jumpDuration` (aktuell 50)
- Arc-Höhe im `startArcJump()` (Kontrollpunkt-Offset)
- Ziel-Offset an Lücken/Polen (`+0.6`/`+0.7`)
- Erkennungsfenster an Lücken (typisch `0.35`)
- `levelStartCooldown` (typ. 30 Frames)
- `teleportCooldown` (18 Frames)
- Chaos-Effekt-Timer (120 Frames = 2 Sekunden)

## Geplante/Nächste Ideen
- Visuelle Jump-Timing-Hilfe („Jetzt springen" in Nähe der Lücke)
- Sounds (Sprung, Boost, Kollisionen, Level-spezifische Effekte)
- Touch-Steuerung für Mobile
- Performance-Optimierung für komplexere Funktionen
- Achievements/Mehrspieler-Optionen
- Level-Editor für eigene Funktionen
- Speichersystem für Highscores

---

Änderungen wurden hauptsächlich in `Schule/Spiele/Asymptoten-Raserei.html` umgesetzt. Das Dokument wird fortlaufend erweitert, wenn weitere Features dazukommen oder getuned werden.
