/**
 * FORMEL-FURY-SHOOTER - BOSS SYSTEM
 * Hauptklasse für Boss-Gegner - erscheint alle 10 Wellen als ultimative Herausforderung
 * Implementiert nach Boss-System-Overview.md
 */

console.log('🔧 Boss System loading...');

class Boss {
    constructor(level, wave) {
        // Basis-Properties
        this.level = level; // 1, 2, 3, 4+ (basierend auf Welle/10)
        this.wave = wave; // 10, 20, 30, 40+
        this.maxHp = this.calculateMaxHP(level);
        this.hp = this.maxHp;
        
        // Position (statisch in der Mitte)
        this.x = window.gameEngine ? window.gameEngine.canvas.width / 2 : 400;
        this.y = window.gameEngine ? window.gameEngine.canvas.height / 2 : 300;
        this.size = this.calculateSize(level);
        
        // Boss-spezifische Properties
        this.name = this.generateBossName(level);
        this.formulasRequired = this.calculateFormulasRequired(level);
        this.formulasSolved = 0;
        this.isDefeated = false;
        
        // State-Machine
        this.stateMachine = new BossStateMachine(this);
        this.currentState = 'SPAWNING';
        
        // Systeme
        this.formulaSystem = new BossFormulaSystem(this);
        this.attackSystem = null; // new BossAttackSystem(this);
        this.visualSystem = new BossVisualSystem(this);
        
        // Timing
        this.spawnTimer = 2000; // 2 Sekunden Spawn-Animation
        this.stateTimer = 0;
        
        // Events
        this.onDefeated = null;
        
        // Attack System Properties
        this.nextAttackTime = this.calculateNextAttackTime();
        this.currentAttackDuration = 0;
        this.cooldownDuration = 1000; // 1 second cooldown
        this.warningCountdown = 3;
        this.lastUsedPattern = null;
        this.attackPatterns = this.initializeAttackPatterns();
        this.isGameDayMode = this.detectGameMode();
        
        console.log(`👹 Boss "${this.name}" (Level ${level}) gespawnt!`);
        console.log(`📊 Boss Stats: ${this.formulasSolved}/${this.formulasRequired} Formeln, ${this.hp}/${this.maxHp} HP`);
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
        
        // Boss State Machine
        if (this.stateMachine) {
            this.stateMachine.update(deltaTime);
        }
        
        // Systeme updaten
        if (this.formulaSystem) {
            this.formulaSystem.update(deltaTime);
        }
        if (this.attackSystem) {
            this.attackSystem.update(deltaTime);
        }
        if (this.visualSystem) {
            this.visualSystem.update(deltaTime);
        }
        
        // Defeat-Check via Formula System
        if (this.formulaSystem && this.formulaSystem.checkBossDefeat()) {
            this.defeat();
        }
    }
    
    updateStateMachine(deltaTime) {
        this.stateTimer += deltaTime;
        
        switch(this.currentState) {
            case 'SPAWNING':
                if (this.stateTimer >= this.spawnTimer) {
                    this.setState('VULNERABLE');
                    this.scheduleNextAttack();
                }
                break;
                
            case 'VULNERABLE':
                // Check if it's time for next attack
                if (this.stateTimer >= this.nextAttackTime) {
                    this.setState('WARNING');
                }
                break;
                
            case 'WARNING':
                this.updateWarning(deltaTime);
                if (this.stateTimer >= 3000) { // 3 second warning
                    this.setState('ATTACKING');
                }
                break;
                
            case 'ATTACKING':
                this.updateAttack(deltaTime);
                if (this.stateTimer >= this.currentAttackDuration) {
                    this.setState('COOLDOWN');
                }
                break;
                
            case 'COOLDOWN':
                if (this.stateTimer >= this.cooldownDuration) {
                    this.setState('VULNERABLE');
                    this.scheduleNextAttack();
                }
                break;
                
            case 'DEFEATED':
                // Boss ist besiegt
                break;
        }
    }
    
    // Attack System Methods
    calculateNextAttackTime() {
        // Pause zwischen Angriffen: 5-10s (Tag) / 10-15s (Nacht)
        const minPause = this.isGameDayMode ? 5000 : 10000;
        const maxPause = this.isGameDayMode ? 10000 : 15000;
        return Math.random() * (maxPause - minPause) + minPause;
    }
    
    scheduleNextAttack() {
        this.nextAttackTime = this.calculateNextAttackTime();
    }
    
    initializeAttackPatterns() {
        const patterns = {
            1: [ // Welle 10 - Grundlagen-Prüfer
                {
                    name: "Algebra-Wellen",
                    visual: "Mathematische Symbole fliegen über den Bildschirm",
                    effect: "Bildschirm wackelt leicht",
                    dayDuration: [10000, 15000],
                    nightDuration: [30000, 40000]
                },
                {
                    name: "Zahlen-Regen",
                    visual: "Zahlen fallen vom Himmel",
                    effect: "Leichte Bildschirm-Verzerrung",
                    dayDuration: [15000, 20000],
                    nightDuration: [40000, 50000]
                }
            ],
            2: [ // Welle 20 - Fortgeschrittenen-Herausforderer
                {
                    name: "Formel-Sturm",
                    visual: "Komplette Formeln wirbeln um den Boss",
                    effect: "Bildschirm pulsiert",
                    dayDuration: [12000, 18000],
                    nightDuration: [35000, 45000]
                },
                {
                    name: "Variable-Chaos",
                    visual: "X, Y, Z Variablen explodieren um den Boss",
                    effect: "Farbverzerrung des Bildschirms",
                    dayDuration: [15000, 22000],
                    nightDuration: [40000, 55000]
                },
                {
                    name: "Binomial-Blitz",
                    visual: "Binomische Formeln erscheinen und verschwinden schnell",
                    effect: "Stroboskop-Effekt",
                    dayDuration: [18000, 25000],
                    nightDuration: [45000, 60000]
                }
            ],
            3: [ // Welle 30 - Meister-Prüfer
                {
                    name: "Faktorisierungs-Wirbel",
                    visual: "Terme werden live faktorisiert und wieder zusammengesetzt",
                    effect: "Bildschirm dreht sich leicht",
                    dayDuration: [15000, 25000],
                    nightDuration: [40000, 60000]
                },
                {
                    name: "Polynom-Explosion",
                    visual: "Komplexe Polynome explodieren in ihre Faktoren",
                    effect: "Schockwellen-Effekt",
                    dayDuration: [18000, 28000],
                    nightDuration: [45000, 60000]
                },
                {
                    name: "Gleichungs-Matrix",
                    visual: "Matrix aus Gleichungen umhüllt den Boss",
                    effect: "Matrix-ähnlicher Regen-Effekt",
                    dayDuration: [20000, 30000],
                    nightDuration: [50000, 60000]
                },
                {
                    name: "Algebra-Tornado",
                    visual: "Alle mathematischen Symbole wirbeln in einem Tornado",
                    effect: "Bildschirm wird in Tornado-Bewegung verzerrt",
                    dayDuration: [22000, 30000],
                    nightDuration: [55000, 60000]
                }
            ],
            4: [ // Welle 40+ - Grandmaster-Herausforderung
                {
                    name: "Mathematik-Apokalypse",
                    visual: "Alle mathematischen Konzepte gleichzeitig",
                    effect: "Komplette Bildschirm-Transformation",
                    dayDuration: [25000, 30000],
                    nightDuration: [60000, 60000]
                },
                {
                    name: "Formel-Fusion",
                    visual: "Verschiedene Formeln verschmelzen zu Super-Formeln",
                    effect: "Kaleidoskop-Effekt mit Formeln",
                    dayDuration: [28000, 30000],
                    nightDuration: [60000, 60000]
                }
            ]
        };
        
        // Add all previous patterns for level 4+
        if (this.level >= 4) {
            patterns[4] = [...patterns[1], ...patterns[2], ...patterns[3], ...patterns[4]];
        }
        
        return patterns[Math.min(this.level, 4)] || patterns[1];
    }
    
    detectGameMode() {
        // Try to detect if we're in day or night mode
        if (window.gameEngine && window.gameEngine.gameMode) {
            return window.gameEngine.gameMode === 'day';
        }
        return true; // Default to day mode
    }
    
    selectAttackPattern() {
        const availablePatterns = this.attackPatterns.filter(pattern => 
            pattern.name !== this.lastUsedPattern
        );
        
        if (availablePatterns.length === 0) {
            return this.attackPatterns[0];
        }
        
        const selectedPattern = availablePatterns[Math.floor(Math.random() * availablePatterns.length)];
        this.lastUsedPattern = selectedPattern.name;
        
        // Calculate duration based on game mode
        const durationRange = this.isGameDayMode ? selectedPattern.dayDuration : selectedPattern.nightDuration;
        this.currentAttackDuration = Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0];
        
        console.log(`🔥 Boss Angriff: ${selectedPattern.name} (${Math.round(this.currentAttackDuration/1000)}s)`);
        return selectedPattern;
    }
    
    updateWarning(deltaTime) {
        const secondsLeft = Math.ceil((3000 - this.stateTimer) / 1000);
        if (secondsLeft !== this.warningCountdown) {
            this.warningCountdown = secondsLeft;
            this.showWarning(secondsLeft);
        }
    }
    
    showWarning(secondsLeft) {
        // Update Boss UI warning
        const warningElement = document.getElementById('bossWarning');
        if (warningElement) {
            warningElement.style.display = 'block';
            warningElement.textContent = `⚠️ ANGRIFF IN ${secondsLeft}...`;
        }
        
        // Audio warning
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playSound('warning', 'feedback');
        }
        
        console.log(`⚠️ ANGRIFF IN ${secondsLeft}...`);
    }
    
    updateAttack(deltaTime) {
        // Check for formula interruption
        this.checkFormulaInterruption();
        
        // Update attack visual effects (placeholder)
        if (this.stateTimer === 0) {
            this.startAttackEffects();
        }
    }
    
    checkFormulaInterruption() {
        // Check if player is currently in formula input
        const formulaInput = document.querySelector('.formula-input:not([style*="display: none"])');
        const isInFormulaInput = formulaInput && formulaInput.style.display !== 'none';
        
        if (isInFormulaInput && this.stateTimer < 500) { // Grace period of 0.5 seconds
            this.interruptFormula();
        }
    }
    
    interruptFormula() {
        console.log('💔 Formel unterbrochen! -1 Leben');
        
        // Close formula input
        const formulaInput = document.querySelector('.formula-input');
        if (formulaInput) {
            formulaInput.style.display = 'none';
        }
        
        // Lose life (if player system exists)
        if (window.gameEngine && window.gameEngine.player && window.gameEngine.player.loseLife) {
            window.gameEngine.player.loseLife(1);
        }
        
        // Show interruption feedback
        this.showInterruptionFeedback();
        
        // Audio feedback
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playSound('damage', 'feedback');
        }
    }
    
    showInterruptionFeedback() {
        // Visual feedback - red screen flash
        const canvas = window.gameEngine ? window.gameEngine.canvas : null;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            setTimeout(() => {
                // Clear the red overlay (will be cleared on next render)
            }, 200);
        }
        
        // Text feedback
        const feedbackElement = document.getElementById('gameStatus');
        if (feedbackElement) {
            const originalText = feedbackElement.textContent;
            feedbackElement.textContent = 'UNTERBROCHEN! -1 Leben';
            feedbackElement.style.color = '#ff0000';
            
            setTimeout(() => {
                feedbackElement.textContent = originalText;
                feedbackElement.style.color = '';
            }, 2000);
        }
    }
    
    startAttackEffects() {
        const currentPattern = this.selectAttackPattern();
        
        // Show attack active message
        const warningElement = document.getElementById('bossWarning');
        if (warningElement) {
            warningElement.textContent = '🔥 ANGRIFF AKTIV!';
            warningElement.style.backgroundColor = '#ff4444';
        }
        
        // Start visual effects based on pattern
        this.startPatternEffects(currentPattern);
        
        console.log(`🔥 ANGRIFF AKTIV: ${currentPattern.name}!`);
    }
    
    startPatternEffects(pattern) {
        // Placeholder for pattern-specific visual effects
        // This would be expanded in the Visual System
        console.log(`🎨 Visual Effect: ${pattern.visual}`);
        console.log(`⚡ Screen Effect: ${pattern.effect}`);
    }
    
    setState(newState) {
        console.log(`Boss State: ${this.currentState} → ${newState}`);
        this.currentState = newState;
        this.stateTimer = 0;
        
        // State-spezifische Aktionen
        switch (newState) {
            case 'WARNING':
                console.log(`⚠️ ${this.name} bereitet Angriff vor...`);
                break;
                
            case 'VULNERABLE':
                console.log(`🎯 ${this.name} ist angreifbar!`);
                // Hide warning UI
                const warningElement = document.getElementById('bossWarning');
                if (warningElement) {
                    warningElement.style.display = 'none';
                }
                // Activate formula system
                if (this.formulaSystem) {
                    this.formulaSystem.activateFormulaChallenge();
                }
                break;
                
            case 'ATTACKING':
                console.log(`🔥 ${this.name} greift an!`);
                break;
                
            case 'COOLDOWN':
                console.log(`😴 ${this.name} erholt sich...`);
                // Hide warning UI
                const warningEl = document.getElementById('bossWarning');
                if (warningEl) {
                    warningEl.style.display = 'none';
                    warningEl.style.backgroundColor = '';
                }
                break;
                
            case 'DEFEATED':
                console.log(`💀 ${this.name} wurde besiegt!`);
                // Hide Boss UI
                const bossUI = document.getElementById('bossUI');
                if (bossUI) {
                    bossUI.style.display = 'none';
                }
                break;
        }
    }
    
    render(context) {
        if (this.isDefeated) return;
        
        // Visual System Rendering
        if (this.visualSystem) {
            this.visualSystem.render(context);
        } else {
            // Fallback: Einfaches Boss-Rendering
            this.renderSimpleBoss(context);
        }
    }
    
    renderSimpleBoss(context) {
        // Boss als großer Kreis mit Level-abhängiger Farbe
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
        const color = colors[Math.min(this.level - 1, colors.length - 1)];
        
        // Boss-Körper
        context.fillStyle = color;
        context.beginPath();
        context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        context.fill();
        
        // Boss-Rand
        context.strokeStyle = '#333';
        context.lineWidth = 3;
        context.stroke();
        
        // Boss-Name
        context.fillStyle = '#fff';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText(this.name, this.x, this.y - this.size / 2 - 10);
        
        // HP-Anzeige
        const hpText = `${this.formulasSolved}/${this.formulasRequired}`;
        context.fillText(hpText, this.x, this.y + 5);
        
        // State-Anzeige
        context.font = '12px Arial';
        context.fillText(this.currentState, this.x, this.y + 20);
        
        // Spawn-Animation
        if (this.currentState === 'SPAWNING') {
            const alpha = Math.sin(this.stateTimer / 200) * 0.5 + 0.5;
            context.globalAlpha = alpha;
            context.fillStyle = '#fff';
            context.beginPath();
            context.arc(this.x, this.y, this.size / 2 + 10, 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = 1;
        }
    }
    
    takeDamage(amount = 1) {
        if (this.currentState !== 'VULNERABLE') {
            console.log(`❌ Boss nicht verwundbar (State: ${this.currentState})`);
            return false; // Kein Schaden wenn nicht verwundbar
        }
        
        this.formulasSolved += amount;
        console.log(`💥 Boss Schaden: ${this.formulasSolved}/${this.formulasRequired} Formeln gelöst`);
        
        // Visual-Feedback
        if (this.visualSystem) {
            this.visualSystem.showDamageEffect();
        }
        
        return true;
    }
    
    defeat() {
        if (this.isDefeated) return;
        
        this.isDefeated = true;
        this.setState('DEFEATED');
        console.log(`🏆 Boss "${this.name}" besiegt!`);
        
        // Defeat-Animation starten
        if (this.visualSystem) {
            this.visualSystem.playDefeatAnimation();
        }
        
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
        return this.currentState;
    }
    
    isVulnerable() {
        return this.currentState === 'VULNERABLE';
    }
    
    // Debug-Methoden
    getDebugInfo() {
        return {
            name: this.name,
            level: this.level,
            wave: this.wave,
            hp: `${this.formulasSolved}/${this.formulasRequired}`,
            state: this.currentState,
            position: `${Math.round(this.x)}, ${Math.round(this.y)}`,
            size: this.size
        };
    }
}

/**
 * BOSS MANAGER - Verwaltet Boss-Spawning und Lifecycle
 */
class BossManager {
    constructor() {
        this.currentBoss = null;
        this.bossActive = false;
        this.bossesDefeated = 0;
        
        console.log('👹 BossManager initialized');
    }
    
    shouldSpawnBoss(waveNumber) {
        return waveNumber % 10 === 0 && waveNumber > 0;
    }
    
    spawnBoss(waveNumber) {
        if (this.bossActive) {
            console.warn('⚠️ Boss already active, cannot spawn new boss');
            return this.currentBoss;
        }
        
        const bossLevel = Math.floor(waveNumber / 10);
        console.log(`👹 Spawning boss level ${bossLevel} for wave ${waveNumber}`);
        
        this.currentBoss = new Boss(bossLevel, waveNumber);
        this.bossActive = true;
        
        // Audio integration
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.onBossSpawn(this.currentBoss);
        }
        
        // Set up boss defeat callback
        this.currentBoss.onDefeated = () => {
            console.log('👹 Boss defeated callback triggered');
            this.bossActive = false;
            
            // Audio integration for defeat
            if (window.gameEngine && window.gameEngine.audioManager) {
                window.gameEngine.audioManager.onBossDefeat(this.currentBoss);
            }
            
            if (this.onBossDefeated) {
                this.onBossDefeated();
            }
            
            this.currentBoss = null;
        };
        
        return this.currentBoss;
    }
    
    onBossDefeated() {
        if (!this.currentBoss) return;
        
        this.bossesDefeated++;
        console.log(`🏆 Boss besiegt! Total: ${this.bossesDefeated}`);
        
        // Belohnungen geben (später implementieren)
        // this.giveRewards();
        
        // Boss cleanup
        setTimeout(() => {
            this.currentBoss = null;
            this.bossActive = false;
            
            // Wave-System benachrichtigen
            if (window.gameEngine && window.gameEngine.waveSystem) {
                window.gameEngine.waveSystem.onBossDefeated();
            }
            
            // Audio zurücksetzen (später implementieren)
            // if (window.gameEngine.audioManager) {
            //     window.gameEngine.audioManager.stopBossMusic();
            // }
        }, 2000);
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
    
    // Debug methods
    isBossActive() {
        return this.bossActive && this.currentBoss && !this.currentBoss.isDefeated;
    }
    
    forceBossDefeat() {
        if (this.isBossActive()) {
            this.currentBoss.defeat();
        }
    }
    
    getBossStats() {
        if (this.currentBoss) {
            return {
                level: this.currentBoss.level,
                wave: this.currentBoss.wave,
                hp: this.currentBoss.hp,
                maxHp: this.currentBoss.maxHp,
                formulasSolved: this.currentBoss.formulasSolved,
                formulasRequired: this.currentBoss.formulasRequired,
                state: this.currentBoss.stateMachine ? this.currentBoss.stateMachine.currentState : 'UNKNOWN',
                isDefeated: this.currentBoss.isDefeated
            };
        }
        return null;
    }
    
    getCurrentState() {
        return this.currentBoss && this.currentBoss.stateMachine ? 
            this.currentBoss.stateMachine.getCurrentStateName() : 'NONE';
    }
    
    canPlayerAttack() {
        return this.currentBoss && this.currentBoss.stateMachine ? 
            this.currentBoss.stateMachine.canPlayerAttack() : false;
    }
    
    onFormulaCorrect() {
        if (this.currentBoss && this.currentBoss.stateMachine) {
            this.currentBoss.stateMachine.onFormulaCorrect();
        } else if (this.currentBoss) {
            this.currentBoss.formulasSolved++;
        }
    }
    
    onFormulaIncorrect() {
        if (this.currentBoss && this.currentBoss.stateMachine) {
            this.currentBoss.stateMachine.onFormulaIncorrect();
        }
    }
}

// Boss State Machine Implementation
class BossStateMachine {
    constructor(boss) {
        this.boss = boss;
        this.currentState = null;
        // Attack timing will be handled by individual states
        this.attackTimingSystem = null;
        
        // Initialize all states
        this.states = {
            SPAWNING: new SpawningState(boss),
            VULNERABLE: new VulnerableState(boss),
            WARNING: new WarningState(boss),
            ATTACKING: new AttackingState(boss),
            COOLDOWN: new CooldownState(boss),
            DEFEATED: new DefeatedState(boss)
        };
        
        // Start in SPAWNING state
        this.setState('SPAWNING');
        
        console.log(`🤖 Boss State Machine initialized for ${boss.name}`);
    }
    
    setState(newStateName) {
        // Validate state transition
        if (!this.validateStateTransition(this.getCurrentStateName(), newStateName)) {
            console.error(`❌ Invalid state transition: ${this.getCurrentStateName()} → ${newStateName}`);
            return false;
        }
        
        // Exit current state
        if (this.currentState) {
            this.currentState.exit();
        }
        
        // Enter new state
        this.currentState = this.states[newStateName];
        if (this.currentState) {
            this.currentState.enter();
            console.log(`🔄 Boss State: ${newStateName}`);
        }
        
        return true;
    }
    
    getCurrentStateName() {
        return this.currentState ? this.currentState.constructor.name.replace('State', '').toUpperCase() : 'UNKNOWN';
    }
    
    update(deltaTime) {
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }
    
    canPlayerAttack() {
        return this.currentState ? this.currentState.canPlayerAttack : false;
    }
    
    canPlayerMove() {
        return this.currentState ? this.currentState.canPlayerMove : true;
    }
    
    onFormulaCorrect() {
        if (this.currentState && this.currentState.onFormulaCorrect) {
            this.currentState.onFormulaCorrect();
        }
    }
    
    onFormulaIncorrect() {
        if (this.currentState && this.currentState.onFormulaIncorrect) {
            this.currentState.onFormulaIncorrect();
        }
    }
    
    validateStateTransition(fromState, toState) {
        const validTransitions = {
            SPAWNING: ['VULNERABLE'],
            VULNERABLE: ['WARNING', 'DEFEATED'],
            WARNING: ['ATTACKING', 'DEFEATED'],
            ATTACKING: ['COOLDOWN'],
            COOLDOWN: ['VULNERABLE'],
            DEFEATED: []
        };
        
        if (!fromState || !validTransitions[fromState]) {
            return true; // Allow initial state setting
        }
        
        return validTransitions[fromState].includes(toState);
    }
}

// Base State Class
class BossState {
    constructor(boss) {
        this.boss = boss;
        this.canPlayerAttack = false;
        this.canPlayerMove = true;
    }
    
    enter() {
        // Override in subclasses
    }
    
    exit() {
        // Override in subclasses
    }
    
    update(deltaTime) {
        // Override in subclasses
    }
    
    onFormulaCorrect() {
        // Override if needed
    }
    
    onFormulaIncorrect() {
        // Override if needed
    }
}

// SPAWNING State
class SpawningState extends BossState {
    constructor(boss) {
        super(boss);
        this.canPlayerAttack = false;
        this.canPlayerMove = true;
        this.spawnTimer = 0;
    }
    
    enter() {
        this.spawnTimer = 2000; // 2 seconds
        this.playSpawnAnimation();
        this.showBossMessage("Ein mächtiger Gegner erscheint!");
        this.startBossMusic();
        
        console.log(`🌟 ${this.boss.name} erscheint...`);
    }
    
    update(deltaTime) {
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.boss.stateMachine.setState('VULNERABLE');
        }
    }
    
    playSpawnAnimation() {
        // Placeholder for spawn animation
        console.log(`✨ Playing spawn animation for ${this.boss.name}`);
    }
    
    showBossMessage(message) {
        const messageElement = document.getElementById('gameStatus');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.color = '#ff6600';
            
            setTimeout(() => {
                messageElement.style.color = '';
            }, 3000);
        }
    }
    
    startBossMusic() {
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playSound('boss_spawn', 'action');
        }
    }
}

// VULNERABLE State
class VulnerableState extends BossState {
    constructor(boss) {
        super(boss);
        this.canPlayerAttack = true;
        this.canPlayerMove = true;
        this.attackTimer = 0;
        this.nextAttackTime = 0;
    }
    
    enter() {
        this.enableFormulaInput();
        this.showVulnerableIndicator();
        this.startAttackTimer();
        
        console.log(`🎯 ${this.boss.name} ist angreifbar!`);
    }
    
    update(deltaTime) {
        this.attackTimer += deltaTime;
        if (this.attackTimer >= this.nextAttackTime) {
            this.boss.stateMachine.setState('WARNING');
        }
    }
    
    onFormulaCorrect() {
        this.boss.formulasSolved++;
        console.log(`✅ Formula solved! Progress: ${this.boss.formulasSolved}/${this.boss.formulasRequired}`);
        
        if (this.boss.formulasSolved >= this.boss.formulasRequired) {
            this.boss.stateMachine.setState('DEFEATED');
        }
        // Stay in VULNERABLE for next formula
    }
    
    enableFormulaInput() {
        // Activate formula system
        if (this.boss.formulaSystem) {
            this.boss.formulaSystem.activateFormulaChallenge();
        }
    }
    
    showVulnerableIndicator() {
        // Visual indicator that boss can be attacked
        console.log(`🎯 Boss is vulnerable - formulas can be solved`);
    }
    
    startAttackTimer() {
        // Calculate next attack time based on game mode
        const baseTime = this.boss.isGameDayMode ? 15000 : 25000; // 15s day, 25s night
        const variation = baseTime * 0.3; // ±30% variation
        const randomOffset = (Math.random() - 0.5) * 2 * variation;
        this.nextAttackTime = baseTime + randomOffset;
        this.attackTimer = 0;
        
        console.log(`⏱️ Next attack in ${Math.round(this.nextAttackTime/1000)}s`);
    }
}

// WARNING State
class WarningState extends BossState {
    constructor(boss) {
        super(boss);
        this.canPlayerAttack = true; // Still possible during warning
        this.canPlayerMove = true;
        this.warningTimer = 0;
        this.lastCountdown = 0;
    }
    
    enter() {
        this.warningTimer = 3000; // 3 seconds
        this.lastCountdown = 3;
        this.showWarningEffects();
        this.startWarningCountdown();
        this.playWarningSound();
        
        console.log(`⚠️ ${this.boss.name} bereitet Angriff vor...`);
    }
    
    update(deltaTime) {
        this.warningTimer -= deltaTime;
        
        const currentCountdown = Math.ceil(this.warningTimer / 1000);
        if (currentCountdown !== this.lastCountdown && currentCountdown > 0) {
            this.updateWarningCountdown(currentCountdown);
            this.lastCountdown = currentCountdown;
        }
        
        if (this.warningTimer <= 0) {
            this.boss.stateMachine.setState('ATTACKING');
        }
    }
    
    onFormulaCorrect() {
        // Formula can still be completed during warning
        this.boss.formulasSolved++;
        console.log(`✅ Formula solved during warning! Progress: ${this.boss.formulasSolved}/${this.boss.formulasRequired}`);
        
        if (this.boss.formulasSolved >= this.boss.formulasRequired) {
            this.boss.stateMachine.setState('DEFEATED');
            return;
        }
        // Warning continues
    }
    
    showWarningEffects() {
        // Visual warning effects
        const warningElement = document.getElementById('bossWarning');
        if (warningElement) {
            warningElement.style.display = 'block';
            warningElement.style.backgroundColor = '#ff4444';
        }
    }
    
    startWarningCountdown() {
        console.log(`⚠️ ANGRIFF IN 3...`);
    }
    
    updateWarningCountdown(seconds) {
        const warningElement = document.getElementById('bossWarning');
        if (warningElement) {
            warningElement.textContent = `⚠️ ANGRIFF IN ${seconds}...`;
        }
        console.log(`⚠️ ANGRIFF IN ${seconds}...`);
    }
    
    playWarningSound() {
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playSound('warning', 'feedback');
        }
    }
}

// ATTACKING State
class AttackingState extends BossState {
    constructor(boss) {
        super(boss);
        this.canPlayerAttack = false; // Boss is invulnerable
        this.canPlayerMove = true;
        this.attackTimer = 0;
        this.attackDuration = 0;
        this.currentPattern = null;
    }
    
    enter() {
        this.calculateAttackDuration();
        this.closeFormulaInput();
        this.interruptActiveFormula();
        this.selectAndStartAttackPattern();
        this.makeInvulnerable();
        
        console.log(`🔥 ${this.boss.name} greift an!`);
    }
    
    update(deltaTime) {
        this.attackTimer += deltaTime;
        this.updateAttackPattern(deltaTime);
        
        if (this.attackTimer >= this.attackDuration) {
            this.boss.stateMachine.setState('COOLDOWN');
        }
    }
    
    calculateAttackDuration() {
        if (this.boss.isGameDayMode) {
            this.attackDuration = 10000 + (this.boss.level * 2000); // 10-30 seconds
        } else {
            this.attackDuration = 30000 + (this.boss.level * 3000); // 30-60 seconds
        }
        
        // Add some randomization
        const variation = this.attackDuration * 0.2;
        const randomOffset = (Math.random() - 0.5) * 2 * variation;
        this.attackDuration += randomOffset;
        
        console.log(`⏱️ Attack duration: ${Math.round(this.attackDuration/1000)}s`);
    }
    
    closeFormulaInput() {
        // Close any active formula input
        const formulaInput = document.querySelector('.formula-input');
        if (formulaInput) {
            formulaInput.style.display = 'none';
        }
    }
    
    interruptActiveFormula() {
        // Check if player was in formula input and penalize
        const formulaInput = document.querySelector('.formula-input:not([style*="display: none"])');
        const isInFormulaInput = formulaInput && formulaInput.style.display !== 'none';
        
        if (isInFormulaInput) {
            console.log('💔 Formel unterbrochen! -1 Leben');
            
            // Lose life if player system exists
            if (window.gameEngine && window.gameEngine.player && window.gameEngine.player.loseLife) {
                window.gameEngine.player.loseLife(1);
            }
            
            this.showInterruptionFeedback();
        }
    }
    
    showInterruptionFeedback() {
        // Visual feedback for interruption
        const feedbackElement = document.getElementById('gameStatus');
        if (feedbackElement) {
            const originalText = feedbackElement.textContent;
            feedbackElement.textContent = 'UNTERBROCHEN! -1 Leben';
            feedbackElement.style.color = '#ff0000';
            
            setTimeout(() => {
                feedbackElement.textContent = originalText;
                feedbackElement.style.color = '';
            }, 2000);
        }
        
        // Audio feedback
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playSound('damage', 'feedback');
        }
    }
    
    selectAndStartAttackPattern() {
        // Use the attack pattern system from the boss
        if (this.boss.attackPatterns && this.boss.attackPatterns.length > 0) {
            const availablePatterns = this.boss.attackPatterns.filter(pattern => 
                pattern.name !== this.boss.lastUsedPattern
            );
            
            this.currentPattern = availablePatterns.length > 0 ? 
                availablePatterns[Math.floor(Math.random() * availablePatterns.length)] :
                this.boss.attackPatterns[0];
            
            this.boss.lastUsedPattern = this.currentPattern.name;
            
            console.log(`🔥 Attack Pattern: ${this.currentPattern.name}`);
            this.startPatternEffects();
        }
    }
    
    startPatternEffects() {
        // Show attack active message
        const warningElement = document.getElementById('bossWarning');
        if (warningElement) {
            warningElement.textContent = '🔥 ANGRIFF AKTIV!';
            warningElement.style.backgroundColor = '#ff4444';
            warningElement.style.display = 'block';
        }
        
        if (this.currentPattern) {
            console.log(`🎨 Visual Effect: ${this.currentPattern.visual}`);
            console.log(`⚡ Screen Effect: ${this.currentPattern.effect}`);
        }
    }
    
    updateAttackPattern(deltaTime) {
        // Update visual effects during attack
        // This would be expanded with actual visual effects
    }
    
    makeInvulnerable() {
        console.log(`🛡️ ${this.boss.name} is invulnerable during attack`);
    }
}

// COOLDOWN State
class CooldownState extends BossState {
    constructor(boss) {
        super(boss);
        this.canPlayerAttack = false;
        this.canPlayerMove = true;
        this.cooldownTimer = 0;
    }
    
    enter() {
        this.cooldownTimer = 1500; // 1.5 seconds
        this.endAttackPattern();
        this.playRecoveryAnimation();
        
        console.log(`😴 ${this.boss.name} erholt sich...`);
    }
    
    update(deltaTime) {
        this.cooldownTimer -= deltaTime;
        if (this.cooldownTimer <= 0) {
            this.boss.stateMachine.setState('VULNERABLE');
        }
    }
    
    endAttackPattern() {
        // Hide attack UI
        const warningElement = document.getElementById('bossWarning');
        if (warningElement) {
            warningElement.style.display = 'none';
            warningElement.style.backgroundColor = '';
        }
    }
    
    playRecoveryAnimation() {
        console.log(`💤 Boss recovery animation`);
    }
}

// DEFEATED State
class DefeatedState extends BossState {
    constructor(boss) {
        super(boss);
        this.canPlayerAttack = false;
        this.canPlayerMove = true;
        this.deathTimer = 0;
    }
    
    enter() {
        this.deathTimer = 4000; // 4 seconds
        this.playDeathAnimation();
        this.showVictoryMessage();
        this.giveRewards();
        this.playVictoryMusic();
        
        console.log(`💀 ${this.boss.name} wurde besiegt!`);
    }
    
    update(deltaTime) {
        this.deathTimer -= deltaTime;
        if (this.deathTimer <= 0) {
            this.removeBoss();
            this.returnToNormalWaves();
        }
    }
    
    playDeathAnimation() {
        console.log(`💥 Playing death animation for ${this.boss.name}`);
    }
    
    showVictoryMessage() {
        const messages = {
            1: "Grundlagen gemeistert! 🎯",
            2: "Fortgeschrittener Status erreicht! 🚀",
            3: "Meister-Level erreicht! 👑",
            4: "Grandmaster der binomischen Formeln! 🌟"
        };
        
        const message = messages[this.boss.level] || "Boss besiegt!";
        
        const messageElement = document.getElementById('gameStatus');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.color = '#00ff00';
            
            setTimeout(() => {
                messageElement.style.color = '';
            }, 5000);
        }
        
        console.log(`🏆 ${message}`);
    }
    
    giveRewards() {
        // Placeholder for reward system
        console.log(`🎁 Rewards given for defeating ${this.boss.name}`);
    }
    
    playVictoryMusic() {
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playSound('victory', 'feedback');
        }
    }
    
    removeBoss() {
        // Hide Boss UI
        const bossUI = document.getElementById('bossUI');
        if (bossUI) {
            bossUI.style.display = 'none';
        }
        
        this.boss.isDefeated = true;
    }
    
    returnToNormalWaves() {
        // Trigger boss defeated callback
        if (this.boss.onDefeated) {
            this.boss.onDefeated();
        }
    }
}

// Attack Timing System
class AttackTimingSystem {
    constructor(isGameDayMode) {
        this.isGameDayMode = isGameDayMode;
        this.baseAttackInterval = isGameDayMode ? 15000 : 25000; // ms
        this.randomVariation = 0.3; // ±30% variation
    }
    
    calculateNextAttackTime() {
        const base = this.baseAttackInterval;
        const variation = base * this.randomVariation;
        const randomOffset = (Math.random() - 0.5) * 2 * variation;
        return base + randomOffset;
    }
    
    calculateAttackDuration(bossLevel) {
        if (this.isGameDayMode) {
            return 10000 + (bossLevel * 2000); // 10-30 seconds
        } else {
            return 30000 + (bossLevel * 3000); // 30-60 seconds
        }
    }
}

// Boss-Formula-System Implementation
class BossFormulaSystem {
    constructor(boss) {
        this.boss = boss;
        this.wave = boss.wave;
        this.level = boss.level;
        
        // Required concepts based on wave
        this.requiredConcepts = this.getRequiredConcepts();
        this.conceptDistribution = this.getConceptDistribution();
        
        // Formula tracking
        this.formulasGenerated = [];
        this.currentFormula = null;
        this.formulasSolved = 0;
        this.formulasRequired = this.getFormulasRequired();
        this.maxErrors = this.getMaxErrors();
        this.currentErrors = 0;
        
        // Performance tracking
        this.playerPerformance = {
            correctAnswers: 0,
            totalAnswers: 0,
            totalTime: 0,
            weakAreas: [],
            strongAreas: [],
            recentFormulas: []
        };
        
        // State
        this.isActive = false;
        this.currentChallenge = null;
        
        console.log(`📚 Boss Formula System initialized for Level ${this.level}`);
        console.log(`📊 Required: ${this.formulasRequired} formulas, Max errors: ${this.maxErrors}`);
    }
    
    getRequiredConcepts() {
        const concepts = {
            1: [ // Wave 10 - Grundlagen-Prüfer
                'basic_square_sum',    // (a+b)²
                'basic_square_diff',   // (a-b)²
                'simple_coefficients'  // 1-5 als Koeffizienten
            ],
            2: [ // Wave 20 - Fortgeschrittenen-Herausforderer
                'basic_square_sum', 'basic_square_diff', // Wiederholung
                'difference_of_squares', // (a+b)(a-b)
                'two_variables',        // x und y kombiniert
                'larger_coefficients'   // 1-10
            ],
            3: [ // Wave 30 - Meister-Prüfer
                'basic_square_sum', 'basic_square_diff', 'difference_of_squares', // Review
                'factorization',        // a² - b² → (a+b)(a-b)
                'nested_terms',         // (2x+3y)²
                'large_coefficients'    // 1-15
            ],
            4: [ // Wave 40+ - Grandmaster
                'basic_square_sum', 'basic_square_diff', 'difference_of_squares', 'factorization', 'nested_terms',
                'multi_step_problems',  // Mehrere Schritte
                'combined_terms',       // (a+b)²(c-d)²
                'extreme_coefficients'  // 1-20+
            ]
        };
        
        return concepts[Math.min(this.level, 4)] || concepts[1];
    }
    
    getConceptDistribution() {
        const distributions = {
            1: { grundlagen: 1.0, fortgeschritten: 0.0, meister: 0.0 },
            2: { grundlagen: 0.6, fortgeschritten: 0.4, meister: 0.0 },
            3: { grundlagen: 0.4, fortgeschritten: 0.4, meister: 0.2 },
            4: { grundlagen: 0.3, fortgeschritten: 0.4, meister: 0.3 }
        };
        
        return distributions[Math.min(this.level, 4)] || distributions[1];
    }
    
    getFormulasRequired() {
        const requirements = { 1: 5, 2: 7, 3: 10, 4: 15 };
        return requirements[Math.min(this.level, 4)] || 5;
    }
    
    getMaxErrors() {
        const maxErrors = { 1: 2, 2: 2, 3: 3, 4: 3 };
        return maxErrors[Math.min(this.level, 4)] || 2;
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Update current challenge timing
        if (this.currentChallenge) {
            this.currentChallenge.timeSpent += deltaTime;
        }
    }
    
    activateFormulaChallenge() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.generateNextFormula();
        console.log(`🎯 Formula Challenge activated for ${this.boss.name}`);
    }
    
    generateNextFormula() {
        if (this.formulasSolved >= this.formulasRequired) {
            return null; // Boss should be defeated
        }
        
        // Select concept based on distribution and player weaknesses
        const selectedConcept = this.selectConcept();
        const formula = this.generateSpecificFormula(selectedConcept);
        
        this.currentFormula = formula;
        this.currentChallenge = {
            formula: formula,
            startTime: Date.now(),
            timeSpent: 0,
            attempts: 0
        };
        
        this.formulasGenerated.push(formula);
        this.displayFormula(formula);
        
        console.log(`📝 Generated formula: ${formula.question} (Concept: ${selectedConcept})`);
        return formula;
    }
    
    selectConcept() {
        // Weight concepts based on:
        // 1. Required concepts for this wave
        // 2. Player weaknesses (higher probability)
        // 3. Avoid recent repetitions
        
        const availableConcepts = this.requiredConcepts.filter(concept => 
            !this.playerPerformance.recentFormulas.slice(-3).includes(concept)
        );
        
        if (availableConcepts.length === 0) {
            return this.requiredConcepts[0]; // Fallback
        }
        
        // Prioritize weak areas
        const weakConcepts = availableConcepts.filter(concept => 
            this.playerPerformance.weakAreas.includes(concept)
        );
        
        if (weakConcepts.length > 0 && Math.random() < 0.7) {
            return weakConcepts[Math.floor(Math.random() * weakConcepts.length)];
        }
        
        // Random selection from available concepts
        return availableConcepts[Math.floor(Math.random() * availableConcepts.length)];
    }
    
    generateSpecificFormula(concept) {
        const generators = {
            'basic_square_sum': () => this.generateBasicSquareSum(),
            'basic_square_diff': () => this.generateBasicSquareDiff(),
            'difference_of_squares': () => this.generateDifferenceOfSquares(),
            'factorization': () => this.generateFactorization(),
            'nested_terms': () => this.generateNestedTerms(),
            'multi_step_problems': () => this.generateMultiStepProblem(),
            'combined_terms': () => this.generateCombinedTerms()
        };
        
        const generator = generators[concept] || generators['basic_square_sum'];
        const formula = generator();
        formula.concept = concept;
        formula.level = this.level;
        
        return formula;
    }
    
    generateBasicSquareSum() {
        const coeffRange = this.level <= 1 ? [1, 5] : this.level <= 2 ? [1, 10] : [1, 15];
        const a = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const b = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const variable = this.level >= 2 && Math.random() < 0.3 ? 'y' : 'x';
        
        return {
            question: `(${a === 1 ? '' : a}${variable}+${b})²`,
            correctAnswers: [
                `${a*a}${variable}² + ${2*a*b}${variable} + ${b*b}`,
                `${a*a}${variable}^2 + ${2*a*b}${variable} + ${b*b}`,
                `${b*b} + ${2*a*b}${variable} + ${a*a}${variable}²`
            ],
            concept: 'basic_square_sum',
            difficulty: this.level
        };
    }
    
    generateBasicSquareDiff() {
        const coeffRange = this.level <= 1 ? [1, 5] : this.level <= 2 ? [1, 10] : [1, 15];
        const a = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const b = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const variable = this.level >= 2 && Math.random() < 0.3 ? 'y' : 'x';
        
        return {
            question: `(${a === 1 ? '' : a}${variable}-${b})²`,
            correctAnswers: [
                `${a*a}${variable}² - ${2*a*b}${variable} + ${b*b}`,
                `${a*a}${variable}^2 - ${2*a*b}${variable} + ${b*b}`,
                `${b*b} - ${2*a*b}${variable} + ${a*a}${variable}²`
            ],
            concept: 'basic_square_diff',
            difficulty: this.level
        };
    }
    
    generateDifferenceOfSquares() {
        const coeffRange = this.level <= 2 ? [1, 10] : [1, 15];
        const a = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const b = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const variable = Math.random() < 0.5 ? 'x' : 'y';
        
        return {
            question: `(${a === 1 ? '' : a}${variable}+${b})(${a === 1 ? '' : a}${variable}-${b})`,
            correctAnswers: [
                `${a*a}${variable}² - ${b*b}`,
                `${a*a}${variable}^2 - ${b*b}`
            ],
            concept: 'difference_of_squares',
            difficulty: this.level
        };
    }
    
    generateFactorization() {
        const coeffRange = [1, 15];
        const a = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const b = Math.floor(Math.random() * coeffRange[1]) + coeffRange[0];
        const variable = Math.random() < 0.5 ? 'x' : 'y';
        
        return {
            question: `${a*a}${variable}² - ${b*b} = (${a === 1 ? '' : a}${variable}+?)(${a === 1 ? '' : a}${variable}-?)`,
            correctAnswers: [
                `${b}`,
                `(${a === 1 ? '' : a}${variable}+${b})(${a === 1 ? '' : a}${variable}-${b})`
            ],
            concept: 'factorization',
            difficulty: this.level
        };
    }
    
    generateNestedTerms() {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        
        return {
            question: `(${a}x+${b}y)²`,
            correctAnswers: [
                `${a*a}x² + ${2*a*b}xy + ${b*b}y²`,
                `${a*a}x^2 + ${2*a*b}xy + ${b*b}y^2`
            ],
            concept: 'nested_terms',
            difficulty: this.level
        };
    }
    
    generateMultiStepProblem() {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        
        return {
            question: `(x+${a})² - (x-${b})²`,
            correctAnswers: [
                `${2*a + 2*b}x + ${a*a - b*b}`,
                `${2*(a+b)}x + ${a*a - b*b}`
            ],
            concept: 'multi_step_problems',
            difficulty: this.level
        };
    }
    
    generateCombinedTerms() {
        const a = Math.floor(Math.random() * 3) + 1;
        const b = Math.floor(Math.random() * 3) + 1;
        
        return {
            question: `(x+${a})²(x-${b})²`,
            correctAnswers: [
                `(x² + ${2*a}x + ${a*a})(x² - ${2*b}x + ${b*b})`,
                `x⁴ + ${2*a-2*b}x³ + ${a*a+b*b-2*a*b}x² + ${2*a*b*b-2*a*a*b}x + ${a*a*b*b}`
            ],
            concept: 'combined_terms',
            difficulty: this.level
        };
    }
    
    displayFormula(formula) {
        // Update Boss UI with current formula
        const progressElement = document.getElementById('bossProgress');
        if (progressElement) {
            progressElement.textContent = `${this.formulasSolved}/${this.formulasRequired} Formeln gelöst`;
        }
        
        // Show formula challenge (this would integrate with existing formula input system)
        console.log(`📝 Formula Challenge: ${formula.question}`);
        
        // In a real implementation, this would show the formula input UI
        // For now, we'll simulate it through the existing game systems
        if (window.gameEngine && window.gameEngine.formulaSystem) {
            // Integrate with existing formula system
            this.integrateWithGameFormulas(formula);
        }
    }
    
    integrateWithGameFormulas(formula) {
        // This would integrate with the existing formula system
        // For now, we'll create a placeholder that can be expanded
        console.log(`🔗 Integrating boss formula with game system: ${formula.question}`);
    }
    
    validateAnswer(formula, playerAnswer) {
        if (!formula || !playerAnswer) return { correct: false, score: 0 };
        
        const normalizedAnswer = this.normalizeAnswer(playerAnswer);
        const result = this.checkAnswerCorrectness(formula, normalizedAnswer);
        
        // Track performance
        this.trackPerformance(result.correct, this.currentChallenge?.timeSpent || 0, formula.concept);
        
        if (result.correct) {
            this.formulasSolved++;
            console.log(`✅ Correct! Progress: ${this.formulasSolved}/${this.formulasRequired}`);
            
            // Generate next formula
            setTimeout(() => {
                this.generateNextFormula();
            }, 1000);
        } else {
            this.currentErrors++;
            console.log(`❌ Incorrect. Errors: ${this.currentErrors}/${this.maxErrors}`);
            
            if (this.currentErrors >= this.maxErrors) {
                this.handleBossFailure();
            } else {
                // Show hint and retry
                this.showHint(formula, normalizedAnswer);
            }
        }
        
        return result;
    }
    
    normalizeAnswer(answer) {
        return answer
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/\*/g, '')
            .replace(/\^2/g, '²')
            .replace(/\^/g, '**');
    }
    
    checkAnswerCorrectness(formula, normalizedAnswer) {
        for (const correctAnswer of formula.correctAnswers) {
            const normalizedCorrect = this.normalizeAnswer(correctAnswer);
            
            if (normalizedAnswer === normalizedCorrect) {
                return { correct: true, score: 100 };
            }
            
            // Check partial correctness
            const partialScore = this.checkPartialCorrectness(normalizedAnswer, normalizedCorrect);
            if (partialScore > 60) {
                return { correct: true, score: partialScore };
            }
        }
        
        return { correct: false, score: 0 };
    }
    
    checkPartialCorrectness(playerAnswer, correctAnswer) {
        // Structural similarity check
        const playerTerms = this.extractTerms(playerAnswer);
        const correctTerms = this.extractTerms(correctAnswer);
        
        let matchingTerms = 0;
        let totalTerms = correctTerms.length;
        
        for (const term of correctTerms) {
            if (playerTerms.includes(term)) {
                matchingTerms++;
            }
        }
        
        const structuralScore = (matchingTerms / totalTerms) * 100;
        
        // Sign error check (80% if only signs are wrong)
        if (structuralScore > 80 && this.hasOnlySignErrors(playerAnswer, correctAnswer)) {
            return 80;
        }
        
        return structuralScore;
    }
    
    extractTerms(expression) {
        // Simple term extraction (would be more sophisticated in real implementation)
        return expression.split(/[+-]/).filter(term => term.length > 0);
    }
    
    hasOnlySignErrors(playerAnswer, correctAnswer) {
        // Check if only signs are different
        const playerSigns = playerAnswer.match(/[+-]/g) || [];
        const correctSigns = correctAnswer.match(/[+-]/g) || [];
        
        return playerSigns.length === correctSigns.length;
    }
    
    showHint(formula, playerAnswer) {
        const hints = {
            'basic_square_sum': "Denk an die binomische Formel: (a+b)² = a² + 2ab + b²",
            'basic_square_diff': "Denk an die binomische Formel: (a-b)² = a² - 2ab + b²",
            'difference_of_squares': "Denk an: (a+b)(a-b) = a² - b²",
            'factorization': "Welche Zahlen ergeben diese Differenz von Quadraten?",
            'nested_terms': "Behandle jeden Term separat: (ax+by)² = (ax)² + 2(ax)(by) + (by)²"
        };
        
        const hint = hints[formula.concept] || "Überprüfe deine Rechnung Schritt für Schritt.";
        console.log(`💡 Hint: ${hint}`);
        
        // Show hint in UI
        const hintElement = document.getElementById('formulaHint');
        if (hintElement) {
            hintElement.textContent = hint;
            hintElement.style.display = 'block';
            
            setTimeout(() => {
                hintElement.style.display = 'none';
            }, 5000);
        }
    }
    
    trackPerformance(correct, timeSpent, concept) {
        this.playerPerformance.totalAnswers++;
        if (correct) {
            this.playerPerformance.correctAnswers++;
        }
        this.playerPerformance.totalTime += timeSpent;
        
        // Track concept performance
        if (correct) {
            if (!this.playerPerformance.strongAreas.includes(concept)) {
                this.playerPerformance.strongAreas.push(concept);
            }
            // Remove from weak areas if it was there
            this.playerPerformance.weakAreas = this.playerPerformance.weakAreas.filter(c => c !== concept);
        } else {
            if (!this.playerPerformance.weakAreas.includes(concept)) {
                this.playerPerformance.weakAreas.push(concept);
            }
        }
        
        // Track recent formulas
        this.playerPerformance.recentFormulas.push(concept);
        if (this.playerPerformance.recentFormulas.length > 10) {
            this.playerPerformance.recentFormulas.shift();
        }
    }
    
    checkBossDefeat() {
        return this.formulasSolved >= this.formulasRequired && this.currentErrors < this.maxErrors;
    }
    
    handleBossFailure() {
        console.log(`💀 Boss Challenge Failed! Too many errors: ${this.currentErrors}/${this.maxErrors}`);
        
        // Reset player or handle failure
        if (window.gameEngine && window.gameEngine.player) {
            // This would trigger game over or life loss
            console.log('🔄 Restarting boss challenge...');
            this.resetChallenge();
        }
    }
    
    resetChallenge() {
        this.formulasSolved = 0;
        this.currentErrors = 0;
        this.formulasGenerated = [];
        this.currentFormula = null;
        this.currentChallenge = null;
        this.isActive = false;
    }
    
    getProgressionSummary() {
        const accuracy = this.playerPerformance.totalAnswers > 0 ? 
            (this.playerPerformance.correctAnswers / this.playerPerformance.totalAnswers) * 100 : 0;
        const avgTime = this.playerPerformance.totalAnswers > 0 ? 
            this.playerPerformance.totalTime / this.playerPerformance.totalAnswers : 0;
        
        return {
            correctAnswers: this.playerPerformance.correctAnswers,
            totalAnswers: this.playerPerformance.totalAnswers,
            accuracy: Math.round(accuracy),
            averageTime: Math.round(avgTime / 1000), // in seconds
            strongAreas: this.playerPerformance.strongAreas,
            weakAreas: this.playerPerformance.weakAreas,
            status: this.checkBossDefeat() ? 'BESTANDEN' : 'IN_PROGRESS'
        };
    }
}

// Debug-Funktionen für Entwicklung
if (typeof window !== 'undefined') {
    window.debugBoss = {
        spawnBoss: (level = 1) => {
            const wave = level * 10;
            if (window.gameEngine && window.gameEngine.waveSystem && window.gameEngine.waveSystem.bossManager) {
                const boss = window.gameEngine.waveSystem.bossManager.spawnBoss(wave);
                if (boss) {
                    // Show Boss UI
                    const bossUI = document.getElementById('bossUI');
                    if (bossUI) {
                        bossUI.style.display = 'block';
                        document.getElementById('bossName').textContent = boss.name;
                        document.getElementById('bossLevel').textContent = `Level ${boss.level}`;
                        document.getElementById('bossProgress').textContent = `${boss.formulasSolved}/${boss.formulasRequired} Formeln gelöst`;
                    }
                }
                return boss;
            } else {
                console.error('❌ Game Engine oder Wave System nicht verfügbar');
            }
        },
        
        defeatBoss: () => {
            const boss = window.gameEngine?.waveSystem?.bossManager?.currentBoss;
            if (boss) {
                boss.formulasSolved = boss.formulasRequired;
                boss.defeat();
                return true;
            } else {
                console.log('❌ Kein aktiver Boss');
                return false;
            }
        },
        
        damageBoss: (amount = 1) => {
            const boss = window.gameEngine?.waveSystem?.bossManager?.currentBoss;
            if (boss) {
                return boss.takeDamage(amount);
            } else {
                console.log('❌ Kein aktiver Boss');
                return false;
            }
        },
        
        getBossInfo: () => {
            const bossManager = window.gameEngine?.waveSystem?.bossManager;
            if (bossManager) {
                return bossManager.getBossStats();
            } else {
                return 'Boss System nicht verfügbar';
            }
        },
        
        skipToWave: (wave) => {
            if (window.gameEngine && window.gameEngine.waveSystem) {
                window.gameEngine.waveSystem.currentWave = wave - 1;
                window.gameEngine.waveSystem.startNextWave();
                return true;
            } else {
                console.error('❌ Wave System nicht verfügbar');
                return false;
            }
        }
    };
    
    console.log('🔧 Boss Debug-Funktionen verfügbar:');
    console.log('debugBoss.spawnBoss(level) - Boss spawnen');
    console.log('debugBoss.defeatBoss() - Aktuellen Boss besiegen');
    console.log('debugBoss.damageBoss(amount) - Boss Schaden zufügen');
    console.log('debugBoss.getBossInfo() - Boss-Informationen');
    console.log('debugBoss.skipToWave(wave) - Zu Welle springen');
}

/**
 * BOSS VISUAL SYSTEM - Animationen und Effekte
 * Implementiert nach Boss-Visual-System.md
 */
class BossVisualSystem {
    constructor(boss) {
        this.boss = boss;
        this.currentEffects = [];
        this.animationManager = new AnimationManager();
        this.particleSystem = new BossParticleSystem();
        
        // Visual Properties
        this.baseSize = boss.size;
        this.currentScale = 1.0;
        this.pulsePhase = 0;
        this.rotationAngle = 0;
        this.glowIntensity = 0.5;
        
        // Animation States
        this.isSpawning = false;
        this.isDamaged = false;
        this.isDefeated = false;
        this.attackEffectActive = false;
        
        // Performance Settings
        this.effectQuality = 'HIGH'; // HIGH, MEDIUM, LOW
        
        // Boss Design Properties based on level
        this.bossDesign = this.getBossDesign(boss.level);
        
        console.log(`🎨 BossVisualSystem initialized for ${boss.name} (Level ${boss.level})`);
    }
    
    getBossDesign(level) {
        const designs = {
            1: { // Grundlagen-Prüfer
                baseColor: '#1e3a8a', // Tiefblau
                accentColor: '#fbbf24', // Gold
                size: 3,
                complexity: 'simple',
                symbols: ['(a+b)²', '(a-b)²', '+', '-', '×'],
                shape: 'circle'
            },
            2: { // Fortgeschrittenen-Herausforderer
                baseColor: '#7c3aed', // Violett
                accentColor: '#e5e7eb', // Silber
                size: 4,
                complexity: 'medium',
                symbols: ['(x+y)²', '(x-y)²', 'x', 'y', 'z'],
                shape: 'octagon'
            },
            3: { // Meister-Prüfer
                baseColor: '#dc2626', // Dunkelrot
                accentColor: '#fbbf24', // Gold
                size: 5,
                complexity: 'complex',
                symbols: ['∫', '∂', '∑', '∏', '√'],
                shape: 'crystal'
            },
            4: { // Grandmaster
                baseColor: '#000000', // Schwarz
                accentColor: '#ffffff', // Weiß (Regenbogen-Spektrum)
                size: 6,
                complexity: 'extreme',
                symbols: ['∞', '∆', '∇', '∈', '∀'],
                shape: 'abstract'
            }
        };
        
        return designs[Math.min(level, 4)] || designs[1];
    }
    
    update(deltaTime) {
        // Update animation timers
        this.pulsePhase += deltaTime * 0.002; // Slow pulse
        this.rotationAngle += deltaTime * 0.001; // Slow rotation
        
        // Update particle system
        this.particleSystem.update(deltaTime);
        
        // Update animation manager
        this.animationManager.update(deltaTime);
        
        // Update current effects
        this.currentEffects = this.currentEffects.filter(effect => {
            effect.update(deltaTime);
            return !effect.isFinished;
        });
        
        // State-specific updates
        if (this.boss.currentState === 'SPAWNING') {
            this.updateSpawnAnimation(deltaTime);
        } else if (this.boss.currentState === 'ATTACKING') {
            this.updateAttackAnimation(deltaTime);
        }
    }
    
    render(context) {
        context.save();
        
        // Render background effects first
        this.renderBackgroundEffects(context);
        
        // Render boss based on current state
        switch (this.boss.currentState) {
            case 'SPAWNING':
                this.renderSpawningBoss(context);
                break;
            case 'VULNERABLE':
                this.renderVulnerableBoss(context);
                break;
            case 'WARNING':
                this.renderWarningBoss(context);
                break;
            case 'ATTACKING':
                this.renderAttackingBoss(context);
                break;
            case 'COOLDOWN':
                this.renderCooldownBoss(context);
                break;
            case 'DEFEATED':
                this.renderDefeatedBoss(context);
                break;
            default:
                this.renderBaseBoss(context);
        }
        
        // Render foreground effects
        this.renderForegroundEffects(context);
        
        // Render particles
        this.particleSystem.render(context);
        
        context.restore();
    }
    
    renderBaseBoss(context) {
        const x = this.boss.x;
        const y = this.boss.y;
        const size = this.baseSize * this.currentScale;
        
        // Calculate pulse effect
        const pulseScale = 1 + Math.sin(this.pulsePhase) * 0.1;
        const renderSize = size * pulseScale;
        
        // Render based on boss design
        switch (this.bossDesign.shape) {
            case 'circle':
                this.renderCircleBoss(context, x, y, renderSize);
                break;
            case 'octagon':
                this.renderOctagonBoss(context, x, y, renderSize);
                break;
            case 'crystal':
                this.renderCrystalBoss(context, x, y, renderSize);
                break;
            case 'abstract':
                this.renderAbstractBoss(context, x, y, renderSize);
                break;
        }
        
        // Render floating symbols
        this.renderFloatingSymbols(context, x, y, renderSize);
        
        // Render boss info
        this.renderBossInfo(context, x, y, renderSize);
    }
    
    renderCircleBoss(context, x, y, size) {
        // Main body with gradient
        const gradient = context.createRadialGradient(x, y, 0, x, y, size/2);
        gradient.addColorStop(0, this.bossDesign.baseColor);
        gradient.addColorStop(0.7, this.bossDesign.baseColor + '80');
        gradient.addColorStop(1, this.bossDesign.baseColor + '40');
        
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, size/2, 0, Math.PI * 2);
        context.fill();
        
        // Accent border
        context.strokeStyle = this.bossDesign.accentColor;
        context.lineWidth = 4;
        context.stroke();
        
        // Glow effect
        if (this.effectQuality === 'HIGH') {
            context.shadowColor = this.bossDesign.accentColor;
            context.shadowBlur = 20 * this.glowIntensity;
            context.stroke();
            context.shadowBlur = 0;
        }
    }
    
    renderOctagonBoss(context, x, y, size) {
        const radius = size / 2;
        const sides = 8;
        
        context.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides + this.rotationAngle;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                context.moveTo(px, py);
            } else {
                context.lineTo(px, py);
            }
        }
        context.closePath();
        
        // Fill with gradient
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, this.bossDesign.baseColor);
        gradient.addColorStop(1, this.bossDesign.baseColor + '60');
        context.fillStyle = gradient;
        context.fill();
        
        // Crystalline edges
        context.strokeStyle = this.bossDesign.accentColor;
        context.lineWidth = 3;
        context.stroke();
    }
    
    renderCrystalBoss(context, x, y, size) {
        const segments = 6;
        const radius = size / 2;
        
        // Render multiple rotating segments
        for (let segment = 0; segment < segments; segment++) {
            const segmentAngle = (segment * Math.PI * 2) / segments + this.rotationAngle * (segment % 2 === 0 ? 1 : -1);
            const segmentRadius = radius * (0.6 + Math.sin(this.pulsePhase + segment) * 0.2);
            
            context.save();
            context.translate(x, y);
            context.rotate(segmentAngle);
            
            // Crystal segment
            context.beginPath();
            context.moveTo(0, -segmentRadius);
            context.lineTo(segmentRadius * 0.3, -segmentRadius * 0.5);
            context.lineTo(segmentRadius * 0.3, segmentRadius * 0.5);
            context.lineTo(0, segmentRadius);
            context.lineTo(-segmentRadius * 0.3, segmentRadius * 0.5);
            context.lineTo(-segmentRadius * 0.3, -segmentRadius * 0.5);
            context.closePath();
            
            context.fillStyle = this.bossDesign.baseColor + '80';
            context.fill();
            context.strokeStyle = this.bossDesign.accentColor;
            context.lineWidth = 2;
            context.stroke();
            
            context.restore();
        }
    }
    
    renderAbstractBoss(context, x, y, size) {
        // Constantly morphing abstract shape
        const time = Date.now() * 0.001;
        const points = 12;
        const baseRadius = size / 2;
        
        context.beginPath();
        for (let i = 0; i <= points; i++) {
            const angle = (i * 2 * Math.PI) / points;
            const radiusVariation = Math.sin(time * 2 + angle * 3) * 0.3 + Math.cos(time * 1.5 + angle * 2) * 0.2;
            const radius = baseRadius * (1 + radiusVariation);
            
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                context.moveTo(px, py);
            } else {
                context.lineTo(px, py);
            }
        }
        context.closePath();
        
        // Rainbow gradient for Grandmaster
        const gradient = context.createRadialGradient(x, y, 0, x, y, baseRadius);
        const hue = (time * 50) % 360;
        gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
        gradient.addColorStop(0.5, `hsl(${(hue + 120) % 360}, 70%, 40%)`);
        gradient.addColorStop(1, `hsl(${(hue + 240) % 360}, 70%, 30%)`);
        
        context.fillStyle = gradient;
        context.fill();
        
        context.strokeStyle = '#ffffff';
        context.lineWidth = 3;
        context.stroke();
    }
    
    renderFloatingSymbols(context, x, y, size) {
        if (this.effectQuality === 'LOW') return;
        
        const symbolCount = Math.min(this.bossDesign.symbols.length, this.effectQuality === 'HIGH' ? 5 : 3);
        const orbitRadius = size * 0.8;
        
        context.font = `${Math.max(16, size * 0.1)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        for (let i = 0; i < symbolCount; i++) {
            const angle = (i * 2 * Math.PI) / symbolCount + this.rotationAngle * 0.5;
            const symbolX = x + Math.cos(angle) * orbitRadius;
            const symbolY = y + Math.sin(angle) * orbitRadius;
            
            // Symbol glow
            if (this.effectQuality === 'HIGH') {
                context.shadowColor = this.bossDesign.accentColor;
                context.shadowBlur = 10;
            }
            
            context.fillStyle = this.bossDesign.accentColor;
            context.fillText(this.bossDesign.symbols[i], symbolX, symbolY);
            
            context.shadowBlur = 0;
        }
    }
    
    renderBossInfo(context, x, y, size) {
        // Boss name
        context.font = 'bold 16px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#ffffff';
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        
        const nameY = y - size/2 - 20;
        context.strokeText(this.boss.name, x, nameY);
        context.fillText(this.boss.name, x, nameY);
        
        // Progress
        context.font = '14px Arial';
        const progressText = `${this.boss.formulasSolved}/${this.boss.formulasRequired}`;
        const progressY = y + size/2 + 20;
        context.strokeText(progressText, x, progressY);
        context.fillText(progressText, x, progressY);
        
        // State indicator
        context.font = '12px Arial';
        const stateY = y + size/2 + 35;
        context.fillStyle = this.getStateColor(this.boss.currentState);
        context.fillText(this.boss.currentState, x, stateY);
    }
    
    getStateColor(state) {
        const colors = {
            'SPAWNING': '#ffff00',
            'VULNERABLE': '#00ff00',
            'WARNING': '#ff8800',
            'ATTACKING': '#ff0000',
            'COOLDOWN': '#8888ff',
            'DEFEATED': '#888888'
        };
        return colors[state] || '#ffffff';
    }
    
    renderSpawningBoss(context) {
        // Spawn animation with materializing effect
        const spawnProgress = 1 - (this.boss.stateTimer / this.boss.spawnTimer);
        this.currentScale = spawnProgress;
        
        // Particle spawn effect
        if (this.effectQuality !== 'LOW') {
            this.particleSystem.addParticles('spawn', this.boss.x, this.boss.y, 5);
        }
        
        // Flickering alpha
        const alpha = Math.sin(spawnProgress * Math.PI * 10) * 0.3 + 0.7;
        context.globalAlpha = alpha * spawnProgress;
        
        this.renderBaseBoss(context);
        
        context.globalAlpha = 1;
    }
    
    renderVulnerableBoss(context) {
        // Green vulnerable indicator
        this.glowIntensity = 0.8;
        
        // Render base boss
        this.renderBaseBoss(context);
        
        // Vulnerable indicator ring
        if (this.effectQuality !== 'LOW') {
            context.strokeStyle = '#00ff00';
            context.lineWidth = 3;
            context.setLineDash([10, 5]);
            context.beginPath();
            context.arc(this.boss.x, this.boss.y, this.baseSize * 0.7, 0, Math.PI * 2);
            context.stroke();
            context.setLineDash([]);
        }
    }
    
    renderWarningBoss(context) {
        // Warning pulsing effect
        const warningIntensity = Math.sin(this.boss.stateTimer * 0.01) * 0.5 + 0.5;
        this.currentScale = 1 + warningIntensity * 0.3;
        this.glowIntensity = 1.0;
        
        // Red tint
        context.fillStyle = `rgba(255, 0, 0, ${warningIntensity * 0.3})`;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        
        this.renderBaseBoss(context);
    }
    
    renderAttackingBoss(context) {
        // Attack state - boss is larger and more intense
        this.currentScale = 1.2;
        this.glowIntensity = 1.5;
        
        this.renderBaseBoss(context);
        
        // Attack aura
        if (this.effectQuality === 'HIGH') {
            const auraRadius = this.baseSize * 1.5;
            const gradient = context.createRadialGradient(
                this.boss.x, this.boss.y, 0,
                this.boss.x, this.boss.y, auraRadius
            );
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
            gradient.addColorStop(0.7, 'rgba(255, 0, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.4)');
            
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(this.boss.x, this.boss.y, auraRadius, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    renderCooldownBoss(context) {
        // Cooldown - boss is slightly smaller and dimmed
        this.currentScale = 0.9;
        this.glowIntensity = 0.3;
        
        context.globalAlpha = 0.7;
        this.renderBaseBoss(context);
        context.globalAlpha = 1;
    }
    
    renderDefeatedBoss(context) {
        // Defeat animation - boss fading and breaking apart
        const defeatProgress = this.boss.stateTimer / 4000; // 4 second defeat animation
        this.currentScale = 1 - defeatProgress * 0.5;
        
        context.globalAlpha = 1 - defeatProgress;
        this.renderBaseBoss(context);
        context.globalAlpha = 1;
        
        // Defeat particles
        if (this.effectQuality !== 'LOW') {
            this.particleSystem.addParticles('defeat', this.boss.x, this.boss.y, 10);
        }
    }
    
    renderBackgroundEffects(context) {
        // Render background visual effects
        for (const effect of this.currentEffects) {
            if (effect.layer === 'background') {
                effect.render(context);
            }
        }
    }
    
    renderForegroundEffects(context) {
        // Render foreground visual effects
        for (const effect of this.currentEffects) {
            if (effect.layer === 'foreground') {
                effect.render(context);
            }
        }
    }
    
    // Animation trigger methods
    updateSpawnAnimation(deltaTime) {
        // Spawn-specific animation updates
        if (this.boss.stateTimer < 500) {
            // Initial particle burst
            this.particleSystem.addParticles('spawn', this.boss.x, this.boss.y, 2);
        }
    }
    
    updateAttackAnimation(deltaTime) {
        // Attack-specific animation updates
        if (!this.attackEffectActive) {
            this.startAttackPattern();
            this.attackEffectActive = true;
        }
    }
    
    startAttackPattern() {
        // Get current attack pattern from boss
        const pattern = this.boss.selectAttackPattern();
        if (!pattern) return;
        
        console.log(`🎨 Starting visual effect: ${pattern.name}`);
        
        // Create appropriate visual effect based on pattern name
        switch (pattern.name) {
            case 'Algebra-Wellen':
                this.currentEffects.push(new AlgebraWavesEffect(this.boss));
                break;
            case 'Zahlen-Regen':
                this.currentEffects.push(new NumberRainEffect(this.boss));
                break;
            case 'Formel-Sturm':
                this.currentEffects.push(new FormulaStormEffect(this.boss));
                break;
            case 'Variable-Chaos':
                this.currentEffects.push(new VariableChaosEffect(this.boss));
                break;
            default:
                console.log(`⚠️ No visual effect implemented for: ${pattern.name}`);
        }
    }
    
    showDamageEffect() {
        console.log('💥 Boss damage visual effect');
        
        // Screen flash
        this.addScreenFlash('#ffffff', 200);
        
        // Boss damage animation
        this.isDamaged = true;
        setTimeout(() => {
            this.isDamaged = false;
        }, 500);
        
        // Damage particles
        if (this.effectQuality !== 'LOW') {
            this.particleSystem.addParticles('damage', this.boss.x, this.boss.y, 15);
        }
        
        // Add damage effect
        this.currentEffects.push(new CorrectAnswerEffect(this.boss));
    }
    
    showIncorrectEffect() {
        console.log('❌ Incorrect answer visual effect');
        
        // Red screen flash
        this.addScreenFlash('#ff0000', 300);
        
        // Add incorrect effect
        this.currentEffects.push(new IncorrectAnswerEffect(this.boss));
    }
    
    showInterruptionEffect() {
        console.log('💔 Formula interruption visual effect');
        
        // Intense red flash
        this.addScreenFlash('#ff0000', 500);
        
        // Boss grows temporarily (triumphant)
        this.currentScale = 1.3;
        setTimeout(() => {
            this.currentScale = 1.0;
        }, 1000);
        
        // Add interruption effect
        this.currentEffects.push(new InterruptionEffect(this.boss));
    }
    
    playDefeatAnimation() {
        console.log('🏆 Playing boss defeat animation');
        
        this.isDefeated = true;
        
        // 4-phase defeat sequence
        const defeatSequence = new BossDefeatSequence(this.boss);
        this.currentEffects.push(defeatSequence);
        
        // Victory particles
        if (this.effectQuality !== 'LOW') {
            // Golden victory particles
            setTimeout(() => {
                this.particleSystem.addParticles('victory', this.boss.x, this.boss.y, 50);
            }, 2000);
        }
    }
    
    addScreenFlash(color, duration) {
        const flash = {
            color: color,
            alpha: 0.5,
            duration: duration,
            elapsed: 0,
            layer: 'foreground',
            isFinished: false,
            
            update: function(deltaTime) {
                this.elapsed += deltaTime;
                this.alpha = Math.max(0, 0.5 * (1 - this.elapsed / this.duration));
                this.isFinished = this.elapsed >= this.duration;
            },
            
            render: function(context) {
                if (this.alpha > 0) {
                    context.fillStyle = this.color;
                    context.globalAlpha = this.alpha;
                    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                    context.globalAlpha = 1;
                }
            }
        };
        
        this.currentEffects.push(flash);
    }
}

// Animation Manager for coordinating multiple animations
class AnimationManager {
    constructor() {
        this.animations = [];
    }
    
    update(deltaTime) {
        this.animations = this.animations.filter(animation => {
            animation.update(deltaTime);
            return !animation.isFinished;
        });
    }
    
    addAnimation(animation) {
        this.animations.push(animation);
    }
}

// Boss Particle System for various effects
class BossParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 500;
    }
    
    update(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            return particle.life > 0;
        });
    }
    
    render(context) {
        for (const particle of this.particles) {
            particle.render(context);
        }
    }
    
    addParticles(type, x, y, count) {
        if (this.particles.length + count > this.maxParticles) {
            // Remove oldest particles
            this.particles.splice(0, count);
        }
        
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(type, x, y));
        }
    }
    
    createParticle(type, x, y) {
        const baseParticle = {
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            life: 1.0,
            maxLife: 1.0,
            size: 3,
            color: '#ffffff',
            
            update: function(deltaTime) {
                this.x += this.vx * deltaTime * 0.1;
                this.y += this.vy * deltaTime * 0.1;
                this.life -= deltaTime * 0.001;
            },
            
            render: function(context) {
                const alpha = this.life / this.maxLife;
                context.globalAlpha = alpha;
                context.fillStyle = this.color;
                context.beginPath();
                context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                context.fill();
                context.globalAlpha = 1;
            }
        };
        
        // Customize based on type
        switch (type) {
            case 'spawn':
                baseParticle.vx = (Math.random() - 0.5) * 100;
                baseParticle.vy = (Math.random() - 0.5) * 100;
                baseParticle.color = '#ffff00';
                baseParticle.maxLife = 2000;
                baseParticle.life = 2000;
                break;
                
            case 'damage':
                baseParticle.vx = (Math.random() - 0.5) * 200;
                baseParticle.vy = (Math.random() - 0.5) * 200;
                baseParticle.color = '#ff0000';
                baseParticle.maxLife = 1000;
                baseParticle.life = 1000;
                break;
                
            case 'defeat':
                baseParticle.vx = (Math.random() - 0.5) * 150;
                baseParticle.vy = -Math.random() * 100 - 50; // Upward
                baseParticle.color = '#888888';
                baseParticle.maxLife = 3000;
                baseParticle.life = 3000;
                break;
                
            case 'victory':
                baseParticle.vx = (Math.random() - 0.5) * 50;
                baseParticle.vy = -Math.random() * 150 - 100; // Strong upward
                baseParticle.color = '#ffd700'; // Gold
                baseParticle.maxLife = 4000;
                baseParticle.life = 4000;
                baseParticle.size = 5;
                break;
        }
            
        return baseParticle;
    }
}



// Attack Pattern Visual Effects
class AlgebraWavesEffect {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'background';
        this.isFinished = false;
        this.duration = 10000; // 10 seconds
        this.elapsed = 0;
        this.symbols = ['+', '-', '×', '÷', '='];
        this.waves = [];
        
        // Create wave objects
        for (let i = 0; i < 5; i++) {
            this.waves.push({
                y: Math.random() * 600,
                speed: 20 + Math.random() * 30,
                amplitude: 30 + Math.random() * 20,
                frequency: 0.01 + Math.random() * 0.005,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
        
        // Update wave phases
        for (const wave of this.waves) {
            wave.phase += deltaTime * 0.001;
        }
    }
    
    render(context) {
        context.save();
        context.globalAlpha = 0.6;
        context.font = '24px Arial';
        context.textAlign = 'center';
        
        for (let waveIndex = 0; waveIndex < this.waves.length; waveIndex++) {
            const wave = this.waves[waveIndex];
            const symbol = this.symbols[waveIndex % this.symbols.length];
            
            // Create wave pattern
            for (let x = -50; x < context.canvas.width + 50; x += 80) {
                const waveY = wave.y + Math.sin((x * wave.frequency) + wave.phase) * wave.amplitude;
                const alpha = Math.sin(wave.phase + x * 0.01) * 0.5 + 0.5;
                
                context.globalAlpha = alpha * 0.6;
                context.fillStyle = `hsl(${200 + waveIndex * 30}, 70%, 60%)`;
                context.fillText(symbol, x, waveY);
            }
        }
        
        context.restore();
    }
}

class NumberRainEffect {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'background';
        this.isFinished = false;
        this.duration = 15000; // 15 seconds
        this.elapsed = 0;
        this.raindrops = [];
        this.spawnTimer = 0;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
        
        // Spawn new raindrops
        this.spawnTimer += deltaTime;
        if (this.spawnTimer > 200) { // Every 200ms
            this.spawnTimer = 0;
            this.raindrops.push({
                x: Math.random() * 800,
                y: -20,
                speed: 50 + Math.random() * 100,
                number: Math.floor(Math.random() * 100),
                size: 16 + Math.random() * 8,
                alpha: 0.7 + Math.random() * 0.3
            });
        }
        
        // Update raindrops
        this.raindrops = this.raindrops.filter(drop => {
            drop.y += drop.speed * deltaTime * 0.1;
            return drop.y < 650; // Remove when off screen
        });
    }
    
    render(context) {
        context.save();
        context.textAlign = 'center';
        context.fillStyle = '#ffd700'; // Gold
        
        for (const drop of this.raindrops) {
            context.font = `${drop.size}px Arial`;
            context.globalAlpha = drop.alpha;
            context.fillText(drop.number.toString(), drop.x, drop.y);
        }
        
        context.restore();
    }
}

class FormulaStormEffect {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'background';
        this.isFinished = false;
        this.duration = 12000; // 12 seconds
        this.elapsed = 0;
        this.formulas = [];
        this.centerX = boss.x;
        this.centerY = boss.y;
        
        // Create swirling formulas
        const formulaTexts = ['(x+1)²', '(x-2)²', '(a+b)²', '(x+y)²', '(2x+3)²'];
        for (let i = 0; i < formulaTexts.length; i++) {
            this.formulas.push({
                text: formulaTexts[i],
                angle: (i * Math.PI * 2) / formulaTexts.length,
                radius: 100 + i * 20,
                speed: 0.002 + Math.random() * 0.001,
                color: `hsl(${i * 60}, 70%, 60%)`
            });
        }
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
        
        // Update formula positions
        for (const formula of this.formulas) {
            formula.angle += formula.speed * deltaTime;
            formula.radius += Math.sin(this.elapsed * 0.001) * 2;
        }
    }
    
    render(context) {
        context.save();
        context.font = 'bold 20px Arial';
        context.textAlign = 'center';
        
        for (const formula of this.formulas) {
            const x = this.centerX + Math.cos(formula.angle) * formula.radius;
            const y = this.centerY + Math.sin(formula.angle) * formula.radius;
            
            // Glow effect
            context.shadowColor = formula.color;
            context.shadowBlur = 15;
            context.fillStyle = formula.color;
            context.fillText(formula.text, x, y);
        }
        
        context.restore();
    }
}

class VariableChaosEffect {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'background';
        this.isFinished = false;
        this.duration = 18000; // 18 seconds
        this.elapsed = 0;
        this.explosions = [];
        this.explosionTimer = 0;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
        
        // Create explosions
        this.explosionTimer += deltaTime;
        if (this.explosionTimer > 1000) { // Every second
            this.explosionTimer = 0;
            const variables = ['X', 'Y', 'Z'];
            const colors = ['#ff4444', '#44ff44', '#4444ff'];
            
            for (let i = 0; i < 3; i++) {
                this.explosions.push({
                    x: this.boss.x + (Math.random() - 0.5) * 200,
                    y: this.boss.y + (Math.random() - 0.5) * 200,
                    variable: variables[i],
                    color: colors[i],
                    size: 0,
                    maxSize: 40 + Math.random() * 20,
                    life: 2000,
                    maxLife: 2000
                });
            }
        }
        
        // Update explosions
        this.explosions = this.explosions.filter(explosion => {
            explosion.life -= deltaTime;
            const progress = 1 - (explosion.life / explosion.maxLife);
            explosion.size = explosion.maxSize * Math.sin(progress * Math.PI);
            return explosion.life > 0;
        });
    }
    
    render(context) {
        context.save();
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        for (const explosion of this.explosions) {
            const alpha = explosion.life / explosion.maxLife;
            context.globalAlpha = alpha;
            context.font = `bold ${explosion.size}px Arial`;
            context.fillStyle = explosion.color;
            context.strokeStyle = '#ffffff';
            context.lineWidth = 2;
            
            context.strokeText(explosion.variable, explosion.x, explosion.y);
            context.fillText(explosion.variable, explosion.x, explosion.y);
        }
        
        context.restore();
    }
}

// Feedback Effect Classes
class CorrectAnswerEffect {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'foreground';
        this.isFinished = false;
        this.duration = 1000;
        this.elapsed = 0;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
    }
    
    render(context) {
        const progress = this.elapsed / this.duration;
        const alpha = Math.sin(progress * Math.PI);
        
        context.save();
        context.globalAlpha = alpha;
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#00ff00';
        context.strokeStyle = '#ffffff';
        context.lineWidth = 3;
        
        const x = context.canvas.width / 2;
        const y = context.canvas.height / 2 - 50;
        
        context.strokeText('KORREKT!', x, y);
        context.fillText('KORREKT!', x, y);
        context.restore();
    }
}

class IncorrectAnswerEffect {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'foreground';
        this.isFinished = false;
        this.duration = 1000;
        this.elapsed = 0;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
    }
    
    render(context) {
        const progress = this.elapsed / this.duration;
        const alpha = Math.sin(progress * Math.PI);
        const shake = Math.sin(progress * Math.PI * 20) * 5;
        
        context.save();
        context.globalAlpha = alpha;
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#ff0000';
        context.strokeStyle = '#ffffff';
        context.lineWidth = 3;
        
        const x = context.canvas.width / 2 + shake;
        const y = context.canvas.height / 2 - 50;
        
        context.strokeText('FALSCH!', x, y);
        context.fillText('FALSCH!', x, y);
        context.restore();
    }
}

class InterruptionEffect {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'foreground';
        this.isFinished = false;
        this.duration = 2000;
        this.elapsed = 0;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
    }
    
    render(context) {
        const progress = this.elapsed / this.duration;
        const alpha = Math.max(0, 1 - progress);
        const shake = Math.sin(this.elapsed * 0.05) * 10;
        
        context.save();
        context.globalAlpha = alpha;
        context.font = 'bold 36px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#ff0000';
        context.strokeStyle = '#ffffff';
        context.lineWidth = 3;
        
        const x = context.canvas.width / 2 + shake;
        const y = context.canvas.height / 2 - 50;
        
        context.strokeText('UNTERBROCHEN!', x, y);
        context.fillText('UNTERBROCHEN!', x, y);
        
        context.font = 'bold 24px Arial';
        context.strokeText('-1 Leben', x, y + 40);
        context.fillText('-1 Leben', x, y + 40);
        context.restore();
    }
}

class BossDefeatSequence {
    constructor(boss) {
        this.boss = boss;
        this.layer = 'foreground';
        this.isFinished = false;
        this.duration = 4000; // 4 seconds total
        this.elapsed = 0;
        this.phase = 1;
    }
    
    update(deltaTime) {
        this.elapsed += deltaTime;
        this.isFinished = this.elapsed >= this.duration;
        
        // Update phase based on elapsed time
        if (this.elapsed < 1000) {
            this.phase = 1; // Damage accumulation
        } else if (this.elapsed < 2000) {
            this.phase = 2; // Critical state
        } else if (this.elapsed < 3000) {
            this.phase = 3; // Explosion
        } else {
            this.phase = 4; // Victory effects
        }
    }
    
    render(context) {
        const phaseProgress = (this.elapsed % 1000) / 1000;
        
        switch (this.phase) {
            case 1: // Damage accumulation
                this.renderDamagePhase(context, phaseProgress);
                break;
            case 2: // Critical state
                this.renderCriticalPhase(context, phaseProgress);
                break;
            case 3: // Explosion
                this.renderExplosionPhase(context, phaseProgress);
                break;
            case 4: // Victory
                this.renderVictoryPhase(context, phaseProgress);
                break;
        }
    }
    
    renderDamagePhase(context, progress) {
        // Flickering effect
        const flicker = Math.sin(progress * Math.PI * 20) * 0.3 + 0.7;
        context.globalAlpha = flicker;
    }
    
    renderCriticalPhase(context, progress) {
        // Intense red flashing
        const intensity = Math.sin(progress * Math.PI * 10) * 0.5 + 0.5;
        context.fillStyle = `rgba(255, 0, 0, ${intensity * 0.4})`;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    
    renderExplosionPhase(context, progress) {
        // White flash and explosion
        const alpha = 1 - progress;
        context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    
    renderVictoryPhase(context, progress) {
        // Victory text
        context.save();
        context.font = 'bold 64px Arial';
        context.textAlign = 'center';
        context.fillStyle = '#ffd700';
        context.strokeStyle = '#ffffff';
        context.lineWidth = 4;
        
        const x = context.canvas.width / 2;
        const y = context.canvas.height / 2;
        
        context.strokeText('SIEG!', x, y);
        context.fillText('SIEG!', x, y);
        
        // Boss level completion message
        const messages = {
            1: "Grundlagen gemeistert! 🎯",
            2: "Fortgeschrittener Status erreicht! 🚀", 
            3: "Meister-Level erreicht! 👑",
            4: "Grandmaster der binomischen Formeln! 🌟"
        };
        
        const message = messages[this.boss.level] || "Boss besiegt!";
        context.font = 'bold 24px Arial';
        context.strokeText(message, x, y + 60);
        context.fillText(message, x, y + 60);
        
        context.restore();
    }
}

// === BOSS DEBUG COMMANDS ===
// Global debug functions for testing boss system

window.bossDebug = {
    // Spawn a boss at any level
    spawnBoss: (level = 1) => {
        if (!window.gameEngine || !window.gameEngine.waveSystem) {
            console.error('❌ GameEngine or WaveSystem not available');
            return;
        }
        
        const waveNumber = level * 10;
        console.log(`🔧 DEBUG: Spawning boss level ${level} (wave ${waveNumber})`);
        
        // Clear existing enemies
        if (window.gameEngine.enemySpawner) {
            window.gameEngine.enemySpawner.enemies = [];
        }
        
        // Force spawn boss
        const boss = window.gameEngine.waveSystem.bossManager.spawnBoss(waveNumber);
        window.gameEngine.waveSystem.showBossUI(boss);
        
        console.log(`✅ Boss spawned: ${boss.name}`);
        return boss;
    },
    
    // Defeat current boss instantly
    defeatBoss: () => {
        if (!window.gameEngine || !window.gameEngine.waveSystem) {
            console.error('❌ GameEngine or WaveSystem not available');
            return;
        }
        
        const bossManager = window.gameEngine.waveSystem.bossManager;
        if (!bossManager.isBossActive()) {
            console.warn('⚠️ No active boss to defeat');
            return;
        }
        
        console.log('🔧 DEBUG: Force defeating boss');
        bossManager.forceBossDefeat();
        console.log('✅ Boss defeated');
    },
    
    // Get current boss stats
    getBossStats: () => {
        if (!window.gameEngine || !window.gameEngine.waveSystem) {
            console.error('❌ GameEngine or WaveSystem not available');
            return null;
        }
        
        const stats = window.gameEngine.waveSystem.bossManager.getBossStats();
        if (stats) {
            console.table(stats);
        } else {
            console.log('ℹ️ No active boss');
        }
        return stats;
    },
    
    // Test boss visual effects
    testBossVisuals: (effectName = 'spawn') => {
        if (!window.gameEngine || !window.gameEngine.waveSystem) {
            console.error('❌ GameEngine or WaveSystem not available');
            return;
        }
        
        const bossManager = window.gameEngine.waveSystem.bossManager;
        if (!bossManager.isBossActive()) {
            console.warn('⚠️ No active boss for visual test');
            return;
        }
        
        const boss = bossManager.currentBoss;
        const visualSystem = boss.visualSystem;
        
        if (!visualSystem) {
            console.error('❌ Boss visual system not available');
            return;
        }
        
        console.log(`🔧 DEBUG: Testing visual effect: ${effectName}`);
        
        switch (effectName) {
            case 'spawn':
                visualSystem.triggerSpawnEffect();
                break;
            case 'damage':
                visualSystem.triggerDamageEffect();
                break;
            case 'attack':
                visualSystem.triggerAttackEffect('algebra_waves');
                break;
            case 'correct':
                visualSystem.triggerFeedbackEffect('correct');
                break;
            case 'wrong':
                visualSystem.triggerFeedbackEffect('incorrect');
                break;
            case 'defeat':
                visualSystem.triggerDefeatAnimation();
                break;
            default:
                console.warn(`⚠️ Unknown effect: ${effectName}`);
                console.log('Available effects: spawn, damage, attack, correct, wrong, defeat');
        }
    },
    
    // Test boss audio
    testBossAudio: (soundName = 'spawn') => {
        if (!window.gameEngine || !window.gameEngine.audioManager) {
            console.error('❌ GameEngine or AudioManager not available');
            return;
        }
        
        const audioManager = window.gameEngine.audioManager;
        console.log(`🔧 DEBUG: Testing boss audio: ${soundName}`);
        
        switch (soundName) {
            case 'spawn':
                audioManager.onBossSpawn({ name: 'Test Boss', level: 1 });
                break;
            case 'attack':
                audioManager.onBossAttack('algebra_waves');
                break;
            case 'damage':
                audioManager.onBossDamage({ name: 'Test Boss' });
                break;
            case 'defeat':
                audioManager.onBossDefeat({ name: 'Test Boss' });
                break;
            case 'victory':
                audioManager.onBossVictory();
                break;
            case 'correct':
                audioManager.onBossFormulaCorrect({ name: 'Test Boss' });
                break;
            case 'wrong':
                audioManager.onBossFormulaWrong({ name: 'Test Boss' });
                break;
            default:
                console.warn(`⚠️ Unknown sound: ${soundName}`);
                console.log('Available sounds: spawn, attack, damage, defeat, victory, correct, wrong');
        }
    },
    
    // Skip to next boss wave
    skipToBossWave: (waveNumber = 10) => {
        if (!window.gameEngine || !window.gameEngine.waveSystem) {
            console.error('❌ GameEngine or WaveSystem not available');
            return;
        }
        
        // Ensure it's a boss wave
        const adjustedWave = Math.ceil(waveNumber / 10) * 10;
        console.log(`🔧 DEBUG: Skipping to boss wave ${adjustedWave}`);
        
        const waveSystem = window.gameEngine.waveSystem;
        waveSystem.currentWave = adjustedWave - 1;
        waveSystem.startWave();
        
        console.log(`✅ Skipped to wave ${adjustedWave}`);
    },
    
    // Show help
    help: () => {
        console.log(`
🔧 BOSS DEBUG COMMANDS:

bossDebug.spawnBoss(level)     - Spawn boss at specific level (1-4)
bossDebug.defeatBoss()         - Instantly defeat current boss
bossDebug.getBossStats()       - Show current boss statistics
bossDebug.testBossVisuals(fx)  - Test visual effects (spawn/damage/attack/correct/wrong/defeat)
bossDebug.testBossAudio(snd)   - Test audio effects (spawn/attack/damage/defeat/victory/correct/wrong)
bossDebug.skipToBossWave(wave) - Skip to specific boss wave (10, 20, 30, 40)
bossDebug.help()               - Show this help

Examples:
  bossDebug.spawnBoss(2)       // Spawn level 2 boss
  bossDebug.testBossVisuals('attack')
  bossDebug.skipToBossWave(20) // Skip to wave 20 boss
        `);
    }
};

// Auto-show help on first load
console.log('🔧 Boss Debug Commands loaded! Type bossDebug.help() for available commands.');

// Global verfügbar machen - Sofort nach Klassendefinition
console.log('🔧 Exporting BossManager to global scope...');
window.BossManager = BossManager;
window.Boss = Boss;
window.BossVisualSystem = BossVisualSystem;
window.BossFormulaSystem = BossFormulaSystem;
window.BossStateMachine = BossStateMachine;
window.BossParticleSystem = BossParticleSystem;
window.AnimationManager = AnimationManager;
console.log('✅ BossManager exported:', typeof window.BossManager);
window.AlgebraWavesEffect = AlgebraWavesEffect;
window.NumberRainEffect = NumberRainEffect;
window.FormulaStormEffect = FormulaStormEffect;
window.VariableChaosEffect = VariableChaosEffect;
