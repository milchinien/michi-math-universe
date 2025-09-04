/**
 * FORMEL-FURY-SHOOTER - STATS SYSTEM
 * Manages and displays player statistics in real-time
 */

class StatsSystem {
    constructor() {
        // UI Elements
        this.statsPanel = null;
        this.statElements = {};
        
        // Stats tracking
        this.stats = {
            hp: { current: 3, max: 3 },
            hpRegen: 0.0,
            luck: 0,
            speed: 100,
            combo: 0,
            coins: 0,
            wave: 1,
            level: 1
        };
        
        // Update intervals
        this.updateInterval = null;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.setupUI();
        this.startUpdateLoop();
        console.log('📊 StatsSystem initialized');
    }
    
    setupUI() {
        // Get stats panel
        this.statsPanel = document.getElementById('playerStatsPanel');
        
        // Get all stat value elements
        this.statElements = {
            hp: document.getElementById('statHP'),
            hpRegen: document.getElementById('statHPRegen'),
            luck: document.getElementById('statLuck'),
            speed: document.getElementById('statSpeed'),
            combo: document.getElementById('statCombo'),
            coins: document.getElementById('statCoins'),
            wave: document.getElementById('statWave'),
            level: document.getElementById('statLevel')
        };
        
        console.log('📊 StatsSystem UI setup complete');
    }
    
    /**
     * Show the stats panel during gameplay
     */
    show() {
        if (this.statsPanel) {
            this.statsPanel.style.display = 'block';
            this.isVisible = true;
            this.updateDisplay();
            console.log('📊 Stats panel shown');
        }
    }
    
    /**
     * Hide the stats panel (during menus)
     */
    hide() {
        if (this.statsPanel) {
            this.statsPanel.style.display = 'none';
            this.isVisible = false;
            console.log('📊 Stats panel hidden');
        }
    }
    
    /**
     * Update stats from game systems
     */
    updateStats() {
        if (!window.game) return;
        
        // Update HP with proper rounding
        this.stats.hp.current = Math.round((window.game.playerHealth || 3) * 100) / 100;
        this.stats.hp.max = window.game.playerMaxHealth || 3;
        
        // Update HP Regeneration
        this.stats.hpRegen = this.calculateHPRegen();
        
        // Update Luck from levelup system
        this.stats.luck = this.calculateLuck();
        
        // Update Speed
        this.stats.speed = this.calculateSpeed();
        
        // Update Combo
        this.stats.combo = window.game.formulaSystem?.currentCombo || 0;
        
        // Update Coins
        this.stats.coins = window.game.currencySystem?.coins || 0;
        
        // Update Wave
        this.stats.wave = window.game.waveSystem?.currentWave || 1;
        
        // Update Level
        this.stats.level = window.game.levelSystem?.currentLevel || 1;
    }
    
    /**
     * Calculate current HP regeneration rate
     */
    calculateHPRegen() {
        if (!window.game.regenerationEffects) return 0.0;
        
        let totalRegen = 0;
        window.game.regenerationEffects.forEach(effect => {
            totalRegen += effect.rate;
        });
        
        return Math.round(totalRegen * 10) / 10; // Round to 1 decimal
    }
    
    /**
     * Calculate current luck percentage
     */
    calculateLuck() {
        if (!window.game.levelUpSystem) return 0;
        
        const luckBonuses = window.game.levelUpSystem.luckBonuses;
        if (!luckBonuses) return 0;
        
        let totalLuck = 0;
        totalLuck += (luckBonuses.common || 0) * 3.5;  // Updated values from memory
        totalLuck += (luckBonuses.rare || 0) * 6.5;
        totalLuck += (luckBonuses.epic || 0) * 11;
        totalLuck += (luckBonuses.legendary || 0) * 18;
        
        return Math.round(totalLuck);
    }
    
    /**
     * Calculate current speed percentage
     */
    calculateSpeed() {
        if (!window.game.player) return 100;
        
        const baseSpeed = 200; // Actual base speed from player-input.js
        const currentSpeed = window.game.player.speed || baseSpeed;
        
        // Cap the speed display at reasonable values (max 1000%)
        const speedPercent = Math.round((currentSpeed / baseSpeed) * 100);
        return Math.min(speedPercent, 1000);
    }
    
    /**
     * Update the visual display of all stats
     */
    updateDisplay() {
        if (!this.isVisible) return;
        
        // Update HP with clean display
        if (this.statElements.hp) {
            const currentHP = Math.floor(this.stats.hp.current * 10) / 10; // Round to 1 decimal
            const maxHP = this.stats.hp.max;
            this.statElements.hp.textContent = `${currentHP}/${maxHP}`;
        }
        
        // Update HP Regeneration
        if (this.statElements.hpRegen) {
            this.statElements.hpRegen.textContent = `${this.stats.hpRegen}/s`;
        }
        
        // Update Luck
        if (this.statElements.luck) {
            this.statElements.luck.textContent = `${this.stats.luck}%`;
        }
        
        // Update Speed
        if (this.statElements.speed) {
            this.statElements.speed.textContent = `${this.stats.speed}%`;
        }
        
        // Update Combo
        if (this.statElements.combo) {
            this.statElements.combo.textContent = `${this.stats.combo}x`;
        }
        
        // Update Coins
        if (this.statElements.coins) {
            this.statElements.coins.textContent = `${this.stats.coins}`;
        }
        
        // Update Wave
        if (this.statElements.wave) {
            this.statElements.wave.textContent = `${this.stats.wave}`;
        }
        
        // Update Level
        if (this.statElements.level) {
            this.statElements.level.textContent = `${this.stats.level}`;
        }
    }
    
    /**
     * Start the update loop
     */
    startUpdateLoop() {
        // Update every 100ms for smooth real-time updates
        this.updateInterval = setInterval(() => {
            this.updateStats();
            this.updateDisplay();
        }, 100);
    }
    
    /**
     * Stop the update loop
     */
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    /**
     * Add a new stat row (for future expansion)
     * @param {string} id - Unique identifier for the stat
     * @param {string} icon - Emoji icon for the stat
     * @param {string} label - Display label for the stat
     * @param {string} initialValue - Initial value to display
     */
    addStat(id, icon, label, initialValue = '0') {
        if (!this.statsPanel) return;
        
        const statsContent = this.statsPanel.querySelector('.stats-content');
        if (!statsContent) return;
        
        // Create new stat row
        const statRow = document.createElement('div');
        statRow.className = 'stat-row';
        statRow.innerHTML = `
            <span class="stat-icon">${icon}</span>
            <span class="stat-label">${label}:</span>
            <span class="stat-value" id="stat${id}">${initialValue}</span>
        `;
        
        statsContent.appendChild(statRow);
        
        // Add to elements tracking
        this.statElements[id.toLowerCase()] = document.getElementById(`stat${id}`);
        
        console.log(`📊 Added new stat: ${label} (${id})`);
    }
    
    /**
     * Remove a stat row
     * @param {string} id - Identifier of the stat to remove
     */
    removeStat(id) {
        const element = this.statElements[id.toLowerCase()];
        if (element && element.parentNode && element.parentNode.parentNode) {
            element.parentNode.parentNode.removeChild(element.parentNode);
            delete this.statElements[id.toLowerCase()];
            console.log(`📊 Removed stat: ${id}`);
        }
    }
    
    /**
     * Get current stats object (for debugging)
     */
    getStats() {
        return { ...this.stats };
    }
    
    /**
     * Cleanup when game ends
     */
    destroy() {
        this.stopUpdateLoop();
        this.hide();
        console.log('📊 StatsSystem destroyed');
    }
}

// Global access for debugging
window.StatsSystem = StatsSystem;
