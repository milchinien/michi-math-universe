/**
 * FORMEL-FURY-SHOOTER - ARENA SYSTEM
 * Progressive arena deterioration revealing digital underworld
 */

class ArenaSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.canvas = gameEngine.canvas;
        this.ctx = gameEngine.ctx;
        
        // Arena state
        this.currentWave = 1;
        this.earthquakeCracks = [];
        this.collapseZones = [];
        this.fallingDebris = [];
        this.voidReveals = [];
        
        // Animation states
        this.earthquakeAnimations = [];
        this.collapseAnimations = [];
        this.debrisAnimations = [];
        this.digitalGlowTime = 0;
        
        // Deterioration timing (delayed start)
        this.deteriorationStartWave = 5; // Start deterioration at wave 5
        this.earthquakePhaseWaves = 3; // Earthquake phase lasts 3 waves
        this.collapsePhaseStart = this.deteriorationStartWave + this.earthquakePhaseWaves;
        
        // Arena deterioration settings
        this.earthquakeIntensity = 0;
        this.maxEarthquakeCracksPerWave = 2;
        this.maxCollapseZonesPerWave = 1;
        this.crackGrowthSpeed = 80; // pixels per second
        this.collapseSpeed = 40; // pixels per second
        
        // Debris physics
        this.gravity = 200; // pixels per second squared
        this.debrisCount = 0;
        this.maxDebrisPerCollapse = 8;
        
        // Visual settings
        this.crackColor = '#4A3728'; // Darker brown for earthquake cracks
        this.voidColor = '#000008'; // Deep void color
        this.digitalColors = [
            '#00ffff', '#ff00ff', '#ffff00', '#00ff00',
            '#ff0080', '#8000ff', '#0080ff', '#ff8000'
        ];
        
        // Initialize base arena
        this.initializeArena();
    }
    
    initializeArena() {
        // Create initial grass patches (will be destroyed over time)
        this.grassPatches = [];
        this.generateInitialGrass();
        
        // Create digital grid pattern for underworld
        this.generateDigitalGrid();
    }
    
    generateInitialGrass() {
        const numPatches = 40 + Math.floor(Math.random() * 20);
        let seed = 12345;
        const seededRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        
        for (let i = 0; i < numPatches; i++) {
            const patch = {
                x: seededRandom() * this.canvas.width,
                y: seededRandom() * this.canvas.height,
                size: 8 + seededRandom() * 15,
                opacity: 0.5 + seededRandom() * 0.4,
                grassType: Math.floor(seededRandom() * 3),
                destroyed: false,
                destructionTime: 0
            };
            this.grassPatches.push(patch);
        }
    }
    
    generateDigitalGrid() {
        this.digitalGrid = {
            cellSize: 20,
            lines: [],
            nodes: []
        };
        
        // Create grid lines
        for (let x = 0; x < this.canvas.width; x += this.digitalGrid.cellSize) {
            this.digitalGrid.lines.push({
                type: 'vertical',
                x: x,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        
        for (let y = 0; y < this.canvas.height; y += this.digitalGrid.cellSize) {
            this.digitalGrid.lines.push({
                type: 'horizontal',
                y: y,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
        
        // Create digital nodes at intersections
        for (let x = 0; x < this.canvas.width; x += this.digitalGrid.cellSize * 2) {
            for (let y = 0; y < this.canvas.height; y += this.digitalGrid.cellSize * 2) {
                this.digitalGrid.nodes.push({
                    x: x,
                    y: y,
                    size: 2 + Math.random() * 3,
                    color: this.digitalColors[Math.floor(Math.random() * this.digitalColors.length)],
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        }
    }
    
    onWaveStart(waveNumber) {
        this.currentWave = waveNumber;
        
        // Only start deterioration after wave 5
        if (waveNumber >= this.deteriorationStartWave) {
            this.generateDeteriorationForWave(waveNumber);
        }
        
        console.log(`🌊 Arena Wave ${waveNumber}: ${this.getPhaseDescription()}`);
    }
    
    getPhaseDescription() {
        if (this.currentWave < this.deteriorationStartWave) {
            return "Arena stabil";
        } else if (this.currentWave < this.collapsePhaseStart) {
            return "Erdbeben-Phase";
        } else {
            return "Kollaps-Phase";
        }
    }
    
    generateDeteriorationForWave(waveNumber) {
        const wavesSinceDeteriorationStart = waveNumber - this.deteriorationStartWave;
        
        if (waveNumber < this.collapsePhaseStart) {
            // Earthquake phase - only cracks
            this.generateEarthquakeCracks(wavesSinceDeteriorationStart);
        } else {
            // Collapse phase - major structural failure
            this.generateCollapseZones(waveNumber - this.collapsePhaseStart);
        }
        
        // Destroy grass patches gradually
        this.destroyGrassPatches();
    }
    
    generateEarthquakeCracks(intensity) {
        const numCracks = Math.min(this.maxEarthquakeCracksPerWave, 1 + intensity);
        
        for (let i = 0; i < numCracks; i++) {
            this.createEarthquakeCrack(intensity);
        }
    }
    
    createEarthquakeCrack(intensity) {
        const crack = {
            id: Date.now() + Math.random(),
            startX: Math.random() * this.canvas.width,
            startY: Math.random() * this.canvas.height,
            segments: [],
            currentSegment: 0,
            totalLength: 80 + Math.random() * 200 + (intensity * 50),
            growing: true,
            intensity: intensity,
            type: 'earthquake'
        };
        
        // Generate irregular crack path with varying widths
        this.generateIrregularCrackPath(crack);
        
        this.earthquakeCracks.push(crack);
        
        // Add earthquake animation
        this.earthquakeAnimations.push({
            crackId: crack.id,
            startTime: Date.now(),
            duration: crack.totalLength / this.crackGrowthSpeed * 1000,
            shakeIntensity: 1 + intensity * 0.5
        });
    }
    
    generateIrregularCrackPath(crack) {
        const numSegments = 8 + Math.floor(Math.random() * 12);
        const segmentLength = crack.totalLength / numSegments;
        
        let currentX = crack.startX;
        let currentY = crack.startY;
        let currentAngle = Math.random() * Math.PI * 2;
        
        for (let i = 0; i < numSegments; i++) {
            // Add randomness to angle (earthquake irregularity)
            currentAngle += (Math.random() - 0.5) * 0.8;
            
            // Vary segment length
            const thisSegmentLength = segmentLength * (0.7 + Math.random() * 0.6);
            
            // Calculate end position
            const endX = currentX + Math.cos(currentAngle) * thisSegmentLength;
            const endY = currentY + Math.sin(currentAngle) * thisSegmentLength;
            
            // Vary crack width along the path
            const baseWidth = 2 + Math.random() * 4 + crack.intensity;
            const widthVariation = 0.5 + Math.random() * 1.0;
            
            const segment = {
                startX: currentX,
                startY: currentY,
                endX: endX,
                endY: endY,
                width: baseWidth * widthVariation,
                visible: false,
                roughness: Math.random() * 2 + 1
            };
            
            crack.segments.push(segment);
            
            currentX = endX;
            currentY = endY;
            
            // Keep within bounds
            if (currentX < 0 || currentX > this.canvas.width || 
                currentY < 0 || currentY > this.canvas.height) {
                break;
            }
        }
    }
    
    generateCollapseZones(collapseIntensity) {
        const numZones = Math.min(this.maxCollapseZonesPerWave, 1 + Math.floor(collapseIntensity / 2));
        
        for (let i = 0; i < numZones; i++) {
            this.createCollapseZone(collapseIntensity);
        }
    }
    
    createCollapseZone(intensity) {
        const collapseZone = {
            id: Date.now() + Math.random(),
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            currentRadius: 0,
            targetRadius: 40 + Math.random() * 80 + (intensity * 30),
            growing: true,
            depth: 0.8 + Math.random() * 0.2,
            intensity: intensity,
            shape: 'irregular',
            cracksPreceding: [],
            debrisGenerated: false
        };
        
        // Generate preceding cracks around collapse zone
        this.generatePrecedingCracks(collapseZone);
        
        this.collapseZones.push(collapseZone);
        
        // Add collapse animation with delay for cracks
        this.collapseAnimations.push({
            zoneId: collapseZone.id,
            startTime: Date.now() + 1500, // 1.5s delay for cracks to form first
            duration: collapseZone.targetRadius / this.collapseSpeed * 1000
        });
    }
    
    generatePrecedingCracks(collapseZone) {
        const numCracks = 4 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numCracks; i++) {
            const angle = (i / numCracks) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
            const distance = collapseZone.targetRadius * 0.8 + Math.random() * collapseZone.targetRadius * 0.4;
            
            const crack = {
                id: Date.now() + Math.random() + i,
                startX: collapseZone.x,
                startY: collapseZone.y,
                endX: collapseZone.x + Math.cos(angle) * distance,
                endY: collapseZone.y + Math.sin(angle) * distance,
                currentLength: 0,
                targetLength: distance,
                angle: angle,
                width: 4 + Math.random() * 3,
                growing: true,
                type: 'preceding',
                parentZone: collapseZone.id
            };
            
            collapseZone.cracksPreceding.push(crack);
            
            // Animate preceding crack
            this.earthquakeAnimations.push({
                crackId: crack.id,
                startTime: Date.now(),
                duration: 1000, // 1 second to form
                shakeIntensity: 1
            });
        }
    }
    
    destroyGrassPatches() {
        const patchesToDestroy = Math.min(5, Math.floor(this.currentWave * 1.5));
        let destroyed = 0;
        
        for (let patch of this.grassPatches) {
            if (!patch.destroyed && destroyed < patchesToDestroy) {
                if (Math.random() < 0.3) { // 30% chance per patch
                    patch.destroyed = true;
                    patch.destructionTime = Date.now();
                    destroyed++;
                }
            }
        }
    }
    
    update(deltaTime) {
        this.digitalGlowTime += deltaTime;
        
        // Update earthquake crack animations
        this.updateEarthquakeAnimations();
        
        // Update collapse zone animations
        this.updateCollapseAnimations();
        
        // Update falling debris physics
        this.updateFallingDebris(deltaTime);
        
        // Update digital effects
        this.updateDigitalEffects(deltaTime);
    }
    
    updateEarthquakeAnimations() {
        const currentTime = Date.now();
        
        this.earthquakeAnimations = this.earthquakeAnimations.filter(animation => {
            // Find crack in earthquake cracks or preceding cracks
            let crack = this.earthquakeCracks.find(c => c.id === animation.crackId);
            if (!crack) {
                // Check in preceding cracks of collapse zones
                for (let zone of this.collapseZones) {
                    crack = zone.cracksPreceding.find(c => c.id === animation.crackId);
                    if (crack) break;
                }
            }
            
            if (!crack) return false;
            
            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(1, elapsed / animation.duration);
            
            // Update visible segments for irregular cracks
            if (crack.segments) {
                const totalSegments = crack.segments.length;
                const visibleSegments = Math.floor(progress * totalSegments);
                
                for (let i = 0; i < visibleSegments; i++) {
                    crack.segments[i].visible = true;
                }
                
                crack.currentSegment = visibleSegments;
            } else {
                // Legacy crack system
                crack.currentLength = progress * crack.targetLength;
            }
            
            if (progress >= 1) {
                crack.growing = false;
                // Create branches for major earthquake cracks
                if (crack.type === 'earthquake' && Math.random() < 0.4) {
                    this.createEarthquakeBranches(crack);
                }
                return false;
            }
            
            return true;
        });
    }
    
    createEarthquakeBranches(parentCrack) {
        if (!parentCrack.segments || parentCrack.segments.length === 0) return;
        
        const numBranches = 1 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numBranches; i++) {
            // Pick a random segment to branch from
            const segmentIndex = Math.floor(Math.random() * parentCrack.segments.length * 0.8);
            const segment = parentCrack.segments[segmentIndex];
            
            if (!segment) continue;
            
            // Branch from middle of segment
            const branchX = (segment.startX + segment.endX) / 2;
            const branchY = (segment.startY + segment.endY) / 2;
            
            const branchCrack = {
                id: Date.now() + Math.random() + i,
                startX: branchX,
                startY: branchY,
                segments: [],
                currentSegment: 0,
                totalLength: 20 + Math.random() * 60,
                growing: true,
                intensity: parentCrack.intensity * 0.7,
                type: 'branch'
            };
            
            this.generateIrregularCrackPath(branchCrack);
            
            if (!parentCrack.branches) parentCrack.branches = [];
            parentCrack.branches.push(branchCrack);
            
            // Animate branch
            this.earthquakeAnimations.push({
                crackId: branchCrack.id,
                startTime: Date.now() + 200, // Small delay
                duration: 800,
                shakeIntensity: 0.5
            });
        }
    }
    
    updateCollapseAnimations() {
        const currentTime = Date.now();
        
        this.collapseAnimations = this.collapseAnimations.filter(animation => {
            const zone = this.collapseZones.find(z => z.id === animation.zoneId);
            if (!zone) return false;
            
            const elapsed = currentTime - animation.startTime;
            
            // Don't start until after delay
            if (elapsed < 0) return true;
            
            const progress = Math.min(1, elapsed / animation.duration);
            
            zone.currentRadius = progress * zone.targetRadius;
            
            // Generate falling debris when collapse reaches 30%
            if (progress >= 0.3 && !zone.debrisGenerated) {
                this.generateFallingDebris(zone);
                zone.debrisGenerated = true;
            }
            
            if (progress >= 1) {
                zone.growing = false;
                return false;
            }
            
            return true;
        });
    }
    
    generateFallingDebris(collapseZone) {
        const numDebris = this.maxDebrisPerCollapse + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numDebris; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * collapseZone.currentRadius;
            
            const debris = {
                id: Date.now() + Math.random() + i,
                x: collapseZone.x + Math.cos(angle) * distance,
                y: collapseZone.y + Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 100, // horizontal velocity
                vy: -50 - Math.random() * 100, // initial upward velocity
                size: 4 + Math.random() * 12,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: '#8B4513',
                life: 1.0,
                fadeSpeed: 0.3 + Math.random() * 0.4
            };
            
            this.fallingDebris.push(debris);
        }
    }
    
    updateFallingDebris(deltaTime) {
        this.fallingDebris = this.fallingDebris.filter(debris => {
            // Apply physics
            debris.vy += this.gravity * deltaTime / 1000;
            debris.x += debris.vx * deltaTime / 1000;
            debris.y += debris.vy * deltaTime / 1000;
            debris.rotation += debris.rotationSpeed * deltaTime / 1000;
            
            // Fade out over time
            debris.life -= debris.fadeSpeed * deltaTime / 1000;
            
            // Remove if faded or fallen too far
            return debris.life > 0 && debris.y < this.canvas.height + 100;
        });
    }
    
    updateDigitalEffects(deltaTime) {
        // Update digital node pulsing
        this.digitalGrid.nodes.forEach(node => {
            node.pulsePhase += deltaTime * 0.003;
        });
    }
    
    render() {
        // Render base arena floor
        this.renderBaseFloor();
        
        // Render void areas (infinite depth)
        this.renderVoidAreas();
        
        // Render digital underworld (visible through collapse zones)
        this.renderDigitalUnderworld();
        
        // Render remaining grass patches
        this.renderGrassPatches();
        
        // Render earthquake cracks
        this.renderEarthquakeCracks();
        
        // Render collapse zones
        this.renderCollapseZones();
        
        // Render falling debris
        this.renderFallingDebris();
        
        // Render map boundaries
        this.renderMapBoundaries();
    }
    
    renderBaseFloor() {
        // Desert sand background with deterioration
        const deterioration = Math.min(0.8, this.currentWave * 0.05);
        const baseColor = `rgba(194, 178, 128, ${1 - deterioration})`;
        
        this.ctx.fillStyle = baseColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add texture with increasing roughness
        if (deterioration > 0.2) {
            this.ctx.save();
            this.ctx.globalAlpha = deterioration * 0.3;
            
            for (let i = 0; i < 100; i++) {
                this.ctx.fillStyle = Math.random() < 0.5 ? '#8B7355' : '#A0916B';
                this.ctx.fillRect(
                    Math.random() * this.canvas.width,
                    Math.random() * this.canvas.height,
                    2 + Math.random() * 4,
                    2 + Math.random() * 4
                );
            }
            
            this.ctx.restore();
        }
    }
    
    renderVoidAreas() {
        // Render infinite void beneath collapse zones
        this.collapseZones.forEach((zone, index) => {
            if (zone.currentRadius > 0) {
                this.ctx.save();
                
                // Create clipping mask for the collapse zone (stable shape)
                this.ctx.beginPath();
                this.renderIrregularShape(zone.x, zone.y, zone.currentRadius, 8, zone.id);
                this.ctx.clip();
                
                // Render deep void with gradient
                const gradient = this.ctx.createRadialGradient(
                    zone.x, zone.y, 0,
                    zone.x, zone.y, zone.currentRadius
                );
                gradient.addColorStop(0, this.voidColor);
                gradient.addColorStop(0.7, '#000002');
                gradient.addColorStop(1, '#000000');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Add depth effect with stable particles
                this.renderVoidDepthEffect(zone, index);
                
                this.ctx.restore();
                
                // Render cliff edges around the void
                this.renderCliffEdges(zone, index);
            }
        });
    }
    
    renderVoidDepthEffect(zone, zoneIndex) {
        // Create illusion of infinite depth with stable moving dots
        const time = this.digitalGlowTime * 0.0005; // Slower movement
        const numParticles = 15;
        
        // Use zone-specific seed for stable particle positions
        let seed = zoneIndex * 1000 + 12345;
        const seededRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        
        for (let i = 0; i < numParticles; i++) {
            const baseAngle = (i / numParticles) * Math.PI * 2;
            const angle = baseAngle + time * (0.3 + seededRandom() * 0.4);
            const baseDistance = seededRandom() * zone.currentRadius * 0.7;
            const distance = baseDistance + Math.sin(time * 2 + i) * 10;
            const depth = (Math.sin(time * 1.5 + i * 0.3) * 0.3 + 0.7);
            
            const x = zone.x + Math.cos(angle) * distance;
            const y = zone.y + Math.sin(angle) * distance;
            const size = 0.5 + depth * 2;
            const alpha = 0.05 + depth * 0.2;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    renderCliffEdges(zone, zoneIndex) {
        // Generate cliff pieces around the void edge
        if (!zone.cliffPieces) {
            zone.cliffPieces = this.generateCliffPieces(zone, zoneIndex);
        }
        
        // Update cliff pieces (some may fall)
        zone.cliffPieces = zone.cliffPieces.filter(cliff => {
            // Update falling cliffs
            if (cliff.falling) {
                cliff.vy += 150 * (1/60); // gravity
                cliff.y += cliff.vy * (1/60);
                cliff.rotation += cliff.rotationSpeed * (1/60);
                cliff.life -= 0.8 * (1/60);
                
                return cliff.life > 0 && cliff.y < this.canvas.height + 50;
            }
            
            // Check if cliff should start falling
            const distanceFromCenter = Math.sqrt(
                (cliff.x - zone.x) ** 2 + (cliff.y - zone.y) ** 2
            );
            
            if (distanceFromCenter < zone.currentRadius + 10) {
                cliff.falling = true;
                cliff.vy = -20 - Math.random() * 30;
                cliff.rotationSpeed = (Math.random() - 0.5) * 8;
            }
            
            return true;
        });
        
        // Render cliff pieces
        zone.cliffPieces.forEach(cliff => {
            this.ctx.save();
            
            this.ctx.globalAlpha = cliff.life;
            this.ctx.translate(cliff.x, cliff.y);
            this.ctx.rotate(cliff.rotation);
            
            // Render cliff piece
            this.ctx.fillStyle = '#8B7355';
            this.ctx.beginPath();
            
            const points = 5;
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const variance = 0.7 + Math.random() * 0.6;
                const x = Math.cos(angle) * cliff.size * variance;
                const y = Math.sin(angle) * cliff.size * variance;
                
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            
            this.ctx.closePath();
            this.ctx.fill();
            
            // Add darker edge
            this.ctx.strokeStyle = '#6B5B47';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            this.ctx.restore();
        });
    }
    
    generateCliffPieces(zone, zoneIndex) {
        const pieces = [];
        const numPieces = 12 + Math.floor(Math.random() * 8);
        
        let seed = zoneIndex * 2000 + 54321;
        const seededRandom = () => {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
        
        for (let i = 0; i < numPieces; i++) {
            const angle = (i / numPieces) * Math.PI * 2 + seededRandom() * 0.5;
            const distance = zone.targetRadius + 5 + seededRandom() * 15;
            
            pieces.push({
                x: zone.x + Math.cos(angle) * distance,
                y: zone.y + Math.sin(angle) * distance,
                size: 4 + seededRandom() * 8,
                rotation: seededRandom() * Math.PI * 2,
                rotationSpeed: 0,
                falling: false,
                vy: 0,
                life: 1.0
            });
        }
        
        return pieces;
    }
    
    renderDigitalUnderworld() {
        // Only render digital elements visible through collapse zones after they're deep enough
        this.collapseZones.forEach(zone => {
            if (zone.currentRadius > zone.targetRadius * 0.6) {
                this.ctx.save();
                
                // Create clipping mask for the collapse zone
                this.ctx.beginPath();
                this.renderIrregularShape(zone.x, zone.y, zone.currentRadius * 0.8, 8);
                this.ctx.clip();
                
                // Render digital grid with reduced intensity
                this.ctx.globalAlpha = 0.3;
                this.renderDigitalGrid();
                
                this.ctx.restore();
            }
        });
    }
    
    renderDigitalGrid() {
        // Render grid lines
        this.digitalGrid.lines.forEach(line => {
            this.ctx.save();
            this.ctx.globalAlpha = line.opacity;
            this.ctx.strokeStyle = '#00ffff';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            
            if (line.type === 'vertical') {
                this.ctx.moveTo(line.x, 0);
                this.ctx.lineTo(line.x, this.canvas.height);
            } else {
                this.ctx.moveTo(0, line.y);
                this.ctx.lineTo(this.canvas.width, line.y);
            }
            
            this.ctx.stroke();
            this.ctx.restore();
        });
        
        // Render digital nodes
        this.digitalGrid.nodes.forEach(node => {
            this.ctx.save();
            
            const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
            const size = node.size * (0.8 + pulse * 0.4);
            
            this.ctx.globalAlpha = 0.7 + pulse * 0.3;
            this.ctx.fillStyle = node.color;
            this.ctx.shadowColor = node.color;
            this.ctx.shadowBlur = 8;
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderGrassPatches() {
        const currentTime = Date.now();
        
        this.grassPatches.forEach(patch => {
            if (patch.destroyed) {
                // Fade out destroyed patches
                const fadeTime = 2000; // 2 seconds
                const elapsed = currentTime - patch.destructionTime;
                if (elapsed < fadeTime) {
                    patch.opacity = (1 - elapsed / fadeTime) * (0.5 + Math.random() * 0.4);
                } else {
                    patch.opacity = 0;
                }
            }
            
            if (patch.opacity > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = patch.opacity;
                
                const grassColors = ['#6B7A3F', '#5A6B2F', '#7A8B4F'];
                this.ctx.fillStyle = grassColors[patch.grassType];
                
                this.ctx.beginPath();
                this.ctx.arc(patch.x, patch.y, patch.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
        });
    }
    
    renderEarthquakeCracks() {
        // Render earthquake cracks with realistic irregular appearance
        this.earthquakeCracks.forEach(crack => {
            if (crack.segments && crack.currentSegment > 0) {
                this.renderIrregularCrack(crack);
            }
        });
        
        // Render branches
        this.earthquakeCracks.forEach(crack => {
            if (crack.branches) {
                crack.branches.forEach(branch => {
                    if (branch.segments && branch.currentSegment > 0) {
                        this.renderIrregularCrack(branch);
                    }
                });
            }
        });
        
        // Render preceding cracks for collapse zones
        this.collapseZones.forEach(zone => {
            zone.cracksPreceding.forEach(crack => {
                if (crack.currentLength > 0) {
                    this.ctx.save();
                    
                    const currentEndX = crack.startX + Math.cos(crack.angle) * crack.currentLength;
                    const currentEndY = crack.startY + Math.sin(crack.angle) * crack.currentLength;
                    
                    this.ctx.strokeStyle = '#8B7355'; // Earth color
                    this.ctx.lineWidth = crack.width;
                    this.ctx.lineCap = 'round';
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(crack.startX, crack.startY);
                    this.ctx.lineTo(currentEndX, currentEndY);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                }
            });
        });
    }
    
    renderIrregularCrack(crack) {
        this.ctx.save();
        
        // Render each visible segment
        for (let i = 0; i < crack.currentSegment && i < crack.segments.length; i++) {
            const segment = crack.segments[i];
            if (!segment.visible) continue;
            
            // Render earth-colored edges first (wider)
            this.ctx.strokeStyle = '#A0916B'; // Light earth color
            this.ctx.lineWidth = segment.width + 2;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            
            // Add roughness to the line
            const steps = 8;
            for (let step = 0; step <= steps; step++) {
                const t = step / steps;
                const x = segment.startX + (segment.endX - segment.startX) * t;
                const y = segment.startY + (segment.endY - segment.startY) * t;
                
                // Add roughness
                const roughX = x + (Math.sin(t * Math.PI * 4 + i) * segment.roughness);
                const roughY = y + (Math.cos(t * Math.PI * 3 + i) * segment.roughness);
                
                if (step === 0) {
                    this.ctx.moveTo(roughX, roughY);
                } else {
                    this.ctx.lineTo(roughX, roughY);
                }
            }
            
            this.ctx.stroke();
            
            // Render darker inner crack
            this.ctx.strokeStyle = '#6B5B47'; // Darker earth
            this.ctx.lineWidth = segment.width;
            this.ctx.stroke();
            
            // Render deepest part
            this.ctx.strokeStyle = '#4A3F35'; // Very dark earth
            this.ctx.lineWidth = Math.max(1, segment.width - 2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    renderCollapseZones() {
        this.collapseZones.forEach(zone => {
            if (zone.currentRadius > 0) {
                this.ctx.save();
                
                // Render jagged collapse edge
                this.ctx.strokeStyle = '#5D4037';
                this.ctx.lineWidth = 4;
                this.ctx.lineCap = 'round';
                
                this.ctx.beginPath();
                this.renderIrregularShape(zone.x, zone.y, zone.currentRadius, 12);
                this.ctx.stroke();
                
                // Add inner shadow for depth
                this.ctx.strokeStyle = '#3E2723';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                
                this.ctx.restore();
            }
        });
    }
    
    renderIrregularShape(centerX, centerY, radius, points, seed = 0) {
        // Use seed for consistent shape to prevent flickering
        let localSeed = seed;
        const seededRandom = () => {
            localSeed = (localSeed * 9301 + 49297) % 233280;
            return localSeed / 233280;
        };
        
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const variance = 0.6 + seededRandom() * 0.8;
            const x = centerX + Math.cos(angle) * radius * variance;
            const y = centerY + Math.sin(angle) * radius * variance;
            
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
    }
    
    renderFallingDebris() {
        this.fallingDebris.forEach(debris => {
            this.ctx.save();
            
            this.ctx.globalAlpha = debris.life;
            this.ctx.translate(debris.x, debris.y);
            this.ctx.rotate(debris.rotation);
            
            // Render rock-like debris
            this.ctx.fillStyle = debris.color;
            this.ctx.beginPath();
            
            // Irregular rock shape
            const points = 6;
            for (let i = 0; i < points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const variance = 0.7 + Math.random() * 0.6;
                const x = Math.cos(angle) * debris.size * variance;
                const y = Math.sin(angle) * debris.size * variance;
                
                if (i === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            
            this.ctx.closePath();
            this.ctx.fill();
            
            // Add shadow/depth
            this.ctx.fillStyle = '#654321';
            this.ctx.globalAlpha = debris.life * 0.5;
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    renderMapBoundaries() {
        const borderWidth = 10;
        
        this.ctx.save();
        this.ctx.fillStyle = '#8B4513';
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        
        // Top wall
        this.ctx.fillRect(0, 0, this.canvas.width, borderWidth);
        this.ctx.strokeRect(0, 0, this.canvas.width, borderWidth);
        
        // Bottom wall
        this.ctx.fillRect(0, this.canvas.height - borderWidth, this.canvas.width, borderWidth);
        this.ctx.strokeRect(0, this.canvas.height - borderWidth, this.canvas.width, borderWidth);
        
        // Left wall
        this.ctx.fillRect(0, 0, borderWidth, this.canvas.height);
        this.ctx.strokeRect(0, 0, borderWidth, this.canvas.height);
        
        // Right wall
        this.ctx.fillRect(this.canvas.width - borderWidth, 0, borderWidth, this.canvas.height);
        this.ctx.strokeRect(this.canvas.width - borderWidth, 0, borderWidth, this.canvas.height);
        
        this.ctx.restore();
    }
}
