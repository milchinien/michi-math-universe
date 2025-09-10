/**
 * Akademie System - Training and Quiz Management
 * Manages the new Akademie menu with single-topic selection and Training/Quiz modes
 */

class AkademieSystem {
    constructor() {
        this.selectedTopic = null;
        this.currentMode = null; // 'training' or 'quiz'
        this.availableTopics = {
            'binomial-formulas': {
                name: '🏛️ Binomische Formeln-Bestien',
                description: 'Die drei legendären Formeln: (a+b)², (a-b)², (a+b)(a-b)',
                enabled: true,
                tutorId: 'binomius'
            },
            'quadratic-equations': {
                name: '⚔️ Quadratische Gleichungs-Dämonen',
                description: 'Mitternachtsformel & p-q-Formel Krieger',
                enabled: true,
                tutorId: 'algebrar'
            },
            'quadratic-functions': {
                name: '🌙 Parabel-Phantome',
                description: 'Scheitelpunkt, Nullstellen & Normalform-Monster',
                enabled: false,
                tutorId: 'parabolus'
            },
            'function-transformations': {
                name: '🔄 Funktions-Transformations-Titanen',
                description: 'Verschiebung, Streckung & Spiegelung der Parabeln',
                enabled: false,
                tutorId: 'transformis'
            },
            'square-roots': {
                name: '√ Wurzel-Wächter',
                description: 'Quadratwurzeln ziehen & Wurzelgesetze anwenden',
                enabled: false,
                tutorId: 'radicus'
            },
            'power-laws': {
                name: '💥 Potenzgesetze-Piraten',
                description: 'Negative & rationale Exponenten meistern',
                enabled: false,
                tutorId: 'potentius'
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        console.log('Akademie System initialized');
    }
    
    setupEventListeners() {
        // Setup listeners immediately if DOM is ready, otherwise wait
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachTopicListeners();
            });
        } else {
            this.attachTopicListeners();
        }
    }
    
    attachTopicListeners() {
        const topicItems = document.querySelectorAll('.akademie-topic-item:not(.disabled)');
        // Reduced logging to prevent spam
        if (topicItems.length === 0) {
            console.warn('No topic items found');
        }
        
        topicItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const topic = item.getAttribute('data-topic');
                console.log('Topic clicked:', topic);
                this.selectTopic(topic);
            });
            
            // Add visual feedback
            item.style.cursor = 'pointer';
        });
        
        // Also add click listeners when Akademie menu is shown
        setTimeout(() => {
            this.attachTopicListeners();
        }, 100);
    }
    
    selectTopic(topicId) {
        if (!this.availableTopics[topicId] || !this.availableTopics[topicId].enabled) {
            return;
        }
        
        this.selectedTopic = topicId;
        this.showLearningModeModal();
        
        console.log('Selected topic:', topicId);
    }
    
    showLearningModeModal() {
        if (!this.selectedTopic) return;
        
        const topic = this.availableTopics[this.selectedTopic];
        const modal = document.getElementById('learningModeModal');
        const topicNameElement = document.getElementById('modalTopicName');
        
        if (topicNameElement && topic) {
            topicNameElement.textContent = topic.name;
        }
        
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    closeLearningModeModal() {
        const modal = document.getElementById('learningModeModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.selectedTopic = null;
    }
    
    updateSelectedTopicDisplay() {
        const selectedTopicElement = document.getElementById('akademieSelectedTopic');
        if (!selectedTopicElement) {
            console.warn('akademieSelectedTopic element not found');
            return;
        }
        
        const selectedNameElement = selectedTopicElement.querySelector('.akademie-selected-name');
        if (!selectedNameElement) {
            console.warn('akademie-selected-name element not found');
            return;
        }
        
        if (this.selectedTopic && this.availableTopics[this.selectedTopic]) {
            const topic = this.availableTopics[this.selectedTopic];
            selectedNameElement.textContent = topic.name;
            selectedTopicElement.style.display = 'block';
        } else {
            selectedTopicElement.style.display = 'none';
        }
    }
    
    enableProceedButton() {
        const proceedBtn = document.getElementById('akademieProceedBtn');
        if (this.selectedTopic) {
            proceedBtn.disabled = false;
            proceedBtn.classList.remove('disabled');
        } else {
            proceedBtn.disabled = true;
            proceedBtn.classList.add('disabled');
        }
    }
    
    showAkademieMenu() {
        // Hide all other menus
        this.hideAllMenus();
        
        // Show Akademie menu
        const akademieMenu = document.getElementById('akademieMenu');
        if (akademieMenu) {
            akademieMenu.style.display = 'flex';
        }
        
        // Re-attach event listeners after menu is shown
        setTimeout(() => {
            this.attachTopicListeners();
        }, 50);
        
        console.log('Showing Akademie menu');
    }
    
    showLearningModeMenu() {
        if (!this.selectedTopic) {
            console.warn('No topic selected');
            return;
        }
        
        // Hide Akademie menu
        document.getElementById('akademieMenu').style.display = 'none';
        
        // Show Learning Mode menu
        const learningModeMenu = document.getElementById('learningModeMenu');
        if (learningModeMenu) {
            learningModeMenu.style.display = 'flex';
        }
        
        console.log('Showing Learning Mode menu for topic:', this.selectedTopic);
    }
    
    startTrainingMode() {
        if (!this.selectedTopic) {
            console.warn('No topic selected for training');
            return;
        }
        
        this.currentMode = 'training';
        
        // Get the appropriate tutor for this topic
        const topic = this.availableTopics[this.selectedTopic];
        const tutorId = topic.tutorId;
        
        // Hide modal and akademie menu
        this.closeLearningModeModal();
        document.getElementById('akademieMenu').style.display = 'none';
        
        // Start tutorial system with the appropriate tutor
        console.log('Attempting to start tutorial system...');
        console.log('Tutorial system available:', !!window.tutorialSystem);
        
        if (window.tutorialSystem) {
            // Set the selected topic in math topics system for compatibility
            if (window.mathTopicsSystem) {
                window.mathTopicsSystem.clearAllSelections();
                window.mathTopicsSystem.selectTopic(this.selectedTopic);
            }
            
            // Create tutorial UI if it doesn't exist
            if (!document.getElementById('tutorialOverlay')) {
                window.tutorialSystem.createTutorialUI();
            }
            
            // Start tutorial for the selected topic
            const success = window.tutorialSystem.startTutorialForTopic(this.selectedTopic);
            if (!success) {
                console.error('Failed to start tutorial for topic:', this.selectedTopic);
                // Fallback to binomial formulas if topic not found
                window.tutorialSystem.startTutorialForTopic('binomial-formulas');
            }
        } else {
            console.error('Tutorial system not available');
            alert('Tutorial-System ist nicht verfügbar. Bitte lade die Seite neu.');
        }
        
        console.log(`Starting training mode for ${this.selectedTopic} with tutor ${tutorId}`);
    }
    
    startQuizMode() {
        if (!this.selectedTopic) {
            console.warn('No topic selected for quiz');
            return;
        }
        
        this.currentMode = 'quiz';
        
        // TODO: Implement quiz mode - currently just a placeholder
        alert('Quiz-Modus ist noch in Entwicklung! 📝\n\nBald verfügbar:\n• Zeitbasierte Aufgaben\n• Detaillierte Auswertung\n• Fortschrittsverfolgung');
        
        console.log(`Quiz mode for ${this.selectedTopic} - Coming soon!`);
    }
    
    backToMainMenuFromAkademie() {
        this.hideAllMenus();
        this.showMainMenu();
        this.resetSelection();
    }
    
    backToAkademieFromLearningMode() {
        document.getElementById('learningModeMenu').style.display = 'none';
        document.getElementById('akademieMenu').style.display = 'flex';
    }
    
    resetSelection() {
        this.selectedTopic = null;
        this.currentMode = null;
        
        // Clear visual selection
        document.querySelectorAll('.akademie-topic-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        this.updateSelectedTopicDisplay();
        this.enableProceedButton();
    }
    
    hideAllMenus() {
        const menus = [
            'mainMenu', 'mathTopicsMenu', 'difficultySelectionMenu', 
            'gameModeMenu', 'akademieMenu', 'learningModeMenu',
            'settingsMenu', 'upgradesMenu', 'instructionsMenu'
        ];
        
        menus.forEach(menuId => {
            const menu = document.getElementById(menuId);
            if (menu) {
                menu.style.display = 'none';
            }
        });
        
        // Hide canvas and game UI
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
    }
    
    showMainMenu() {
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
        }
    }
    
    // Integration with existing tutorial system
    getTutorForTopic(topicId) {
        if (this.availableTopics[topicId]) {
            return this.availableTopics[topicId].tutorId;
        }
        return 'binomius'; // Default tutor
    }
    
    // Get current selection info
    getCurrentSelection() {
        return {
            topic: this.selectedTopic,
            mode: this.currentMode,
            tutor: this.selectedTopic ? this.getTutorForTopic(this.selectedTopic) : null
        };
    }
}

// Global functions for HTML onclick handlers
function showAkademieMenu() {
    if (window.akademieSystem) {
        window.akademieSystem.showAkademieMenu();
    }
}

function startTrainingMode() {
    if (window.akademieSystem) {
        window.akademieSystem.startTrainingMode();
    }
}

function startQuizMode() {
    if (window.akademieSystem) {
        window.akademieSystem.startQuizMode();
    }
}

function closeLearningModeModal() {
    if (window.akademieSystem) {
        window.akademieSystem.closeLearningModeModal();
    }
}

function backToMainMenuFromAkademie() {
    if (window.akademieSystem) {
        window.akademieSystem.backToMainMenuFromAkademie();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.akademieSystem = new AkademieSystem();
});
