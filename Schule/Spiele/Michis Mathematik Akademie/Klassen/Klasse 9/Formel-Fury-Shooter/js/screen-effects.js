/**
 * Screen Effects System - Phase 1, Step 1.2
 * Provides dynamic visual feedback through screen shakes, flashes, and distortions
 */

class ScreenEffects {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Screen shake system
        this.shake = {
            x: 0,
            y: 0,
            intensity: 0,
            duration: 0,
            frequency: 60,
            decay: 0.95,
            direction: 'both',
            time: 0
        };
        
        // Flash effects
        this.flash = {
            active: false,
            color: 'rgba(255, 255, 255, 0)',
            alpha: 0,
            duration: 0,
            maxAlpha: 0.8,
            fadeSpeed: 0.05
        };
        
        // Pulse effects
        this.pulse = {
            active: false,
            intensity: 0,
            frequency: 1.0,
            time: 0,
            type: 'heartbeat' // heartbeat, combo, adrenalin, victory
        };
        
        // Chromatic aberration
        this.aberration = {
            active: false,
            intensity: 0,
            duration: 0,
            type: 'stress' // stress, speed, impact
        };
        
        // Performance settings - MINIMAL EFFECTS
        this.settings = {
            shakeEnabled: false, // Disabled for minimal effects
            flashEnabled: true, // Keep only flashes
            pulseEnabled: false, // Disabled for minimal effects
            aberrationEnabled: false, // Disabled
            intensityMultiplier: 0.3, // Very low intensity
            mobileReduction: 0.1 // Minimal on mobile
        };
        
        // Original canvas transform for restoration
        this.originalTransform = null;
        this.saveOriginalTransform();
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    saveOriginalTransform() {
        this.originalTransform = this.ctx.getTransform();
    }
    
    // === SCREEN SHAKE SYSTEM ===
    
    triggerShake(type, customParams = {}) {
        if (!this.settings.shakeEnabled) return;
        
        const shakeTypes = {
            micro: { intensity: 1, duration: 100, frequency: 80 },
            medium: { intensity: 4, duration: 200, frequency: 60 },
            heavy: { intensity: 8, duration: 300, frequency: 40 },
            earthquake: { intensity: 12, duration: 500, frequency: 30 },
            explosion: { intensity: 15, duration: 400, frequency: 50 }
        };
        
        const params = { ...shakeTypes[type], ...customParams };
        
        this.shake.intensity = params.intensity * this.settings.intensityMultiplier * this.settings.mobileReduction;
        this.shake.duration = params.duration;
        this.shake.frequency = params.frequency;
        this.shake.decay = params.decay || 0.95;
        this.shake.direction = params.direction || 'both';
        this.shake.time = 0;
    }
    
    updateShake(deltaTime) {
        if (this.shake.intensity <= 0.1) {
            this.shake.intensity = 0;
            this.shake.x = 0;
            this.shake.y = 0;
            return;
        }
        
        this.shake.time += deltaTime;
        
        // Calculate shake offset using sine wave
        const angle = this.shake.time * this.shake.frequency * 0.01;
        const offsetX = Math.sin(angle) * this.shake.intensity;
        const offsetY = Math.cos(angle * 1.3) * this.shake.intensity;
        
        switch (this.shake.direction) {
            case 'horizontal':
                this.shake.x = offsetX;
                this.shake.y = 0;
                break;
            case 'vertical':
                this.shake.x = 0;
                this.shake.y = offsetY;
                break;
            case 'both':
            default:
                this.shake.x = offsetX;
                this.shake.y = offsetY;
                break;
        }
        
        // Decay intensity
        this.shake.intensity *= this.shake.decay;
        this.shake.duration -= deltaTime;
        
        if (this.shake.duration <= 0) {
            this.shake.intensity = 0;
        }
    }
    
    // === FLASH EFFECTS SYSTEM ===
    
    triggerFlash(type, customParams = {}) {
        if (!this.settings.flashEnabled) return;
        
        const flashTypes = {
            damage: { color: 'rgba(255, 50, 50, 0.3)', duration: 100, fadeSpeed: 0.15 },
            success: { color: 'rgba(50, 255, 50, 0.3)', duration: 100, fadeSpeed: 0.15 },
            critical: { color: 'rgba(255, 255, 255, 0.4)', duration: 80, fadeSpeed: 0.2 },
            combo: { color: 'rgba(255, 200, 0, 0.3)', duration: 80, fadeSpeed: 0.2 },
            victory: { color: 'rgba(255, 215, 0, 0.4)', duration: 150, fadeSpeed: 0.1 }
        };
        
        const params = { ...flashTypes[type], ...customParams };
        
        this.flash.active = true;
        this.flash.color = params.color;
        this.flash.alpha = params.maxAlpha || 0.8;
        this.flash.duration = params.duration;
        this.flash.fadeSpeed = params.fadeSpeed;
        this.flash.maxAlpha = this.flash.alpha;
    }
    
    updateFlash(deltaTime) {
        if (!this.flash.active) return;
        
        this.flash.alpha -= this.flash.fadeSpeed;
        this.flash.duration -= deltaTime;
        
        if (this.flash.alpha <= 0 || this.flash.duration <= 0) {
            this.flash.active = false;
            this.flash.alpha = 0;
        }
    }
    
    renderFlash() {
        if (!this.flash.active || this.flash.alpha <= 0) return;
        
        this.ctx.save();
        this.ctx.globalAlpha = this.flash.alpha;
        this.ctx.fillStyle = this.flash.color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    
    // === PULSE EFFECTS SYSTEM ===
    
    triggerPulse(type, intensity = 1.0) {
        if (!this.settings.pulseEnabled) return;
        
        const pulseTypes = {
            heartbeat: { frequency: 1.2, intensity: intensity },
            combo: { frequency: 2.0, intensity: intensity },
            adrenalin: { frequency: 3.0, intensity: intensity },
            victory: { frequency: 0.8, intensity: intensity }
        };
        
        this.pulse.active = true;
        this.pulse.type = type;
        this.pulse.frequency = pulseTypes[type].frequency;
        this.pulse.intensity = pulseTypes[type].intensity * this.settings.mobileReduction;
        this.pulse.time = 0;
    }
    
    stopPulse() {
        this.pulse.active = false;
        this.pulse.intensity = 0;
    }
    
    updatePulse(deltaTime) {
        if (!this.pulse.active) return;
        
        this.pulse.time += deltaTime * 0.001; // Convert to seconds
    }
    
    getPulseScale() {
        if (!this.pulse.active) return 1.0;
        
        const wave = Math.sin(this.pulse.time * this.pulse.frequency * Math.PI * 2);
        const pulseAmount = (wave * 0.5 + 0.5) * this.pulse.intensity * 0.05; // Max 5% scale change
        return 1.0 + pulseAmount;
    }
    
    // === CHROMATIC ABERRATION SYSTEM ===
    
    triggerAberration(type, intensity = 1.0, duration = 200) {
        if (!this.settings.aberrationEnabled) return;
        
        this.aberration.active = true;
        this.aberration.type = type;
        this.aberration.intensity = intensity * this.settings.mobileReduction;
        this.aberration.duration = duration;
    }
    
    updateAberration(deltaTime) {
        if (!this.aberration.active) return;
        
        this.aberration.duration -= deltaTime;
        
        if (this.aberration.duration <= 0) {
            this.aberration.active = false;
            this.aberration.intensity = 0;
        } else {
            // Fade out aberration
            const fadeRatio = this.aberration.duration / 200;
            this.aberration.intensity *= fadeRatio;
        }
    }
    
    // === MAIN UPDATE AND RENDER ===
    
    update(deltaTime) {
        this.updateShake(deltaTime);
        this.updateFlash(deltaTime);
        this.updatePulse(deltaTime);
        this.updateAberration(deltaTime);
    }
    
    applyEffects() {
        this.ctx.save();
        
        // Apply screen shake
        if (this.shake.intensity > 0) {
            this.ctx.translate(this.shake.x, this.shake.y);
        }
        
        // Apply pulse scaling
        const pulseScale = this.getPulseScale();
        if (pulseScale !== 1.0) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            this.ctx.translate(centerX, centerY);
            this.ctx.scale(pulseScale, pulseScale);
            this.ctx.translate(-centerX, -centerY);
        }
    }
    
    restoreEffects() {
        this.ctx.restore();
        
        // Render flash overlay on top
        this.renderFlash();
    }
    
    // === EVENT INTEGRATION HELPERS - OPTIMIZED ===
    
    onFormulaInput() {
        // Disabled for optimization
    }
    
    onCorrectAnswer() {
        // Disabled for optimization
    }
    
    onWrongAnswer() {
        // Disabled for optimization
    }
    
    onEnemyDeath() {
        // Minimal enemy death effect - only flash
        this.triggerFlash('critical');
        // Shake disabled for minimal effects
    }
    
    onComboIncrease(comboCount) {
        // Disabled for optimization
    }
    
    onLowHealth(healthPercent) {
        // Disabled for optimization
    }
    
    onCriticalHit() {
        // Disabled for optimization
    }
    
    onWaveComplete() {
        // Minimal wave complete effect - only yellow flash
        this.triggerFlash('victory');
        // Pulse and shake disabled for minimal effects
    }
    
    onBossAttack() {
        // Disabled for optimization
    }
    
    // === ITEM/UPGRADE EFFECTS - THESE MUST REMAIN ===
    
    onItemPurchase() {
        // Minimal item purchase effect - only flash
        this.triggerFlash('success');
        // Shake disabled for minimal effects
    }
    
    onUpgradeAcquired(upgradeRarity) {
        // Minimal upgrade effects - only flash based on rarity
        switch(upgradeRarity) {
            case 'legendary':
                this.triggerFlash('victory');
                break;
            case 'epic':
                this.triggerFlash('combo');
                break;
            default:
                this.triggerFlash('success');
        }
        // All shakes disabled for minimal effects
    }
    
    // === SETTINGS ===
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    setIntensity(multiplier) {
        this.settings.intensityMultiplier = Math.max(0, Math.min(2, multiplier));
    }
    
    toggleEffect(effectType, enabled) {
        switch (effectType) {
            case 'shake':
                this.settings.shakeEnabled = enabled;
                break;
            case 'flash':
                this.settings.flashEnabled = enabled;
                break;
            case 'pulse':
                this.settings.pulseEnabled = enabled;
                break;
            case 'aberration':
                this.settings.aberrationEnabled = enabled;
                break;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScreenEffects;
}
