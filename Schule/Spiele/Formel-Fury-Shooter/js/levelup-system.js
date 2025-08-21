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
        ];
        
        // Category weights for random selection
        this.categoryWeights = {
            'common': 0.5,     // 50% chance
            'rare': 0.3,       // 30% chance  
            'epic': 0.15,      // 15% chance
            'legendary': 0.05  // 5% chance
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
     */
    showLevelUp(coinsEarned = 0) {
        if (this.isActive) return;
        
        this.isActive = true;
        this.coinsEarned = coinsEarned;
        
        // Update coins display
        if (this.levelUpCoinsElement) {
            this.levelUpCoinsElement.textContent = coinsEarned;
        }
        
        // Generate 3 random upgrades
        this.generateRandomUpgrades();
        
        // Show menu with animation
        this.levelUpMenu.style.display = 'flex';
        this.levelUpContent.classList.add('level-up-enter');
        
        console.log(`🔺 Level Up menu shown with ${coinsEarned} coins and upgrades:`, this.currentUpgrades.map(u => u.name));
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
        // Filter upgrades by weighted random category selection
        const randomValue = Math.random();
        let targetCategory = 'common';
        
        if (randomValue <= this.categoryWeights.legendary) {
            targetCategory = 'legendary';
        } else if (randomValue <= this.categoryWeights.legendary + this.categoryWeights.epic) {
            targetCategory = 'epic';
        } else if (randomValue <= this.categoryWeights.legendary + this.categoryWeights.epic + this.categoryWeights.rare) {
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
     * Apply the selected upgrade (placeholder implementation)
     * @param {Object} upgrade - The selected upgrade object
     */
    applyUpgrade(upgrade) {
        // PLACEHOLDER: This will be filled when real upgrades are provided
        console.log(`🔺 Applying upgrade: ${upgrade.name}`);
        console.log('⚠️ Upgrade effects not yet implemented - waiting for user-provided upgrades');
        
        // Future implementation will call specific upgrade effects here
        // Example: if (upgrade.effect) upgrade.effect();
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
