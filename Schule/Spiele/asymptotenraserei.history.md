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

## Phase 10 – Pause-Funktionalität hinzugefügt
- __Pause-Button__: Taste **P** pausiert das Spiel
- __Pause-Menü__: Vollständiges Menü mit drei Optionen:
  - **Weiterspielen**: Spiel wird fortgesetzt
  - **Neustart**: Spiel wird von vorne gestartet
  - **Hauptmenü**: Spiel wird neu gestartet (äquivalent zu Neustart)
- __Pause-Logik__: 
  - `Game.togglePause()`: Wechselt zwischen Pause und Spiel
  - `Game.pauseGame()`: Pausiert das Spiel und zeigt das Menü
  - `Game.resumeGame()`: Setzt das Spiel fort
  - `Game.showMainMenu()`: Schließt Pause-Menü und startet neu
- __Update-Blockierung__: Bei Pause wird die `update()`-Funktion nicht ausgeführt
- __Cyberpunk-Design__: Pause-Menü im gleichen Stil wie der Rest des Spiels
- __Steuerungshinweise__: Pause-Taste in den Steuerungshinweisen dokumentiert

## Phase 11 – Dynamische Hintergrund-Effekte mit Retro-80s-Ästhetik
- __Levelabhängige Hintergründe__: Jedes Level hat eine eigene Hintergrundfarbe
  - Level 1-3: Gräuliche Töne (hell bis mittel)
  - Level 4-6: Dunklere Blautöne
  - Level 7-9: Intensive dunkle Töne
  - Level 10: Komplett schwarzer Hintergrund
- __Retro-80s-Effekte__: `BackgroundEffects`-Klasse für authentische Atmosphäre
  - **Scanlines**: Horizontale Linien wie bei alten CRT-Monitoren
  - **Farbige Partikel**: Magenta, Cyan, Gelb, Grün, Rot in Retro-Ästhetik
  - **Vignette-Effekt**: Wird mit dem Level intensiver (dunklerer Rand)
  - **Glitch-Effekte**: Ab Level 7 zufällige Glitch-Linien
  - **Matrix-Regen**: Level 10 zeigt fallende "01"-Zeichen
- __Dynamische Intensität__: Effekte werden mit steigendem Level intensiver
- __Smooth Transitions__: CSS-Übergänge für sanfte Hintergrund-Wechsel
- __Performance-optimiert__: Hintergrund-Effekte laufen auf separatem Canvas
- __Responsive Design__: Canvas passt sich automatisch der Fenstergröße an

## Phase 12 – Intensive rote/pinke Hintergrund-Effekte
- __Rot/Pink/Rosa/Lila Farbspektrum__: Komplett neue Farbpalette für intensive Atmosphäre
  - **Hintergrund-Gradienten**: Von gräulich-rot (Level 1) zu komplett schwarz (Level 10)
  - **Partikel-Farben**: Magenta, Deep Pink, Hot Pink, Rose, Rot, Lila, Medium Violet Red
- __Steigende Intensität pro Level__: Alle Effekte werden mit jedem Level intensiver
  - **Scanlines**: Dickere Linien (1px + 0.2px pro Level) in Magenta
  - **Partikel**: Größer (1.5-4.5px), schneller (0.8 Geschwindigkeit), intensivere Transparenz
  - **Vignette**: Rosa Schimmer in der Mitte, lila Übergang, schwarzer Rand
- __Frühere und intensivere Glitch-Effekte__:
  - **Glitch-Linien**: Ab Level 5 (statt Level 7), dickere Linien, höhere Wahrscheinlichkeit
  - **Glitch-Blöcke**: Ab Level 7 zusätzliche rosa Rechtecke für mehr Chaos
- __Matrix-Regen für Level 10**: Intensiver und roter
  - **Magenta-Zeichen**: Statt grüner "01"-Zeichen
  - **Verschiedene Symbole**: 01, 10, 11, 00, XX, //, \\ für mehr Variation
  - **Intensive Glitch-Partikel**: Rote Kreise für maximalen visuellen Impact
- __Performance-Optimierung**: Mehr Basis-Partikel (80 statt 50) für intensivere Atmosphäre

## Phase 13 – Perfect Timing System mit epischen Effekten
- __Perfect Timing Mechanik__: Schrumpfender Kreis markiert den perfekten Boost-Moment
  - **Aktivierung**: Zufällig alle 8-15 Sekunden (2% Wahrscheinlichkeit pro Frame)
  - **Kreis-Schrumpfung**: Startet bei 100px Radius, schrumpft auf 5px in 3 Sekunden
  - **Perfekter Treffer**: Spieler muss den Kreis berühren für massive Belohnungen
- __Epische Belohnungen bei Perfect Timing**:
  - **Score-Bonus**: +1000 Punkte (massiver Boost)
  - **Spieler-Boost**: 2 Sekunden lang erhöhte Geschwindigkeit
  - **Cooldown**: 5 Sekunden Pause zwischen Perfect Timing Events
- __Bildschirm-Aufleuchtung mit verschiedenen Effekten**:
  - **Kreis-Flash**: Magenta-Kreis mit Glow-Effekt
  - **Stern-Flash**: Gelber 5-zackiger Stern
  - **Wellen-Flash**: Cyan-Welle mit Sinus-Animation
  - **Explosions-Flash**: Rosa Explosion mit mehreren Kreisen
- __Partikel-Explosion**: 50 intensive Partikel in verschiedenen Farben
- __UI-Feedback**: 
  - **Hinweis**: "PERFECT TIMING!" erscheint bei Aktivierung
  - **Erfolg**: "PERFECT! +1000" bei erfolgreichem Treffer
- __Rendering-System**: Spezielle Funktionen für alle Perfect Timing Effekte
  - **drawPerfectTimingCircle()**: Schrumpfender Kreis mit Glow und Pulsieren
  - **drawScreenFlashEffects()**: Alle Flash-Effekte mit Alpha-Animation
  - **drawStar()**, **drawWave()**, **drawExplosion()**: Spezielle Formen
- __Integration**: Perfekt in bestehende Spielmechanik integriert

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
