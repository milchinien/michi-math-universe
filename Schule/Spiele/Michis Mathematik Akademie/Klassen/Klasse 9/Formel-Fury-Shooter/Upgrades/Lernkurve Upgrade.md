# Lernkurve Upgrade

## Beschreibung
Erhöht die XP-Punkte, die von besiegten Gegnern gedroppt werden. Jeder Kauf dieses Upgrades macht das Leveln effizienter und beschleunigt den Fortschritt.

## Upgrade-Details

**Titel:** Lernkurve  
**Symbol:** 📚 (Buch - repräsentiert Lernen und Wissensgewinn)  
**Preis:** 0 Coins (nur durch Level-Up erhältlich)  
**Stapelbar:** Ja (mehrfach kaufbar)

## Seltenheits-Stufen

### Common (Häufig)
- **XP-Bonus:** +15% mehr XP von allen Gegnern
- **Visuelle Effekte:** Kleine goldene Funken bei XP-Drop
- **Beschreibung:** "Verbessert deine Lernfähigkeit leicht"

### Rare (Selten) 
- **XP-Bonus:** +25% mehr XP von allen Gegnern
- **Visuelle Effekte:** Mittlere goldene Partikel mit leichtem Glühen
- **Beschreibung:** "Deutlich verbesserte Wissensaufnahme"

### Epic (Episch)
- **XP-Bonus:** +40% mehr XP von allen Gegnern  
- **Visuelle Effekte:** Große goldene Partikel mit starkem Glühen und kurzer Leuchtdauer
- **Beschreibung:** "Außergewöhnliche Lerngeschwindigkeit"

### Legendary (Legendär)
- **XP-Bonus:** +60% mehr XP von allen Gegnern
- **Visuelle Effekte:** Intensive goldene Explosion mit Sternen-Partikeln und langanhaltender Leuchteffekt
- **Beschreibung:** "Meisterhafte Wissensabsorption - XP regnet vom Himmel!"

## Balancing

### Stapelungs-Mechanik
- Jeder Kauf addiert den Bonus (nicht multiplikativ)
- Beispiel: 2x Common = +30% XP, 1x Rare + 1x Epic = +65% XP
- Maximum: 5 Stacks pro Seltenheit (verhindert Übermacht)

### Progression
- **Early Game:** Common/Rare Versionen helfen beim schnelleren Leveln
- **Mid Game:** Epic Versionen beschleunigen den Fortschritt deutlich  
- **Late Game:** Legendary Versionen für maximale Effizienz

### Visuelle Skalierung
Die visuellen Effekte werden basierend auf der Gesamtstärke des Upgrades angepasst:

- **0-50% Bonus:** Kleine goldene Funken
- **51-100% Bonus:** Mittlere Partikel mit Glühen
- **101-200% Bonus:** Große Partikel mit starkem Leuchten
- **200%+ Bonus:** Explosive Effekte mit Regenbogen-Partikeln

## Implementierung

### Code-Integration
```javascript
// In enemy-system.js bei Enemy-Tod
const baseXP = this.xpValue;
const xpMultiplier = 1 + (player.upgrades.lernkurve * 0.15); // 15% pro Common
const finalXP = Math.floor(baseXP * xpMultiplier);
```

### Upgrade-Objekt
```javascript
{
    id: 'lernkurve',
    name: 'Lernkurve',
    icon: '📚',
    rarity: 'common', // 'rare', 'epic', 'legendary'
    effect: 'xp_bonus',
    value: 0.15, // 15% für Common
    stackable: true,
    maxStacks: 5
}
```

## Strategische Bedeutung
- **Früher Fokus:** Beschleunigt das Erreichen wichtiger Level-Meilensteine
- **Synergien:** Kombiniert gut mit anderen XP-basierten Upgrades
- **Langzeit-Investment:** Jeder Stack zahlt sich über die gesamte Spielzeit aus
- **Risiko/Belohnung:** Opfert sofortige Kampfkraft für langfristigen Fortschritt