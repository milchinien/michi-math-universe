/**
 * FORMEL-FURY-SHOOTER - LEVEL SYSTEM
 * Handles player leveling, XP drops, and progression
 * Phase 4.5: Level System Implementation
 */

class LevelSystem {
    constructor() {
        // Level progression
        this.level = 1;
        this.xp = 0;
        this.totalXpEarned = 0;
        this.sessionXpEarned = 0;
        
        // XP calculation settings - PROGRESSIVE PER-LEVEL REQUIREMENTS
        this.currentLevelXp = 0; // XP in current level
        
        // Level-specific XP requirements table (must be created FIRST)
        this.levelXpTable = this.generateLevelXpTable();
        
        // Now we can safely calculate XP requirements
        this.xpToNextLevel = this.getXpRequiredForLevel(this.level + 1);
        
        // XP drop values per enemy type - INCREASED VALUES
        this.xpValues = {
            'polynom_zombie': { min: 20, max: 35 },    // Easier enemy = decent XP (was 8-15)
            'gleichungs_geist': { min: 30, max: 50 }, // Fast enemy = good XP (was 12-20)
            'elite_mob': { min: 60, max: 100 },       // Elite enemy = high XP (was 25-40)
            'basic': { min: 25, max: 45 }             // Standard enemy = good XP (was 10-18)
        };
        
        // XP bonus multipliers - IMPROVED REWARDS
        this.comboXpBonus = {
            3: 1.5,   // +50% at 3x combo (was +20%)
            5: 2.0,   // +100% at 5x combo (was +40%)
            10: 2.5,  // +150% at 10x combo (was +60%)
            15: 3.0   // +200% at 15x combo (was +100%)
        };
        
        // UI Elements
        this.levelDisplay = null;
        this.xpBarContainer = null;
        this.xpBar = null;
        this.levelValueElement = null;
        this.xpValueElement = null;
        
        // Animation system for XP drops
        this.xpDrops = [];
        this.maxXpDrops = 8; // Performance limit
        
        // Level up effects
        this.isLevelingUp = false;
        this.levelUpStartTime = 0;
        this.levelUpDuration = 2000; // 2 seconds level up animation
        
        this.init();
    }
    
    init() {
        this.setupUI();
        this.calculateXpToNextLevel();
        this.updateDisplay();
        console.log('📈 LevelSystem initialized at level', this.level, 'with', this.xp, 'XP');
    }
    
    setupUI() {
        console.log('🔧 LevelSystem: Setting up UI...');
        
        // Create level display if it doesn't exist
        this.levelDisplay = document.getElementById('levelDisplay');
        if (!this.levelDisplay) {
            this.levelDisplay = document.createElement('div');
            this.levelDisplay.id = 'levelDisplay';
            this.levelDisplay.innerHTML = `
                <div class="level-info-section">
                    <div class="level-info-item">
                        <span class="level-info-label">📈 Level:</span>
                        <span class="level-info-value" id="levelValue">1</span>
                    </div>
                    <div class="level-info-item">
                        <span class="level-info-label">🌊 Wave:</span>
                        <span class="level-info-value" id="waveValue">1</span>
                    </div>
                    <div class="level-info-item">
                        <span class="level-info-label">💰 Coins:</span>
                        <span class="level-info-value" id="coinsValue">0</span>
                    </div>
                </div>
                <div class="xp-bar-container" id="xpBarContainer">
                    <div class="xp-bar" id="xpBar"></div>
                    <div class="xp-text" id="xpValue">0 / 100</div>
                </div>
                <div class="level-info-section">
                    <div class="level-info-item">
                        <span class="level-info-label">🎯 Combo:</span>
                        <span class="level-info-value" id="comboValue">0x</span>
                    </div>
                    <div class="level-info-item">
                        <span class="level-info-label">🏆 Score:</span>
                        <span class="level-info-value" id="scoreValue">0</span>
                    </div>
                    <div class="level-info-item">
                        <span class="level-info-label">⚡ FPS:</span>
                        <span class="level-info-value" id="fpsValue">60</span>
                    </div>
                </div>
            `;
            
            document.body.appendChild(this.levelDisplay);
            console.log('✅ LevelDisplay created and added to DOM');
        }
        
        this.levelValueElement = document.getElementById('levelValue');
        this.xpValueElement = document.getElementById('xpValue');
        this.xpBarContainer = document.getElementById('xpBarContainer');
        this.xpBar = document.getElementById('xpBar');
        
        console.log('✅ LevelSystem UI setup complete');
    }
    
    generateLevelXpTable() {
        // Generate progressive XP requirements per level
        const table = {};
        
        // Level 1->2: 50 XP
        table[2] = 50;
        // Level 2->3: 75 XP  
        table[3] = 75;
        
        // Progressive scaling for higher levels
        for (let level = 4; level <= 50; level++) {
            if (level <= 10) {
                // Levels 4-10: gradual increase
                table[level] = Math.floor(75 + (level - 3) * 25); // 100, 125, 150, 175, 200, 225, 250
            } else if (level <= 20) {
                // Levels 11-20: moderate increase
                table[level] = Math.floor(250 + (level - 10) * 50); // 300, 350, 400... up to 750
            } else if (level <= 30) {
                // Levels 21-30: larger jumps
                table[level] = Math.floor(750 + (level - 20) * 150); // 900, 1050... up to 2250
            } else {
                // Levels 31+: exponential for end game
                table[level] = Math.floor(2250 + (level - 30) * 250); // 2500, 2750... up to 7250 at level 50
            }
        }
        
        return table;
    }
    
    getXpRequiredForLevel(level) {
        // Returns XP needed to reach this level FROM the previous level
        if (level <= 1) return 0;
        
        // Safety check: ensure table exists
        if (!this.levelXpTable) {
            console.warn('⚠️ levelXpTable not initialized, using fallback');
            return level <= 2 ? 50 : level <= 3 ? 75 : 100;
        }
        
        return this.levelXpTable[level] || 10000; // Default for very high levels
    }
    
    getTotalXpForLevel(level) {
        // Returns total cumulative XP needed to reach this level
        let total = 0;
        for (let l = 2; l <= level; l++) {
            total += this.getXpRequiredForLevel(l);
        }
        return total;
    }
    
    calculateXpToNextLevel() {
        const totalXpForCurrentLevel = this.getTotalXpForLevel(this.level);
        const totalXpForNextLevel = this.getTotalXpForLevel(this.level + 1);
        const xpRequiredForNextLevel = this.getXpRequiredForLevel(this.level + 1);
        
        this.currentLevelXp = this.xp - totalXpForCurrentLevel;
        this.xpToNextLevel = totalXpForNextLevel - this.xp;
        
        // Fix: Ensure we always have valid values
        if (this.currentLevelXp < 0) this.currentLevelXp = 0;
        if (this.xpToNextLevel < 0) this.xpToNextLevel = 0;
        
        return {
            current: this.currentLevelXp,
            required: xpRequiredForNextLevel,
            toNext: this.xpToNextLevel
        };
    }
    
    calculateXpDrop(enemy, combo = 0, timeTaken = 5000) {
        console.log('🔍 LevelSystem: calculateXpDrop called with:', {
            enemy: enemy,
            enemyType: enemy ? enemy.type : 'undefined',
            combo: combo,
            timeTaken: timeTaken
        });
        
        if (!enemy || !enemy.type) {
            console.warn('⚠️ LevelSystem: Invalid enemy for XP calculation', enemy);
            return 0;
        }
        
        // Get base XP value for enemy type
        const xpData = this.xpValues[enemy.type] || this.xpValues['basic'];
        console.log('📈 Using XP data for type', enemy.type, ':', xpData);
        let baseXp = Math.floor(Math.random() * (xpData.max - xpData.min + 1)) + xpData.min;
        console.log('🎲 Base XP calculated:', baseXp);
        
        // Apply difficulty modifier (harder formulas = more XP)
        if (enemy.assignedFormula && enemy.assignedFormula.difficulty) {
            baseXp = Math.round(baseXp * enemy.assignedFormula.difficulty);
            console.log('⚡ Difficulty multiplier applied:', enemy.assignedFormula.difficulty, '-> XP:', baseXp);
        }
        
        // Apply combo bonus
        let comboMultiplier = 1.0;
        for (const [comboThreshold, multiplier] of Object.entries(this.comboXpBonus)) {
            if (combo >= parseInt(comboThreshold)) {
                comboMultiplier = multiplier;
            }
        }
        console.log('🔥 Combo multiplier:', comboMultiplier);
        
        // Speed bonus (faster answers = more XP) - INCREASED BONUS
        let speedMultiplier = 1.0;
        if (timeTaken < 5000) {
            speedMultiplier = 1.0 + ((5000 - timeTaken) / 5000) * 0.6; // Up to 60% bonus (was 30%)
        }
        console.log('⚡ Speed multiplier:', speedMultiplier.toFixed(2));
        
        const totalXp = Math.round(baseXp * comboMultiplier * speedMultiplier);
        
        console.log(`📈 XP calculation: Base(${baseXp}) × Combo(${comboMultiplier.toFixed(1)}) × Speed(${speedMultiplier.toFixed(1)}) = ${totalXp}`);
        
        return Math.max(1, totalXp); // Minimum 1 XP
    }
    
    addXp(amount) {
        if (amount <= 0) return false;
        
        this.xp += amount;
        this.totalXpEarned += amount;
        this.sessionXpEarned += amount;
        
        console.log(`📈 +${amount} XP! Total: ${this.xp}`);
        
        // Check for level up
        const leveledUp = this.checkLevelUp();
        
        this.updateDisplay();
        return leveledUp;
    }
    
    checkLevelUp() {
        let levelsGained = 0;
        
        // Keep checking for level ups until no more are possible
        while (true) {
            const totalXpForNextLevel = this.getTotalXpForLevel(this.level + 1);
            
            if (this.xp >= totalXpForNextLevel) {
                this.levelUp();
                levelsGained++;
                
                // Safety check to prevent infinite loops (max 10 levels at once)
                if (levelsGained >= 10) {
                    console.warn('⚠️ Too many level ups at once, stopping at 10');
                    break;
                }
            } else {
                break;
            }
        }
        
        return levelsGained > 0;
    }
    
    levelUp() {
        const oldLevel = this.level;
        this.level++;
        this.isLevelingUp = true;
        this.levelUpStartTime = Date.now();
        
        console.log(`🎉 LEVEL UP! ${oldLevel} → ${this.level}`);
        
        // Trigger level up animation
        this.triggerLevelUpAnimation();
        
        // Calculate new XP requirements after level change
        this.calculateXpToNextLevel();
        
        // Track level-ups for wave completion (don't show menu immediately)
        this.trackLevelUpForWave();
        
        return this.level;
    }
    
    /**
     * Track level-ups that occurred during the current wave
     */
    trackLevelUpForWave() {
        if (!this.pendingLevelUps) {
            this.pendingLevelUps = 0;
        }
        this.pendingLevelUps++;
        console.log(`📊 Level-up tracked for wave completion (${this.pendingLevelUps} pending)`);
    }
    
    /**
     * Get number of pending level-ups for wave completion
     */
    getPendingLevelUps() {
        return this.pendingLevelUps || 0;
    }
    
    /**
     * Clear pending level-ups (called after wave completion)
     */
    clearPendingLevelUps() {
        const count = this.pendingLevelUps || 0;
        this.pendingLevelUps = 0;
        console.log(`🔄 Cleared ${count} pending level-ups`);
        return count;
    }
    
    triggerLevelUpAnimation() {
        if (!this.levelDisplay) return;
        
        // Add level up animation class
        this.levelDisplay.classList.add('level-up-animation');
        
        // Create floating level up text
        this.showLevelUpEffect();
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (this.levelDisplay) {
                this.levelDisplay.classList.remove('level-up-animation');
                this.isLevelingUp = false;
            }
        }, this.levelUpDuration);
    }
    
    showLevelUpEffect() {
        // Create floating "LEVEL UP!" text
        const levelUpText = document.createElement('div');
        levelUpText.textContent = `LEVEL ${this.level}!`;
        levelUpText.style.position = 'absolute';
        levelUpText.style.left = '50%';
        levelUpText.style.top = '30%';
        levelUpText.style.transform = 'translateX(-50%)';
        levelUpText.style.color = '#ffff00';
        levelUpText.style.fontSize = '48px';
        levelUpText.style.fontWeight = 'bold';
        levelUpText.style.fontFamily = '"Courier New", monospace';
        levelUpText.style.textShadow = '0 0 20px #ffff00';
        levelUpText.style.zIndex = '1000';
        levelUpText.style.pointerEvents = 'none';
        levelUpText.style.animation = 'levelUpFloat 2s ease-out forwards';
        
        document.body.appendChild(levelUpText);
        
        // Remove the element after animation
        setTimeout(() => {
            if (levelUpText.parentNode) {
                levelUpText.parentNode.removeChild(levelUpText);
            }
        }, 2000);
    }
    
    showXpDrop(x, y, amount) {
        if (this.xpDrops.length >= this.maxXpDrops) {
            // Remove oldest XP drop to prevent performance issues
            this.xpDrops.shift();
        }
        
        const xpDrop = {
            x: x,
            y: y,
            targetX: 120, // Approximate position of level display
            targetY: window.innerHeight - 50,
            amount: amount,
            progress: 0,
            alpha: 1.0,
            scale: 1.0,
            createdTime: Date.now()
        };
        
        this.xpDrops.push(xpDrop);
        console.log(`📈 XP drop created at (${x}, ${y}) for ${amount} XP`);
    }
    
    update(deltaTime) {
        this.updateXpDrops(deltaTime);
        
        // Update level up animation
        if (this.isLevelingUp) {
            const elapsed = Date.now() - this.levelUpStartTime;
            if (elapsed >= this.levelUpDuration) {
                this.isLevelingUp = false;
            }
        }
    }
    
    updateXpDrops(deltaTime) {
        for (let i = this.xpDrops.length - 1; i >= 0; i--) {
            const drop = this.xpDrops[i];
            
            // Update animation progress
            drop.progress += deltaTime * 0.0015; // 1.5 seconds total animation
            
            if (drop.progress >= 1.0) {
                // Animation complete, remove XP drop
                this.xpDrops.splice(i, 1);
                continue;
            }
            
            // Smooth interpolation to target position
            const easeProgress = this.easeOutQuad(drop.progress);
            drop.x = drop.x + (drop.targetX - drop.x) * easeProgress * 0.15;
            drop.y = drop.y + (drop.targetY - drop.y) * easeProgress * 0.15;
            
            // Fade out near the end
            if (drop.progress > 0.7) {
                drop.alpha = Math.max(0, 1.0 - ((drop.progress - 0.7) / 0.3));
            }
            
            // Scale effect
            drop.scale = 1.0 + Math.sin(drop.progress * Math.PI) * 0.2;
        }
    }
    
    render(ctx) {
        this.renderXpDrops(ctx);
    }
    
    renderXpDrops(ctx) {
        for (const drop of this.xpDrops) {
            ctx.save();
            
            // Set alpha and position
            ctx.globalAlpha = drop.alpha;
            ctx.translate(drop.x, drop.y);
            ctx.scale(drop.scale, drop.scale);
            
            // Draw XP orb (glowing blue/green)
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
            gradient.addColorStop(0, '#00ffff');
            gradient.addColorStop(0.7, '#0088ff');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw XP symbol
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('XP', 0, 0);
            
            // Draw amount text
            if (drop.progress < 0.4) {
                ctx.fillStyle = `rgba(0, 255, 255, ${drop.alpha})`;
                ctx.font = 'bold 10px Arial';
                ctx.fillText(`+${drop.amount}`, 0, -18);
            }
            
            ctx.restore();
        }
    }
    
    updateDisplay() {
        if (this.levelValueElement) {
            this.levelValueElement.textContent = this.level;
        }
        
        const xpData = this.calculateXpToNextLevel();
        
        if (this.xpValueElement) {
            this.xpValueElement.textContent = `${xpData.current} / ${xpData.required}`;
        }
        
        if (this.xpBar) {
            const percentage = (xpData.current / xpData.required) * 100;
            this.xpBar.style.width = `${Math.min(100, percentage)}%`;
            
            // Color coding based on progress
            if (percentage >= 80) {
                this.xpBar.style.background = 'linear-gradient(90deg, #ffaa00, #ffff00)';
            } else if (percentage >= 50) {
                this.xpBar.style.background = 'linear-gradient(90deg, #0088ff, #00ffff)';
            } else {
                this.xpBar.style.background = 'linear-gradient(90deg, #004488, #0088ff)';
            }
        }
    }
    
    easeOutQuad(t) {
        return t * (2 - t);
    }
    
    // Getter methods
    getLevel() {
        return this.level;
    }
    
    getXp() {
        return this.xp;
    }
    
    getTotalXpEarned() {
        return this.totalXpEarned;
    }
    
    getSessionXpEarned() {
        return this.sessionXpEarned;
    }
    
    getXpToNextLevel() {
        return this.calculateXpToNextLevel().toNext;
    }
    
    // Debug function
    testLevelSystem() {
        console.log('🧪 Testing LevelSystem...');
        console.log('Current level:', this.level);
        console.log('Current XP:', this.xp);
        console.log('XP to next level:', this.getXpToNextLevel());
        
        // Add some test XP
        const testXp = 50;
        const leveledUp = this.addXp(testXp);
        console.log(`Added ${testXp} test XP. Leveled up:`, leveledUp);
        
        // Test XP drop animation
        this.showXpDrop(400, 300, testXp);
        console.log('Test XP drop animation triggered');
        
        return {
            level: this.level,
            xp: this.xp,
            leveledUp: leveledUp
        };
    }
}
