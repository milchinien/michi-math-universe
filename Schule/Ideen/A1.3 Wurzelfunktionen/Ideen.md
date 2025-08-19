# Spiel 1: Radikand-Raid – Dungeon der Wurzeln

# Kurzbeschreibung

Rogue-like Dungeon-Crawler, in dem Türen, Fallen und Bonusräume nur betreten werden dürfen, wenn der Radikand gültig ist (Definitionsbereich: bx + c ≥ 0). Parameterkarten (a, b, c, d) verändern live die Weltgeometrie gemäß f(x) = a·√(b x + c) + d.

# Ausührliche Beschfreibung

- Setting: Ein Labyrinth, dessen Korridore entlang des Graphen von √x verlaufen. Du sammelst Parameterkarten (a, b, c, d).
- Mechanik Definitionsbereich: Vor jeder Tür steht ein „Radikand-Scanner“. Nur wenn bx + c ≥ 0 (bei geradem Wurzelexponent) ist, öffnet sich die Tür. Bei b < 0 spiegeln sich Räume an der y-Achse, bei a < 0 kippen Plattformen nach unten, d verschiebt die gesamte Etage.
- Transformationen als Level-Design: Das Level ist die Funktion. Aktivierst du b = 4, werden alle x-Abstände auf 1/4 gestaucht; änderst du c, wandert der „Startpunkt“ −c/b mit. a stretcht Höhen, d hebt/senkt das Terrain.
- Progression: Sammle „Definitions-Schlüssel“, indem du lokale Aufgaben löst (z. B. bestimme den erlaubten x-Bereich). Falsche Eingabe ⇒ Falle (Zeitverlust), richtige ⇒ Loot und Abkürzungen.
- Boss-Mechanik: Der Boss verformt das Level zufällig. Du konterst, indem du live Parameter wirkst (Spiegelung, Verschiebung), sonst ist der Weg unpassierbar.
- Typische Fehler als Fallen: Ignorierst du den Definitionsbereich oder deutest −c/b falsch, öffnet sich eine Scheinpassage, die in eine „NaN-Zone“ führt.
- Warum hilft mir das?
  - Übst Definitionsbereiche automatisiert und intuitiv (Radikand ≥ 0 wird räumlich erlebt).
  - Verstehst Parameterwirkung a, b, c, d als direkte, fühlbare Transformationen.
  - Festigt die Idee des Startpunkts am Rand des Definitionsbereichs statt „Asymptote“.

---

# Spiel 2: √Rave Runner – Graphen-Parkour

# Kurzbeschreibung

Rhythmischer Parkour-Runner: Du surfst auf dem Graphen von f(x) = a·√(b x + c) + d. Beats triggern Parameterwechsel; nur wenn du die Transformation korrekt antizipierst, triffst du Ringe und vermeidest „Ableitungs-Klippen“.

# Ausührliche Beschfreibung

- Flow: Du bewegst dich von links nach rechts auf dem Graphen. Checkpoints markieren den „Startpunkt“ (x = −c/b). Vor dem Startpunkt existiert der Track bei gerader Wurzel nicht.
- Transformation on-beat: Jede 4 Takte wechselt genau ein Parameter. Visuals zeigen: a↑ ⇒ höherer Peak, a<0 ⇒ invertierte Spur; b↑ ⇒ x-Stauchung; c⇒ horizontale Verschiebung; d⇒ vertikale Verschiebung.
- Skill-Sections: 
  - „Nullstellen-Combo“: Schalte d so, dass a·√(b x + c) + d = 0 an den Ring-Positionen erfüllt ist.
  - „Schnittpunkt-Challenge“: Triff y = m x + t, indem du Parameter so wählst, dass sich Graph und Gerade schneiden.
- Ableitungs-Gameplay: In hell markierten Zonen ist die Steigung relevant: Geschwindigkeit ∝ 1/(2√(x)) bei √x-Abschnitten. Am Rand (Startpunkt) ist Tangente quasi senkrecht ⇒ Sprungfenster extrem kurz.
- Fehlersimulation: Quadrieren ohne Prüfung erzeugt „Fake-Ringe“: Sie sehen echt aus, geben aber Minuspunkte. Nur wer nach dem Quadrieren die Definitionsprüfung gedanklich macht, meidet die Fakes.
- Warum hilft mir das?
  - Du verknüpfst Parametertransformationen mit motorischer Antizipation.
  - Du spürst das Steigungsverhalten von √x: schnell am Anfang, flacher später.
  - Du trainierst Nullstellen-/Schnittpunktdenken und die Pflicht zur Probe nach dem Quadrieren.

---

# Spiel 3: Quadrier-Quarantäne – The Extraneous Purge

# Kurzbeschreibung

Puzzle-Boss-Rush um Wurzelgleichungen. Ziel: Wurzeln isolieren, sinnvoll quadrieren, Scheinlösungen entlarven. Jeder Boss „infiziert“ Gleichungen mit Fallen, die nur durch saubere Definitionsprüfung geheilt werden.

# Ausührliche Beschfreibung

- Core-Loop: 
  1) Wurzel isolieren (z. B. √(b x + c) = k).
  2) Entscheide, ob Quadrieren sinnvoll ist.
  3) Nach dem Quadrieren alle Lösungen prüfen: Radikand-Bedingung, Einsetzen in die Originalgleichung.
- Boss-Typen:
  - „Mirror Chief“: a < 0 oder b < 0 führt zu Spiegel-Fallen; verwechselst du Vorzeichen, erscheint eine Scheinlösung.
  - „Stacker“: mehrere Wurzeln; isolierst du die falsche zuerst, vervielfachst du Fakes.
  - „Fraction Fiend“: arbeitet mit rationalen Exponenten x^(m/n); erkennt nur echte Lösungen, wenn die n (gerade/ungerade) korrekt berücksichtigt ist.
- Tools: „Definitions-Lampe“ hebt erlaubte x-Bereiche hervor; „Probe-Siegel“ validiert Lösungen und markiert Scheinlösungen rot.
- Scoring: 
  - + Punkte: minimale Anzahl an Quadrier-Schritten, korrekte Reihenfolge, vollständige Probe.
  - − Punkte: jede Scheinlösung, vergessene Definitionsprüfung, unnötige Quadrate.
- Lern-Checks: Nach jedem Boss kurzer Reflexionsscreen: Wo entstand die Scheinlösung? Welche Bedingung wurde verletzt?
- Warum hilft mir das?
  - Verinnerlicht die Pipeline: isolieren → quadrieren → Definitionsprüfung → Probe.
  - Reduziert typische Fehler (Scheinlösungen, Vorzeichen, Bereichsverletzungen).
  - Übertragbar auf allgemeine Potenzgleichungen mit rationalen Exponenten.
