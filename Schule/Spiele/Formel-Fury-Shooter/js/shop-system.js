/**
 * Shop System für Formel-Fury-Shooter
 * Brotato-inspiriertes Layout mit Items, Inventar und Stats
 */

class ShopSystem {
    constructor(game) {
        this.game = game;
        this.isOpen = false;
        this.currentItems = [];
        this.playerInventory = [];
        this.maxInventorySlots = 6;
        
        // Item-Kategorien und Seltenheiten
        this.rarities = {
            common: { name: 'Gewöhnlich', color: '#ffffff', priceMultiplier: 1.0 },
            uncommon: { name: 'Ungewöhnlich', color: '#1eff00', priceMultiplier: 1.5 },
            rare: { name: 'Selten', color: '#0070dd', priceMultiplier: 2.5 },
            epic: { name: 'Episch', color: '#a335ee', priceMultiplier: 4.0 },
            legendary: { name: 'Legendär', color: '#ff8000', priceMultiplier: 6.0 }
        };
        
        // Item Placeholders - stackable items zum Sammeln
        this.itemPool = [
            {
                id: 'red_crystal',
                name: 'Roter Kristall',
                description: 'Ein mysteriöser roter Kristall',
                icon: '🔴',
                rarity: 'common',
                basePrice: 3,
                stackable: true,
                effect: { type: 'placeholder', value: 'red_crystal' }
            },
            {
                id: 'blue_orb',
                name: 'Blaue Kugel',
                description: 'Eine leuchtende blaue Energiekugel',
                icon: '🔵',
                rarity: 'uncommon',
                basePrice: 5,
                stackable: true,
                effect: { type: 'placeholder', value: 'blue_orb' }
            },
            {
                id: 'golden_gear',
                name: 'Goldenes Zahnrad',
                description: 'Ein präzise gefertigtes goldenes Zahnrad',
                icon: '⚙️',
                rarity: 'rare',
                basePrice: 8,
                stackable: true,
                effect: { type: 'placeholder', value: 'golden_gear' }
            },
            {
                id: 'purple_gem',
                name: 'Violetter Edelstein',
                description: 'Ein seltener violetter Edelstein',
                icon: '🟣',
                rarity: 'epic',
                basePrice: 12,
                stackable: true,
                effect: { type: 'placeholder', value: 'purple_gem' }
            },
            {
                id: 'rainbow_shard',
                name: 'Regenbogen-Splitter',
                description: 'Ein legendärer schimmernder Splitter',
                icon: '🌈',
                rarity: 'legendary',
                basePrice: 20,
                stackable: true,
                effect: { type: 'placeholder', value: 'rainbow_shard' }
            },
            {
                id: 'silver_coin',
                name: 'Silbermünze',
                description: 'Eine alte Silbermünze mit Gravur',
                icon: '🪙',
                rarity: 'common',
                basePrice: 2,
                stackable: true,
                effect: { type: 'placeholder', value: 'silver_coin' }
            },
            {
                id: 'magic_scroll',
                name: 'Magische Schriftrolle',
                description: 'Eine Schriftrolle mit unbekannten Symbolen',
                icon: '📜',
                rarity: 'uncommon',
                basePrice: 6,
                stackable: true,
                effect: { type: 'placeholder', value: 'magic_scroll' }
            },
            {
                id: 'ancient_key',
                name: 'Antiker Schlüssel',
                description: 'Ein alter Schlüssel aus unbekanntem Metall',
                icon: '🗝️',
                rarity: 'rare',
                basePrice: 10,
                stackable: true,
                effect: { type: 'placeholder', value: 'ancient_key' }
            },
            {
                id: 'trank_des_leipzigers_legendary',
                name: 'TRANK DES LEIPZIGERS',
                description: '+500% Münzen, +300% Speed, +500% Gegner',
                icon: '🥤',
                rarity: 'legendary',
                basePrice: 800,
                stackable: false,
                effect: null
            }
        ];
        
        this.initializeShop();
    }
    
    init() {
        // Initialize method for compatibility with game engine
        console.log('🛒 ShopSystem initialized');
        return this;
    }
    
    initializeShop() {
        // Shop wird beim ersten Öffnen initialisiert
        this.generateShopItems();
    }
    
    openShop() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.generateShopItems();
        this.updateShopDisplay();
        this.showShopUI();
        
        // Exit combat mode to prevent timeout damage
        if (this.game && this.game.combatMode) {
            this.game.exitCombatMode();
        }
        
        // Clear formula system timers to prevent timeout issues
        if (this.game && this.game.formulaSystem) {
            if (this.game.formulaSystem.nextFormulaTimeout) {
                clearTimeout(this.game.formulaSystem.nextFormulaTimeout);
                this.game.formulaSystem.nextFormulaTimeout = null;
            }
            this.game.formulaSystem.hideFormulaHUD();
        }
        
        // Spiel pausieren UND Gegner cleanup
        if (this.game && this.game.pauseGame) {
            this.game.pauseGame();
        }
        
        // Clear all enemies to prevent invisible damage
        if (this.game && this.game.enemySpawner) {
            this.clearAllEnemies();
        }
    }
    
    closeShop() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.hideShopUI();
        
        // Clear any remaining enemies before resuming
        if (this.game && this.game.enemySpawner) {
            this.clearAllEnemies();
        }
        
        // Reset damage immunity to prevent immediate collision damage
        if (this.game) {
            this.game.lastDamageTime = Date.now();
        }
        
        // Spiel fortsetzen - aber nicht automatisch
        // Das Game-Engine übernimmt die Kontrolle
    }
    
    generateShopItems() {
        this.currentItems = [];
        const currentWave = this.game?.waveSystem?.currentWave || 1;
        
        // 3 zufällige Items generieren
        for (let i = 0; i < 3; i++) {
            const randomItem = this.getRandomItem();
            const price = this.calculateItemPrice(randomItem, currentWave);
            
            this.currentItems.push({
                ...randomItem,
                finalPrice: price,
                shopSlot: i
            });
        }
    }
    
    getRandomItem() {
        // Get modified weights based on luck bonuses from level-up system
        const weights = this.getModifiedShopWeights();
        
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        let selectedRarity = 'common';
        for (const [rarity, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                selectedRarity = rarity;
                break;
            }
        }
        
        // Item mit passender Seltenheit auswählen
        const itemsOfRarity = this.itemPool.filter(item => item.rarity === selectedRarity);
        return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)] || this.itemPool[0];
    }
    
    calculateItemPrice(item, wave) {
        const rarity = this.rarities[item.rarity];
        const waveMultiplier = 1 + (wave - 1) * 0.1; // 10% Preiserhöhung pro Welle
        return Math.floor(item.basePrice * rarity.priceMultiplier * waveMultiplier);
    }
    
    buyItem(shopSlot) {
        const item = this.currentItems[shopSlot];
        if (!item) return false;
        
        // Check for infinite shop purchases cheat
        const hasInfiniteShop = this.game?.cheatFeatures?.infiniteShopPurchases;
        
        // Prüfen ob genug Münzen vorhanden (skip if cheat is active)
        const playerCoins = this.game?.currencySystem?.coins || 0;
        if (!hasInfiniteShop && playerCoins < item.finalPrice) {
            this.showFeedback('Nicht genug Münzen!', 'error');
            return false;
        }
        
        // Kauf durchführen (skip spending coins if cheat is active)
        if (!hasInfiniteShop && this.game?.currencySystem?.spendCoins) {
            this.game.currencySystem.spendCoins(item.finalPrice);
        }
        
        // Item zum Inventar hinzufügen (stackable)
        this.addItemToInventory(item);
        
        // Item-Effekt anwenden
        this.applyItemEffect(item);
        
        // Item aus Shop entfernen
        this.currentItems[shopSlot] = null;
        
        this.showFeedback(`${item.name} gekauft!`, 'success');
        this.updateShopDisplay();
        
        return true;
    }
    
    addItemToInventory(item) {
        // Prüfen ob Item stackable ist und bereits im Inventar vorhanden
        if (item.stackable) {
            const existingItem = this.playerInventory.find(invItem => invItem.id === item.id);
            if (existingItem) {
                // Stack erhöhen
                existingItem.quantity = (existingItem.quantity || 1) + 1;
                return;
            }
        }
        
        // Prüfen ob Inventar-Platz vorhanden (nur für neue Items)
        if (this.playerInventory.length >= this.maxInventorySlots) {
            this.showFeedback('Inventar ist voll!', 'error');
            return false;
        }
        
        // Neues Item hinzufügen
        this.playerInventory.push({
            ...item,
            quantity: 1,
            purchaseWave: this.game?.waveSystem?.currentWave || 1,
            purchaseTime: Date.now()
        });
        
        return true;
    }
    
    applyItemEffect(item) {
        if (!this.game) return;
        
        // Handle items by ID for special items like Trank des Leipzigers
        switch (item.id) {
            case 'trank_des_leipzigers_legendary':
                this.applyTrankDesLeipzigers();
                return;
        }
        
        // Handle regular effect-based items
        if (!item.effect) return;
        
        const { type, value } = item.effect;
        
        switch (type) {
            case 'placeholder':
                // Placeholder items haben keine Effekte - nur zum Sammeln
                console.log(`📦 Placeholder item collected: ${value}`);
                break;
                
            default:
                console.log(`⚠️ Unknown item effect type: ${type}`);
                break;
        }
    }
    
    showShopUI() {
        const shopMenu = document.getElementById('shopMenu');
        if (shopMenu) {
            shopMenu.style.display = 'flex';
        }
    }
    
    hideShopUI() {
        const shopMenu = document.getElementById('shopMenu');
        if (shopMenu) {
            shopMenu.style.display = 'none';
        }
    }
    
    updateShopDisplay() {
        this.updateShopItems();
        this.updatePlayerInventory();
        this.updatePlayerStats();
        this.updateWaveInfo();
    }
    
    updateShopItems() {
        for (let i = 0; i < 3; i++) {
            const item = this.currentItems[i];
            const itemElement = document.getElementById(`shopItem${i}`);
            
            if (itemElement && item) {
                const rarity = this.rarities[item.rarity];
                
                itemElement.innerHTML = `
                    <div class="shop-item-icon">${item.icon}</div>
                    <div class="shop-item-name" style="color: ${rarity.color}">${item.name}</div>
                    <div class="shop-item-content">
                        <div class="shop-item-description">${item.description}</div>
                        <div class="shop-item-rarity">${rarity.name}</div>
                    </div>
                    <div class="shop-item-price">💰 ${item.finalPrice}</div>
                `;
                
                itemElement.style.borderColor = rarity.color;
                itemElement.onclick = () => this.buyItem(i);
                itemElement.classList.remove('sold-out');
            } else if (itemElement) {
                itemElement.innerHTML = `
                    <div class="shop-item-sold">VERKAUFT</div>
                `;
                itemElement.style.borderColor = '#666';
                itemElement.onclick = null;
                itemElement.classList.add('sold-out');
            }
        }
    }
    
    updatePlayerInventory() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;
        
        inventoryGrid.innerHTML = '';
        
        // Inventar-Grid auf 8 Slots erweitern
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            const item = this.playerInventory[i];
            if (item) {
                const rarity = this.rarities[item.rarity];
                const quantity = item.quantity || 1;
                slot.innerHTML = `
                    <div class="inventory-item-icon">${item.icon}</div>
                    <div class="inventory-item-name">${item.name}</div>
                    ${quantity > 1 ? `<div class="inventory-item-quantity">${quantity}</div>` : ''}
                `;
                slot.style.borderColor = rarity.color;
                slot.title = `${item.name} (${quantity}x)\n${item.description}\nWelle ${item.purchaseWave}`;
            } else {
                slot.innerHTML = '<div class="inventory-empty">+</div>';
            }
            
            inventoryGrid.appendChild(slot);
        }
    }
    
    updatePlayerStats() {
        const player = this.game?.player;
        if (!player) return;
        
        // Stats aktualisieren
        const stats = [
            { id: 'shopStatHP', value: `${player.health}/${player.maxHealth}` },
            { id: 'shopStatShield', value: player.shield || 0 },
            { id: 'shopStatSpeed', value: `${Math.round((player.speedMultiplier || 1) * 100)}%` },
            { id: 'shopStatCoins', value: this.game?.currencySystem?.coins || 0 }
        ];
        
        stats.forEach(stat => {
            const element = document.getElementById(stat.id);
            if (element) {
                element.textContent = stat.value;
            }
        });
    }
    
    updateWaveInfo() {
        const currentWave = this.game?.waveSystem?.currentWave || 1;
        const waveElement = document.getElementById('shopWaveInfo');
        if (waveElement) {
            waveElement.textContent = `WELLE ${currentWave}`;
        }
    }
    
    applyTrankDesLeipzigers() {
        console.log('🥤 TRANK DES LEIPZIGERS aktiviert!');
        
        // +500% Münzen (6x Multiplier)
        if (this.game.currencySystem) {
            this.game.currencySystem.coinMultiplier = (this.game.currencySystem.coinMultiplier || 1) * 6;
            console.log('💰 Coin-Multiplier:', this.game.currencySystem.coinMultiplier);
        }
        
        // +300% Bewegungsgeschwindigkeit (4x Speed)
        if (this.game.player) {
            const oldSpeed = this.game.player.speed || this.game.player.baseSpeed || 200;
            this.game.player.speed = oldSpeed * 4;
            this.game.player.maxSpeed = this.game.player.speed;
            console.log('⚡ Player Speed:', this.game.player.speed);
        }
        
        // +500% Gegner (6x Enemy Spawn Rate)
        if (this.game.enemySpawner) {
            // Reduce spawn interval to increase spawn rate
            this.game.enemySpawner.baseSpawnInterval = (this.game.enemySpawner.baseSpawnInterval || 2000) / 6;
            this.game.enemySpawner.spawnInterval = this.game.enemySpawner.baseSpawnInterval;
            console.log('👾 Enemy Spawn Interval:', this.game.enemySpawner.spawnInterval);
        }
        
        // Alternative: Wave System Enemy Count
        if (this.game.waveSystem) {
            this.game.waveSystem.enemyMultiplier = (this.game.waveSystem.enemyMultiplier || 1) * 6;
            console.log('🌊 Wave Enemy Multiplier:', this.game.waveSystem.enemyMultiplier);
        }
        
        // Visual Feedback
        this.showItemEffect('🥤 TRANK DES LEIPZIGERS AKTIVIERT!\n💰 +500% COINS | ⚡ +300% SPEED | 👾 +500% ENEMIES', '#ff8000');
        
        // Console summary
        console.log('🥤 TRANK DES LEIPZIGERS EFFEKTE:');
        console.log('   💰 Coins: 6x Multiplier');
        console.log('   ⚡ Speed: 4x Geschwindigkeit');
        console.log('   👾 Enemies: 6x Spawn Rate');
    }
    
    getModifiedShopWeights() {
        // Base shop weights (different from level-up weights)
        let weights = {
            common: 50,
            uncommon: 30,
            rare: 15,
            epic: 4,
            legendary: 1
        };
        
        // Get luck bonuses from level-up system
        const levelUpSystem = this.game?.levelUpSystem;
        if (!levelUpSystem || !levelUpSystem.luckBonuses) {
            return weights;
        }
        
        const luckBonuses = levelUpSystem.luckBonuses;
        
        // Apply luck bonuses - same formula as level-up but adapted for shop
        const commonBonus = luckBonuses.common * 1.5;    // 1.5 per stack (less than level-up)
        const rareBonus = luckBonuses.rare * 2.5;        // 2.5 per stack
        const epicBonus = luckBonuses.epic * 4.0;        // 4.0 per stack  
        const legendaryBonus = luckBonuses.legendary * 6.0; // 6.0 per stack
        
        // Total bonus to redistribute
        const totalBonus = commonBonus + rareBonus + epicBonus + legendaryBonus;
        
        // Redistribute weights (take from common, give to higher rarities)
        weights.common = Math.max(5, weights.common - totalBonus * 0.7);
        weights.uncommon = Math.min(45, weights.uncommon + (commonBonus * 0.6) + (rareBonus * 0.3));
        weights.rare = Math.min(35, weights.rare + (commonBonus * 0.2) + (rareBonus * 0.5) + (epicBonus * 0.4));
        weights.epic = Math.min(25, weights.epic + (commonBonus * 0.1) + (rareBonus * 0.15) + (epicBonus * 0.5) + (legendaryBonus * 0.3));
        weights.legendary = Math.min(20, weights.legendary + (commonBonus * 0.1) + (rareBonus * 0.05) + (epicBonus * 0.1) + (legendaryBonus * 0.7));
        
        // Normalize to ensure they sum to 100
        const sum = Object.values(weights).reduce((a, b) => a + b, 0);
        Object.keys(weights).forEach(key => {
            weights[key] = (weights[key] / sum) * 100;
        });
        
        // Log luck influence for debugging
        if (totalBonus > 0) {
            console.log('🍀 Shop Luck Influence:', {
                totalLuckBonus: totalBonus.toFixed(1),
                weights: Object.fromEntries(Object.entries(weights).map(([k, v]) => [k, v.toFixed(1) + '%'])),
                luckStacks: luckBonuses
            });
        }
        
        return weights;
    }
    
    showItemEffect(message, color = '#00ff00') {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.innerHTML = message.replace(/\\n/g, '<br>');
        feedback.style.position = 'fixed';
        feedback.style.top = '40%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.color = color;
        feedback.style.fontSize = '24px';
        feedback.style.fontWeight = 'bold';
        feedback.style.fontFamily = 'Courier New';
        feedback.style.textShadow = `0 0 15px ${color}`;
        feedback.style.zIndex = '9999';
        feedback.style.pointerEvents = 'none';
        feedback.style.textAlign = 'center';
        feedback.style.background = 'rgba(0,0,0,0.8)';
        feedback.style.padding = '20px';
        feedback.style.borderRadius = '10px';
        feedback.style.border = `2px solid ${color}`;
        
        document.body.appendChild(feedback);
        
        // Animate and remove
        let opacity = 1;
        const fadeOut = setInterval(() => {
            opacity -= 0.05;
            feedback.style.opacity = opacity;
            if (opacity <= 0) {
                clearInterval(fadeOut);
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 4000);
    }
    
    showFeedback(message, type) {
        const feedback = document.getElementById('shopFeedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.className = `shop-feedback ${type}`;
            feedback.style.display = 'block';
            
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 2000);
        }
    }
    
    continueAfterShop() {
        this.closeShop();
        
        // Additional enemy cleanup before resume
        if (this.game && this.game.enemySpawner) {
            this.clearAllEnemies();
        }
        
        // Game-Engine übernimmt die Kontrolle für das Fortsetzen
        if (this.game?.resumeGame) {
            this.game.resumeGame();
        }
    }
    
    // Alias für den HTML-Button
    continueToNextWave() {
        this.continueAfterShop();
    }
    
    returnToMainMenu() {
        this.closeShop();
        
        // Zurück zum Hauptmenü
        if (this.game?.showMainMenu) {
            this.game.showMainMenu();
        }
    }
    
    // Debugging und Development
    addTestItem(itemId) {
        const item = this.itemPool.find(i => i.id === itemId);
        if (item && this.playerInventory.length < this.maxInventorySlots) {
            this.playerInventory.push({
                ...item,
                finalPrice: 0,
                purchaseWave: 0,
                purchaseTime: Date.now()
            });
            this.updatePlayerInventory();
        }
    }
    
    clearInventory() {
        this.playerInventory = [];
        this.updatePlayerInventory();
    }
    
    clearAllEnemies() {
        if (!this.game || !this.game.enemySpawner) return;
        
        const enemyCount = this.game.enemySpawner.enemies ? this.game.enemySpawner.enemies.length : 0;
        
        if (enemyCount > 0) {
            console.log(`🧹 Clearing ${enemyCount} enemies before shop interaction`);
            
            // Clear enemy array
            this.game.enemySpawner.enemies = [];
            
            // Reset spawn timer to prevent immediate spawning
            this.game.enemySpawner.spawnTimer = 0;
            
            // Exit combat mode if active
            if (this.game.combatMode) {
                this.game.exitCombatMode();
            }
            
            // Clear targeted enemy
            if (this.game.targetedEnemy) {
                this.game.targetedEnemy = null;
            }
        }
    }
    
    refreshShop() {
        this.generateShopItems();
        this.updateShopDisplay();
    }
}

// Export für Modulverwendung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopSystem;
}
