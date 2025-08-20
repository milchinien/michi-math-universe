/**
 * FORMEL-FURY-SHOOTER - MENU SYSTEM
 * Handles all menu interactions and global game functions
 * Phase 4.2: Modulare Struktur
 */

// Global menu functions
function startGame() {
    if (window.game) {
        window.game.startGame();
    }
}

function showGameModeSelection() {
    if (window.game) {
        window.game.showGameModeSelection();
    }
}

function startGameWithMode(mode) {
    if (window.game) {
        window.game.startGameWithMode(mode);
    }
}

function backToMainMenu() {
    if (window.game) {
        window.game.hideGameModeSelection();
        window.game.showMainMenu();
    }
}

function selectMultipleChoice(index) {
    if (window.game && typeof window.game.selectMultipleChoice === 'function') {
        window.game.selectMultipleChoice(index);
    }
}

function showInstructions() {
    document.getElementById('instructionsMenu').style.display = 'flex';
}

function closeInstructions() {
    document.getElementById('instructionsMenu').style.display = 'none';
}

function showSettings() {
    document.getElementById('settingsMenu').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settingsMenu').style.display = 'none';
}

function showHighScores() {
    // For now, just show an alert with current high score
    const highScore = localStorage.getItem('formelFuryHighScore') || 0;
    alert(`🏆 Aktuelle Bestenliste:\n\nHöchste Punktzahl: ${highScore}\n\n(Erweiterte Bestenliste kommt in einem späteren Update!)`);
}

function resetProgress() {
    if (confirm('Möchtest du wirklich deinen gesamten Fortschritt zurücksetzen?\n\nDies löscht:\n- Höchste Punktzahl\n- Beste Combo\n- Anzahl richtiger Antworten\n- Gespielten Spiele\n\nDiese Aktion kann nicht rückgängig gemacht werden!')) {
        localStorage.removeItem('formelFuryHighScore');
        localStorage.removeItem('formelFuryBestCombo');
        localStorage.removeItem('formelFuryTotalCorrect');
        localStorage.removeItem('formelFuryGamesPlayed');
        
        if (window.game) {
            window.game.initializeMenuStats();
        }
        
        alert('✅ Fortschritt wurde zurückgesetzt!');
    }
}

function resetCurrency() {
    if (confirm('Möchtest du wirklich alle deine Algebra-Coins zurücksetzen?\n\nDies löscht:\n- Alle gesammelten Coins\n- Gesamt-Coins-Statistik\n\nDiese Aktion kann nicht rückgängig gemacht werden!')) {
        if (window.game && window.game.currencySystem) {
            window.game.currencySystem.resetCoins();
            alert('💰 Alle Algebra-Coins wurden zurückgesetzt!');
        } else {
            localStorage.removeItem('formelFuryCoins');
            alert('💰 Währungsdaten wurden zurückgesetzt!');
        }
    }
}

// Global debug function for currency system
function debugCurrency() {
    console.log('🔍 Currency System Debug:');
    
    if (!window.game) {
        console.error('❌ Game object not found');
        return;
    }
    
    if (!window.game.currencySystem) {
        console.error('❌ CurrencySystem not found in game object');
        return;
    }
    
    const cs = window.game.currencySystem;
    console.log('💰 Current coins:', cs.coins);
    console.log('📊 Total coins earned:', cs.totalCoinsEarned);
    console.log('🎮 Session coins earned:', cs.sessionCoinsEarned);
    console.log('🖥️ UI Display element:', cs.currencyDisplay);
    console.log('🔢 Coin value element:', cs.coinValueElement);
    
    // Test the system
    return cs.testCurrencySystem();
}

// Test function to simulate enemy defeat and coin reward
function testCoinReward() {
    if (!window.game || !window.game.currencySystem) {
        console.error('❌ Game or CurrencySystem not available');
        return;
    }
    
    console.log('🧪 Testing coin reward simulation...');
    
    // Create a mock enemy object
    const mockEnemy = {
        type: 'basic',
        x: 400,
        y: 300,
        typeName: 'Test-Gegner',
        assignedFormula: {
            difficulty: 1.5
        }
    };
    
    const cs = window.game.currencySystem;
    const oldCoins = cs.coins;
    
    // Test coin calculation
    const coinsEarned = cs.calculateCoins(mockEnemy, 0, 3000);
    console.log('💰 Coins would be earned:', coinsEarned);
    
    // Add the coins
    cs.addCoins(coinsEarned);
    console.log(`💰 Added ${coinsEarned} coins. Old: ${oldCoins}, New: ${cs.coins}`);
    
    // Test coin drop animation
    cs.showCoinDrop(mockEnemy.x, mockEnemy.y, coinsEarned);
    
    return coinsEarned;
}

// Debug functions for wave system
function debugWaves() {
    console.log('🌊 Wave System Debug:');
    
    if (!window.game) {
        console.error('❌ Game object not found');
        return;
    }
    
    if (!window.game.waveSystem) {
        console.error('❌ WaveSystem not found in game object');
        return;
    }
    
    const ws = window.game.waveSystem;
    console.log('🌊 Current wave:', ws.getCurrentWave());
    console.log('⏱️ Time left:', ws.getTimeLeft());
    console.log('🚀 Is active:', ws.isActive());
    console.log('💪 Wave bonus:', ws.getWaveBonus());
    console.log('📊 Wave data:', ws.getWaveData());
    
    return ws.getWaveData();
}

function forceCompleteWave() {
    if (window.game && window.game.waveSystem) {
        window.game.waveSystem.forceCompleteWave();
        console.log('🌊 Wave force completed!');
    } else {
        console.error('❌ WaveSystem not available');
    }
}

function startNextWave() {
    if (window.game && window.game.waveSystem) {
        const waveData = window.game.waveSystem.startWave();
        console.log('🌊 Next wave started:', waveData);
        return waveData;
    } else {
        console.error('❌ WaveSystem not available');
    }
}