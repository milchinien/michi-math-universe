/**
 * FORMEL-FURY-SHOOTER - ENEMY SYSTEM
 * Handles enemy AI, rendering, and spawning mechanics
 * Phase 4.2: Modulare Struktur
 */

class Enemy {
    constructor(x, y, formulaSystem, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Set type-specific properties
        this.setTypeProperties();
        
        // AI behavior - SMOOTH MOVEMENT
        this.targetX = x;
        this.targetY = y;
        this.velocity = { x: 0, y: 0 };
        this.targetVelocity = { x: 0, y: 0 };
        this.smoothFactor = 0.12; // slightly slower smoothing than player
        this.lastDirectionUpdate = 0;
        this.directionUpdateInterval = this.baseDirectionInterval; // Use type-specific interval
        this.minVelocity = 0.5; // threshold to stop tiny movements
        
        // Formula assignment based on type
        this.assignedFormula = this.generateTypeSpecificFormula(formulaSystem);
        this.isTargeted = false; // When player is close enough to see formula
        this.showTargetIndicator = false; // Show targeting reticle
        
        // Status effects
        this.isDead = false;
        this.deathTimer = 0;
        this.deathDuration = 1000; // 1 second death animation
        
        // Type-specific visual effects
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.rotationSpeed = this.baseRotationSpeed;
    }

    setTypeProperties() {
        const types = {
            'polynom_zombie': {
                name: 'Polynom-Zombie',
                width: 35,
                height: 35,
                speed: 60,
                maxSpeed: 90,
                health: 80,
                acceleration: 300,
                color: '#00ff00',
                glowColor: '#00ff0080',
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
                acceleration: 600,
                color: '#00ffff',
                glowColor: '#00ffff80',
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
                acceleration: 200,
                color: '#ff0080',
                glowColor: '#ff008080',
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
                acceleration: 400,
                color: '#ff3300',
                glowColor: '#ff330080',
                shape: 'hexagon',
                directionInterval: 100,
                rotationSpeed: 0.03,
                scoreMultiplier: 1.0,
                difficultyBias: 0
            }
        };

        const props = types[this.type] || types['basic'];
        
        // Apply properties
        this.typeName = props.name;
        this.width = props.width;
        this.height = props.height;
        this.speed = props.speed;
        this.maxSpeed = props.maxSpeed;
        this.health = props.health;
        this.maxHealth = props.health;
        this.acceleration = props.acceleration;
        this.color = props.color;
        this.glowColor = props.glowColor;
        this.shape = props.shape;
        this.baseDirectionInterval = props.directionInterval;
        this.baseRotationSpeed = props.rotationSpeed;
        this.scoreMultiplier = props.scoreMultiplier;
        this.difficultyBias = props.difficultyBias;
        this.angle = 0;
    }

    generateTypeSpecificFormula(formulaSystem) {
        // Get available formula types for current progress
        const availableTypes = formulaSystem.getAvailableFormulaTypes(['expansion_plus', 'expansion_minus', 'difference_squares', 'factorization_difference', 'factorization_square']);
        
        // Filter types based on enemy type preferences
        let preferredTypes = [...availableTypes];
        
        switch (this.type) {
            case 'polynom_zombie':
                // Prefers basic expansion formulas
                preferredTypes = availableTypes.filter(type => 
                    type === 'expansion_plus' || type === 'expansion_minus'
                );
                if (preferredTypes.length === 0) preferredTypes = [availableTypes[0]];
                break;
                
            case 'gleichungs_geist':
                // Prefers medium complexity
                preferredTypes = availableTypes.filter(type => 
                    type === 'expansion_minus' || type === 'difference_squares'
                );
                if (preferredTypes.length === 0) preferredTypes = availableTypes;
                break;
                
            case 'elite_mob':
                // Prefers advanced formulas
                preferredTypes = availableTypes.filter(type => 
                    type === 'factorization_difference' || type === 'factorization_square'
                );
                if (preferredTypes.length === 0) preferredTypes = availableTypes;
                break;
                
            default:
                // Standard distribution
                break;
        }
        
        // Select random type from preferred
        const selectedType = preferredTypes[Math.floor(Math.random() * preferredTypes.length)];
        
        // Generate formula with type-specific difficulty bias
        const originalGenerateCoefficient = formulaSystem.generateCoefficient.bind(formulaSystem);
        const originalGenerateConstant = formulaSystem.generateConstant.bind(formulaSystem);
        
        // Temporarily modify generation for this enemy
        formulaSystem.generateCoefficient = () => {
            let coeff = originalGenerateCoefficient();
            if (this.difficultyBias < 0) {
                coeff = Math.max(1, coeff - 1); // Easier
            } else if (this.difficultyBias > 0) {
                coeff = Math.min(7, coeff + Math.floor(this.difficultyBias * 2)); // Harder
            }
            return coeff;
        };
        
        formulaSystem.generateConstant = () => {
            let constant = originalGenerateConstant();
            if (this.difficultyBias < 0) {
                constant = Math.max(1, constant - 1); // Easier
            } else if (this.difficultyBias > 0) {
                constant = Math.min(10, constant + Math.floor(this.difficultyBias * 2)); // Harder
            }
            return constant;
        };
        
        // Generate formula
        const formula = formulaSystem.generateFormulaByType(selectedType);
        
        // Restore original methods
        formulaSystem.generateCoefficient = originalGenerateCoefficient;
        formulaSystem.generateConstant = originalGenerateConstant;
        
        // Adjust difficulty for this enemy type
        formula.difficulty = Math.max(1, Math.min(5, formula.difficulty + this.difficultyBias));
        
        return formula;
    }

    update(deltaTime, playerX, playerY, canvasWidth, canvasHeight) {
        if (this.isDead) {
            this.updateDeathAnimation(deltaTime);
            return;
        }
        
        const dt = deltaTime / 1000;
        
        // Update AI behavior
        this.updateAI(playerX, playerY, deltaTime);
        
        // Update movement
        this.updateMovement(dt);
        
        // Keep within canvas bounds
        this.handleBoundaryCollision(canvasWidth, canvasHeight);
        
        // Update visual effects
        this.pulsePhase += deltaTime * 0.003; // Slow pulsing
        
        // Check if player is close enough to see formula
        const distanceToPlayer = Math.sqrt((this.x - playerX) ** 2 + (this.y - playerY) ** 2);
        this.isTargeted = distanceToPlayer < 100; // Show formula when player is within 100px
    }

    updateAI(playerX, playerY, deltaTime) {
        // Simple AI: Move towards player with some randomness
        const currentTime = Date.now();
        
        if (currentTime - this.lastDirectionUpdate > this.directionUpdateInterval) {
            // Calculate direction to player with some noise
            const dx = playerX - this.x;
            const dy = playerY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                // Add some randomness to movement
                const noise = 0.3;
                const randomAngle = (Math.random() - 0.5) * noise;
                const angle = Math.atan2(dy, dx) + randomAngle;
                
                this.targetX = this.x + Math.cos(angle) * this.speed;
                this.targetY = this.y + Math.sin(angle) * this.speed;
            }
            
            this.lastDirectionUpdate = currentTime;
        }
    }

    updateMovement(dt) {
        // Calculate desired velocity towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let targetVelX = 0;
        let targetVelY = 0;
        
        if (distance > 8) { // Larger dead zone to prevent jittering (was 5)
            targetVelX = (dx / distance) * this.speed;
            targetVelY = (dy / distance) * this.speed;
        }
        
        // Apply acceleration towards target velocity
        const velDiffX = targetVelX - this.velocity.x;
        const velDiffY = targetVelY - this.velocity.y;
        
        this.velocity.x += velDiffX * this.acceleration * dt;
        this.velocity.y += velDiffY * this.acceleration * dt;
        
        // Apply velocity damping to reduce jitter
        this.velocity.x *= 0.96; // slight damping
        this.velocity.y *= 0.96;
        
        // Stop tiny movements that cause jitter
        if (Math.abs(this.velocity.x) < 0.5) this.velocity.x = 0;
        if (Math.abs(this.velocity.y) < 0.5) this.velocity.y = 0;
        
        // Limit max speed
        const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
        if (speed > this.maxSpeed) {
            this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
            this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
        }
        
        // Update position and round to prevent sub-pixel jitter
        this.x = Math.round(this.x + this.velocity.x * dt);
        this.y = Math.round(this.y + this.velocity.y * dt);
        
        // Update angle for rotation
        if (Math.abs(this.velocity.x) > 1 || Math.abs(this.velocity.y) > 1) {
            this.angle = Math.atan2(this.velocity.y, this.velocity.x);
        }
    }

    updateDeathAnimation(deltaTime) {
        this.deathTimer += deltaTime;
        if (this.deathTimer >= this.deathDuration) {
            this.isDead = true; // Mark for removal
        }
    }

    handleBoundaryCollision(canvasWidth, canvasHeight) {
        // Bounce off walls
        if (this.x < this.width / 2) {
            this.x = this.width / 2;
            this.velocity.x = Math.abs(this.velocity.x) * 0.5;
        }
        if (this.x > canvasWidth - this.width / 2) {
            this.x = canvasWidth - this.width / 2;
            this.velocity.x = -Math.abs(this.velocity.x) * 0.5;
        }
        if (this.y < this.height / 2) {
            this.y = this.height / 2;
            this.velocity.y = Math.abs(this.velocity.y) * 0.5;
        }
        if (this.y > canvasHeight - this.height / 2) {
            this.y = canvasHeight - this.height / 2;
            this.velocity.y = -Math.abs(this.velocity.y) * 0.5;
        }
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.startDeathAnimation();
        }
    }

    startDeathAnimation() {
        this.isDead = true;
        this.deathTimer = 0;
    }

    isCollidingWith(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.width + other.width) / 2;
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
        ctx.beginPath();
        
        switch (this.shape) {
            case 'hexagon':
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = Math.cos(angle) * this.width / 2;
                    const y = Math.sin(angle) * this.height / 2;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                break;
                
            case 'diamond':
                const halfW = this.width / 2;
                const halfH = this.height / 2;
                ctx.moveTo(halfW, 0);
                ctx.lineTo(0, halfH);
                ctx.lineTo(-halfW, 0);
                ctx.lineTo(0, -halfH);
                break;
                
            case 'star':
                const outerRadius = this.width / 2;
                const innerRadius = outerRadius * 0.5;
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI) / 5;
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                break;
                
            default: // hexagon as fallback
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = Math.cos(angle) * this.width / 2;
                    const y = Math.sin(angle) * this.height / 2;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
        }
        
        ctx.closePath();
        ctx.fill();
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

    update(deltaTime, playerX, playerY, canvasWidth, canvasHeight, playerScore = 0, combo = 0) {
        this.spawnTimer += deltaTime;
        
        // Dynamic spawn interval based on progress
        let currentSpawnInterval = this.spawnInterval;
        if (playerScore > 1000) currentSpawnInterval = 2500; // Faster spawning
        if (playerScore > 2000) currentSpawnInterval = 2000; // Even faster
        
        // Spawn new enemies
        if (this.spawnTimer >= currentSpawnInterval && this.enemies.length < this.maxEnemies) {
            this.spawnEnemy(playerX, playerY, canvasWidth, canvasHeight, playerScore, combo);
            this.spawnTimer = 0;
        }
        
        // Update all enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(deltaTime, playerX, playerY, canvasWidth, canvasHeight);
            
            // Remove dead enemies
            if (enemy.shouldBeRemoved()) {
                this.enemies.splice(i, 1);
            }
        }
    }

    spawnEnemy(playerX, playerY, canvasWidth, canvasHeight, playerScore = 0, combo = 0) {
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
        
        // Create new enemy with specific type
        const enemy = new Enemy(spawnX, spawnY, this.formulaSystem, enemyType);
        this.enemies.push(enemy);
        
        console.log(`${enemy.typeName} spawned at (${Math.round(spawnX)}, ${Math.round(spawnY)}) with ${enemy.assignedFormula.typeName}: ${enemy.assignedFormula.text} (Difficulty: ${enemy.assignedFormula.difficulty.toFixed(1)})`);
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
        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }
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
}
