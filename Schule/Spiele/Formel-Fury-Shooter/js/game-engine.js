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
        // Cheat code: Ctrl + Shift + Y (simple 3-key combination)
        this.cheatKeys = {
            ctrl: false,
            shift: false,
            y: false
        };
        
        console.log('🔧 Cheat code system initialized. Use Ctrl+Shift+Y to toggle.');

        document.addEventListener('keydown', (e) => {
            // Track key states
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.cheatKeys.ctrl = true;
                console.log('🔧 Ctrl pressed');
            }
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.cheatKeys.shift = true;
                console.log('🔧 Shift pressed');
            }
            if (e.code === 'KeyY') {
                this.cheatKeys.y = true;
                console.log('🔧 Y pressed');
            }

            // Check if all keys are pressed
            if (this.cheatKeys.ctrl && this.cheatKeys.shift && this.cheatKeys.y) {
                // Prevent event bubbling
                e.preventDefault();
                e.stopPropagation();
                
                this.toggleCheatMode();
                
                // Reset keys to prevent rapid toggling
                this.cheatKeys = { ctrl: false, shift: false, y: false };
                
                console.log('🔧 Cheat code detected: Ctrl+Shift+Y');
            }
        });

        document.addEventListener('keyup', (e) => {
            // Reset key states on release
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.cheatKeys.ctrl = false;
            }
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.cheatKeys.shift = false;
            }
            if (e.code === 'KeyY') {
                this.cheatKeys.y = false;
            }
        });
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
        // IMPORTANT: Clear all enemies immediately when wave ends
        if (this.enemySpawner) {
            this.enemySpawner.enemies = [];
            console.log('🧹 All enemies cleared at wave end');
        }
        
        // Exit combat mode to prevent issues
        this.exitCombatMode();
        
        // Show wave complete animation
        if (this.waveSystem.waveDisplay) {
            this.waveSystem.waveDisplay.classList.add('wave-complete');
            setTimeout(() => {
                this.waveSystem.waveDisplay.classList.remove('wave-complete');
            }, 1000);
        }
        
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
            this.showPauseMenu();
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

        // Escape key for pause
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePauseMenu();
            }
        });

        // Focus canvas for keyboard input
        this.canvas.focus();
        this.canvas.setAttribute('tabindex', '0');
    }

    showMainMenu() {
        this.gameState = 'menu';
        this.isRunning = false;
        document.getElementById('mainMenu').classList.remove('hidden');
        this.hideGameModeSelection();
        this.hideGameHUD();
        this.hideMultipleChoice();
        this.initializeMenuStats();
    }

    hideMainMenu() {
        document.getElementById('mainMenu').classList.add('hidden');
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

        // Render background
        this.renderBackground();

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
            
            // Update FPS display
            this.fpsCounter.textContent = `FPS: ${this.fps}`;
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
        
        // Update enemies with player progress info
        if (this.enemySpawner && this.player && this.formulaSystem) {
            this.enemySpawner.update(
                deltaTime, 
                this.player.x, 
                this.player.y, 
                this.canvas.width, 
                this.canvas.height,
                this.formulaSystem.score,
                this.formulaSystem.combo
            );
        }
        
        // Update currency system
        if (this.currencySystem) {
            this.currencySystem.update(deltaTime);
        }
        
        // Update wave system
        if (this.waveSystem) {
            this.waveSystem.update(deltaTime);
        }
        
        // Update level system
        if (this.levelSystem) {
            this.levelSystem.update(deltaTime);
        }
       
       // Handle targeting system (only if not paused)
       if (!this.isPaused) {
           this.handleTargeting();
       }
       
       // Check collisions (only if not in combat mode and not paused)
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
        const correctAnswer = formula.solutions[0]; // Use first solution
        
        // Generate multiple choice options
        const options = this.generateMultipleChoiceOptions(correctAnswer, formula.type);
        const correctIndex = Math.floor(Math.random() * 4);
        
        // Shuffle options
        const shuffledOptions = new Array(4);
        shuffledOptions[correctIndex] = correctAnswer;
        
        // Fill remaining slots with wrong answers
        let optionIndex = 0;
        for (let i = 0; i < 4; i++) {
            if (i !== correctIndex) {
                shuffledOptions[i] = options[optionIndex] || `Falsche Antwort ${i}`;
                optionIndex++;
            }
        }
        
        // Store correct answer index
        this.mcCorrectIndex = correctIndex;
        this.mcOptions = shuffledOptions;
        this.mcTimeLeft = 15; // 15 seconds for multiple choice
        
        // Update UI
        const mcQuestion = document.getElementById('mcQuestion');
        if (mcQuestion) {
            mcQuestion.textContent = formula.text;
        }
        
        const answerButtons = document.querySelectorAll('.mc-answer');
        answerButtons.forEach((btn, index) => {
            btn.textContent = `${String.fromCharCode(65 + index)}) ${shuffledOptions[index]}`;
            btn.className = 'mc-answer';
            btn.disabled = false;
        });
        
        this.showMultipleChoice();
        this.startMultipleChoiceTimer();
    }

    generateMultipleChoiceOptions(correctAnswer, formulaType) {
        const wrongAnswers = [];
        
        // Generate plausible wrong answers based on formula type
        if (formulaType === 'binomial1' || formulaType === 'binomial2' || formulaType === 'binomial3') {
            // For expanded forms, create variations
            const variations = [
                correctAnswer.replace(/\+/g, '-'),
                correctAnswer.replace(/-/g, '+'),
                correctAnswer.replace(/2([a-z])/g, '$1'),
                correctAnswer.replace(/([a-z])²/g, '$1')
            ];
            wrongAnswers.push(...variations.filter(ans => ans !== correctAnswer && ans.length > 0).slice(0, 3));
        } else {
            // For factorizations, create variations
            const variations = [
                correctAnswer.replace(/\+/g, '-'),
                correctAnswer.replace(/-/g, '+'),
                correctAnswer.replace(/\(/g, '[').replace(/\)/g, ']'),
                correctAnswer.includes(')(') ? '(' + correctAnswer.slice(1, -1).split(')(').reverse().join(')(') + ')' : correctAnswer
            ];
            wrongAnswers.push(...variations.filter(ans => ans !== correctAnswer && ans.length > 0).slice(0, 3));
        }
        
        // Fill up to 3 wrong answers if needed
        while (wrongAnswers.length < 3) {
            wrongAnswers.push(`Falsche Option ${wrongAnswers.length + 1}`);
        }
        
        return wrongAnswers.slice(0, 3);
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
        
        if (this.targetedEnemy) {
            // Calculate base score
            let earnedScore = this.formulaSystem.calculateScore(
                this.targetedEnemy.assignedFormula, 
                timeTaken, 
                true
            );
            
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
            
            // Kill the enemy
            this.targetedEnemy.startDeathAnimation();
            
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
        }
        
        this.formulaSystem.updateScoreDisplay();
        this.exitCombatMode();
        
        // Generate new formula after delay
        setTimeout(() => {
            this.formulaSystem.generateFormula();
        }, 1500);
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
        
        const currentTime = Date.now();
        if (currentTime - this.lastDamageTime < this.damageImmuneTime) {
            return; // Player is immune
        }
        
        this.playerHealth -= damage;
        this.playerHealth = Math.max(0, this.playerHealth);
        this.lastDamageTime = currentTime;
        
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

    showPauseMenu() {
        // IMPORTANT: Actually pause the game
        this.isPaused = true;
        
        // Exit combat mode safely
        if (this.combatMode) {
            this.exitCombatMode();
        }
        
        // Hide formula HUD to prevent cheating
        this.formulaSystem.hideFormulaHUD();
        
        // Update pause menu stats
        this.updatePauseStats();
        
        // Show pause menu
        this.pauseMenu.style.display = 'block';
        
        console.log('Game paused - ALL systems stopped');
    }

    hidePauseMenu() {
        // IMPORTANT: Actually unpause the game
        this.isPaused = false;
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
        
        // Render currency system effects
        if (this.currencySystem) {
            this.currencySystem.render(this.ctx);
        }
        
        // Render level system effects
        if (this.levelSystem) {
            this.levelSystem.render(this.ctx);
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

    renderBackground() {
        // Create a subtle grid pattern for the dungeon feel
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Add some neon-style corner highlights
        this.ctx.fillStyle = '#00ff0020';
        this.ctx.fillRect(0, 0, 100, 100);
        this.ctx.fillRect(this.canvas.width - 100, 0, 100, 100);
        this.ctx.fillRect(0, this.canvas.height - 100, 100, 100);
        this.ctx.fillRect(this.canvas.width - 100, this.canvas.height - 100, 100, 100);
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
        // Debug info removed for cleaner UI
        // Can be re-enabled for development if needed
    }
}
