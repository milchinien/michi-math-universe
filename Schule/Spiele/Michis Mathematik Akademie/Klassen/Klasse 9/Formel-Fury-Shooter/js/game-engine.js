/**
 * FORMEL-FURY-SHOOTER - GAME ENGINE
 * Core game engine managing all game systems and logic
 * Phase 4.2: Modulare Struktur
 */

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.fpsCounter = document.getElementById('fpsCounter');
        
        // FPS-Tracking
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.fpsUpdateInterval = 1000; // Update FPS every second
        this.lastFpsUpdate = 0;
        
        // Game state management
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameover'
        this.gameMode = 'night'; // 'day' or 'night'
        this.isRunning = false;
        this.cheatMode = false;
        this.slowMotion = false;
        this.slowMotionFactor = 0.3; // 30% Geschwindigkeit
        
        console.log('🎮 GameEngine initialized - cheatMode:', this.cheatMode);
       
       // Game objects
       this.player = null;
       this.inputHandler = null;
       this.formulaSystem = null;
       this.enemySpawner = null;
       this.currencySystem = null;
       this.waveSystem = null;
       this.levelSystem = null;
       this.levelUpSystem = null;
       this.statsSystem = null;
       this.shopSystem = null;
       this.arenaSystem = null;
       this.particleSystem = null;
       
       // Input state tracking
       this.spacePressed = false;
       
       // Game state - NEW 5 HP SYSTEM
       this.playerHealth = 5;
       this.playerMaxHealth = 5;
       this.isGameOver = false;
       this.isPaused = false;
       
       // Combat system
       this.targetedEnemy = null;
       this.combatMode = false;
       this.lastDamageTime = 0;
       this.damageImmuneTime = 1000; // 1 second immunity after taking damage
       this.combatStartTime = 0;
       
       // Pause menu elements
       this.pauseMenu = null;
       this.pauseStats = {
           score: null,
           correct: null,
           incorrect: null,
           accuracy: null,
           health: null
       };
       
       this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.initializeGameObjects();
        this.initializeMenuStats();
        this.setupCheatCode();
        this.showMainMenu();
    }

    setupCheatCode() {
        // Cheat code: Ctrl + CapsLock
        this.cheatKeys = {
            ctrl: false,
            capslock: false
        };
        
        // Cheat mode features
        this.cheatFeatures = {
            infiniteHP: false,
            infiniteHPRegen: false,
            infiniteCoins: false,
            showCorrectAnswers: false,
            infiniteShopPurchases: false
        };
        
        console.log('🔧 Cheat code system initialized. Use Ctrl+CapsLock to toggle cheat menu.');

        document.addEventListener('keydown', (e) => {
            // Track key states
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.cheatKeys.ctrl = true;
            }
            if (e.code === 'CapsLock') {
                this.cheatKeys.capslock = true;
            }

            // Check if all keys are pressed
            if (this.cheatKeys.ctrl && this.cheatKeys.capslock) {
                // Prevent event bubbling
                e.preventDefault();
                e.stopPropagation();
                
                this.showCheatMenu();
                
                // Reset keys to prevent rapid toggling
                this.cheatKeys = { ctrl: false, capslock: false };
                
                console.log('🔧 Cheat code detected: Ctrl+CapsLock');
            }
        });

        document.addEventListener('keyup', (e) => {
            // Reset key states on release
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.cheatKeys.ctrl = false;
            }
            if (e.code === 'CapsLock') {
                this.cheatKeys.capslock = false;
            }
        });
    }

    showCheatMenu() {
        // Create cheat menu if it doesn't exist
        if (!document.getElementById('cheatMenu')) {
            this.createCheatMenu();
        }
        
        const cheatMenu = document.getElementById('cheatMenu');
        cheatMenu.style.display = 'block';
        
        // Pause game if playing
        if (this.gameState === 'playing') {
            this.pauseGame();
        }
        
        console.log('🔧 Cheat menu opened');
    }
    
    createCheatMenu() {
        const cheatMenu = document.createElement('div');
        cheatMenu.id = 'cheatMenu';
        cheatMenu.innerHTML = `
            <div class="cheat-overlay">
                <div class="cheat-panel">
                    <div class="cheat-header">
                        <h2>🔧 CHEAT MENU</h2>
                        <button class="cheat-close" onclick="window.gameEngine.hideCheatMenu()">✖</button>
                    </div>
                    
                    <div class="cheat-content">
                        <div class="cheat-section">
                            <h3>💪 Gameplay Cheats</h3>
                            <div class="cheat-options">
                                <label class="cheat-option">
                                    <input type="checkbox" id="cheatInfiniteHP" onchange="window.gameEngine.toggleCheat('infiniteHP', this.checked)">
                                    <span>🩸 Unendlich HP</span>
                                </label>
                                <label class="cheat-option">
                                    <input type="checkbox" id="cheatInfiniteHPRegen" onchange="window.gameEngine.toggleCheat('infiniteHPRegen', this.checked)">
                                    <span>💚 Unendliche HP-Regeneration</span>
                                </label>
                                <label class="cheat-option">
                                    <input type="checkbox" id="cheatInfiniteCoins" onchange="window.gameEngine.toggleCheat('infiniteCoins', this.checked)">
                                    <span>💰 Unendlich Münzen</span>
                                </label>
                                <label class="cheat-option">
                                    <input type="checkbox" id="cheatShowAnswers" onchange="window.gameEngine.toggleCheat('showCorrectAnswers', this.checked)">
                                    <span>🎯 Richtige Antworten anzeigen</span>
                                </label>
                                <label class="cheat-option">
                                    <input type="checkbox" id="cheatInfiniteShop" onchange="window.gameEngine.toggleCheat('infiniteShopPurchases', this.checked)">
                                    <span>🛒 Unendliche Shop-Käufe</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="cheat-section">
                            <h3>⬆️ Upgrade Manager</h3>
                            <div class="cheat-upgrades">
                                <button class="cheat-btn" onclick="window.gameEngine.openUpgradeCheatMenu()">
                                    🎁 Alle Upgrades & Items
                                </button>
                                <button class="cheat-btn" onclick="window.gameEngine.resetAllUpgrades()">
                                    🔄 Alle Upgrades zurücksetzen
                                </button>
                            </div>
                        </div>
                        
                        <div class="cheat-section">
                            <h3>🎮 Schnelle Aktionen</h3>
                            <div class="cheat-actions">
                                <button class="cheat-btn" onclick="window.gameEngine.addCoins(1000)">
                                    +1000 💰 Münzen
                                </button>
                                <button class="cheat-btn" onclick="window.gameEngine.healPlayer()">
                                    ❤️ Vollständig heilen
                                </button>
                                <button class="cheat-btn" onclick="window.gameEngine.skipToWave(10)">
                                    🌊 Zu Welle 10 springen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(cheatMenu);
        this.styleCheatMenu();
    }
    
    styleCheatMenu() {
        const style = document.createElement('style');
        style.textContent = `
            #cheatMenu {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
            }
            
            .cheat-overlay {
                background: rgba(0, 0, 0, 0.8);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .cheat-panel {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #00ffff;
                border-radius: 15px;
                width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            }
            
            .cheat-header {
                background: linear-gradient(90deg, #00ffff, #ff00ff);
                color: #000;
                padding: 15px 20px;
                border-radius: 13px 13px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .cheat-header h2 {
                margin: 0;
                font-size: 24px;
                font-weight: bold;
            }
            
            .cheat-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: #000;
                font-size: 20px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                cursor: pointer;
                font-weight: bold;
            }
            
            .cheat-close:hover {
                background: rgba(255, 255, 255, 0.4);
            }
            
            .cheat-content {
                padding: 20px;
                color: #fff;
            }
            
            .cheat-section {
                margin-bottom: 25px;
                padding: 15px;
                background: rgba(0, 255, 255, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .cheat-section h3 {
                margin: 0 0 15px 0;
                color: #00ffff;
                font-size: 18px;
            }
            
            .cheat-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .cheat-option {
                display: flex;
                align-items: center;
                cursor: pointer;
                padding: 8px;
                border-radius: 5px;
                transition: background 0.2s;
            }
            
            .cheat-option:hover {
                background: rgba(0, 255, 255, 0.1);
            }
            
            .cheat-option input[type="checkbox"] {
                margin-right: 10px;
                transform: scale(1.2);
                accent-color: #00ffff;
            }
            
            .cheat-option span {
                font-size: 16px;
            }
            
            .cheat-upgrades, .cheat-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .cheat-btn {
                background: linear-gradient(45deg, #ff00ff, #00ffff);
                color: #000;
                border: none;
                padding: 10px 15px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .cheat-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
            }
            
            .cheat-btn:active {
                transform: translateY(0);
            }
        `;
        
        document.head.appendChild(style);
    }
    
    hideCheatMenu() {
        const cheatMenu = document.getElementById('cheatMenu');
        if (cheatMenu) {
            cheatMenu.style.display = 'none';
        }
        
        // Resume game if it was paused by cheat menu
        if (this.gameState === 'paused') {
            this.resumeGame();
        }
        
        console.log('🔧 Cheat menu closed');
    }
    
    toggleCheat(cheatName, enabled) {
        this.cheatFeatures[cheatName] = enabled;
        
        console.log(`🔧 Cheat ${cheatName}: ${enabled ? 'ENABLED' : 'DISABLED'}`);
        
        // Apply immediate effects
        if (enabled) {
            switch(cheatName) {
                case 'infiniteHP':
                    this.playerHealth = this.playerMaxHealth;
                    break;
                case 'infiniteCoins':
                    if (this.currencySystem) {
                        this.currencySystem.addCoins(999999);
                    }
                    break;
            }
        }
        
        // Update cheat indicator
        this.updateCheatIndicator();
    }
    
    updateCheatIndicator() {
        const anyCheatActive = Object.values(this.cheatFeatures).some(cheat => cheat);
        
        let indicator = document.getElementById('cheatIndicator');
        if (!indicator && anyCheatActive) {
            indicator = document.createElement('div');
            indicator.id = 'cheatIndicator';
            indicator.innerHTML = '🔧 CHEAT MODE';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(45deg, #ff0000, #ff6600);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-weight: bold;
                z-index: 1000;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(255, 0, 0, 0.5);
            `;
            document.body.appendChild(indicator);
        }
        
        if (indicator) {
            indicator.style.display = anyCheatActive ? 'block' : 'none';
        }
    }
    
    // Quick action methods
    addCoins(amount) {
        if (this.currencySystem) {
            this.currencySystem.addCoins(amount);
            console.log(`🔧 Added ${amount} coins`);
        }
    }
    
    healPlayer() {
        this.playerHealth = this.playerMaxHealth;
        console.log('🔧 Player fully healed');
    }
    
    skipToWave(waveNumber) {
        if (this.waveSystem) {
            this.waveSystem.currentWave = waveNumber - 1;
            this.waveSystem.startWave();
            console.log(`🔧 Skipped to wave ${waveNumber}`);
        }
    }
    
    openUpgradeCheatMenu() {
        // Create upgrade selection menu
        if (!document.getElementById('upgradeCheatMenu')) {
            this.createUpgradeCheatMenu();
        }
        
        const upgradeMenu = document.getElementById('upgradeCheatMenu');
        upgradeMenu.style.display = 'block';
        
        // Ensure game stays paused when opening upgrade menu
        if (this.gameState === 'playing') {
            this.pauseGame();
        }
    }
    
    hideUpgradeCheatMenu() {
        const upgradeMenu = document.getElementById('upgradeCheatMenu');
        if (upgradeMenu) {
            upgradeMenu.style.display = 'none';
        }
        
        // Resume game if it was paused by cheat menu
        if (this.gameState === 'paused') {
            this.resumeGame();
        }
    }
    
    createUpgradeCheatMenu() {
        const upgradeMenu = document.createElement('div');
        upgradeMenu.id = 'upgradeCheatMenu';
        upgradeMenu.innerHTML = `
            <div class="cheat-overlay">
                <div class="cheat-panel upgrade-panel">
                    <div class="cheat-header">
                        <h2>🎁 UPGRADE CHEAT MENU</h2>
                        <button class="cheat-close" onclick="window.gameEngine.hideUpgradeCheatMenu()">✖</button>
                    </div>
                    
                    <div class="cheat-content">
                        <div class="upgrade-grid" id="upgradeCheatGrid">
                            <!-- Upgrades will be populated here -->
                        </div>
                        
                        <div class="cheat-section">
                            <button class="cheat-btn" onclick="window.gameEngine.giveAllUpgrades()">
                                🌟 Alle Upgrades geben
                            </button>
                            <button class="cheat-btn" onclick="window.gameEngine.maxAllUpgrades()">
                                ⭐ Alle Upgrades maximieren
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(upgradeMenu);
        this.populateUpgradeCheatMenu();
        this.styleUpgradeCheatMenu();
    }
    
    populateUpgradeCheatMenu() {
        const grid = document.getElementById('upgradeCheatGrid');
        if (!grid || !this.levelUpSystem) return;
        
        // Get all available upgrades
        const upgrades = this.levelUpSystem.getAllUpgrades();
        
        grid.innerHTML = '';
        upgrades.forEach(upgrade => {
            const upgradeElement = document.createElement('div');
            upgradeElement.className = 'upgrade-cheat-item';
            upgradeElement.innerHTML = `
                <div class="upgrade-icon">${upgrade.icon}</div>
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-level">Level: ${upgrade.currentLevel}/${upgrade.maxLevel}</div>
                <button class="upgrade-cheat-btn" onclick="window.gameEngine.giveUpgrade('${upgrade.id}')">
                    +1 Level
                </button>
            `;
            grid.appendChild(upgradeElement);
        });
    }
    
    styleUpgradeCheatMenu() {
        const style = document.createElement('style');
        style.textContent = `
            .upgrade-panel {
                width: 800px;
                max-height: 90vh;
            }
            
            .upgrade-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .upgrade-cheat-item {
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 10px;
                padding: 15px;
                text-align: center;
            }
            
            .upgrade-icon {
                font-size: 24px;
                margin-bottom: 8px;
            }
            
            .upgrade-name {
                font-weight: bold;
                margin-bottom: 5px;
                color: #00ffff;
            }
            
            .upgrade-level {
                font-size: 12px;
                color: #ccc;
                margin-bottom: 10px;
            }
            
            .upgrade-cheat-btn {
                background: linear-gradient(45deg, #00ff00, #00ffff);
                color: #000;
                border: none;
                padding: 5px 10px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
            }
            
            .upgrade-cheat-btn:hover {
                transform: scale(1.05);
            }
            
            @keyframes cheat-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    giveUpgrade(upgradeId) {
        if (this.levelUpSystem) {
            this.levelUpSystem.forceUpgrade(upgradeId);
            this.populateUpgradeCheatMenu(); // Refresh the display
            console.log(`🔧 Gave upgrade: ${upgradeId}`);
        }
    }
    
    giveAllUpgrades() {
        if (this.levelUpSystem) {
            const upgrades = this.levelUpSystem.getAllUpgrades();
            upgrades.forEach(upgrade => {
                this.levelUpSystem.forceUpgrade(upgrade.id);
            });
            this.populateUpgradeCheatMenu();
            console.log('🔧 Gave all upgrades');
        }
    }
    
    maxAllUpgrades() {
        if (this.levelUpSystem) {
            const upgrades = this.levelUpSystem.getAllUpgrades();
            upgrades.forEach(upgrade => {
                for (let i = upgrade.currentLevel; i < upgrade.maxLevel; i++) {
                    this.levelUpSystem.forceUpgrade(upgrade.id);
                }
            });
            this.populateUpgradeCheatMenu();
            console.log('🔧 Maximized all upgrades');
        }
    }
    
    resetAllUpgrades() {
        if (this.levelUpSystem) {
            this.levelUpSystem.resetAllUpgrades();
            console.log('🔧 Reset all upgrades');
        }
    }
    
    applyCheatEffects(deltaTime) {
        if (!this.cheatFeatures) return;
        
        // Infinite HP
        if (this.cheatFeatures.infiniteHP) {
            this.playerHealth = this.playerMaxHealth;
        }
        
        // Infinite HP Regeneration
        if (this.cheatFeatures.infiniteHPRegen) {
            this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + (deltaTime * 0.1));
        }
        
        // Infinite Coins
        if (this.cheatFeatures.infiniteCoins && this.currencySystem) {
            if (this.currencySystem.coins < 999999) {
                this.currencySystem.addCoins(999999 - this.currencySystem.coins);
            }
        }
    }
    
    toggleCheatMode() {
        this.cheatMode = !this.cheatMode;
        const indicator = document.getElementById('cheatIndicator');
        
        if (this.cheatMode) {
            if (indicator) indicator.style.display = 'block';
            this.playerMaxHealth = 999;
            this.playerHealth = 999;
            
            // Show visible confirmation
            alert('🔧 CHEAT-MODUS AKTIVIERT!\n\n✅ Unendlich Leben (999 HP)\n✅ Kein Schaden\n✅ Alle Features testbar\n\nTastenkombination: Strg+Shift+Y');
            console.log('🔧 CHEAT MODE ACTIVATED! (Ctrl+Shift+Y) Infinite health enabled.');
        } else {
            if (indicator) indicator.style.display = 'none';
            this.playerMaxHealth = 5;
            this.playerHealth = Math.min(this.playerHealth, 5);
            
            alert('🔧 CHEAT-MODUS DEAKTIVIERT!\n\n❌ Normale Gesundheit wiederhergestellt\n❌ Normaler Schwierigkeitsgrad');
            console.log('🔧 CHEAT MODE DEACTIVATED! Normal health restored.');
        }
        
        // Update game mode info if in game
        if (this.gameState === 'playing') {
            this.updateGameModeInfo();
        }
    }

    initializeMenuStats() {
        // Load and display menu statistics
        const stats = this.loadGameStats();
        
        const highScoreEl = document.getElementById('menuHighScore');
        const bestComboEl = document.getElementById('menuBestCombo');
        const totalCorrectEl = document.getElementById('menuTotalCorrect');
        const gamesPlayedEl = document.getElementById('menuGamesPlayed');
        
        if (highScoreEl) highScoreEl.textContent = stats.highScore;
        if (bestComboEl) bestComboEl.textContent = stats.bestCombo;
        if (totalCorrectEl) totalCorrectEl.textContent = stats.totalCorrect;
        if (gamesPlayedEl) gamesPlayedEl.textContent = stats.gamesPlayed;
    }

    loadGameStats() {
        return {
            highScore: localStorage.getItem('formelFuryHighScore') || 0,
            bestCombo: localStorage.getItem('formelFuryBestCombo') || 0,
            totalCorrect: localStorage.getItem('formelFuryTotalCorrect') || 0,
            gamesPlayed: localStorage.getItem('formelFuryGamesPlayed') || 0
        };
    }

    saveGameStats() {
        if (this.formulaSystem) {
            // Update best combo if current is higher
            const currentBestCombo = parseInt(localStorage.getItem('formelFuryBestCombo') || 0);
            if (this.formulaSystem.maxCombo > currentBestCombo) {
                localStorage.setItem('formelFuryBestCombo', this.formulaSystem.maxCombo.toString());
            }
            
            // Update total correct answers
            const currentTotalCorrect = parseInt(localStorage.getItem('formelFuryTotalCorrect') || 0);
            localStorage.setItem('formelFuryTotalCorrect', (currentTotalCorrect + this.formulaSystem.correctAnswers).toString());
            
            // Increment games played
            const currentGamesPlayed = parseInt(localStorage.getItem('formelFuryGamesPlayed') || 0);
            localStorage.setItem('formelFuryGamesPlayed', (currentGamesPlayed + 1).toString());
        }
    }

    initializeGameObjects() {
        // Create input handler (pass canvas for mouse events)
        this.inputHandler = new InputHandler(this.canvas);
        
        // Create player at center of canvas
        this.player = new Player(
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        
        // Create formula system with combat integration
        this.formulaSystem = new FormulaSystem();
        this.integrateFormulaSystemWithCombat();
        
        // Create currency system
        this.currencySystem = new CurrencySystem();
        
        // Create wave system
        this.waveSystem = new WaveSystem();
        this.setupWaveCallbacks();
        
        // Create level system
        this.levelSystem = new LevelSystem();
        
        // Create level up system
        this.levelUpSystem = new LevelUpSystem();
        
        // Create stats system
        this.statsSystem = new StatsSystem();
        
        // Create arena system
        this.arenaSystem = new ArenaSystem(this);
        
        // Create particle system
        this.particleSystem = new ParticleSystem(this.canvas, this.ctx);
        
        // Create screen effects system
        this.screenEffects = new ScreenEffects(this.canvas, this.ctx);
        
        // Create audio manager system
        this.audioManager = new AudioManager();
        
        // Dash system removed for optimization
        // this.dashSystem = new DashSystem(
        //     this.player, 
        //     this.canvas, 
        //     this.particleSystem, 
        //     this.screenEffects, 
        //     this.audioManager
        // );
        
        // Create floating input system
        this.floatingInputSystem = new FloatingInputSystem(
            this.player,
            this.canvas,
            this.formulaSystem,
            this.audioManager,
            this.screenEffects
        );
        
        // Create momentum system
        this.momentumSystem = new MomentumSystem(
            this.player,
            this.canvas,
            this.particleSystem,
            this.audioManager,
            this.screenEffects
        );
        
        // Create shop system
        this.shopSystem = new ShopSystem(this);
        
        // Create enemy spawner
        this.enemySpawner = new EnemySpawner(this.formulaSystem);
        
        // Initialize pause menu
        this.initializePauseMenu();
    }
    
    setupWaveCallbacks() {
        // Set up wave completion callback
        this.waveSystem.setOnWaveComplete((wave, stats) => {
            console.log(`🌊 Wave ${wave} completed! Opening shop menu...`);
            this.handleWaveComplete(wave, stats);
        });
        
        // Set up wave start callback
        this.waveSystem.setOnWaveStart((wave, data) => {
            console.log(`🌊 Wave ${wave} started! Enemies: ${data.enemiesPerWave}, Spawn rate: ${data.spawnRate}ms`);
            this.handleWaveStart(wave, data);
        });
    }
    
    handleWaveComplete(wave, stats) {
        // Exit combat mode to prevent issues
        this.exitCombatMode();
        
        // Clear any remaining enemies immediately when wave ends
        if (this.enemySpawner && this.enemySpawner.enemies.length > 0) {
            console.log(`🧹 Clearing ${this.enemySpawner.enemies.length} remaining enemies at wave end`);
            this.enemySpawner.enemies = [];
        }
        
        // Trigger screen effects for wave completion
        if (this.screenEffects) {
            this.screenEffects.onWaveComplete();
        }
        
        // Trigger audio effects for wave completion
        if (this.audioManager) {
            this.audioManager.onWaveComplete();
        }
        
        // Show wave complete animation
        if (this.waveSystem.waveDisplay) {
            this.waveSystem.waveDisplay.classList.add('wave-complete');
            setTimeout(() => {
                this.waveSystem.waveDisplay.classList.remove('wave-complete');
            }, 1000);
        }
        
        // Show level-up menu immediately
        this.showLevelUpMenu(wave, stats);
    }

    waitForEnemiesCleared(callback) {
        let waitTime = 0;
        const maxWaitTime = 10000; // Maximum 10 seconds wait
        
        const checkEnemies = () => {
            if (!this.enemySpawner || this.enemySpawner.enemies.length === 0) {
                console.log('✅ All enemies cleared, showing level-up menu');
                callback();
            } else if (waitTime >= maxWaitTime) {
                console.log('⏰ Max wait time reached, forcing level-up menu');
                // Clear remaining enemies and proceed
                this.enemySpawner.enemies = [];
                callback();
            } else {
                console.log(`⏳ Waiting for ${this.enemySpawner.enemies.length} enemies to be cleared... (${waitTime/1000}s)`);
                waitTime += 500;
                setTimeout(checkEnemies, 500); // Check every 500ms
            }
        };
        
        checkEnemies();
    }

    showLevelUpMenu(wave, stats) {
        // Handle multiple level-ups that occurred during the wave
        setTimeout(() => {
            this.handlePendingLevelUps(wave);
        }, 1500);
    }
    
    /**
     * Handle all pending level-ups that occurred during the wave
     */
    handlePendingLevelUps(wave) {
        if (!this.levelSystem || !this.levelUpSystem) {
            console.warn('⚠️ Level systems not available for pending level-ups');
            this.showPauseMenu();
            return;
        }
        
        const pendingLevelUps = this.levelSystem.getPendingLevelUps();
        
        if (pendingLevelUps === 0) {
            console.log('📊 No level-ups occurred during wave, showing shop menu');
            this.showShopAfterLevelUp();
            return;
        }
        
        console.log(`🔺 Processing ${pendingLevelUps} level-ups from wave ${wave}`);
        
        // Clear the pending level-ups from level system
        this.levelSystem.clearPendingLevelUps();
        
        // Show level-up menus sequentially
        this.showMultipleLevelUps(pendingLevelUps, wave);
    }
    
    /**
     * Show multiple level-up menus sequentially
     */
    showMultipleLevelUps(count, wave) {
        for (let i = 0; i < count; i++) {
            const coinsEarned = Math.floor(wave * 25 + Math.random() * 50);
            const currentLevelUp = i + 1;
            
            if (i === 0) {
                // Show first level-up menu immediately
                this.levelUpSystem.showLevelUp(coinsEarned, currentLevelUp, count);
                console.log(`🔺 Level-up menu ${currentLevelUp}/${count} shown with ${coinsEarned} coins`);
            } else {
                // Queue additional level-ups
                this.levelUpSystem.queueLevelUp(coinsEarned, currentLevelUp, count);
                console.log(`🔺 Level-up menu ${currentLevelUp}/${count} queued with ${coinsEarned} coins`);
            }
        }
    }

    handleWaveStart(wave, data) {
        // Update enemy spawner with wave data
        if (this.enemySpawner) {
            // Try to apply wave-specific spawn settings
            // If the method doesn't exist, the spawner will use default settings
            if (typeof this.enemySpawner.setWaveSettings === 'function') {
                this.enemySpawner.setWaveSettings(data.spawnRate, data.enemiesPerWave);
            } else {
                console.log('ℹ️ EnemySpawner does not support wave settings yet');
            }
        }
    }

    initializePauseMenu() {
        this.pauseMenu = document.getElementById('pauseMenu');
        this.pauseStats.score = document.getElementById('pauseScore');
        this.pauseStats.correct = document.getElementById('pauseCorrect');
        this.pauseStats.incorrect = document.getElementById('pauseIncorrect');
        this.pauseStats.accuracy = document.getElementById('pauseAccuracy');
        this.pauseStats.health = document.getElementById('pauseHealth');
    }

    integrateFormulaSystemWithCombat() {
        // Override formula system methods to integrate with combat
        const originalSubmitAnswer = this.formulaSystem.submitAnswer.bind(this.formulaSystem);
        const originalSkipFormula = this.formulaSystem.skipFormula.bind(this.formulaSystem);
        
        this.formulaSystem.submitAnswer = () => {
            const userAnswer = this.formulaSystem.formulaInput.value.trim();
            
            if (!userAnswer) {
                this.formulaSystem.showFeedback('Bitte gib eine Antwort ein!', false);
                return;
            }
            
            const isCorrect = this.formulaSystem.validateAnswer(userAnswer);
            
            if (isCorrect) {
                this.handleCorrectAnswer();
            } else {
                this.handleWrongAnswer();
            }
            
            this.formulaSystem.formulaInput.value = '';
        };
        
        this.formulaSystem.skipFormula = () => {
            if (this.targetedEnemy) {
                this.formulaSystem.showFeedback(`Übersprungen! Du nimmst Schaden!`, false);
                this.dealDamageToPlayer(1); // Only 1 HP damage
            }
            this.exitCombatMode();
        };
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Re-center player if it exists
        if (this.player) {
            this.player.x = this.canvas.width / 2;
            this.player.y = this.canvas.height / 2;
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        // Escape key for pause menu and exiting combat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.combatMode) {
                    // Exit combat mode when fighting enemies
                    this.exitCombatMode();
                    console.log('ESC pressed - Exited combat mode');
                } else if (this.gameState === 'playing') {
                    // Open pause menu during gameplay
                    this.togglePauseMenu();
                    console.log('ESC pressed - Toggled pause menu');
                }
            }
        });

        // Focus canvas for keyboard input
        this.canvas.focus();
        this.canvas.setAttribute('tabindex', '0');
    }

    showMainMenu() {
        this.gameState = 'menu';
        this.isRunning = false;
        
        // Hide stats panel when returning to menu
        if (this.statsSystem) {
            this.statsSystem.hide();
        }
        
        // Add class to body to hide game UI elements
        document.body.classList.add('main-menu-active');
        
        // Show canvas for background animation but keep menu visible
        this.canvas.style.display = 'block';
        this.canvas.style.filter = 'blur(3px)';
        this.canvas.style.zIndex = '1';
        
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
            mainMenu.style.zIndex = '10';
        }
        
        // Start background animation with enemies
        this.startMenuBackgroundAnimation();
        
        console.log('📋 Main menu shown with animated background');
    }

    /**
     * Start background animation for main menu
     */
    startMenuBackgroundAnimation() {
        if (this.gameState !== 'menu') return;
        
        // Create simplified enemies for background animation
        if (!this.backgroundEnemies) {
            this.backgroundEnemies = [];
            for (let i = 0; i < 8; i++) {
                this.backgroundEnemies.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 100,
                    vy: (Math.random() - 0.5) * 100,
                    size: 15 + Math.random() * 10,
                    color: `hsl(${Math.random() * 60 + 300}, 70%, 50%)`
                });
            }
        }
        
        this.isRunning = true;
        this.menuAnimationLoop();
    }

    /**
     * Animation loop for menu background
     */
    menuAnimationLoop(currentTime = 0) {
        if (this.gameState !== 'menu' || !this.isRunning) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update background enemies
        this.updateBackgroundEnemies(deltaTime);
        
        // Clear and render
        this.clearCanvas();
        
        // Render simple background for menu
        this.renderMenuBackground();
        this.renderBackgroundEnemies();
        
        requestAnimationFrame((time) => this.menuAnimationLoop(time));
    }

    /**
     * Update background enemies movement
     */
    updateBackgroundEnemies(deltaTime) {
        if (!this.backgroundEnemies) return;
        
        this.backgroundEnemies.forEach(enemy => {
            enemy.x += enemy.vx * deltaTime / 1000;
            enemy.y += enemy.vy * deltaTime / 1000;
            
            // Bounce off walls
            if (enemy.x <= 0 || enemy.x >= this.canvas.width) {
                enemy.vx *= -1;
                enemy.x = Math.max(0, Math.min(this.canvas.width, enemy.x));
            }
            if (enemy.y <= 0 || enemy.y >= this.canvas.height) {
                enemy.vy *= -1;
                enemy.y = Math.max(0, Math.min(this.canvas.height, enemy.y));
            }
        });
    }

    /**
     * Render background enemies for menu
     */
    renderBackgroundEnemies() {
        if (!this.backgroundEnemies) return;
        
        this.backgroundEnemies.forEach(enemy => {
            this.ctx.save();
            this.ctx.globalAlpha = 0.6;
            this.ctx.fillStyle = enemy.color;
            this.ctx.shadowColor = enemy.color;
            this.ctx.shadowBlur = 15;
            
            this.ctx.beginPath();
            this.ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    hideMainMenu() {
        // Remove class from body to show game UI elements
        document.body.classList.remove('main-menu-active');
        
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'none';
        }
        
        // Reset canvas styling
        this.canvas.style.filter = 'none';
        this.canvas.style.zIndex = 'auto';
        
        // Clear background enemies
        this.backgroundEnemies = null;
        
        console.log('📋 Main menu hidden');
    }

    showGameHUD() {
        document.getElementById('fpsCounter').style.display = 'block';
        // scoreDisplay removed - redundant with highScoreDisplay
        document.getElementById('comboDisplay').style.display = 'block';
        document.getElementById('highScoreDisplay').style.display = 'block';
        // gameInfo removed - not needed during gameplay
    }

    hideGameHUD() {
        document.getElementById('fpsCounter').style.display = 'none';
        // scoreDisplay already hidden
        document.getElementById('comboDisplay').style.display = 'none';
        document.getElementById('highScoreDisplay').style.display = 'none';
        // gameInfo already hidden
    }

    showMultipleChoice() {
        const mcHUD = document.getElementById('multipleChoiceHUD');
        if (mcHUD) {
            mcHUD.style.display = 'block';
        }
    }

    hideMultipleChoice() {
        const mcHUD = document.getElementById('multipleChoiceHUD');
        if (mcHUD) {
            mcHUD.style.display = 'none';
        }
    }

    showGameModeSelection() {
        const mainMenu = document.getElementById('mainMenu');
        const gameModeMenu = document.getElementById('gameModeMenu');
        
        if (mainMenu) mainMenu.classList.add('hidden');
        if (gameModeMenu) gameModeMenu.style.display = 'flex';
    }

    hideGameModeSelection() {
        const gameModeMenu = document.getElementById('gameModeMenu');
        if (gameModeMenu) gameModeMenu.style.display = 'none';
    }

    startGameWithMode(mode) {
        this.gameMode = mode;
        this.gameState = 'playing';
        this.hideGameModeSelection();
        this.hideMainMenu();
        this.showGameHUD();
        this.updateGameModeInfo();
        this.resetGame();
        
        // Show stats panel during gameplay
        if (this.statsSystem) {
            this.statsSystem.show();
        }
        
        this.start();
        
        // Start first wave after a short delay
        setTimeout(() => {
            if (this.waveSystem) {
                this.waveSystem.startWave();
            }
        }, 2000);
        
        console.log(`🎮 Starting game in ${mode.toUpperCase()} mode`);
        console.log(`🔧 Game mode set to: ${this.gameMode}`);
    }

    updateGameModeInfo() {
        const modeInfo = document.getElementById('gameModeInfo');
        if (modeInfo) {
            const modeText = this.gameMode === 'day' ? 'TAG ☀️' : 'NACHT 🌙';
            const cheatText = this.cheatMode ? ' | CHEAT 🔧' : '';
            modeInfo.textContent = `Modus: ${modeText}${cheatText} | Controls: WASD + Maus + ESC`;
        }
    }

    startGame() {
        // Default to night mode for backward compatibility
        this.startGameWithMode('night');
    }

    start() {
        this.isRunning = true;
        
        // Start ambient audio when game starts
        if (this.audioManager) {
            this.audioManager.startAmbientAudio();
            this.audioManager.preloadSounds();
        }
        
        this.gameLoop();
    }

    resetGame() {
        // Reset game state
        this.isGameOver = false;
        this.isPaused = false;
        this.playerHealth = this.cheatMode ? 999 : this.playerMaxHealth;
        this.exitCombatMode();
        
        // Reset player position
        if (this.player) {
            this.player.x = this.canvas.width / 2;
            this.player.y = this.canvas.height / 2;
        }
        
        // Clear enemies
        if (this.enemySpawner) {
            this.enemySpawner.enemies = [];
        }
        
        // Reset formula system
        if (this.formulaSystem) {
            this.formulaSystem.score = 0;
            this.formulaSystem.correctAnswers = 0;
            this.formulaSystem.incorrectAnswers = 0;
            this.formulaSystem.combo = 0;
            this.formulaSystem.maxCombo = 0;
            this.formulaSystem.startComboTimer();
            this.formulaSystem.updateScoreDisplay();
            this.formulaSystem.generateFormula();
        }
        
        // Hide pause menu and multiple choice
        this.hidePauseMenu();
        this.hideMultipleChoice();
    }

    stop() {
        this.isRunning = false;
        
        // Stop all audio when game stops
        if (this.audioManager) {
            this.audioManager.stopAllAudio();
        }
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;

        // Calculate delta time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Update FPS
        this.updateFPS(currentTime);

        // Update game objects
        this.update(deltaTime);

        // Clear canvas
        this.clearCanvas();

        // Update and render arena system
        if (this.arenaSystem) {
            this.arenaSystem.update(deltaTime);
            this.arenaSystem.render();
        }

        // Render game objects
        this.render();

        // Render debug info
        this.renderDebugInfo();

        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    updateFPS(currentTime) {
        this.frameCount++;
        
        if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
            this.renderDebugInfo();
        }
    }

    update(deltaTime) {
        if (this.isGameOver) {
            this.handleGameOver();
            return;
        }
        
        // Skip updates if paused
        if (this.isPaused) {
            return;
        }
        
        // Update combo timer
        if (this.formulaSystem) {
            this.formulaSystem.updateComboTimer();
            this.formulaSystem.updateComboDisplay();
        }
        
        // Update player
        if (this.player && this.inputHandler) {
            this.player.update(deltaTime, this.inputHandler, this.canvas.width, this.canvas.height);
        }
        
        // Update wave system
        if (this.waveSystem) {
            this.waveSystem.update(deltaTime);
        }
        
        // Update level system
        if (this.levelSystem) {
            this.levelSystem.update(deltaTime);
        }
        
        // Update enemies with player progress info
        if (this.enemySpawner && this.player && this.formulaSystem) {
            // Add score and combo to player object for enemy spawner
            this.player.score = this.formulaSystem.score;
            this.player.combo = this.formulaSystem.combo;
            this.enemySpawner.update(deltaTime, this.player);
        }
        
        // Update currency system (coin drops)
        if (this.currencySystem) {
            this.currencySystem.update(deltaTime);
        }
        
        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.update(deltaTime);
        }
        
        // Update screen effects system
        if (this.screenEffects) {
            this.screenEffects.update(deltaTime);
        }
        
        // Dash system removed for optimization
        // if (this.dashSystem) {
        //     this.dashSystem.update(deltaTime, this.inputHandler);
        // }
        
        // Update floating input system
        if (this.floatingInputSystem) {
            this.floatingInputSystem.update(deltaTime);
        }
        
        // Update momentum system
        if (this.momentumSystem) {
            this.momentumSystem.update(deltaTime);
        }
        
        // Apply cheat effects
        this.applyCheatEffects(deltaTime);
       
       // Handle targeting system (only if not paused)
       if (!this.isPaused) {
           this.handleTargeting();
       }
       
       // Check collisions (only if not in combat mode and not paused)
       // Dash I-frames removed with dash system
       if (!this.combatMode && !this.isPaused) {
           this.handleCollisions();
       }
       
       // Handle SPACE key for formula system
       this.handleFormulaInput();
       
       // Clean up dead targeted enemy
       if (this.targetedEnemy && this.targetedEnemy.shouldBeRemoved()) {
           this.exitCombatMode();
       }
    }

    handleTargeting() {
        if (!this.inputHandler || !this.enemySpawner || this.combatMode || this.isPaused) return;
        
        // Handle mouse clicks for targeting
        if (this.inputHandler.wasMouseJustClicked()) {
            const mousePos = this.inputHandler.getMousePosition();
            const clickedEnemy = this.getEnemyAtPosition(mousePos.x, mousePos.y);
            
            if (clickedEnemy && !clickedEnemy.isDead) {
                this.targetEnemy(clickedEnemy);
            }
        }
        
        // Visual targeting for nearby enemies (backup method)
        const nearbyEnemy = this.getNearestEnemyInRange(this.player.x, this.player.y, 80);
        if (nearbyEnemy && !this.targetedEnemy) {
            // Show target indicator but don't auto-target
            nearbyEnemy.showTargetIndicator = true;
        } else if (!nearbyEnemy) {
            // Clear target indicators
            this.enemySpawner.enemies.forEach(enemy => {
                enemy.showTargetIndicator = false;
            });
        }
    }

    getEnemyAtPosition(x, y) {
        for (const enemy of this.enemySpawner.enemies) {
            if (enemy.isDead) continue;
            
            const dx = x - enemy.x;
            const dy = y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= enemy.width / 2 + 10) { // Small click tolerance
                return enemy;
            }
        }
        return null;
    }

    getNearestEnemyInRange(x, y, range) {
        let nearest = null;
        let nearestDistance = range;
        
        for (const enemy of this.enemySpawner.enemies) {
            if (enemy.isDead) continue;
            
            const dx = x - enemy.x;
            const dy = y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < nearestDistance) {
                nearest = enemy;
                nearestDistance = distance;
            }
        }
        
        return nearest;
    }

    targetEnemy(enemy) {
        this.targetedEnemy = enemy;
        this.combatMode = true;
        this.combatStartTime = Date.now();
        
        // Zeitlupe aktivieren
        this.slowMotion = true;
        
        // Use the enemy's assigned formula
        this.formulaSystem.currentFormula = enemy.assignedFormula;
        this.formulaSystem.currentSolution = enemy.assignedFormula.solutions;
        
        // Show floating input system for night mode
        if (this.floatingInputSystem && this.gameMode === 'night') {
            this.floatingInputSystem.show();
        }
        
        // Show appropriate UI based on game mode
        if (this.gameMode === 'day') {
            this.startMultipleChoiceChallenge();
        } else {
            this.formulaSystem.showFormulaHUD();
        }
    }

    startMultipleChoiceChallenge() {
        if (!this.targetedEnemy || !this.targetedEnemy.assignedFormula) {
            return;
        }
        
        const formula = this.targetedEnemy.assignedFormula;
        
        // Generate formula type choice options for Tag-Modus
        const options = this.generateFormulaTypeOptions(formula.type);
        const correctIndex = this.getCorrectFormulaTypeIndex(formula.type);
        
        // Store correct answer index
        this.mcCorrectIndex = correctIndex;
        this.mcOptions = options;
        this.mcTimeLeft = 15; // 15 seconds for multiple choice
        
        // Update UI
        const mcQuestion = document.getElementById('mcQuestion');
        if (mcQuestion) {
            mcQuestion.innerHTML = `
                <div style="font-size: 18px; margin-bottom: 10px;">Welche Formel-Art ist das?</div>
                <div style="font-size: 24px; color: #00ff00;">${formula.text}</div>
            `;
        }
        
        const answerButtons = document.querySelectorAll('.mc-answer');
        answerButtons.forEach((btn, index) => {
            btn.innerHTML = `${String.fromCharCode(65 + index)}) ${options[index]}`;
            btn.className = 'mc-answer';
            btn.disabled = false;
            
            // Clear any previous cheat styling
            btn.classList.remove('cheat-correct-answer');
            btn.style.background = '';
            btn.style.color = '';
            btn.style.boxShadow = '';
            btn.style.animation = '';
            
            // Show correct answer cheat
            if (this.cheatFeatures && this.cheatFeatures.showCorrectAnswers && index === correctIndex) {
                btn.classList.add('cheat-correct-answer');
                btn.style.cssText += `
                    background: linear-gradient(45deg, #00ff00, #00ffaa) !important;
                    color: #000 !important;
                    box-shadow: 0 0 15px rgba(0, 255, 0, 0.6) !important;
                    animation: cheat-pulse 1s infinite !important;
                `;
            }
        });
        
        this.showMultipleChoice();
        this.startMultipleChoiceTimer();
    }

    generateFormulaTypeOptions(formulaType) {
        // Always show the same 4 options in a fixed order
        return [
            '<div class="formula-type-option"><div class="formula-name">1. Binomische Formel</div><div class="formula-pattern">(a+b)² = a² + 2ab + b²</div></div>',
            '<div class="formula-type-option"><div class="formula-name">2. Binomische Formel</div><div class="formula-pattern">(a-b)² = a² - 2ab + b²</div></div>',
            '<div class="formula-type-option"><div class="formula-name">3. Binomische Formel</div><div class="formula-pattern">(a+b)(a-b) = a² - b²</div></div>',
            '<div class="formula-type-option"><div class="formula-name">Faktorisierung</div><div class="formula-pattern">Umkehrung der Binomischen Formeln</div></div>'
        ];
    }
    
    getCorrectFormulaTypeIndex(formulaType) {
        // Map formula types to the correct index (0-3)
        switch (formulaType) {
            case 'expansion_plus':
                return 0; // 1. Binomische Formel
            case 'expansion_minus':
                return 1; // 2. Binomische Formel
            case 'difference_squares':
                return 2; // 3. Binomische Formel
            case 'factorization_difference':
            case 'factorization_square':
                return 3; // Faktorisierung
            default:
                return 0; // Fallback to 1. Binomische Formel
        }
    }

    startMultipleChoiceTimer() {
        this.mcTimer = setInterval(() => {
            this.mcTimeLeft--;
            const timeElement = document.getElementById('mcTimeLeft');
            if (timeElement) {
                timeElement.textContent = this.mcTimeLeft;
            }
            
            if (this.mcTimeLeft <= 0) {
                this.handleMultipleChoiceTimeout();
            }
        }, 1000);
    }

    selectMultipleChoice(index) {
        if (this.mcTimer) {
            clearInterval(this.mcTimer);
        }
        
        const buttons = document.querySelectorAll('.mc-answer');
        const selectedButton = buttons[index];
        const correctButton = buttons[this.mcCorrectIndex];
        
        if (index === this.mcCorrectIndex) {
            // Correct answer
            selectedButton.classList.add('correct');
            this.handleCorrectMultipleChoice();
        } else {
            // Wrong answer
            selectedButton.classList.add('incorrect');
            correctButton.classList.add('correct');
            this.handleIncorrectMultipleChoice();
        }
        
        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);
        
        // Hide after short delay
        setTimeout(() => {
            this.hideMultipleChoice();
            this.exitCombatMode();
        }, 1500);
    }

    handleCorrectMultipleChoice() {
        if (this.targetedEnemy) {
            // Calculate score (reduced for easier mode)
            const difficultyMultiplier = this.targetedEnemy.assignedFormula.difficulty || 1;
            const comboMultiplier = Math.min(1 + (this.formulaSystem.combo * 0.1), 3);
            const speedBonus = Math.max(1, (15 - (15 - this.mcTimeLeft)) * 0.1);
            const modeMultiplier = 0.7; // Reduced rewards for day mode
            
            const earnedScore = Math.round(50 * difficultyMultiplier * comboMultiplier * speedBonus * modeMultiplier * (this.targetedEnemy.scoreMultiplier || 1));
            
            this.formulaSystem.score += earnedScore;
            this.formulaSystem.correctAnswers++;
            this.formulaSystem.combo++;
            this.formulaSystem.maxCombo = Math.max(this.formulaSystem.maxCombo, this.formulaSystem.combo);
            
            // Calculate and award coins (reduced for day mode)
            let coinsEarned = 0;
            if (this.currencySystem) {
                const timeTaken = (15 - this.mcTimeLeft) * 1000; // Convert to milliseconds
                coinsEarned = this.currencySystem.calculateCoins(
                    this.targetedEnemy, 
                    this.formulaSystem.combo, 
                    timeTaken
                );
                // Apply day mode reduction
                coinsEarned = Math.max(1, Math.round(coinsEarned * 0.7));
                
                this.currencySystem.addCoins(coinsEarned);
                this.currencySystem.showCoinDrop(
                    this.targetedEnemy.x, 
                    this.targetedEnemy.y, 
                    coinsEarned
                );
                console.log(`💰 Day Mode - Coins awarded: ${coinsEarned} for ${this.targetedEnemy.typeName}`);
            }
            
            // Calculate and award XP (reduced for day mode)
            let xpEarned = 0;
            if (this.levelSystem) {
                const timeTaken = (15 - this.mcTimeLeft) * 1000; // Convert to milliseconds
                xpEarned = this.levelSystem.calculateXpDrop(
                    this.targetedEnemy, 
                    this.formulaSystem.combo, 
                    timeTaken
                );
                // Apply day mode reduction
                xpEarned = Math.max(1, Math.round(xpEarned * 0.7));
                
                const leveledUp = this.levelSystem.addXp(xpEarned);
                this.levelSystem.showXpDrop(
                    this.targetedEnemy.x, 
                    this.targetedEnemy.y, 
                    xpEarned
                );
                console.log(`📈 Day Mode - XP awarded: ${xpEarned} for ${this.targetedEnemy.typeName}${leveledUp ? ' - LEVEL UP!' : ''}`);
            }
            
            // Particle effects removed
            
            // Gegner als tot markieren
            this.targetedEnemy.isDead = true;
            this.targetedEnemy.deathTime = Date.now();
            
            // Show feedback with coins and XP
            const coinsText = coinsEarned > 0 ? ` +${coinsEarned} 💰` : '';
            const xpText = xpEarned > 0 ? ` +${xpEarned} XP` : '';
            this.formulaSystem.showFeedback(
                `Richtig! +${earnedScore} Punkte${coinsText}${xpText} (Tag-Modus: ${this.targetedEnemy.typeName || this.targetedEnemy.type})`,
                true
            );
            
            this.formulaSystem.updateScoreDisplay();
            this.formulaSystem.generateFormula();
            this.formulaSystem.startComboTimer();
        }
    }

    handleIncorrectMultipleChoice() {
        this.formulaSystem.incorrectAnswers++;
        this.formulaSystem.combo = 0;
        
        if (!this.cheatMode) {
            this.dealDamageToPlayer(1); // Only 1 HP damage for day mode
        }
        
        this.formulaSystem.showFeedback('Falsch! Versuche es beim nächsten Gegner noch einmal.', false);
        this.formulaSystem.updateScoreDisplay();
        this.formulaSystem.generateFormula();
    }

    handleMultipleChoiceTimeout() {
        clearInterval(this.mcTimer);
        this.handleIncorrectMultipleChoice();
        
        setTimeout(() => {
            this.hideMultipleChoice();
            this.exitCombatMode();
        }, 1500);
    }

    exitCombatMode() {
        this.targetedEnemy = null;
        this.combatMode = false;
        this.slowMotion = false; // Zeitlupe beenden
        this.formulaSystem.hideFormulaHUD();
        this.hideMultipleChoice();
        
        // Hide floating input system
        if (this.floatingInputSystem) {
            this.floatingInputSystem.hide();
        }
        
        if (this.mcTimer) {
            clearInterval(this.mcTimer);
            this.mcTimer = null;
        }
        
        // Clear target indicators
        this.enemySpawner.enemies.forEach(enemy => {
            enemy.showTargetIndicator = false;
        });
    }

    handleCorrectAnswer() {
        const currentTime = Date.now();
        const timeTaken = this.combatMode ? currentTime - this.combatStartTime : 5000;
        
        // Check if this is a boss fight
        if (this.targetedEnemy && this.targetedEnemy instanceof Boss) {
            // Handle boss formula correct
            const bossHandled = this.formulaSystem.onBossFormulaCorrect();
            if (bossHandled) {
                // Boss system handled the logic, exit combat mode
                this.exitCombatMode();
                return;
            }
        }
        
        if (this.targetedEnemy) {
            // Calculate base score
            let earnedScore = this.formulaSystem.calculateScore(
                this.targetedEnemy.assignedFormula, 
                timeTaken, 
                true
            );
            
            // Apply momentum damage multiplier
            const momentumMultiplier = this.momentumSystem ? this.momentumSystem.getDamageMultiplier() : 1.0;
            earnedScore = Math.round(earnedScore * momentumMultiplier);
            
            // Apply enemy type multiplier
            earnedScore = Math.round(earnedScore * this.targetedEnemy.scoreMultiplier);
            
            // Update stats
            this.formulaSystem.correctAnswers++;
            this.formulaSystem.score += earnedScore;
            this.formulaSystem.incrementCombo();
            
            // Calculate and award coins
            let coinsEarned = 0;
            if (this.currencySystem) {
                coinsEarned = this.currencySystem.calculateCoins(
                    this.targetedEnemy, 
                    this.formulaSystem.combo, 
                    timeTaken
                );
                this.currencySystem.addCoins(coinsEarned);
                this.currencySystem.showCoinDrop(
                    this.targetedEnemy.x, 
                    this.targetedEnemy.y, 
                    coinsEarned
                );
                console.log(`💰 Coins awarded: ${coinsEarned} for ${this.targetedEnemy.typeName}`);
            }
            
            // Calculate and award XP
            let xpEarned = 0;
            if (this.levelSystem) {
                xpEarned = this.levelSystem.calculateXpDrop(
                    this.targetedEnemy, 
                    this.formulaSystem.combo, 
                    timeTaken
                );
                const leveledUp = this.levelSystem.addXp(xpEarned);
                this.levelSystem.showXpDrop(
                    this.targetedEnemy.x, 
                    this.targetedEnemy.y, 
                    xpEarned
                );
                console.log(`📈 XP awarded: ${xpEarned} for ${this.targetedEnemy.typeName}${leveledUp ? ' - LEVEL UP!' : ''}`);
            }
            
            // Particle effects removed
            
            // Kill the enemy
            this.targetedEnemy.startDeathAnimation();
            
            // Trigger screen effects for enemy death
            if (this.screenEffects) {
                this.screenEffects.onEnemyDeath();
                // Add combo effects for high combos
                if (this.formulaSystem.combo >= 3) {
                    this.screenEffects.onComboIncrease(this.formulaSystem.combo);
                }
            }
            
            // Trigger audio effects for correct answer and enemy death
            if (this.audioManager) {
                this.audioManager.onCorrectAnswer(this.formulaSystem.combo);
                this.audioManager.onEnemyDeath({ x: this.targetedEnemy.x, y: this.targetedEnemy.y });
                if (this.formulaSystem.combo >= 3) {
                    this.audioManager.onComboIncrease(this.formulaSystem.combo);
                }
            }
            
            // Show detailed feedback with enemy type, coins and XP
            const speedText = timeTaken < 5000 ? ' (Schnell!)' : '';
            const comboText = this.formulaSystem.combo >= 3 ? ` Combo x${this.formulaSystem.combo}!` : '';
            const typeText = this.targetedEnemy.scoreMultiplier > 1 ? ` [${this.targetedEnemy.typeName}]` : '';
            const coinsText = coinsEarned > 0 ? ` +${coinsEarned} 💰` : '';
            const xpText = xpEarned > 0 ? ` +${xpEarned} XP` : '';
            this.formulaSystem.showFeedback(`Treffer! +${earnedScore} Punkte${coinsText}${xpText}${typeText}${speedText}${comboText}`, true);
            
            console.log(`${this.targetedEnemy.typeName} eliminated! Score: ${earnedScore} (Base: ${Math.round(earnedScore/this.targetedEnemy.scoreMultiplier)}, Multiplier: ${this.targetedEnemy.scoreMultiplier}x, Difficulty: ${this.targetedEnemy.assignedFormula.difficulty.toFixed(1)}, Time: ${timeTaken}ms, Combo: ${this.formulaSystem.combo})`);
        } else {
            // Regular formula practice
            const earnedScore = this.formulaSystem.calculateScore(
                this.formulaSystem.currentFormula, 
                timeTaken, 
                false
            );
            
            this.formulaSystem.correctAnswers++;
            this.formulaSystem.score += earnedScore;
            this.formulaSystem.incrementCombo();
            this.formulaSystem.showFeedback(`Richtig! +${earnedScore} Punkte`, true);
            
            // Trigger screen effects for correct answer
            if (this.screenEffects) {
                this.screenEffects.onCorrectAnswer();
            }
            
            // Trigger audio effects for correct answer
            if (this.audioManager) {
                this.audioManager.onCorrectAnswer(this.formulaSystem.combo);
            }
        }
        
        // Particle effects removed
        
        this.formulaSystem.updateScoreDisplay();
        this.exitCombatMode();
        
        // Generate new formula after delay
        setTimeout(() => {
            this.formulaSystem.generateFormula();
        }, 500);
    }

    handleWrongAnswer() {
        // Break combo on wrong answer
        this.formulaSystem.breakCombo('Falsche Antwort!');
        
        if (this.targetedEnemy) {
            // Player takes damage in combat
            this.formulaSystem.incorrectAnswers++;
            this.formulaSystem.score = Math.max(0, this.formulaSystem.score - 50);
            this.dealDamageToPlayer(1); // Only 1 HP damage for wrong answers
            this.formulaSystem.showFeedback(`Falsch! Du nimmst Schaden! Richtig: ${this.formulaSystem.currentSolution[0]}`, false);
            
            // Trigger screen effects for wrong answer
            if (this.screenEffects) {
                this.screenEffects.onWrongAnswer();
            }
            
            // Trigger audio effects for wrong answer
            if (this.audioManager) {
                this.audioManager.onWrongAnswer();
                this.audioManager.onComboBreak();
            }
        } else {
            // Regular formula practice
            this.formulaSystem.incorrectAnswers++;
            this.formulaSystem.score = Math.max(0, this.formulaSystem.score - 25);
            this.formulaSystem.showFeedback(`Falsch! Richtig wäre: ${this.formulaSystem.currentSolution[0]}`, false);
        }
        
        this.formulaSystem.updateScoreDisplay();
        this.exitCombatMode();
        
        // Generate new formula after delay
        setTimeout(() => {
            this.formulaSystem.generateFormula();
        }, 2000);
    }

    dealDamageToPlayer(damage) {
        if (this.cheatMode) return; // No damage in cheat mode
        
        // Damage particle effects removed
        
        const currentTime = Date.now();
        if (currentTime - this.lastDamageTime < this.damageImmuneTime) {
            return; // Player is immune
        }
        
        this.playerHealth -= damage;
        this.playerHealth = Math.max(0, this.playerHealth);
        this.lastDamageTime = currentTime;
        
        // Trigger screen effects for low health
        if (this.screenEffects) {
            const healthPercent = this.playerHealth / this.playerMaxHealth;
            this.screenEffects.onLowHealth(healthPercent);
        }
        
        // Trigger audio effects for damage and low health
        if (this.audioManager) {
            this.audioManager.onPlayerDamage();
            const healthPercent = this.playerHealth / this.playerMaxHealth;
            this.audioManager.onLowHealth(healthPercent);
        }
        
        console.log(`Player took ${damage} damage. Health: ${this.playerHealth}/${this.playerMaxHealth}`);
        
        if (this.playerHealth <= 0) {
            this.triggerGameOver();
        }
    }

    triggerGameOver() {
        this.isGameOver = true;
        this.exitCombatMode();
        console.log('Game Over! Player died.');
    }

    handleGameOver() {
        // Save stats before showing game over
        this.saveGameStats();
        
        // Show game over for 3 seconds, then return to menu
        setTimeout(() => {
            this.showMainMenu();
        }, 3000);
    }

    restartGame() {
        this.saveGameStats();
        this.resetGame();
        console.log('Game restarted!');
    }

    handleCollisions() {
        if (!this.player || !this.enemySpawner) return;
        
        const collidingEnemy = this.enemySpawner.checkCollisions(this.player);
        if (collidingEnemy) {
            // Deal damage to player
            this.dealDamageToPlayer(1); // Only 1 HP damage from collisions
            
            // Enemy takes minor damage from collision
            collidingEnemy.takeDamage(5);
            
            console.log(`Collision! Enemy health: ${collidingEnemy.health}`);
        }
        
        // Check coin pickup collisions
        if (this.currencySystem && this.player) {
            this.currencySystem.checkCoinPickup(this.player);
        }
    }

    handleFormulaInput() {
        if (this.isPaused) return; // Disable formula input when paused
        
        const spaceCurrentlyPressed = this.inputHandler.isSpacePressed();
        
        // Detect space key press (not held)
        if (spaceCurrentlyPressed && !this.spacePressed) {
            this.formulaSystem.toggleFormulaHUD();
        }
        
        this.spacePressed = spaceCurrentlyPressed;
    }

    togglePauseMenu() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.showPauseMenu();
        } else {
            this.hidePauseMenu();
        }
    }

    showShopAfterLevelUp() {
        // IMPORTANT: Actually pause the game
        this.isPaused = true;
        
        // Exit combat mode safely
        if (this.combatMode) {
            this.exitCombatMode();
        }
        
        // Hide formula HUD to prevent cheating
        this.formulaSystem.hideFormulaHUD();
        
        // Show shop after level-up
        if (this.shopSystem) {
            this.shopSystem.openShop();
        }
        
        console.log('Game paused - Shop opened after level-up');
    }

    showPauseMenu() {
        // Old pause menu - now only used as fallback
        this.isPaused = true;
        
        if (this.combatMode) {
            this.exitCombatMode();
        }
        
        this.formulaSystem.hideFormulaHUD();
        this.updatePauseStats();
        this.pauseMenu.style.display = 'block';
        
        console.log('Game paused - Old pause menu shown');
    }

    hidePauseMenu() {
        // IMPORTANT: Actually unpause the game
        this.isPaused = false;
        
        // Hide shop if it's open
        if (this.shopSystem) {
            this.shopSystem.closeShop();
        }
        
        // Hide old pause menu as fallback
        this.pauseMenu.style.display = 'none';
        console.log('Game resumed - ALL systems restarted');
    }

    updatePauseStats() {
        const total = this.formulaSystem.correctAnswers + this.formulaSystem.incorrectAnswers;
        const accuracy = total > 0 ? Math.round((this.formulaSystem.correctAnswers / total) * 100) : 100;
        
        this.pauseStats.score.textContent = this.formulaSystem.score;
        this.pauseStats.correct.textContent = this.formulaSystem.correctAnswers;
        this.pauseStats.incorrect.textContent = this.formulaSystem.incorrectAnswers;
        this.pauseStats.accuracy.textContent = accuracy + '%';
        this.pauseStats.health.textContent = `${this.playerHealth}/${this.playerMaxHealth}`;
    }

    resumeGame() {
        this.isPaused = false;
        this.hidePauseMenu();
        
        // Start next wave if resuming from wave break
        if (this.waveSystem && !this.waveSystem.isActive()) {
            console.log('🌊 Starting next wave after shop break...');
            setTimeout(() => {
                this.waveSystem.startWave();
            }, 1000);
        }
    }

    render() {
        // Apply screen effects (shake, pulse, etc.)
        if (this.screenEffects) {
            this.screenEffects.applyEffects();
        }
        
        // Render enemies first (behind player)
        if (this.enemySpawner) {
            this.enemySpawner.render(this.ctx);
        }
        
        // Render player
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Render player health bar
        this.renderPlayerHealthBar();
        
        // Render currency system effects (includes coin drops)
        if (this.currencySystem) {
            this.currencySystem.render(this.ctx);
        }
        
        // Render level system effects
        if (this.levelSystem) {
            this.levelSystem.render(this.ctx);
        }
        
        // Render particle system (after game objects, before UI)
        if (this.particleSystem) {
            this.particleSystem.render();
        }
        
        // Dash system rendering removed for optimization
        // if (this.dashSystem) {
        //     this.dashSystem.render(this.ctx);
        // }
        
        // Render momentum system effects
        if (this.momentumSystem) {
            this.momentumSystem.render(this.ctx);
        }
        
        // Render game over screen
        if (this.isGameOver) {
            this.renderGameOverScreen();
        }
        
        // Render combat mode indicator
        if (this.combatMode && this.targetedEnemy && !this.isPaused) {
            this.renderCombatModeIndicator();
        }
        
        // Render pause indicator on canvas
        if (this.isPaused && !this.isGameOver) {
            this.renderPauseIndicator();
        }
        
        // Restore screen effects and render flash overlays
        if (this.screenEffects) {
            this.screenEffects.restoreEffects();
        }
    }

    renderPlayerHealthBar() {
        // Always show health bar
        if (!this.player) return;
        
        // Position health bar above player - LARGER SIZE for better visibility
        const barWidth = 120;
        const barHeight = 18;
        const barX = this.player.x - barWidth / 2;
        const barY = this.player.y - this.player.height / 2 - 25;
        
        this.ctx.save();
        
        // Background with rounded corners (manual implementation)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.drawRoundedRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 8);
        this.ctx.fill();
        
        // Health bar background
        this.ctx.fillStyle = '#333333';
        this.drawRoundedRect(barX, barY, barWidth, barHeight, 6);
        this.ctx.fill();
        
        // Health bar fill
        const healthPercent = this.playerHealth / this.playerMaxHealth;
        const healthColor = healthPercent > 0.6 ? '#00ff00' : healthPercent > 0.3 ? '#ffaa00' : '#ff3300';
        
        if (healthPercent > 0) {
            this.ctx.fillStyle = healthColor;
            this.drawRoundedRect(barX, barY, barWidth * healthPercent, barHeight, 6);
            this.ctx.fill();
        }
        
        // Glow effect
        this.ctx.shadowColor = healthColor;
        this.ctx.shadowBlur = 8;
        this.ctx.strokeStyle = healthColor;
        this.ctx.lineWidth = 1;
        this.drawRoundedRect(barX, barY, barWidth, barHeight, 6);
        this.ctx.stroke();
        
        // Health text (e.g., "3/5") - LARGER and more visible
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 14px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText(`${this.playerHealth}/${this.playerMaxHealth}`, 
                           barX + barWidth / 2, barY + barHeight / 2);
        this.ctx.fillText(`${this.playerHealth}/${this.playerMaxHealth}`, 
                          barX + barWidth / 2, barY + barHeight / 2);
        
        this.ctx.restore();
    }

    renderGameOverScreen() {
        // Dark overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Game Over text
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '48px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#ff000080';
        this.ctx.shadowBlur = 20;
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        // Restart info
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Courier New';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText('Automatischer Neustart in 3 Sekunden...', this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        // Final score
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '24px Courier New';
        this.ctx.fillText(`Endpunktzahl: ${this.formulaSystem.score}`, this.canvas.width / 2, this.canvas.height / 2 + 60);
    }

    renderCombatModeIndicator() {
        if (!this.targetedEnemy) return;
        
        // Combat mode banner
        const bannerHeight = 40;
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, bannerHeight);
        
        // Border
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, bannerHeight);
        
        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#000000';
        this.ctx.shadowBlur = 5;
        this.ctx.fillText(`KAMPFMODUS - Löse: ${this.targetedEnemy.assignedFormula.text}`, this.canvas.width / 2, 25);
        
        // Target line to enemy
        this.ctx.strokeStyle = '#ff000080';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x, this.player.y);
        this.ctx.lineTo(this.targetedEnemy.x, this.targetedEnemy.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset line dash
    }

    renderPauseIndicator() {
        // Dim the game background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Pause indicator in corner
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = '20px Courier New';
        this.ctx.textAlign = 'right';
        this.ctx.shadowColor = '#ffff0080';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText('⏸ PAUSIERT', this.canvas.width - 20, 40);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Old generateGrassPatches method removed - now handled by ArenaSystem
    
    // Old renderBackground method removed - now handled by ArenaSystem

    // Old renderMapBoundaries method removed - now handled by ArenaSystem
    
    renderMenuBackground() {
        // Simple desert sand background for menu
        this.ctx.fillStyle = '#C2B280';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add some texture
        this.ctx.save();
        this.ctx.globalAlpha = 0.1;
        for (let i = 0; i < 50; i++) {
            this.ctx.fillStyle = Math.random() < 0.5 ? '#8B7355' : '#A0916B';
            this.ctx.fillRect(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                2 + Math.random() * 3,
                2 + Math.random() * 3
            );
        }
        this.ctx.restore();
        
        // Simple borders
        const borderWidth = 10;
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 0, this.canvas.width, borderWidth);
        this.ctx.fillRect(0, this.canvas.height - borderWidth, this.canvas.width, borderWidth);
        this.ctx.fillRect(0, 0, borderWidth, this.canvas.height);
        this.ctx.fillRect(this.canvas.width - borderWidth, 0, borderWidth, this.canvas.height);
    }

    drawRoundedRect(x, y, width, height, radius) {
        // Helper function to draw rounded rectangles
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    renderDebugInfo() {
        if (!this.fpsCounter) return;
        
        let debugText = `FPS: ${this.fps}`;
        
        // Add particle system stats
        if (this.particleSystem) {
            const stats = this.particleSystem.getStats();
            debugText += ` | Particles: ${stats.activeParticles}/${this.particleSystem.maxParticles} (${stats.poolUtilization})`;
        }
        
        this.fpsCounter.textContent = debugText;
    }

    showMessage(text, duration = 3000) {
        // Create or update message display
        let messageDisplay = document.getElementById('gameMessage');
        if (!messageDisplay) {
            messageDisplay = document.createElement('div');
            messageDisplay.id = 'gameMessage';
            messageDisplay.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: #ffffff;
                font-family: 'Courier New', monospace;
                font-size: 24px;
                font-weight: bold;
                padding: 20px 40px;
                border-radius: 15px;
                border: 3px solid #ffff00;
                text-align: center;
                z-index: 2000;
                box-shadow: 0 0 30px rgba(255, 255, 0, 0.5);
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
                animation: messagePopIn 0.5s ease-out;
            `;
            document.body.appendChild(messageDisplay);
            
            // Add CSS animation if not already added
            if (!document.getElementById('messageAnimationStyle')) {
                const style = document.createElement('style');
                style.id = 'messageAnimationStyle';
                style.textContent = `
                    @keyframes messagePopIn {
                        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        messageDisplay.textContent = text;
        messageDisplay.style.display = 'block';
        
        // Auto-hide after duration
        setTimeout(() => {
            if (messageDisplay) {
                messageDisplay.style.display = 'none';
            }
        }, duration);
    }
}
