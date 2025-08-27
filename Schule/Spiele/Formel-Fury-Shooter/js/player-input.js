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
        
        ctx.restore();
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
