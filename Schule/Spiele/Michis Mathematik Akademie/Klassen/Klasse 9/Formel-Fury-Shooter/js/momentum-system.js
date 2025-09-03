/**
 * Momentum System - Phase 2, Step 2.3
 * Links movement speed with gameplay mechanics for strategic movement
 */

class MomentumSystem {
    constructor(player, canvas, particleSystem, audioManager, screenEffects) {
        this.player = player;
        this.canvas = canvas;
        this.particleSystem = particleSystem;
        this.audioManager = audioManager;
        this.screenEffects = screenEffects;
        
        // Momentum configuration
        this.config = {
            buildRate: 2.5,           // Momentum build per frame at max speed
            decayRate: 5.0,           // Momentum decay when stationary
            maxMomentum: 100,         // Maximum momentum value
            minSpeedThreshold: 10,    // Minimum speed to build momentum
            directionChangePenalty: 15, // Momentum lost on direction change
            perfectMovementBonus: 1.25, // Bonus multiplier for perfect movement
            
            // Speed thresholds for different momentum states
            speedThresholds: {
                stationary: 0,
                walking: 50,
                running: 100,
                sprinting: 150,
                maximum: 200
            }
        };
        
        // Current momentum state
        this.momentum = 0;           // Current momentum (0-100)
        this.currentSpeed = 0;       // Current movement speed
        this.averageSpeed = 0;       // Smoothed speed for stability
        this.lastPosition = { x: 0, y: 0 };
        this.lastDirection = { x: 0, y: 0 };
        
        // Momentum tracking
        this.momentumHistory = [];   // Speed history for analysis
        this.speedStreak = 0;        // Consecutive frames of high speed
        this.directionChanges = 0;   // Direction changes in recent frames
        this.perfectMovementTime = 0; // Time spent in perfect movement
        
        // Damage multiplier system
        this.damageMultiplier = 1.0;
        this.lastDamageMultiplier = 1.0;
        
        // Formula time modification
        this.formulaTimeModifier = 1.0;
        this.optimalSpeedZone = { min: 80, max: 120 }; // Optimal speed for formula solving
        
        // Visual effects state
        this.speedLines = [];
        this.momentumAura = { intensity: 0, color: [0, 255, 255] };
        this.trailIntensity = 0;
        this.motionBlur = 0;
        
        // Audio state
        this.lastAudioUpdate = 0;
        this.windSoundIntensity = 0;
        this.heartbeatSync = 0;
        
        // UI elements
        this.momentumBar = null;
        this.speedMeter = null;
        this.multiplierDisplay = null;
        
        // Performance tracking
        this.updateCounter = 0;
        this.lastMomentumState = 'stationary';
        
        this.init();
    }
    
    init() {
        this.createMomentumUI();
        this.lastPosition = { x: this.player.x, y: this.player.y };
        
        console.log('⚡ MomentumSystem initialized');
    }
    
    createMomentumUI() {
        // Create momentum bar
        this.momentumBar = document.createElement('div');
        this.momentumBar.id = 'momentumBar';
        this.momentumBar.className = 'momentum-bar';
        
        // Create speed meter
        this.speedMeter = document.createElement('div');
        this.speedMeter.id = 'speedMeter';
        this.speedMeter.className = 'speed-meter';
        
        // Create multiplier display
        this.multiplierDisplay = document.createElement('div');
        this.multiplierDisplay.id = 'multiplierDisplay';
        this.multiplierDisplay.className = 'multiplier-display';
        
        // Add to HUD
        const gameHUD = document.getElementById('gameHUD');
        if (gameHUD) {
            gameHUD.appendChild(this.momentumBar);
            gameHUD.appendChild(this.speedMeter);
            gameHUD.appendChild(this.multiplierDisplay);
        }
        
        this.applyMomentumStyles();
    }
    
    applyMomentumStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .momentum-bar {
                position: fixed;
                top: 120px;
                left: 20px;
                width: 200px;
                height: 20px;
                background: linear-gradient(90deg, rgba(0, 0, 0, 0.8), rgba(0, 20, 40, 0.8));
                border: 2px solid rgba(0, 255, 255, 0.6);
                border-radius: 10px;
                overflow: hidden;
                z-index: 1000;
            }
            
            .momentum-bar::before {
                content: 'MOMENTUM';
                position: absolute;
                top: -25px;
                left: 0;
                color: rgba(0, 255, 255, 0.8);
                font-size: 12px;
                font-weight: bold;
            }
            
            .momentum-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: linear-gradient(90deg, 
                    rgba(0, 255, 255, 0.8) 0%,
                    rgba(0, 255, 100, 0.8) 50%,
                    rgba(255, 215, 0, 0.9) 75%,
                    rgba(255, 0, 100, 1.0) 100%);
                width: var(--momentum-width, 0%);
                transition: width 0.1s ease-out;
                box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            
            .speed-meter {
                position: fixed;
                top: 150px;
                left: 20px;
                width: 100px;
                height: 30px;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(0, 255, 255, 0.6);
                border-radius: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
                font-weight: bold;
                z-index: 1000;
            }
            
            .speed-meter.walking { border-color: rgba(0, 255, 0, 0.8); color: rgba(0, 255, 0, 0.9); }
            .speed-meter.running { border-color: rgba(255, 215, 0, 0.8); color: rgba(255, 215, 0, 0.9); }
            .speed-meter.sprinting { border-color: rgba(255, 100, 0, 0.8); color: rgba(255, 100, 0, 0.9); }
            .speed-meter.maximum { border-color: rgba(255, 0, 100, 0.8); color: rgba(255, 0, 100, 0.9); animation: speedPulse 0.5s ease-in-out infinite; }
            
            @keyframes speedPulse {
                0%, 100% { transform: scale(1); box-shadow: 0 0 5px currentColor; }
                50% { transform: scale(1.05); box-shadow: 0 0 15px currentColor; }
            }
            
            .multiplier-display {
                position: fixed;
                top: 190px;
                left: 20px;
                width: 120px;
                height: 35px;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 0, 40, 0.9));
                border: 2px solid rgba(255, 215, 0, 0.8);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(255, 215, 0, 0.9);
                font-size: 16px;
                font-weight: bold;
                z-index: 1000;
                text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
            }
            
            .multiplier-display.high-multiplier {
                border-color: rgba(255, 0, 100, 0.9);
                color: rgba(255, 0, 100, 0.9);
                animation: multiplierGlow 1s ease-in-out infinite;
            }
            
            @keyframes multiplierGlow {
                0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 100, 0.5); }
                50% { box-shadow: 0 0 20px rgba(255, 0, 100, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }
    
    update(deltaTime) {
        // Safety check - don't update if player is not initialized
        if (!this.player || typeof this.player.x !== 'number' || typeof this.player.y !== 'number') {
            return;
        }
        
        // Cap deltaTime to prevent issues
        deltaTime = Math.min(deltaTime, 100);
        
        this.updateCounter++;
        
        // Calculate current speed
        this.calculateCurrentSpeed(deltaTime);
        
        // Update momentum based on movement
        this.updateMomentum(deltaTime);
        
        // Calculate damage multiplier
        this.updateDamageMultiplier();
        
        // Update formula time modifier
        this.updateFormulaTimeModifier();
        
        // Update visual effects
        this.updateVisualEffects(deltaTime);
        
        // Update audio effects
        this.updateAudioEffects(deltaTime);
        
        // Update UI every few frames for performance
        if (this.updateCounter % 3 === 0) {
            this.updateUI();
        }
        
        // Track movement patterns
        this.trackMovementPatterns(deltaTime);
        
        // Store current position for next frame
        this.lastPosition = { x: this.player.x, y: this.player.y };
    }
    
    calculateCurrentSpeed(deltaTime) {
        const dx = this.player.x - this.lastPosition.x;
        const dy = this.player.y - this.lastPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Convert to pixels per second
        this.currentSpeed = distance / (deltaTime / 1000);
        
        // Smooth the speed for stability
        this.averageSpeed = this.averageSpeed * 0.8 + this.currentSpeed * 0.2;
        
        // Track direction for direction change detection
        if (distance > 1) {
            const newDirection = { x: dx / distance, y: dy / distance };
            const directionChange = this.calculateDirectionChange(newDirection);
            
            if (directionChange > 0.5) { // Significant direction change
                this.directionChanges++;
                this.momentum = Math.max(0, this.momentum - this.config.directionChangePenalty);
            }
            
            this.lastDirection = newDirection;
        }
    }
    
    calculateDirectionChange(newDirection) {
        if (this.lastDirection.x === 0 && this.lastDirection.y === 0) return 0;
        
        const dotProduct = this.lastDirection.x * newDirection.x + this.lastDirection.y * newDirection.y;
        return Math.max(0, 1 - dotProduct); // 0 = same direction, 1 = opposite direction
    }
    
    updateMomentum(deltaTime) {
        const dt = deltaTime / 1000; // Convert to seconds
        
        if (this.averageSpeed > this.config.minSpeedThreshold) {
            // Build momentum based on speed
            const speedRatio = Math.min(this.averageSpeed / this.config.speedThresholds.maximum, 1);
            const buildAmount = this.config.buildRate * speedRatio * dt * 60; // 60 FPS reference
            
            this.momentum = Math.min(this.config.maxMomentum, this.momentum + buildAmount);
            this.speedStreak++;
        } else {
            // Decay momentum when stationary
            const decayAmount = this.config.decayRate * dt * 60;
            this.momentum = Math.max(0, this.momentum - decayAmount);
            this.speedStreak = 0;
        }
        
        // Perfect movement bonus
        if (this.isInPerfectMovement()) {
            this.perfectMovementTime += deltaTime;
            if (this.perfectMovementTime > 2000) { // 2 seconds of perfect movement
                this.momentum = Math.min(this.config.maxMomentum * 1.1, this.momentum * 1.02);
            }
        } else {
            this.perfectMovementTime = 0;
        }
    }
    
    isInPerfectMovement() {
        const optimalSpeed = (this.config.speedThresholds.running + this.config.speedThresholds.sprinting) / 2;
        const speedDiff = Math.abs(this.averageSpeed - optimalSpeed);
        const recentDirectionChanges = this.directionChanges;
        
        // Reset direction change counter periodically
        if (this.updateCounter % 180 === 0) { // Every 3 seconds at 60 FPS
            this.directionChanges = 0;
        }
        
        return speedDiff < 20 && recentDirectionChanges < 2;
    }
    
    updateDamageMultiplier() {
        const momentumRatio = this.momentum / this.config.maxMomentum;
        
        // Damage multiplier curve
        if (momentumRatio < 0.25) {
            this.damageMultiplier = 1.0; // Base damage
        } else if (momentumRatio < 0.5) {
            this.damageMultiplier = 1.0 + (momentumRatio - 0.25) * 0.8; // 1.0 to 1.2
        } else if (momentumRatio < 0.75) {
            this.damageMultiplier = 1.2 + (momentumRatio - 0.5) * 1.2; // 1.2 to 1.5
        } else if (momentumRatio < 1.0) {
            this.damageMultiplier = 1.5 + (momentumRatio - 0.75) * 2.0; // 1.5 to 2.0
        } else {
            this.damageMultiplier = 2.0; // Maximum momentum
        }
        
        // Perfect movement bonus
        if (this.perfectMovementTime > 2000) {
            this.damageMultiplier *= this.config.perfectMovementBonus; // Up to 2.5x
        }
        
        // Smooth multiplier changes
        this.damageMultiplier = this.lastDamageMultiplier * 0.9 + this.damageMultiplier * 0.1;
        this.lastDamageMultiplier = this.damageMultiplier;
    }
    
    updateFormulaTimeModifier() {
        const speed = this.averageSpeed;
        
        if (speed < this.optimalSpeedZone.min) {
            // Slower movement = more time for formulas
            this.formulaTimeModifier = 1.0 + (this.optimalSpeedZone.min - speed) / 100;
        } else if (speed > this.optimalSpeedZone.max) {
            // Faster movement = less time for formulas
            this.formulaTimeModifier = Math.max(0.3, 1.0 - (speed - this.optimalSpeedZone.max) / 200);
        } else {
            // Optimal speed zone
            this.formulaTimeModifier = 1.0;
        }
    }
    
    updateVisualEffects(deltaTime) {
        const momentumRatio = this.momentum / this.config.maxMomentum;
        const speedRatio = Math.min(this.averageSpeed / this.config.speedThresholds.maximum, 1);
        
        // Update speed lines
        this.updateSpeedLines(speedRatio);
        
        // Update momentum aura
        this.momentumAura.intensity = momentumRatio * 0.8;
        this.updateAuraColor(momentumRatio);
        
        // Update trail intensity
        this.trailIntensity = speedRatio;
        
        // Update motion blur
        this.motionBlur = Math.max(0, speedRatio - 0.7) * 3; // Only at very high speeds
        
        // Create momentum particles
        if (momentumRatio > 0.5 && this.particleSystem) {
            this.createMomentumParticles();
        }
    }
    
    updateSpeedLines(speedRatio) {
        if (speedRatio > 0.6) {
            // Add new speed lines
            const lineCount = Math.floor(speedRatio * 8);
            for (let i = 0; i < lineCount; i++) {
                if (this.speedLines.length < 20) {
                    this.speedLines.push({
                        x: this.player.x + (Math.random() - 0.5) * 100,
                        y: this.player.y + (Math.random() - 0.5) * 100,
                        vx: -this.lastDirection.x * 300,
                        vy: -this.lastDirection.y * 300,
                        life: 300,
                        maxLife: 300,
                        alpha: speedRatio
                    });
                }
            }
        }
        
        // Update existing speed lines
        this.speedLines = this.speedLines.filter(line => {
            line.x += line.vx * 0.016; // Assume 60 FPS
            line.y += line.vy * 0.016;
            line.life -= 16;
            line.alpha = (line.life / line.maxLife) * speedRatio;
            return line.life > 0;
        });
    }
    
    updateAuraColor(momentumRatio) {
        if (momentumRatio < 0.25) {
            this.momentumAura.color = [0, 255, 255]; // Cyan
        } else if (momentumRatio < 0.5) {
            this.momentumAura.color = [0, 255, 100]; // Green
        } else if (momentumRatio < 0.75) {
            this.momentumAura.color = [255, 215, 0]; // Gold
        } else {
            this.momentumAura.color = [255, 0, 100]; // Pink
        }
    }
    
    createMomentumParticles() {
        if (Math.random() < 0.3 && this.particleSystem && typeof this.particleSystem.createSparks === 'function') {
            const color = {
                r: this.momentumAura.color[0],
                g: this.momentumAura.color[1],
                b: this.momentumAura.color[2]
            };
            
            this.particleSystem.createSparks(
                this.player.x + (Math.random() - 0.5) * 30,
                this.player.y + (Math.random() - 0.5) * 30,
                1, // count
                color
            );
        }
    }
    
    updateAudioEffects(deltaTime) {
        if (!this.audioManager) return;
        
        const currentTime = Date.now();
        if (currentTime - this.lastAudioUpdate < 100) return; // Update every 100ms
        
        const speedRatio = Math.min(this.averageSpeed / this.config.speedThresholds.maximum, 1);
        const momentumRatio = this.momentum / this.config.maxMomentum;
        
        // Wind sound intensity
        this.windSoundIntensity = speedRatio;
        if (this.windSoundIntensity > 0.3) {
            this.audioManager.playSound('wind', {
                volume: this.windSoundIntensity * 0.3,
                loop: true,
                layer: 'base'
            });
        }
        
        // Heartbeat sync with momentum
        this.heartbeatSync = momentumRatio;
        if (this.heartbeatSync > 0.5) {
            const heartbeatRate = 0.5 + this.heartbeatSync * 0.5; // 0.5 to 1.0 seconds
            this.audioManager.playSound('heartbeat', {
                volume: 0.2,
                interval: heartbeatRate * 1000,
                layer: 'feedback'
            });
        }
        
        this.lastAudioUpdate = currentTime;
    }
    
    updateUI() {
        const momentumPercent = (this.momentum / this.config.maxMomentum) * 100;
        const speedState = this.getSpeedState();
        
        // Update momentum bar
        if (this.momentumBar) {
            this.momentumBar.style.setProperty('--momentum-width', `${momentumPercent}%`);
        }
        
        // Update speed meter
        if (this.speedMeter) {
            this.speedMeter.textContent = `${Math.round(this.averageSpeed)} px/s`;
            this.speedMeter.className = `speed-meter ${speedState}`;
        }
        
        // Update multiplier display
        if (this.multiplierDisplay) {
            this.multiplierDisplay.textContent = `${this.damageMultiplier.toFixed(1)}x DMG`;
            this.multiplierDisplay.classList.toggle('high-multiplier', this.damageMultiplier > 1.8);
        }
    }
    
    getSpeedState() {
        const speed = this.averageSpeed;
        const thresholds = this.config.speedThresholds;
        
        if (speed < thresholds.walking) return 'stationary';
        if (speed < thresholds.running) return 'walking';
        if (speed < thresholds.sprinting) return 'running';
        if (speed < thresholds.maximum) return 'sprinting';
        return 'maximum';
    }
    
    trackMovementPatterns(deltaTime) {
        // Add current speed to history
        this.momentumHistory.push({
            speed: this.currentSpeed,
            momentum: this.momentum,
            timestamp: Date.now()
        });
        
        // Keep only recent history (last 5 seconds)
        const cutoffTime = Date.now() - 5000;
        this.momentumHistory = this.momentumHistory.filter(entry => entry.timestamp > cutoffTime);
    }
    
    render(ctx) {
        // Render speed lines
        this.renderSpeedLines(ctx);
        
        // Render momentum aura
        this.renderMomentumAura(ctx);
        
        // Render motion blur effect
        if (this.motionBlur > 0) {
            this.renderMotionBlur(ctx);
        }
    }
    
    renderSpeedLines(ctx) {
        if (this.speedLines.length === 0) return;
        
        ctx.save();
        ctx.strokeStyle = `rgba(${this.momentumAura.color[0]}, ${this.momentumAura.color[1]}, ${this.momentumAura.color[2]}, 0.6)`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        
        this.speedLines.forEach(line => {
            ctx.globalAlpha = line.alpha;
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x + line.vx * 0.1, line.y + line.vy * 0.1);
            ctx.stroke();
        });
        
        ctx.restore();
    }
    
    renderMomentumAura(ctx) {
        if (this.momentumAura.intensity < 0.1) return;
        
        ctx.save();
        const gradient = ctx.createRadialGradient(
            this.player.x, this.player.y, 0,
            this.player.x, this.player.y, 40 * this.momentumAura.intensity
        );
        
        gradient.addColorStop(0, `rgba(${this.momentumAura.color[0]}, ${this.momentumAura.color[1]}, ${this.momentumAura.color[2]}, ${this.momentumAura.intensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
            this.player.x - 40 * this.momentumAura.intensity,
            this.player.y - 40 * this.momentumAura.intensity,
            80 * this.momentumAura.intensity,
            80 * this.momentumAura.intensity
        );
        ctx.restore();
    }
    
    renderMotionBlur(ctx) {
        ctx.save();
        ctx.globalAlpha = this.motionBlur * 0.1;
        ctx.filter = `blur(${this.motionBlur}px)`;
        
        // Render blurred player copies
        for (let i = 1; i <= 3; i++) {
            const offsetX = -this.lastDirection.x * i * 10;
            const offsetY = -this.lastDirection.y * i * 10;
            
            ctx.fillStyle = this.player.color;
            ctx.fillRect(
                this.player.x + offsetX - this.player.width / 2,
                this.player.y + offsetY - this.player.height / 2,
                this.player.width,
                this.player.height
            );
        }
        
        ctx.restore();
    }
    
    // === PUBLIC INTERFACE ===
    
    getDamageMultiplier() {
        return this.damageMultiplier;
    }
    
    getFormulaTimeModifier() {
        return this.formulaTimeModifier;
    }
    
    getMomentum() {
        return this.momentum;
    }
    
    getMomentumRatio() {
        return this.momentum / this.config.maxMomentum;
    }
    
    getCurrentSpeed() {
        return this.averageSpeed;
    }
    
    getSpeedState() {
        const speed = this.averageSpeed;
        const thresholds = this.config.speedThresholds;
        
        if (speed < thresholds.walking) return 'stationary';
        if (speed < thresholds.running) return 'walking';
        if (speed < thresholds.sprinting) return 'running';
        if (speed < thresholds.maximum) return 'sprinting';
        return 'maximum';
    }
    
    isInOptimalZone() {
        return this.averageSpeed >= this.optimalSpeedZone.min && 
               this.averageSpeed <= this.optimalSpeedZone.max;
    }
    
    // === EVENTS ===
    
    onSpeedThresholdReached(threshold) {
        if (this.screenEffects) {
            this.screenEffects.triggerFlash('speed');
        }
        
        if (this.audioManager) {
            this.audioManager.playSound('speedBoost', {
                volume: 0.4,
                pitch: 1.0 + threshold * 0.2,
                layer: 'feedback'
            });
        }
        
        console.log(`🏃 Speed threshold reached: ${threshold}`);
    }
    
    onMaxMomentumReached() {
        if (this.screenEffects) {
            this.screenEffects.triggerPulse('adrenalin');
        }
        
        if (this.audioManager) {
            this.audioManager.playSound('maxMomentum', {
                volume: 0.6,
                layer: 'feedback'
            });
        }
        
        console.log('⚡ Maximum momentum reached!');
    }
    
    onPerfectMovement() {
        if (this.screenEffects) {
            this.screenEffects.triggerFlash('success');
        }
        
        console.log('✨ Perfect movement achieved!');
    }
    
    // === SETTINGS ===
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    show() {
        if (this.momentumBar) this.momentumBar.style.display = 'block';
        if (this.speedMeter) this.speedMeter.style.display = 'flex';
        if (this.multiplierDisplay) this.multiplierDisplay.style.display = 'flex';
    }
    
    hide() {
        if (this.momentumBar) this.momentumBar.style.display = 'none';
        if (this.speedMeter) this.speedMeter.style.display = 'none';
        if (this.multiplierDisplay) this.multiplierDisplay.style.display = 'none';
    }
    
    cleanup() {
        if (this.momentumBar) this.momentumBar.remove();
        if (this.speedMeter) this.speedMeter.remove();
        if (this.multiplierDisplay) this.multiplierDisplay.remove();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MomentumSystem;
}
