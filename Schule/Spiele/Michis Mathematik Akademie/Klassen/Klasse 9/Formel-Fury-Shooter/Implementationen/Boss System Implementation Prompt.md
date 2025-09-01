# 🐉 SYSTEM-PROMPT: BOSS-SYSTEM IMPLEMENTIERUNG

**AUFGABE:** Implementiere ein vollständiges Boss-System für den Formel-Fury-Shooter mit Multi-Stage Formel-Challenges und speziellen Boss-Mechaniken.

## 📋 **BOSS-SYSTEM ÜBERSICHT:**

### **🎯 Boss-Spawn-Logik:**
- **Boss-Wellen**: Jede 5. Welle (Welle 5, 10, 15, 20, ...)
- **Boss-Ankündigung**: 10 Sekunden Countdown vor Boss-Spawn
- **Arena-Effekt**: Spezielle Boss-Arena-Beleuchtung und Musik-Wechsel
- **Nur ein Boss**: Keine normalen Gegner während Boss-Kämpfen

### **🏆 Boss-Typen (Progressive Schwierigkeit):**

#### **1️⃣ ALGEBRA-TITAN (Welle 5-9)**
```javascript
{
    name: 'ALGEBRA-TITAN',
    icon: '🤖',
    health: 300,
    size: { width: 80, height: 80 },
    color: '#FF4444',
    glowColor: '#FF8888',
    formulaStages: 3,
    formulaTypes: ['binomial_basic'],
    specialAbility: 'shield_phase',
    coinReward: 150,
    xpReward: 100
}
```

#### **2️⃣ POLYNOM-KAISER (Welle 10-14)**
```javascript
{
    name: 'POLYNOM-KAISER',
    icon: '👑',
    health: 500,
    size: { width: 100, height: 100 },
    color: '#4444FF',
    glowColor: '#8888FF',
    formulaStages: 4,
    formulaTypes: ['binomial_advanced', 'factoring'],
    specialAbility: 'teleport_phase',
    coinReward: 300,
    xpReward: 200
}
```

#### **3️⃣ GLEICHUNGS-OVERLORD (Welle 15+)**
```javascript
{
    name: 'GLEICHUNGS-OVERLORD',
    icon: '💀',
    health: 800,
    size: { width: 120, height: 120 },
    color: '#8844FF',
    glowColor: '#BB88FF',
    formulaStages: 5,
    formulaTypes: ['binomial_expert', 'nested_formulas'],
    specialAbility: 'minion_summon',
    coinReward: 500,
    xpReward: 350
}
```

## 🔧 **IMPLEMENTIERUNGS-DETAILS:**

### **📁 Dateien zu bearbeiten:**

#### **1️⃣ HAUPTDATEI: `js/enemy-system.js`**
- **Boss-Klasse hinzufügen**: `class Boss extends Enemy`
- **Boss-Spawn-Logik**: `spawnBoss(waveNumber)`
- **Multi-Stage System**: `nextFormulaStage()`
- **Spezial-Fähigkeiten**: `executeSpecialAbility()`

#### **2️⃣ WAVE-SYSTEM: `js/wave-system.js`**
- **Boss-Wellen-Erkennung**: `isBossWave(waveNumber)`
- **Boss-Ankündigung**: `announceBossWave()`
- **Boss-Completion**: `onBossDefeated()`

#### **3️⃣ FORMEL-SYSTEM: `js/formula-system.js`**
- **Boss-Formeln**: Erweiterte Formel-Pools für Bosse
- **Multi-Stage-Tracking**: `currentBossStage`, `totalBossStages`
- **Stage-Progression**: `advanceBossStage()`

#### **4️⃣ UI-SYSTEM: `index.html` + CSS**
- **Boss-Health-Bar**: Große, prominente Lebensanzeige
- **Stage-Indicator**: "Stage 2/4" Anzeige
- **Boss-Name-Display**: Großer Boss-Name über Health-Bar

### **🎮 Boss-Kampf-Ablauf:**

#### **Phase 1: Boss-Ankündigung (10s)**
```javascript
// Beispiel-Implementation
announceBoss() {
    this.showBossWarning("⚠️ BOSS INCOMING ⚠️", 10);
    this.playBossMusic();
    this.dimArenaLights();
    setTimeout(() => this.spawnBoss(), 10000);
}
```

#### **Phase 2: Boss-Spawn**
```javascript
spawnBoss(waveNumber) {
    const bossType = this.getBossTypeForWave(waveNumber);
    const boss = new Boss(centerX, centerY, bossType);
    boss.initializeFormulaStages();
    this.currentBoss = boss;
    this.showBossHealthBar(boss);
}
```

#### **Phase 3: Multi-Stage Kampf**
```javascript
// Boss hat 3-5 Formel-Stages
// Jede Stage = eine Formel lösen
// Nach jeder Stage: Boss-Animation + nächste Formel
onFormulaCorrect() {
    if (this.currentBoss) {
        this.currentBoss.takeDamage(100); // Fester Schaden pro Stage
        if (this.currentBoss.currentStage < this.currentBoss.totalStages) {
            this.currentBoss.nextStage();
            this.executeSpecialAbility();
        } else {
            this.defeatBoss();
        }
    }
}
```

#### **Phase 4: Spezial-Fähigkeiten**
```javascript
// Zwischen den Stages führt Boss spezielle Aktionen aus
executeSpecialAbility(abilityType) {
    switch(abilityType) {
        case 'shield_phase':
            this.activateShield(3000); // 3s Schild
            break;
        case 'teleport_phase':
            this.teleportBoss();
            break;
        case 'minion_summon':
            this.spawnMinions(2);
            break;
    }
}
```

### **🎨 Visuelle Boss-Features:**

#### **Boss-Health-Bar (Oben im Bildschirm)**
```html
<div id="bossHealthBar" class="boss-health-container">
    <div class="boss-name" id="bossName">ALGEBRA-TITAN</div>
    <div class="boss-health-bar">
        <div class="boss-health-fill" id="bossHealthFill"></div>
        <div class="boss-health-text" id="bossHealthText">300/300</div>
    </div>
    <div class="boss-stage-indicator" id="bossStageIndicator">Stage 1/3</div>
</div>
```

#### **Boss-Rendering (Größer als normale Gegner)**
```javascript
renderBoss(ctx) {
    // Größere Darstellung
    const size = this.size.width;
    
    // Spezial-Glow-Effekt
    ctx.shadowColor = this.glowColor;
    ctx.shadowBlur = 20;
    
    // Boss-Icon (größer)
    ctx.font = `${size * 0.8}px Arial`;
    ctx.fillText(this.icon, this.x, this.y);
    
    // Pulsierender Effekt
    const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 1;
    ctx.scale(pulse, pulse);
}
```

### **⚔️ Boss-Mechaniken im Detail:**

#### **1️⃣ Schild-Phase (Algebra-Titan)**
```javascript
activateShield(duration) {
    this.isShielded = true;
    this.shieldEndTime = Date.now() + duration;
    
    // Visueller Schild-Effekt
    this.renderShield = true;
    
    // Schild-Nachricht
    this.showMessage("🛡️ BOSS AKTIVIERT SCHILD! 🛡️", 2000);
    
    setTimeout(() => {
        this.isShielded = false;
        this.renderShield = false;
    }, duration);
}
```

#### **2️⃣ Teleport-Phase (Polynom-Kaiser)**
```javascript
teleportBoss() {
    // Teleport-Animation
    this.startTeleportEffect();
    
    setTimeout(() => {
        // Neue zufällige Position
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        
        this.endTeleportEffect();
        this.showMessage("💫 BOSS TELEPORTIERT! 💫", 1500);
    }, 1000);
}
```

#### **3️⃣ Minion-Beschwörung (Gleichungs-Overlord)**
```javascript
spawnMinions(count) {
    this.showMessage("👹 BOSS BESCHWÖRT VERSTÄRKUNG! 👹", 2000);
    
    for (let i = 0; i < count; i++) {
        const minion = new Enemy(
            this.x + (i * 60), 
            this.y + 100, 
            'polynom_zombie'
        );
        minion.health = 50; // Schwächere Minions
        this.gameEngine.enemySpawner.enemies.push(minion);
    }
}
```

### **🏆 Boss-Belohnungen:**

#### **Erhöhte Belohnungen**
```javascript
onBossDefeated() {
    const boss = this.currentBoss;
    
    // 3x normale Belohnungen
    this.currencySystem.addCoins(boss.coinReward);
    this.levelSystem.addXP(boss.xpReward);
    
    // Garantiertes seltenes Upgrade
    this.levelUpSystem.guaranteeRareUpgrade();
    
    // Boss-Defeat-Animation
    this.playBossDefeatAnimation();
    
    // Spezielle Boss-Nachricht
    this.showMessage(`🏆 ${boss.name} BESIEGT! 🏆`, 3000);
}
```

## ✅ **ERFOLGS-KRITERIEN:**

### **MUSS erfüllt sein:**
1. **Boss spawnt** alle 5 Wellen korrekt
2. **Multi-Stage System** funktioniert (3-5 Formeln pro Boss)
3. **Boss-Health-Bar** wird korrekt angezeigt und aktualisiert
4. **Spezial-Fähigkeiten** werden zwischen Stages ausgeführt
5. **Boss-Belohnungen** sind erhöht (3x normale Werte)
6. **Visuelle Effekte** (Glow, Größe, Animationen) funktionieren
7. **Keine JavaScript-Fehler** in der Konsole
8. **Boss-Defeat** beendet die Welle korrekt

### **TEST-KOMMANDOS:**
```javascript
// Direkt zu Boss-Welle springen
window.game.waveSystem.currentWave = 4;
window.game.waveSystem.startNextWave(); // Sollte Boss-Welle 5 starten

// Boss-Gesundheit prüfen
window.game.enemySpawner.currentBoss?.health;

// Boss-Stage prüfen
window.game.enemySpawner.currentBoss?.currentStage;

// Boss manuell spawnen (Debug)
window.game.enemySpawner.spawnBoss(5);
```

## ⚠️ **WICHTIGE IMPLEMENTIERUNGS-REGELN:**

### **Boss-Balancing:**
- **Boss-HP**: Skaliert mit Wellen-Nummer (Welle 5: 300 HP, Welle 10: 500 HP, etc.)
- **Formel-Schwierigkeit**: Bosse haben schwerere Formeln als normale Gegner
- **Timing**: Jede Formel-Stage sollte 15-30 Sekunden dauern
- **Belohnungen**: Immer 3x normale Werte (Coins, XP, Upgrade-Chance)

### **Performance:**
- **Nur ein Boss**: Niemals mehrere Bosse gleichzeitig
- **Cleanup**: Boss-Objekte nach Defeat korrekt entfernen
- **Memory**: Boss-Animationen nach Kampf stoppen

### **User Experience:**
- **Klare Kommunikation**: Immer anzeigen welche Stage aktiv ist
- **Feedback**: Sofortiges visuelles Feedback bei korrekten Antworten
- **Progression**: Deutlich sichtbare Health-Bar-Reduktion pro Stage

## 🔄 **NACH DER IMPLEMENTIERUNG:**

### **Vollständiger Test-Ablauf:**
1. **Starte Spiel** und erreiche Welle 5
2. **Boss-Ankündigung** sollte erscheinen
3. **Boss spawnt** mit korrekter Health-Bar
4. **Löse erste Formel** → Boss sollte Schaden nehmen und Spezial-Fähigkeit ausführen
5. **Wiederhole** bis alle Stages abgeschlossen
6. **Boss-Defeat** sollte erhöhte Belohnungen geben
7. **Nächste Welle** sollte normal starten

### **AUSGABE-FORMAT:**
```
✅ Boss-System erfolgreich implementiert!
🐉 Boss-Typen: 3 (Algebra-Titan, Polynom-Kaiser, Gleichungs-Overlord)
⚔️ Multi-Stage System: 3-5 Formeln pro Boss
🛡️ Spezial-Fähigkeiten: Schild, Teleport, Minion-Beschwörung
🏆 Erhöhte Belohnungen: 3x Coins/XP + garantiertes seltenes Upgrade
🎨 Visuelle Features: Boss-Health-Bar, Glow-Effekte, Größe

TEST-KOMMANDOS:
- window.game.waveSystem.currentWave = 4; window.game.waveSystem.startNextWave()
- window.game.enemySpawner.spawnBoss(5)
```

---

**WICHTIG:** Implementiere das Boss-System vollständig funktional mit allen visuellen Effekten und Spezial-Mechaniken. Das Boss-System ist ein Kern-Feature das das Gameplay erheblich verbessert!
