# MoreLuck Upgrade

Erstelle ein Upgrade das **Glück** erhöht, man kann es mehrmals kaufen wobei **die Chance auf bessere Seltenheiten** erhöht wird.

Der Preis für das Upgrade soll immer **0** sein da man es nur für ein **LEVEL-UP** erhält.

Das Upgrade soll eine "Common", "Rare", "Epic" und "Legendary" Version haben die das Upgrade stärker machen.

Bei der Seltenheit "Common" wird **Glück um +2%** erhöht.
Bei der Seltenheit "Rare" wird **Glück um +4%** erhöht.
Bei der Seltenheit "Epic" wird **Glück um +7%** erhöht.
Bei der Seltenheit "Legendary" wird **Glück um +12%** erhöht.

Das Upgrade soll als Titel **"Glücks-Formel"** haben.

Das Upgrade soll als Bild ein **Kleeblatt** haben.

## Upgrade-Effekt Details

**MoreLuck** erhöht die Wahrscheinlichkeit, bessere Seltenheiten in zukünftigen Level-Up Menüs zu erhalten:

### Basis-Wahrscheinlichkeiten (ohne Upgrade):
- Common: 60%
- Rare: 30% 
- Epic: 8%
- Legendary: 2%

### Mit MoreLuck Upgrades:
- **Common (+2% Glück)**: Common -2%, Rare +1.5%, Epic +0.3%, Legendary +0.2%
- **Rare (+4% Glück)**: Common -3%, Rare +2%, Epic +0.7%, Legendary +0.3%  
- **Epic (+7% Glück)**: Common -4%, Rare -2%, Epic +4%, Legendary +2%
- **Legendary (+12% Glück)**: Common -6%, Rare -3%, Epic +4%, Legendary +5%

### Stapelbar:
- Jedes MoreLuck Upgrade stapelt sich additiv
- Maximum: 15 Stacks pro Seltenheit
- **Langsamer Progress**: Man braucht ~8-12 Upgrades für spürbare Verbesserungen
- Bei maximalen Stacks: Legendary Upgrades haben ~25% Chance zu erscheinen

### Beispiel-Progression (mit Stacks):
- **5x Common Stacks**: Common 50%, Rare 37.5%, Epic 9.5%, Legendary 3%
- **3x Rare + 2x Epic Stacks**: Common 45%, Rare 36%, Epic 13.4%, Legendary 5.6%
- **10x Mixed Stacks**: Common 35%, Rare 40%, Epic 18%, Legendary 7%
- **15x Optimale Stacks**: Common 25%, Rare 35%, Epic 25%, Legendary 15%

### Visuelle Darstellung:
- **Icon**: 🍀 (Kleeblatt)
- **Farbe**: 
  - Common: Grau mit grünem Kleeblatt
  - Rare: Blau mit grünem Kleeblatt  
  - Epic: Lila mit grünem Kleeblatt
  - Legendary: Gold mit grünem Kleeblatt

### Upgrade-Text im Menü:
```
🍀 Glücks-Formel
"Erhöht die Chance auf seltene Upgrades"
Glück: +X% (je nach Seltenheit)
Preis: KOSTENLOS (Level-Up Belohnung)
```
