/**
 * Dash System - Phase 2, Step 2.1
 * Dynamic dash/dodge mechanics for active, reactive gameplay
 */

class DashSystem {
    constructor(player, canvas, particleSystem, audioManager, screenEffects) {
        this.player = player;
        this.canvas = canvas;
        this.particleSystem = particleSystem;
        this.audioManager = audioManager;
        this.screenEffects = screenEffects;
        
        // Dash configuration
        this.config = {
            distance: 120,           // Dash distance in pixels
            duration: 150,           // Dash duration in milliseconds
            cooldown: 1500,          // Cooldown between dashes
            iFrames: 200,            // Invulnerability time
            trailLength: 8,          // Number of trail segments
            speedMultiplier: 4,      // Speed multiplier during dash
            minInputDelay: 50,       // Minimum delay for double-tap detection
            maxInputDelay: 300       // Maximum delay for double-tap detection
        };
        
        // Dash state machine
        this.state = 'ready'; // ready, charging, cooldown, blocked
        this.dashTimer = 0;
        this.cooldownTimer = 0;
        this.iFrameTimer = 0;
        
        // Dash movement
        this.dashDirection = { x: 0, y: 0 };
        this.dashVelocity = { x: 0, y: 0 };
        this.dashStartPos = { x: 0, y: 0 };
        this.dashProgress = 0;
        
        // Visual effects
        this.trailPositions = [];
        this.afterImages = [];
        this.dashParticles = [];
        
        // Input tracking for double-tap detection
        this.lastKeyPresses = {
            w: 0, a: 0, s: 0, d: 0,
            ArrowUp: 0, ArrowLeft: 0, ArrowDown: 0, ArrowRight: 0
        };
        
        // Mouse dash
        this.mouseDashEnabled = true;
        this.lastRightClick = 0;
        
        // Settings
        this.settings = {
            enabled: true,
            doubleTapEnabled: true,
            shiftDashEnabled: true,
            mouseDashEnabled: true,
            visualEffectsEnabled: true,
            audioEnabled: true
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Keyboard event listeners for double-tap detection
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Mouse event listeners for mouse dash
        if (this.canvas) {
            this.canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Prevent context menu
                this.handleMouseDash(e);
            });
        }
    }
    
    handleKeyDown(e) {
        if (!this.settings.enabled) return;
        
        const key = e.key.toLowerCase();
        const currentTime = Date.now();
        
        // Handle Shift + Direction dash
        if (this.settings.shiftDashEnabled && e.shiftKey) {
            const direction = this.getDirectionFromKey(key);
            if (direction) {
                this.attemptDash(direction.x, direction.y);
                return;
            }
        }
        
        // Handle double-tap dash
        if (this.settings.doubleTapEnabled) {
            const mappedKey = this.mapKey(key);
            if (mappedKey && this.lastKeyPresses.hasOwnProperty(mappedKey)) {
                const timeSinceLastPress = currentTime - this.lastKeyPresses[mappedKey];
                
                if (timeSinceLastPress >= this.config.minInputDelay && 
                    timeSinceLastPress <= this.config.maxInputDelay) {
                    // Double-tap detected
                    const direction = this.getDirectionFromKey(mappedKey);
                    if (direction) {
                        this.attemptDash(direction.x, direction.y);
                    }
                }
                
                this.lastKeyPresses[mappedKey] = currentTime;
            }
        }
    }
    
    handleMouseDash(e) {
        if (!this.settings.mouseDashEnabled || !this.settings.enabled) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate direction from player to mouse
        const dx = mouseX - this.player.x;
        const dy = mouseY - this.player.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length > 0) {
            const dirX = dx / length;
            const dirY = dy / length;
            this.attemptDash(dirX, dirY);
        }
    }
    
    mapKey(key) {
        const keyMap = {
            'w': 'w', 'arrowup': 'ArrowUp',
            'a': 'a', 'arrowleft': 'ArrowLeft',
            's': 's', 'arrowdown': 'ArrowDown',
            'd': 'd', 'arrowright': 'ArrowRight'
        };
        return keyMap[key] || null;
    }
    
    getDirectionFromKey(key) {
        const directions = {
            'w': { x: 0, y: -1 },
            'ArrowUp': { x: 0, y: -1 },
            'a': { x: -1, y: 0 },
            'ArrowLeft': { x: -1, y: 0 },
            's': { x: 0, y: 1 },
            'ArrowDown': { x: 0, y: 1 },
            'd': { x: 1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }
        };
        return directions[key] || null;
    }
    
    attemptDash(dirX, dirY) {
        if (this.state !== 'ready') return false;
        
        // Normalize direction for diagonal dashes
        const length = Math.sqrt(dirX * dirX + dirY * dirY);
        if (length === 0) return false;
        
        this.dashDirection.x = dirX / length;
        this.dashDirection.y = dirY / length;
        
        this.startDash();
        return true;
    }
    
    startDash() {
        // Set dash state
        this.state = 'charging';
        this.dashTimer = 0;
        this.iFrameTimer = 0;
        this.dashProgress = 0;
        
        // Store starting position
        this.dashStartPos.x = this.player.x;
        this.dashStartPos.y = this.player.y;
        
        // Calculate dash velocity
        const speed = this.config.distance / this.config.duration;
        this.dashVelocity.x = this.dashDirection.x * speed;
        this.dashVelocity.y = this.dashDirection.y * speed;
        
        // Clear previous trail
        this.trailPositions = [];
        this.afterImages = [];
        
        // Create dash start effects
        this.createDashStartEffects();
        
        // Trigger audio and screen effects
        this.triggerDashEffects();
        
        console.log(`🏃 Dash started: direction(${this.dashDirection.x.toFixed(2)}, ${this.dashDirection.y.toFixed(2)})`);
    }
    
    createDashStartEffects() {
        if (!this.settings.visualEffectsEnabled) return;
        
        // Create particle burst at start position
        if (this.particleSystem) {
            this.particleSystem.createExplosion(
                this.player.x, this.player.y, 15,
                { r: 100, g: 200, b: 255 }, // Cyan dash color
                { minSpeed: 50, maxSpeed: 150, life: 300 }
            );
            
            // Create directional particles using sparks
            this.particleSystem.createSparks(
                this.player.x, this.player.y,
                8,
                { r: 150, g: 220, b: 255 }
            );
        }
    }
    
    triggerDashEffects() {
        // Audio effects
        if (this.audioManager && this.settings.audioEnabled) {
            this.audioManager.playSound('dash', {
                volume: 0.6,
                pitch: 1.2,
                layer: 'action'
            });
        }
        
        // Screen effects
        if (this.screenEffects) {
            this.screenEffects.triggerShake('micro', { 
                intensity: 3, 
                duration: 100,
                direction: 'both'
            });
        }
    }
    
    update(deltaTime, inputHandler) {
        this.updateTimers(deltaTime);
        
        switch (this.state) {
            case 'charging':
                this.updateDashMovement(deltaTime);
                this.updateVisualEffects(deltaTime);
                break;
            case 'cooldown':
                // Just wait for cooldown to finish
                break;
            case 'ready':
                // Ready for next dash
                break;
        }
        
        this.updateTrailEffects(deltaTime);
    }
    
    updateTimers(deltaTime) {
        // Update dash timer
        if (this.state === 'charging') {
            this.dashTimer += deltaTime;
            if (this.dashTimer >= this.config.duration) {
                this.endDash();
            }
        }
        
        // Update cooldown timer
        if (this.state === 'cooldown') {
            this.cooldownTimer += deltaTime;
            if (this.cooldownTimer >= this.config.cooldown) {
                this.state = 'ready';
                this.cooldownTimer = 0;
                
                // Audio feedback when dash becomes available
                if (this.audioManager && this.settings.audioEnabled) {
                    this.audioManager.playSound('click', {
                        volume: 0.3,
                        pitch: 1.5,
                        layer: 'feedback'
                    });
                }
            }
        }
        
        // Update I-frames timer
        if (this.iFrameTimer > 0) {
            this.iFrameTimer -= deltaTime;
        }
    }
    
    updateDashMovement(deltaTime) {
        const deltaSeconds = deltaTime / 1000;
        this.dashProgress = this.dashTimer / this.config.duration;
        
        // Apply easing curve for smooth dash movement
        const easedProgress = this.easeOutQuart(this.dashProgress);
        
        // Calculate current position
        const targetX = this.dashStartPos.x + (this.dashDirection.x * this.config.distance);
        const targetY = this.dashStartPos.y + (this.dashDirection.y * this.config.distance);
        
        const newX = this.dashStartPos.x + (targetX - this.dashStartPos.x) * easedProgress;
        const newY = this.dashStartPos.y + (targetY - this.dashStartPos.y) * easedProgress;
        
        // Check for wall collisions
        const collision = this.checkWallCollision(newX, newY);
        if (collision.hit) {
            // Stop dash at collision point
            this.player.x = collision.x;
            this.player.y = collision.y;
            this.endDash();
            this.createWallImpactEffects(collision.x, collision.y);
        } else {
            this.player.x = newX;
            this.player.y = newY;
        }
        
        // Add position to trail
        this.addToTrail(this.player.x, this.player.y);
    }
    
    updateVisualEffects(deltaTime) {
        if (!this.settings.visualEffectsEnabled) return;
        
        // Create afterimages
        if (this.dashTimer % 30 < deltaTime) { // Every 30ms
            this.afterImages.push({
                x: this.player.x,
                y: this.player.y,
                alpha: 0.6,
                life: 200,
                maxLife: 200
            });
        }
        
        // Update afterimages
        this.afterImages = this.afterImages.filter(afterImage => {
            afterImage.life -= deltaTime;
            afterImage.alpha = afterImage.life / afterImage.maxLife * 0.6;
            return afterImage.life > 0;
        });
        
        // Create dash particles along the trail
        if (this.particleSystem && this.dashTimer % 20 < deltaTime) {
            this.particleSystem.createTrail(
                this.player.x + (Math.random() - 0.5) * 20,
                this.player.y + (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                1,
                { r: 100, g: 200, b: 255 }
            );
        }
    }
    
    updateTrailEffects(deltaTime) {
        // Update trail positions (fade them out)
        this.trailPositions = this.trailPositions.filter(pos => {
            pos.life -= deltaTime;
            pos.alpha = pos.life / pos.maxLife;
            return pos.life > 0;
        });
    }
    
    addToTrail(x, y) {
        this.trailPositions.push({
            x: x,
            y: y,
            alpha: 1.0,
            life: 300,
            maxLife: 300
        });
        
        // Limit trail length
        if (this.trailPositions.length > this.config.trailLength) {
            this.trailPositions.shift();
        }
    }
    
    checkWallCollision(newX, newY) {
        const playerSize = this.player.width || 20;
        const halfSize = playerSize / 2;
        
        // Check canvas boundaries
        let hitWall = false;
        let finalX = newX;
        let finalY = newY;
        
        if (newX - halfSize < 0) {
            finalX = halfSize;
            hitWall = true;
        } else if (newX + halfSize > this.canvas.width) {
            finalX = this.canvas.width - halfSize;
            hitWall = true;
        }
        
        if (newY - halfSize < 0) {
            finalY = halfSize;
            hitWall = true;
        } else if (newY + halfSize > this.canvas.height) {
            finalY = this.canvas.height - halfSize;
            hitWall = true;
        }
        
        return {
            hit: hitWall,
            x: finalX,
            y: finalY
        };
    }
    
    createWallImpactEffects(x, y) {
        // Screen shake on wall impact
        if (this.screenEffects) {
            this.screenEffects.triggerShake('medium', {
                intensity: 5,
                duration: 200
            });
        }
        
        // Impact particles
        if (this.particleSystem && this.settings.visualEffectsEnabled) {
            this.particleSystem.createExplosion(
                x, y, 10,
                { r: 255, g: 150, b: 50 }, // Orange impact color
                { minSpeed: 30, maxSpeed: 100, life: 400 }
            );
        }
        
        // Impact audio
        if (this.audioManager && this.settings.audioEnabled) {
            this.audioManager.playSound('damage', {
                volume: 0.4,
                pitch: 1.5,
                layer: 'effect'
            });
        }
    }
    
    endDash() {
        this.state = 'cooldown';
        this.cooldownTimer = 0;
        this.iFrameTimer = this.config.iFrames;
        
        console.log('🏃 Dash ended, entering cooldown');
    }
    
    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    // === RENDERING ===
    
    render(ctx) {
        if (!this.settings.visualEffectsEnabled) return;
        
        this.renderTrail(ctx);
        this.renderAfterImages(ctx);
        this.renderDashIndicator(ctx);
    }
    
    renderTrail(ctx) {
        if (this.trailPositions.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = `rgba(100, 200, 255, 0.8)`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        for (let i = 0; i < this.trailPositions.length; i++) {
            const pos = this.trailPositions[i];
            ctx.globalAlpha = pos.alpha * 0.8;
            
            if (i === 0) {
                ctx.moveTo(pos.x, pos.y);
            } else {
                ctx.lineTo(pos.x, pos.y);
            }
        }
        ctx.stroke();
        ctx.restore();
    }
    
    renderAfterImages(ctx) {
        ctx.save();
        for (const afterImage of this.afterImages) {
            ctx.globalAlpha = afterImage.alpha;
            ctx.fillStyle = '#64C8FF';
            ctx.fillRect(
                afterImage.x - (this.player.width || 20) / 2,
                afterImage.y - (this.player.height || 20) / 2,
                this.player.width || 20,
                this.player.height || 20
            );
        }
        ctx.restore();
    }
    
    renderDashIndicator(ctx) {
        // Render cooldown indicator
        if (this.state === 'cooldown') {
            const progress = this.cooldownTimer / this.config.cooldown;
            const radius = 30;
            const centerX = this.player.x;
            const centerY = this.player.y - 40;
            
            ctx.save();
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, -Math.PI/2, -Math.PI/2 + (progress * Math.PI * 2));
            ctx.stroke();
            ctx.restore();
        }
    }
    
    // === PUBLIC INTERFACE ===
    
    isDashing() {
        return this.state === 'charging';
    }
    
    hasIFrames() {
        return this.iFrameTimer > 0;
    }
    
    isReady() {
        return this.state === 'ready';
    }
    
    getCooldownProgress() {
        if (this.state !== 'cooldown') return 1.0;
        return this.cooldownTimer / this.config.cooldown;
    }
    
    // === SETTINGS ===
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    // === AUDIO INTEGRATION ===
    
    addDashSounds() {
        if (!this.audioManager) return;
        
        // Add dash sound configuration to audio manager
        const dashSoundConfig = {
            waveform: 'triangle',
            frequency: 200,
            modulation: { rate: 20, depth: 50 },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
        };
        
        // This would be added to the AudioManager's sound configs
        console.log('🔊 Dash audio integration ready');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashSystem;
}
