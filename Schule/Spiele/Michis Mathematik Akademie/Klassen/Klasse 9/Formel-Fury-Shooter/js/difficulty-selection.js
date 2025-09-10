// Difficulty Selection System
class DifficultySelectionSystem {
    constructor() {
        this.selectedDifficulty = 'easy';
        this.difficulties = {
            easy: {
                name: 'Formel-Krieger',
                icon: '⚔️',
                description: 'Entspannter Kampf für Einsteiger',
                multipliers: {
                    enemyCount: 0.8,
                    enemySpeed: 0.9,
                    timeLimit: 1.5,
                    damage: 0.8,
                    rewards: 1.0
                }
            },
            medium: {
                name: 'Gleichungs-Veteran',
                icon: '🔥',
                description: 'Ausgewogene Herausforderung',
                multipliers: {
                    enemyCount: 1.0,
                    enemySpeed: 1.0,
                    timeLimit: 1.0,
                    damage: 1.0,
                    rewards: 1.2
                }
            },
            hard: {
                name: 'Mathe-Dämon',
                icon: '💀',
                description: 'Brutaler Kampf für Experten',
                multipliers: {
                    enemyCount: 1.3,
                    enemySpeed: 1.2,
                    timeLimit: 0.8,
                    damage: 1.5,
                    rewards: 1.5
                }
            },
            nightmare: {
                name: 'Formel-Alptraum',
                icon: '👹',
                description: 'Nur für wahre Mathe-Götter',
                multipliers: {
                    enemyCount: 1.8,
                    enemySpeed: 1.5,
                    timeLimit: 0.6,
                    damage: 2.0,
                    rewards: 2.0
                }
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSavedDifficulty();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // Add click listeners to difficulty cards
        document.querySelectorAll('.difficulty-selection-card').forEach(card => {
            card.addEventListener('click', () => {
                const difficulty = card.dataset.difficulty;
                this.selectDifficulty(difficulty);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('difficultySelectionMenu').style.display !== 'none') {
                this.handleKeyPress(e);
            }
        });
    }
    
    handleKeyPress(e) {
        const difficultyKeys = ['1', '2', '3', '4', '5'];
        const difficulties = ['tutorial', 'easy', 'medium', 'hard', 'nightmare'];
        
        if (difficultyKeys.includes(e.key)) {
            const index = parseInt(e.key) - 1;
            if (index < difficulties.length) {
                this.selectDifficulty(difficulties[index]);
            }
        }
        
        if (e.key === 'Enter') {
            proceedToGameModeSelection();
        }
        
        if (e.key === 'Escape') {
            backToMathTopicsFromDifficulty();
        }
    }
    
    selectDifficulty(difficulty) {
        if (!this.difficulties[difficulty]) return;
        
        // Remove previous selection
        document.querySelectorAll('.difficulty-selection-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to new card
        const selectedCard = document.querySelector(`[data-difficulty="${difficulty}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.selectedDifficulty = difficulty;
        this.updateDisplay();
        this.saveDifficulty();
        
        // Play selection sound
        if (window.audioManager) {
            window.audioManager.playSound('ui-select', 'feedback');
        }
    }
    
    updateDisplay() {
        const difficultyData = this.difficulties[this.selectedDifficulty];
        if (!difficultyData) return;
        
        // Update selected difficulty display
        const iconElement = document.querySelector('.selected-difficulty-icon');
        const nameElement = document.querySelector('.selected-difficulty-name');
        const descElement = document.querySelector('.selected-difficulty-desc');
        
        if (iconElement) iconElement.textContent = difficultyData.icon;
        if (nameElement) nameElement.textContent = difficultyData.name;
        if (descElement) descElement.textContent = difficultyData.description;
    }
    
    getDifficultyMultipliers() {
        return this.difficulties[this.selectedDifficulty]?.multipliers || this.difficulties.easy.multipliers;
    }
    
    getCurrentDifficulty() {
        return this.selectedDifficulty;
    }
    
    getCurrentDifficultyData() {
        return this.difficulties[this.selectedDifficulty] || this.difficulties.easy;
    }
    
    saveDifficulty() {
        try {
            localStorage.setItem('formelFuryDifficulty', this.selectedDifficulty);
        } catch (e) {
            console.warn('Could not save difficulty to localStorage:', e);
        }
    }
    
    loadSavedDifficulty() {
        try {
            const saved = localStorage.getItem('formelFuryDifficulty');
            if (saved && this.difficulties[saved]) {
                this.selectedDifficulty = saved;
                
                // Update UI to reflect loaded difficulty
                setTimeout(() => {
                    this.selectDifficulty(saved);
                }, 100);
            }
        } catch (e) {
            console.warn('Could not load difficulty from localStorage:', e);
        }
    }
    
    resetToDefault() {
        this.selectDifficulty('easy');
    }
}

// Navigation Functions
function proceedToDifficultySelection() {
    // Validate that at least one math topic is selected
    const mathTopicsSystem = window.mathTopicsSystem;
    if (mathTopicsSystem && mathTopicsSystem.getSelectedTopics().length === 0) {
        alert('Bitte wähle mindestens einen Gegnertyp aus!');
        return;
    }
    
    // Hide math topics menu
    document.getElementById('mathTopicsMenu').style.display = 'none';
    
    // Show difficulty selection menu
    const difficultyMenu = document.getElementById('difficultySelectionMenu');
    difficultyMenu.style.display = 'block';
    difficultyMenu.classList.add('active');
    
    // Play transition sound
    if (window.audioManager) {
        window.audioManager.playSound('menu-transition', 'feedback');
    }
}

function backToMathTopicsFromDifficulty() {
    // Hide difficulty selection menu
    const difficultyMenu = document.getElementById('difficultySelectionMenu');
    difficultyMenu.style.display = 'none';
    difficultyMenu.classList.remove('active');
    
    // Show math topics menu
    document.getElementById('mathTopicsMenu').style.display = 'block';
    
    // Play back sound
    if (window.audioManager) {
        window.audioManager.playSound('menu-back', 'feedback');
    }
}

function proceedToGameModeSelection() {
    // Check if tutorial mode is selected
    if (window.difficultySelectionSystem && 
        window.difficultySelectionSystem.getCurrentDifficulty() === 'tutorial') {
        
        // Start tutorial instead of going to game mode selection
        startTutorialMode();
        return;
    }
    
    // Hide difficulty selection menu
    const difficultyMenu = document.getElementById('difficultySelectionMenu');
    difficultyMenu.style.display = 'none';
    difficultyMenu.classList.remove('active');
    
    // Show game mode menu
    document.getElementById('gameModeMenu').style.display = 'block';
    
    // Play transition sound
    if (window.audioManager) {
        window.audioManager.playSound('menu-transition', 'feedback');
    }
}

function startTutorialMode() {
    // Get selected math topics
    const selectedTopics = window.mathTopicsSystem ? 
        window.mathTopicsSystem.getSelectedTopics() : ['binomial-formulas'];
    
    // Hide difficulty selection menu
    const difficultyMenu = document.getElementById('difficultySelectionMenu');
    difficultyMenu.style.display = 'none';
    difficultyMenu.classList.remove('active');
    
    // Start tutorial for the first selected topic
    const firstTopic = selectedTopics[0] || 'binomial-formulas';
    
    if (window.tutorialSystem) {
        window.tutorialSystem.startTutorial(firstTopic);
    } else {
        console.error('Tutorial system not available');
        // Fallback to game mode selection
        document.getElementById('gameModeMenu').style.display = 'block';
    }
}

// Update the back function from game mode menu
function backToMathTopicsMenu() {
    // Hide game mode menu
    document.getElementById('gameModeMenu').style.display = 'none';
    
    // Show difficulty selection menu (new flow)
    const difficultyMenu = document.getElementById('difficultySelectionMenu');
    difficultyMenu.style.display = 'block';
    difficultyMenu.classList.add('active');
    
    // Play back sound
    if (window.audioManager) {
        window.audioManager.playSound('menu-back', 'feedback');
    }
}

// Initialize the difficulty selection system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.difficultySelectionSystem = new DifficultySelectionSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DifficultySelectionSystem };
}
