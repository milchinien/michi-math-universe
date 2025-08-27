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
            },
            // LERNKURVE Upgrades - XP Bonus
            {
                id: 'lernkurve_common',
                name: 'LERNKURVE',
                description: '+15% XP von Gegnern',
                category: 'common',
                icon: '📚',
                effect: (player, game) => {
                    if (!game.playerStats) game.playerStats = {};
                    if (!game.playerStats.xpMultiplier) game.playerStats.xpMultiplier = 1.0;
                    game.playerStats.xpMultiplier += 0.15;
                    console.log('📚 LERNKURVE (Common): XP Multiplier now', game.playerStats.xpMultiplier);
                }
            },
            {
                id: 'lernkurve_rare',
                name: 'LERNKURVE',
                description: '+25% XP von Gegnern',
                category: 'rare',
                icon: '📖',
                effect: (player, game) => {
                    if (!game.playerStats) game.playerStats = {};
                    if (!game.playerStats.xpMultiplier) game.playerStats.xpMultiplier = 1.0;
                    game.playerStats.xpMultiplier += 0.25;
                    console.log('📖 LERNKURVE (Rare): XP Multiplier now', game.playerStats.xpMultiplier);
                }
            },
            {
                id: 'lernkurve_epic',
                name: 'LERNKURVE',
                description: '+40% XP von Gegnern',
                category: 'epic',
                icon: '📘',
                effect: (player, game) => {
                    if (!game.playerStats) game.playerStats = {};
                    if (!game.playerStats.xpMultiplier) game.playerStats.xpMultiplier = 1.0;
                    game.playerStats.xpMultiplier += 0.40;
                    console.log('📘 LERNKURVE (Epic): XP Multiplier now', game.playerStats.xpMultiplier);
                }
            },
            {
                id: 'lernkurve_legendary',
                name: 'LERNKURVE',
                description: '+60% XP von Gegnern',
                category: 'legendary',
                icon: '📚✨',
                effect: (player, game) => {
                    if (!game.playerStats) game.playerStats = {};
                    if (!game.playerStats.xpMultiplier) game.playerStats.xpMultiplier = 1.0;
                    game.playerStats.xpMultiplier += 0.60;
                    console.log('📚✨ LERNKURVE (Legendary): XP Multiplier now', game.playerStats.xpMultiplier);
                }
            },
            // BLITZSCHRITT Upgrades - Speed Enhancement
            {
                id: 'blitzschritt_common',
                name: 'BLITZSCHRITT',
                description: '+10% Bewegungsgeschwindigkeit',
                category: 'common',
                icon: '⚡',
                effect: function() {
                    console.log('⚡ BLITZSCHRITT (Common): +10% Speed applied');
                }
            },
            {
                id: 'blitzschritt_rare',
                name: 'BLITZSCHRITT',
                description: '+18% Bewegungsgeschwindigkeit',
                category: 'rare',
                icon: '⚡',
                effect: function() {
                    console.log('⚡ BLITZSCHRITT (Rare): +18% Speed applied');
                }
            },
            {
                id: 'blitzschritt_epic',
                name: 'BLITZSCHRITT',
                description: '+28% Bewegungsgeschwindigkeit',
                category: 'epic',
                icon: '⚡',
                effect: function() {
                    console.log('⚡ BLITZSCHRITT (Epic): +28% Speed applied');
                }
            },
            {
                id: 'blitzschritt_legendary',
                name: 'BLITZSCHRITT',
                description: '+40% Bewegungsgeschwindigkeit',
                category: 'legendary',
                icon: '⚡',
                effect: function() {
                    console.log('⚡ BLITZSCHRITT (Legendary): +40% Speed applied');
                }
            },
            // KOMBOFEUER Upgrades - Combo Timer and XP Bonuses
            {
                id: 'kombofeuer_common',
                name: 'KOMBOFEUER',
                description: '+2s Combo-Zeit, +5% XP ab 5x',
                category: 'common',
                icon: '🔥',
                effect: null
            },
            {
                id: 'kombofeuer_rare',
                name: 'KOMBOFEUER',
                description: '+4s Combo-Zeit, +10% XP ab 5x',
                category: 'rare',
                icon: '🔥',
                effect: null
            },
            {
                id: 'kombofeuer_epic',
                name: 'KOMBOFEUER',
                description: '+6s Combo-Zeit, +15% XP ab 5x',
                category: 'epic',
                icon: '🔥',
                effect: null
            },
            {
                id: 'kombofeuer_legendary',
                name: 'KOMBOFEUER',
                description: '+10s Combo-Zeit, +20% XP ab 5x',
                category: 'legendary',
                icon: '🔥',
                effect: null
            },
            // MÜNZMAGNET Upgrades - Coin Collection and Bonuses
            {
                id: 'muenzmagnet_common',
                name: 'MÜNZMAGNET',
                description: '50px Radius, +10% Coins',
                category: 'common',
                icon: '🧲',
                effect: null
            },
            {
                id: 'muenzmagnet_rare',
                name: 'MÜNZMAGNET',
                description: '100px Radius, +20% Coins',
                category: 'rare',
                icon: '🧲',
                effect: null
            },
            {
                id: 'muenzmagnet_epic',
                name: 'MÜNZMAGNET',
                description: '150px Radius, +35% Coins',
                category: 'epic',
                icon: '🧲',
                effect: null
            },
            {
                id: 'muenzmagnet_legendary',
                name: 'MÜNZMAGNET',
                description: '200px Radius, +50% Coins',
                category: 'legendary',
                icon: '🧲',
                effect: null
            },
            // ZEITDILATATION Upgrades - Enemy Slowdown
            {
                id: 'zeitdilatation_common',
                name: 'ZEITDILATATION',
                description: 'Gegner 5% langsamer',
                category: 'common',
                icon: '⏰',
                effect: null
            },
            {
                id: 'zeitdilatation_rare',
                name: 'ZEITDILATATION',
                description: 'Gegner 12% langsamer',
                category: 'rare',
                icon: '⏰',
                effect: null
            },
            {
                id: 'zeitdilatation_epic',
                name: 'ZEITDILATATION',
                description: 'Gegner 20% langsamer',
                category: 'epic',
                icon: '⏰',
                effect: null
            },
            {
                id: 'zeitdilatation_legendary',
                name: 'ZEITDILATATION',
                description: 'Gegner 35% langsamer',
                category: 'legendary',
                icon: '⏰',
                effect: null
            },
            // SCHUTZSCHILD Upgrades - Regenerating Shield
            {
                id: 'schutzschild_common',
                name: 'SCHUTZSCHILD',
                description: '1 Schild, 8s Regeneration',
                category: 'common',
                icon: '🛡️',
                effect: null
            },
            {
                id: 'schutzschild_rare',
                name: 'SCHUTZSCHILD',
                description: '2 Schild, 6s Regeneration',
                category: 'rare',
                icon: '🛡️',
                effect: null
            },
            {
                id: 'schutzschild_epic',
                name: 'SCHUTZSCHILD',
                description: '3 Schild, 4s Regeneration',
                category: 'epic',
                icon: '🛡️',
                effect: null
            },
            {
                id: 'schutzschild_legendary',
                name: 'SCHUTZSCHILD',
                description: '5 Schild, 2s Regeneration',
                category: 'legendary',
                icon: '🛡️',
                effect: null
            },
            // QUANTENSPRUNG Upgrades - Teleportation
            {
                id: 'quantensprung_common',
                name: 'QUANTENSPRUNG',
                description: '80px Teleport, 15s Cooldown',
                category: 'common',
                icon: '⚛️',
                effect: null
            },
            {
                id: 'quantensprung_rare',
                name: 'QUANTENSPRUNG',
                description: '120px Teleport, 12s Cooldown',
                category: 'rare',
                icon: '⚛️',
                effect: null
            },
            {
                id: 'quantensprung_epic',
                name: 'QUANTENSPRUNG',
                description: '160px Teleport, 8s Cooldown',
                category: 'epic',
                icon: '⚛️',
                effect: null
            },
            {
                id: 'quantensprung_legendary',
                name: 'QUANTENSPRUNG',
                description: '200px Teleport, 5s Cooldown',
                category: 'legendary',
                icon: '⚛️',
                effect: null
            },
            
            // GRAVITATIONSFELD upgrades - Aura that slows nearby enemies
            {
                id: 'gravitationsfeld_common',
                name: 'GRAVITATIONSFELD',
                description: 'Schwaches Gravitationsfeld',
                category: 'common',
                icon: '🌀',
                effect: null
            },
            {
                id: 'gravitationsfeld_rare',
                name: 'GRAVITATIONSFELD',
                description: 'Starkes Gravitationsfeld',
                category: 'rare',
                icon: '🌀',
                effect: null
            },
            {
                id: 'gravitationsfeld_epic',
                name: 'GRAVITATIONSFELD',
                description: 'Mächtiges Gravitationsfeld',
                category: 'epic',
                icon: '🌀',
                effect: null
            },
            {
                id: 'gravitationsfeld_legendary',
                name: 'GRAVITATIONSFELD',
                description: 'Schwarzes Loch der Verlangsamung',
                category: 'legendary',
                icon: '🌀',
                effect: null
            },
        ];
        
        // Category weights for random selection
        this.categoryWeights = {
            'common': 0.70,    // 70% chance 
            'rare': 0.24,      // 24% chance  
            'epic': 0.055,     // 5.5% chance
            'legendary': 0.005 // 0.5% chance - much rarer at start!
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
        // Define preferred upgrades with higher probability
        const preferredUpgrades = [
            'gluecks_formel_common', 'gluecks_formel_rare', 'gluecks_formel_epic', 'gluecks_formel_legendary',
            'heilungsformel_common', 'heilungsformel_rare', 'heilungsformel_epic', 'heilungsformel_legendary',
            'plus_hp_common', 'plus_hp_rare', 'plus_hp_epic', 'plus_hp_legendary',
            'lernkurve_common', 'lernkurve_rare', 'lernkurve_epic', 'lernkurve_legendary'
        ];
        
        // 40% chance to select from preferred upgrades
        if (Math.random() < 0.4) {
            const availablePreferred = this.upgradePool.filter(upgrade => 
                preferredUpgrades.includes(upgrade.id)
            );
            
            if (availablePreferred.length > 0) {
                const randomIndex = Math.floor(Math.random() * availablePreferred.length);
                return availablePreferred[randomIndex];
            }
        }
        
        // Otherwise use normal weighted selection
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
        
        // Continue to shop menu after level-up
        if (window.game && typeof window.game.showShopAfterLevelUp === 'function') {
            // Small delay before showing shop menu
            setTimeout(() => {
                window.game.showShopAfterLevelUp();
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
            
            // LERNKURVE upgrades - XP multiplier
            case 'lernkurve_common':
                this.applyXpUpgrade(0.15); // +15% XP
                break;
            case 'lernkurve_rare':
                this.applyXpUpgrade(0.25); // +25% XP
                break;
            case 'lernkurve_epic':
                this.applyXpUpgrade(0.40); // +40% XP
                break;
            case 'lernkurve_legendary':
                this.applyXpUpgrade(0.60); // +60% XP
                break;
            
            // BLITZSCHRITT upgrades - Speed enhancement
            case 'blitzschritt_common':
                this.applySpeedUpgrade(0.10); // +10% Speed
                break;
            case 'blitzschritt_rare':
                this.applySpeedUpgrade(0.18); // +18% Speed
                break;
            case 'blitzschritt_epic':
                this.applySpeedUpgrade(0.28); // +28% Speed
                break;
            case 'blitzschritt_legendary':
                this.applySpeedUpgrade(0.40); // +40% Speed
                break;
            
            // ZEITDILATATION upgrades - Enemy slowdown
            case 'zeitdilatation_common':
                this.applyTimeDialationUpgrade(0.05); // 5% enemy slowdown
                break;
            case 'zeitdilatation_rare':
                this.applyTimeDialationUpgrade(0.12); // 12% enemy slowdown
                break;
            case 'zeitdilatation_epic':
                this.applyTimeDialationUpgrade(0.20); // 20% enemy slowdown
                break;
            case 'zeitdilatation_legendary':
                this.applyTimeDialationUpgrade(0.35); // 35% enemy slowdown
                break;
            
            // SCHUTZSCHILD upgrades - Regenerating shield
            case 'schutzschild_common':
                this.applyShieldUpgrade(1, 8); // 1 shield capacity, 8s regeneration
                break;
            case 'schutzschild_rare':
                this.applyShieldUpgrade(2, 6); // 2 shield capacity, 6s regeneration
                break;
            case 'schutzschild_epic':
                this.applyShieldUpgrade(3, 4); // 3 shield capacity, 4s regeneration
                break;
            case 'schutzschild_legendary':
                this.applyShieldUpgrade(5, 2); // 5 shield capacity, 2s regeneration
                break;
            
            // KOMBOFEUER upgrades - Combo timer extension and XP bonuses
            case 'kombofeuer_common':
                this.applyComboFireUpgrade(2, [{combo: 5, bonus: 0.05}]); // +2s timer, +5% XP at 5x combo
                break;
            case 'kombofeuer_rare':
                this.applyComboFireUpgrade(4, [{combo: 5, bonus: 0.10}, {combo: 10, bonus: 0.15}]); // +4s timer, tiered bonuses
                break;
            case 'kombofeuer_epic':
                this.applyComboFireUpgrade(6, [{combo: 5, bonus: 0.15}, {combo: 10, bonus: 0.25}, {combo: 15, bonus: 0.35}]); // +6s timer, tiered bonuses
                break;
            case 'kombofeuer_legendary':
                this.applyComboFireUpgrade(10, [{combo: 5, bonus: 0.20}, {combo: 10, bonus: 0.35}, {combo: 15, bonus: 0.50}, {combo: 20, bonus: 0.75}]); // +10s timer, max bonuses
                break;
            
            // MÜNZMAGNET upgrades - Auto coin collection and coin bonus
            case 'muenzmagnet_common':
                this.applyCoinMagnetUpgrade(50, 0.10); // 50px radius, +10% coins
                break;
            case 'muenzmagnet_rare':
                this.applyCoinMagnetUpgrade(100, 0.20); // 100px radius, +20% coins
                break;
            case 'muenzmagnet_epic':
                this.applyCoinMagnetUpgrade(150, 0.35); // 150px radius, +35% coins
                break;
            case 'muenzmagnet_legendary':
                this.applyCoinMagnetUpgrade(200, 0.50); // 200px radius, +50% coins
                break;
            
            // QUANTENSPRUNG upgrades - Teleportation ability
            case 'quantensprung_common':
                this.applyQuantumJumpUpgrade(8, 0.5); // 8s cooldown, 0.5s invulnerability
                break;
            case 'quantensprung_rare':
                this.applyQuantumJumpUpgrade(6, 0.8); // 6s cooldown, 0.8s invulnerability
                break;
            case 'quantensprung_epic':
                this.applyQuantumJumpUpgrade(4, 1.2); // 4s cooldown, 1.2s invulnerability
                break;
            case 'quantensprung_legendary':
                this.applyQuantumJumpUpgrade(2, 2.0); // 2s cooldown, 2.0s invulnerability
                break;
            
            // GRAVITATIONSFELD upgrades - Aura that slows nearby enemies
            case 'gravitationsfeld_common':
                this.applyGravitationalFieldUpgrade(80, 0.15); // 80px radius, 15% slowdown
                break;
            case 'gravitationsfeld_rare':
                this.applyGravitationalFieldUpgrade(120, 0.25); // 120px radius, 25% slowdown
                break;
            case 'gravitationsfeld_epic':
                this.applyGravitationalFieldUpgrade(160, 0.40); // 160px radius, 40% slowdown
                break;
            case 'gravitationsfeld_legendary':
                this.applyGravitationalFieldUpgrade(220, 0.60); // 220px radius, 60% slowdown
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
        // Base weights - updated to match categoryWeights
        let weights = {
            'common': 0.70,
            'rare': 0.24,
            'epic': 0.055,
            'legendary': 0.005
        };
        
        // Apply luck bonuses based on stacks - INCREASED IMPACT!
        const commonBonus = this.luckBonuses.common * 0.035;  // 3.5% per stack (was 2%)
        const rareBonus = this.luckBonuses.rare * 0.065;      // 6.5% per stack (was 4%)
        const epicBonus = this.luckBonuses.epic * 0.11;       // 11% per stack (was 7%)
        const legendaryBonus = this.luckBonuses.legendary * 0.18; // 18% per stack (was 12%)
        
        // Total bonus to redistribute
        const totalBonus = commonBonus + rareBonus + epicBonus + legendaryBonus;
        
        // Redistribute weights MORE AGGRESSIVELY (take from common, give to higher rarities)
        weights.common = Math.max(0.05, weights.common - totalBonus * 0.8); // More aggressive reduction
        weights.rare = Math.min(0.55, weights.rare + (commonBonus * 0.9) + (rareBonus * 0.6)); // Higher caps
        weights.epic = Math.min(0.35, weights.epic + (commonBonus * 0.25) + (rareBonus * 0.5) + (epicBonus * 0.75)); // Better distribution
        weights.legendary = Math.min(0.30, weights.legendary + (commonBonus * 0.15) + (rareBonus * 0.25) + (epicBonus * 0.6) + (legendaryBonus * 0.9)); // Much stronger legendary boost
        
        // Normalize to ensure they sum to 1.0
        const sum = weights.common + weights.rare + weights.epic + weights.legendary;
        weights.common /= sum;
        weights.rare /= sum;
        weights.epic /= sum;
        weights.legendary /= sum;
        
        return weights;
    }
    
    /**
     * Apply XP multiplier upgrade - increases XP gained from enemies
     * @param {number} multiplierIncrease - Amount to increase XP multiplier by (e.g., 0.15 for +15%)
     */
    applyXpUpgrade(multiplierIncrease) {
        if (window.game && window.game.levelSystem) {
            // Initialize XP multiplier if it doesn't exist
            if (!window.game.levelSystem.xpMultiplier) {
                window.game.levelSystem.xpMultiplier = 1.0;
            }
            
            const oldMultiplier = window.game.levelSystem.xpMultiplier;
            window.game.levelSystem.xpMultiplier += multiplierIncrease;
            const newMultiplier = window.game.levelSystem.xpMultiplier;
            
            const percentageIncrease = Math.round(multiplierIncrease * 100);
            const totalPercentage = Math.round((newMultiplier - 1) * 100);
            
            console.log(`📚 XP Multiplier increased: ${oldMultiplier.toFixed(2)}x → ${newMultiplier.toFixed(2)}x (+${percentageIncrease}%)`);
            console.log(`📈 Total XP bonus: +${totalPercentage}%`);
            
            // Show visual feedback
            this.showUpgradeEffect(`+${percentageIncrease}% XP!`, '#FFD700');
        } else {
            console.error('❌ Cannot apply XP upgrade: window.game.levelSystem not available');
        }
    }
    
    /**
     * Apply speed multiplier upgrade - increases player movement speed
     * @param {number} multiplierIncrease - Amount to increase speed multiplier by (e.g., 0.10 for +10%)
     */
    applySpeedUpgrade(multiplierIncrease) {
        if (window.game && window.game.playerInput) {
            // Initialize speed multiplier if it doesn't exist
            if (!window.game.playerInput.speedMultiplier) {
                window.game.playerInput.speedMultiplier = 1.0;
            }
            
            // Apply the speed increase
            const oldMultiplier = window.game.playerInput.speedMultiplier;
            window.game.playerInput.speedMultiplier += multiplierIncrease;
            
            // Calculate percentage for display
            const percentageIncrease = Math.round(multiplierIncrease * 100);
            const totalPercentage = Math.round((window.game.playerInput.speedMultiplier - 1.0) * 100);
            
            console.log(`⚡ Speed increased: ${oldMultiplier.toFixed(2)}x → ${window.game.playerInput.speedMultiplier.toFixed(2)}x (+${percentageIncrease}%)`);
            console.log(`⚡ Total speed bonus: +${totalPercentage}%`);
            
            // Show visual feedback
            this.showUpgradeEffect(`+${percentageIncrease}% SPEED!`, '#00BFFF');
        } else {
            console.error('❌ Cannot apply speed upgrade: window.game.playerInput not available');
        }
    }
    
    /**
     * Apply time dilation upgrade - slows down all enemies
     * @param {number} slowdownFactor - Factor by which to slow enemies (0.05 = 5% slower)
     */
    applyTimeDialationUpgrade(slowdownFactor) {
        if (window.game) {
            // Initialize enemy slowdown multiplier if it doesn't exist
            if (!window.game.enemySlowdownMultiplier) {
                window.game.enemySlowdownMultiplier = 1.0;
            }
            
            const oldMultiplier = window.game.enemySlowdownMultiplier;
            window.game.enemySlowdownMultiplier -= slowdownFactor; // Reduce speed (slower)
            
            // Ensure minimum speed (don't completely freeze enemies)
            window.game.enemySlowdownMultiplier = Math.max(0.1, window.game.enemySlowdownMultiplier);
            
            const percentageSlowdown = Math.round(slowdownFactor * 100);
            const totalSlowdown = Math.round((1 - window.game.enemySlowdownMultiplier) * 100);
            
            console.log(`⏰ Time Dilation applied: ${oldMultiplier.toFixed(2)}x → ${window.game.enemySlowdownMultiplier.toFixed(2)}x (-${percentageSlowdown}%)`);
            console.log(`⏰ Total enemy slowdown: ${totalSlowdown}%`);
            
            // Show visual feedback
            this.showUpgradeEffect(`⏰ -${percentageSlowdown}% ENEMY SPEED!`, '#00BFFF');
        } else {
            console.error('❌ Cannot apply time dilation: window.game not available');
        }
    }
    
    /**
     * Apply shield upgrade - adds regenerating energy shield
     * @param {number} shieldCapacity - Amount of shield points to add
     * @param {number} regenerationTime - Time in seconds to regenerate shield
     */
    applyShieldUpgrade(shieldCapacity, regenerationTime) {
        if (window.game) {
            // Initialize shield system if it doesn't exist
            if (!window.game.playerShield) {
                window.game.playerShield = 0;
            }
            if (!window.game.playerMaxShield) {
                window.game.playerMaxShield = 0;
            }
            if (!window.game.shieldRegenTime) {
                window.game.shieldRegenTime = 10; // Default 10 seconds
            }
            
            const oldMaxShield = window.game.playerMaxShield;
            const oldCurrentShield = window.game.playerShield;
            
            // Increase shield capacity
            window.game.playerMaxShield += shieldCapacity;
            window.game.playerShield += shieldCapacity; // Also add to current shield
            
            // Update regeneration time (average with existing)
            if (oldMaxShield > 0) {
                window.game.shieldRegenTime = (window.game.shieldRegenTime + regenerationTime) / 2;
            } else {
                window.game.shieldRegenTime = regenerationTime;
            }
            
            console.log(`🛡️ Shield upgraded: ${oldCurrentShield}/${oldMaxShield} → ${window.game.playerShield}/${window.game.playerMaxShield}`);
            console.log(`🛡️ Shield regeneration time: ${window.game.shieldRegenTime.toFixed(1)}s`);
            
            // Start shield regeneration system if not already running
            this.startShieldRegenerationSystem();
            
            // Show visual feedback
            this.showUpgradeEffect(`🛡️ +${shieldCapacity} SHIELD!`, '#0080FF');
        } else {
            console.error('❌ Cannot apply shield upgrade: window.game not available');
        }
    }
    
    /**
     * Start the shield regeneration system timer
     */
    startShieldRegenerationSystem() {
        // Prevent multiple timers
        if (window.game.shieldRegenTimer) {
            return;
        }
        
        window.game.shieldLastDamageTime = Date.now();
        
        window.game.shieldRegenTimer = setInterval(() => {
            if (!window.game.playerShield || !window.game.playerMaxShield) {
                clearInterval(window.game.shieldRegenTimer);
                window.game.shieldRegenTimer = null;
                return;
            }
            
            // Only regenerate if shield is not at maximum and enough time has passed since last damage
            const timeSinceLastDamage = (Date.now() - (window.game.shieldLastDamageTime || 0)) / 1000;
            const regenTime = window.game.shieldRegenTime || 10;
            
            if (window.game.playerShield < window.game.playerMaxShield && timeSinceLastDamage >= regenTime) {
                window.game.playerShield = window.game.playerMaxShield;
                console.log(`🛡️ Shield regenerated to full: ${window.game.playerShield}/${window.game.playerMaxShield}`);
            }
        }, 1000); // Check every second
    }
    
    /**
     * Apply combo fire upgrade - extends combo timer and adds XP bonuses
     * @param {number} timerExtension - Seconds to extend combo timer
     * @param {Array} bonusTiers - Array of {combo, bonus} objects for XP bonuses
     */
    applyComboFireUpgrade(timerExtension, bonusTiers) {
        if (window.game) {
            // Initialize combo system properties
            if (!window.game.comboTimerExtension) {
                window.game.comboTimerExtension = 0;
            }
            if (!window.game.comboXpBonuses) {
                window.game.comboXpBonuses = [];
            }
            
            const oldExtension = window.game.comboTimerExtension;
            window.game.comboTimerExtension += timerExtension;
            
            // Add XP bonus tiers
            bonusTiers.forEach(tier => {
                const existingTier = window.game.comboXpBonuses.find(b => b.combo === tier.combo);
                if (existingTier) {
                    existingTier.bonus += tier.bonus;
                } else {
                    window.game.comboXpBonuses.push({combo: tier.combo, bonus: tier.bonus});
                }
            });
            
            // Sort bonuses by combo requirement
            window.game.comboXpBonuses.sort((a, b) => a.combo - b.combo);
            
            console.log(`🔥 Combo Fire applied: Timer +${timerExtension}s (total: ${window.game.comboTimerExtension}s)`);
            console.log(`🔥 XP Bonuses:`, window.game.comboXpBonuses);
            
            // Show visual feedback
            this.showUpgradeEffect(`🔥 +${timerExtension}s COMBO TIME!`, '#FF4500');
        } else {
            console.error('❌ Cannot apply combo fire upgrade: window.game not available');
        }
    }
    
    /**
     * Apply coin magnet upgrade - auto-collects coins and increases coin drops
     * @param {number} magnetRadius - Radius in pixels for auto-collection
     * @param {number} coinBonus - Multiplier for coin drops (0.10 = +10%)
     */
    applyCoinMagnetUpgrade(magnetRadius, coinBonus) {
        if (window.game) {
            // Initialize coin magnet properties
            if (!window.game.coinMagnetRadius) {
                window.game.coinMagnetRadius = 0;
            }
            if (!window.game.coinDropMultiplier) {
                window.game.coinDropMultiplier = 1.0;
            }
            
            const oldRadius = window.game.coinMagnetRadius;
            const oldMultiplier = window.game.coinDropMultiplier;
            
            window.game.coinMagnetRadius += magnetRadius;
            window.game.coinDropMultiplier += coinBonus;
            
            const percentageBonus = Math.round(coinBonus * 100);
            const totalBonus = Math.round((window.game.coinDropMultiplier - 1) * 100);
            
            console.log(`🧲 Coin Magnet applied: Radius ${oldRadius}px → ${window.game.coinMagnetRadius}px`);
            console.log(`🧲 Coin bonus: ${oldMultiplier.toFixed(2)}x → ${window.game.coinDropMultiplier.toFixed(2)}x (+${percentageBonus}%)`);
            console.log(`🧲 Total coin bonus: +${totalBonus}%`);
            
            // Show visual feedback
            this.showUpgradeEffect(`🧲 +${percentageBonus}% COINS!`, '#FFD700');
        } else {
            console.error('❌ Cannot apply coin magnet upgrade: window.game not available');
        }
    }
    
    /**
     * Apply quantum jump upgrade - enables teleportation with cooldown and invulnerability
     * @param {number} cooldownTime - Cooldown in seconds between jumps
     * @param {number} invulnerabilityTime - Invulnerability duration after jump
     */
    applyQuantumJumpUpgrade(cooldownTime, invulnerabilityTime) {
        if (window.game) {
            // Initialize quantum jump properties
            if (!window.game.quantumJumpEnabled) {
                window.game.quantumJumpEnabled = true;
                window.game.quantumJumpLastUsed = 0;
            }
            if (!window.game.quantumJumpCooldown) {
                window.game.quantumJumpCooldown = cooldownTime;
            } else {
                // Average cooldown times for stacking
                window.game.quantumJumpCooldown = (window.game.quantumJumpCooldown + cooldownTime) / 2;
            }
            if (!window.game.quantumJumpInvulnerability) {
                window.game.quantumJumpInvulnerability = invulnerabilityTime;
            } else {
                // Add invulnerability times for stacking
                window.game.quantumJumpInvulnerability += invulnerabilityTime * 0.5; // Diminishing returns
            }
            
            console.log(`⚡ Quantum Jump enabled: ${window.game.quantumJumpCooldown.toFixed(1)}s cooldown, ${window.game.quantumJumpInvulnerability.toFixed(1)}s invulnerability`);
            
            // Add key binding info to game and show in UI
            if (!window.game.quantumJumpKeyBound) {
                window.game.quantumJumpKeyBound = true;
                console.log(`⚡ Press SPACE to teleport to mouse cursor!`);
                
                // Show Quantum Jump key binding in UI
                const quantumJumpBinding = document.getElementById('quantumJumpBinding');
                if (quantumJumpBinding) {
                    quantumJumpBinding.style.display = 'flex';
                }
            }
            
            // Show visual feedback
            this.showUpgradeEffect(`⚡ QUANTUM JUMP!`, '#9400D3');
        } else {
            console.error('❌ Cannot apply quantum jump upgrade: window.game not available');
        }
    }
    
    /**
     * Apply gravitational field upgrade - creates aura that slows nearby enemies
     * @param {number} auraRadius - Radius in pixels for the gravitational field
     * @param {number} slowdownFactor - Factor by which to slow enemies (0.15 = 15% slower)
     */
    applyGravitationalFieldUpgrade(auraRadius, slowdownFactor) {
        if (window.game) {
            // Initialize gravitational field properties
            if (!window.game.gravitationalFieldRadius) {
                window.game.gravitationalFieldRadius = 0;
            }
            if (!window.game.gravitationalFieldSlowdown) {
                window.game.gravitationalFieldSlowdown = 0;
            }
            
            const oldRadius = window.game.gravitationalFieldRadius;
            const oldSlowdown = window.game.gravitationalFieldSlowdown;
            
            // Add to existing field (stacking)
            window.game.gravitationalFieldRadius += auraRadius;
            window.game.gravitationalFieldSlowdown += slowdownFactor;
            
            // Cap maximum slowdown at 90% to prevent complete freeze
            window.game.gravitationalFieldSlowdown = Math.min(0.90, window.game.gravitationalFieldSlowdown);
            
            const percentageSlowdown = Math.round(slowdownFactor * 100);
            const totalSlowdown = Math.round(window.game.gravitationalFieldSlowdown * 100);
            
            console.log(`🌀 Gravitational Field applied: Radius ${oldRadius}px → ${window.game.gravitationalFieldRadius}px`);
            console.log(`🌀 Slowdown: ${Math.round(oldSlowdown * 100)}% → ${totalSlowdown}% (+${percentageSlowdown}%)`);
            
            // Start gravitational field system if not already running
            this.startGravitationalFieldSystem();
            
            // Show visual feedback
            this.showUpgradeEffect(`🌀 +${percentageSlowdown}% AURA SLOWDOWN!`, '#4B0082');
        } else {
            console.error('❌ Cannot apply gravitational field upgrade: window.game not available');
        }
    }
    
    /**
     * Start the gravitational field system that continuously affects nearby enemies
     */
    startGravitationalFieldSystem() {
        // Prevent multiple timers
        if (window.game.gravitationalFieldTimer) {
            return;
        }
        
        window.game.gravitationalFieldTimer = setInterval(() => {
            if (!window.game.gravitationalFieldRadius || !window.game.gravitationalFieldSlowdown) {
                clearInterval(window.game.gravitationalFieldTimer);
                window.game.gravitationalFieldTimer = null;
                return;
            }
            
            // This system will be integrated with the enemy movement system
            // For now, we just store the field properties for the game engine to use
            console.log(`🌀 Gravitational field active: ${window.game.gravitationalFieldRadius}px radius, ${Math.round(window.game.gravitationalFieldSlowdown * 100)}% slowdown`);
            
        }, 5000); // Log status every 5 seconds for debugging
    }
    
    /**
     * Show visual feedback for upgrade effects
     * @param {string} message - Message to display
     * @param {string} color - Color of the text
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
