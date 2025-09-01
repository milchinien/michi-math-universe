/**
 * FORMEL-FURY-SHOOTER - PLAYER & INPUT SYSTEM
 * Handles player movement, input handling, and player rendering
 * Phase 4.2: Modulare Struktur
 */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 200; // pixels per second
        this.maxSpeed = 300;
        
        // Movement state - ULTRA SMOOTH MOVEMENT
        this.velocity = { x: 0, y: 0 };
        this.targetVelocity = { x: 0, y: 0 };
        this.smoothFactor = 0.15; // interpolation factor (lower = smoother)
        this.friction = 0.92; // higher friction for quicker stops
        this.minVelocity = 0.01; // threshold to stop tiny movements
        
        // Visual properties
        this.color = '#CD853F';
        this.glowColor = 'rgba(205, 133, 63, 0.5)';
        this.angle = 0; // for rotation effect
        
        // Visual effect properties for upgrades
        this.healingParticles = [];
        this.luckSparkles = [];
        this.speedTrails = [];
        this.comboFireEffects = [];
        this.magneticFieldRadius = 0;
        this.shieldLayers = [];
        this.timeDistortionEffect = 0;
        this.gravitationalAura = { radius: 0, intensity: 0 };
        this.quantumGlow = 0;
        
        // Effect timers
        this.effectTimers = {
            healing: 0,
            luck: 0,
            speed: 0,
            combo: 0,
            shield: 0,
            quantum: 0
        };
    }

    update(deltaTime, inputHandler, canvasWidth, canvasHeight) {
        // Cap deltaTime to prevent large jumps
        const dt = Math.min(deltaTime / 1000, 1/30); // Max 30 FPS equivalent
        
        // Handle input to set target velocity
        this.targetVelocity.x = 0;
        this.targetVelocity.y = 0;
        
        // Get speed multiplier from upgrade system (default to 1.0 if not available)
        const speedMultiplier = (window.game && window.game.playerInput && window.game.playerInput.speedMultiplier) 
            ? window.game.playerInput.speedMultiplier 
            : 1.0;
        
        const effectiveSpeed = this.speed * speedMultiplier;
        
        if (inputHandler.isPressed('w') || inputHandler.isPressed('W')) {
            this.targetVelocity.y = -effectiveSpeed;
        }
        if (inputHandler.isPressed('s') || inputHandler.isPressed('S')) {
            this.targetVelocity.y = effectiveSpeed;
        }
        if (inputHandler.isPressed('a') || inputHandler.isPressed('A')) {
            this.targetVelocity.x = -effectiveSpeed;
        }
        if (inputHandler.isPressed('d') || inputHandler.isPressed('D')) {
            this.targetVelocity.x = effectiveSpeed;
        }
        
        // Diagonal movement compensation
        if (this.targetVelocity.x !== 0 && this.targetVelocity.y !== 0) {
            this.targetVelocity.x *= 0.707; // sqrt(2)/2 for diagonal movement
            this.targetVelocity.y *= 0.707;
        }
        
        // Smooth interpolation to target velocity (frame-rate independent)
        const smoothing = 1 - Math.pow(1 - this.smoothFactor, dt * 60); // 60 FPS reference
        this.velocity.x += (this.targetVelocity.x - this.velocity.x) * smoothing;
        this.velocity.y += (this.targetVelocity.y - this.velocity.y) * smoothing;
        
        // Apply friction when no input
        if (this.targetVelocity.x === 0 && this.targetVelocity.y === 0) {
            this.velocity.x *= Math.pow(this.friction, dt * 60); // Frame-rate independent friction
            this.velocity.y *= Math.pow(this.friction, dt * 60);
        }
        
        // Stop tiny movements that cause jitter
        if (Math.abs(this.velocity.x) < this.minVelocity) this.velocity.x = 0;
        if (Math.abs(this.velocity.y) < this.minVelocity) this.velocity.y = 0;
        
        // Update position with sub-pixel precision, then round for rendering
        this.x += this.velocity.x * dt;
        this.y += this.velocity.y * dt;
        
        // Collision detection with canvas boundaries
        this.handleBoundaryCollision(canvasWidth, canvasHeight);
        
        // Update visual angle for rotation effect
        if (Math.abs(this.velocity.x) > 1 || Math.abs(this.velocity.y) > 1) {
            this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        }
        
        // Update visual effects
        this.updateVisualEffects(dt);
    }

    handleBoundaryCollision(canvasWidth, canvasHeight) {
        const voidWallThickness = 30; // Ominous void wall thickness
        const damageZone = 50; // Zone where player takes damage from void
        
        // Left boundary with ominous void wall
        if (this.x < this.width / 2 + voidWallThickness) {
            this.x = this.width / 2 + voidWallThickness;
            this.velocity.x = 0;
            this.triggerVoidDamage('left');
        }
        // Right boundary with ominous void wall
        if (this.x > canvasWidth - this.width / 2 - voidWallThickness) {
            this.x = canvasWidth - this.width / 2 - voidWallThickness;
            this.velocity.x = 0;
            this.triggerVoidDamage('right');
        }
        // Top boundary with ominous void wall
        if (this.y < this.height / 2 + voidWallThickness) {
            this.y = this.height / 2 + voidWallThickness;
            this.velocity.y = 0;
            this.triggerVoidDamage('top');
        }
        // Bottom boundary with ominous void wall
        if (this.y > canvasHeight - this.height / 2 - voidWallThickness) {
            this.y = canvasHeight - this.height / 2 - voidWallThickness;
            this.velocity.y = 0;
            this.triggerVoidDamage('bottom');
        }
    }
    
    triggerVoidDamage(direction) {
        // Trigger void damage effect - this will be handled by the game engine
        if (window.game && window.game.handleVoidContact) {
            window.game.handleVoidContact(direction);
        }
    }

    render(ctx) {
        ctx.save();
        
        // Draw glow effect
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 15;
        
        // Translate to player position (rounded for pixel-perfect rendering)
        ctx.translate(Math.round(this.x), Math.round(this.y));
        
        // Rotate based on movement direction
        ctx.rotate(this.angle);
        
        // Draw player body (diamond shape for sci-fi look)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 0);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(-this.width / 2, 0);
        ctx.lineTo(0, -this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw center core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw direction indicator
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width / 2 + 5, 0);
        ctx.stroke();
        
        // Render all visual upgrade effects
        this.renderUpgradeEffects(ctx);
        
        ctx.restore();
    }
    
    updateVisualEffects(deltaTime) {
        const time = Date.now() * 0.001;
        
        // Update effect timers
        for (let key in this.effectTimers) {
            this.effectTimers[key] += deltaTime;
        }
        
        // Update healing particles
        this.updateHealingParticles(deltaTime);
        
        // Update luck sparkles
        this.updateLuckSparkles(deltaTime, time);
        
        // Update speed trails
        this.updateSpeedTrails(deltaTime);
        
        // Update combo fire effects
        this.updateComboFireEffects(deltaTime, time);
        
        // Update quantum glow
        this.quantumGlow = Math.sin(time * 3) * 0.3 + 0.7;
        
        // Update time distortion effect
        this.timeDistortionEffect = Math.sin(time * 2) * 0.5 + 0.5;
    }
    
    updateHealingParticles(deltaTime) {
        // Add new healing particles if player has healing regeneration
        const hasHealing = window.game && window.game.playerStats && window.game.playerStats.hpRegenRate > 0;
        if (hasHealing && Math.random() < 0.3) {
            this.healingParticles.push({
                x: (Math.random() - 0.5) * 40,
                y: (Math.random() - 0.5) * 40,
                life: 1.0,
                size: 2 + Math.random() * 3,
                speed: 20 + Math.random() * 30
            });
        }
        
        // Update existing particles
        this.healingParticles = this.healingParticles.filter(particle => {
            particle.life -= deltaTime * 0.8;
            particle.y -= particle.speed * deltaTime;
            particle.x += Math.sin(particle.life * 10) * 10 * deltaTime;
            return particle.life > 0;
        });
    }
    
    updateLuckSparkles(deltaTime, time) {
        // Add new luck sparkles if player has luck bonuses
        const hasLuck = window.game && window.game.levelUpSystem && 
                       (window.game.levelUpSystem.luckBonuses.common > 0 ||
                        window.game.levelUpSystem.luckBonuses.rare > 0 ||
                        window.game.levelUpSystem.luckBonuses.epic > 0 ||
                        window.game.levelUpSystem.luckBonuses.legendary > 0);
        
        if (hasLuck && Math.random() < 0.4) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 15 + Math.random() * 25;
            this.luckSparkles.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                life: 1.0,
                size: 1 + Math.random() * 2,
                twinkle: Math.random() * Math.PI * 2
            });
        }
        
        // Update existing sparkles
        this.luckSparkles = this.luckSparkles.filter(sparkle => {
            sparkle.life -= deltaTime * 0.6;
            sparkle.twinkle += deltaTime * 8;
            return sparkle.life > 0;
        });
    }
    
    updateSpeedTrails(deltaTime) {
        // Add speed trails when moving fast
        const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        const hasSpeedBonus = window.game && window.game.playerInput && window.game.playerInput.speedMultiplier > 1.0;
        
        if ((speed > 100 || hasSpeedBonus) && Math.random() < 0.8) {
            this.speedTrails.push({
                x: -this.velocity.x * 0.1 + (Math.random() - 0.5) * 10,
                y: -this.velocity.y * 0.1 + (Math.random() - 0.5) * 10,
                life: 0.5,
                size: 3 + Math.random() * 4,
                alpha: 0.8
            });
        }
        
        // Update existing trails
        this.speedTrails = this.speedTrails.filter(trail => {
            trail.life -= deltaTime * 2;
            trail.alpha = trail.life;
            return trail.life > 0;
        });
    }
    
    updateComboFireEffects(deltaTime, time) {
        // Add combo fire effects if player has combo bonuses
        const hasCombo = window.game && window.game.formulaSystem && window.game.formulaSystem.combo > 0;
        
        if (hasCombo && Math.random() < 0.5) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 8 + Math.random() * 12;
            this.comboFireEffects.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                life: 0.8,
                size: 2 + Math.random() * 3,
                flame: Math.random() * Math.PI * 2
            });
        }
        
        // Update existing fire effects
        this.comboFireEffects = this.comboFireEffects.filter(fire => {
            fire.life -= deltaTime * 1.5;
            fire.flame += deltaTime * 12;
            fire.y -= 30 * deltaTime; // Rise upward
            return fire.life > 0;
        });
    }
    
    renderUpgradeEffects(ctx) {
        // Render gravitational aura
        this.renderGravitationalAura(ctx);
        
        // Render magnetic field
        this.renderMagneticField(ctx);
        
        // Render shield layers
        this.renderShieldLayers(ctx);
        
        // Render time distortion effect
        this.renderTimeDistortionEffect(ctx);
        
        // Render healing particles
        this.renderHealingParticles(ctx);
        
        // Render luck sparkles
        this.renderLuckSparkles(ctx);
        
        // Render speed trails
        this.renderSpeedTrails(ctx);
        
        // Render combo fire effects
        this.renderComboFireEffects(ctx);
        
        // Render quantum glow
        this.renderQuantumGlow(ctx);
    }
    
    renderGravitationalAura(ctx) {
        const radius = window.game && window.game.gravitationalFieldRadius ? window.game.gravitationalFieldRadius : 0;
        if (radius <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        // Create pulsing gravitational field
        const time = Date.now() * 0.002;
        const pulseRadius = radius * (0.8 + Math.sin(time) * 0.2);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseRadius);
        gradient.addColorStop(0, 'rgba(75, 0, 130, 0.4)');
        gradient.addColorStop(0.7, 'rgba(138, 43, 226, 0.2)');
        gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add swirling effect
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
            const angle = (time + i * Math.PI / 4) % (Math.PI * 2);
            const x1 = Math.cos(angle) * pulseRadius * 0.3;
            const y1 = Math.sin(angle) * pulseRadius * 0.3;
            const x2 = Math.cos(angle) * pulseRadius * 0.8;
            const y2 = Math.sin(angle) * pulseRadius * 0.8;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    renderMagneticField(ctx) {
        if (this.magneticFieldRadius <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = 0.4;
        
        // Magnetic field visualization
        const time = Date.now() * 0.003;
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 2;
        
        // Draw magnetic field lines
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + time;
            const radius = this.magneticFieldRadius * (0.7 + Math.sin(time + i) * 0.3);
            
            ctx.beginPath();
            ctx.arc(0, 0, radius, angle, angle + Math.PI / 6);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    renderShieldLayers(ctx) {
        if (this.shieldLayers.length === 0) return;
        
        ctx.save();
        
        this.shieldLayers.forEach((shield, index) => {
            const time = Date.now() * 0.004;
            const radius = 25 + index * 8;
            const alpha = 0.3 + Math.sin(time + index) * 0.2;
            
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
            ctx.lineWidth = 3;
            
            // Hexagonal shield pattern
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + time;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        });
        
        ctx.restore();
    }
    
    renderTimeDistortionEffect(ctx) {
        if (this.timeDistortionEffect <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.timeDistortionEffect * 0.3;
        
        // Time ripple effect
        const time = Date.now() * 0.005;
        for (let i = 1; i <= 3; i++) {
            const radius = i * 20 + Math.sin(time + i) * 5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 / i})`;
            ctx.lineWidth = 2 / i;
            
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    renderHealingParticles(ctx) {
        if (this.healingParticles.length === 0) return;
        
        ctx.save();
        
        this.healingParticles.forEach(particle => {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = 'rgba(0, 255, 127, 0.8)';
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add cross symbol for healing
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 1;
            const crossSize = particle.size * 0.6;
            ctx.beginPath();
            ctx.moveTo(particle.x - crossSize, particle.y);
            ctx.lineTo(particle.x + crossSize, particle.y);
            ctx.moveTo(particle.x, particle.y - crossSize);
            ctx.lineTo(particle.x, particle.y + crossSize);
            ctx.stroke();
        });
        
        ctx.restore();
    }
    
    renderLuckSparkles(ctx) {
        if (this.luckSparkles.length === 0) return;
        
        ctx.save();
        
        this.luckSparkles.forEach(sparkle => {
            const twinkleAlpha = Math.sin(sparkle.twinkle) * 0.5 + 0.5;
            ctx.globalAlpha = sparkle.life * twinkleAlpha;
            ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
            
            // Four-pointed star
            ctx.save();
            ctx.translate(sparkle.x, sparkle.y);
            ctx.rotate(sparkle.twinkle);
            
            ctx.beginPath();
            ctx.moveTo(0, -sparkle.size);
            ctx.lineTo(sparkle.size * 0.3, 0);
            ctx.lineTo(sparkle.size, 0);
            ctx.lineTo(sparkle.size * 0.3, 0);
            ctx.lineTo(0, sparkle.size);
            ctx.lineTo(-sparkle.size * 0.3, 0);
            ctx.lineTo(-sparkle.size, 0);
            ctx.lineTo(-sparkle.size * 0.3, 0);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        });
        
        ctx.restore();
    }
    
    renderSpeedTrails(ctx) {
        if (this.speedTrails.length === 0) return;
        
        ctx.save();
        
        this.speedTrails.forEach(trail => {
            ctx.globalAlpha = trail.alpha * 0.6;
            ctx.fillStyle = 'rgba(255, 255, 0, 0.8)';
            
            ctx.beginPath();
            ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
    
    renderComboFireEffects(ctx) {
        if (this.comboFireEffects.length === 0) return;
        
        ctx.save();
        
        this.comboFireEffects.forEach(fire => {
            ctx.globalAlpha = fire.life;
            
            // Flame colors
            const flameIntensity = Math.sin(fire.flame) * 0.5 + 0.5;
            const red = 255;
            const green = Math.floor(100 + flameIntensity * 155);
            const blue = 0;
            
            ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, 0.8)`;
            
            ctx.beginPath();
            ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }
    
    renderQuantumGlow(ctx) {
        if (this.quantumGlow <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.quantumGlow * 0.4;
        
        // Quantum particle effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 30);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Methods to trigger visual effects for upgrades
    addShieldLayer() {
        this.shieldLayers.push({ active: true });
    }
    
    removeShieldLayer() {
        this.shieldLayers.pop();
    }
    
    setMagneticFieldRadius(radius) {
        this.magneticFieldRadius = radius;
    }
    
    // Static method to render void walls
    static renderVoidWalls(ctx, canvasWidth, canvasHeight) {
        const voidWallThickness = 30;
        const time = Date.now() * 0.003; // For animation
        
        ctx.save();
        
        // Create ominous void gradient
        const voidGradient = ctx.createLinearGradient(0, 0, voidWallThickness, 0);
        voidGradient.addColorStop(0, `rgba(75, 0, 130, ${0.9 + Math.sin(time) * 0.1})`);
        voidGradient.addColorStop(0.5, `rgba(25, 0, 51, ${0.7 + Math.sin(time * 1.5) * 0.2})`);
        voidGradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 + Math.sin(time * 2) * 0.2})`);
        
        // Left void wall
        ctx.fillStyle = voidGradient;
        ctx.fillRect(0, 0, voidWallThickness, canvasHeight);
        
        // Right void wall
        const rightGradient = ctx.createLinearGradient(canvasWidth - voidWallThickness, 0, canvasWidth, 0);
        rightGradient.addColorStop(0, `rgba(0, 0, 0, ${0.3 + Math.sin(time * 2) * 0.2})`);
        rightGradient.addColorStop(0.5, `rgba(25, 0, 51, ${0.7 + Math.sin(time * 1.5) * 0.2})`);
        rightGradient.addColorStop(1, `rgba(75, 0, 130, ${0.9 + Math.sin(time) * 0.1})`);
        ctx.fillStyle = rightGradient;
        ctx.fillRect(canvasWidth - voidWallThickness, 0, voidWallThickness, canvasHeight);
        
        // Top void wall
        const topGradient = ctx.createLinearGradient(0, 0, 0, voidWallThickness);
        topGradient.addColorStop(0, `rgba(75, 0, 130, ${0.9 + Math.sin(time) * 0.1})`);
        topGradient.addColorStop(0.5, `rgba(25, 0, 51, ${0.7 + Math.sin(time * 1.5) * 0.2})`);
        topGradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 + Math.sin(time * 2) * 0.2})`);
        ctx.fillStyle = topGradient;
        ctx.fillRect(0, 0, canvasWidth, voidWallThickness);
        
        // Bottom void wall
        const bottomGradient = ctx.createLinearGradient(0, canvasHeight - voidWallThickness, 0, canvasHeight);
        bottomGradient.addColorStop(0, `rgba(0, 0, 0, ${0.3 + Math.sin(time * 2) * 0.2})`);
        bottomGradient.addColorStop(0.5, `rgba(25, 0, 51, ${0.7 + Math.sin(time * 1.5) * 0.2})`);
        bottomGradient.addColorStop(1, `rgba(75, 0, 130, ${0.9 + Math.sin(time) * 0.1})`);
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(0, canvasHeight - voidWallThickness, canvasWidth, voidWallThickness);
        
        // Add void particles/effects
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvasWidth;
            const y = Math.random() * canvasHeight;
            const size = 1 + Math.random() * 3;
            const alpha = Math.sin(time + i) * 0.5 + 0.5;
            
            // Only draw particles near void walls
            const nearWall = x < voidWallThickness * 2 || x > canvasWidth - voidWallThickness * 2 ||
                           y < voidWallThickness * 2 || y > canvasHeight - voidWallThickness * 2;
            
            if (nearWall) {
                ctx.fillStyle = `rgba(138, 43, 226, ${alpha * 0.8})`;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }

    getDebugInfo() {
        return {
            position: `(${Math.round(this.x)}, ${Math.round(this.y)})`,
            velocity: `(${Math.round(this.velocity.x)}, ${Math.round(this.velocity.y)})`,
            speed: Math.round(Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2)),
            nearVoid: this.isNearVoid()
        };
    }
    
    isNearVoid() {
        const voidWallThickness = 30;
        const warningDistance = 60;
        
        return this.x < voidWallThickness + warningDistance ||
               this.x > (window.innerWidth - voidWallThickness - warningDistance) ||
               this.y < voidWallThickness + warningDistance ||
               this.y > (window.innerHeight - voidWallThickness - warningDistance);
    }
}

class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            clicked: false,
            justClicked: false
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.mouse.clicked = true;
                this.mouse.justClicked = true;
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // Left click
                this.mouse.clicked = false;
            }
        });

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Prevent default behavior for WASD keys
        document.addEventListener('keydown', (e) => {
            if (['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
                e.preventDefault();
            }
            
            // Handle SPACE key for formula system
            if (e.key === ' ' || e.key === 'Space') {
                e.preventDefault();
                // This will be handled by GameEngine
            }
        });
    }

    isPressed(key) {
        return !!this.keys[key];
    }

    isSpacePressed() {
        return this.keys[' '] || this.keys['Space'];
    }

    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }

    isMouseClicked() {
        return this.mouse.clicked;
    }

    wasMouseJustClicked() {
        const wasClicked = this.mouse.justClicked;
        this.mouse.justClicked = false; // Reset for next frame
        return wasClicked;
    }

    getDebugInfo() {
        const pressedKeys = Object.keys(this.keys).filter(key => this.keys[key]);
        return `Keys: ${pressedKeys.join(', ') || 'None'}, Mouse: (${Math.round(this.mouse.x)}, ${Math.round(this.mouse.y)})`;
    }
}
