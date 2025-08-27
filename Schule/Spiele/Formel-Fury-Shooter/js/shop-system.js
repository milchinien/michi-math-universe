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
        
        // Spiel pausieren
        if (this.game && this.game.pauseGame) {
            this.game.pauseGame();
        }
    }
    
    closeShop() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.hideShopUI();
        
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
        // Gewichtete Zufallsauswahl basierend auf Seltenheit
        const weights = {
            common: 50,
            uncommon: 30,
            rare: 15,
            epic: 4,
            legendary: 1
        };
        
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
        if (!item.effect || !this.game) return;
        
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
    
    continueToNextWave() {
        this.closeShop();
        
        // Game-Engine übernimmt die Kontrolle für das Fortsetzen
        if (this.game?.resumeGame) {
            this.game.resumeGame();
        }
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
    
    refreshShop() {
        this.generateShopItems();
        this.updateShopDisplay();
    }
}

// Export für Modulverwendung
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopSystem;
}
