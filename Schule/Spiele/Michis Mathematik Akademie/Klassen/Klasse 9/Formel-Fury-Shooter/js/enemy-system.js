/**
 * FORMEL-FURY-SHOOTER - ENEMY SYSTEM
 * Handles enemy AI, rendering, and spawning mechanics
 * Phase 4.2: Modulare Struktur
 */

class Enemy {
    constructor(x, y, type = 'polynom_zombie') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.typeData = this.getTypeData(type);
        this.width = this.typeData.width;
        this.height = this.typeData.height;
        this.color = this.typeData.color;
        this.glowColor = this.typeData.glowColor;
        this.shape = this.typeData.shape;
        this.speed = this.typeData.speed;
        this.health = this.typeData.health;
        this.maxHealth = this.typeData.health;
        this.damage = this.typeData.damage;
        this.coinValue = this.typeData.coinValue;
        this.xpValue = this.typeData.xpValue;
        
        this.vx = 0;
        this.vy = 0;
        this.isTargeted = false;
        this.isDead = false;
        this.deathTime = 0;
        this.formula = null;
        this.lastPlayerDistance = Infinity;
        this.isCore = false;
        
        // Animation properties for intelligent behavior
        this.animationTime = Math.random() * Math.PI * 2;
        this.thinkingPulse = 0;
        this.antennaWave = 0;
        this.eyeGlow = 0.5;
        this.processingState = 'idle'; // idle, thinking, calculating, alert
        this.lastStateChange = Date.now();
        
        this.generateFormula();
    }

    getTypeData(type) {
        const types = {
            'polynom_zombie': {
                name: 'Polynom-Zombie',
                width: 35,
                height: 35,
                speed: 60,
                maxSpeed: 90,
                health: 80,
                damage: 10,
                coinValue: 5,
                xpValue: 10,
                acceleration: 300,
                color: '#8B4513',
                glowColor: 'rgba(139, 69, 19, 0.5)',
                shape: 'hexagon',
                directionInterval: 150,
                rotationSpeed: 0.02,
                scoreMultiplier: 1.0,
                difficultyBias: -0.5 // Prefers easier formulas
            },
            'gleichungs_geist': {
                name: 'Gleichungs-Geist',
                width: 25,
                height: 25,
                speed: 120,
                maxSpeed: 180,
                health: 60,
                damage: 15,
                coinValue: 8,
                xpValue: 15,
                acceleration: 600,
                color: '#A0522D',
                glowColor: 'rgba(160, 82, 45, 0.5)',
                shape: 'diamond',
                directionInterval: 80,
                rotationSpeed: 0.05,
                scoreMultiplier: 1.3,
                difficultyBias: 0 // Normal difficulty
            },
            'elite_mob': {
                name: 'Elite-Algebra-Bestie',
                width: 45,
                height: 45,
                speed: 40,
                maxSpeed: 70,
                health: 150,
                damage: 25,
                coinValue: 15,
                xpValue: 30,
                acceleration: 200,
                color: '#654321',
                glowColor: 'rgba(101, 67, 33, 0.5)',
                shape: 'star',
                directionInterval: 200,
                rotationSpeed: 0.01,
                scoreMultiplier: 2.0,
                difficultyBias: 1.0 // Prefers harder formulas
            },
            'basic': {
                name: 'Standard-Gegner',
                width: 30,
                height: 30,
                speed: 80,
                maxSpeed: 120,
                health: 100,
                damage: 12,
                coinValue: 6,
                xpValue: 12,
                acceleration: 400,
                color: '#CD853F',
                glowColor: 'rgba(205, 133, 63, 0.5)',
                shape: 'hexagon',
                directionInterval: 100,
                rotationSpeed: 0.03,
                scoreMultiplier: 1.0,
                difficultyBias: 0
            }
        };

        return types[type] || types['basic'];
    }

    generateFormula() {
        // Use the main formula system to generate varied formula types
        if (window.game && window.game.formulaSystem) {
            const formula = window.game.formulaSystem.generateFormula();
            this.assignedFormula = {
                type: formula.type,
                typeName: formula.typeName,
                text: formula.text,
                solutions: formula.solutions,
                difficulty: formula.difficulty,
                variable: formula.variable,
                a: formula.a,
                b: formula.b
            };
        } else {
            // Fallback to first binomial if formula system not available
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 5) + 1;
            const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
            const variable = variables[Math.floor(Math.random() * variables.length)];
            
            const text = `(${a}${variable} + ${b})²`;
            const expanded = `${a*a}${variable}² + ${2*a*b}${variable} + ${b*b}`;
            const solutions = [expanded];
            
            this.assignedFormula = {
                type: 'expansion_plus',
                typeName: 'Erste Binomische Formel',
                text: text,
                solutions: solutions,
                difficulty: this.getDifficultyForType(),
                variable: variable,
                a: a,
                b: b
            };
        }
        
        // Also set formula for backward compatibility
        this.formula = this.assignedFormula;
    }
    
    getDifficultyForType() {
        switch (this.type) {
            case 'polynom_zombie': return 1.0;
            case 'gleichungs_geist': return 1.5;
            case 'elite_mob': return 2.0;
            default: return 1.2;
        }
    }

    update(deltaTime, player) {
        if (this.isDead) {
            this.deathTime += deltaTime;
            return;
        }
        
        // Update animation timers
        this.animationTime += deltaTime * 2;
        this.thinkingPulse = Math.sin(this.animationTime * 0.8) * 0.3 + 0.7;
        this.antennaWave = Math.sin(this.animationTime * 1.2) * 0.1;
        this.eyeGlow = Math.sin(this.animationTime * 0.6) * 0.2 + 0.8;
        
        // Calculate distance to player
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Update AI state based on distance and behavior
        this.updateAIState(distance);
        
        // Update targeting based on distance
        this.isTargeted = distance < 150;
        
        // Move towards player with intelligent behavior
        if (distance > 0) {
            const speedMultiplier = this.getSpeedMultiplier();
            const moveSpeed = this.speed * speedMultiplier * deltaTime * 0.001; // Convert deltaTime to seconds
            this.vx = (dx / distance) * moveSpeed;
            this.vy = (dy / distance) * moveSpeed;
            
            this.x += this.vx;
            this.y += this.vy;
        }
        
        this.lastPlayerDistance = distance;
    }

    updateAIState(distance) {
        // Update AI state based on distance and behavior
        const currentTime = Date.now();
        
        if (distance < 50) {
            // Alert state
            if (this.processingState !== 'alert') {
                this.processingState = 'alert';
                this.lastStateChange = currentTime;
            }
        } else if (distance < 100) {
            // Calculating state
            if (this.processingState !== 'calculating') {
                this.processingState = 'calculating';
                this.lastStateChange = currentTime;
            }
        } else if (distance < 150) {
            // Thinking state
            if (this.processingState !== 'thinking') {
                this.processingState = 'thinking';
                this.lastStateChange = currentTime;
            }
        } else {
            // Idle state
            if (this.processingState !== 'idle') {
                this.processingState = 'idle';
                this.lastStateChange = currentTime;
            }
        }
    }

    getSpeedMultiplier() {
        // Calculate speed multiplier based on AI state
        switch (this.processingState) {
            case 'alert':
                return 1.5;
            case 'calculating':
                return 1.2;
            case 'thinking':
                return 1.0;
            default:
                return 0.8;
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }

    isCollidingWith(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (this.width + other.width) / 2;
        return distance < minDistance;
    }

    render(ctx) {
        if (this.isDead && this.deathTimer >= this.deathDuration) {
            return; // Don't render if fully dead
        }
        
        ctx.save();
        
        // Death animation effect
        if (this.isDead) {
            const deathProgress = this.deathTimer / this.deathDuration;
            ctx.globalAlpha = 1 - deathProgress;
            ctx.scale(1 + deathProgress * 0.5, 1 + deathProgress * 0.5);
        }
        
        // Type-specific pulsing glow effect
        const pulseIntensity = 0.3 + 0.2 * Math.sin(this.pulsePhase);
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 15 * pulseIntensity;
        
        // Translate to enemy position
        ctx.translate(this.x, this.y);
        
        // Rotate based on movement direction and type-specific speed
        ctx.rotate(this.angle);
        
        // Draw enemy body based on shape type
        ctx.fillStyle = this.color;
        this.renderShape(ctx);
        
        // Draw type-specific inner core
        this.renderCore(ctx);
        
        // Draw health bar
        ctx.restore();
        this.renderHealthBar(ctx);
        
        // Draw type indicator
        this.renderTypeIndicator(ctx);
        
        // Draw targeting indicator
        if (this.showTargetIndicator && !this.isDead) {
            this.renderTargetIndicator(ctx);
        }
        
        // Draw formula if player is nearby
        if (this.isTargeted && !this.isDead) {
            this.renderFormula(ctx);
        }
    }

    renderShape(ctx) {
        // Draw sophisticated robot-like enemy based on type
        this.renderRobotBody(ctx);
        this.renderRobotDetails(ctx);
    }

    renderRobotBody(ctx) {
        const bodySize = Math.min(this.width, this.height) * 0.4;
        const headSize = bodySize * 0.6;
        
        // Main body (circular/rounded)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 2, bodySize, 0, Math.PI * 2);
        ctx.fill();
        
        // Body outline for depth
        ctx.strokeStyle = this.getDarkerColor(this.color);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Head/face area
        ctx.fillStyle = this.getLighterColor(this.color);
        ctx.beginPath();
        ctx.arc(0, -headSize * 0.5, headSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = this.getDarkerColor(this.color);
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    renderRobotDetails(ctx) {
        const size = Math.min(this.width, this.height);
        const bodySize = size * 0.4;
        const headSize = bodySize * 0.6;
        
        // Apply strength-based size variations
        const strengthMultiplier = this.getStrengthMultiplier();
        const adjustedBodySize = bodySize * strengthMultiplier;
        const adjustedHeadSize = headSize * strengthMultiplier;
        
        // Antennas (different based on type)
        this.renderAntennas(ctx, adjustedHeadSize);
        
        // Arms
        this.renderArms(ctx, adjustedBodySize);
        
        // Face/Display (shows mathematical symbol)
        this.renderFaceDisplay(ctx, adjustedHeadSize);
        
        // Body details (screws, panels, etc.)
        this.renderBodyDetails(ctx, adjustedBodySize);
        
        // Type-specific enhancements
        this.renderTypeSpecificDetails(ctx, size);
        
        // Intelligence indicators (thinking effects)
        this.renderIntelligenceEffects(ctx, adjustedHeadSize);
    }

    renderAntennas(ctx, headSize) {
        ctx.strokeStyle = this.getDarkerColor(this.color);
        ctx.lineWidth = 2;
        
        // Apply subtle animation wave to antennas
        const waveOffset = this.antennaWave;
        
        // Different antenna styles based on enemy type
        switch (this.type) {
            case 'polynom_zombie':
                // Simple straight antennas with subtle movement
                ctx.beginPath();
                ctx.moveTo(-headSize * 0.3 + waveOffset, -headSize * 0.8);
                ctx.lineTo(-headSize * 0.3 + waveOffset, -headSize * 1.3);
                ctx.moveTo(headSize * 0.3 - waveOffset, -headSize * 0.8);
                ctx.lineTo(headSize * 0.3 - waveOffset, -headSize * 1.3);
                ctx.stroke();
                
                // Antenna tips with intelligence glow
                const glowIntensity = this.processingState === 'thinking' ? this.thinkingPulse : 0.5;
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.glowColor;
                ctx.shadowBlur = 5 * glowIntensity;
                ctx.beginPath();
                ctx.arc(-headSize * 0.3 + waveOffset, -headSize * 1.3, 2, 0, Math.PI * 2);
                ctx.arc(headSize * 0.3 - waveOffset, -headSize * 1.3, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
                
            case 'gleichungs_geist':
                // Curved antennas with enhanced movement
                ctx.beginPath();
                ctx.moveTo(-headSize * 0.2 + waveOffset * 0.5, -headSize * 0.7);
                ctx.quadraticCurveTo(-headSize * 0.5 + waveOffset, -headSize * 1.2, -headSize * 0.1 + waveOffset * 0.3, -headSize * 1.4);
                ctx.moveTo(headSize * 0.2 - waveOffset * 0.5, -headSize * 0.7);
                ctx.quadraticCurveTo(headSize * 0.5 - waveOffset, -headSize * 1.2, headSize * 0.1 - waveOffset * 0.3, -headSize * 1.4);
                ctx.stroke();
                break;
                
            case 'elite_mob':
                // Multiple complex antennas with sophisticated movement
                const eliteWave = waveOffset * 0.7;
                ctx.beginPath();
                ctx.moveTo(-headSize * 0.4 + eliteWave, -headSize * 0.8);
                ctx.lineTo(-headSize * 0.4 + eliteWave, -headSize * 1.5);
                ctx.moveTo(0, -headSize * 0.9);
                ctx.lineTo(0, -headSize * 1.6);
                ctx.moveTo(headSize * 0.4 - eliteWave, -headSize * 0.8);
                ctx.lineTo(headSize * 0.4 - eliteWave, -headSize * 1.5);
                ctx.stroke();
                
                // Elite antenna decorations with enhanced glow
                ctx.fillStyle = '#FFD700';
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 8 * this.thinkingPulse;
                ctx.beginPath();
                ctx.arc(-headSize * 0.4 + eliteWave, -headSize * 1.5, 3, 0, Math.PI * 2);
                ctx.arc(0, -headSize * 1.6, 3, 0, Math.PI * 2);
                ctx.arc(headSize * 0.4 - eliteWave, -headSize * 1.5, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
                
            default:
                // Basic antennas with minimal animation
                ctx.beginPath();
                ctx.moveTo(-headSize * 0.25 + waveOffset * 0.3, -headSize * 0.8);
                ctx.lineTo(-headSize * 0.25 + waveOffset * 0.3, -headSize * 1.2);
                ctx.moveTo(headSize * 0.25 - waveOffset * 0.3, -headSize * 0.8);
                ctx.lineTo(headSize * 0.25 - waveOffset * 0.3, -headSize * 1.2);
                ctx.stroke();
                break;
        }
    }

    renderArms(ctx, bodySize) {
        ctx.strokeStyle = this.getDarkerColor(this.color);
        ctx.lineWidth = 3;
        
        // Left arm
        ctx.beginPath();
        ctx.moveTo(-bodySize * 0.8, 0);
        ctx.lineTo(-bodySize * 1.3, bodySize * 0.3);
        ctx.stroke();
        
        // Right arm
        ctx.beginPath();
        ctx.moveTo(bodySize * 0.8, 0);
        ctx.lineTo(bodySize * 1.3, bodySize * 0.3);
        ctx.stroke();
        
        // Hands/Claws
        ctx.fillStyle = this.getDarkerColor(this.color);
        ctx.beginPath();
        ctx.arc(-bodySize * 1.3, bodySize * 0.3, 4, 0, Math.PI * 2);
        ctx.arc(bodySize * 1.3, bodySize * 0.3, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    renderFaceDisplay(ctx, headSize) {
        // Display screen area
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(0, -headSize * 0.5, headSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Mathematical symbol based on type
        ctx.fillStyle = this.getDisplayColor();
        ctx.font = `bold ${headSize * 0.8}px Courier New`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const symbol = this.getMathSymbol();
        ctx.fillText(symbol, 0, -headSize * 0.5);
        
        // Display border
        ctx.strokeStyle = this.getDarkerColor(this.color);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -headSize * 0.5, headSize * 0.6, 0, Math.PI * 2);
        ctx.stroke();
    }

    renderBodyDetails(ctx, bodySize) {
        // Screws/bolts
        ctx.fillStyle = this.getDarkerColor(this.color);
        const screwPositions = [
            [-bodySize * 0.6, -bodySize * 0.3],
            [bodySize * 0.6, -bodySize * 0.3],
            [-bodySize * 0.6, bodySize * 0.5],
            [bodySize * 0.6, bodySize * 0.5]
        ];
        
        screwPositions.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Screw lines
            ctx.strokeStyle = this.getDarkerColor(this.color);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x - 1.5, y);
            ctx.lineTo(x + 1.5, y);
            ctx.stroke();
        });
        
        // Body panel lines
        ctx.strokeStyle = this.getDarkerColor(this.color);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-bodySize * 0.8, 0);
        ctx.lineTo(bodySize * 0.8, 0);
        ctx.moveTo(0, -bodySize * 0.3);
        ctx.lineTo(0, bodySize * 0.8);
        ctx.stroke();
    }

    renderTypeSpecificDetails(ctx, size) {
        switch (this.type) {
            case 'elite_mob':
                // Elite decorations
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(0, 2, size * 0.5, 0, Math.PI * 2);
                ctx.stroke();
                break;
                
            case 'gleichungs_geist':
                // Energy field effect
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                break;
        }
    }

    getMathSymbol() {
        switch (this.type) {
            case 'polynom_zombie': return '+';
            case 'gleichungs_geist': return '=';
            case 'elite_mob': return '∑';
            default: return '×';
        }
    }

    getDisplayColor() {
        switch (this.type) {
            case 'polynom_zombie': return '#90EE90';
            case 'gleichungs_geist': return '#87CEEB';
            case 'elite_mob': return '#FFD700';
            default: return '#FF6B6B';
        }
    }

    getDarkerColor(color) {
        // Convert hex to RGB and darken
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
        return `rgb(${r}, ${g}, ${b})`;
    }

    getLighterColor(color) {
        // Convert hex to RGB and lighten
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 30);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 30);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 30);
        return `rgb(${r}, ${g}, ${b})`;
    }

    getStrengthMultiplier() {
        // Size multiplier based on enemy strength/health
        switch (this.type) {
            case 'elite_mob':
                return 1.3; // Larger, more imposing
            case 'gleichungs_geist':
                return 1.1; // Slightly larger
            case 'polynom_zombie':
                return 0.9; // Smaller, basic enemy
            default:
                return 1.0;
        }
    }

    renderIntelligenceEffects(ctx, headSize) {
        // Render thinking/processing indicators
        switch (this.processingState) {
            case 'thinking':
                // Pulsing thought bubble effect
                ctx.strokeStyle = this.glowColor;
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 2]);
                ctx.globalAlpha = this.thinkingPulse * 0.6;
                ctx.beginPath();
                ctx.arc(-headSize * 0.8, -headSize * 1.2, 4 * this.thinkingPulse, 0, Math.PI * 2);
                ctx.arc(-headSize * 0.6, -headSize * 1.4, 2 * this.thinkingPulse, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.globalAlpha = 1;
                break;
                
            case 'calculating':
                // Data stream effect
                ctx.fillStyle = this.getDisplayColor();
                ctx.globalAlpha = 0.7;
                ctx.font = `${headSize * 0.3}px Courier New`;
                ctx.textAlign = 'center';
                const calcSymbols = ['0', '1', '+', '-', '×'];
                for (let i = 0; i < 3; i++) {
                    const symbol = calcSymbols[Math.floor((this.animationTime + i) * 2) % calcSymbols.length];
                    const y = -headSize * 1.5 + (this.animationTime * 20 + i * 10) % 40;
                    ctx.fillText(symbol, headSize * 0.8, y);
                }
                ctx.globalAlpha = 1;
                break;
                
            case 'alert':
                // Alert glow around head
                ctx.strokeStyle = '#FF4444';
                ctx.lineWidth = 2;
                ctx.globalAlpha = this.eyeGlow * 0.8;
                ctx.beginPath();
                ctx.arc(0, -headSize * 0.5, headSize * 0.8, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1;
                break;
        }
        
        // Eye glow effect for all states
        if (this.processingState !== 'idle') {
            ctx.fillStyle = this.getDisplayColor();
            ctx.shadowColor = this.getDisplayColor();
            ctx.shadowBlur = 3 * this.eyeGlow;
            ctx.beginPath();
            ctx.arc(-headSize * 0.2, -headSize * 0.6, 1, 0, Math.PI * 2);
            ctx.arc(headSize * 0.2, -headSize * 0.6, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    renderCore(ctx) {
        ctx.fillStyle = '#ffffff';
        
        switch (this.type) {
            case 'polynom_zombie':
                // Simple dot
                ctx.beginPath();
                ctx.arc(0, 0, 3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'gleichungs_geist':
                // Cross pattern
                ctx.fillRect(-1, -6, 2, 12);
                ctx.fillRect(-6, -1, 12, 2);
                break;
                
            case 'elite_mob':
                // Complex pattern
                ctx.beginPath();
                ctx.arc(0, 0, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillRect(-1, -8, 2, 16);
                ctx.fillRect(-8, -1, 16, 2);
                break;
                
            default:
                ctx.beginPath();
                ctx.arc(0, 0, 4, 0, Math.PI * 2);
                ctx.fill();
        }
    }

    renderTypeIndicator(ctx) {
        if (this.type === 'basic') return;
        
        // Small type indicator above enemy
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        
        let indicator = '';
        switch (this.type) {
            case 'polynom_zombie':
                indicator = 'PZ';
                break;
            case 'gleichungs_geist':
                indicator = 'GG';
                break;
            case 'elite_mob':
                indicator = 'EB';
                break;
        }
        
        const textY = this.y - this.height / 2 - 45;
        ctx.fillText(indicator, this.x, textY);
        ctx.restore();
    }

    renderHealthBar(ctx) {
        if (this.health >= this.maxHealth) return; // Don't show full health
        
        const barWidth = this.width + 10;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 10;
        
        // Background
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        const healthColor = healthPercent > 0.6 ? '#00ff00' : healthPercent > 0.3 ? '#ffff00' : '#ff0000';
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    renderFormula(ctx) {
        if (!this.assignedFormula) return;
        
        ctx.save();
        
        // Formula background
        const text = this.assignedFormula.text;
        ctx.font = '16px Courier New';
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 20;
        
        const bgX = this.x - textWidth / 2 - 5;
        const bgY = this.y - this.height / 2 - 35;
        
        // Background with glow
        ctx.shadowColor = '#ff330080';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(bgX, bgY, textWidth + 10, textHeight + 5);
        
        // Border
        ctx.strokeStyle = '#ff3300';
        ctx.lineWidth = 1;
        ctx.strokeRect(bgX, bgY, textWidth + 10, textHeight + 5);
        
        // Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ff3300';
        ctx.textAlign = 'center';
        ctx.fillText(text, this.x, this.y - this.height / 2 - 20);
        
        ctx.restore();
    }

    renderTargetIndicator(ctx) {
        ctx.save();
        
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ffff0080';
        ctx.shadowBlur = 5;
        
        // Draw targeting crosshairs
        const size = this.width / 2 + 15;
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cross lines
        ctx.beginPath();
        ctx.moveTo(this.x - size - 5, this.y);
        ctx.lineTo(this.x - size + 5, this.y);
        ctx.moveTo(this.x + size - 5, this.y);
        ctx.lineTo(this.x + size + 5, this.y);
        ctx.moveTo(this.x, this.y - size - 5);
        ctx.lineTo(this.x, this.y - size + 5);
        ctx.moveTo(this.x, this.y + size - 5);
        ctx.lineTo(this.x, this.y + size + 5);
        ctx.stroke();
        
        // Target text
        ctx.fillStyle = '#ffff00';
        ctx.font = '12px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('KLICKEN ZUM ANGRIFF', this.x, this.y + size + 20);
        
        ctx.restore();
    }

    shouldBeRemoved() {
        // Nur entfernen wenn tot und Animation abgeschlossen
        if (this.isDead) {
            const deathDuration = 1000; // 1 Sekunde
            return Date.now() - (this.deathTime || 0) > deathDuration;
        }
        return this.health <= 0;
    }

    getDebugInfo() {
        return {
            type: this.typeName,
            position: `(${Math.round(this.x)}, ${Math.round(this.y)})`,
            health: `${this.health}/${this.maxHealth}`,
            formula: this.assignedFormula ? this.assignedFormula.text : 'None',
            difficulty: this.assignedFormula ? this.assignedFormula.difficulty.toFixed(1) : 'N/A',
            isTargeted: this.isTargeted
        };
    }
}

class EnemySpawner {
    constructor(formulaSystem) {
        this.formulaSystem = formulaSystem;
        this.enemies = [];
        this.spawnTimer = 0;
        this.spawnInterval = 5000; // Spawn every 5 seconds (weniger häufig)
        this.maxEnemies = 3; // Weniger Gegner gleichzeitig
        this.spawnDistance = 100; // Minimum distance from player to spawn
        
        // Spawn markers system
        this.spawnMarkers = []; // Array of spawn markers
        this.markerDuration = 3000; // 3 seconds before spawn
        
        // Spawn probability configuration
        this.spawnProbabilities = {
            polynom_zombie: 0.5,    // 50% base chance
            gleichungs_geist: 0.3,  // 30% base chance
            elite_mob: 0.1,         // 10% base chance
            basic: 0.1              // 10% fallback
        };
    }

    getSpawnType(playerScore, combo) {
        // Adjust probabilities based on player progress
        let probabilities = { ...this.spawnProbabilities };
        
        // Early game (score < 500): More zombies, fewer advanced
        if (playerScore < 500) {
            probabilities.polynom_zombie = 0.7;
            probabilities.gleichungs_geist = 0.2;
            probabilities.elite_mob = 0.05;
            probabilities.basic = 0.05;
        }
        // Mid game (500-1500): Balanced
        else if (playerScore < 1500) {
            probabilities.polynom_zombie = 0.4;
            probabilities.gleichungs_geist = 0.4;
            probabilities.elite_mob = 0.15;
            probabilities.basic = 0.05;
        }
        // Late game (1500+): More advanced enemies
        else {
            probabilities.polynom_zombie = 0.2;
            probabilities.gleichungs_geist = 0.4;
            probabilities.elite_mob = 0.35;
            probabilities.basic = 0.05;
        }
        
        // High combo = more elite enemies
        if (combo >= 5) {
            probabilities.elite_mob += 0.1;
            probabilities.polynom_zombie -= 0.05;
            probabilities.gleichungs_geist -= 0.05;
        }
        
        if (combo >= 10) {
            probabilities.elite_mob += 0.15;
            probabilities.polynom_zombie -= 0.1;
            probabilities.gleichungs_geist -= 0.05;
        }
        
        // Select type based on probabilities
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [type, prob] of Object.entries(probabilities)) {
            cumulative += prob;
            if (rand <= cumulative) {
                return type;
            }
        }
        
        return 'basic'; // Fallback
    }

    update(deltaTime, player) {
        this.spawnTimer += deltaTime;
        
        // Dynamic spawn interval based on progress
        let currentSpawnInterval = this.spawnInterval;
        const playerScore = player.score || 0;
        if (playerScore > 1000) currentSpawnInterval = 2500; // Faster spawning
        if (playerScore > 2000) currentSpawnInterval = 2000; // Even faster
        
        // Update spawn markers
        this.updateSpawnMarkers(deltaTime);
        
        // Get wave data for enemy spawning - improved integration
        let waveData = null;
        let maxEnemiesForWave = this.maxEnemies;
        let waveSpawnRate = currentSpawnInterval;
        let isWaveActive = true;
        
        try {
            if (window.game && window.game.waveSystem) {
                waveData = window.game.waveSystem.getWaveData();
                if (waveData) {
                    maxEnemiesForWave = waveData.enemiesPerWave || this.maxEnemies;
                    waveSpawnRate = waveData.spawnRate || currentSpawnInterval;
                }
                isWaveActive = window.game.waveSystem.isWaveActive !== false;
            }
        } catch (e) {
            console.warn('⚠️ EnemySpawner: Wave system integration error, using defaults:', e);
        }
        
        // Only spawn new enemies if wave is active
        if (isWaveActive && this.spawnTimer >= waveSpawnRate && this.enemies.length < maxEnemiesForWave) {
            this.scheduleEnemySpawn(player.x, player.y, 800, 600, playerScore, player.combo || 0);
            this.spawnTimer = 0;
        }
        
        // Update all enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime, player);
            
            // Remove dead enemies
            if (enemy.isDead && enemy.deathTime > 1000) {
                this.enemies.splice(i, 1);
            }
        }
    }

    scheduleEnemySpawn(playerX, playerY, canvasWidth, canvasHeight, playerScore = 0, combo = 0) {
        let spawnX, spawnY;
        let attempts = 0;
        
        // Try to find a spawn position away from player
        do {
            spawnX = Math.random() * (canvasWidth - 100) + 50;
            spawnY = Math.random() * (canvasHeight - 100) + 50;
            const distance = Math.sqrt((spawnX - playerX) ** 2 + (spawnY - playerY) ** 2);
            
            if (distance >= this.spawnDistance) {
                break;
            }
            attempts++;
        } while (attempts < 20);
        
        // Determine enemy type based on game progress
        const enemyType = this.getSpawnType(playerScore, combo);
        
        // Create spawn marker
        const marker = {
            x: spawnX,
            y: spawnY,
            enemyType: enemyType,
            timeLeft: this.markerDuration,
            createdTime: Date.now(),
            playerScore: playerScore,
            combo: combo
        };
        
        this.spawnMarkers.push(marker);
        console.log(`📍 Spawn marker placed for ${enemyType} at (${Math.round(spawnX)}, ${Math.round(spawnY)})`);
    }

    updateSpawnMarkers(deltaTime) {
        for (let i = this.spawnMarkers.length - 1; i >= 0; i--) {
            const marker = this.spawnMarkers[i];
            marker.timeLeft -= deltaTime;
            
            // Spawn enemy when timer expires
            if (marker.timeLeft <= 0) {
                this.spawnEnemyFromMarker(marker);
                this.spawnMarkers.splice(i, 1);
            }
        }
    }

    spawnEnemyFromMarker(marker) {
        // Create new enemy with specific type at marker position
        const enemy = new Enemy(marker.x, marker.y, marker.enemyType);
        this.enemies.push(enemy);
        
        console.log(`🤖 ${enemy.typeData.name} spawned at (${Math.round(marker.x)}, ${Math.round(marker.y)})`);
    }

    getEnemySize(enemyType) {
        // Return base size for enemy type (used for marker scaling)
        const typeData = {
            'polynom_zombie': { width: 35, height: 35 },
            'gleichungs_geist': { width: 40, height: 40 },
            'elite_mob': { width: 50, height: 50 },
            'basic': { width: 30, height: 30 }
        };
        
        return typeData[enemyType] || typeData['basic'];
    }

    checkCollisions(player) {
        for (const enemy of this.enemies) {
            if (!enemy.isDead && enemy.isCollidingWith(player)) {
                return enemy;
            }
        }
        return null;
    }

    render(ctx) {
        // Render spawn markers first (behind enemies)
        this.renderSpawnMarkers(ctx);
        
        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }
    }

    renderSpawnMarkers(ctx) {
        for (const marker of this.spawnMarkers) {
            this.renderSpawnMarker(ctx, marker);
        }
    }

    renderSpawnMarker(ctx, marker) {
        ctx.save();
        
        // Calculate progress (0 to 1, where 1 is just created, 0 is about to spawn)
        const progress = marker.timeLeft / this.markerDuration;
        const enemySize = this.getEnemySize(marker.enemyType);
        
        // Scale marker based on enemy size
        const baseSize = Math.max(enemySize.width, enemySize.height);
        const markerSize = baseSize * 0.8; // Slightly smaller than enemy
        
        // Pulsing effect - faster as spawn time approaches
        const pulseSpeed = 2 + (1 - progress) * 3; // Speed increases as time decreases
        const pulseIntensity = 0.3 + (1 - progress) * 0.4; // Intensity increases
        const pulse = Math.sin(Date.now() * 0.01 * pulseSpeed) * pulseIntensity + 0.7;
        
        // Red color with pulsing alpha
        const alpha = progress * 0.8 * pulse;
        ctx.globalAlpha = alpha;
        
        // Draw hand-drawn style "X" marker
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3 + (1 - progress) * 2; // Thicker as spawn approaches
        ctx.lineCap = 'round';
        
        // Add slight randomness to make it look hand-drawn
        const jitter = 2;
        const x1 = marker.x - markerSize/2 + (Math.sin(marker.createdTime * 0.001) * jitter);
        const y1 = marker.y - markerSize/2 + (Math.cos(marker.createdTime * 0.001) * jitter);
        const x2 = marker.x + markerSize/2 + (Math.sin(marker.createdTime * 0.001 + 1) * jitter);
        const y2 = marker.y + markerSize/2 + (Math.cos(marker.createdTime * 0.001 + 1) * jitter);
        const x3 = marker.x + markerSize/2 + (Math.sin(marker.createdTime * 0.001 + 2) * jitter);
        const y3 = marker.y - markerSize/2 + (Math.cos(marker.createdTime * 0.001 + 2) * jitter);
        const x4 = marker.x - markerSize/2 + (Math.sin(marker.createdTime * 0.001 + 3) * jitter);
        const y4 = marker.y + markerSize/2 + (Math.cos(marker.createdTime * 0.001 + 3) * jitter);
        
        // Draw X with hand-drawn style
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.moveTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 5 + (1 - progress) * 10;
        ctx.stroke();
        
        // Draw countdown timer (optional, for debugging)
        if (progress < 0.5) { // Only show when close to spawning
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ff0000';
            ctx.font = '12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(Math.ceil(marker.timeLeft / 1000), marker.x, marker.y + markerSize/2 + 15);
        }
        
        ctx.restore();
    }

    getDebugInfo() {
        const typeCounts = {};
        this.enemies.forEach(enemy => {
            typeCounts[enemy.type] = (typeCounts[enemy.type] || 0) + 1;
        });
        
        return {
            enemyCount: this.enemies.length,
            types: typeCounts,
            nextSpawn: Math.round((this.spawnInterval - this.spawnTimer) / 1000),
            enemies: this.enemies.map(e => e.getDebugInfo())
        };
    }

    // Boss system methods
    spawnBoss(waveNumber) {
        console.log(`🐉 Spawning boss for wave ${waveNumber}`);
        
        // Clear existing enemies
        this.enemies = [];
        
        // Get canvas center
        const canvas = document.getElementById('gameCanvas');
        const centerX = canvas.width / 2 - 60; // Offset for boss size
        const centerY = canvas.height / 2 - 60;
        
        // Create boss
        const boss = new LegacyBoss(centerX, centerY, waveNumber);
        this.currentBoss = boss;
        this.enemies.push(boss);
        
        // Show boss health bar
        this.showBossHealthBar(boss);
        
        console.log(`🐉 Boss spawned: ${boss.name} with ${boss.health} HP`);
        return boss;
    }

    showBossHealthBar(boss) {
        const bossHealthBar = document.getElementById('bossHealthBar');
        const bossName = document.getElementById('bossName');
        const bossHealthText = document.getElementById('bossHealthText');
        const bossStageIndicator = document.getElementById('bossStageIndicator');
        
        if (bossHealthBar) {
            bossHealthBar.style.display = 'block';
        }
        
        if (bossName) {
            bossName.textContent = boss.name;
        }
        
        if (bossHealthText) {
            bossHealthText.textContent = `${boss.health}/${boss.maxHealth}`;
        }
        
        if (bossStageIndicator) {
            bossStageIndicator.textContent = `Stage ${boss.currentStage}/${boss.formulaStages}`;
        }
    }

    hideBossHealthBar() {
        const bossHealthBar = document.getElementById('bossHealthBar');
        if (bossHealthBar) {
            bossHealthBar.style.display = 'none';
        }
    }

    onBossDefeated() {
        if (!this.currentBoss) return;
        
        const boss = this.currentBoss;
        console.log(`🏆 Boss defeated: ${boss.name}`);
        
        // Award enhanced rewards
        if (window.game) {
            if (window.game.currencySystem) {
                window.game.currencySystem.addCoins(boss.coinValue);
            }
            if (window.game.levelSystem) {
                window.game.levelSystem.addXP(boss.xpValue);
            }
            if (window.game.levelUpSystem) {
                window.game.levelUpSystem.guaranteeRareUpgrade();
            }
        }
        
        // Show victory message
        if (window.game && window.game.gameEngine) {
            window.game.gameEngine.showMessage(`🏆 ${boss.name} BESIEGT! 🏆`, 3000);
        }
        
        // Hide boss health bar
        this.hideBossHealthBar();
        
        // Clear boss reference
        this.currentBoss = null;
        
        // Trigger wave completion
        if (window.game && window.game.waveSystem) {
            window.game.waveSystem.onBossDefeated();
        }
    }
}

/**
 * LEGACY BOSS CLASS - Multi-stage formula challenges with special abilities
 * Note: Replaced by new Boss System, keeping for compatibility
 */
class LegacyBoss extends Enemy {
    constructor(x, y, waveNumber) {
        const bossType = LegacyBoss.getBossTypeForWave(waveNumber);
        super(x, y, 'boss');
        
        // Boss-specific properties
        this.bossData = bossType;
        this.name = bossType.name;
        this.icon = bossType.icon;
        this.width = bossType.size.width;
        this.height = bossType.size.height;
        this.color = bossType.color;
        this.glowColor = bossType.glowColor;
        this.health = bossType.health;
        this.maxHealth = bossType.health;
        this.coinValue = bossType.coinReward;
        this.xpValue = bossType.xpReward;
        
        // Multi-stage system
        this.formulaStages = bossType.formulaStages;
        this.currentStage = 1;
        this.formulaTypes = bossType.formulaTypes;
        this.specialAbility = bossType.specialAbility;
        this.stageFormulas = [];
        
        // Special ability states
        this.isShielded = false;
        this.shieldEndTime = 0;
        this.renderShield = false;
        this.isTeleporting = false;
        this.teleportStartTime = 0;
        
        // Visual effects
        this.pulseIntensity = 1.0;
        this.glowRadius = 30;
        this.lastSpecialAbilityTime = 0;
        
        this.initializeFormulaStages();
        console.log(`🐉 Boss spawned: ${this.name} (${this.formulaStages} stages)`);
    }
    
    static getBossTypeForWave(waveNumber) {
        const bossTypes = {
            'ALGEBRA-TITAN': {
                name: 'ALGEBRA-TITAN',
                icon: '🤖',
                health: 300,
                size: { width: 80, height: 80 },
                color: '#FF4444',
                glowColor: '#FF8888',
                formulaStages: 3,
                formulaTypes: ['binomial_basic'],
                specialAbility: 'shield_phase',
                coinReward: 150,
                xpReward: 100
            },
            'POLYNOM-KAISER': {
                name: 'POLYNOM-KAISER',
                icon: '👑',
                health: 500,
                size: { width: 100, height: 100 },
                color: '#4444FF',
                glowColor: '#8888FF',
                formulaStages: 4,
                formulaTypes: ['binomial_advanced', 'factoring'],
                specialAbility: 'teleport_phase',
                coinReward: 300,
                xpReward: 200
            },
            'GLEICHUNGS-OVERLORD': {
                name: 'GLEICHUNGS-OVERLORD',
                icon: '💀',
                health: 800,
                size: { width: 120, height: 120 },
                color: '#8844FF',
                glowColor: '#BB88FF',
                formulaStages: 5,
                formulaTypes: ['binomial_expert', 'nested_formulas'],
                specialAbility: 'minion_summon',
                coinReward: 500,
                xpReward: 350
            }
        };
        
        // Determine boss type based on wave number
        if (waveNumber >= 15) {
            return bossTypes['GLEICHUNGS-OVERLORD'];
        } else if (waveNumber >= 10) {
            return bossTypes['POLYNOM-KAISER'];
        } else {
            return bossTypes['ALGEBRA-TITAN'];
        }
    }
    
    initializeFormulaStages() {
        this.stageFormulas = [];
        
        // Generate formulas for each stage
        for (let stage = 1; stage <= this.formulaStages; stage++) {
            const formula = this.generateBossFormula(stage);
            this.stageFormulas.push(formula);
        }
        
        // Set current formula to first stage
        this.assignedFormula = this.stageFormulas[0];
        this.formula = this.assignedFormula;
    }
    
    generateBossFormula(stage) {
        // Boss formulas are more complex than regular enemies
        if (window.game && window.game.formulaSystem) {
            const difficulty = 1.5 + (stage * 0.3); // Increasing difficulty per stage
            const formula = window.game.formulaSystem.generateFormulaWithDifficulty(difficulty);
            return formula;
        } else {
            // Fallback boss formula generation
            const a = Math.floor(Math.random() * 8) + 2; // 2-9
            const b = Math.floor(Math.random() * 8) + 2; // 2-9
            const variables = ['x', 'y', 'z'];
            const variable = variables[Math.floor(Math.random() * variables.length)];
            
            const text = `(${a}${variable} + ${b})²`;
            const expanded = `${a*a}${variable}² + ${2*a*b}${variable} + ${b*b}`;
            
            return {
                type: 'expansion_plus',
                typeName: 'Boss Binomische Formel',
                text: text,
                solutions: [expanded],
                difficulty: 2.0 + stage * 0.5,
                variable: variable,
                a: a,
                b: b
            };
        }
    }
    
    takeDamage(amount) {
        if (this.isShielded) {
            this.showMessage("🛡️ SCHILD BLOCKIERT ANGRIFF! 🛡️", 1500);
            return false;
        }
        
        // Boss takes fixed damage per stage completion
        const stageHealth = this.maxHealth / this.formulaStages;
        this.health -= stageHealth;
        
        console.log(`🐉 Boss took damage: ${Math.round(stageHealth)} (${Math.round(this.health)}/${this.maxHealth})`);
        
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            return true;
        }
        
        return false;
    }
    
    nextStage() {
        if (this.currentStage < this.formulaStages) {
            this.currentStage++;
            
            // Update formula to next stage
            this.assignedFormula = this.stageFormulas[this.currentStage - 1];
            this.formula = this.assignedFormula;
            
            console.log(`🐉 Boss advanced to stage ${this.currentStage}/${this.formulaStages}`);
            
            // Execute special ability between stages
            this.executeSpecialAbility();
            
            // Update UI
            this.updateBossUI();
            
            return true;
        }
        return false;
    }
    
    executeSpecialAbility() {
        const currentTime = Date.now();
        if (currentTime - this.lastSpecialAbilityTime < 2000) return; // Cooldown
        
        this.lastSpecialAbilityTime = currentTime;
        
        switch(this.specialAbility) {
            case 'shield_phase':
                this.activateShield(3000);
                break;
            case 'teleport_phase':
                this.teleportBoss();
                break;
            case 'minion_summon':
                this.spawnMinions(2);
                break;
        }
    }
    
    activateShield(duration) {
        this.isShielded = true;
        this.shieldEndTime = Date.now() + duration;
        this.renderShield = true;
        
        this.showMessage("🛡️ BOSS AKTIVIERT SCHILD! 🛡️", 2000);
        
        setTimeout(() => {
            this.isShielded = false;
            this.renderShield = false;
        }, duration);
    }
    
    teleportBoss() {
        this.isTeleporting = true;
        this.teleportStartTime = Date.now();
        
        // Teleport effect duration
        setTimeout(() => {
            // Get canvas bounds
            const canvas = document.getElementById('gameCanvas');
            const margin = this.width;
            
            // New random position within bounds
            this.x = margin + Math.random() * (canvas.width - 2 * margin);
            this.y = margin + Math.random() * (canvas.height - 2 * margin);
            
            this.isTeleporting = false;
            this.showMessage("💫 BOSS TELEPORTIERT! 💫", 1500);
        }, 1000);
    }
    
    spawnMinions(count) {
        this.showMessage("👹 BOSS BESCHWÖRT VERSTÄRKUNG! 👹", 2000);
        
        if (window.game && window.game.enemySpawner) {
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                const distance = 100;
                const minionX = this.x + Math.cos(angle) * distance;
                const minionY = this.y + Math.sin(angle) * distance;
                
                const minion = new Enemy(minionX, minionY, 'polynom_zombie');
                minion.health = 50; // Weaker minions
                minion.maxHealth = 50;
                window.game.enemySpawner.enemies.push(minion);
            }
        }
    }
    
    showMessage(text, duration) {
        if (window.game && window.game.gameEngine) {
            window.game.gameEngine.showMessage(text, duration);
        }
    }
    
    updateBossUI() {
        // Update boss health bar
        const healthBar = document.getElementById('bossHealthFill');
        const healthText = document.getElementById('bossHealthText');
        const stageIndicator = document.getElementById('bossStageIndicator');
        
        if (healthBar) {
            const healthPercent = (this.health / this.maxHealth) * 100;
            healthBar.style.width = `${healthPercent}%`;
        }
        
        if (healthText) {
            healthText.textContent = `${Math.round(this.health)}/${this.maxHealth}`;
        }
        
        if (stageIndicator) {
            stageIndicator.textContent = `Stage ${this.currentStage}/${this.formulaStages}`;
        }
    }
    
    update(deltaTime, player) {
        super.update(deltaTime, player);
        
        // Update special ability states
        if (this.isShielded && Date.now() > this.shieldEndTime) {
            this.isShielded = false;
            this.renderShield = false;
        }
        
        // Update visual effects
        this.pulseIntensity = 0.8 + Math.sin(Date.now() * 0.003) * 0.2;
        this.glowRadius = 25 + Math.sin(Date.now() * 0.005) * 10;
        
        // Update boss UI
        this.updateBossUI();
    }
    
    render(ctx) {
        if (this.isDead) {
            this.renderDeathAnimation(ctx);
            return;
        }
        
        ctx.save();
        
        // Teleport effect
        if (this.isTeleporting) {
            const teleportProgress = (Date.now() - this.teleportStartTime) / 1000;
            ctx.globalAlpha = Math.abs(Math.sin(teleportProgress * Math.PI * 4)) * 0.5 + 0.3;
        }
        
        // Boss glow effect
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = this.glowRadius * this.pulseIntensity;
        
        // Shield effect
        if (this.renderShield) {
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2 + 10, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Boss body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Boss icon (larger)
        ctx.font = `${this.width * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.icon, this.x + this.width/2, this.y + this.height/2 + this.width * 0.2);
        
        // Stage indicator above boss
        ctx.font = '14px Courier New';
        ctx.fillStyle = '#FFFF00';
        ctx.fillText(`${this.currentStage}/${this.formulaStages}`, this.x + this.width/2, this.y - 10);
        
        ctx.restore();
    }
    
    renderDeathAnimation(ctx) {
        const deathDuration = 2000; // 2 seconds
        const progress = Math.min(this.deathTime / deathDuration, 1);
        
        ctx.save();
        
        // Explosion effect
        const explosionRadius = progress * 100;
        const alpha = 1 - progress;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, explosionRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Boss icon fading
        ctx.font = `${this.width * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.icon, this.x + this.width/2, this.y + this.height/2 + this.width * 0.2);
        
        ctx.restore();
    }
}
