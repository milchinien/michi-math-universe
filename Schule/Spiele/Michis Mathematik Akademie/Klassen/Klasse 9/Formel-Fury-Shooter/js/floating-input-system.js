/**
 * Floating Input System - Phase 2, Step 2.2
 * Revolutionary system enabling simultaneous movement and formula input
 */

class FloatingInputSystem {
    constructor(player, canvas, formulaSystem, audioManager, screenEffects) {
        this.player = player;
        this.canvas = canvas;
        this.formulaSystem = formulaSystem;
        this.audioManager = audioManager;
        this.screenEffects = screenEffects;
        
        // Floating UI configuration
        this.config = {
            followDistance: 80,        // Distance from player
            followSpeed: 0.12,         // Interpolation speed (0-1)
            minDistance: 60,           // Minimum distance from player
            maxDistance: 150,          // Maximum distance from player
            boundaryPadding: 50,       // Padding from screen edges
            obstacleAvoidance: 30,     // Distance to avoid obstacles
            adaptiveScaling: true,     // Scale based on movement speed
            transparencyFade: true     // Fade when moving fast
        };
        
        // Current floating position
        this.floatingPos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 };
        this.lastPlayerPos = { x: 0, y: 0 };
        
        // Movement integration
        this.movementState = {
            isMoving: false,
            speed: 0,
            direction: { x: 0, y: 0 },
            movingDuration: 0,
            lastMovementTime: 0
        };
        
        // Input state management
        this.inputState = {
            isTyping: false,
            typingStartTime: 0,
            simultaneousActions: false,
            multitaskingBonus: 0,
            lastKeyTime: 0
        };
        
        // UI elements
        this.floatingContainer = null;
        this.connectionLine = null;
        this.speedIndicator = null;
        
        // Visual effects
        this.trailPoints = [];
        this.accuracyIndicators = [];
        this.flowEffects = [];
        
        // Performance settings
        this.settings = {
            enabled: true,
            smoothFollowing: true,
            visualEffects: true,
            adaptiveUI: true,
            collisionAvoidance: true,
            movementPenalty: 0.7,      // Speed reduction during typing
            accuracyBonus: 1.2,        // Accuracy bonus for slow movement
            rushModeThreshold: 200,    // Speed threshold for rush mode
            flowStateSpeed: 100        // Optimal speed for flow state
        };
        
        this.init();
    }
    
    init() {
        this.createFloatingUI();
        this.setupInputHandlers();
        this.initializePositioning();
        
        console.log('🎯 FloatingInputSystem initialized');
    }
    
    createFloatingUI() {
        // Create floating container for formula input
        this.floatingContainer = document.createElement('div');
        this.floatingContainer.id = 'floatingFormulaContainer';
        this.floatingContainer.className = 'floating-formula-container';
        
        // Move existing formula elements into floating container
        const existingFormulaContainer = document.getElementById('formulaContainer');
        if (existingFormulaContainer) {
            // Clone the existing formula UI
            this.floatingContainer.innerHTML = existingFormulaContainer.innerHTML;
            
            // Hide original container during combat
            existingFormulaContainer.style.display = 'none';
        }
        
        // Add floating container to body
        document.body.appendChild(this.floatingContainer);
        
        // Apply floating styles
        this.applyFloatingStyles();
        
        // Create connection line canvas
        this.createConnectionLine();
        
        // Create speed indicator
        this.createSpeedIndicator();
    }
    
    applyFloatingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .floating-formula-container {
                position: fixed;
                z-index: 1000;
                background: linear-gradient(135deg, rgba(0, 20, 40, 0.95), rgba(0, 40, 80, 0.95));
                border: 2px solid rgba(0, 255, 255, 0.8);
                border-radius: 15px;
                padding: 15px;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
                backdrop-filter: blur(5px);
                transition: all 0.1s ease-out;
                pointer-events: auto;
                min-width: 300px;
                max-width: 400px;
            }
            
            .floating-formula-container.moving-fast {
                opacity: 0.7;
                transform: scale(0.9);
            }
            
            .floating-formula-container.typing-active {
                border-color: rgba(255, 215, 0, 0.9);
                box-shadow: 0 0 25px rgba(255, 215, 0, 0.5);
            }
            
            .floating-formula-container.flow-state {
                border-color: rgba(0, 255, 100, 0.9);
                box-shadow: 0 0 30px rgba(0, 255, 100, 0.6);
                animation: flowPulse 2s ease-in-out infinite;
            }
            
            @keyframes flowPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            .connection-line-canvas {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 999;
            }
            
            .speed-indicator {
                position: absolute;
                top: -10px;
                right: -10px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 255, 255, 0.8), transparent);
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .speed-indicator.active {
                opacity: 1;
                animation: speedPulse 1s ease-in-out infinite;
            }
            
            @keyframes speedPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
            }
        `;
        document.head.appendChild(style);
    }
    
    createConnectionLine() {
        this.connectionLine = document.createElement('canvas');
        this.connectionLine.className = 'connection-line-canvas';
        this.connectionLine.width = window.innerWidth;
        this.connectionLine.height = window.innerHeight;
        document.body.appendChild(this.connectionLine);
        
        this.connectionCtx = this.connectionLine.getContext('2d');
    }
    
    createSpeedIndicator() {
        this.speedIndicator = document.createElement('div');
        this.speedIndicator.className = 'speed-indicator';
        this.floatingContainer.appendChild(this.speedIndicator);
    }
    
    setupInputHandlers() {
        // Monitor typing activity
        const formulaInput = this.floatingContainer.querySelector('#formulaInput') || 
                           this.floatingContainer.querySelector('input[type="text"]');
        
        if (formulaInput) {
            formulaInput.addEventListener('input', (e) => this.onTypingInput(e));
            formulaInput.addEventListener('focus', () => this.onTypingStart());
            formulaInput.addEventListener('blur', () => this.onTypingEnd());
            formulaInput.addEventListener('keydown', (e) => this.onKeyDown(e));
        }
        
        // Monitor movement keys for dual-input detection
        document.addEventListener('keydown', (e) => this.onMovementKey(e));
        document.addEventListener('keyup', (e) => this.onMovementKeyUp(e));
        
        // Window resize handler
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    initializePositioning() {
        // Set initial position near player
        this.floatingPos.x = this.player.x + this.config.followDistance;
        this.floatingPos.y = this.player.y - this.config.followDistance;
        this.targetPos = { ...this.floatingPos };
        this.lastPlayerPos = { x: this.player.x, y: this.player.y };
        
        this.updateFloatingPosition();
    }
    
    update(deltaTime) {
        if (!this.settings.enabled) return;
        
        // Safety check - don't update if player is not initialized
        if (!this.player || typeof this.player.x !== 'number' || typeof this.player.y !== 'number') {
            return;
        }
        
        // Cap deltaTime to prevent issues
        deltaTime = Math.min(deltaTime, 100);
        
        this.updateMovementState(deltaTime);
        this.updateInputState(deltaTime);
        this.updateTargetPosition();
        this.updateFloatingPosition();
        this.updateVisualEffects(deltaTime);
        this.updateUIState();
    }
    
    updateMovementState(deltaTime) {
        const currentPos = { x: this.player.x, y: this.player.y };
        const dx = currentPos.x - this.lastPlayerPos.x;
        const dy = currentPos.y - this.lastPlayerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.movementState.speed = distance / (deltaTime / 1000); // pixels per second
        this.movementState.isMoving = this.movementState.speed > 10;
        
        if (this.movementState.isMoving) {
            this.movementState.direction.x = dx / distance || 0;
            this.movementState.direction.y = dy / distance || 0;
            this.movementState.movingDuration += deltaTime;
            this.movementState.lastMovementTime = Date.now();
        } else {
            this.movementState.movingDuration = 0;
        }
        
        this.lastPlayerPos = { ...currentPos };
    }
    
    updateInputState(deltaTime) {
        const currentTime = Date.now();
        
        // Check for simultaneous actions
        const recentMovement = currentTime - this.movementState.lastMovementTime < 500;
        const recentTyping = currentTime - this.inputState.lastKeyTime < 500;
        
        this.inputState.simultaneousActions = recentMovement && recentTyping;
        
        // Update multitasking bonus
        if (this.inputState.simultaneousActions) {
            this.inputState.multitaskingBonus = Math.min(this.inputState.multitaskingBonus + deltaTime * 0.001, 1.0);
        } else {
            this.inputState.multitaskingBonus = Math.max(this.inputState.multitaskingBonus - deltaTime * 0.002, 0);
        }
    }
    
    updateTargetPosition() {
        if (!this.settings.smoothFollowing) return;
        
        // Calculate base target position relative to player
        let offsetX = this.config.followDistance;
        let offsetY = -this.config.followDistance;
        
        // Adjust based on movement direction
        if (this.movementState.isMoving) {
            const perpX = -this.movementState.direction.y;
            const perpY = this.movementState.direction.x;
            offsetX = perpX * this.config.followDistance;
            offsetY = perpY * this.config.followDistance;
        }
        
        this.targetPos.x = this.player.x + offsetX;
        this.targetPos.y = this.player.y + offsetY;
        
        // Apply collision avoidance
        if (this.settings.collisionAvoidance) {
            this.applyCollisionAvoidance();
        }
        
        // Keep within screen boundaries
        this.constrainToScreen();
    }
    
    applyCollisionAvoidance() {
        // Avoid screen edges
        const padding = this.config.boundaryPadding;
        const containerWidth = 350; // Approximate container width
        const containerHeight = 200; // Approximate container height
        
        if (this.targetPos.x < padding) {
            this.targetPos.x = padding;
        } else if (this.targetPos.x + containerWidth > this.canvas.width - padding) {
            this.targetPos.x = this.canvas.width - containerWidth - padding;
        }
        
        if (this.targetPos.y < padding) {
            this.targetPos.y = padding;
        } else if (this.targetPos.y + containerHeight > this.canvas.height - padding) {
            this.targetPos.y = this.canvas.height - containerHeight - padding;
        }
    }
    
    constrainToScreen() {
        const rect = this.canvas.getBoundingClientRect();
        this.targetPos.x = Math.max(0, Math.min(this.targetPos.x, rect.width - 350));
        this.targetPos.y = Math.max(0, Math.min(this.targetPos.y, rect.height - 200));
    }
    
    updateFloatingPosition() {
        // Smooth interpolation to target position
        const lerpFactor = this.config.followSpeed;
        
        this.floatingPos.x += (this.targetPos.x - this.floatingPos.x) * lerpFactor;
        this.floatingPos.y += (this.targetPos.y - this.floatingPos.y) * lerpFactor;
        
        // Apply position to DOM element
        const rect = this.canvas.getBoundingClientRect();
        this.floatingContainer.style.left = `${rect.left + this.floatingPos.x}px`;
        this.floatingContainer.style.top = `${rect.top + this.floatingPos.y}px`;
    }
    
    updateVisualEffects(deltaTime) {
        if (!this.settings.visualEffects) return;
        
        // Update trail points
        this.updateTrailPoints(deltaTime);
        
        // Update accuracy indicators
        this.updateAccuracyIndicators(deltaTime);
        
        // Render connection line
        this.renderConnectionLine();
    }
    
    updateTrailPoints(deltaTime) {
        // Add new trail point if moving
        if (this.movementState.isMoving && this.inputState.isTyping) {
            this.trailPoints.push({
                x: this.player.x,
                y: this.player.y,
                life: 1000,
                maxLife: 1000,
                alpha: 0.8
            });
        }
        
        // Update existing trail points
        this.trailPoints = this.trailPoints.filter(point => {
            point.life -= deltaTime;
            point.alpha = point.life / point.maxLife * 0.8;
            return point.life > 0;
        });
        
        // Limit trail length
        if (this.trailPoints.length > 20) {
            this.trailPoints.shift();
        }
    }
    
    updateAccuracyIndicators(deltaTime) {
        this.accuracyIndicators = this.accuracyIndicators.filter(indicator => {
            indicator.life -= deltaTime;
            indicator.alpha = indicator.life / indicator.maxLife;
            return indicator.life > 0;
        });
    }
    
    renderConnectionLine() {
        if (!this.connectionCtx) return;
        
        this.connectionCtx.clearRect(0, 0, this.connectionLine.width, this.connectionLine.height);
        
        if (!this.inputState.isTyping) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const playerScreenX = rect.left + this.player.x;
        const playerScreenY = rect.top + this.player.y;
        const containerX = rect.left + this.floatingPos.x + 175; // Center of container
        const containerY = rect.top + this.floatingPos.y + 100;
        
        // Draw connection line
        this.connectionCtx.save();
        this.connectionCtx.strokeStyle = `rgba(0, 255, 255, ${this.inputState.simultaneousActions ? 0.6 : 0.3})`;
        this.connectionCtx.lineWidth = this.inputState.simultaneousActions ? 3 : 2;
        this.connectionCtx.setLineDash([5, 5]);
        
        this.connectionCtx.beginPath();
        this.connectionCtx.moveTo(playerScreenX, playerScreenY);
        this.connectionCtx.lineTo(containerX, containerY);
        this.connectionCtx.stroke();
        this.connectionCtx.restore();
        
        // Draw trail points
        this.renderTrailPoints();
    }
    
    renderTrailPoints() {
        if (this.trailPoints.length < 2) return;
        
        const rect = this.canvas.getBoundingClientRect();
        
        this.connectionCtx.save();
        this.connectionCtx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        this.connectionCtx.lineWidth = 2;
        this.connectionCtx.lineCap = 'round';
        
        this.connectionCtx.beginPath();
        for (let i = 0; i < this.trailPoints.length; i++) {
            const point = this.trailPoints[i];
            const screenX = rect.left + point.x;
            const screenY = rect.top + point.y;
            
            this.connectionCtx.globalAlpha = point.alpha;
            
            if (i === 0) {
                this.connectionCtx.moveTo(screenX, screenY);
            } else {
                this.connectionCtx.lineTo(screenX, screenY);
            }
        }
        this.connectionCtx.stroke();
        this.connectionCtx.restore();
    }
    
    updateUIState() {
        // Update container classes based on state
        this.floatingContainer.classList.toggle('moving-fast', this.movementState.speed > this.settings.rushModeThreshold);
        this.floatingContainer.classList.toggle('typing-active', this.inputState.isTyping);
        this.floatingContainer.classList.toggle('flow-state', this.isInFlowState());
        
        // Update speed indicator
        this.speedIndicator.classList.toggle('active', this.movementState.isMoving);
        
        // Update transparency based on movement speed
        if (this.settings.adaptiveUI) {
            const speedRatio = Math.min(this.movementState.speed / this.settings.rushModeThreshold, 1);
            const opacity = this.config.transparencyFade ? (1 - speedRatio * 0.3) : 1;
            this.floatingContainer.style.opacity = opacity;
        }
    }
    
    isInFlowState() {
        const optimalSpeed = this.settings.flowStateSpeed;
        const speedDiff = Math.abs(this.movementState.speed - optimalSpeed);
        return speedDiff < 30 && this.inputState.simultaneousActions;
    }
    
    // === EVENT HANDLERS ===
    
    onTypingInput(e) {
        this.inputState.lastKeyTime = Date.now();
        
        // Trigger audio feedback for typing while moving
        if (this.movementState.isMoving && this.audioManager) {
            this.audioManager.playSound('keypress', {
                volume: 0.4,
                pitch: 1.0 + (this.movementState.speed / 200),
                layer: 'feedback'
            });
        }
        
        // Create accuracy indicator
        if (this.inputState.simultaneousActions) {
            this.createAccuracyIndicator('multitask');
        }
    }
    onTypingStart() {
        this.inputState.isTyping = true;
        this.inputState.typingStartTime = Date.now();
        
        // Apply movement penalty
        if (this.player && this.settings.movementPenalty < 1) {
            this.player.speed *= this.settings.movementPenalty;
        }     
        console.log('📝 Started typing while moving');
    }
    
    onTypingEnd() {
        this.inputState.isTyping = false;
        
        // Remove movement penalty
        if (this.player && this.settings.movementPenalty < 1) {
            this.player.speed /= this.settings.movementPenalty;
        }
        
        // Award multitasking bonus if applicable
        if (this.inputState.multitaskingBonus > 0.5) {
            this.awardMultitaskingBonus();
        }
        
        console.log('📝 Stopped typing');
    }
    
    onKeyDown(e) {
        // Handle special keys during typing
        if (e.key === 'Escape' && this.inputState.isTyping) {
            this.onTypingEnd();
        }
    }
    
    onMovementKey(e) {
        const movementKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
        if (movementKeys.includes(e.key.toLowerCase()) || movementKeys.includes(e.key)) {
            this.movementState.lastMovementTime = Date.now();
        }
    }
    
    onMovementKeyUp(e) {
        // Handle movement key releases
    }
    
    onWindowResize() {
        if (this.connectionLine) {
            this.connectionLine.width = window.innerWidth;
            this.connectionLine.height = window.innerHeight;
        }
    }
    
    // === BONUS SYSTEMS ===
    
    createAccuracyIndicator(type) {
        this.accuracyIndicators.push({
            type: type,
            x: this.floatingPos.x + 175,
            y: this.floatingPos.y + 50,
            life: 800,
            maxLife: 800,
            alpha: 1.0
        });
    }
    
    awardMultitaskingBonus() {
        const bonusPoints = Math.floor(this.inputState.multitaskingBonus * 50);
        
        if (this.formulaSystem && bonusPoints > 0) {
            this.formulaSystem.score += bonusPoints;
            this.formulaSystem.showFeedback(`Multitasking Bonus! +${bonusPoints}`, true);
        }
        
        // Screen effects for bonus
        if (this.screenEffects) {
            this.screenEffects.triggerFlash('combo');
        }
        
        console.log(`🎯 Multitasking bonus awarded: ${bonusPoints} points`);
    }
    
    // === PUBLIC INTERFACE ===
    
    show() {
        if (this.floatingContainer) {
            this.floatingContainer.style.display = 'block';
        }
        if (this.connectionLine) {
            this.connectionLine.style.display = 'block';
        }
    }
    
    hide() {
        if (this.floatingContainer) {
            this.floatingContainer.style.display = 'none';
        }
        if (this.connectionLine) {
            this.connectionLine.style.display = 'none';
        }
    }
    
    isActive() {
        return this.inputState.isTyping;
    }
    
    getMovementPenalty() {
        return this.inputState.isTyping ? this.settings.movementPenalty : 1.0;
    }
    
    getAccuracyBonus() {
        if (!this.inputState.isTyping) return 1.0;
        
        const speedRatio = this.movementState.speed / this.settings.flowStateSpeed;
        if (speedRatio < 0.5) {
            return this.settings.accuracyBonus; // Bonus for slow, careful typing
        }
        return 1.0;
    }
    
    // === SETTINGS ===
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    cleanup() {
        if (this.floatingContainer) {
            this.floatingContainer.remove();
        }
        if (this.connectionLine) {
            this.connectionLine.remove();
        }
        
        // Remove any existing floating containers from DOM
        const existingContainers = document.querySelectorAll('#floatingFormulaContainer, .floating-formula-container');
        existingContainers.forEach(container => container.remove());
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FloatingInputSystem;
}
