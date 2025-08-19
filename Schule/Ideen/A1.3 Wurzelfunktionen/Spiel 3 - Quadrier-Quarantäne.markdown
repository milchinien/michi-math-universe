# Spiel 3: Quadrier-Quarantäne – The Extraneous Purge

# Kurzbeschreibung

Puzzle-Boss-Rush um Wurzelgleichungen. Ziel: Wurzeln isolieren, sinnvoll quadrieren, Scheinlösungen entlarven. Jeder Boss „infiziert" Gleichungen mit Fallen, die nur durch saubere Definitionsprüfung geheilt werden.

# Ausührliche Beschfreibung

- Core-Loop: 
  1) Wurzel isolieren (z. B. √(b x + c) = k).
  2) Entscheide, ob Quadrieren sinnvoll ist.
  3) Nach dem Quadrieren alle Lösungen prüfen: Radikand-Bedingung, Einsetzen in die Originalgleichung.
- Boss-Typen:
  - „Mirror Chief": a < 0 oder b < 0 führt zu Spiegel-Fallen; verwechselst du Vorzeichen, erscheint eine Scheinlösung.
  - „Stacker": mehrere Wurzeln; isolierst du die falsche zuerst, vervielfachst du Fakes.
  - „Fraction Fiend": arbeitet mit rationalen Exponenten x^(m/n); erkennt nur echte Lösungen, wenn die n (gerade/ungerade) korrekt berücksichtigt ist.
- Tools: „Definitions-Lampe" hebt erlaubte x-Bereiche hervor; „Probe-Siegel" validiert Lösungen und markiert Scheinlösungen rot.
- Scoring: 
  - + Punkte: minimale Anzahl an Quadrier-Schritten, korrekte Reihenfolge, vollständige Probe.
  - − Punkte: jede Scheinlösung, vergessene Definitionsprüfung, unnötige Quadrate.
- Lern-Checks: Nach jedem Boss kurzer Reflexionsscreen: Wo entstand die Scheinlösung? Welche Bedingung wurde verletzt?
- Warum hilft mir das?
  - Verinnerlicht die Pipeline: isolieren → quadrieren → Definitionsprüfung → Probe.
  - Reduziert typische Fehler (Scheinlösungen, Vorzeichen, Bereichsverletzungen).
  - Übertragbar auf allgemeine Potenzgleichungen mit rationalen Exponenten.


