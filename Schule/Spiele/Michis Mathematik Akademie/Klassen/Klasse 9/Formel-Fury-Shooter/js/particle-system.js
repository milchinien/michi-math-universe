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
            type: this.PARTICLE_TYPES.SPARK,
            symbol: '+',
            rotation: 0,
            rotationSpeed: 0,
            gravity: 0,
            friction: 1,
            active: false,
            trail: [],
            shockwaveRadius: 0,
            maxShockwaveRadius: 0
        };
    }
    
    getParticle() {
        // Try to get from pool first
        for (let i = 0; i < this.particlePool.length; i++) {
            if (!this.particlePool[i].active) {
                this.particlePool[i].active = true;
                return this.particlePool[i];
            }
        }
        
        // If pool is full, reuse oldest active particle
        if (this.activeParticles.length > 0) {
            const oldest = this.activeParticles[0];
            this.resetParticle(oldest);
            return oldest;
        }
        
        // Fallback: create new particle (should rarely happen)
        return this.createParticleObject();
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
        particle.type = this.PARTICLE_TYPES.SPARK;
        particle.symbol = '+';
        particle.rotation = 0;
        particle.rotationSpeed = 0;
        particle.gravity = 0;
        particle.friction = 1;
        particle.active = true;
        particle.trail = [];
        particle.shockwaveRadius = 0;
        particle.maxShockwaveRadius = 0;
    }
    
    returnParticle(particle) {
        particle.active = false;
        const index = this.activeParticles.indexOf(particle);
        if (index > -1) {
            this.activeParticles.splice(index, 1);
        }
    }
    
    // Explosion particles
    createExplosion(x, y, intensity = 1, color = { r: 255, g: 100, b: 0 }) {
        const particleCount = Math.min(8 * intensity, 20); // Reduced count
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.getParticle();
            if (!particle) continue;
            
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = (50 + Math.random() * 100) * intensity;
            
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.life = 1.0;
            particle.maxLife = 1.0;
            particle.size = (2 + Math.random() * 4) * intensity;
            particle.maxSize = particle.size;
            particle.color = { ...color, a: 1 };
            particle.type = this.PARTICLE_TYPES.EXPLOSION;
            particle.gravity = 50;
            particle.friction = 0.95;
            
            this.activeParticles.push(particle);
        }
    }
    
    // Spark particles
    createSparks(x, y, count = 5, color = { r: 255, g: 255, b: 0 }) {
        for (let i = 0; i < count; i++) {
            const particle = this.getParticle();
            if (!particle) continue;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 70;
            
            particle.x = x + (Math.random() - 0.5) * 20;
            particle.y = y + (Math.random() - 0.5) * 20;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed;
            particle.life = 0.5 + Math.random() * 0.5;
            particle.maxLife = particle.life;
            particle.size = 1 + Math.random() * 2;
            particle.maxSize = particle.size;
            particle.color = { ...color, a: 1 };
            particle.type = this.PARTICLE_TYPES.SPARK;
            particle.gravity = 20;
            particle.friction = 0.98;
            
            this.activeParticles.push(particle);
        }
    }
    
    // Shockwave effect
    createShockwave(x, y, maxRadius = 100, color = { r: 255, g: 255, b: 255 }) {
        const particle = this.getParticle();
        if (!particle) return;
        
        particle.x = x;
        particle.y = y;
        particle.vx = 0;
        particle.vy = 0;
        particle.life = 1.0;
        particle.maxLife = 1.0;
        particle.size = 2;
        particle.maxSize = 2;
        particle.color = { ...color, a: 0.8 };
        particle.type = this.PARTICLE_TYPES.SHOCKWAVE;
        particle.shockwaveRadius = 0;
        particle.maxShockwaveRadius = maxRadius;
        particle.gravity = 0;
        particle.friction = 1;
        
        this.activeParticles.push(particle);
    }
    
    // Formula symbol particles
    createFormulaSymbols(x, y, intensity = 1, color = { r: 255, g: 255, b: 0 }) {
        const symbolCount = Math.min(3 * intensity, 6); // Reduced count
        
        for (let i = 0; i < symbolCount; i++) {
            const particle = this.getParticle();
            if (!particle) continue;
            
            const angle = (i / symbolCount) * Math.PI * 2;
            const speed = (20 + Math.random() * 40) * intensity;
            
            particle.x = x;
            particle.y = y;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed - 30; // Float upward
            particle.life = 1.5;
            particle.maxLife = 1.5;
            particle.size = (8 + Math.random() * 6) * intensity;
            particle.maxSize = particle.size;
            particle.color = { ...color, a: 1 };
            particle.type = this.PARTICLE_TYPES.FORMULA_SYMBOL;
            particle.symbol = this.mathSymbols[Math.floor(Math.random() * this.mathSymbols.length)];
            particle.rotationSpeed = (Math.random() - 0.5) * 4;
            particle.gravity = -10; // Negative gravity for floating
            particle.friction = 0.96;
            
            this.activeParticles.push(particle);
        }
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000; // Convert to seconds
        
        // Update all active particles
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            
            // Update life
            particle.life -= dt;
            
            if (particle.life <= 0) {
                this.returnParticle(particle);
                continue;
            }
            
            // Update physics
            particle.vy += particle.gravity * dt;
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed * dt;
            
            // Update type-specific properties
            if (particle.type === this.PARTICLE_TYPES.SHOCKWAVE) {
                const progress = 1 - (particle.life / particle.maxLife);
                particle.shockwaveRadius = progress * particle.maxShockwaveRadius;
            }
            
            // Update alpha based on life
            particle.color.a = particle.life / particle.maxLife;
        }
    }
    
    render() {
        if (this.activeParticles.length === 0) return;
        
        this.ctx.save();
        
        for (const particle of this.activeParticles) {
            this.ctx.globalAlpha = particle.color.a;
            
            switch (particle.type) {
                case this.PARTICLE_TYPES.EXPLOSION:
                case this.PARTICLE_TYPES.SPARK:
                    this.renderBasicParticle(particle);
                    break;
                    
                case this.PARTICLE_TYPES.SHOCKWAVE:
                    this.renderShockwave(particle);
                    break;
                    
                case this.PARTICLE_TYPES.FORMULA_SYMBOL:
                    this.renderFormulaSymbol(particle);
                    break;
            }
        }
        
        this.ctx.restore();
    }
    
    renderBasicParticle(particle) {
        this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.color.a})`;
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderShockwave(particle) {
        this.ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.color.a})`;
        this.ctx.lineWidth = particle.size;
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.shockwaveRadius, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    renderFormulaSymbol(particle) {
        this.ctx.save();
        
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        
        this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.color.a})`;
        this.ctx.font = `bold ${particle.size}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        this.ctx.fillText(particle.symbol, 0, 0);
        
        this.ctx.restore();
    }
    
    // Performance monitoring
    getStats() {
        const poolUtilization = `${Math.round((this.activeParticles.length / this.maxParticles) * 100)}%`;
        
        return {
            activeParticles: this.activeParticles.length,
            poolUtilization: poolUtilization,
            maxParticles: this.maxParticles
        };
    }
    
    // Cleanup method
    clear() {
        this.activeParticles.forEach(particle => this.returnParticle(particle));
        this.activeParticles = [];
    }
}
