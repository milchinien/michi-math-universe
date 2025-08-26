/**
 * FORMEL-FURY-SHOOTER - CURRENCY SYSTEM
 * Handles in-game currency (Algebra-Coins) collection, display, and persistence
 * Phase 4.3: Currency Implementation
 */

class CurrencySystem {
    constructor() {
        // Currency state
        this.coins = 0;
        this.totalCoinsEarned = 0;
        this.sessionCoinsEarned = 0;
        
        // UI Elements
        this.currencyDisplay = null;
        this.coinValueElement = null;
        
        // Animation system
        this.coinDrops = []; // Active coin drop animations
        this.maxCoinDrops = 10; // Performance limit
        
        // Balance settings
        this.coinValues = {
            'polynom_zombie': { min: 2, max: 4 },
            'gleichungs_geist': { min: 3, max: 6 },
            'elite_mob': { min: 8, max: 12 },
            'basic': { min: 2, max: 5 }
        };
        
        // Combo bonuses
        this.comboBonuses = {
            3: 1.5,  // +50% at 3x combo
            5: 2.0,  // +100% at 5x combo
            10: 2.5, // +150% at 10x combo
            15: 3.0  // +200% at 15x combo
        };
        
        // Anti-grind mechanics
        this.sessionStartTime = Date.now();
        this.lastCoinTime = 0;
        this.grindReductionThreshold = 300000; // 5 minutes
        
        this.init();
    }
    
    init() {
        this.setupUI();
        // Skip loading coins - always start fresh
        this.coins = 0;
        this.totalCoinsEarned = 0;
        this.updateDisplay();
        console.log('💰 CurrencySystem initialized with', this.coins, 'coins (fresh start)');
    }
    
    setupUI() {
        console.log('🔧 CurrencySystem: Setting up UI...');
        
        // Try to find existing currency display
        this.currencyDisplay = document.getElementById('currencyDisplay');
        console.log('🔍 Found currencyDisplay element:', this.currencyDisplay);
        
        if (!this.currencyDisplay) {
            console.warn('⚠️ CurrencyDisplay not found in HTML, creating dynamically...');
            this.currencyDisplay = document.createElement('div');
            this.currencyDisplay.id = 'currencyDisplay';
            this.currencyDisplay.innerHTML = '💰 <span id="coinValue">0</span> Algebra-Coins';
            
            // Add CSS styles dynamically
            this.currencyDisplay.style.position = 'absolute';
            this.currencyDisplay.style.top = '40px';
            this.currencyDisplay.style.left = '10px';
            this.currencyDisplay.style.color = '#ffd700';
            this.currencyDisplay.style.fontSize = '16px';
            this.currencyDisplay.style.fontWeight = 'bold';
            this.currencyDisplay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8)';
            this.currencyDisplay.style.zIndex = '100';
            this.currencyDisplay.style.fontFamily = '"Courier New", monospace';
            
            document.body.appendChild(this.currencyDisplay);
            console.log('✅ CurrencyDisplay created and added to DOM');
        }
        
        this.coinValueElement = document.getElementById('coinValue');
        console.log('🔍 Found coinValue element:', this.coinValueElement);
        
        if (!this.coinValueElement) {
            console.error('❌ CurrencySystem: coinValue element not found even after creation!');
            return;
        }
        
        console.log('✅ CurrencySystem UI setup complete');
    }
    
    calculateCoins(enemy, combo = 0, timeTaken = 5000) {
        console.log('🔍 CurrencySystem: calculateCoins called with:', {
            enemy: enemy,
            enemyType: enemy ? enemy.type : 'undefined',
            combo: combo,
            timeTaken: timeTaken
        });
        
        if (!enemy || !enemy.type) {
            console.warn('⚠️ CurrencySystem: Invalid enemy for coin calculation', enemy);
            return 0;
        }
        
        // Get base coin value for enemy type
        const coinData = this.coinValues[enemy.type] || this.coinValues['basic'];
        console.log('💰 Using coin data for type', enemy.type, ':', coinData);
        let baseCoins = Math.floor(Math.random() * (coinData.max - coinData.min + 1)) + coinData.min;
        console.log('🎲 Base coins calculated:', baseCoins);
        
        // Apply difficulty modifier (harder formulas = more coins)
        if (enemy.assignedFormula && enemy.assignedFormula.difficulty) {
            baseCoins = Math.round(baseCoins * enemy.assignedFormula.difficulty);
        }
        
        // Apply combo bonus
        let comboMultiplier = 1.0;
        for (const [comboThreshold, multiplier] of Object.entries(this.comboBonuses)) {
            if (combo >= parseInt(comboThreshold)) {
                comboMultiplier = multiplier;
            }
        }
        
        // Speed bonus (faster answers = more coins)
        let speedMultiplier = 1.0;
        if (timeTaken < 5000) {
            speedMultiplier = 1.0 + ((5000 - timeTaken) / 5000) * 0.5; // Up to 50% bonus
        }
        
        // Anti-grind reduction
        let grindMultiplier = 1.0;
        const sessionDuration = Date.now() - this.sessionStartTime;
        if (sessionDuration > this.grindReductionThreshold) {
            grindMultiplier = Math.max(0.5, 1.0 - ((sessionDuration - this.grindReductionThreshold) / 600000) * 0.3);
        }
        
        const totalCoins = Math.round(baseCoins * comboMultiplier * speedMultiplier * grindMultiplier);
        
        console.log(`💰 Coin calculation: Base(${baseCoins}) × Combo(${comboMultiplier.toFixed(1)}) × Speed(${speedMultiplier.toFixed(1)}) × Grind(${grindMultiplier.toFixed(1)}) = ${totalCoins}`);
        
        return Math.max(1, totalCoins); // Minimum 1 coin
    }
    
    addCoins(amount) {
        if (amount <= 0) return;
        
        this.coins += amount;
        this.totalCoinsEarned += amount;
        this.sessionCoinsEarned += amount;
        this.lastCoinTime = Date.now();
        
        this.updateDisplay();
        // Skip saving coins - session only
        this.triggerCoinAnimation();
        
        console.log(`💰 +${amount} coins! Total: ${this.coins}`);
    }
    
    spendCoins(amount) {
        if (amount <= 0) return false;
        if (this.coins < amount) return false;
        
        this.coins -= amount;
        this.updateDisplay();
        // Skip saving coins - session only
        
        console.log(`💸 -${amount} coins spent! Remaining: ${this.coins}`);
        return true;
    }
    
    updateDisplay() {
        if (this.coinValueElement) {
            this.coinValueElement.textContent = this.coins.toLocaleString();
        }
    }
    
    triggerCoinAnimation() {
        if (!this.currencyDisplay) return;
        
        // Add pulse animation class
        this.currencyDisplay.classList.add('coin-gain-animation');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (this.currencyDisplay) {
                this.currencyDisplay.classList.remove('coin-gain-animation');
            }
        }, 300);
    }
    
    showCoinDrop(x, y, amount) {
        if (this.coinDrops.length >= this.maxCoinDrops) {
            // Remove oldest coin drop to prevent performance issues
            this.coinDrops.shift();
        }
        
        const coinDrop = {
            x: x,
            y: y,
            targetX: 50, // Approximate position of currency display
            targetY: 50,
            amount: amount,
            progress: 0,
            alpha: 1.0,
            scale: 1.0,
            createdTime: Date.now()
        };
        
        this.coinDrops.push(coinDrop);
        console.log(`💰 Coin drop created at (${x}, ${y}) for ${amount} coins`);
    }
    
    update(deltaTime) {
        this.updateCoinDrops(deltaTime);
    }
    
    updateCoinDrops(deltaTime) {
        for (let i = this.coinDrops.length - 1; i >= 0; i--) {
            const drop = this.coinDrops[i];
            
            // Update animation progress
            drop.progress += deltaTime * 0.002; // 2 seconds total animation
            
            if (drop.progress >= 1.0) {
                // Animation complete, remove coin drop
                this.coinDrops.splice(i, 1);
                continue;
            }
            
            // Smooth interpolation to target position
            const easeProgress = this.easeOutQuad(drop.progress);
            drop.x = drop.x + (drop.targetX - drop.x) * easeProgress * 0.1;
            drop.y = drop.y + (drop.targetY - drop.y) * easeProgress * 0.1;
            
            // Fade out near the end
            if (drop.progress > 0.8) {
                drop.alpha = Math.max(0, 1.0 - ((drop.progress - 0.8) / 0.2));
            }
            
            // Scale effect
            drop.scale = 1.0 + Math.sin(drop.progress * Math.PI) * 0.3;
        }
    }
    
    render(ctx) {
        this.renderCoinDrops(ctx);
    }
    
    renderCoinDrops(ctx) {
        for (const drop of this.coinDrops) {
            ctx.save();
            
            // Set alpha and position
            ctx.globalAlpha = drop.alpha;
            ctx.translate(drop.x, drop.y);
            ctx.scale(drop.scale, drop.scale);
            
            // Draw coin (simple golden circle)
            ctx.fillStyle = '#ffd700';
            ctx.strokeStyle = '#ffaa00';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Draw coin symbol
            ctx.fillStyle = '#ffaa00';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('$', 0, 0);
            
            // Draw amount text
            if (drop.progress < 0.5) {
                ctx.fillStyle = `rgba(255, 255, 255, ${drop.alpha})`;
                ctx.font = 'bold 12px Arial';
                ctx.fillText(`+${drop.amount}`, 0, -20);
            }
            
            ctx.restore();
        }
    }
    
    easeOutQuad(t) {
        return t * (2 - t);
    }
    
    saveCoins() {
        try {
            const currencyData = {
                coins: this.coins,
                totalCoinsEarned: this.totalCoinsEarned,
                lastSaveTime: Date.now()
            };
            localStorage.setItem('formelFuryCoins', JSON.stringify(currencyData));
        } catch (error) {
            console.error('❌ Failed to save coins:', error);
        }
    }
    
    loadCoins() {
        try {
            const savedData = localStorage.getItem('formelFuryCoins');
            console.log('🔍 Loading coins from localStorage:', savedData);
            if (savedData) {
                const currencyData = JSON.parse(savedData);
                this.coins = currencyData.coins || 0;
                this.totalCoinsEarned = currencyData.totalCoinsEarned || 0;
                console.log('✅ Loaded', this.coins, 'coins from localStorage');
            } else {
                console.log('ℹ️ No saved coins found, starting with 0');
                this.coins = 0;
                this.totalCoinsEarned = 0;
            }
        } catch (error) {
            console.error('❌ Failed to load coins:', error);
            this.coins = 0;
            this.totalCoinsEarned = 0;
        }
    }
    
    resetCoins() {
        this.coins = 0;
        this.totalCoinsEarned = 0;
        this.sessionCoinsEarned = 0;
        this.updateDisplay();
        // Skip saving coins - session only
        console.log('🔄 Currency reset completed');
    }
    
    // Getter methods for stats
    getCoins() {
        return this.coins;
    }
    
    getTotalCoinsEarned() {
        return this.totalCoinsEarned;
    }
    
    getSessionCoinsEarned() {
        return this.sessionCoinsEarned;
    }
    
    // Check for coin pickup collisions with player
    checkCoinPickup(player) {
        if (!player || !this.coinDrops) return;
        
        const pickupRadius = 30; // Pickup radius in pixels
        
        for (let i = this.coinDrops.length - 1; i >= 0; i--) {
            const coin = this.coinDrops[i];
            
            // Calculate distance between player and coin
            const dx = player.x - coin.x;
            const dy = player.y - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if player is close enough to pick up coin
            if (distance <= pickupRadius) {
                // Add coins to player's total
                this.addCoins(coin.amount);
                
                // Remove the coin drop
                this.coinDrops.splice(i, 1);
                
                console.log(`💰 Coin picked up! Amount: ${coin.amount}, Total: ${this.coins}`);
            }
        }
    }

    // Debug function to test the currency system
    testCurrencySystem() {
        console.log('🧪 Testing CurrencySystem...');
        console.log('Current coins:', this.coins);
        console.log('UI Element:', this.coinValueElement);
        
        // Add some test coins
        this.addCoins(10);
        console.log('Added 10 test coins. New total:', this.coins);
        
        // Test coin drop animation
        this.showCoinDrop(400, 300, 5);
        console.log('Test coin drop animation triggered');
        
        return this.coins;
    }
}
