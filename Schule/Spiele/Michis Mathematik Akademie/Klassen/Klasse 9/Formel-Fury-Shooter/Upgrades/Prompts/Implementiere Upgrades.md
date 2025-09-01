# ⚙️ SYSTEM-PROMPT: UPGRADE FUNKTIONALITÄT IMPLEMENTIEREN (SCHRITT 2)

**AUFGABE:** Implementiere die Funktionalität für ein bereits visuell vorhandenes Upgrade. Das Upgrade MUSS bereits im Level-Up Menu sichtbar sein (Schritt 1 abgeschlossen).

## 📋 **EINGABE-ANFORDERUNGEN:**
Der User wird spezifizieren:
- **Welches Upgrade** funktional gemacht werden soll (Name/ID)
- **Upgrade-Beschreibung** mit gewünschten Effekten
- **Spezielle Anforderungen** oder Balancing-Wünsche

## 🎯 **IMPLEMENTIERUNGS-ZIEL:**
Erweitere die `applyUpgrade()` Methode, sodass das Upgrade **echte Spiel-Effekte** hat und **korrekt mit dem Game-System** interagiert.

## 📁 **DATEIEN ZU BEARBEITEN:**

### **HAUPTDATEI: `js/levelup-system.js`**
- **Zeilen 206-214**: `applyUpgrade()` Methode - Hier Upgrade-Logik hinzufügen
- **Optional**: Upgrade-Definitionen anpassen (effect-Funktionen)

### **MÖGLICHE ZUSÄTZLICHE DATEIEN:**
- **`js/game-engine.js`**: Für Spiel-Zustand Änderungen (Health, etc.)
- **`js/player-input.js`**: Für Player-Eigenschaften
- **`js/formula-system.js`**: Für Mathematik-Upgrades
- **`js/enemy-system.js`**: Für Gegner-Modifikationen
- **`js/currency-system.js`**: Für Währungs-Upgrades

## 🔧 **IMPLEMENTIERUNGS-ANLEITUNG:**

### **1️⃣ Upgrade-Erkennung in applyUpgrade():**
```javascript
applyUpgrade(upgrade) {
    console.log(`🔺 Applying upgrade: ${upgrade.name}`);
    
    // Upgrade-spezifische Logik basierend auf ID
    switch(upgrade.id) {
        case 'plus_hp_common':
            this.applyHealthUpgrade(1);
            break;
        case 'plus_hp_rare':
            this.applyHealthUpgrade(2);
            break;
        case 'plus_hp_epic':
            this.applyHealthUpgrade(3);
            break;
        case 'plus_hp_legendary':
            this.applyHealthUpgrade(5);
            break;
        
        // Weitere Upgrades hier hinzufügen...
        
        default:
            console.warn(`⚠️ Unknown upgrade: ${upgrade.id}`);
    }
}
```

### **2️⃣ Helper-Methoden erstellen:**
```javascript
// Beispiel für Health-Upgrades
applyHealthUpgrade(healthIncrease) {
    if (window.game) {
        const oldMaxHealth = window.game.playerMaxHealth;
        const oldCurrentHealth = window.game.playerHealth;
        
        // Erhöhe maximale Gesundheit
        window.game.playerMaxHealth += healthIncrease;
        // Erhöhe aktuelle Gesundheit
        window.game.playerHealth += healthIncrease;
        
        console.log(`❤️ Health increased: ${oldCurrentHealth}/${oldMaxHealth} → ${window.game.playerHealth}/${window.game.playerMaxHealth}`);
        
        // Optional: Visuelles Feedback
        this.showUpgradeEffect(`+${healthIncrease} MAX HP!`, '#ff0000');
    }
}
```

### **3️⃣ Häufige Upgrade-Kategorien:**

#### **🩺 GESUNDHEITS-UPGRADES:**
```javascript
// Maximale HP erhöhen
window.game.playerMaxHealth += amount;
window.game.playerHealth += amount;

// Aktuelle HP heilen
window.game.playerHealth = Math.min(window.game.playerHealth + amount, window.game.playerMaxHealth);

// Regeneration hinzufügen (komplexer)
window.game.healthRegenRate = (window.game.healthRegenRate || 0) + regenAmount;
```

#### **⚡ GESCHWINDIGKEITS-UPGRADES:**
```javascript
// Player-Geschwindigkeit erhöhen
if (window.game.player) {
    window.game.player.speed += speedIncrease;
    window.game.player.maxSpeed += speedIncrease;
}
```

#### **🧮 MATHEMATIK-UPGRADES:**
```javascript
// Combo-Zeit verlängern
if (window.game.formulaSystem) {
    window.game.formulaSystem.comboTimeLimit += timeIncrease;
}

// Score-Multiplikator
if (window.game.formulaSystem) {
    window.game.formulaSystem.scoreMultiplier = (window.game.formulaSystem.scoreMultiplier || 1) + multiplier;
}
```

#### **💰 WÄHRUNGS-UPGRADES:**
```javascript
// Coin-Multiplikator
if (window.game.currencySystem) {
    window.game.currencySystem.coinMultiplier = (window.game.currencySystem.coinMultiplier || 1) + multiplier;
}
```

#### **👾 GEGNER-UPGRADES:**
```javascript
// Weniger Gegner spawnen
if (window.game.enemySpawner) {
    window.game.enemySpawner.spawnInterval += intervalIncrease;
}

// Gegner schwächer machen
if (window.game.enemySpawner) {
    window.game.enemySpawner.globalDamageReduction = (window.game.enemySpawner.globalDamageReduction || 0) + reduction;
}
```

### **4️⃣ Visuelles Feedback (Optional):**
```javascript
showUpgradeEffect(message, color = '#00ff00') {
    // Erstelle temporäres Feedback-Element
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.color = color;
    feedback.style.fontSize = '36px';
    feedback.style.fontWeight = 'bold';
    feedback.style.fontFamily = 'Courier New';
    feedback.style.textShadow = `0 0 20px ${color}`;
    feedback.style.zIndex = '9999';
    feedback.style.pointerEvents = 'none';
    feedback.style.animation = 'upgradeEffectFloat 2s ease-out forwards';
    
    document.body.appendChild(feedback);
    
    // Entferne nach Animation
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
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
window.game.waveSystem              // Wellen-System
window.game.levelSystem             // Level-System
```

## ✅ **ERFOLGS-KRITERIEN:**

### **MUSS erfüllt sein:**
1. **Upgrade-Effekt** wird korrekt angewendet
2. **Spiel-Zustand** verändert sich wie erwartet
3. **Kein JavaScript-Fehler** in der Konsole
4. **Persistenz** während der Spiel-Session
5. **Balance** ist angemessen (nicht zu overpowered)
6. **Visuelles Feedback** (optional aber empfohlen)

### **TEST-KOMMANDOS:**
```javascript
// Upgrade direkt testen
window.game.levelUpSystem.applyUpgrade({
    id: 'upgrade_id_hier',
    name: 'TEST-UPGRADE'
});

// Spiel-Zustand überprüfen
console.log('Player Health:', window.game.playerHealth, '/', window.game.playerMaxHealth);
console.log('Player Speed:', window.game.player?.speed);
console.log('Formula System:', window.game.formulaSystem);

// Level-Up testen
showTestLevelUp(150);
```

## ⚠️ **WICHTIGE REGELN:**

### **SICHERHEITS-CHECKS:**
```javascript
// IMMER prüfen ob Objekte existieren
if (window.game && window.game.player) {
    // Nur dann Änderungen vornehmen
}

// Grenzen einhalten
window.game.playerHealth = Math.min(window.game.playerHealth, window.game.playerMaxHealth);

// Negative Werte vermeiden
window.game.playerMaxHealth = Math.max(1, window.game.playerMaxHealth);
```

### **NICHT IMPLEMENTIEREN:**
- ❌ Permanente LocalStorage-Änderungen ohne User-Wunsch
- ❌ Übermäßig starke Upgrades (Game-Breaking)
- ❌ Änderungen an Core-Game-Mechaniken ohne Notwendigkeit
- ❌ Komplexe UI-Änderungen (nur einfaches Feedback)

## 🔄 **NACH DER IMPLEMENTIERUNG:**

### **Test-Prozedur:**
1. **Backup testen**: Spiel ohne Upgrade starten
2. **Level-Up auslösen**: `showTestLevelUp(150)`  
3. **Upgrade auswählen**: Klick auf das neue Upgrade
4. **Effekt überprüfen**: Gewünschte Änderung eingetreten?
5. **Weiter spielen**: Funktioniert das Spiel normal?
6. **Console checken**: Keine Fehler?

### **DEBUGGING:**
```javascript
// Upgrade-Pool überprüfen
window.game.levelUpSystem.getUpgradePool().forEach(u => 
    console.log(u.id, u.name, typeof u.effect)
);

// Aktueller Spiel-Zustand
console.log({
    health: `${window.game.playerHealth}/${window.game.playerMaxHealth}`,
    player: window.game.player,
    formulas: window.game.formulaSystem
});
```

### **AUSGABE-FORMAT:**
```
✅ Upgrade "[NAME]" Funktionalität implementiert!
🎮 Effekte: [LISTE DER IMPLEMENTIERTEN EFFEKTE]
🧪 Getestete Szenarien: [LISTE]
⚖️ Balance-Status: [ANGEMESSEN/ZU STARK/ZU SCHWACH]

DEBUG-KOMMANDOS:
- showTestLevelUp(150) 
- window.game.levelUpSystem.applyUpgrade({id: 'upgrade_id'})
```

---

**WICHTIG:** Dies ist SCHRITT 2 von 2. Das Upgrade MUSS bereits visuell im Menu existieren (Schritt 1 abgeschlossen)!
