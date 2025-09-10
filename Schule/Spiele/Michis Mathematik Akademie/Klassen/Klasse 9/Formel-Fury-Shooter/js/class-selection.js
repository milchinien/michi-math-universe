/**
 * Class Selection System
 * Handles the main menu for selecting grade levels before entering the game
 */

class ClassSelectionSystem {
    constructor() {
        this.selectedClass = null;
        this.availableClasses = [9]; // Only class 9 is available for now
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Class card selection
        const classCards = document.querySelectorAll('.class-card');
        classCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const classNumber = parseInt(card.dataset.class);
                this.selectClass(classNumber);
            });
        });

        // Start game button
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                this.startGame();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    selectClass(classNumber) {
        // Only allow selection of available classes
        if (!this.availableClasses.includes(classNumber)) {
            this.showNotAvailableMessage(classNumber);
            return;
        }

        // Remove previous selection
        const previousSelected = document.querySelector('.class-card.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        // Add selection to new card
        const selectedCard = document.querySelector(`[data-class="${classNumber}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            this.selectedClass = classNumber;
            
            // Enable start button
            const startGameBtn = document.getElementById('startGameBtn');
            if (startGameBtn) {
                startGameBtn.disabled = false;
                startGameBtn.textContent = `🎮 KLASSE ${classNumber} STARTEN`;
            }

            // Update footer text
            const footerText = document.querySelector('.footer-text');
            if (footerText) {
                footerText.textContent = `Klasse ${classNumber} ausgewählt - Bereit zum Spielen!`;
            }

            // Add selection animation
            selectedCard.style.animation = 'none';
            selectedCard.offsetHeight; // Trigger reflow
            selectedCard.style.animation = 'pulse 0.6s ease-in-out';
        }
    }

    showNotAvailableMessage(classNumber) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'not-available-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🔒</span>
                <span class="notification-text">Klasse ${classNumber} ist noch nicht verfügbar!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    startGame() {
        if (!this.selectedClass) {
            return;
        }

        // Store selected class in localStorage for game access
        localStorage.setItem('selectedClass', this.selectedClass.toString());
        
        // Hide class selection menu
        const classSelectionMenu = document.getElementById('classSelectionMenu');
        if (classSelectionMenu) {
            classSelectionMenu.style.animation = 'fadeOutUp 0.5s ease-in-out forwards';
            
            // Wait for animation to complete, then hide and initialize game
            setTimeout(() => {
                classSelectionMenu.style.display = 'none';
                classSelectionMenu.classList.remove('active');
                this.initializeGame();
            }, 500);
        }
    }

    initializeGame() {
        // This will be called after the transition to start the actual game
        // Use the new initialization function from main.js
        if (window.initializeFormelFuryShooter) {
            const game = window.initializeFormelFuryShooter();
            if (game) {
                console.log(`🎓 Starting game for Klasse ${this.selectedClass}`);
            }
        } else {
            console.error('❌ Game initialization function not found');
        }
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'Enter':
                if (this.selectedClass) {
                    this.startGame();
                }
                break;
            case '7':
            case '8':
            case '9':
            case '10':
            case '11':
            case '12':
                const classNum = parseInt(e.key);
                this.selectClass(classNum);
                break;
            case 'Escape':
                // Reset selection
                this.resetSelection();
                break;
        }
    }

    resetSelection() {
        const selectedCard = document.querySelector('.class-card.selected');
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }
        
        this.selectedClass = null;
        
        const startGameBtn = document.getElementById('startGameBtn');
        if (startGameBtn) {
            startGameBtn.disabled = true;
            startGameBtn.textContent = '🎮 SPIEL STARTEN';
        }
        
        const footerText = document.querySelector('.footer-text');
        if (footerText) {
            footerText.textContent = 'Wähle eine verfügbare Klasse zum Spielen';
        }
    }

    updateUI() {
        // Set initial state - Class 9 is pre-selected as active
        this.selectClass(9);
    }

    // Method to add more classes in the future
    addAvailableClass(classNumber) {
        if (!this.availableClasses.includes(classNumber)) {
            this.availableClasses.push(classNumber);
            
            // Update the card to be available
            const card = document.querySelector(`[data-class="${classNumber}"]`);
            if (card) {
                card.classList.remove('disabled');
                
                // Replace "BALD VERFÜGBAR" with "VERFÜGBAR"
                const badge = card.querySelector('.coming-soon-badge');
                if (badge) {
                    badge.className = 'available-badge';
                    badge.textContent = 'VERFÜGBAR';
                }
            }
        }
    }
}

// Additional CSS for notifications (will be added to class-selection.css)
const notificationStyles = `
.not-available-notification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #f44336, #e57373);
    color: white;
    padding: 20px 30px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(244, 67, 54, 0.4);
    z-index: 10000;
    animation: notificationPulse 3s ease-in-out forwards;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: bold;
    font-size: 1.1rem;
}

.notification-icon {
    font-size: 1.5rem;
}

@keyframes notificationPulse {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    10% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
    20% { transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes fadeOutUp {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-30px);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.class-card.selected {
    border-color: #2196F3 !important;
    background: linear-gradient(145deg, #2a4a6a, #1e3a5a) !important;
    box-shadow: 0 0 25px rgba(33, 150, 243, 0.4) !important;
}

.class-card.selected .class-number {
    color: #2196F3 !important;
    text-shadow: 0 0 15px rgba(33, 150, 243, 0.5) !important;
}

.class-card.selected .topic {
    background: rgba(33, 150, 243, 0.2) !important;
    border-color: rgba(33, 150, 243, 0.4) !important;
    color: #64B5F6 !important;
}
`;

// Add notification styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize the class selection system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.classSelectionSystem = new ClassSelectionSystem();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassSelectionSystem;
}
