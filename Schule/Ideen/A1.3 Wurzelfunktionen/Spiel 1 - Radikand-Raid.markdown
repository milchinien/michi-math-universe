# Spiel 1: Radikand-Raid – Dungeon der Wurzeln

# Kurzbeschreibung

Rogue-like Dungeon-Crawler, in dem Türen, Fallen und Bonusräume nur betreten werden dürfen, wenn der Radikand gültig ist (Definitionsbereich: bx + c ≥ 0). Parameterkarten (a, b, c, d) verändern live die Weltgeometrie gemäß f(x) = a·√(b x + c) + d.

# Ausührliche Beschfreibung

- Setting: Ein Labyrinth, dessen Korridore entlang des Graphen von √x verlaufen. Du sammelst Parameterkarten (a, b, c, d).
- Mechanik Definitionsbereich: Vor jeder Tür steht ein „Radikand-Scanner". Nur wenn bx + c ≥ 0 (bei geradem Wurzelexponent) ist, öffnet sich die Tür. Bei b < 0 spiegeln sich Räume an der y-Achse, bei a < 0 kippen Plattformen nach unten, d verschiebt die gesamte Etage.
- Transformationen als Level-Design: Das Level ist die Funktion. Aktivierst du b = 4, werden alle x-Abstände auf 1/4 gestaucht; änderst du c, wandert der „Startpunkt" −c/b mit. a stretcht Höhen, d hebt/senkt das Terrain.
- Progression: Sammle „Definitions-Schlüssel", indem du lokale Aufgaben löst (z. B. bestimme den erlaubten x-Bereich). Falsche Eingabe ⇒ Falle (Zeitverlust), richtige ⇒ Loot und Abkürzungen.
- Boss-Mechanik: Der Boss verformt das Level zufällig. Du konterst, indem du live Parameter wirkst (Spiegelung, Verschiebung), sonst ist der Weg unpassierbar.
- Typische Fehler als Fallen: Ignorierst du den Definitionsbereich oder deutest −c/b falsch, öffnet sich eine Scheinpassage, die in eine „NaN-Zone" führt.
- Warum hilft mir das?
  - Übst Definitionsbereiche automatisiert und intuitiv (Radikand ≥ 0 wird räumlich erlebt).
  - Verstehst Parameterwirkung a, b, c, d als direkte, fühlbare Transformationen.
  - Festigt die Idee des Startpunkts am Rand des Definitionsbereichs statt „Asymptote".


