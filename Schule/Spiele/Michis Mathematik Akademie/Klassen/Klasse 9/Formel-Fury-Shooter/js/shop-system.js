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
        
        // Functional Items Pool
        this.itemPool = [
            {
                id: 'trank_des_leipzigers_legendary',
                name: 'TRANK DES LEIPZIGERS',
                description: '+500% Münzen, +300% Speed, +500% Gegner',
                icon: '🥤',
                rarity: 'legendary',
                basePrice: 100,
                stackable: false,
                effect: null
            },
            {
                id: 'geodreieck_common',
                name: 'GEODREIECK',
                description: '+30% Bewegungsgeschwindigkeit',
                icon: '📐',
                rarity: 'common',
                basePrice: 15,
                stackable: false,
                category: 'movement',
                effect: null
            },
            {
                id: 'energieriegel_common',
                name: 'ENERGIERIEGEL',
                description: '+20% HP-Regeneration',
                icon: '🍫',
                rarity: 'common',
                basePrice: 20,
                stackable: false,
                category: 'utility',
                effect: null
            },
            {
                id: 'stabiler_stift_uncommon',
                name: 'STABILER STIFT',
                description: 'Gegner 40% langsamer beim Lösen',
                icon: '✏️',
                rarity: 'uncommon',
                basePrice: 35,
                stackable: false,
                category: 'math',
                effect: null
            },
            {
                id: 'taschenrechner_uncommon',
                name: 'TASCHENRECHNER',
                description: '+20% Zeit für Aufgaben',
                icon: '🧮',
                rarity: 'uncommon',
                basePrice: 30,
                stackable: false,
                category: 'math',
                effect: null
            },
            {
                id: 'newtons_apfel_rare',
                name: 'NEWTONS APFEL',
                description: '+20% Chance: Angreifer stirbt',
                icon: '🍎',
                rarity: 'rare',
                basePrice: 50,
                stackable: false,
                category: 'combat',
                effect: null
            },
            {
                id: 'zaubertrank_epic',
                name: 'ZAUBERTRANK',
                description: '-50% Gegnergeschwindigkeit',
                icon: '🧪',
                rarity: 'epic',
                basePrice: 75,
                stackable: false,
                category: 'combat',
                effect: null
            },
            // NEW MOVEMENT ITEMS
            {
                id: 'sprint_schuhe_common',
                name: 'SPRINT-SCHUHE',
                description: '+20% Bewegungsgeschwindigkeit',
                icon: '👟',
                rarity: 'common',
                basePrice: 75,
                stackable: false,
                category: 'movement',
                effect: null
            },
            {
                id: 'raketen_stiefel_rare',
                name: 'RAKETEN-STIEFEL',
                description: '+35% Speed + Dash-Cooldown -0.5s',
                icon: '🚀',
                rarity: 'rare',
                basePrice: 180,
                stackable: false,
                category: 'movement',
                effect: null
            },
            {
                id: 'teleport_guertel_epic',
                name: 'TELEPORT-GÜRTEL',
                description: '+50% Speed + Teleport alle 8s',
                icon: '⚡',
                rarity: 'epic',
                basePrice: 350,
                stackable: false,
                category: 'movement',
                effect: null
            },
            {
                id: 'zeit_manipulator_legendary',
                name: 'ZEIT-MANIPULATOR',
                description: '+60% Speed + Zeitlupe + Dash durch Gegner',
                icon: '⏰',
                rarity: 'legendary',
                basePrice: 650,
                stackable: false,
                category: 'movement',
                effect: null
            },
            // NEW COMBAT ITEMS
            {
                id: 'panzer_weste_common',
                name: 'PANZER-WESTE',
                description: '+25% HP + Knockback-Resistenz',
                icon: '🛡️',
                rarity: 'common',
                basePrice: 80,
                stackable: false,
                category: 'combat',
                effect: null
            },
            {
                id: 'blitz_kanone_rare',
                name: 'BLITZ-KANONE',
                description: '+40% Projektilspeed + Betäubt Gegner 1s',
                icon: '⚡',
                rarity: 'rare',
                basePrice: 200,
                stackable: false,
                category: 'combat',
                effect: null
            },
            {
                id: 'berserker_maske_epic',
                name: 'BERSERKER-MASKE',
                description: '+50% Speed bei <30% HP + Unverwundbarkeit 2s',
                icon: '😤',
                rarity: 'epic',
                basePrice: 380,
                stackable: false,
                category: 'combat',
                effect: null
            },
            {
                id: 'omega_destruktor_legendary',
                name: 'OMEGA-DESTRUKTOR',
                description: 'Durchschlag + Explosion + Betäubt alle 3s',
                icon: '💥',
                rarity: 'legendary',
                basePrice: 750,
                stackable: false,
                category: 'combat',
                effect: null
            },
            // NEW MATH ITEMS
            {
                id: 'formel_brille_common',
                name: 'FORMEL-BRILLE',
                description: '+1 Sekunde Formel-Eingabezeit',
                icon: '🤓',
                rarity: 'common',
                basePrice: 70,
                stackable: false,
                category: 'math',
                effect: null
            },
            {
                id: 'algebra_ring_rare',
                name: 'ALGEBRA-RING',
                description: '+25% Score + Zeigt Lösungshinweise',
                icon: '💍',
                rarity: 'rare',
                basePrice: 160,
                stackable: false,
                category: 'math',
                effect: null
            },
            {
                id: 'mathematik_krone_epic',
                name: 'MATHEMATIK-KRONE',
                description: '+50% Score + Combo-Zeit +3s + Fehlerschutz',
                icon: '👑',
                rarity: 'epic',
                basePrice: 320,
                stackable: false,
                category: 'math',
                effect: null
            },
            {
                id: 'euler_artefakt_legendary',
                name: 'EULER-ARTEFAKT',
                description: '+100% Score + Auto-Solve 1/Welle + Zeitbonus',
                icon: '🔮',
                rarity: 'legendary',
                basePrice: 800,
                stackable: false,
                category: 'math',
                effect: null
            },
            // NEW UTILITY ITEMS
            {
                id: 'gluecks_muenze_common',
                name: 'GLÜCKS-MÜNZE',
                description: '+15% Coin-Drop-Rate',
                icon: '🪙',
                rarity: 'common',
                basePrice: 60,
                stackable: false,
                category: 'utility',
                effect: null
            },
            {
                id: 'magnet_handschuh_rare',
                name: 'MAGNET-HANDSCHUH',
                description: '+30% Coins + Auto-Sammeln 2x Radius',
                icon: '🧲',
                rarity: 'rare',
                basePrice: 150,
                stackable: false,
                category: 'utility',
                effect: null
            },
            {
                id: 'phoenix_feder_epic',
                name: 'PHOENIX-FEDER',
                description: '1x Wiederbelebung + 50% HP + 5s Schutz',
                icon: '🪶',
                rarity: 'epic',
                basePrice: 400,
                stackable: false,
                category: 'utility',
                effect: null
            },
            {
                id: 'chaos_wuerfel_legendary',
                name: 'CHAOS-WÜRFEL',
                description: 'Zufälliger Mega-Buff jede Welle',
                icon: '🎲',
                rarity: 'legendary',
                basePrice: 900,
                stackable: false,
                category: 'utility',
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
        
        // Trigger screen effects for item purchase
        if (this.game?.gameEngine?.screenEffects) {
            this.game.gameEngine.screenEffects.onItemPurchase();
        }
        
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
            case 'geodreieck_common':
                this.applyGeodreiecksEffect();
                return;
            case 'energieriegel_common':
                this.applyEnergieriegelEffect();
                return;
            case 'stabiler_stift_uncommon':
                this.applyStabilerStiftEffect();
                return;
            case 'taschenrechner_uncommon':
                this.applyTaschenrechnerEffect();
                return;
            case 'newtons_apfel_rare':
                this.applyNewtonsApfelEffect();
                return;
            case 'zaubertrank_epic':
                this.applyZaubertrankEffect();
                return;
            // NEW MOVEMENT ITEMS
            case 'sprint_schuhe_common':
                this.applySprintSchuheEffect();
                return;
            case 'raketen_stiefel_rare':
                this.applyRaketenStiefelEffect();
                return;
            case 'teleport_guertel_epic':
                this.applyTeleportGuertelEffect();
                return;
            case 'zeit_manipulator_legendary':
                this.applyZeitManipulatorEffect();
                return;
            // NEW COMBAT ITEMS
            case 'panzer_weste_common':
                this.applyPanzerWesteEffect();
                return;
            case 'blitz_kanone_rare':
                this.applyBlitzKanoneEffect();
                return;
            case 'berserker_maske_epic':
                this.applyBerserkerMaskeEffect();
                return;
            case 'omega_destruktor_legendary':
                this.applyOmegaDestruktorEffect();
                return;
            // NEW MATH ITEMS
            case 'formel_brille_common':
                this.applyFormelBrilleEffect();
                return;
            case 'algebra_ring_rare':
                this.applyAlgebraRingEffect();
                return;
            case 'mathematik_krone_epic':
                this.applyMathematikKroneEffect();
                return;
            case 'euler_artefakt_legendary':
                this.applyEulerArtefaktEffect();
                return;
            // NEW UTILITY ITEMS
            case 'gluecks_muenze_common':
                this.applyGluecksMuenzeEffect();
                return;
            case 'magnet_handschuh_rare':
                this.applyMagnetHandschuhEffect();
                return;
            case 'phoenix_feder_epic':
                this.applyPhoenixFederEffect();
                return;
            case 'chaos_wuerfel_legendary':
                this.applyChaosWuerfelEffect();
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
    
    applyGeodreiecksEffect() {
        console.log('📐 GEODREIECK aktiviert!');
        
        // +30% Bewegungsgeschwindigkeit
        if (this.game.player) {
            const currentSpeed = this.game.player.speed || this.game.player.baseSpeed || 200;
            const speedIncrease = currentSpeed * 0.30; // 30% increase
            this.game.player.speed = currentSpeed + speedIncrease;
            this.game.player.maxSpeed = this.game.player.speed;
            
            console.log(`⚡ Speed erhöht um 30%: ${Math.round(currentSpeed)} → ${Math.round(this.game.player.speed)}`);
        }
        
        // Visual Feedback
        this.showItemEffect('📐 GEODREIECK AKTIVIERT!\n⚡ +30% BEWEGUNGSGESCHWINDIGKEIT', '#00ff00');
        
        console.log('📐 GEODREIECK EFFEKT: +30% Bewegungsgeschwindigkeit');
    }
    
    applyEnergieriegelEffect() {
        console.log('🍫 ENERGIERIEGEL aktiviert!');
        
        // +20% HP-Regeneration
        if (this.game.player) {
            // Initialize HP regeneration if not exists
            if (!this.game.player.hpRegenRate) {
                this.game.player.hpRegenRate = 0; // Base regen rate
            }
            
            // Add 20% HP regeneration (0.2 HP per second)
            this.game.player.hpRegenRate += 0.2;
            
            // Start HP regeneration if not already running
            if (!this.game.player.hpRegenInterval) {
                this.game.player.hpRegenInterval = setInterval(() => {
                    if (this.game.player && this.game.player.health < this.game.player.maxHealth) {
                        this.game.player.health = Math.min(
                            this.game.player.maxHealth, 
                            this.game.player.health + this.game.player.hpRegenRate
                        );
                    }
                }, 1000); // Every second
            }
            
            console.log(`💚 HP-Regeneration erhöht um 20%: ${this.game.player.hpRegenRate} HP/s`);
        }
        
        // Visual Feedback
        this.showItemEffect('🍫 ENERGIERIEGEL AKTIVIERT!\n💚 +20% HP-REGENERATION', '#00ff00');
        
        console.log('🍫 ENERGIERIEGEL EFFEKT: +20% HP-Regeneration');
    }
    
    applyStabilerStiftEffect() {
        console.log('✏️ STABILER STIFT aktiviert!');
        
        // Gegner 40% langsamer beim Lösen
        if (this.game.formulaSystem) {
            // Initialize enemy slowdown modifier if not exists
            if (!this.game.formulaSystem.enemySlowdownModifier) {
                this.game.formulaSystem.enemySlowdownModifier = 1.0;
            }
            
            // Apply 40% slowdown (multiply by 0.6 = 60% speed = 40% slower)
            this.game.formulaSystem.enemySlowdownModifier *= 0.6;
            
            console.log(`🐌 Gegner-Geschwindigkeit reduziert: ${Math.round((1 - this.game.formulaSystem.enemySlowdownModifier) * 100)}% langsamer`);
        }
        
        // Visual Feedback
        this.showItemEffect('✏️ STABILER STIFT AKTIVIERT!\n🐌 GEGNER 40% LANGSAMER', '#00ff00');
        
        console.log('✏️ STABILER STIFT EFFEKT: Gegner 40% langsamer beim Lösen');
    }
    
    applyTaschenrechnerEffect() {
        console.log('🧮 TASCHENRECHNER aktiviert!');
        
        // +20% Zeit für Aufgaben
        if (this.game.formulaSystem) {
            // Initialize time bonus if not exists
            if (!this.game.formulaSystem.timeBonusMultiplier) {
                this.game.formulaSystem.timeBonusMultiplier = 1.0;
            }
            
            // Add 20% more time (multiply by 1.2)
            this.game.formulaSystem.timeBonusMultiplier *= 1.2;
            
            console.log(`⏰ Formel-Zeit erhöht um 20%: ${Math.round(this.game.formulaSystem.timeBonusMultiplier * 100)}% der Basis-Zeit`);
        }
        
        // Visual Feedback
        this.showItemEffect('🧮 TASCHENRECHNER AKTIVIERT!\n⏰ +20% ZEIT FÜR AUFGABEN', '#00ff00');
        
        console.log('🧮 TASCHENRECHNER EFFEKT: +20% Zeit für Aufgaben');
    }
    
    applyNewtonsApfelEffect() {
        console.log('🍎 NEWTONS APFEL aktiviert!');
        
        // +20% Chance: Angreifer stirbt
        if (this.game.player) {
            // Initialize counter-attack chance if not exists
            if (!this.game.player.counterAttackChance) {
                this.game.player.counterAttackChance = 0;
            }
            
            // Add 20% counter-attack chance
            this.game.player.counterAttackChance += 0.2;
            
            console.log(`⚡ Gegen-Angriff Chance: ${Math.round(this.game.player.counterAttackChance * 100)}%`);
        }
        
        // Visual Feedback
        this.showItemEffect('🍎 NEWTONS APFEL AKTIVIERT!\n⚡ +20% CHANCE: ANGREIFER STIRBT', '#ff6600');
        
        console.log('🍎 NEWTONS APFEL EFFEKT: +20% Chance dass Angreifer stirbt');
    }
    
    applyZaubertrankEffect() {
        console.log('🧪 ZAUBERTRANK aktiviert!');
        
        // -50% Gegnergeschwindigkeit
        if (this.game.enemySystem) {
            // Initialize global enemy speed modifier if not exists
            if (!this.game.enemySystem.globalSpeedModifier) {
                this.game.enemySystem.globalSpeedModifier = 1.0;
            }
            
            // Reduce enemy speed by 50% (multiply by 0.5)
            this.game.enemySystem.globalSpeedModifier *= 0.5;
            
            console.log(`🐌 Globale Gegner-Geschwindigkeit: ${Math.round(this.game.enemySystem.globalSpeedModifier * 100)}%`);
        }
        
        // Alternative: Apply to all existing enemies
        if (this.game.enemies && Array.isArray(this.game.enemies)) {
            this.game.enemies.forEach(enemy => {
                if (enemy.speed) {
                    enemy.speed *= 0.5;
                }
                if (enemy.maxSpeed) {
                    enemy.maxSpeed *= 0.5;
                }
            });
            console.log(`🐌 ${this.game.enemies.length} aktive Gegner verlangsamt`);
        }
        
        // Visual Feedback
        this.showItemEffect('🧪 ZAUBERTRANK AKTIVIERT!\n🐌 -50% GEGNERGESCHWINDIGKEIT', '#9966ff');
        
        console.log('🧪 ZAUBERTRANK EFFEKT: -50% Gegnergeschwindigkeit');
    }
    
    // NEW MOVEMENT ITEM EFFECTS
    applySprintSchuheEffect() {
        console.log('👟 SPRINT-SCHUHE aktiviert!');
        
        // +20% Bewegungsgeschwindigkeit
        if (this.game.player) {
            const currentSpeed = this.game.player.speed || this.game.player.baseSpeed || 200;
            const speedIncrease = currentSpeed * 0.20;
            this.game.player.speed = currentSpeed + speedIncrease;
            this.game.player.maxSpeed = this.game.player.speed;
            
            console.log(`⚡ Speed erhöht um 20%: ${Math.round(currentSpeed)} → ${Math.round(this.game.player.speed)}`);
        }
        
        this.showItemEffect('👟 SPRINT-SCHUHE AKTIVIERT!\n⚡ +20% BEWEGUNGSGESCHWINDIGKEIT', '#00ff00');
    }
    
    applyRaketenStiefelEffect() {
        console.log('🚀 RAKETEN-STIEFEL aktiviert!');
        
        // +35% Bewegungsgeschwindigkeit
        if (this.game.player) {
            const currentSpeed = this.game.player.speed || this.game.player.baseSpeed || 200;
            const speedIncrease = currentSpeed * 0.35;
            this.game.player.speed = currentSpeed + speedIncrease;
            this.game.player.maxSpeed = this.game.player.speed;
            
            console.log(`⚡ Speed erhöht um 35%: ${Math.round(currentSpeed)} → ${Math.round(this.game.player.speed)}`);
        }
        
        // Dash-Cooldown -0.5s
        if (this.game.player) {
            this.game.player.dashCooldown = Math.max(1000, (this.game.player.dashCooldown || 3000) - 500);
            console.log(`🏃 Dash-Cooldown reduziert: ${this.game.player.dashCooldown}ms`);
        }
        
        this.showItemEffect('🚀 RAKETEN-STIEFEL AKTIVIERT!\n⚡ +35% SPEED | 🏃 -0.5s DASH-COOLDOWN', '#0070dd');
    }
    
    applyTeleportGuertelEffect() {
        console.log('⚡ TELEPORT-GÜRTEL aktiviert!');
        
        // +50% Bewegungsgeschwindigkeit
        if (this.game.player) {
            const currentSpeed = this.game.player.speed || this.game.player.baseSpeed || 200;
            const speedIncrease = currentSpeed * 0.50;
            this.game.player.speed = currentSpeed + speedIncrease;
            this.game.player.maxSpeed = this.game.player.speed;
            
            console.log(`⚡ Speed erhöht um 50%: ${Math.round(currentSpeed)} → ${Math.round(this.game.player.speed)}`);
        }
        
        // Teleport alle 8 Sekunden
        if (this.game.player) {
            this.game.player.teleportCooldown = 8000;
            this.game.player.canTeleport = true;
            this.game.player.lastTeleport = 0;
            console.log('🌀 Teleport-Fähigkeit aktiviert (8s Cooldown)');
        }
        
        this.showItemEffect('⚡ TELEPORT-GÜRTEL AKTIVIERT!\n⚡ +50% SPEED | 🌀 TELEPORT ALLE 8s', '#a335ee');
    }
    
    applyZeitManipulatorEffect() {
        console.log('⏰ ZEIT-MANIPULATOR aktiviert!');
        
        // +60% Bewegungsgeschwindigkeit
        if (this.game.player) {
            const currentSpeed = this.game.player.speed || this.game.player.baseSpeed || 200;
            const speedIncrease = currentSpeed * 0.60;
            this.game.player.speed = currentSpeed + speedIncrease;
            this.game.player.maxSpeed = this.game.player.speed;
            
            console.log(`⚡ Speed erhöht um 60%: ${Math.round(currentSpeed)} → ${Math.round(this.game.player.speed)}`);
        }
        
        // Zeitlupe-Modus alle 15 Sekunden
        if (this.game.player) {
            this.game.player.slowMotionCooldown = 15000;
            this.game.player.slowMotionDuration = 3000;
            this.game.player.canSlowMotion = true;
            this.game.player.lastSlowMotion = 0;
            console.log('⏱️ Zeitlupe-Modus aktiviert (3s alle 15s)');
        }
        
        // Dash durch Gegner
        if (this.game.player) {
            this.game.player.dashThroughEnemies = true;
            console.log('👻 Dash durch Gegner aktiviert');
        }
        
        this.showItemEffect('⏰ ZEIT-MANIPULATOR AKTIVIERT!\n⚡ +60% SPEED | ⏱️ ZEITLUPE | 👻 DASH DURCH GEGNER', '#ff8000');
    }
    
    // NEW COMBAT ITEM EFFECTS
    applyPanzerWesteEffect() {
        console.log('🛡️ PANZER-WESTE aktiviert!');
        
        // +25% HP
        if (this.game.player) {
            const hpIncrease = (this.game.player.maxHealth || 100) * 0.25;
            this.game.player.maxHealth = (this.game.player.maxHealth || 100) + hpIncrease;
            this.game.player.health = (this.game.player.health || 100) + hpIncrease;
            
            console.log(`💚 HP erhöht um 25%: ${Math.round(this.game.player.health)}/${Math.round(this.game.player.maxHealth)}`);
        }
        
        // Knockback-Resistenz
        if (this.game.player) {
            this.game.player.knockbackResistance = (this.game.player.knockbackResistance || 0) + 0.8;
            console.log('🛡️ Knockback-Resistenz aktiviert');
        }
        
        this.showItemEffect('🛡️ PANZER-WESTE AKTIVIERT!\n💚 +25% HP | 🛡️ KNOCKBACK-RESISTENZ', '#00ff00');
    }
    
    applyBlitzKanoneEffect() {
        console.log('⚡ BLITZ-KANONE aktiviert!');
        
        // +40% Projektilgeschwindigkeit
        if (this.game.player) {
            this.game.player.projectileSpeedMultiplier = (this.game.player.projectileSpeedMultiplier || 1) * 1.4;
            console.log(`🚀 Projektilgeschwindigkeit: ${Math.round(this.game.player.projectileSpeedMultiplier * 100)}%`);
        }
        
        // Betäubt Gegner für 1s bei Treffer
        if (this.game.player) {
            this.game.player.stunOnHit = true;
            this.game.player.stunDuration = 1000;
            console.log('⚡ Betäubung bei Treffer aktiviert (1s)');
        }
        
        this.showItemEffect('⚡ BLITZ-KANONE AKTIVIERT!\n🚀 +40% PROJEKTILSPEED | ⚡ BETÄUBUNG 1s', '#0070dd');
    }
    
    applyBerserkerMaskeEffect() {
        console.log('😤 BERSERKER-MASKE aktiviert!');
        
        // +50% Bewegungsgeschwindigkeit bei <30% HP
        if (this.game.player) {
            this.game.player.berserkerMode = true;
            this.game.player.berserkerSpeedBonus = 0.5;
            this.game.player.berserkerThreshold = 0.3;
            console.log('😤 Berserker-Modus aktiviert (+50% Speed bei <30% HP)');
        }
        
        // Unverwundbarkeit 2s nach Treffer
        if (this.game.player) {
            this.game.player.invulnerabilityOnHit = true;
            this.game.player.invulnerabilityDuration = 2000;
            console.log('🛡️ Unverwundbarkeit nach Treffer aktiviert (2s)');
        }
        
        this.showItemEffect('😤 BERSERKER-MASKE AKTIVIERT!\n😤 +50% SPEED BEI LOW HP | 🛡️ UNVERWUNDBARKEIT 2s', '#a335ee');
    }
    
    applyOmegaDestruktorEffect() {
        console.log('💥 OMEGA-DESTRUKTOR aktiviert!');
        
        // Projektile durchdringen alle Gegner
        if (this.game.player) {
            this.game.player.projectilePiercing = true;
            console.log('🎯 Projektil-Durchschlag aktiviert');
        }
        
        // Explosionsradius
        if (this.game.player) {
            this.game.player.explosionRadius = 100;
            this.game.player.explosionDamage = true;
            console.log('💥 Explosionsradius aktiviert (100px)');
        }
        
        // Betäubt alle Gegner 3s
        if (this.game.player) {
            this.game.player.massStunOnHit = true;
            this.game.player.massStunDuration = 3000;
            console.log('⚡ Massen-Betäubung aktiviert (3s)');
        }
        
        this.showItemEffect('💥 OMEGA-DESTRUKTOR AKTIVIERT!\n🎯 DURCHSCHLAG | 💥 EXPLOSION | ⚡ MASSEN-BETÄUBUNG 3s', '#ff8000');
    }
    
    // NEW MATH ITEM EFFECTS
    applyFormelBrilleEffect() {
        console.log('🤓 FORMEL-BRILLE aktiviert!');
        
        // +1 Sekunde Formel-Eingabezeit
        if (this.game.formulaSystem) {
            this.game.formulaSystem.timeBonusMultiplier = (this.game.formulaSystem.timeBonusMultiplier || 1) + 0.2;
            console.log(`⏰ Formel-Zeit erhöht: ${Math.round(this.game.formulaSystem.timeBonusMultiplier * 100)}%`);
        }
        
        this.showItemEffect('🤓 FORMEL-BRILLE AKTIVIERT!\n⏰ +1 SEKUNDE FORMEL-EINGABEZEIT', '#00ff00');
    }
    
    applyAlgebraRingEffect() {
        console.log('💍 ALGEBRA-RING aktiviert!');
        
        // +25% Score-Bonus
        if (this.game.formulaSystem) {
            this.game.formulaSystem.scoreMultiplier = (this.game.formulaSystem.scoreMultiplier || 1) * 1.25;
            console.log(`📈 Score-Multiplier: ${Math.round(this.game.formulaSystem.scoreMultiplier * 100)}%`);
        }
        
        // Zeigt Lösungshinweise
        if (this.game.formulaSystem) {
            this.game.formulaSystem.showHints = true;
            this.game.formulaSystem.hintLevel = 1;
            console.log('💡 Lösungshinweise aktiviert');
        }
        
        this.showItemEffect('💍 ALGEBRA-RING AKTIVIERT!\n📈 +25% SCORE | 💡 LÖSUNGSHINWEISE', '#0070dd');
    }
    
    applyMathematikKroneEffect() {
        console.log('👑 MATHEMATIK-KRONE aktiviert!');
        
        // +50% Score-Bonus
        if (this.game.formulaSystem) {
            this.game.formulaSystem.scoreMultiplier = (this.game.formulaSystem.scoreMultiplier || 1) * 1.5;
            console.log(`📈 Score-Multiplier: ${Math.round(this.game.formulaSystem.scoreMultiplier * 100)}%`);
        }
        
        // Combo-Zeit +3s
        if (this.game.formulaSystem) {
            this.game.formulaSystem.comboTimeLimit = (this.game.formulaSystem.comboTimeLimit || 10000) + 3000;
            console.log(`🎯 Combo-Zeit: ${this.game.formulaSystem.comboTimeLimit / 1000}s`);
        }
        
        // Falsche Antworten -50% Schaden
        if (this.game.formulaSystem) {
            this.game.formulaSystem.errorDamageReduction = 0.5;
            console.log('🛡️ Fehler-Schadenreduktion: 50%');
        }
        
        this.showItemEffect('👑 MATHEMATIK-KRONE AKTIVIERT!\n📈 +50% SCORE | 🎯 +3s COMBO | 🛡️ FEHLERSCHUTZ', '#a335ee');
    }
    
    applyEulerArtefaktEffect() {
        console.log('🔮 EULER-ARTEFAKT aktiviert!');
        
        // +100% Score-Bonus
        if (this.game.formulaSystem) {
            this.game.formulaSystem.scoreMultiplier = (this.game.formulaSystem.scoreMultiplier || 1) * 2;
            console.log(`📈 Score-Multiplier: ${Math.round(this.game.formulaSystem.scoreMultiplier * 100)}%`);
        }
        
        // Auto-Solve 1 Formel pro Welle
        if (this.game.formulaSystem) {
            this.game.formulaSystem.autoSolvePerWave = 1;
            this.game.formulaSystem.autoSolveUsed = 0;
            console.log('🤖 Auto-Solve aktiviert (1 pro Welle)');
        }
        
        // Perfekte Combos = Zeitbonus
        if (this.game.formulaSystem) {
            this.game.formulaSystem.perfectComboTimeBonus = true;
            this.game.formulaSystem.perfectComboBonusTime = 2000;
            console.log('⏰ Perfekte Combo Zeitbonus aktiviert (+2s)');
        }
        
        this.showItemEffect('🔮 EULER-ARTEFAKT AKTIVIERT!\n📈 +100% SCORE | 🤖 AUTO-SOLVE 1/WELLE | ⏰ ZEITBONUS', '#ff8000');
    }
    
    // NEW UTILITY ITEM EFFECTS
    applyGluecksMuenzeEffect() {
        console.log('🪙 GLÜCKS-MÜNZE aktiviert!');
        
        // +15% Coin-Drop-Rate
        if (this.game.currencySystem) {
            this.game.currencySystem.coinDropMultiplier = (this.game.currencySystem.coinDropMultiplier || 1) * 1.15;
            console.log(`💰 Coin-Drop-Rate: ${Math.round(this.game.currencySystem.coinDropMultiplier * 100)}%`);
        }
        
        this.showItemEffect('🪙 GLÜCKS-MÜNZE AKTIVIERT!\n💰 +15% COIN-DROP-RATE', '#00ff00');
    }
    
    applyMagnetHandschuhEffect() {
        console.log('🧲 MAGNET-HANDSCHUH aktiviert!');
        
        // +30% Coin-Drop-Rate
        if (this.game.currencySystem) {
            this.game.currencySystem.coinDropMultiplier = (this.game.currencySystem.coinDropMultiplier || 1) * 1.3;
            console.log(`💰 Coin-Drop-Rate: ${Math.round(this.game.currencySystem.coinDropMultiplier * 100)}%`);
        }
        
        // Auto-Sammeln in 2x Radius
        if (this.game.player) {
            this.game.player.autoCollectRadius = (this.game.player.autoCollectRadius || 50) * 2;
            this.game.player.autoCollectEnabled = true;
            console.log(`🧲 Auto-Sammeln Radius: ${this.game.player.autoCollectRadius}px`);
        }
        
        this.showItemEffect('🧲 MAGNET-HANDSCHUH AKTIVIERT!\n💰 +30% COINS | 🧲 AUTO-SAMMELN 2x RADIUS', '#0070dd');
    }
    
    applyPhoenixFederEffect() {
        console.log('🪶 PHOENIX-FEDER aktiviert!');
        
        // 1x Wiederbelebung pro Run
        if (this.game.player) {
            this.game.player.reviveCount = (this.game.player.reviveCount || 0) + 1;
            this.game.player.reviveHealthPercent = 0.5;
            this.game.player.reviveInvulnerabilityTime = 5000;
            console.log('🔄 Wiederbelebung aktiviert (1x, 50% HP, 5s Schutz)');
        }
        
        this.showItemEffect('🪶 PHOENIX-FEDER AKTIVIERT!\n🔄 1x WIEDERBELEBUNG | 💚 50% HP | 🛡️ 5s SCHUTZ', '#a335ee');
    }
    
    applyChaosWuerfelEffect() {
        console.log('🎲 CHAOS-WÜRFEL aktiviert!');
        
        // Zufälliger Mega-Buff jede Welle
        if (this.game.player) {
            this.game.player.chaosWuerfelActive = true;
            this.game.player.chaosBuffs = [
                { name: 'Speed-Chaos', effect: 'speed', multiplier: 2 },
                { name: 'Damage-Chaos', effect: 'combat', multiplier: 2 },
                { name: 'Coin-Chaos', effect: 'coins', multiplier: 3 },
                { name: 'Time-Chaos', effect: 'time', bonus: 5000 },
                { name: 'Shield-Chaos', effect: 'invulnerability', duration: 10000 },
                { name: 'Score-Chaos', effect: 'score', multiplier: 4 }
            ];
            console.log('🎲 Chaos-Würfel System aktiviert (Zufälliger Buff jede Welle)');
        }
        
        // Aktiviere ersten zufälligen Buff sofort
        this.triggerChaosWuerfelBuff();
        
        this.showItemEffect('🎲 CHAOS-WÜRFEL AKTIVIERT!\n🎲 ZUFÄLLIGER MEGA-BUFF JEDE WELLE | 🌀 UNVORHERSAGBARE BONI', '#ff8000');
    }
    
    triggerChaosWuerfelBuff() {
        if (!this.game.player?.chaosWuerfelActive) return;
        
        const buffs = this.game.player.chaosBuffs;
        const randomBuff = buffs[Math.floor(Math.random() * buffs.length)];
        
        console.log(`🎲 Chaos-Würfel Buff: ${randomBuff.name}`);
        
        switch (randomBuff.effect) {
            case 'speed':
                if (this.game.player) {
                    this.game.player.speed *= randomBuff.multiplier;
                    this.showItemEffect(`🎲 ${randomBuff.name}!\n⚡ +${(randomBuff.multiplier - 1) * 100}% SPEED`, '#ff6600');
                }
                break;
            case 'combat':
                if (this.game.player) {
                    this.game.player.projectilePiercing = true;
                    this.game.player.massStunOnHit = true;
                    this.showItemEffect(`🎲 ${randomBuff.name}!\n💥 DURCHSCHLAG + BETÄUBUNG`, '#ff6600');
                }
                break;
            case 'coins':
                if (this.game.currencySystem) {
                    this.game.currencySystem.coinDropMultiplier *= randomBuff.multiplier;
                    this.showItemEffect(`🎲 ${randomBuff.name}!\n💰 +${(randomBuff.multiplier - 1) * 100}% COINS`, '#ff6600');
                }
                break;
            case 'time':
                if (this.game.formulaSystem) {
                    this.game.formulaSystem.timeBonusMultiplier += randomBuff.bonus / 1000;
                    this.showItemEffect(`🎲 ${randomBuff.name}!\n⏰ +${randomBuff.bonus / 1000}s FORMEL-ZEIT`, '#ff6600');
                }
                break;
            case 'invulnerability':
                if (this.game.player) {
                    this.game.player.temporaryInvulnerability = Date.now() + randomBuff.duration;
                    this.showItemEffect(`🎲 ${randomBuff.name}!\n🛡️ ${randomBuff.duration / 1000}s UNVERWUNDBAR`, '#ff6600');
                }
                break;
            case 'score':
                if (this.game.formulaSystem) {
                    this.game.formulaSystem.scoreMultiplier *= randomBuff.multiplier;
                    this.showItemEffect(`🎲 ${randomBuff.name}!\n📈 +${(randomBuff.multiplier - 1) * 100}% SCORE`, '#ff6600');
                }
                break;
        }
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
