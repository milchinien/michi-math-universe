# ⚙️ SYSTEM-PROMPT: SHOP ITEMS FUNKTIONALITÄT IMPLEMENTIEREN (SCHRITT 2)

**AUFGABE:** Implementiere die Funktionalität für ein bereits visuell vorhandenes Shop Item. Das Item MUSS bereits im Shop sichtbar sein (Schritt 1 abgeschlossen).

## 📋 **EINGABE-ANFORDERUNGEN:**
Der User wird spezifizieren:
- **Welches Item** funktional gemacht werden soll (Name/ID)
- **Item-Beschreibung** mit gewünschten Effekten
- **Spezielle Anforderungen** oder Balancing-Wünsche

## 🎯 **IMPLEMENTIERUNGS-ZIEL:**
Erweitere die `purchaseItem()` Methode, sodass das Item **echte Spiel-Effekte** hat und **korrekt mit dem Game-System** interagiert.

## 📁 **DATEIEN ZU BEARBEITEN:**

### **HAUPTDATEI: `js/shop-system.js`**
- **purchaseItem() Methode** - Hier Item-Logik hinzufügen
- **Optional**: Item-Definitionen anpassen (effect-Funktionen)

### **MÖGLICHE ZUSÄTZLICHE DATEIEN:**
- **`js/game-engine.js`**: Für Spiel-Zustand Änderungen (Health, etc.)
- **`js/player-input.js`**: Für Player-Eigenschaften
- **`js/formula-system.js`**: Für Mathematik-Items
- **`js/enemy-system.js`**: Für Gegner-Modifikationen
- **`js/currency-system.js`**: Für Währungs-Items

## 🔧 **IMPLEMENTIERUNGS-ANLEITUNG:**

### **1️⃣ Item-Erkennung in purchaseItem():**
```javascript
purchaseItem(item) {
    // Prüfe ob genug Coins vorhanden
    if (!this.currencySystem.canAfford(item.price)) {
        console.log('❌ Nicht genug Coins!');
        return false;
    }
    
    // Coins abziehen
    this.currencySystem.spendCoins(item.price);
    console.log(`💰 Item gekauft: ${item.name} für ${item.price} Coins`);
    
    // Item-spezifische Logik basierend auf ID
    switch(item.id) {
        case 'geodreieck_common':
            this.applyMovementItem(15); // +15% Speed
            break;
        case 'trank_des_leipzigers_legendary':
            this.applyMultiEffectItem({
                coinBonus: 50,    // +50% Coins
                speedBonus: 25,   // +25% Speed  
                spawnRate: 10     // +10% Spawn-Rate
            });
            break;
        case 'algebra_schwert_epic':
            this.applyMathItem({
                comboTime: 2,     // +2 Combo-Zeit
                scoreBonus: 30    // +30% Score
            });
            break;
        
        // Weitere Items hier hinzufügen...
        
        default:
            console.warn(`⚠️ Unknown item: ${item.id}`);
            return false;
    }
    
    return true;
}
```

### **2️⃣ Helper-Methoden erstellen:**
```javascript
// Bewegungs-Items
applyMovementItem(speedPercentage) {
    if (window.game && window.game.player) {
        const speedIncrease = window.game.player.baseSpeed * (speedPercentage / 100);
        window.game.player.speed += speedIncrease;
        window.game.player.maxSpeed += speedIncrease;
        
        console.log(`⚡ Geschwindigkeit erhöht um ${speedPercentage}%`);
        this.showItemEffect(`+${speedPercentage}% SPEED!`, '#00ff00');
    }
}

// Multi-Effekt Items (wie Trank des Leipzigers)
applyMultiEffectItem(effects) {
    if (effects.coinBonus && window.game.currencySystem) {
        window.game.currencySystem.coinMultiplier = 
            (window.game.currencySystem.coinMultiplier || 1) + (effects.coinBonus / 100);
        console.log(`💰 Coin-Bonus: +${effects.coinBonus}%`);
    }
    
    if (effects.speedBonus && window.game.player) {
        const speedIncrease = window.game.player.baseSpeed * (effects.speedBonus / 100);
        window.game.player.speed += speedIncrease;
        console.log(`⚡ Geschwindigkeits-Bonus: +${effects.speedBonus}%`);
    }
    
    if (effects.spawnRate && window.game.enemySpawner) {
        window.game.enemySpawner.spawnInterval *= (1 + effects.spawnRate / 100);
        console.log(`👾 Spawn-Rate: +${effects.spawnRate}%`);
    }
    
    this.showItemEffect(`MULTI-EFFEKT AKTIVIERT!`, '#ff6600');
}

// Mathematik-Items
applyMathItem(effects) {
    if (effects.comboTime && window.game.formulaSystem) {
        window.game.formulaSystem.comboTimeLimit += effects.comboTime * 1000; // Sekunden zu ms
        console.log(`🎯 Combo-Zeit: +${effects.comboTime}s`);
    }
    
    if (effects.scoreBonus && window.game.formulaSystem) {
        window.game.formulaSystem.scoreMultiplier = 
            (window.game.formulaSystem.scoreMultiplier || 1) + (effects.scoreBonus / 100);
        console.log(`📈 Score-Bonus: +${effects.scoreBonus}%`);
    }
    
    this.showItemEffect(`MATHE-POWER!`, '#9966ff');
}
```

### **3️⃣ Item-Kategorien und Effekte:**

#### **🏃 MOVEMENT-ITEMS:**
```javascript
// Geschwindigkeit erhöhen
window.game.player.speed += speedIncrease;
window.game.player.maxSpeed += speedIncrease;

// Dash-Fähigkeit hinzufügen
window.game.player.dashCooldown = (window.game.player.dashCooldown || 5000) * 0.8; // 20% weniger Cooldown
```

#### **⚔️ COMBAT-ITEMS:**
```javascript
// Gesundheit erhöhen
window.game.playerMaxHealth += healthIncrease;
window.game.playerHealth += healthIncrease;

// Schild hinzufügen
window.game.playerShield = (window.game.playerShield || 0) + shieldAmount;
```

#### **🧮 MATH-ITEMS:**
```javascript
// Combo-System verbessern
window.game.formulaSystem.comboTimeLimit += timeIncrease;
window.game.formulaSystem.comboMultiplier += multiplierIncrease;

// Formel-Schwierigkeit reduzieren
window.game.formulaSystem.difficultyModifier = 
    (window.game.formulaSystem.difficultyModifier || 1) - difficultyReduction;
```

#### **🔧 UTILITY-ITEMS:**
```javascript
// Glück erhöhen
window.game.luckFactor = (window.game.luckFactor || 0) + luckIncrease;

// Coin-Magnetismus
window.game.coinMagnetRange = (window.game.coinMagnetRange || 0) + magnetRange;

// Auto-Collect
window.game.autoCollectEnabled = true;
```

### **4️⃣ Visuelles Feedback:**
```javascript
showItemEffect(message, color = '#00ff00') {
    // Erstelle temporäres Feedback-Element
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'fixed';
    feedback.style.top = '40%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.color = color;
    feedback.style.fontSize = '32px';
    feedback.style.fontWeight = 'bold';
    feedback.style.fontFamily = 'Courier New';
    feedback.style.textShadow = `0 0 15px ${color}`;
    feedback.style.zIndex = '9999';
    feedback.style.pointerEvents = 'none';
    feedback.style.animation = 'itemEffectPulse 2.5s ease-out forwards';
    
    document.body.appendChild(feedback);
    
    // Entferne nach Animation
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2500);
}
```

## 🔍 **SYSTEM-ZUGRIFF:**

### **Wichtige Game-Objekt Referenzen:**
```javascript
// Main Game Engine
window.game                          // Haupt-Spiel-Objekt

// Spieler-Eigenschaften  
window.game.player                   // Player-Objekt
window.game.playerHealth             // Aktuelle HP
window.game.playerMaxHealth          // Maximale HP

// Spiel-Systeme
window.game.formulaSystem            // Mathematik-System
window.game.currencySystem           // Währungs-System  
window.game.enemySpawner            // Gegner-System
window.game.shopSystem              // Shop-System
```

## ✅ **ERFOLGS-KRITERIEN:**

### **MUSS erfüllt sein:**
1. **Item-Effekt** wird korrekt angewendet
2. **Coins werden abgezogen** beim Kauf
3. **Spiel-Zustand** verändert sich wie erwartet
4. **Kein JavaScript-Fehler** in der Konsole
5. **Permanente Effekte** während der Spiel-Session
6. **Balance** ist angemessen (nicht zu overpowered)
7. **Visuelles Feedback** beim Kauf

### **TEST-KOMMANDOS:**
```javascript
// Coins hinzufügen
window.game.currencySystem.addCoins(10000);

// Shop öffnen
window.game.shopSystem.openShop();

// Item direkt kaufen (Test)
window.game.shopSystem.purchaseItem({
    id: 'item_id_hier',
    name: 'TEST-ITEM',
    price: 100
});

// Spiel-Zustand überprüfen
console.log('Player Speed:', window.game.player?.speed);
console.log('Coins:', window.game.currencySystem.coins);
console.log('Formula System:', window.game.formulaSystem);
```

## ⚠️ **WICHTIGE REGELN:**

### **SICHERHEITS-CHECKS:**
```javascript
// IMMER prüfen ob Objekte existieren
if (window.game && window.game.player) {
    // Nur dann Änderungen vornehmen
}

// Coins-Check vor Kauf
if (!this.currencySystem.canAfford(item.price)) {
    return false;
}

// Grenzen einhalten
window.game.player.speed = Math.min(window.game.player.speed, maxSpeed);
```

### **NICHT IMPLEMENTIEREN:**
- ❌ Permanente LocalStorage-Änderungen ohne User-Wunsch
- ❌ Übermäßig starke Items (Game-Breaking)
- ❌ Änderungen an Core-Game-Mechaniken ohne Notwendigkeit
- ❌ Komplexe UI-Änderungen (nur einfaches Feedback)
- ❌ Items die mehrfach gekauft werden können (außer explizit gewünscht)

## 🔄 **NACH DER IMPLEMENTIERUNG:**

### **Test-Prozedur:**
1. **Backup testen**: Spiel ohne Item starten
2. **Coins hinzufügen**: `window.game.currencySystem.addCoins(10000)`
3. **Shop öffnen**: `window.game.shopSystem.openShop()`
4. **Item kaufen**: Klick auf das neue Item
5. **Effekt überprüfen**: Gewünschte Änderung eingetreten?
6. **Weiter spielen**: Funktioniert das Spiel normal?
7. **Console checken**: Keine Fehler?

### **DEBUGGING:**
```javascript
// Shop-Items überprüfen
window.game.shopSystem.items.forEach(i => 
    console.log(i.id, i.name, i.price, typeof i.effect)
);

// Aktueller Spiel-Zustand
console.log({
    coins: window.game.currencySystem.coins,
    playerSpeed: window.game.player?.speed,
    health: `${window.game.playerHealth}/${window.game.playerMaxHealth}`,
    formulas: window.game.formulaSystem
});
```

### **AUSGABE-FORMAT:**
```
✅ Item "[NAME]" Funktionalität implementiert!
🎮 Effekte: [LISTE DER IMPLEMENTIERTEN EFFEKTE]
💰 Preis: [PRICE] Coins
🧪 Getestete Szenarien: [LISTE]
⚖️ Balance-Status: [ANGEMESSEN/ZU STARK/ZU SCHWACH]

DEBUG-KOMMANDOS:
- window.game.currencySystem.addCoins(10000)
- window.game.shopSystem.openShop()
- window.game.shopSystem.purchaseItem({id: 'item_id'})
```

---

**WICHTIG:** Dies ist SCHRITT 2 von 2. Das Item MUSS bereits visuell im Shop existieren (Schritt 1 abgeschlossen)!

**BESONDERHEIT:** Items sind permanente Käufe (nicht wie temporäre Upgrades) und haben einzigartige Seltenheiten!
