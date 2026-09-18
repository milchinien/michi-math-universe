/**
 * FORMEL-FURY-SHOOTER - MAIN INITIALIZATION
 * Entry point and game initialization
 * Phase 4.2: Modulare Struktur
 */

// Initialize game modules when page loads (but don't start the game yet)
window.addEventListener('load', () => {
    console.log('🎮 Formel-Fury-Shooter initializing...');
    console.log('📁 Loading modular structure...');
    
    try {
        // Verify all required classes are loaded
        if (typeof FormulaSystem === 'undefined') {
            throw new Error('FormulaSystem class not loaded');
        }
        if (typeof Enemy === 'undefined') {
            throw new Error('Enemy class not loaded');
        }
        if (typeof EnemySpawner === 'undefined') {
            throw new Error('EnemySpawner class not loaded');
        }
        if (typeof CurrencySystem === 'undefined') {
            throw new Error('CurrencySystem class not loaded');
        }
        if (typeof WaveSystem === 'undefined') {
            throw new Error('WaveSystem class not loaded');
        }
        if (typeof LevelSystem === 'undefined') {
            throw new Error('LevelSystem class not loaded');
        }
        if (typeof Player === 'undefined') {
            throw new Error('Player class not loaded');
        }
        if (typeof InputHandler === 'undefined') {
            throw new Error('InputHandler class not loaded');
        }
        if (typeof ArenaSystem === 'undefined') {
            throw new Error('ArenaSystem class not loaded');
        }
        if (typeof GameEngine === 'undefined') {
            throw new Error('GameEngine class not loaded');
        }
        
        console.log('✅ All modules loaded successfully');
        console.log('📚 Class selection menu is now active');
        console.log('🔧 Game engine ready to initialize after class selection');
        
        // Don't start the game immediately - wait for class selection
        // The game will be initialized by the ClassSelectionSystem
        
    } catch (error) {
        console.error('❌ Failed to initialize game modules:', error);
        alert('Error loading the game!\n\n' + error.message + '\n\nPlease check that all files loaded correctly.');
    }
});

// Function to initialize the actual game (called by ClassSelectionSystem)
window.initializeFormelFuryShooter = function() {
    console.log('🚀 Starting Formel-Fury-Shooter...');
    
    try {
        // Initialize the game engine
        const game = new GameEngine();
        console.log('✅ Game engine started successfully!');
        
        // Make game accessible globally for debugging and menu functions
        window.game = game;
        window.gameEngine = game;
        
        // Currency system is now ready and integrated
        console.log('💰 CurrencySystem loaded and ready');
        
        console.log('🚀 Formel-Fury-Shooter ready to play!');
        console.log('🔧 Debug: All systems operational');
        
        return game;
        
    } catch (error) {
        console.error('❌ Failed to start game:', error);
        alert('Error starting the game!\n\n' + error.message);
        return null;
    }
};
