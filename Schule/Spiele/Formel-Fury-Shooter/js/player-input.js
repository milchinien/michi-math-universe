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
        this.color = '#00ff00';
        this.glowColor = '#00ff0080';
        this.angle = 0; // for rotation effect
    }

    update(deltaTime, inputHandler, canvasWidth, canvasHeight) {
        // Cap deltaTime to prevent large jumps
        const dt = Math.min(deltaTime / 1000, 1/30); // Max 30 FPS equivalent
        
        // Handle input to set target velocity
        this.targetVelocity.x = 0;
        this.targetVelocity.y = 0;
        
        if (inputHandler.isPressed('w') || inputHandler.isPressed('W')) {
            this.targetVelocity.y = -this.speed;
        }
        if (inputHandler.isPressed('s') || inputHandler.isPressed('S')) {
            this.targetVelocity.y = this.speed;
        }
        if (inputHandler.isPressed('a') || inputHandler.isPressed('A')) {
            this.targetVelocity.x = -this.speed;
        }
        if (inputHandler.isPressed('d') || inputHandler.isPressed('D')) {
            this.targetVelocity.x = this.speed;
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
        // Left boundary
        if (this.x < this.width / 2) {
            this.x = this.width / 2;
            this.velocity.x = 0;
        }
        // Right boundary
        if (this.x > canvasWidth - this.width / 2) {
            this.x = canvasWidth - this.width / 2;
            this.velocity.x = 0;
        }
        // Top boundary
        if (this.y < this.height / 2) {
            this.y = this.height / 2;
            this.velocity.y = 0;
        }
        // Bottom boundary
        if (this.y > canvasHeight - this.height / 2) {
            this.y = canvasHeight - this.height / 2;
            this.velocity.y = 0;
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

    getDebugInfo() {
        return {
            position: `(${Math.round(this.x)}, ${Math.round(this.y)})`,
            velocity: `(${Math.round(this.velocity.x)}, ${Math.round(this.velocity.y)})`,
            speed: Math.round(Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2))
        };
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
