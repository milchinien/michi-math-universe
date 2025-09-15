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
                enabled: true,
                tutorId: 'parabolus'
            },
            'function-transformations': {
                name: '🔄 Funktions-Transformations-Titanen',
                description: 'Verschiebung, Streckung & Spiegelung der Parabeln',
                enabled: true,
                tutorId: 'transformis'
            },
            'square-roots': {
                name: '√ Wurzel-Wächter',
                description: 'Quadratwurzeln ziehen & Wurzelgesetze anwenden',
                enabled: true,
                tutorId: 'radicus'
            },
            'power-laws': {
                name: '💥 Potenzgesetze-Piraten',
                description: 'Negative & rationale Exponenten meistern',
                enabled: true,
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
        const topicItems = document.querySelectorAll('.akademie-topic-item');
        console.log(`🔗 Attaching listeners to ${topicItems.length} topic items`);
        
        if (topicItems.length === 0) {
            console.warn('❌ No topic items found for event listeners');
            return;
        }
        
        topicItems.forEach((item, index) => {
            const topic = item.getAttribute('data-topic');
            const isDisabled = item.classList.contains('disabled');
            
            console.log(`Topic ${index}: ${topic}, disabled: ${isDisabled}`);
            
            // Remove any existing listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            if (!isDisabled) {
                newItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🖱️ Akademie topic clicked: ${topic}`);
                    this.selectTopic(topic);
                });
                
                // Add visual feedback
                newItem.style.cursor = 'pointer';
                newItem.style.userSelect = 'none';
            } else {
                newItem.style.cursor = 'not-allowed';
            }
        });
        
        console.log('✅ Topic listeners attached successfully');
    }
    
    // DEBUGGING: Add direct test event listeners
    addTestEventListeners() {
        console.log('🧪 Adding test event listeners...');
        
        // Try multiple approaches to attach listeners
        const approaches = [
            () => document.querySelectorAll('[data-topic="quadratic-equations"]'),
            () => document.querySelectorAll('.akademie-topic-item[data-topic="quadratic-equations"]'),
            () => document.querySelectorAll('#akademieMenu .akademie-topic-item[data-topic="quadratic-equations"]')
        ];
        
        approaches.forEach((approach, index) => {
            const elements = approach();
            console.log(`Approach ${index + 1}: Found ${elements.length} elements`);
            
            elements.forEach((element, elemIndex) => {
                console.log(`  Element ${elemIndex}:`, element);
                
                // Add VERY direct listener
                element.addEventListener('click', (e) => {
                    console.log('🚨 DIRECT CLICK DETECTED on quadratic-equations!');
                    e.preventDefault();
                    e.stopPropagation();
                    this.selectedTopic = 'quadratic-equations';
                    console.log('✅ selectedTopic set to:', this.selectedTopic);
                    this.showLearningModeModal();
                });
                
                // Also try with mousedown
                element.addEventListener('mousedown', (e) => {
                    console.log('🚨 MOUSEDOWN DETECTED on quadratic-equations!');
                });
            });
        });
    }
    
    selectTopic(topicId) {
        console.log(`🎯 selectTopic called with: ${topicId}`);
        
        if (!this.availableTopics[topicId]) {
            console.error(`❌ Topic '${topicId}' not found in availableTopics`);
            console.log('Available topics:', Object.keys(this.availableTopics));
            return;
        }
        
        if (!this.availableTopics[topicId].enabled) {
            console.error(`❌ Topic '${topicId}' is not enabled`);
            return;
        }
        
        this.selectedTopic = topicId;
        console.log(`✅ Topic selected: ${this.selectedTopic}`);
        
        this.showLearningModeModal();
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
        // this.selectedTopic = null;
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
        
        console.log('🎭 Akademie menu shown, attaching listeners...');
        
        // Re-attach event listeners after menu is shown
        setTimeout(() => {
            this.attachTopicListeners();
            this.addTestEventListeners(); // DEBUGGING: Add direct test listeners
        }, 100);
        
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
        console.log(`🎯 startTrainingMode called, selectedTopic: ${this.selectedTopic}`);
        
        if (!this.selectedTopic) {
            console.error('❌ No topic selected for training');
            alert('Fehler: Kein Thema ausgewählt! Bitte wähle zuerst ein Thema aus.');
            return;
        }
        
        this.currentMode = 'training';
        
        // Get the appropriate tutor for this topic
        const topic = this.availableTopics[this.selectedTopic];
        if (!topic) {
            console.error(`❌ Topic data not found for: ${this.selectedTopic}`);
            return;
        }
        
        const tutorId = topic.tutorId;
        console.log(`📚 Topic: ${topic.name}, Tutor: ${tutorId}`);
        
        // Hide modal and akademie menu
        this.closeLearningModeModal();
        document.getElementById('akademieMenu').style.display = 'none';
        
        // Start tutorial system with the appropriate tutor
        console.log('Attempting to start tutorial system...');
        console.log('Tutorial system available:', !!window.tutorialSystem);
        
        if (window.tutorialSystem) {
            // Set the selected topic in math topics system for compatibility
            if (window.mathTopicsSystem) {
                // Clear existing selections by creating a new Set with only our topic
                window.mathTopicsSystem.selectedTopics = new Set([this.selectedTopic]);
                window.mathTopicsSystem.saveSelection();
                console.log('🔗 Synced topic with mathTopicsSystem:', this.selectedTopic);
            }
            
            console.log(`🎯 Akademie starting tutorial for topic: ${this.selectedTopic}`);
            console.log(`👨‍🏫 Expected tutor: ${tutorId}`);

            // Add a check for null before attempting to start the tutorial
            if (this.selectedTopic === null) {
                console.error('Cannot start tutorial: selectedTopic is null');
                alert('Fehler: Kein Thema ausgewählt.');
                return;
            }

            // Start tutorial for the selected topic (tutorial system will handle UI creation)
            const success = window.tutorialSystem.startTutorialForTopic(this.selectedTopic);
            if (!success) {
                console.error('Failed to start tutorial for topic:', this.selectedTopic);
                alert(`Fehler: Tutorial für '${this.selectedTopic}' konnte nicht gestartet werden.`);
                return;
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

// DEBUGGING: Global test function
window.testQuadraticSelection = function() {
    console.log('🧪 Testing quadratic selection...');
    if (window.akademieSystem) {
        window.akademieSystem.selectedTopic = 'quadratic-equations';
        console.log('✅ Manually set selectedTopic to:', window.akademieSystem.selectedTopic);
        window.akademieSystem.showLearningModeModal();
    } else {
        console.error('❌ akademieSystem not available');
    }
};

// DEBUGGING: Direct tutorial start
window.startQuadraticTutorial = function() {
    console.log('🧪 Direct tutorial start...');
    if (window.tutorialSystem) {
        window.tutorialSystem.startTutorialForTopic('quadratic-equations');
    } else {
        console.error('❌ tutorialSystem not available');
    }
};

// Global function for HTML onclick events
window.selectAkademieTopic = function(topicId) {
    console.log(`🎯 selectAkademieTopic called with: ${topicId}`);
    
    if (window.akademieSystem) {
        window.akademieSystem.selectTopic(topicId);
    } else {
        console.error('❌ akademieSystem not available');
    }
};
