// Tutorial System for Akademie-Neuling Mode
class TutorialSystem {
    constructor() {
        this.currentLesson = 0;
        this.currentStep = 0;
        this.isActive = false;
        this.tutorCharacter = {
            name: "Professor Algebra",
            avatar: "👨‍🏫",
            personality: "freundlich und geduldig"
        };
        
        this.lessons = {
            'binomial-formulas': {
                title: "Binomische Formeln Meistern",
                description: "Lerne die drei wichtigsten binomischen Formeln mit praktischen Beispielen",
                steps: [
                    {
                        type: 'introduction',
                        title: "Willkommen zur Binomischen Formel Akademie!",
                        dialogue: [
                            "👨‍🏫 Hallo! Ich bin Professor Algebra, dein persönlicher Mathe-Tutor.",
                            "Heute lernen wir gemeinsam die binomischen Formeln - keine Sorge, wir gehen Schritt für Schritt vor!",
                            "Die binomischen Formeln sind wie magische Werkzeuge, die dir das Rechnen erleichtern.",
                            "Bist du bereit? Dann lass uns anfangen! 🚀"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "Was sind binomische Formeln?",
                        dialogue: [
                            "👨‍🏫 Binomische Formeln sind spezielle Rechenregeln für Terme mit zwei Gliedern.",
                            "Ein 'Binom' bedeutet 'zwei Namen' - also zwei Teile wie (a + b).",
                            "Es gibt drei Hauptformeln, die du kennen solltest:",
                            "1️⃣ Erste: (a + b)² = a² + 2ab + b²",
                            "2️⃣ Zweite: (a - b)² = a² - 2ab + b²", 
                            "3️⃣ Dritte: (a + b)(a - b) = a² - b²",
                            "Lass uns mit der ersten beginnen! 📚"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Erste binomische Formel: (a + b)²",
                        dialogue: [
                            "👨‍🏫 Schauen wir uns ein konkretes Beispiel an:",
                            "Nehmen wir (x + 3)²",
                            "Hier ist a = x und b = 3",
                            "Nach der Formel: (a + b)² = a² + 2ab + b²",
                            "Setzen wir ein: (x + 3)² = x² + 2·x·3 + 3²",
                            "Das ergibt: x² + 6x + 9",
                            "Siehst du das Muster? 🤔"
                        ],
                        example: {
                            problem: "(x + 3)²",
                            solution: "x² + 6x + 9",
                            steps: [
                                "Erkenne: a = x, b = 3",
                                "Wende Formel an: a² + 2ab + b²",
                                "Berechne: x² + 2·x·3 + 3²",
                                "Vereinfache: x² + 6x + 9"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Jetzt bist du dran!",
                        dialogue: [
                            "👨‍🏫 Perfekt! Jetzt versuch du es mal.",
                            "Löse die allgemeine Form: (a + b)²",
                            "Das ist die Grundformel für alle binomischen Formeln!",
                            "Verwende die Formel: (a + b)² = a² + 2ab + b²",
                            "Nimm dir alle Zeit, die du brauchst! ⏰"
                        ],
                        problem: {
                            question: "(a + b)²",
                            correctAnswer: "a² + 2ab + b²",
                            hints: [
                                "💡 Tipp: Verwende die erste binomische Formel",
                                "💡 (a + b)² = a² + 2ab + b²",
                                "💡 Das erste Glied ist a²",
                                "💡 Das mittlere Glied ist 2ab",
                                "💡 Das letzte Glied ist b²"
                            ],
                            explanation: "Lösung: (a + b)² = a² + 2ab + b²"
                        },
                        action: 'solve'
                    },
                    {
                        type: 'example',
                        title: "Zweite binomische Formel: (a - b)²",
                        dialogue: [
                            "👨‍🏫 Großartig! Jetzt zur zweiten Formel.",
                            "Bei (a - b)² haben wir ein Minus zwischen den Termen.",
                            "Die Formel lautet: (a - b)² = a² - 2ab + b²",
                            "Wichtig: Das mittlere Glied wird NEGATIV!",
                            "Beispiel: (x - 4)²",
                            "= x² - 2·x·4 + 4² = x² - 8x + 16",
                            "Merkst du den Unterschied zur ersten Formel? 🧐"
                        ],
                        example: {
                            problem: "(x - 4)²",
                            solution: "x² - 8x + 16",
                            steps: [
                                "Erkenne: a = x, b = 4",
                                "Wende Formel an: a² - 2ab + b²",
                                "Berechne: x² - 2·x·4 + 4²",
                                "Vereinfache: x² - 8x + 16"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Übung zur zweiten Formel",
                        dialogue: [
                            "👨‍🏫 Zeit für eine weitere Übung!",
                            "Löse die allgemeine Form: (a - b)²",
                            "Achte auf das Vorzeichen beim mittleren Term!",
                            "Du schaffst das! 💪"
                        ],
                        problem: {
                            question: "(a - b)²",
                            correctAnswer: "a² - 2ab + b²",
                            hints: [
                                "💡 Tipp: Verwende die zweite binomische Formel",
                                "💡 (a - b)² = a² - 2ab + b²",
                                "💡 Das erste Glied ist a²",
                                "💡 Das mittlere Glied ist -2ab (negativ!)",
                                "💡 Das letzte Glied ist b²"
                            ],
                            explanation: "Lösung: (a - b)² = a² - 2ab + b²"
                        },
                        action: 'solve'
                    },
                    {
                        type: 'example',
                        title: "Dritte binomische Formel: (a + b)(a - b)",
                        dialogue: [
                            "👨‍🏫 Jetzt zur dritten und letzten Formel!",
                            "Diese ist besonders elegant: (a + b)(a - b) = a² - b²",
                            "Das Ergebnis hat nur ZWEI Terme - das mittlere fällt weg!",
                            "Beispiel: (x + 5)(x - 5)",
                            "= x² - 5² = x² - 25",
                            "Wie einfach ist das denn? ✨"
                        ],
                        example: {
                            problem: "(x + 5)(x - 5)",
                            solution: "x² - 25",
                            steps: [
                                "Erkenne: a = x, b = 5",
                                "Wende Formel an: a² - b²",
                                "Berechne: x² - 5²",
                                "Vereinfache: x² - 25"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Letzte Übung!",
                        dialogue: [
                            "👨‍🏫 Zum Abschluss eine Aufgabe zur dritten Formel:",
                            "Löse die allgemeine Form: (a + b)(a - b)",
                            "Denk daran: Das Ergebnis hat nur zwei Terme!",
                            "Du bist fast am Ziel! 🎯"
                        ],
                        problem: {
                            question: "(a + b)(a - b)",
                            correctAnswer: "a² - b²",
                            hints: [
                                "💡 Tipp: Verwende die dritte binomische Formel",
                                "💡 (a + b)(a - b) = a² - b²",
                                "💡 Das erste Glied ist a²",
                                "💡 Das zweite Glied ist -b²",
                                "💡 Das mittlere Glied fällt weg!"
                            ],
                            explanation: "Lösung: (a + b)(a - b) = a² - b²"
                        },
                        action: 'solve'
                    },
                    {
                        type: 'conclusion',
                        title: "Herzlichen Glückwunsch! 🎉",
                        dialogue: [
                            "👨‍🏫 Fantastisch! Du hast alle binomischen Formeln gemeistert!",
                            "Lass uns kurz zusammenfassen:",
                            "1️⃣ (a + b)² = a² + 2ab + b²",
                            "2️⃣ (a - b)² = a² - 2ab + b²",
                            "3️⃣ (a + b)(a - b) = a² - b²",
                            "Diese Formeln werden dir in der Mathematik sehr helfen!",
                            "Jetzt bist du bereit für echte Kämpfe! ⚔️",
                            "Möchtest du das Gelernte im Kampfmodus anwenden?"
                        ],
                        action: 'complete'
                    }
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.createTutorialUI();
        this.setupEventListeners();
    }
    
    createTutorialUI() {
        // Create tutorial overlay HTML
        const tutorialHTML = `
            <div id="tutorialOverlay" class="tutorial-overlay" style="display: none;">
                <div class="tutorial-container">
                    <div class="tutorial-header">
                        <div class="tutor-avatar">${this.tutorCharacter.avatar}</div>
                        <div class="tutor-info">
                            <h2 class="tutor-name">${this.tutorCharacter.name}</h2>
                            <div class="lesson-progress">
                                <span id="tutorialProgress">Schritt 1 von 9</span>
                            </div>
                        </div>
                        <button class="tutorial-close" onclick="tutorialSystem.exitTutorial()">✕</button>
                    </div>
                    
                    <div class="tutorial-content">
                        <h3 id="tutorialStepTitle">Willkommen!</h3>
                        <div id="tutorialDialogue" class="tutorial-dialogue"></div>
                        <div id="tutorialExample" class="tutorial-example" style="display: none;"></div>
                        <div id="tutorialProblem" class="tutorial-problem" style="display: none;"></div>
                    </div>
                    
                    <div class="tutorial-controls">
                        <button id="tutorialPrevBtn" class="tutorial-btn secondary" onclick="tutorialSystem.previousStep()" style="display: none;">
                            ← Zurück
                        </button>
                        <button id="tutorialNextBtn" class="tutorial-btn primary" onclick="tutorialSystem.nextStep()">
                            Weiter →
                        </button>
                        <button id="tutorialHintBtn" class="tutorial-btn hint" onclick="tutorialSystem.showHint()" style="display: none;">
                            💡 Tipp
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.insertAdjacentHTML('beforeend', tutorialHTML);
    }
    
    setupEventListeners() {
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isActive) {
                if (e.key === 'Enter') {
                    this.nextStep();
                } else if (e.key === 'Escape') {
                    this.exitTutorial();
                } else if (e.key === 'ArrowLeft') {
                    this.previousStep();
                } else if (e.key === 'ArrowRight') {
                    this.nextStep();
                }
            }
        });
    }
    
    startTutorial(topicId) {
        if (!this.lessons[topicId]) {
            console.error('Tutorial for topic not found:', topicId);
            return;
        }
        
        this.currentLesson = topicId;
        this.currentStep = 0;
        this.isActive = true;
        
        // Show tutorial overlay
        document.getElementById('tutorialOverlay').style.display = 'flex';
        
        // Hide game canvas and UI
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('difficultySelectionMenu').style.display = 'none';
        document.getElementById('gameModeMenu').style.display = 'none';
        
        this.displayCurrentStep();
        
        // Play tutorial start sound
        if (window.audioManager) {
            window.audioManager.playSound('tutorial-start', 'feedback');
        }
    }
    
    displayCurrentStep() {
        const lesson = this.lessons[this.currentLesson];
        const step = lesson.steps[this.currentStep];
        
        if (!step) return;
        
        // Update progress
        document.getElementById('tutorialProgress').textContent = 
            `Schritt ${this.currentStep + 1} von ${lesson.steps.length}`;
        
        // Update title
        document.getElementById('tutorialStepTitle').textContent = step.title;
        
        // Display dialogue
        this.displayDialogue(step.dialogue);
        
        // Handle different step types
        this.handleStepType(step);
        
        // Update navigation buttons
        this.updateNavigationButtons(step);
    }
    
    displayDialogue(dialogue) {
        const dialogueContainer = document.getElementById('tutorialDialogue');
        dialogueContainer.innerHTML = '';
        
        dialogue.forEach((line, index) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.textContent = line;
                p.classList.add('dialogue-line');
                dialogueContainer.appendChild(p);
                
                // Scroll to bottom
                dialogueContainer.scrollTop = dialogueContainer.scrollHeight;
                
                // Play typing sound
                if (window.audioManager) {
                    window.audioManager.playSound('dialogue-type', 'feedback');
                }
            }, index * 2500);
        });
    }
    
    handleStepType(step) {
        // Hide all optional sections
        document.getElementById('tutorialExample').style.display = 'none';
        document.getElementById('tutorialProblem').style.display = 'none';
        document.getElementById('tutorialHintBtn').style.display = 'none';
        
        // Always show dialogue for all step types
        const dialogueContainer = document.getElementById('tutorialDialogue');
        dialogueContainer.style.display = 'flex';
        
        switch (step.type) {
            case 'example':
                this.displayExample(step.example);
                break;
            case 'practice':
                this.displayProblem(step.problem);
                break;
        }
    }
    
    displayExample(example) {
        const exampleContainer = document.getElementById('tutorialExample');
        exampleContainer.style.display = 'block';
        
        exampleContainer.innerHTML = `
            <div class="example-header">📝 Beispiel:</div>
            <div class="example-problem">${example.problem}</div>
            <div class="example-solution">= ${example.solution}</div>
            <div class="example-steps">
                <div class="steps-header">Lösungsweg:</div>
                ${example.steps.map((step, i) => `
                    <div class="step-item">${i + 1}. ${step}</div>
                `).join('')}
            </div>
        `;
    }
    
    displayProblem(problem) {
        const problemContainer = document.getElementById('tutorialProblem');
        problemContainer.style.display = 'block';
        
        problemContainer.innerHTML = `
            <div class="problem-header">🎯 Deine Aufgabe:</div>
            <div class="problem-question">${problem.question} = ?</div>
            <input type="text" id="tutorialAnswer" class="problem-input" placeholder="Deine Antwort...">
            <button class="problem-check-btn" onclick="tutorialSystem.checkAnswer()">Antwort prüfen</button>
            <div id="problemFeedback" class="problem-feedback"></div>
        `;
        
        // Show hint button
        document.getElementById('tutorialHintBtn').style.display = 'inline-block';
        this.currentHintIndex = 0;
        
        // Focus input
        setTimeout(() => {
            document.getElementById('tutorialAnswer').focus();
        }, 100);
    }
    
    checkAnswer() {
        const userAnswer = document.getElementById('tutorialAnswer').value.trim();
        const step = this.lessons[this.currentLesson].steps[this.currentStep];
        const correctAnswer = step.problem.correctAnswer;
        
        const feedback = document.getElementById('problemFeedback');
        
        if (this.normalizeAnswer(userAnswer) === this.normalizeAnswer(correctAnswer)) {
            feedback.innerHTML = `
                <div class="feedback-correct">
                    ✅ Richtig! Sehr gut gemacht!
                    <div class="explanation">${step.problem.explanation}</div>
                </div>
            `;
            
            // Enable next button
            document.getElementById('tutorialNextBtn').disabled = false;
            document.getElementById('tutorialNextBtn').textContent = 'Weiter →';
            
            // Play success sound
            if (window.audioManager) {
                window.audioManager.playSound('correct-answer', 'feedback');
            }
        } else {
            feedback.innerHTML = `
                <div class="feedback-incorrect">
                    ❌ Nicht ganz richtig. Versuch es nochmal!
                    <div class="hint-suggestion">💡 Nutze den Tipp-Button für Hilfe</div>
                </div>
            `;
            
            // Play error sound
            if (window.audioManager) {
                window.audioManager.playSound('wrong-answer', 'feedback');
            }
        }
    }
    
    normalizeAnswer(answer) {
        return answer.toLowerCase().replace(/\s+/g, '').replace(/\*/g, '');
    }
    
    showHint() {
        const step = this.lessons[this.currentLesson].steps[this.currentStep];
        if (!step.problem || !step.problem.hints) return;
        
        const hints = step.problem.hints;
        if (this.currentHintIndex < hints.length) {
            const feedback = document.getElementById('problemFeedback');
            const hint = hints[this.currentHintIndex];
            
            feedback.innerHTML = `
                <div class="feedback-hint">
                    ${hint}
                </div>
            `;
            
            this.currentHintIndex++;
            
            // Play hint sound
            if (window.audioManager) {
                window.audioManager.playSound('hint', 'feedback');
            }
        }
    }
    
    updateNavigationButtons(step) {
        const prevBtn = document.getElementById('tutorialPrevBtn');
        const nextBtn = document.getElementById('tutorialNextBtn');
        
        // Previous button
        prevBtn.style.display = this.currentStep > 0 ? 'inline-block' : 'none';
        
        // Next button
        if (step.action === 'solve') {
            nextBtn.disabled = true;
            nextBtn.textContent = 'Löse die Aufgabe';
        } else if (step.action === 'complete') {
            nextBtn.textContent = 'Tutorial beenden';
        } else {
            nextBtn.disabled = false;
            nextBtn.textContent = 'Weiter →';
        }
    }
    
    nextStep() {
        const lesson = this.lessons[this.currentLesson];
        
        if (this.currentStep < lesson.steps.length - 1) {
            this.currentStep++;
            this.displayCurrentStep();
        } else {
            // Tutorial completed
            this.completeTutorial();
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.displayCurrentStep();
        }
    }
    
    completeTutorial() {
        // Show completion message
        alert('🎉 Tutorial abgeschlossen! Du bist jetzt bereit für echte Kämpfe!');
        
        // Exit tutorial
        this.exitTutorial();
        
        // Return to difficulty selection but suggest combat mode
        document.getElementById('difficultySelectionMenu').style.display = 'block';
        document.getElementById('difficultySelectionMenu').classList.add('active');
        
        // Auto-select easy mode for first real combat
        if (window.difficultySelectionSystem) {
            window.difficultySelectionSystem.selectDifficulty('easy');
        }
    }
    
    exitTutorial() {
        this.isActive = false;
        document.getElementById('tutorialOverlay').style.display = 'none';
        
        // Show difficulty selection menu
        document.getElementById('difficultySelectionMenu').style.display = 'block';
        document.getElementById('difficultySelectionMenu').classList.add('active');
    }
    
    isTutorialMode() {
        return window.difficultySelectionSystem && 
               window.difficultySelectionSystem.getCurrentDifficulty() === 'tutorial';
    }
}

// Initialize tutorial system
document.addEventListener('DOMContentLoaded', () => {
    window.tutorialSystem = new TutorialSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TutorialSystem };
}
