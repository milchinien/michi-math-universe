/**
 * FORMEL-FURY-SHOOTER - WAVE SYSTEM
 * Handles wave-based gameplay with timed rounds and shop breaks
 * Phase 4.4: Wave System Implementation
 */

class WaveSystem {
    constructor() {
        // Wave configuration
        this.currentWave = 0;
        this.isWaveActive = false;
        this.waveStartTime = 0;
        this.waveDuration = 20000; // 20 seconds per wave
        this.waveTimeLeft = 0;
        
        // Wave progression
        this.enemiesPerWave = 5; // Base enemies per wave
        this.enemySpawnRate = 2000; // Base spawn rate in ms
        this.waveBonus = 1.0; // Score/coin multiplier for current wave
        
        // UI Elements
        this.waveDisplay = null;
        this.waveTimerElement = null;
        this.waveCounterElement = null;
        this.waveStatusElement = null;
        
        // Callbacks
        this.onWaveComplete = null;
        this.onWaveStart = null;
        
        this.init();
    }
    
    init() {
        this.setupUI();
        console.log('🌊 WaveSystem initialized');
    }
    
    setupUI() {
        console.log('🔧 WaveSystem: Setting up UI...');
        
        // Create wave display if it doesn't exist
        this.waveDisplay = document.getElementById('waveDisplay');
        if (!this.waveDisplay) {
            this.waveDisplay = document.createElement('div');
            this.waveDisplay.id = 'waveDisplay';
            this.waveDisplay.innerHTML = `
                <div class="wave-header">WELLE <span id="waveCounter">0</span></div>
                <div class="wave-timer">⏱ <span id="waveTimeLeft">20</span>s</div>
                <div class="wave-status" id="waveStatus">Bereit zum Start</div>
            `;
            
            // Add CSS styles dynamically
            this.waveDisplay.style.position = 'absolute';
            this.waveDisplay.style.top = '10px';
            this.waveDisplay.style.right = '200px';
            this.waveDisplay.style.color = '#00ffff';
            this.waveDisplay.style.fontSize = '16px';
            this.waveDisplay.style.fontWeight = 'bold';
            this.waveDisplay.style.fontFamily = '"Courier New", monospace';
            this.waveDisplay.style.textAlign = 'center';
            this.waveDisplay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            this.waveDisplay.style.zIndex = '100';
            this.waveDisplay.style.padding = '10px';
            this.waveDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.waveDisplay.style.border = '2px solid #00ffff';
            this.waveDisplay.style.borderRadius = '8px';
            
            document.body.appendChild(this.waveDisplay);
            console.log('✅ WaveDisplay created and added to DOM');
        }
        
        this.waveCounterElement = document.getElementById('waveCounter');
        this.waveTimerElement = document.getElementById('waveTimeLeft');
        this.waveStatusElement = document.getElementById('waveStatus');
        
        console.log('✅ WaveSystem UI setup complete');
    }
    
    startWave() {
        this.currentWave++;
        this.isWaveActive = true;
        this.waveStartTime = Date.now();
        this.waveTimeLeft = this.waveDuration;
        
        // Calculate wave progression
        this.calculateWaveProgression();
        
        this.updateDisplay();
        
        console.log(`🌊 Wave ${this.currentWave} started! Duration: ${this.waveDuration}ms`);
        
        // Call callback if set
        if (this.onWaveStart) {
            this.onWaveStart(this.currentWave, this.getWaveData());
        }
        
        // Trigger arena deterioration
        if (window.gameEngine && window.gameEngine.arenaSystem) {
            window.gameEngine.arenaSystem.onWaveStart(this.currentWave);
        }
        
        return this.getWaveData();
    }
    
    calculateWaveProgression() {
        // Increase difficulty over time
        const baseEnemies = 3;
        const baseSpawnRate = 3000;
        const baseBonusMultiplier = 1.0;
        
        // Progressive scaling - more aggressive difficulty increase
        this.enemiesPerWave = Math.floor(baseEnemies + (this.currentWave - 1) * 2);
        this.enemySpawnRate = Math.max(800, baseSpawnRate - (this.currentWave - 1) * 200);
        this.waveBonus = baseBonusMultiplier + (this.currentWave - 1) * 0.15;
        
        // Update global game difficulty for formula system
        if (window.game && window.game.formulaSystem) {
            window.game.formulaSystem.currentWave = this.currentWave;
        }
        
        console.log(`📈 Wave ${this.currentWave} progression:`, {
            enemies: this.enemiesPerWave,
            spawnRate: this.enemySpawnRate,
            bonus: this.waveBonus.toFixed(1)
        });
    }
    
    update(deltaTime) {
        if (!this.isWaveActive) return;
        
        // Update wave timer
        this.waveTimeLeft = Math.max(0, this.waveDuration - (Date.now() - this.waveStartTime));
        
        // Debug logging for wave timer
        if (this.waveTimeLeft > 0 && this.waveTimeLeft % 5000 < 100) { // Log every 5 seconds
            console.log(`🌊 Wave ${this.currentWave} - Time left: ${Math.ceil(this.waveTimeLeft / 1000)}s`);
        }
        
        // Check if wave is complete
        if (this.waveTimeLeft <= 0) {
            console.log(`🏁 Wave ${this.currentWave} timer expired, completing wave...`);
            this.completeWave();
        }
        
        this.updateDisplay();
    }
    
    completeWave() {
        if (!this.isWaveActive) {
            console.log(`⚠️ Wave ${this.currentWave} already completed, skipping...`);
            return;
        }
        
        console.log(`🏁 Wave ${this.currentWave} completing...`);
        this.isWaveActive = false;
        this.waveTimeLeft = 0;
        
        // Update status
        if (this.waveStatusElement) {
            this.waveStatusElement.textContent = 'Welle beendet!';
            this.waveStatusElement.style.color = '#00ff00';
        }
        
        // Call callback if set
        if (this.onWaveComplete) {
            console.log(`📞 Calling wave complete callback for wave ${this.currentWave}`);
            this.onWaveComplete(this.currentWave, this.getWaveStats());
        } else {
            console.log(`⚠️ No wave complete callback set!`);
        }
        
        this.updateDisplay();
        console.log(`✅ Wave ${this.currentWave} completion process finished`);
    }
    
    updateDisplay() {
        // Update HTML elements
        const waveNumberElement = document.getElementById('waveNumber');
        const waveTimerElement = document.getElementById('waveTimer');
        
        if (waveNumberElement) {
            waveNumberElement.textContent = `Welle ${this.currentWave}`;
        }
        
        if (waveTimerElement) {
            const secondsLeft = Math.ceil(this.waveTimeLeft / 1000);
            waveTimerElement.textContent = secondsLeft;
        }
        
        // Legacy support
        if (this.waveCounterElement) {
            this.waveCounterElement.textContent = this.currentWave;
        }
        
        if (this.waveTimerElement) {
            const secondsLeft = Math.ceil(this.waveTimeLeft / 1000);
            this.waveTimerElement.textContent = secondsLeft;
        }
        
        if (this.waveStatusElement) {
            if (this.isWaveActive) {
                this.waveStatusElement.textContent = 'Aktive Welle';
                this.waveStatusElement.style.color = '#00ffff';
            } else if (this.currentWave === 0) {
                this.waveStatusElement.textContent = 'Bereit zum Start';
                this.waveStatusElement.style.color = '#ffff00';
            } else {
                this.waveStatusElement.textContent = 'Pause';
                this.waveStatusElement.style.color = '#00ff00';
            }
        }
    }
    
    getWaveData() {
        return {
            wave: this.currentWave,
            enemiesPerWave: this.enemiesPerWave,
            spawnRate: this.enemySpawnRate,
            bonusMultiplier: this.waveBonus,
            duration: this.waveDuration,
            timeLeft: this.waveTimeLeft,
            isActive: this.isWaveActive
        };
    }
    
    getWaveStats() {
        return {
            wave: this.currentWave,
            duration: this.waveDuration,
            completed: true,
            bonusMultiplier: this.waveBonus
        };
    }
    
    // Getter methods
    getCurrentWave() {
        return this.currentWave;
    }
    
    isActive() {
        return this.isWaveActive;
    }
    
    getTimeLeft() {
        return this.waveTimeLeft;
    }
    
    getWaveBonus() {
        return this.waveBonus;
    }
    
    // Callback setters
    setOnWaveComplete(callback) {
        this.onWaveComplete = callback;
    }
    
    setOnWaveStart(callback) {
        this.onWaveStart = callback;
    }
    
    // Debug functions
    forceCompleteWave() {
        if (this.isWaveActive) {
            this.waveTimeLeft = 0;
            this.completeWave();
        }
    }
    
    resetWaves() {
        this.currentWave = 0;
        this.isWaveActive = false;
        this.waveTimeLeft = 0;
        this.updateDisplay();
        console.log('🔄 Wave system reset');
    }
}
