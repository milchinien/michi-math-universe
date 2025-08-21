# 🎮 SYSTEM-PROMPT: UPGRADE MENU ERSTELLEN (SCHRITT 1)

**AUFGABE:** Implementiere das User Interface für ein neues Upgrade im Level-Up Menu. NUR VISUELL - KEINE FUNKTIONALITÄT!

## 📋 **EINGABE-ANFORDERUNGEN:**
Der User wird eine Upgrade-Beschreibung in einer verlinkten Datei bereitstellen. Diese Datei enthält:
- **Name des Upgrades**
- **Beschreibung/Effekt** 
- **Seltenheitsstufen** (Common/Rare/Epic/Legendary)
- **Icon/Symbol** (Emoji oder Beschreibung)
- **Spezielle Eigenschaften**

## 🎯 **IMPLEMENTIERUNGS-ZIEL:**
Erstelle Upgrade-Definitionen im `upgradePool` Array, sodass das Upgrade im Level-Up Menu **visuell erscheint** und **auswählbar ist**, aber **noch keine Funktionalität hat**.

## 📁 **DATEI ZU BEARBEITEN:**

### **HAUPTDATEI: `js/levelup-system.js`**
- **Zeilen 18-62**: `upgradePool` Array - Hier neue Upgrades hinzufügen
- **Zeile 51**: `effect: null` - IMMER null lassen (keine Funktionalität)

## 🔧 **IMPLEMENTIERUNGS-ANLEITUNG:**

### **1️⃣ Upgrade-Datenstruktur:**
```javascript
{
    id: 'upgrade_name_rarity',           // Eindeutige ID: z.B. 'plus_hp_common'
    name: 'UPGRADE-NAME',                // Display-Name: z.B. 'PLUS-HP'
    description: 'Effekt-Beschreibung',  // z.B. '+1 Maximales Leben'
    category: 'rarity',                  // 'common'|'rare'|'epic'|'legendary'
    icon: '🔥',                         // Emoji oder Symbol
    effect: null                         // IMMER null (Schritt 1)
}
```

### **2️⃣ Seltenheitsstufen-Mapping:**
- **Common** → `category: 'common'` (Grau, 60% Chance)
- **Rare** → `category: 'rare'` (Blau, 30% Chance)  
- **Epic** → `category: 'epic'` (Lila, 15% Chance)
- **Legendary** → `category: 'legendary'` (Orange, 10% Chance)

### **3️⃣ Icon-Richtlinien:**
- Verwende **Emojis** wenn möglich (❤️, ⚡, 🛡️, 🔥, ⚔️)
- **Fallback**: Buchstaben oder Symbole (?, +, ★)
- **Passend zum Upgrade-Thema**

### **4️⃣ Naming-Konvention:**
- **ID**: `upgrade_name_rarity` (lowercase, underscores)
- **Name**: `UPGRADE-NAME` (UPPERCASE, hyphens für Lesbarkeit)
- **Description**: Kurz und prägnant (max. 3-4 Worte)

## 📊 **IMPLEMENTIERUNGS-BEISPIEL:**

```javascript
// Beispiel: PLUS-HP Upgrade mit 4 Seltenheitsstufen
{
    id: 'plus_hp_common',
    name: 'PLUS-HP',
    description: '+1 Maximales Leben',
    category: 'common',
    icon: '❤️',
    effect: null
},
{
    id: 'plus_hp_rare', 
    name: 'PLUS-HP',
    description: '+2 Maximales Leben',
    category: 'rare',
    icon: '💖',
    effect: null
},
{
    id: 'plus_hp_epic',
    name: 'PLUS-HP', 
    description: '+3 Maximales Leben',
    category: 'epic',
    icon: '💝',
    effect: null
},
{
    id: 'plus_hp_legendary',
    name: 'PLUS-HP',
    description: '+5 Maximales Leben', 
    category: 'legendary',
    icon: '💎❤️',
    effect: null
}
```

## ✅ **ERFOLGS-KRITERIEN:**

### **MUSS erfüllt sein:**
1. **Upgrade erscheint** im Level-Up Menu
2. **Korrekte Seltenheitsfarben** werden angezeigt  
3. **Icon und Beschreibung** sind sichtbar
4. **Upgrade ist klickbar** (zeigt Auswahl-Animation)
5. **Keine Funktionalität** wird ausgeführt beim Klick
6. **Kein JavaScript-Fehler** in der Konsole

### **TEST-KOMMANDOS:**
```javascript
// Level-Up Menu testen
showTestLevelUp(150);

// Upgrade-Pool überprüfen  
debugLevelUp();

// Neue Upgrades suchen
window.game.levelUpSystem.getUpgradePool().filter(u => u.id.includes('neues_upgrade'))
```

## ⚠️ **WICHTIGE REGELN:**

### **NICHT IMPLEMENTIEREN:**
- ❌ Keine `effect` Funktionen
- ❌ Keine Änderungen an Spiel-Logik
- ❌ Keine Änderungen an anderen Dateien
- ❌ Keine `applyUpgrade()` Modifikationen

### **NUR IMPLEMENTIEREN:**
- ✅ Upgrade-Definitionen im `upgradePool`
- ✅ Korrekte Datenstruktur
- ✅ Visuelles Erscheinungsbild

## 🔄 **NACH DER IMPLEMENTIERUNG:**

### **Teste das Upgrade:**
1. Öffne das Spiel im Browser
2. Führe `showTestLevelUp(150)` in der Konsole aus
3. Überprüfe ob das neue Upgrade erscheint
4. Klicke das Upgrade (sollte Menu schließen, aber nichts bewirken)
5. Überprüfe Konsole auf Fehler

### **AUSGABE-FORMAT:**
```
✅ Upgrade "[NAME]" erfolgreich hinzugefügt!
🎯 Seltenheitsstufen: [ANZAHL] (Common/Rare/Epic/Legendary)
🎨 Icons: [LISTE DER VERWENDETEN EMOJIS]
🔧 Bereit für Schritt 2: Funktionalität implementieren

TEST-KOMMANDOS:
- showTestLevelUp(150)
- debugLevelUp()
```

---

**WICHTIG:** Dies ist nur SCHRITT 1 von 2. Nach erfolgreichem Test verwende den "Implementiere Upgrades" Prompt für die Funktionalität!


