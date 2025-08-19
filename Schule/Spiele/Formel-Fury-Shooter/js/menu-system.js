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
