/**
 * FORMEL-FURY-SHOOTER - LEVEL UP SYSTEM
 * Handles upgrade selection after waves
 * Displays 3 random upgrade options with placeholder content
 */

class LevelUpSystem {
    constructor() {
        // UI Elements
        this.levelUpMenu = null;
        this.levelUpContent = null;
        this.levelUpCoinsElement = null;
        this.upgradeElements = [];
        
        // System state
        this.isActive = false;
        this.currentUpgrades = [];
        this.coinsEarned = 0;
        
        // Luck system - tracks accumulated luck bonuses
        this.luckBonuses = {
            common: 0,    // +2% per stack
            rare: 0,      // +4% per stack  
            epic: 0,      // +7% per stack
            legendary: 0  // +12% per stack
        };
        
        // Upgrade pool - PLUS-HP UPGRADES implemented
        this.upgradePool = [
            {
                id: 'plus_hp_common',
                name: 'PLUS-HP',
                description: '+1 Maximales Leben',
                category: 'common',
                icon: '❤️',
                effect: null // Will be implemented in step 2
            },
            {
                id: 'plus_hp_rare', 
                name: 'PLUS-HP',
                description: '+2 Maximales Leben',
                category: 'rare',
                icon: '💖',
                effect: null
            },
            {
                id: 'plus_hp_epic',
                name: 'PLUS-HP', 
                description: '+3 Maximales Leben',
                category: 'epic',
                icon: '💝',
                effect: null
            },
            {
                id: 'plus_hp_legendary',
                name: 'PLUS-HP',
                description: '+5 Maximales Leben', 
                category: 'legendary',
                icon: '💎❤️',
                effect: null
            },
            // HEILUNGSFORMEL Upgrades - HP Regeneration
            {
                id: 'heilungsformel_common',
                name: 'HEILUNGSFORMEL',
                description: '+0.05 HP/Sek Regeneration',
                category: 'common',
                icon: '💚',
                effect: null
            },
            {
                id: 'heilungsformel_rare',
                name: 'HEILUNGSFORMEL',
                description: '+0.15 HP/Sek Regeneration',
                category: 'rare',
                icon: '❤️‍🩹',
                effect: null
            },
            {
                id: 'heilungsformel_epic',
                name: 'HEILUNGSFORMEL',
                description: '+0.25 HP/Sek Regeneration',
                category: 'epic',
                icon: '✚',
                effect: null
            },
            {
                id: 'heilungsformel_legendary',
                name: 'HEILUNGSFORMEL',
                description: '+0.5 HP/Sek Regeneration',
                category: 'legendary',
                icon: '🟢✚',
                effect: null
            },
            // GLÜCKS-FORMEL Upgrades - Luck Enhancement
            {
                id: 'gluecks_formel_common',
                name: 'GLÜCKS-FORMEL',
                description: '+2% Glück',
                category: 'common',
                icon: '🍀',
                effect: null
            },
            {
                id: 'gluecks_formel_rare',
                name: 'GLÜCKS-FORMEL',
                description: '+4% Glück',
                category: 'rare',
                icon: '🍀',
                effect: null
            },
            {
                id: 'gluecks_formel_epic',
                name: 'GLÜCKS-FORMEL',
                description: '+7% Glück',
                category: 'epic',
                icon: '🍀',
                effect: null
            },
            {
                id: 'gluecks_formel_legendary',
                name: 'GLÜCKS-FORMEL',
                description: '+12% Glück',
                category: 'legendary',
                icon: '🍀',
                effect: null
            }
        ];
        
        // Category weights for random selection
        this.categoryWeights = {
            'common': 0.65,    // 65% chance (increased from 50%)
            'rare': 0.25,      // 25% chance (decreased from 30%)  
            'epic': 0.08,      // 8% chance (decreased from 15%)
            'legendary': 0.02  // 2% chance (decreased from 5%)
        };
        
        this.init();
    }
    
    init() {
        this.setupUI();
        console.log('🔺 LevelUpSystem initialized with', this.upgradePool.length, 'placeholder upgrades');
    }
    
    setupUI() {
        console.log('🔧 LevelUpSystem: Setting up UI...');
        
        this.levelUpMenu = document.getElementById('levelUpMenu');
        this.levelUpContent = document.getElementById('levelUpContent');
        this.levelUpCoinsElement = document.getElementById('levelUpCoinsValue');
        
        // Get upgrade card elements
        for (let i = 0; i < 3; i++) {
            this.upgradeElements.push({
                name: document.getElementById(`upgrade${i}Name`),
                description: document.getElementById(`upgrade${i}Desc`),
                card: document.querySelector(`.upgrade-card:nth-child(${i + 1})`)
            });
        }
        
        console.log('✅ LevelUpSystem UI setup complete');
    }
    
    /**
     * Show the level up menu with 3 random upgrades
     * @param {number} coinsEarned - Coins earned this wave
     * @param {number} currentLevelUp - Current level-up number (1-based)
     * @param {number} totalLevelUps - Total number of level-ups in this wave
     */
    showLevelUp(coinsEarned = 0, currentLevelUp = 1, totalLevelUps = 1) {
        if (this.isActive) {
            // If menu is already active, queue this level-up for later
            this.queueLevelUp(coinsEarned, currentLevelUp, totalLevelUps);
            return;
        }
        
        this.isActive = true;
        this.coinsEarned = coinsEarned;
        this.currentLevelUp = currentLevelUp;
        this.totalLevelUps = totalLevelUps;
        
        // Update coins display
        if (this.levelUpCoinsElement) {
            this.levelUpCoinsElement.textContent = coinsEarned;
        }
        
        // Update level-up counter display
        this.updateLevelUpCounter();
        
        // ALWAYS generate new random upgrades (re-roll for each level-up)
        this.generateRandomUpgrades();
        
        // Show menu with animation
        this.levelUpMenu.style.display = 'flex';
        this.levelUpContent.classList.add('level-up-enter');
        
        console.log(`🔺 Level Up menu shown (${currentLevelUp}/${totalLevelUps}) with ${coinsEarned} coins and upgrades:`, this.currentUpgrades.map(u => u.name));
    }
    
    /**
     * Queue a level-up if menu is already active
     * @param {number} coinsEarned - Coins for the queued level-up
     * @param {number} currentLevelUp - Current level-up number
     * @param {number} totalLevelUps - Total level-ups
     */
    queueLevelUp(coinsEarned, currentLevelUp, totalLevelUps) {
        if (!this.levelUpQueue) {
            this.levelUpQueue = [];
        }
        
        this.levelUpQueue.push({
            coins: coinsEarned,
            current: currentLevelUp,
            total: totalLevelUps
        });
        console.log(`🔺 Level-up queued (${this.levelUpQueue.length} in queue) - ${currentLevelUp}/${totalLevelUps} with ${coinsEarned} coins`);
    }
    
    /**
     * Process the next queued level-up if any exist
     */
    processNextLevelUp() {
        if (!this.levelUpQueue || this.levelUpQueue.length === 0) {
            return false;
        }
        
        const nextLevelUp = this.levelUpQueue.shift();
        console.log(`🔺 Processing next queued level-up ${nextLevelUp.current}/${nextLevelUp.total} with ${nextLevelUp.coins} coins (${this.levelUpQueue.length} remaining)`);
        
        // Show next level-up menu IMMEDIATELY without delay
        this.showLevelUp(nextLevelUp.coins, nextLevelUp.current, nextLevelUp.total);
        
        return true;
    }
    
    /**
     * Update the level-up counter display (e.g., "1 von 3")
     */
    updateLevelUpCounter() {
        const pageInfoElement = document.getElementById('levelUpPageInfo');
        if (pageInfoElement) {
            pageInfoElement.textContent = `${this.currentLevelUp} von ${this.totalLevelUps}`;
            console.log(`📊 Level-up counter updated: ${this.currentLevelUp} von ${this.totalLevelUps}`);
        } else {
            console.warn('⚠️ levelUpPageInfo element not found');
        }
    }
    
    /**
     * Generate 3 random upgrades from the upgrade pool
     */
    generateRandomUpgrades() {
        this.currentUpgrades = [];
        const usedUpgrades = new Set();
        
        // Generate 3 unique random upgrades
        while (this.currentUpgrades.length < 3 && this.currentUpgrades.length < this.upgradePool.length) {
            const selectedUpgrade = this.selectRandomUpgrade();
            
            // Ensure no duplicates
            if (!usedUpgrades.has(selectedUpgrade.id)) {
                this.currentUpgrades.push(selectedUpgrade);
                usedUpgrades.add(selectedUpgrade.id);
            }
        }
        
        // Update UI with selected upgrades
        this.updateUpgradeDisplay();
    }
    
    /**
     * Select a random upgrade based on category weights
     */
    selectRandomUpgrade() {
        // Get modified category weights based on luck bonuses
        const weights = this.getModifiedCategoryWeights();
        
        // Filter upgrades by weighted random category selection
        const randomValue = Math.random();
        let targetCategory = 'common';
        
        if (randomValue <= weights.legendary) {
            targetCategory = 'legendary';
        } else if (randomValue <= weights.legendary + weights.epic) {
            targetCategory = 'epic';
        } else if (randomValue <= weights.legendary + weights.epic + weights.rare) {
            targetCategory = 'rare';
        }
        
        // Get upgrades of target category
        const categoryUpgrades = this.upgradePool.filter(upgrade => upgrade.category === targetCategory);
        
        // Fallback to any upgrade if category is empty
        const availableUpgrades = categoryUpgrades.length > 0 ? categoryUpgrades : this.upgradePool;
        
        // Select random upgrade from available
        const randomIndex = Math.floor(Math.random() * availableUpgrades.length);
        return availableUpgrades[randomIndex];
    }
    
    /**
     * Update the UI to display the current upgrades
     */
    updateUpgradeDisplay() {
        for (let i = 0; i < 3; i++) {
            if (i < this.currentUpgrades.length && this.upgradeElements[i]) {
                const upgrade = this.currentUpgrades[i];
                const elements = this.upgradeElements[i];
                
                // Update text content
                if (elements.name) {
                    elements.name.textContent = upgrade.name;
                }
                if (elements.description) {
                    elements.description.textContent = upgrade.description;
                }
                
                // Update icon (placeholder for now)
                const iconElement = elements.card?.querySelector('.upgrade-icon-placeholder');
                if (iconElement) {
                    iconElement.textContent = upgrade.icon || '?';
                }
                
                // Update category label - THIS WAS MISSING!
                const categoryElement = elements.card?.querySelector('.upgrade-category');
                if (categoryElement) {
                    // Capitalize first letter
                    const categoryName = upgrade.category.charAt(0).toUpperCase() + upgrade.category.slice(1);
                    categoryElement.textContent = categoryName;
                    
                    // Add category class for dynamic styling
                    categoryElement.className = `upgrade-category ${upgrade.category}`;
                }
                
                console.log(`🔺 Updated upgrade slot ${i}: ${upgrade.name} (${upgrade.category})`);
            }
        }
    }
    
    /**
     * Handle upgrade selection
     * @param {number} upgradeIndex - Index of selected upgrade (0, 1, or 2)
     */
    selectUpgrade(upgradeIndex) {
        if (!this.isActive || upgradeIndex < 0 || upgradeIndex >= this.currentUpgrades.length) {
            console.warn('⚠️ Invalid upgrade selection:', upgradeIndex);
            return;
        }
        
        const selectedUpgrade = this.currentUpgrades[upgradeIndex];
        console.log(`🔺 Upgrade selected: ${selectedUpgrade.name} (${selectedUpgrade.category})`);
        
        // Apply upgrade effect (placeholder for now - will be implemented when real upgrades are added)
        this.applyUpgrade(selectedUpgrade);
        
        // Hide level up menu
        this.hideLevelUp();
        
        // Continue to shop menu (existing behavior)
        if (window.game && typeof window.game.showPauseMenu === 'function') {
            // Small delay before showing shop menu
            setTimeout(() => {
                window.game.showPauseMenu();
                console.log('🛍️ Shop menu opened after upgrade selection');
            }, 500);
        }
    }
    
    /**
     * Apply the selected upgrade
     * @param {Object} upgrade - The selected upgrade object
     */
    applyUpgrade(upgrade) {
        console.log(`🔺 Applying upgrade: ${upgrade.name}`);
        
        // Upgrade-specific logic based on ID
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
            
            // HEILUNGSFORMEL upgrades - regeneration only
            case 'heilungsformel_common':
                this.applyRegeneration(0.05, 60); // 0.05 HP/sec for 60 seconds
                break;
            case 'heilungsformel_rare':
                this.applyRegeneration(0.15, 60); // 0.15 HP/sec for 60 seconds (reduced from 0.25)
                break;
            case 'heilungsformel_epic':
                this.applyRegeneration(0.25, 60); // 0.25 HP/sec for 60 seconds (reduced from 0.5)
                break;
            case 'heilungsformel_legendary':
                this.applyFullHeal();
                this.applyRegeneration(1, 15); // 1 HP/sec for 15 seconds (reduced from 2)
                break;
            
            // GLÜCKS-FORMEL upgrades - luck enhancement
            case 'gluecks_formel_common':
                this.applyLuckUpgrade('common', 2);
                break;
            case 'gluecks_formel_rare':
                this.applyLuckUpgrade('rare', 4);
                break;
            case 'gluecks_formel_epic':
                this.applyLuckUpgrade('epic', 7);
                break;
            case 'gluecks_formel_legendary':
                this.applyLuckUpgrade('legendary', 12);
                break;
            
            default:
                console.warn(`⚠️ Unknown upgrade: ${upgrade.id}`);
        }
    }
    
    /**
     * Apply health upgrade - increases max HP and current HP
     * @param {number} healthIncrease - Amount to increase max HP by
     */
    applyHealthUpgrade(healthIncrease) {
        if (window.game) {
            const oldMaxHealth = window.game.playerMaxHealth;
            const oldCurrentHealth = window.game.playerHealth;
            
            // Increase maximum health
            window.game.playerMaxHealth += healthIncrease;
            // Increase current health by the same amount
            window.game.playerHealth += healthIncrease;
            
            console.log(`❤️ Health increased: ${oldCurrentHealth}/${oldMaxHealth} → ${window.game.playerHealth}/${window.game.playerMaxHealth}`);
            
            // Show visual feedback
            this.showUpgradeEffect(`+${healthIncrease} MAX HP!`, '#ff0000');
        } else {
            console.error('❌ Cannot apply health upgrade: window.game not available');
        }
    }
    
    /**
     * Apply healing upgrade - heals current HP without increasing max HP
     * @param {number} healAmount - Amount to heal
     */
    applyHealingUpgrade(healAmount) {
        if (window.game) {
            const oldHealth = window.game.playerHealth;
            const maxHealth = window.game.playerMaxHealth;
            
            // Heal current health up to maximum
            window.game.playerHealth = Math.min(window.game.playerHealth + healAmount, maxHealth);
            const actualHeal = window.game.playerHealth - oldHealth;
            
            console.log(`💚 Healed: ${oldHealth}/${maxHealth} → ${window.game.playerHealth}/${maxHealth} (+${actualHeal})`);
            
            // Show visual feedback
            this.showUpgradeEffect(`+${actualHeal} HP!`, '#00ff00');
        } else {
            console.error('❌ Cannot apply healing upgrade: window.game not available');
        }
    }
    
    /**
     * Apply full heal - restores HP to maximum
     */
    applyFullHeal() {
        if (window.game) {
            const oldHealth = window.game.playerHealth;
            const maxHealth = window.game.playerMaxHealth;
            
            window.game.playerHealth = maxHealth;
            const healAmount = maxHealth - oldHealth;
            
            console.log(`💚 Full heal: ${oldHealth}/${maxHealth} → ${window.game.playerHealth}/${maxHealth} (+${healAmount})`);
            
            // Show visual feedback
            this.showUpgradeEffect('FULL HEAL!', '#00ff88');
        } else {
            console.error('❌ Cannot apply full heal: window.game not available');
        }
    }
    
    /**
     * Apply regeneration effect - heals HP over time
     * @param {number} regenRate - HP per second
     * @param {number} duration - Duration in seconds
     */
    applyRegeneration(regenRate, duration) {
        if (window.game) {
            // Initialize regeneration system if it doesn't exist
            if (!window.game.regenerationEffects) {
                window.game.regenerationEffects = [];
            }
            
            // Add new regeneration effect
            const regenEffect = {
                rate: regenRate,
                duration: duration,
                timeLeft: duration,
                id: Date.now() + Math.random() // Unique ID
            };
            
            window.game.regenerationEffects.push(regenEffect);
            
            console.log(`💚 Regeneration applied: ${regenRate} HP/sec for ${duration} seconds`);
            
            // Show visual feedback
            this.showUpgradeEffect(`+${regenRate} HP/sec (${duration}s)`, '#88ff88');
            
            // Start regeneration timer if not already running
            this.startRegenerationSystem();
        } else {
            console.error('❌ Cannot apply regeneration: window.game not available');
        }
    }
    
    /**
     * Start the regeneration system timer
     */
    startRegenerationSystem() {
        // Prevent multiple timers
        if (window.game.regenerationTimer) {
            return;
        }
        
        window.game.regenerationTimer = setInterval(() => {
            if (!window.game.regenerationEffects || window.game.regenerationEffects.length === 0) {
                clearInterval(window.game.regenerationTimer);
                window.game.regenerationTimer = null;
                return;
            }
            
            // Process all active regeneration effects
            for (let i = window.game.regenerationEffects.length - 1; i >= 0; i--) {
                const effect = window.game.regenerationEffects[i];
                
                // Apply regeneration
                const oldHealth = window.game.playerHealth;
                const maxHealth = window.game.playerMaxHealth;
                window.game.playerHealth = Math.min(window.game.playerHealth + effect.rate, maxHealth);
                
                // Decrease time left
                effect.timeLeft -= 1;
                
                // Remove expired effects
                if (effect.timeLeft <= 0) {
                    window.game.regenerationEffects.splice(i, 1);
                    console.log(`💚 Regeneration effect expired (${effect.rate} HP/sec)`);
                }
            }
            
            // Stop timer if no effects remain
            if (window.game.regenerationEffects.length === 0) {
                clearInterval(window.game.regenerationTimer);
                window.game.regenerationTimer = null;
            }
        }, 1000); // Run every second
    }
    
    /**
     * Apply luck upgrade - increases chances for better rarities
     * @param {string} rarity - The rarity of the luck upgrade (common/rare/epic/legendary)
     * @param {number} luckBonus - The luck percentage bonus to add
     */
    applyLuckUpgrade(rarity, luckBonus) {
        // Increment the luck bonus for this rarity (max 15 stacks per rarity)
        if (this.luckBonuses[rarity] < 15) {
            this.luckBonuses[rarity]++;
            
            console.log(`🍀 Luck upgrade applied: ${rarity} (+${luckBonus}%) - Stack ${this.luckBonuses[rarity]}/15`);
            console.log('🍀 Current luck bonuses:', this.luckBonuses);
            
            // Show visual feedback
            this.showUpgradeEffect(`🍀 +${luckBonus}% Glück!`, '#00ff00');
        } else {
            console.log(`🍀 Max luck stacks reached for ${rarity} (15/15)`);
            this.showUpgradeEffect(`🍀 Max Glück erreicht!`, '#ffff00');
        }
    }
    
    /**
     * Calculate modified category weights based on luck bonuses
     * @returns {Object} Modified category weights
     */
    getModifiedCategoryWeights() {
        // Base weights
        let weights = {
            'common': 0.65,
            'rare': 0.25,
            'epic': 0.08,
            'legendary': 0.02
        };
        
        // Apply luck bonuses based on stacks
        const commonBonus = this.luckBonuses.common * 0.02;  // 2% per stack
        const rareBonus = this.luckBonuses.rare * 0.04;      // 4% per stack
        const epicBonus = this.luckBonuses.epic * 0.07;      // 7% per stack
        const legendaryBonus = this.luckBonuses.legendary * 0.12; // 12% per stack
        
        // Total bonus to redistribute
        const totalBonus = commonBonus + rareBonus + epicBonus + legendaryBonus;
        
        // Redistribute weights (take from common, give to higher rarities)
        weights.common = Math.max(0.1, weights.common - totalBonus * 0.6);
        weights.rare = Math.min(0.5, weights.rare + (commonBonus * 0.75) + (rareBonus * 0.5));
        weights.epic = Math.min(0.3, weights.epic + (commonBonus * 0.15) + (rareBonus * 0.35) + (epicBonus * 0.6));
        weights.legendary = Math.min(0.25, weights.legendary + (commonBonus * 0.1) + (rareBonus * 0.15) + (epicBonus * 0.4) + (legendaryBonus * 0.8));
        
        // Normalize to ensure they sum to 1.0
        const sum = weights.common + weights.rare + weights.epic + weights.legendary;
        weights.common /= sum;
        weights.rare /= sum;
        weights.epic /= sum;
        weights.legendary /= sum;
        
        return weights;
    }
    
    /**
     * Show visual upgrade effect feedback
     * @param {string} message - Message to display
     * @param {string} color - Color of the effect text
     */
    showUpgradeEffect(message, color = '#00ff00') {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.position = 'fixed';
        feedback.style.top = '50%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.color = color;
        feedback.style.fontSize = '36px';
        feedback.style.fontWeight = 'bold';
        feedback.style.fontFamily = 'Courier New, monospace';
        feedback.style.textShadow = `0 0 20px ${color}`;
        feedback.style.zIndex = '9999';
        feedback.style.pointerEvents = 'none';
        feedback.style.animation = 'upgradeEffectFloat 2s ease-out forwards';
        
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }
    
    /**
     * Hide the level up menu
     */
    hideLevelUp() {
        this.isActive = false;
        this.levelUpMenu.style.display = 'none';
        this.levelUpContent.classList.remove('level-up-enter');
        this.currentUpgrades = [];
        console.log('🔺 Level Up menu hidden');
        
        // Process next queued level-up if any exist
        this.processNextLevelUp();
    }
    
    /**
     * Add a new upgrade to the pool (for future user-provided upgrades)
     * @param {Object} upgrade - Upgrade object with name, description, category, icon, effect
     */
    addUpgrade(upgrade) {
        if (!upgrade.id || !upgrade.name || !upgrade.category) {
            console.error('❌ Invalid upgrade object:', upgrade);
            return false;
        }
        
        this.upgradePool.push(upgrade);
        console.log(`✅ Added new upgrade: ${upgrade.name} (${upgrade.category})`);
        return true;
    }
    
    /**
     * Remove all placeholder upgrades and replace with user-provided ones
     * @param {Array} newUpgrades - Array of upgrade objects
     */
    replaceUpgrades(newUpgrades) {
        if (!Array.isArray(newUpgrades)) {
            console.error('❌ newUpgrades must be an array');
            return false;
        }
        
        this.upgradePool = newUpgrades;
        console.log(`🔄 Replaced upgrade pool with ${newUpgrades.length} new upgrades`);
        return true;
    }
    
    /**
     * Get current upgrade pool for debugging
     */
    getUpgradePool() {
        return this.upgradePool;
    }
    
    /**
     * Debug function to test the level up system
     */
    testLevelUpSystem() {
        console.log('🧪 Testing LevelUpSystem...');
        console.log('Current upgrade pool:', this.upgradePool.length, 'upgrades');
        
        // Test showing level up with sample coins
        this.showLevelUp(150);
        
        return {
            upgradeCount: this.upgradePool.length,
            currentUpgrades: this.currentUpgrades,
            isActive: this.isActive
        };
    }
}
