/**
 * FORMEL-FURY-SHOOTER - MAIN INITIALIZATION
 * Entry point and game initialization
 * Phase 4.2: Modulare Struktur
 */

// Initialize game when page loads
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
        if (typeof Player === 'undefined') {
            throw new Error('Player class not loaded');
        }
        if (typeof InputHandler === 'undefined') {
            throw new Error('InputHandler class not loaded');
        }
        if (typeof GameEngine === 'undefined') {
            throw new Error('GameEngine class not loaded');
        }
        
        console.log('✅ All modules loaded successfully');
        
        // Initialize the game engine
        const game = new GameEngine();
        console.log('✅ Game engine started successfully!');
        
        // Make game accessible globally for debugging and menu functions
        window.game = game;
        
        console.log('🚀 Formel-Fury-Shooter ready to play!');
        console.log('🔧 Debug: All systems operational');
        
    } catch (error) {
        console.error('❌ Failed to initialize game:', error);
        alert('Fehler beim Laden des Spiels!\n\n' + error.message + '\n\nBitte überprüfe, ob alle Dateien korrekt geladen wurden.');
    }
});
