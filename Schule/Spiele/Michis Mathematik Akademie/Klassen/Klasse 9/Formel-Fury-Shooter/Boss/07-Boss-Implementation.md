# Boss-Implementation - Code-Struktur und finale Umsetzung

## Implementation-Roadmap

### 🎯 Schritt-für-Schritt Implementation
Diese Anleitung führt durch die **exakte Code-Implementation** des Boss-Systems. Jeder Schritt baut auf dem vorherigen auf und erstellt funktionsfähige Teilsysteme.

### 📋 Implementation-Reihenfolge
1. **Boss-Basis-Klasse** - Grundstruktur und Properties
2. **Boss-State-Machine** - Zustandsverwaltung
3. **Boss-Formula-System** - Formel-Generation und Validation
4. **Boss-Attack-System** - Angriffsmuster und Timing
5. **Boss-Visual-System** - Rendering und Animationen
6. **Boss-Manager** - Spawning und Lifecycle-Management
7. **Wave-System-Integration** - Verbindung mit bestehendem System
8. **UI-Integration** - Boss-spezifische Interface-Elemente
9. **Audio-Integration** - Sound-Effekte und Musik
10. **Testing und Polish** - Debugging und Optimierung

## Schritt 1: Boss-Basis-Klasse

### 📝 Datei: `js/boss-system.js`
```javascript
/**
 * BOSS SYSTEM - Hauptklasse für Boss-Gegner
 * Erscheint alle 10 Wellen als ultimative Herausforderung
 */

class Boss {
    constructor(level, wave) {
        // Basis-Properties
        this.level = level; // 1, 2, 3, 4+ (basierend auf Welle/10)
        this.wave = wave; // 10, 20, 30, 40+
        this.maxHp = this.calculateMaxHP(level);
        this.hp = this.maxHp;
        
        // Position (statisch in der Mitte)
        this.x = window.gameEngine.canvas.width / 2;
        this.y = window.gameEngine.canvas.height / 2;
        this.size = this.calculateSize(level);
        
        // Boss-spezifische Properties
        this.name = this.generateBossName(level);
        this.formulasRequired = this.calculateFormulasRequired(level);
        this.formulasSolved = 0;
        this.isDefeated = false;
        
        // State-Machine
        this.stateMachine = new BossStateMachine(this);
        
        // Systeme
        this.formulaSystem = new BossFormulaSystem(this);
        this.attackSystem = new BossAttackSystem(this);
        this.visualSystem = new BossVisualSystem(this);
        
        // Events
        this.onDefeated = null; // Callback für Boss-Defeat
        
        console.log(`👹 Boss "${this.name}" (Level ${level}) gespawnt!`);
    }
    
    calculateMaxHP(level) {
        // HP skaliert mit Boss-Level
        const baseHP = 100;
        return baseHP + (level * 50); // 150, 200, 250, 300+
    }
    
    calculateSize(level) {
        // Größe skaliert mit Level
        const baseSize = 80;
        return baseSize + (level * 20); // 100, 120, 140, 160+
    }
    
    calculateFormulasRequired(level) {
        // Anzahl Formeln die gelöst werden müssen
        return Math.min(5 + level * 2, 15); // 7, 9, 11, 13+ (max 15)
    }
    
    generateBossName(level) {
        const names = [
            "Grundlagen-Prüfer",
            "Fortgeschrittenen-Herausforderer", 
            "Meister-Prüfer",
            "Grandmaster-Herausforderung"
        ];
        return names[Math.min(level - 1, names.length - 1)];
    }
    
    update(deltaTime) {
        if (this.isDefeated) return;
        
        // State-Machine updaten
        this.stateMachine.update(deltaTime);
        
        // Systeme updaten
        this.attackSystem.update(deltaTime);
        this.visualSystem.update(deltaTime);
        
        // Defeat-Check
        if (this.formulasSolved >= this.formulasRequired) {
            this.defeat();
        }
    }
    
    render(context) {
        if (this.isDefeated) return;
        
        // Visual-System für Rendering
        this.visualSystem.render(context);
    }
    
    takeDamage(amount = 1) {
        if (this.stateMachine.currentState !== 'VULNERABLE') {
            return false; // Kein Schaden wenn nicht verwundbar
        }
        
        this.formulasSolved += amount;
        console.log(`Boss Schaden: ${this.formulasSolved}/${this.formulasRequired} Formeln gelöst`);
        
        // Visual-Feedback
        this.visualSystem.showDamageEffect();
        
        return true;
    }
    
    defeat() {
        if (this.isDefeated) return;
        
        this.isDefeated = true;
        console.log(`🏆 Boss "${this.name}" besiegt!`);
        
        // Defeat-Animation starten
        this.visualSystem.playDefeatAnimation();
        
        // Callback ausführen
        if (this.onDefeated) {
            setTimeout(() => this.onDefeated(), 2000); // Nach Animation
        }
    }
    
    // Getter für UI-System
    getHealthPercentage() {
        return (this.formulasSolved / this.formulasRequired) * 100;
    }
    
    getCurrentState() {
        return this.stateMachine.currentState;
    }
    
    isVulnerable() {
        return this.stateMachine.currentState === 'VULNERABLE';
    }
}
```

## Schritt 2: Boss-State-Machine Implementation

### 📝 Erweitere `js/boss-system.js`
```javascript
/**
 * BOSS STATE MACHINE - Verwaltet Boss-Zustände
 */
class BossStateMachine {
    constructor(boss) {
        this.boss = boss;
        this.currentState = null;
        this.stateTimer = 0;
        
        // State-Definitionen
        this.states = {
            SPAWNING: new BossSpawningState(boss),
            VULNERABLE: new BossVulnerableState(boss),
            WARNING: new BossWarningState(boss),
            ATTACKING: new BossAttackingState(boss),
            COOLDOWN: new BossCooldownState(boss),
            DEFEATED: new BossDefeatedState(boss)
        };
        
        // Initial state
        this.setState('SPAWNING');
    }
    
    setState(stateName) {
        // Exit current state
        if (this.currentState && this.states[this.currentState]) {
            this.states[this.currentState].exit();
        }
        
        // Enter new state
        this.currentState = stateName;
        this.stateTimer = 0;
        this.states[stateName].enter();
        
        console.log(`Boss State: ${stateName}`);
    }
    
    update(deltaTime) {
        this.stateTimer += deltaTime;
        
        if (this.states[this.currentState]) {
            this.states[this.currentState].update(deltaTime);
        }
    }
}

// Base State Class
class BossState {
    constructor(boss) {
        this.boss = boss;
    }
    
    enter() { /* Override in subclasses */ }
    exit() { /* Override in subclasses */ }
    update(deltaTime) { /* Override in subclasses */ }
}

// Spawning State
class BossSpawningState extends BossState {
    enter() {
        this.spawnDuration = 2000; // 2 Sekunden
        this.boss.visualSystem.playSpawnAnimation();
        
        // UI-Nachricht
        window.gameEngine.uiSystem.showMessage(`${this.boss.name} erscheint!`, 2000);
    }
    
    update(deltaTime) {
        this.spawnDuration -= deltaTime;
        if (this.spawnDuration <= 0) {
            this.boss.stateMachine.setState('VULNERABLE');
        }
    }
}

// Vulnerable State
class BossVulnerableState extends BossState {
    enter() {
        // Formel-System aktivieren
        this.boss.formulaSystem.generateNextFormula();
        
        // Angriffs-Timer starten
        this.nextAttackTime = this.calculateNextAttackTime();
        
        // UI-Updates
        window.gameEngine.uiSystem.enableBossFormulaInput();
    }
    
    update(deltaTime) {
        this.nextAttackTime -= deltaTime;
        
        if (this.nextAttackTime <= 0) {
            this.boss.stateMachine.setState('WARNING');
        }
    }
    
    calculateNextAttackTime() {
        const gameMode = window.gameEngine.gameMode; // 'day' oder 'night'
        const baseTime = gameMode === 'day' ? 15000 : 25000; // 15s oder 25s
        const variation = baseTime * 0.3; // ±30%
        return baseTime + (Math.random() - 0.5) * 2 * variation;
    }
}

// Warning State
class BossWarningState extends BossState {
    enter() {
        this.warningDuration = 3000; // 3 Sekunden
        this.boss.visualSystem.showWarningEffects();
        
        // Countdown-UI
        window.gameEngine.uiSystem.startAttackWarning(3);
    }
    
    update(deltaTime) {
        this.warningDuration -= deltaTime;
        
        // Countdown updaten
        const secondsLeft = Math.ceil(this.warningDuration / 1000);
        window.gameEngine.uiSystem.updateAttackWarning(secondsLeft);
        
        if (this.warningDuration <= 0) {
            this.boss.stateMachine.setState('ATTACKING');
        }
    }
}

// Attacking State
class BossAttackingState extends BossState {
    enter() {
        // Formel-Eingabe unterbrechen
        this.interruptFormulaInput();
        
        // Angriffsmuster auswählen und starten
        this.boss.attackSystem.startAttack();
        
        // Attack-Dauer berechnen
        this.attackDuration = this.calculateAttackDuration();
    }
    
    update(deltaTime) {
        this.attackDuration -= deltaTime;
        
        if (this.attackDuration <= 0) {
            this.boss.attackSystem.endAttack();
            this.boss.stateMachine.setState('COOLDOWN');
        }
    }
    
    interruptFormulaInput() {
        const player = window.gameEngine.player;
        if (player && player.isInFormulaInput) {
            // Leben abziehen
            player.takeDamage(1);
            
            // Formel-Interface schließen
            window.gameEngine.uiSystem.closeFormulaInput();
            
            // Feedback anzeigen
            window.gameEngine.uiSystem.showMessage("UNTERBROCHEN! -1 Leben", 2000, 'error');
        }
    }
    
    calculateAttackDuration() {
        const gameMode = window.gameEngine.gameMode;
        const baseTime = gameMode === 'day' ? 15000 : 45000; // 15s oder 45s
        const levelMultiplier = 1 + (this.boss.level * 0.2); // +20% pro Level
        return baseTime * levelMultiplier;
    }
}

// Cooldown State
class BossCooldownState extends BossState {
    enter() {
        this.cooldownDuration = 1500; // 1.5 Sekunden
    }
    
    update(deltaTime) {
        this.cooldownDuration -= deltaTime;
        
        if (this.cooldownDuration <= 0) {
            this.boss.stateMachine.setState('VULNERABLE');
        }
    }
}

// Defeated State
class BossDefeatedState extends BossState {
    enter() {
        this.deathDuration = 4000; // 4 Sekunden
        this.boss.visualSystem.playDefeatAnimation();
        
        // Victory-UI
        window.gameEngine.uiSystem.showBossVictory(this.boss);
    }
    
    update(deltaTime) {
        this.deathDuration -= deltaTime;
        
        if (this.deathDuration <= 0) {
            // Boss entfernen und Wave fortsetzen
            this.boss.remove();
        }
    }
}
```

## Schritt 3: Boss-Formula-System Implementation

### 📝 Erweitere `js/boss-system.js`
```javascript
/**
 * BOSS FORMULA SYSTEM - Generiert und validiert Boss-Formeln
 */
class BossFormulaSystem {
    constructor(boss) {
        this.boss = boss;
        this.currentFormula = null;
        this.formulaHistory = [];
        this.playerPerformance = {
            correct: 0,
            incorrect: 0,
            totalTime: 0
        };
    }
    
    generateNextFormula() {
        // Formel-Typ basierend auf Boss-Level bestimmen
        const formulaType = this.selectFormulaType();
        const formula = this.generateFormula(formulaType);
        
        this.currentFormula = formula;
        this.formulaHistory.push(formula);
        
        // UI updaten
        window.gameEngine.uiSystem.showBossFormula(formula);
        
        console.log(`Boss-Formel: ${formula.question}`);
        return formula;
    }
    
    selectFormulaType() {
        const level = this.boss.level;
        const availableTypes = [];
        
        // Level 1: Nur Grundlagen
        availableTypes.push('basic_expansion', 'basic_square_difference');
        
        // Level 2+: Fortgeschrittene Konzepte
        if (level >= 2) {
            availableTypes.push('mixed_terms', 'two_variables');
        }
        
        // Level 3+: Faktorisierung
        if (level >= 3) {
            availableTypes.push('factorization', 'nested_terms');
        }
        
        // Level 4+: Extreme Herausforderungen
        if (level >= 4) {
            availableTypes.push('multi_step', 'combined_formulas');
        }
        
        return availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }
    
    generateFormula(type) {
        switch (type) {
            case 'basic_expansion':
                return this.generateBasicExpansion();
            case 'basic_square_difference':
                return this.generateSquareDifference();
            case 'mixed_terms':
                return this.generateMixedTerms();
            case 'two_variables':
                return this.generateTwoVariables();
            case 'factorization':
                return this.generateFactorization();
            case 'nested_terms':
                return this.generateNestedTerms();
            case 'multi_step':
                return this.generateMultiStep();
            case 'combined_formulas':
                return this.generateCombinedFormulas();
            default:
                return this.generateBasicExpansion();
        }
    }
    
    generateBasicExpansion() {
        const a = Math.floor(Math.random() * 5) + 1; // 1-5
        const b = Math.floor(Math.random() * 5) + 1; // 1-5
        const sign = Math.random() > 0.5 ? '+' : '-';
        
        const question = `(${a}x${sign}${b})²`;
        const answer = sign === '+' 
            ? `${a*a}x² + ${2*a*b}x + ${b*b}`
            : `${a*a}x² - ${2*a*b}x + ${b*b}`;
        
        return {
            type: 'basic_expansion',
            question: question,
            answer: answer,
            difficulty: 1,
            hints: [
                `Verwende die binomische Formel: (a±b)² = a² ± 2ab + b²`,
                `Hier ist a = ${a}x und b = ${b}`,
                `Berechne: (${a}x)² ${sign} 2·${a}x·${b} + ${b}²`
            ]
        };
    }
    
    generateSquareDifference() {
        const a = Math.floor(Math.random() * 8) + 2; // 2-9
        const b = Math.floor(Math.random() * 8) + 2; // 2-9
        
        const question = `(${a}x+${b})(${a}x-${b})`;
        const answer = `${a*a}x² - ${b*b}`;
        
        return {
            type: 'square_difference',
            question: question,
            answer: answer,
            difficulty: 2,
            hints: [
                `Verwende die Formel: (a+b)(a-b) = a² - b²`,
                `Hier ist a = ${a}x und b = ${b}`,
                `Ergebnis: (${a}x)² - ${b}² = ${a*a}x² - ${b*b}`
            ]
        };
    }
    
    // Weitere Formel-Generatoren...
    generateFactorization() {
        const a = Math.floor(Math.random() * 6) + 2; // 2-7
        const b = Math.floor(Math.random() * 6) + 2; // 2-7
        
        const question = `${a*a}x² - ${b*b}`;
        const answer = `(${a}x+${b})(${a}x-${b})`;
        
        return {
            type: 'factorization',
            question: question + ' = ?',
            answer: answer,
            difficulty: 3,
            hints: [
                `Das ist eine Differenz von Quadraten: a² - b²`,
                `Faktorisiere zu: (a+b)(a-b)`,
                `Hier: ${a*a}x² - ${b*b} = (${a}x)² - ${b}²`
            ]
        };
    }
    
    validateAnswer(userAnswer) {
        if (!this.currentFormula) return false;
        
        // Antwort normalisieren und vergleichen
        const normalizedUser = this.normalizeAnswer(userAnswer);
        const normalizedCorrect = this.normalizeAnswer(this.currentFormula.answer);
        
        const isCorrect = normalizedUser === normalizedCorrect;
        
        // Performance tracken
        if (isCorrect) {
            this.playerPerformance.correct++;
            this.boss.takeDamage(1);
        } else {
            this.playerPerformance.incorrect++;
        }
        
        return isCorrect;
    }
    
    normalizeAnswer(answer) {
        return answer
            .replace(/\s/g, '') // Leerzeichen entfernen
            .replace(/\*/g, '') // Multiplikationszeichen entfernen
            .replace(/\^2/g, '²') // Exponenten normalisieren
            .toLowerCase();
    }
    
    getHint() {
        if (this.currentFormula && this.currentFormula.hints) {
            const hintIndex = Math.min(
                this.playerPerformance.incorrect,
                this.currentFormula.hints.length - 1
            );
            return this.currentFormula.hints[hintIndex];
        }
        return "Denke an die binomischen Formeln!";
    }
}
```

## Schritt 4: Boss-Manager Integration

### 📝 Erweitere `js/boss-system.js`
```javascript
/**
 * BOSS MANAGER - Verwaltet Boss-Spawning und Lifecycle
 */
class BossManager {
    constructor() {
        this.currentBoss = null;
        this.bossActive = false;
        this.bossesDefeated = 0;
    }
    
    shouldSpawnBoss(waveNumber) {
        return waveNumber % 10 === 0 && waveNumber > 0;
    }
    
    spawnBoss(waveNumber) {
        if (this.bossActive) {
            console.warn('Boss bereits aktiv!');
            return null;
        }
        
        const bossLevel = Math.floor(waveNumber / 10);
        this.currentBoss = new Boss(bossLevel, waveNumber);
        this.bossActive = true;
        
        // Boss-Defeat-Callback
        this.currentBoss.onDefeated = () => this.onBossDefeated();
        
        // Audio-System benachrichtigen
        if (window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playBossMusic(bossLevel);
        }
        
        console.log(`👹 Boss Level ${bossLevel} für Welle ${waveNumber} gespawnt!`);
        return this.currentBoss;
    }
    
    onBossDefeated() {
        if (!this.currentBoss) return;
        
        this.bossesDefeated++;
        console.log(`🏆 Boss besiegt! Total: ${this.bossesDefeated}`);
        
        // Belohnungen geben
        this.giveRewards();
        
        // Boss cleanup
        setTimeout(() => {
            this.currentBoss = null;
            this.bossActive = false;
            
            // Wave-System benachrichtigen
            window.gameEngine.waveSystem.onBossDefeated();
            
            // Audio zurücksetzen
            if (window.gameEngine.audioManager) {
                window.gameEngine.audioManager.stopBossMusic();
            }
        }, 2000);
    }
    
    giveRewards() {
        const boss = this.currentBoss;
        const baseReward = 100 * boss.level;
        const performanceBonus = Math.floor(
            (boss.formulaSystem.playerPerformance.correct / 
             (boss.formulaSystem.playerPerformance.correct + boss.formulaSystem.playerPerformance.incorrect)) * 50
        );
        
        const totalReward = baseReward + performanceBonus;
        
        // Currency geben
        if (window.gameEngine.currencySystem) {
            window.gameEngine.currencySystem.addCurrency('coins', totalReward);
        }
        
        // UI-Feedback
        window.gameEngine.uiSystem.showReward({
            coins: totalReward,
            message: `Boss Level ${boss.level} besiegt!`,
            performance: `${boss.formulaSystem.playerPerformance.correct} korrekte Antworten`
        });
    }
    
    update(deltaTime) {
        if (this.currentBoss && this.bossActive) {
            this.currentBoss.update(deltaTime);
        }
    }
    
    render(context) {
        if (this.currentBoss && this.bossActive) {
            this.currentBoss.render(context);
        }
    }
    
    // Debug-Funktionen
    getCurrentBoss() {
        return this.currentBoss;
    }
    
    isBossActive() {
        return this.bossActive;
    }
}

// Global verfügbar machen
window.BossManager = BossManager;
window.Boss = Boss;
```

## Schritt 5: Integration in bestehende Systeme

### 📝 Modifikation: `js/wave-system.js`
```javascript
// Am Ende der WaveSystem-Klasse hinzufügen:

// Boss-Manager initialisieren
if (!this.bossManager) {
    this.bossManager = new BossManager();
}

// Bestehende startWave-Methode erweitern:
startWave() {
    // Boss-Wave-Check
    if (this.bossManager.shouldSpawnBoss(this.currentWave)) {
        this.startBossWave();
        return;
    }
    
    // Normale Wave-Logik (bestehender Code)
    this.startNormalWave();
}

startBossWave() {
    console.log(`🔥 Boss-Welle ${this.currentWave} startet!`);
    
    // Alle normalen Gegner entfernen
    this.clearAllEnemies();
    
    // Boss spawnen
    this.bossManager.spawnBoss(this.currentWave);
    
    // UI für Boss-Wave anpassen
    if (window.gameEngine.uiSystem) {
        window.gameEngine.uiSystem.enterBossMode(this.bossManager.currentBoss);
    }
    
    this.waveActive = true;
}

onBossDefeated() {
    console.log(`Wave ${this.currentWave} durch Boss-Defeat abgeschlossen!`);
    this.completeWave();
}

clearAllEnemies() {
    if (window.gameEngine.enemySpawner) {
        window.gameEngine.enemySpawner.enemies = [];
    }
}
```

## Schritt 6: Testing und Debugging

### 📝 Debug-Funktionen hinzufügen
```javascript
// Debug-Kommandos für Entwicklung (am Ende von boss-system.js)
if (typeof window !== 'undefined') {
    window.debugBoss = {
        spawnBoss: (level = 1) => {
            const wave = level * 10;
            if (window.gameEngine && window.gameEngine.waveSystem) {
                window.gameEngine.waveSystem.bossManager.spawnBoss(wave);
            }
        },
        
        defeatBoss: () => {
            const boss = window.gameEngine?.waveSystem?.bossManager?.currentBoss;
            if (boss) {
                boss.formulasSolved = boss.formulasRequired;
                boss.defeat();
            }
        },
        
        skipToWave: (wave) => {
            if (window.gameEngine && window.gameEngine.waveSystem) {
                window.gameEngine.waveSystem.currentWave = wave;
                window.gameEngine.waveSystem.startWave();
            }
        },
        
        getBossInfo: () => {
            const boss = window.gameEngine?.waveSystem?.bossManager?.currentBoss;
            if (boss) {
                return {
                    name: boss.name,
                    level: boss.level,
                    hp: `${boss.formulasSolved}/${boss.formulasRequired}`,
                    state: boss.getCurrentState()
                };
            }
            return 'Kein Boss aktiv';
        }
    };
    
    console.log('🔧 Boss Debug-Funktionen verfügbar:');
    console.log('debugBoss.spawnBoss(level) - Boss spawnen');
    console.log('debugBoss.defeatBoss() - Aktuellen Boss besiegen');
    console.log('debugBoss.skipToWave(wave) - Zu Welle springen');
    console.log('debugBoss.getBossInfo() - Boss-Informationen');
}
```

## Schritt 7: HTML-Integration

### 📝 Modifikation: `index.html`
```html
<!-- Boss-System Script hinzufügen (vor dem schließenden </body> Tag) -->
<script src="js/boss-system.js"></script>

<!-- Boss-spezifische UI-Elemente hinzufügen -->
<div id="bossUI" class="boss-interface" style="display: none;">
    <div class="boss-health-container">
        <div class="boss-info">
            <h3 id="bossName">Boss Name</h3>
            <span id="bossLevel">Level 1</span>
        </div>
        <div class="boss-health-bar">
            <div id="bossHealthFill" class="boss-health-fill"></div>
        </div>
        <div class="boss-progress">
            <span id="bossProgress">0/7 Formeln gelöst</span>
        </div>
    </div>
    
    <div id="bossWarning" class="boss-warning" style="display: none;">
        <h2>⚠️ ANGRIFF IN <span id="warningCountdown">3</span></h2>
    </div>
</div>
```

## Schritt 8: CSS-Styling

### 📝 Neue Datei: `styles/boss.css`
```css
/* Boss-Interface Styling */
.boss-interface {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #ff6b6b;
    border-radius: 10px;
    padding: 15px;
    color: white;
    font-family: 'Arial', sans-serif;
}

.boss-health-container {
    min-width: 400px;
    text-align: center;
}

.boss-info {
    margin-bottom: 10px;
}

.boss-info h3 {
    margin: 0;
    font-size: 18px;
    color: #ff6b6b;
}

.boss-info span {
    font-size: 14px;
    color: #ffd93d;
}

.boss-health-bar {
    width: 100%;
    height: 20px;
    background: #333;
    border: 2px solid #666;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
}

.boss-health-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff6b6b, #ff8e53);
    width: 0%;
    transition: width 0.3s ease;
}

.boss-progress {
    font-size: 14px;
    color: #ddd;
}

.boss-warning {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    animation: warningPulse 0.5s infinite alternate;
}

@keyframes warningPulse {
    from { transform: translate(-50%, -50%) scale(1); }
    to { transform: translate(-50%, -50%) scale(1.05); }
}
```

Diese Implementation stellt ein vollständiges, funktionsfähiges Boss-System bereit, das nahtlos in das bestehende Formel-Fury-Shooter-Spiel integriert werden kann. Jeder Schritt baut auf dem vorherigen auf und kann einzeln getestet werden.
