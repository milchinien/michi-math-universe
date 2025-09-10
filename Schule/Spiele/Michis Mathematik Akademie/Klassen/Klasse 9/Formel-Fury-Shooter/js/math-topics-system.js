/**
 * Math Topics Selection System
 * Handles the selection of mathematical topics/formulas for enemy generation
 */

class MathTopicsSystem {
    constructor() {
        this.selectedTopics = new Set(['binomial-formulas']); // Default selection
        this.selectedDifficulty = 'easy'; // Default difficulty
        
        // Tutor mapping for each topic
        this.topicTutorMapping = {
            'binomial-formulas': 'binomial-formulas',
            'quadratic-equations': 'quadratic-equations',
            'quadratic-functions': 'quadratic-functions', 
            'function-transformations': 'function-transformations',
            'root-calculations': 'root-calculations',
            'power-laws': 'power-laws'
        };
        
        // Difficulty definitions for backward compatibility
        this.difficultyDefinitions = {
            'easy': {
                name: 'Einfach',
                enemyMultiplier: 0.8,
                timeMultiplier: 1.3,
                complexityLevel: 1,
                showExplanations: false
            },
            'medium': {
                name: 'Mittel',
                enemyMultiplier: 1.0,
                timeMultiplier: 1.0,
                complexityLevel: 2,
                showExplanations: false
            },
            'hard': {
                name: 'Schwer',
                enemyMultiplier: 1.3,
                timeMultiplier: 0.8,
                complexityLevel: 3,
                showExplanations: false
            }
        };
        
        this.topicDefinitions = {
            'binomial-formulas': {
                name: 'Binomische Formeln-Bestien',
                difficulty: 1,
                category: 'algebra',
                enabled: true
            },
            'quadratic-equations': {
                name: 'Quadratische Gleichungs-Dämonen',
                difficulty: 2,
                category: 'algebra',
                enabled: true
            },
            'quadratic-functions': {
                name: 'Parabel-Phantome',
                difficulty: 2,
                category: 'functions',
                enabled: true
            },
            'function-transformations': {
                name: 'Funktions-Transformations-Titanen',
                difficulty: 2,
                category: 'functions',
                enabled: true
            },
            'square-roots': {
                name: 'Wurzel-Wächter',
                difficulty: 2,
                category: 'radicals',
                enabled: false
            },
            'power-laws': {
                name: 'Potenzgesetze-Piraten',
                difficulty: 2,
                category: 'radicals',
                enabled: false
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupTopicEventListeners();
        this.loadSettings();
    }
    
    // Get the appropriate tutor for currently selected topics
    getRecommendedTutor() {
        const selectedArray = Array.from(this.selectedTopics);
        
        // Priority order for tutor selection
        const tutorPriority = [
            'quadratic-equations',
            'quadratic-functions', 
            'function-transformations',
            'root-calculations',
            'power-laws',
            'binomial-formulas'
        ];
        
        // Find the highest priority selected topic
        for (const topic of tutorPriority) {
            if (selectedArray.includes(topic)) {
                return this.topicTutorMapping[topic];
            }
        }
        
        return 'binomial-formulas'; // Default fallback
    }
    
    // Start tutorial for a specific topic
    startTutorialForTopic(topicKey) {
        if (window.tutorialSystem) {
            return window.tutorialSystem.startTutorialForTopic(topicKey);
        }
        console.warn('Tutorial system not available');
        return false;
    }
    
    // Start tutorial for currently selected topics
    startRecommendedTutorial() {
        const recommendedTutor = this.getRecommendedTutor();
        return this.startTutorialForTopic(recommendedTutor);
    }
    
    setupTopicEventListeners() {
        // Add event listeners for all checkboxes
        const checkboxes = document.querySelectorAll('.topic-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleTopicToggle(e.target.id, e.target.checked);
            });
        });
        
        // Disable mouse wheel scrolling
        const mathMenu = document.getElementById('mathTopicsMenu');
        if (mathMenu) {
            mathMenu.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();
            }, { passive: false });
        }
    }
    
    // Difficulty handling removed - now handled by separate difficulty selection system
    
    setupEasterEggs() {
        // Konami Code Easter Egg (↑↑↓↓←→←→BA)
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('mathTopicsMenu').style.display === 'block') {
                konamiCode.push(e.code);
                if (konamiCode.length > konamiSequence.length) {
                    konamiCode.shift();
                }
                
                if (konamiCode.length === konamiSequence.length && 
                    konamiCode.every((code, index) => code === konamiSequence[index])) {
                    this.triggerKonamiEasterEgg();
                    konamiCode = [];
                }
            }
        });
        
        // Secret click sequence on title
        let titleClicks = 0;
        const title = document.getElementById('mathTopicsTitle');
        if (title) {
            title.addEventListener('click', () => {
                titleClicks++;
                if (titleClicks === 7) {
                    this.triggerSecretMode();
                    titleClicks = 0;
                }
                // Reset after 3 seconds
                setTimeout(() => { titleClicks = 0; }, 3000);
            });
        }
        
        // Hidden developer console message
        console.log(`
        🎮 FORMEL-FURY-SHOOTER - DEVELOPER EASTER EGGS 🎮
        
        🔥 Konami Code: ↑↑↓↓←→←→BA (aktiviert Cheat-Modus)
        🏛️ 7x Titel klicken: Aktiviert Geheimen Entwickler-Modus
        👾 Typ 'mathgod' in Konsole: Schaltet alle Gegner frei
        🧮 Typ 'fibonacci' in Konsole: Zeigt versteckte Fibonacci-Sequenz
        
        Viel Spaß beim Entdecken! 🚀
        `);
        
        // Console commands
        window.mathgod = () => {
            console.log('🔓 ALLE GEGNER FREIGESCHALTET! (Nur visuell - noch nicht implementiert)');
            this.showAllEnemiesUnlocked();
        };
        
        window.fibonacci = () => {
            console.log('🌟 FIBONACCI SEQUENZ AKTIVIERT!');
            this.showFibonacciSequence();
        };
    }
    
    triggerKonamiEasterEgg() {
        // Create epic visual effect
        const mathMenu = document.getElementById('mathTopicsMenu');
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ffff00);
            background-size: 400% 400%;
            animation: konamiRainbow 2s ease-in-out;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4em;
            color: white;
            text-shadow: 0 0 20px rgba(0,0,0,0.8);
            pointer-events: none;
        `;
        overlay.innerHTML = '🎮 KONAMI CODE AKTIVIERT! 🎮<br><span style="font-size:0.5em;">Cheat-Modus freigeschaltet!</span>';
        
        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes konamiRainbow {
                0% { background-position: 0% 50%; opacity: 0; }
                50% { background-position: 100% 50%; opacity: 1; }
                100% { background-position: 0% 50%; opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        mathMenu.appendChild(overlay);
        
        // Play epic sound effect (if audio system available)
        if (window.gameEngine && window.gameEngine.audioManager) {
            window.gameEngine.audioManager.playSound('achievement', 'feedback');
        }
        
        setTimeout(() => {
            overlay.remove();
            style.remove();
        }, 3000);
    }
    
    triggerSecretMode() {
        const title = document.getElementById('mathTopicsTitle');
        const originalText = title.innerHTML;
        
        // Transform title
        title.innerHTML = '🔥 ENTWICKLER-MODUS AKTIVIERT 🔥';
        title.style.animation = 'none';
        title.style.background = 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)';
        title.style.backgroundSize = '400% 400%';
        title.style.animation = 'gradientShift 0.5s ease-in-out infinite';
        
        // Show secret message
        const secretMsg = document.createElement('div');
        secretMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: #00ff00;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            z-index: 10000;
            text-align: center;
            border: 2px solid #00ff00;
            box-shadow: 0 0 20px rgba(0,255,0,0.5);
        `;
        secretMsg.innerHTML = `
            <div style="font-size: 1.5em; margin-bottom: 10px;">🚀 GEHEIMER ENTWICKLER-MODUS</div>
            <div>Alle versteckten Features freigeschaltet!</div>
            <div style="margin-top: 10px; font-size: 0.8em; color: #ffff00;">
                • Unendliche Gesundheit<br>
                • Alle Formeln verfügbar<br>
                • Debug-Informationen aktiviert
            </div>
            <div style="margin-top: 15px; color: #ff6b6b;">
                (Nur visuell - Features noch nicht implementiert)
            </div>
        `;
        
        document.body.appendChild(secretMsg);
        
        setTimeout(() => {
            secretMsg.remove();
            title.innerHTML = originalText;
            title.style.animation = 'gradientShift 3s ease-in-out infinite';
        }, 5000);
    }
    
    showAllEnemiesUnlocked() {
        // Visual effect showing all enemies unlocked
        const disabledItems = document.querySelectorAll('.topic-item.disabled');
        disabledItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'pulse 0.5s ease-in-out';
                item.style.borderColor = '#00ff00';
                item.style.boxShadow = '0 0 15px rgba(0,255,0,0.5)';
                
                const comingSoon = item.querySelector('.coming-soon');
                if (comingSoon) {
                    comingSoon.textContent = 'FREIGESCHALTET!';
                    comingSoon.style.background = 'rgba(0,255,0,0.2)';
                    comingSoon.style.borderColor = 'rgba(0,255,0,0.5)';
                    comingSoon.style.color = '#00ff00';
                }
            }, index * 200);
        });
        
        // Reset after 3 seconds
        setTimeout(() => {
            disabledItems.forEach(item => {
                item.style.animation = '';
                item.style.borderColor = '';
                item.style.boxShadow = '';
                
                const comingSoon = item.querySelector('.coming-soon');
                if (comingSoon) {
                    comingSoon.textContent = 'Bald verfügbar';
                    comingSoon.style.background = 'rgba(255, 107, 107, 0.1)';
                    comingSoon.style.borderColor = 'rgba(255, 107, 107, 0.3)';
                    comingSoon.style.color = '#ff6b6b';
                }
            });
        }, 3000);
    }
    
    showFibonacciSequence() {
        // Create floating Fibonacci numbers
        const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
        const mathMenu = document.getElementById('mathTopicsMenu');
        
        fibonacci.forEach((num, index) => {
            setTimeout(() => {
                const fibElement = document.createElement('div');
                fibElement.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 80 + 10}%;
                    top: 100%;
                    font-size: 2em;
                    color: #feca57;
                    font-weight: bold;
                    z-index: 1000;
                    pointer-events: none;
                    text-shadow: 0 0 10px rgba(254,202,87,0.8);
                    animation: fibonacciFloat 4s ease-out forwards;
                `;
                fibElement.textContent = num;
                
                // Add floating animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fibonacciFloat {
                        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                    }
                `;
                if (!document.querySelector('#fibonacci-style')) {
                    style.id = 'fibonacci-style';
                    document.head.appendChild(style);
                }
                
                mathMenu.appendChild(fibElement);
                
                setTimeout(() => {
                    fibElement.remove();
                }, 4000);
            }, index * 300);
        });
    }
    
    handleTopicToggle(topicId, isChecked) {
        if (!this.topicDefinitions[topicId] || !this.topicDefinitions[topicId].enabled) {
            return; // Ignore disabled topics
        }
        
        if (isChecked) {
            this.selectedTopics.add(topicId);
        } else {
            this.selectedTopics.delete(topicId);
        }
        
        // Ensure at least one topic is always selected
        if (this.selectedTopics.size === 0) {
            this.selectedTopics.add('binomial-formulas');
            document.getElementById('binomial-formulas').checked = true;
        }
        
        this.updateUI();
        this.saveSelection();
    }
    
    updateUI() {
        // Update selected count
        const countElement = document.getElementById('selectedTopicsCount');
        if (countElement) {
            countElement.textContent = this.selectedTopics.size;
        }
        
        // Update difficulty indicator
        this.updateDifficultyIndicator();
        
        // Update proceed button state
        this.updateProceedButton();
    }
    
    updateDifficultyIndicator() {
        const difficultyElement = document.getElementById('difficultyIndicator');
        if (!difficultyElement) return;
        
        const avgDifficulty = this.getAverageDifficulty();
        
        // Remove all difficulty classes
        difficultyElement.classList.remove('difficulty-easy', 'difficulty-medium', 'difficulty-hard');
        
        if (avgDifficulty <= 1.5) {
            difficultyElement.classList.add('difficulty-easy');
            difficultyElement.textContent = 'Anfänger';
        } else if (avgDifficulty <= 2.5) {
            difficultyElement.classList.add('difficulty-medium');
            difficultyElement.textContent = 'Fortgeschritten';
        } else {
            difficultyElement.classList.add('difficulty-hard');
            difficultyElement.textContent = 'Experte';
        }
    }
    
    updateProceedButton() {
        const proceedBtn = document.getElementById('proceedBtn');
        if (!proceedBtn) return;
        
        const hasValidSelection = this.selectedTopics.size > 0;
        proceedBtn.disabled = !hasValidSelection;
        
        if (hasValidSelection) {
            proceedBtn.textContent = '⚔️ IN DEN KAMPF!';
        } else {
            proceedBtn.textContent = '⚠️ MINDESTENS EINEN GEGNER WÄHLEN';
        }
    }
    
    getAverageDifficulty() {
        if (this.selectedTopics.size === 0) return 1;
        
        let totalDifficulty = 0;
        for (const topicId of this.selectedTopics) {
            const topic = this.topicDefinitions[topicId];
            if (topic) {
                totalDifficulty += topic.difficulty;
            }
        }
        
        return totalDifficulty / this.selectedTopics.size;
    }
    
    getSelectedTopics() {
        return Array.from(this.selectedTopics);
    }
    
    getSelectedTopicNames() {
        return Array.from(this.selectedTopics).map(topicId => {
            const topic = this.topicDefinitions[topicId];
            return topic ? topic.name : topicId;
        });
    }
    
    saveSelection() {
        try {
            const selectionData = {
                topics: Array.from(this.selectedTopics),
                difficulty: this.selectedDifficulty
            };
            localStorage.setItem('mathTopicsSelection', JSON.stringify(selectionData));
        } catch (error) {
            console.warn('Could not save math topics selection:', error);
        }
    }
    
    loadSelection() {
        try {
            const saved = localStorage.getItem('mathTopicsSelection');
            if (saved) {
                const selectionData = JSON.parse(saved);
                
                // Handle both old format (array) and new format (object)
                if (Array.isArray(selectionData)) {
                    // Old format - just topics
                    this.selectedTopics = new Set(selectionData.filter(topicId => 
                        this.topicDefinitions[topicId] && this.topicDefinitions[topicId].enabled
                    ));
                    this.selectedDifficulty = 'easy'; // Default difficulty
                } else {
                    // New format - object with topics and difficulty
                    this.selectedTopics = new Set((selectionData.topics || []).filter(topicId => 
                        this.topicDefinitions[topicId] && this.topicDefinitions[topicId].enabled
                    ));
                    this.selectedDifficulty = selectionData.difficulty || 'easy';
                }
                
                // Ensure at least one topic is selected
                if (this.selectedTopics.size === 0) {
                    this.selectedTopics.add('binomial-formulas');
                }
                
                // Ensure valid difficulty
                if (!this.difficultyDefinitions[this.selectedDifficulty]) {
                    this.selectedDifficulty = 'easy';
                }
                
                // Update checkboxes to match loaded selection
                this.syncCheckboxes();
            }
        } catch (error) {
            console.warn('Could not load math topics selection:', error);
            this.selectedTopics = new Set(['binomial-formulas']);
            this.selectedDifficulty = 'easy';
        }
    }
    
    syncCheckboxes() {
        const checkboxes = document.querySelectorAll('.topic-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.selectedTopics.has(checkbox.id);
        });
    }
    
    // Method to be called by the formula system to get current selection
    getCurrentFormulaTypes() {
        const selectedTypes = [];
        
        for (const topicId of this.selectedTopics) {
            const topic = this.topicDefinitions[topicId];
            if (topic && topic.enabled) {
                selectedTypes.push({
                    id: topicId,
                    name: topic.name,
                    category: topic.category,
                    difficulty: topic.difficulty
                });
            }
        }
        
        return selectedTypes;
    }
    
    // Method to check if a specific topic is selected
    isTopicSelected(topicId) {
        return this.selectedTopics.has(topicId);
    }
    
    // Method to get difficulty multiplier based on selection
    getDifficultyMultiplier() {
        const avgDifficulty = this.getAverageDifficulty();
        return Math.max(0.8, Math.min(1.5, avgDifficulty / 2));
    }
    
    // Get selected difficulty settings
    getSelectedDifficulty() {
        return this.selectedDifficulty;
    }
    
    getDifficultySettings() {
        return this.difficultyDefinitions[this.selectedDifficulty] || this.difficultyDefinitions['easy'];
    }
    
    // Get enemy count multiplier based on difficulty
    getEnemyCountMultiplier() {
        const settings = this.getDifficultySettings();
        return settings.enemyMultiplier;
    }
    
    // Get time multiplier based on difficulty
    getTimeMultiplier() {
        const settings = this.getDifficultySettings();
        return settings.timeMultiplier;
    }
    
    // Get complexity level for formula generation
    getComplexityLevel() {
        const settings = this.getDifficultySettings();
        return settings.complexityLevel;
    }
    
    // Check if explanations should be shown (tutorial mode)
    shouldShowExplanations() {
        const settings = this.getDifficultySettings();
        return settings.showExplanations;
    }
}

// Global functions for menu navigation
function showMathTopicsMenu() {
    // Hide all other menus
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameModeMenu').style.display = 'none';
    document.getElementById('classSelectionMenu').style.display = 'none';
    
    // Show math topics menu
    document.getElementById('mathTopicsMenu').style.display = 'block';
    
    // Initialize or update the system
    if (!window.mathTopicsSystem) {
        window.mathTopicsSystem = new MathTopicsSystem();
    }
    
    // Load saved selection
    window.mathTopicsSystem.loadSelection();
    window.mathTopicsSystem.updateUI();
}

function proceedToGameModeSelection() {
    if (!window.mathTopicsSystem || window.mathTopicsSystem.selectedTopics.size === 0) {
        return; // Don't proceed if no topics selected
    }
    
    // Hide math topics menu
    document.getElementById('mathTopicsMenu').style.display = 'none';
    
    // Show game mode selection
    document.getElementById('gameModeMenu').style.display = 'block';
    
    // Save the selection
    window.mathTopicsSystem.saveSelection();
    
    console.log('Selected math topics:', window.mathTopicsSystem.getSelectedTopicNames());
}

function backToMainMenuFromMathTopics() {
    document.getElementById('mathTopicsMenu').style.display = 'none';
    document.getElementById('mainMenu').style.display = 'block';
}

function backToMathTopicsMenu() {
    document.getElementById('gameModeMenu').style.display = 'none';
    document.getElementById('mathTopicsMenu').style.display = 'block';
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathTopicsSystem;
}
