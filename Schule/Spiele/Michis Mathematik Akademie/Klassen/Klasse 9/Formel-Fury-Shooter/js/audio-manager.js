/**
 * Audio Manager System - Phase 1, Step 1.3
 * Comprehensive audio feedback system for immediate acoustic response to all game actions
 */

class AudioManager {
    constructor() {
        // Audio context for advanced audio processing
        this.audioContext = null;
        this.masterGainNode = null;
        
        // Audio pools for performance
        this.audioPool = new Map();
        this.activeAudio = new Set();
        
        // Volume controls
        this.volumes = {
            master: 0.7,
            sfx: 0.8,
            ambient: 0.4,
            feedback: 0.9,
            music: 0.3
        };
        
        // Audio layers
        this.layers = {
            base: [], // Ambient and music
            action: [], // Gameplay sounds
            feedback: [], // Immediate reaction sounds
            effect: [] // Special effects and distortions
        };
        
        // Dynamic audio state
        this.dynamicState = {
            tension: 0.0, // 0-1 tension level
            adrenaline: 0.0, // 0-1 adrenaline level
            health: 1.0, // 0-1 health percentage
            combo: 0, // Current combo count
            tempo: 1.0 // Music tempo multiplier
        };
        
        // Settings
        this.settings = {
            enabled: true,
            spatialAudio: true,
            dynamicAudio: true,
            audioQuality: 'high', // high, medium, low
            maxConcurrentSounds: 32
        };
        
        // Initialize audio system
        this.init();
    }
    
    async init() {
        try {
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);
            this.masterGainNode.gain.value = this.volumes.master;
            
            // Create audio pools for frequently used sounds
            this.createAudioPools();
            
            console.log('🔊 AudioManager initialized successfully');
        } catch (error) {
            console.warn('🔇 AudioManager failed to initialize:', error);
            this.settings.enabled = false;
        }
    }
    
    createAudioPools() {
        // Create pools for different sound types
        const soundTypes = [
            'keypress', 'correct', 'wrong', 'explosion', 'damage',
            'combo', 'heartbeat', 'ambient', 'click'
        ];
        
        soundTypes.forEach(type => {
            this.audioPool.set(type, []);
        });
        
        // Add boss-specific sound pools
        const bossSounds = [
            'boss_spawn', 'boss_attack', 'boss_damage', 'boss_victory',
            'boss_warning', 'boss_defeat', 'boss_formula_correct', 'boss_formula_wrong'
        ];
        
        bossSounds.forEach(type => {
            this.audioPool.set(type, []);
        });
    }
    
    // === CORE AUDIO PLAYBACK ===
    
    playSound(soundId, options = {}) {
        if (!this.settings.enabled) return null;
        
        const {
            volume = 1.0,
            pitch = 1.0,
            pan = 0.0,
            loop = false,
            fadeIn = 0,
            position = null // { x, y } for 3D audio
        } = options;
        
        let layer = options.layer || 'action';
        
        // Validate layer exists
        if (!this.layers[layer]) {
            console.warn(`🔊 Unknown audio layer: ${layer}, falling back to 'action'`);
            layer = 'action';
        }
        
        // Generate audio using Web Audio API (since we don't have actual audio files)
        const audioNode = this.createSyntheticAudio(soundId, {
            volume: volume * this.volumes.sfx,
            pitch,
            pan,
            loop,
            fadeIn,
            position
        });
        
        if (audioNode) {
            // Ensure layer exists, fallback to 'action' if not
            if (!this.layers[layer]) {
                console.warn(`🔊 AudioManager: Unknown layer '${layer}', using 'action' instead`);
                layer = 'action';
            }
            this.layers[layer].push(audioNode);
            this.activeAudio.add(audioNode);
            
            // Clean up when sound ends
            setTimeout(() => {
                this.cleanupAudioNode(audioNode, layer);
            }, this.getSoundDuration(soundId));
        }
        
        return audioNode;
    }
    
    createSyntheticAudio(soundId, options) {
        if (!this.audioContext) return null;
        
        const { volume, pitch, pan, loop, fadeIn, position } = options;
        
        // Create audio nodes
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const pannerNode = this.audioContext.createStereoPanner();
        
        // Configure based on sound type
        const soundConfig = this.getSoundConfig(soundId);
        
        // Set oscillator properties with validation
        oscillator.type = soundConfig.waveform;
        const frequency = soundConfig.frequency * pitch;
        const validFrequency = isFinite(frequency) && frequency > 0 ? frequency : 440;
        oscillator.frequency.setValueAtTime(validFrequency, this.audioContext.currentTime);
        
        // Apply frequency modulation for complex sounds
        if (soundConfig.modulation) {
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.frequency.value = soundConfig.modulation.rate;
            lfoGain.gain.value = soundConfig.modulation.depth;
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.start();
        }
        
        // Set gain envelope with validation
        const validVolume = isFinite(volume) && volume >= 0 ? Math.min(volume, 1) : 0.5;
        const validFadeIn = isFinite(fadeIn) && fadeIn >= 0 ? fadeIn : 0;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        if (validFadeIn > 0) {
            gainNode.gain.linearRampToValueAtTime(validVolume, this.audioContext.currentTime + validFadeIn);
        } else {
            gainNode.gain.setValueAtTime(validVolume, this.audioContext.currentTime);
        }
        
        // Apply ADSR envelope with validation
        const now = this.audioContext.currentTime;
        const attack = isFinite(soundConfig.envelope.attack) ? Math.max(soundConfig.envelope.attack, 0.001) : 0.01;
        const decay = isFinite(soundConfig.envelope.decay) ? Math.max(soundConfig.envelope.decay, 0.001) : 0.1;
        const sustain = isFinite(soundConfig.envelope.sustain) ? Math.max(Math.min(soundConfig.envelope.sustain, 1), 0) : 0.7;
        const release = isFinite(soundConfig.envelope.release) ? Math.max(soundConfig.envelope.release, 0.001) : 0.3;
        
        gainNode.gain.linearRampToValueAtTime(validVolume, now + attack);
        gainNode.gain.linearRampToValueAtTime(validVolume * sustain, now + attack + decay);
        
        if (!loop) {
            const duration = this.getSoundDuration(soundId);
            const validDuration = isFinite(duration) && duration > 0 ? duration : 1.0;
            gainNode.gain.setValueAtTime(validVolume * sustain, now + validDuration - release);
            gainNode.gain.linearRampToValueAtTime(0, now + validDuration);
        }
        
        // Set panning with validation
        const validPan = isFinite(pan) ? Math.max(-1, Math.min(1, pan)) : 0;
        pannerNode.pan.value = validPan;
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(pannerNode);
        pannerNode.connect(this.masterGainNode);
        
        // Start oscillator
        oscillator.start();
        if (!loop) {
            oscillator.stop(this.audioContext.currentTime + this.getSoundDuration(soundId));
        }
        
        return { oscillator, gainNode, pannerNode, soundId };
    }
    
    getSoundConfig(soundId) {
        const configs = {
            keypress: {
                waveform: 'square',
                frequency: 800,
                envelope: { attack: 0.01, decay: 0.05, sustain: 0.3, release: 0.1 }
            },
            correct: {
                waveform: 'sine',
                frequency: 523.25, // C5
                envelope: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.3 }
            },
            wrong: {
                waveform: 'sawtooth',
                frequency: 220,
                envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.4 }
            },
            explosion: {
                waveform: 'triangle',
                frequency: 60,
                modulation: { rate: 30, depth: 20 },
                envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.5 }
            },
            damage: {
                waveform: 'sawtooth',
                frequency: 150,
                modulation: { rate: 50, depth: 30 },
                envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 0.2 }
            },
            combo: {
                waveform: 'sine',
                frequency: 659.25, // E5
                envelope: { attack: 0.01, decay: 0.05, sustain: 0.8, release: 0.2 }
            },
            heartbeat: {
                waveform: 'sine',
                frequency: 80,
                envelope: { attack: 0.02, decay: 0.1, sustain: 0.1, release: 0.3 }
            },
            ambient: {
                waveform: 'triangle',
                frequency: 55, // A1
                envelope: { attack: 2.0, decay: 1.0, sustain: 0.8, release: 2.0 }
            },
            click: {
                waveform: 'square',
                frequency: 1000,
                envelope: { attack: 0.005, decay: 0.02, sustain: 0.1, release: 0.05 }
            },
            dash: {
                waveform: 'triangle',
                frequency: 200,
                modulation: { rate: 20, depth: 50 },
                envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 }
            }
        };
        
        return configs[soundId] || configs.click;
    }
    
    getSoundDuration(soundId) {
        const durations = {
            keypress: 0.15,
            correct: 0.5,
            wrong: 0.8,
            explosion: 1.0,
            damage: 0.6,
            combo: 0.3,
            heartbeat: 0.5,
            ambient: 10.0,
            click: 0.1,
            dash: 0.3
        };
        
        return durations[soundId] || 0.2;
    }
    
    cleanupAudioNode(audioNode, layer) {
        if (this.layers[layer]) {
            const index = this.layers[layer].indexOf(audioNode);
            if (index > -1) {
                this.layers[layer].splice(index, 1);
            }
        }
        this.activeAudio.delete(audioNode);
    }
    
    // === GAME EVENT AUDIO METHODS ===
    
    onFormulaKeyPress() {
        this.playSound('keypress', {
            volume: 0.3,
            pitch: 0.9 + Math.random() * 0.2, // Slight pitch variation
            layer: 'feedback'
        });
    }
    
    onCorrectAnswer(combo = 0) {
        // Base success sound
        this.playSound('correct', {
            volume: 0.8,
            pitch: 1.0 + (combo * 0.05), // Higher pitch for higher combos
            layer: 'feedback'
        });
        
        // Add explosion for emphasis
        this.playSound('explosion', {
            volume: 0.4,
            pitch: 1.2,
            layer: 'effect'
        });
        
        // Combo sound if applicable
        if (combo > 2) {
            this.playSound('combo', {
                volume: 0.6,
                pitch: 1.0 + (combo * 0.1),
                layer: 'feedback'
            });
        }
    }
    
    onWrongAnswer() {
        // Damage sound
        this.playSound('damage', {
            volume: 0.9,
            pitch: 0.8,
            layer: 'feedback'
        });
        
        // Wrong answer sound
        this.playSound('wrong', {
            volume: 0.7,
            pitch: 0.7,
            layer: 'effect'
        });
    }
    
    onEnemyDeath(position = null) {
        this.playSound('explosion', {
            volume: 0.8,
            pitch: 1.0,
            position: position,
            layer: 'action'
        });
    }
    
    onPlayerDamage() {
        this.playSound('damage', {
            volume: 1.0,
            pitch: 0.6,
            layer: 'feedback'
        });
    }
    
    onComboIncrease(comboCount) {
        const pitch = 1.0 + (comboCount * 0.08);
        this.playSound('combo', {
            volume: 0.5 + (comboCount * 0.05),
            pitch: Math.min(pitch, 2.0),
            layer: 'feedback'
        });
    }
    
    onComboBreak() {
        this.playSound('wrong', {
            volume: 0.8,
            pitch: 0.5,
            layer: 'feedback'
        });
    }
    
    onWaveComplete() {
        // Victory fanfare
        setTimeout(() => this.playSound('correct', { volume: 0.8, pitch: 1.0 }), 0);
        setTimeout(() => this.playSound('correct', { volume: 0.8, pitch: 1.25 }), 150);
        setTimeout(() => this.playSound('correct', { volume: 0.8, pitch: 1.5 }), 300);
        setTimeout(() => this.playSound('explosion', { volume: 0.6, pitch: 1.2 }), 450);
    }
    
    onLowHealth(healthPercent) {
        if (healthPercent < 0.3) {
            // Start heartbeat if not already playing
            if (!this.isHeartbeatPlaying) {
                this.startHeartbeat(1.0 - healthPercent);
            }
        } else {
            this.stopHeartbeat();
        }
    }
    
    startHeartbeat(intensity) {
        this.isHeartbeatPlaying = true;
        const playHeartbeat = () => {
            if (this.isHeartbeatPlaying) {
                this.playSound('heartbeat', {
                    volume: 0.4 * intensity,
                    pitch: 0.8 + (intensity * 0.4),
                    layer: 'ambient'
                });
                
                const interval = 800 - (intensity * 300); // Faster heartbeat when lower health
                setTimeout(playHeartbeat, interval);
            }
        };
        playHeartbeat();
    }
    
    stopHeartbeat() {
        this.isHeartbeatPlaying = false;
    }
    
    // === AMBIENT AUDIO ===
    
    startAmbientAudio() {
        if (this.ambientPlaying) return;
        
        this.ambientPlaying = true;
        this.playSound('ambient', {
            volume: 0.2,
            loop: true,
            layer: 'base'
        });
    }
    
    stopAmbientAudio() {
        this.ambientPlaying = false;
        // Stop all ambient sounds
        this.layers.base.forEach(audioNode => {
            if (audioNode.oscillator) {
                audioNode.oscillator.stop();
            }
        });
        this.layers.base = [];
    }
    
    // === DYNAMIC AUDIO EFFECTS ===
    
    updateDynamicState(state) {
        this.dynamicState = { ...this.dynamicState, ...state };
        this.applyDynamicEffects();
    }
    
    applyDynamicEffects() {
        if (!this.settings.dynamicAudio) return;
        
        // Adjust master volume based on tension
        const tensionVolume = 0.7 + (this.dynamicState.tension * 0.3);
        this.masterGainNode.gain.setValueAtTime(
            tensionVolume * this.volumes.master,
            this.audioContext.currentTime
        );
        
        // Apply low-pass filter when health is low
        if (this.dynamicState.health < 0.3) {
            // Implementation would add low-pass filtering here
        }
    }
    
    // === VOLUME CONTROLS ===
    
    setVolume(category, volume) {
        this.volumes[category] = Math.max(0, Math.min(1, volume));
        
        if (category === 'master') {
            this.masterGainNode.gain.value = this.volumes.master;
        }
    }
    
    getVolume(category) {
        return this.volumes[category] || 0;
    }
    
    // === SETTINGS ===
    
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }
    
    toggleAudio() {
        this.settings.enabled = !this.settings.enabled;
        if (!this.settings.enabled) {
            this.stopAllAudio();
        }
        return this.settings.enabled;
    }
    
    stopAllAudio() {
        this.activeAudio.forEach(audioNode => {
            if (audioNode.oscillator) {
                audioNode.oscillator.stop();
            }
        });
        
        Object.keys(this.layers).forEach(layer => {
            this.layers[layer] = [];
        });
        
        this.activeAudio.clear();
        this.stopHeartbeat();
        this.stopAmbientAudio();
    }
    
    // === UTILITY METHODS ===
    
    playUISound(soundType = 'click') {
        this.playSound(soundType, {
            volume: 0.5,
            layer: 'feedback'
        });
    }
    
    preloadSounds() {
        // Preload critical sounds by creating and immediately stopping them
        const criticalSounds = ['keypress', 'correct', 'wrong', 'explosion', 'damage'];
        criticalSounds.forEach(soundId => {
            const audioNode = this.createSyntheticAudio(soundId, { volume: 0 });
            if (audioNode && audioNode.oscillator) {
                audioNode.oscillator.stop();
            }
        });
    }
    
    // === BOSS AUDIO INTEGRATION ===
    
    onBossSpawn(boss) {
        console.log(`🔊 Boss spawn audio for ${boss.name}`);
        this.playSound('boss_spawn', {
            volume: 0.8,
            layer: 'action',
            pitch: 0.7 + (boss.level * 0.1) // Deeper pitch for higher level bosses
        });
        
        // Start boss ambient music
        this.startBossMusic(boss.level);
    }
    
    onBossAttack(attackType) {
        console.log(`🔊 Boss attack audio: ${attackType}`);
        this.playSound('boss_attack', {
            volume: 0.7,
            layer: 'action',
            pitch: this.getBossAttackPitch(attackType)
        });
    }
    
    onBossFormulaCorrect(boss) {
        console.log('🔊 Boss formula correct audio');
        this.playSound('boss_formula_correct', {
            volume: 0.6,
            layer: 'feedback',
            pitch: 1.2
        });
    }
    
    onBossFormulaWrong(boss) {
        console.log('🔊 Boss formula wrong audio');
        this.playSound('boss_formula_wrong', {
            volume: 0.7,
            layer: 'feedback',
            pitch: 0.8
        });
    }
    
    onBossDamage(boss) {
        console.log('🔊 Boss damage audio');
        this.playSound('boss_damage', {
            volume: 0.8,
            layer: 'action',
            pitch: 0.9
        });
    }
    
    onBossDefeat(boss) {
        console.log(`🔊 Boss defeat audio for ${boss.name}`);
        this.playSound('boss_defeat', {
            volume: 1.0,
            layer: 'feedback',
            pitch: 0.6
        });
        
        // Stop boss music
        this.stopBossMusic();
    }
    
    onBossVictory() {
        console.log('🔊 Boss victory audio');
        this.playSound('boss_victory', {
            volume: 0.9,
            layer: 'feedback',
            pitch: 1.3
        });
    }
    
    startBossMusic(bossLevel) {
        // Placeholder for boss music - would play different tracks based on level
        console.log(`🎵 Starting boss music for level ${bossLevel}`);
    }
    
    stopBossMusic() {
        console.log('🎵 Stopping boss music');
    }
    
    getBossAttackPitch(attackType) {
        const pitchMap = {
            'algebra_waves': 1.1,
            'number_rain': 0.9,
            'formula_storm': 1.3,
            'variable_chaos': 0.7
        };
        return pitchMap[attackType] || 1.0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
