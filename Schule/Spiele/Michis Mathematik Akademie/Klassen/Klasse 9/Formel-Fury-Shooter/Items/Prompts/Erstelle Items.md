# 🎮 SYSTEM-PROMPT: SHOP ITEMS ERSTELLEN (SCHRITT 1)

**AUFGABE:** Implementiere das User Interface für neue Shop Items im Shop Menu. NUR VISUELL - KEINE FUNKTIONALITÄT!

## 📋 **EINGABE-ANFORDERUNGEN:**
Der User wird eine Item-Beschreibung bereitstellen. Diese Datei enthält:
- **Name des Items**
- **Beschreibung/Effekt** 
- **Seltenheitsstufe** (Common/Rare/Epic/Legendary - NUR EINE pro Item!)
- **Icon/Symbol** (Emoji oder Beschreibung)
- **Spezielle Eigenschaften**
- **Preis** (Coins)

## 🎯 **IMPLEMENTIERUNGS-ZIEL:**
Erstelle Item-Definitionen im Shop-System, sodass das Item im Shop **visuell erscheint** und **kaufbar ist**, aber **noch keine Funktionalität hat**.

## 📁 **DATEI ZU BEARBEITEN:**

### **HAUPTDATEI: `js/shop-system.js`**
- **Zeilen mit Item-Pool**: Shop-Items Array - Hier neue Items hinzufügen
- **effect: null** - IMMER null lassen (keine Funktionalität)

## 🔧 **IMPLEMENTIERUNGS-ANLEITUNG:**

### **1️⃣ Item-Datenstruktur:**
```javascript
{
    id: 'item_name_rarity',                 // Eindeutige ID: z.B. 'geodreieck_common'
    name: 'ITEM-NAME',                      // Display-Name: z.B. 'GEODREIECK'
    description: 'Effekt-Beschreibung',     // z.B. '+15% Bewegungsgeschwindigkeit'
    rarity: 'common',                       // NUR EINE: 'common'|'rare'|'epic'|'legendary'
    icon: '📐',                            // Emoji oder Symbol
    price: 50,                             // Preis in Coins
    category: 'movement',                   // Kategorie: 'movement'|'combat'|'math'|'utility'
    effect: null                           // IMMER null (Schritt 1)
}
```

### **2️⃣ Seltenheitsstufen (NUR EINE pro Item):**
- **Common** → `rarity: 'common'` (Grau, Basis: 50-100 Coins, +5-15/Welle)
- **Rare** → `rarity: 'rare'` (Blau, Basis: 100-250 Coins, +15-25/Welle)  
- **Epic** → `rarity: 'epic'` (Lila, Basis: 250-500 Coins, +25-50/Welle)
- **Legendary** → `rarity: 'legendary'` (Orange, Basis: 500+ Coins, +50-100/Welle)

### **2️⃣.1 Dynamische Preiserhöhung:**
**WICHTIG**: Alle Items werden **jede Welle teurer**!
- **Preisformel**: `Aktueller Preis = Basis-Preis + (Aktuelle Welle - 1) × Preis-Steigerung`
- **Preis-Steigerung pro Welle**:
  - **Common**: +5-15 Coins pro Welle
  - **Rare**: +15-25 Coins pro Welle
  - **Epic**: +25-50 Coins pro Welle  
  - **Legendary**: +50-100 Coins pro Welle

**Beispiel**: Geodreieck (Basis: 75 Coins, +10/Welle)
- Welle 1: 75 Coins
- Welle 5: 115 Coins (75 + 4×10)
- Welle 10: 165 Coins (75 + 9×10)

### **3️⃣ Item-Kategorien:**
- **Movement** → Geschwindigkeit, Bewegung
- **Combat** → Kampf, Schaden, Verteidigung
- **Math** → Formel-Boni, Combo-Verbesserungen
- **Utility** → Spezielle Effekte, Coins, Glück

### **4️⃣ Icon-Richtlinien:**
- Verwende **thematische Emojis** (📐, 🧪, ⚔️, 🛡️, 💎, 🍀)
- **Passend zur Item-Funktion**
- **Einzigartig** für jedes Item

### **5️⃣ Naming-Konvention:**
- **ID**: `item_name_rarity` (lowercase, underscores)
- **Name**: `ITEM-NAME` (UPPERCASE, hyphens für Lesbarkeit)
- **Description**: Kurz und prägnant (max. 4-5 Worte)

## 📊 **IMPLEMENTIERUNGS-BEISPIELE:**

```javascript
// Beispiel: Bewegungs-Items (verschiedene Seltenheiten)
{
    id: 'geodreieck_common',
    name: 'GEODREIECK',
    description: '+15% Bewegungsgeschwindigkeit',
    rarity: 'common',
    icon: '📐',
    price: 75,
    category: 'movement',
    effect: null
},
{
    id: 'trank_des_leipzigers_legendary',
    name: 'TRANK DES LEIPZIGERS',
    description: '+50% Coins, +25% Speed, +10% Spawn-Rate',
    rarity: 'legendary',
    icon: '🧪',
    price: 500,
    category: 'utility',
    effect: null
},
{
    id: 'algebra_schwert_epic',
    name: 'ALGEBRA-SCHWERT',
    description: '+2 Combo-Zeit, +30% Score',
    rarity: 'epic',
    icon: '⚔️',
    price: 1200,
    category: 'math',
    effect: null
}
```

## ✅ **ERFOLGS-KRITERIEN:**

### **MUSS erfüllt sein:**
1. **Item erscheint** im Shop Menu
2. **Korrekte Seltenheitsfarben** werden angezeigt  
3. **Icon, Beschreibung und Preis** sind sichtbar
4. **Item ist kaufbar** (wenn genug Coins vorhanden)
5. **Keine Funktionalität** wird ausgeführt beim Kauf
6. **Kein JavaScript-Fehler** in der Konsole
7. **NUR EINE Seltenheitsstufe** pro Item

### **TEST-KOMMANDOS:**
```javascript
// Shop öffnen
window.game.shopSystem.openShop();

// Coins hinzufügen für Tests
window.game.currencySystem.addCoins(10000);

// Shop-Items überprüfen  
window.game.shopSystem.getAvailableItems();

// Neue Items suchen
window.game.shopSystem.items.filter(i => i.id.includes('neues_item'))
```

## ⚠️ **WICHTIGE REGELN:**

### **NICHT IMPLEMENTIEREN:**
- ❌ Keine `effect` Funktionen
- ❌ Keine Änderungen an Spiel-Logik
- ❌ Keine Änderungen an anderen Dateien
- ❌ Keine `purchaseItem()` Modifikationen
- ❌ Keine mehrfachen Seltenheitsstufen pro Item

### **NUR IMPLEMENTIEREN:**
- ✅ Item-Definitionen im Shop-System
- ✅ Korrekte Datenstruktur
- ✅ Visuelles Erscheinungsbild
- ✅ NUR EINE Seltenheitsstufe pro Item

## 🔄 **NACH DER IMPLEMENTIERUNG:**

### **Teste das Item:**
1. Öffne das Spiel im Browser
2. Führe `window.game.currencySystem.addCoins(10000)` aus
3. Öffne den Shop mit `window.game.shopSystem.openShop()`
4. Überprüfe ob das neue Item erscheint
5. Kaufe das Item (sollte Coins abziehen, aber nichts bewirken)
6. Überprüfe Konsole auf Fehler

### **AUSGABE-FORMAT:**
```
✅ Item "[NAME]" erfolgreich hinzugefügt!
🎯 Seltenheit: [RARITY] 
🎨 Icon: [EMOJI]
💰 Preis: [PRICE] Coins
📦 Kategorie: [CATEGORY]
🔧 Bereit für Schritt 2: Funktionalität implementieren

TEST-KOMMANDOS:
- window.game.currencySystem.addCoins(10000)
- window.game.shopSystem.openShop()
```

---

**WICHTIG:** Dies ist nur SCHRITT 1 von 2. Nach erfolgreichem Test verwende den "Implementiere Items" Prompt für die Funktionalität!

**BESONDERHEIT:** Items haben NUR EINE Seltenheitsstufe (nicht wie Upgrades mit 4 Stufen)!
