/**
 * Particle System for Formel-Fury-Shooter
 * High-performance particle engine with object pooling and multiple particle types
 */

class ParticleSystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Performance settings - MINIMAL
        this.maxParticles = 100; // Drastically reduced for minimal effects
        this.activeParticles = [];
        this.particlePool = [];
        
        // Particle types
        this.PARTICLE_TYPES = {
            EXPLOSION: 'explosion',
            TRAIL: 'trail',
            FLOAT: 'float',
            SPARK: 'spark',
            FORMULA_SYMBOL: 'formula_symbol',
            SHOCKWAVE: 'shockwave',
            DEBRIS: 'debris'
        };
        
        // Mathematical symbols for formula particles
        this.mathSymbols = ['+', '-', '×', '÷', '=', 'x²', 'x³', '√', '∞', 'π', 'α', 'β', 'γ', '∑', '∫'];
        
        // Initialize particle pool
        this.initializePool();
    }
    
    initializePool() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particlePool.push(this.createParticleObject());
        }
    }
    
    createParticleObject() {
        return {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 0,
            maxLife: 0,
            size: 0,
            maxSize: 0,
            color: { r: 255, g: 255, b: 255, a: 1 },
            type: this.PARTICLE_TYPES.EXPLOSION,
            rotation: 0,
            rotationSpeed: 0,
            gravity: 0,
            drag: 0,
            symbol: '',
            active: false,
            scale: 1,
            pulseSpeed: 0,
            pulseAmplitude: 0
        };
    }
    
    getParticle() {
        // Try to get from pool first
        for (let particle of this.particlePool) {
            if (!particle.active) {
                particle.active = true;
                return particle;
            }
        }
        
        // If pool is full, reuse oldest active particle
        if (this.activeParticles.length > 0) {
            const oldestParticle = this.activeParticles[0];
            this.resetParticle(oldestParticle);
            return oldestParticle;
        }
        
        return null;
    }
    
    resetParticle(particle) {
        particle.x = 0;
        particle.y = 0;
        particle.vx = 0;
        particle.vy = 0;
        particle.life = 0;
        particle.maxLife = 0;
        particle.size = 0;
        particle.maxSize = 0;
        particle.color = { r: 255, g: 255, b: 255, a: 1 };
        particle.rotation = 0;
        particle.rotationSpeed = 0;
        particle.gravity = 0;
        particle.drag = 0;
        particle.symbol = '';
        particle.scale = 1;
        particle.pulseSpeed = 0;
        particle.pulseAmplitude = 0;
        particle.active = true;
    }
    
    // Create explosion particles - MINIMAL VERSION
    createExplosion(x, y, intensity = 1, color = null) {
        const particleCount = Math.floor(5 * intensity); // Reduced from 20 to 5
        const baseColor = color || { r: 255, g: 100, b: 0 };
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.getParticle();
            if (!particle) break;
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = (1 + Math.random() * 2) * intensity; // Reduced speed
            
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.life = 0.5; // Shorter life
            particle.maxLife = 0.5;
            particle.size = (2 + Math.random() * 3) * intensity; // Smaller size
            particle.maxSize = particle.size;
            particle.color = { ...baseColor, a: 1 };
            particle.type = this.PARTICLE_TYPES.EXPLOSION;
            particle.gravity = 0.1;
            particle.drag = 0.98;
            particle.rotationSpeed = 0; // No rotation
            
            this.activeParticles.push(particle);
        }
    }
    
    // Create formula symbol particles - DISABLED FOR MINIMAL EFFECTS
    createFormulaSymbols(x, y, intensity = 1, formulaType = 'binomial') {
        // Completely disabled for minimal effects
        return;
    }
    
    // Create energy trail particles - DISABLED FOR OPTIMIZATION
    createTrail(x, y, vx, vy, intensity = 1, color = null) {
        // Disabled for performance optimization
        return;
    }
    
    // Create spark particles - DISABLED FOR OPTIMIZATION
    createSparks(x, y, count = 5, color = null) {
        // Disabled for performance optimization
        return;
    }
    
    // Create shockwave effect - DISABLED FOR OPTIMIZATION
    createShockwave(x, y, maxRadius = 100, color = null) {
        // Disabled for performance optimization
        return;
    }
    
    // Update all particles
    update(deltaTime) {
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            
            // Update physics
            particle.vx *= particle.drag;
            particle.vy *= particle.drag;
            particle.vy += particle.gravity;
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed;
            
            // Update life
            particle.life -= deltaTime / 1000;
            
            // Update size and effects based on type
            this.updateParticleEffects(particle, deltaTime);
            
            // Remove dead particles
            if (particle.life <= 0 || this.isOffScreen(particle)) {
                particle.active = false;
                this.activeParticles.splice(i, 1);
            }
        }
    }
    
    updateParticleEffects(particle, deltaTime) {
        const lifeRatio = particle.life / particle.maxLife;
        
        switch (particle.type) {
            case this.PARTICLE_TYPES.EXPLOSION:
                particle.size = particle.maxSize * lifeRatio;
                particle.color.a = lifeRatio;
                break;
                
            case this.PARTICLE_TYPES.TRAIL:
                particle.size = particle.maxSize * lifeRatio;
                particle.color.a = lifeRatio * 0.8;
                break;
                
            case this.PARTICLE_TYPES.SPARK:
                particle.color.a = lifeRatio;
                break;
                
            case this.PARTICLE_TYPES.FORMULA_SYMBOL:
                particle.color.a = lifeRatio;
                // Pulsing effect
                particle.scale = 1 + Math.sin(Date.now() * particle.pulseSpeed) * particle.pulseAmplitude * lifeRatio;
                break;
                
            case this.PARTICLE_TYPES.SHOCKWAVE:
                particle.size = particle.maxSize * (1 - lifeRatio);
                particle.color.a = lifeRatio * 0.6;
                break;
        }
    }
    
    isOffScreen(particle) {
        const margin = 50;
        return particle.x < -margin || 
               particle.x > this.canvas.width + margin || 
               particle.y < -margin || 
               particle.y > this.canvas.height + margin;
    }
    
    // Render all particles
    render() {
        this.ctx.save();
        
        // Group particles by type for batch rendering
        const particlesByType = {};
        for (const particle of this.activeParticles) {
            if (!particlesByType[particle.type]) {
                particlesByType[particle.type] = [];
            }
            particlesByType[particle.type].push(particle);
        }
        
        // Render each type
        for (const [type, particles] of Object.entries(particlesByType)) {
            this.renderParticleType(type, particles);
        }
        
        this.ctx.restore();
    }
    
    renderParticleType(type, particles) {
        switch (type) {
            case this.PARTICLE_TYPES.EXPLOSION:
            case this.PARTICLE_TYPES.TRAIL:
            case this.PARTICLE_TYPES.SPARK:
                this.renderCircleParticles(particles);
                break;
                
            case this.PARTICLE_TYPES.FORMULA_SYMBOL:
                this.renderSymbolParticles(particles);
                break;
                
            case this.PARTICLE_TYPES.SHOCKWAVE:
                this.renderShockwaveParticles(particles);
                break;
        }
    }
    
    renderCircleParticles(particles) {
        for (const particle of particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.color.a;
            this.ctx.fillStyle = `rgb(${particle.color.r}, ${particle.color.g}, ${particle.color.b})`;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    renderSymbolParticles(particles) {
        for (const particle of particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.color.a;
            this.ctx.fillStyle = `rgb(${particle.color.r}, ${particle.color.g}, ${particle.color.b})`;
            this.ctx.font = `bold ${particle.size * particle.scale}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.fillText(particle.symbol, 0, 0);
            
            this.ctx.restore();
        }
    }
    
    renderShockwaveParticles(particles) {
        for (const particle of particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.color.a;
            this.ctx.strokeStyle = `rgb(${particle.color.r}, ${particle.color.g}, ${particle.color.b})`;
            this.ctx.lineWidth = 3;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.restore();
        }
    }
    
    // Clear all particles
    clear() {
        for (const particle of this.activeParticles) {
            particle.active = false;
        }
        this.activeParticles = [];
    }
    
    // Get performance stats
    getStats() {
        return {
            activeParticles: this.activeParticles.length,
            poolSize: this.particlePool.length,
            poolUtilization: (this.activeParticles.length / this.maxParticles * 100).toFixed(1) + '%'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
} else {
    window.ParticleSystem = ParticleSystem;
}
