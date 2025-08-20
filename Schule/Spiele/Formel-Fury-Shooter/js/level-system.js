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
        
        // XP calculation settings
        this.baseXpRequired = 100; // XP needed for level 2
        this.xpGrowthFactor = 1.5; // Exponential growth factor
        this.currentLevelXp = 0; // XP in current level
        this.xpToNextLevel = this.baseXpRequired;
        
        // XP drop values per enemy type
        this.xpValues = {
            'polynom_zombie': { min: 8, max: 15 },    // Easier enemy = less XP
            'gleichungs_geist': { min: 12, max: 20 }, // Fast enemy = medium XP
            'elite_mob': { min: 25, max: 40 },        // Elite enemy = high XP
            'basic': { min: 10, max: 18 }             // Standard enemy = medium XP
        };
        
        // XP bonus multipliers
        this.comboXpBonus = {
            3: 1.2,   // +20% at 3x combo
            5: 1.4,   // +40% at 5x combo
            10: 1.6,  // +60% at 10x combo
            15: 2.0   // +100% at 15x combo
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
                <div class="level-header">LEVEL <span id="levelValue">1</span></div>
                <div class="xp-bar-container" id="xpBarContainer">
                    <div class="xp-bar" id="xpBar"></div>
                    <div class="xp-text" id="xpValue">0 / 100</div>
                </div>
            `;
            
            // Add CSS styles dynamically
            this.levelDisplay.style.position = 'absolute';
            this.levelDisplay.style.bottom = '20px';
            this.levelDisplay.style.left = '10px';
            this.levelDisplay.style.color = '#ff6600';
            this.levelDisplay.style.fontSize = '14px';
            this.levelDisplay.style.fontWeight = 'bold';
            this.levelDisplay.style.fontFamily = '"Courier New", monospace';
            this.levelDisplay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            this.levelDisplay.style.zIndex = '100';
            this.levelDisplay.style.minWidth = '200px';
            
            document.body.appendChild(this.levelDisplay);
            console.log('✅ LevelDisplay created and added to DOM');
        }
        
        this.levelValueElement = document.getElementById('levelValue');
        this.xpValueElement = document.getElementById('xpValue');
        this.xpBarContainer = document.getElementById('xpBarContainer');
        this.xpBar = document.getElementById('xpBar');
        
        console.log('✅ LevelSystem UI setup complete');
    }
    
    calculateXpRequired(level) {
        // Exponential XP growth: XP = base * (growth^(level-1))
        return Math.floor(this.baseXpRequired * Math.pow(this.xpGrowthFactor, level - 1));
    }
    
    calculateXpToNextLevel() {
        const nextLevelXp = this.calculateXpRequired(this.level + 1);
        const currentLevelStartXp = this.level > 1 ? this.calculateXpRequired(this.level) : 0;
        
        this.currentLevelXp = this.xp - currentLevelStartXp;
        this.xpToNextLevel = nextLevelXp - this.xp;
        
        return {
            current: this.currentLevelXp,
            required: nextLevelXp - currentLevelStartXp,
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
        
        // Speed bonus (faster answers = more XP)
        let speedMultiplier = 1.0;
        if (timeTaken < 5000) {
            speedMultiplier = 1.0 + ((5000 - timeTaken) / 5000) * 0.3; // Up to 30% bonus
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
        const nextLevelXp = this.calculateXpRequired(this.level + 1);
        
        if (this.xp >= nextLevelXp) {
            this.levelUp();
            return true;
        }
        return false;
    }
    
    levelUp() {
        this.level++;
        this.isLevelingUp = true;
        this.levelUpStartTime = Date.now();
        
        console.log(`🎉 LEVEL UP! Now level ${this.level}`);
        
        // Trigger level up animation
        this.triggerLevelUpAnimation();
        
        // Calculate new XP requirements
        this.calculateXpToNextLevel();
        
        return this.level;
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
