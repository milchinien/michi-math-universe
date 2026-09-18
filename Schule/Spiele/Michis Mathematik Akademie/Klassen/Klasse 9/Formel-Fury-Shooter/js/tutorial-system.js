// Tutorial System for Akademie-Neuling Mode
class TutorialSystem {
    constructor() {
        this.currentLesson = 'binomial-formulas'; // Default lesson KEY, not index
        this.currentStep = 0;
        this.isActive = false;
        this.isDarkMode = localStorage.getItem('tutorial-dark-mode') === 'true';
        this.tutorCharacters = {
            'binomial-formulas': {
                name: "Professor Binomius",
                avatar: "🧙‍♂️",
                personality: "wise and experienced",
                greeting: "Welcome to the world of binomial formulas!",
                specialty: "Binomial formulas and algebraic identities"
            },
            'quadratic-equations': {
                name: "Professor Algebrar",
                avatar: "👨‍🔬",
                personality: "analytical and precise",
                greeting: "Ready to unlock the secrets of quadratic equations?",
                specialty: "Quadratic equations and solution methods"
            },
            'quadratic-functions': {
                name: "Professor Parabolus",
                avatar: "👨‍🎨",
                personality: "creative and visual",
                greeting: "Let's explore the elegant world of parabolas!",
                specialty: "Quadratic functions and parabolas"
            },
            'function-transformations': {
                name: "Professor Transformis",
                avatar: "🧙‍♂️",
                personality: "dynamic and adaptable",
                greeting: "Ready for the magic of function transformations?",
                specialty: "Function transformations and geometric changes"
            },
            'square-roots': {
                name: "Professor Radicus",
                avatar: "🌳",
                personality: "grounded and close to nature",
                greeting: "Let's explore the roots of mathematics!",
                specialty: "Square roots and radicals"
            },
            'power-laws': {
                name: "Professor Potentius",
                avatar: "🏴‍☠️",
                personality: "adventurous and energetic",
                greeting: "Ahoy! Ready for an adventure with the exponent rules?",
                specialty: "Exponent rules and working with powers"
            }
        };
        
        this.currentTutor = this.tutorCharacters['binomial-formulas'];
        
        this.lessons = {
            'quadratic-equations': {
                title: "Mastering Quadratic Equations",
                description: "Learn the pq formula and the quadratic formula with practical examples",
                steps: [
                    {
                        type: 'introduction',
                        title: "Welcome to Quadratic Equations!",
                        dialogue: [
                            "👨‍🏫 Hello! Today we're conquering quadratic equations!",
                            "Quadratic equations are equations with x² - they show up everywhere!",
                            "We'll learn two powerful solving formulas: the pq formula and the quadratic formula.",
                            "With these tools you can solve any quadratic equation! 🎯"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "What are quadratic equations?",
                        dialogue: [
                            "👨‍🏫 A quadratic equation has the form ax² + bx + c = 0",
                            "The x² makes it 'quadratic' - it's the highest exponent.",
                            "Examples: x² - 5x + 6 = 0 or 2x² + 3x - 1 = 0",
                            "🔧 pq formula: for x² + px + q = 0",
                            "🔧 Quadratic formula: for ax² + bx + c = 0",
                            "Both lead to the solution - let's get to know them! 📐"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Using the pq formula",
                        dialogue: [],
                        example: {
                            problem: "x² - 5x + 6 = 0",
                            solution: "x₁ = 2, x₂ = 3",
                            steps: [
                                "Identify: x² + px + q = 0 with p = -5, q = 6",
                                "pq formula: x = -p/2 ± √((p/2)² - q)",
                                "Substitute: x = 5/2 ± √((5/2)² - 6)",
                                "Calculate: x = 2.5 ± √(6.25 - 6) = 2.5 ± 0.5",
                                "Solutions: x₁ = 3, x₂ = 2"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
            'quadratic-functions': {
                title: "Understanding Quadratic Functions",
                description: "Learn to find parabolas, vertices and zeros",
                steps: [
                    {
                        type: 'introduction',
                        title: "Welcome to Parabolas!",
                        dialogue: [
                            "👨‍🏫 Today we discover the beautiful world of parabolas!",
                            "Quadratic functions draw parabolas - those elegant curves.",
                            "We'll learn about vertices, zeros and the vertex form.",
                            "Parabolas are everywhere: bridges, fountains, the path of a thrown ball! 🌉"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "Structure of quadratic functions",
                        dialogue: [
                            "👨‍🏫 A quadratic function has the form f(x) = ax² + bx + c",
                            "📍 Vertex: the highest or lowest point of the parabola",
                            "🎯 Zeros: where the parabola crosses the x-axis",
                            "📐 Vertex form: f(x) = a(x - h)² + k",
                            "The parameter 'a' sets the opening: a > 0 opens up, a < 0 opens down",
                            "Let's explore these properties! 🔍"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Finding the vertex",
                        dialogue: [],
                        example: {
                            problem: "f(x) = x² - 4x + 3",
                            solution: "V(2, -1)",
                            steps: [
                                "Vertex formula: x_v = -b/(2a)",
                                "Here: a = 1, b = -4, so x_v = 4/2 = 2",
                                "y-coordinate: f(2) = 4 - 8 + 3 = -1",
                                "Vertex: V(2, -1)"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
            'function-transformations': {
                title: "Mastering Function Transformations",
                description: "Learn shifts, stretches and reflections of functions",
                steps: [
                    {
                        type: 'introduction',
                        title: "Welcome to Transformations!",
                        dialogue: [
                            "👨‍🏫 Today we transform functions like wizards!",
                            "Transformations shift, stretch and reflect functions.",
                            "With just a few rules you can change any function however you like.",
                            "It's like function origami - elegant and powerful! ✨"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "The four basic transformations",
                        dialogue: [
                            "👨‍🏫 There are four main kinds of transformations:",
                            "↕️ Vertical shift: f(x) + d",
                            "↔️ Horizontal shift: f(x + c)",
                            "📏 Vertical stretch: a·f(x)",
                            "🪞 Reflections: -f(x) or f(-x)",
                            "Each transformation has its own effect on the graph! 🎨"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Understanding shifts",
                        dialogue: [],
                        example: {
                            problem: "f(x) = x² → g(x) = (x - 2)² + 3",
                            solution: "2 to the right, 3 up",
                            steps: [
                                "Starting function: f(x) = x²",
                                "Horizontal shift: (x - 2) means 2 to the right",
                                "Vertical shift: +3 means 3 up",
                                "Result: 2 units right, 3 units up"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
            'binomial-formulas': {
                title: "Mastering Binomial Formulas",
                description: "Learn the three most important binomial formulas with practical examples",
                steps: [
                    {
                        type: 'introduction',
                        title: "Welcome to the Binomial Formula Academy!",
                        dialogue: [
                            "👨‍🏫 Hello! I'm Professor Algebra, your personal math tutor.",
                            "Today we'll learn the binomial formulas together - don't worry, we'll go step by step!",
                            "The binomial formulas are like magic tools that make calculating easier.",
                            "Are you ready? Then let's get started! 🚀"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "What are binomial formulas?",
                        dialogue: [
                            "👨‍🏫 Binomial formulas are special rules for expressions with two terms.",
                            "A 'binomial' means 'two names' - so two parts like (a + b).",
                            "There are three main formulas you should know:",
                            "1️⃣ 1st: (a + b)² = a² + 2ab + b²",
                            "2️⃣ 2nd: (a - b)² = a² - 2ab + b²",
                            "3️⃣ 3rd: (a + b)(a - b) = a² - b²",
                            "Let's start with the first one! 📚"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "1st binomial formula: (a + b)²",
                        dialogue: [],
                        example: {
                            problem: "(a + b)²",
                            solution: "a² + 2ab + b²",
                            steps: [
                                "Recognize the structure: (a + b)²",
                                "Apply the formula: a² + 2ab + b²",
                                "First term: a²",
                                "Middle term: 2ab",
                                "Last term: b²"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Now it's your turn!",
                        dialogue: [],
                        initialMessage: [
                            "👨‍🏫 Perfect! Now you give it a try.",
                            "Expand the general form: (a + b)²"
                        ],
                        problem: {
                            question: "(a + b)²",
                            correctAnswer: "a² + 2ab + b²",
                            hints: [
                                "💡 Hint: Use the 1st binomial formula",
                                "💡 (a + b)² = a² + 2ab + b²",
                                "💡 The first term is a²",
                                "💡 The middle term is 2ab",
                                "💡 The last term is b²"
                            ],
                            explanation: "Solution: (a + b)² = a² + 2ab + b²"
                        },
                        action: 'solve'
                    },
                    {
                        type: 'example',
                        title: "2nd binomial formula: (a - b)²",
                        dialogue: [],
                        example: {
                            problem: "(a - b)²",
                            solution: "a² - 2ab + b²",
                            steps: [
                                "Recognize the structure: (a - b)²",
                                "Apply the formula: a² - 2ab + b²",
                                "First term: a²",
                                "Middle term: -2ab (negative!)",
                                "Last term: b²"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Practice for the 2nd formula",
                        dialogue: [],
                        initialMessage: [
                            "👨‍🏫 Time for another exercise!",
                            "Expand the general form: (a - b)²"
                        ],
                        problem: {
                            question: "(a - b)²",
                            correctAnswer: "a² - 2ab + b²",
                            hints: [
                                "💡 Hint: Use the 2nd binomial formula",
                                "💡 (a - b)² = a² - 2ab + b²",
                                "💡 The first term is a²",
                                "💡 The middle term is -2ab (negative!)",
                                "💡 The last term is b²"
                            ],
                            explanation: "Solution: (a - b)² = a² - 2ab + b²"
                        },
                        action: 'solve'
                    },
                    {
                        type: 'example',
                        title: "3rd binomial formula: (a + b)(a - b)",
                        dialogue: [],
                        example: {
                            problem: "(a + b)(a - b)",
                            solution: "a² - b²",
                            steps: [
                                "Recognize the structure: (a + b)(a - b)",
                                "Apply the formula: a² - b²",
                                "First term: a²",
                                "Second term: -b²",
                                "The middle term cancels out!"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Final exercise!",
                        dialogue: [],
                        initialMessage: [
                            "👨‍🏫 To finish, a problem on the 3rd formula:",
                            "Expand the general form: (a + b)(a - b)"
                        ],
                        problem: {
                            question: "(a + b)(a - b)",
                            correctAnswer: "a² - b²",
                            hints: [
                                "💡 Hint: Use the 3rd binomial formula",
                                "💡 (a + b)(a - b) = a² - b²",
                                "💡 The first term is a²",
                                "💡 The second term is -b²",
                                "💡 The middle term cancels out!"
                            ],
                            explanation: "Solution: (a + b)(a - b) = a² - b²"
                        },
                        action: 'solve'
                    },
                    {
                        type: 'conclusion',
                        title: "Congratulations! 🎉",
                        dialogue: [
                            "👨‍🏫 Fantastic! You've mastered all the binomial formulas!",
                            "Let's quickly sum up:",
                            "1️⃣ (a + b)² = a² + 2ab + b²",
                            "2️⃣ (a - b)² = a² - 2ab + b²",
                            "3️⃣ (a + b)(a - b) = a² - b²",
                            "These formulas will help you a lot in math!",
                            "Now you're ready for real battles! ⚔️",
                            "Want to put what you've learned to use in combat mode?"
                        ],
                        action: 'complete'
                    }
                ]
            },
            'square-roots': {
                title: "Mastering Square Roots",
                description: "Learn to simplify and combine square roots and solve square root equations",
                steps: [
                    {
                        type: 'introduction',
                        title: "Welcome to the Square Root Academy!",
                        dialogue: [
                            "🌳 Greetings, young mathematician! I'm Professor Radicus.",
                            "Today we dig deep into the roots of mathematics!",
                            "Roots are like the foundation of a tree - they give stability.",
                            "Let's explore these natural mathematical structures together! 🌱"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "What are square roots?",
                        dialogue: [
                            "🌳 A square root is the inverse of squaring.",
                            "√16 = 4, because 4² = 16",
                            "📏 Square root rules: √(a·b) = √a · √b",
                            "📏 √(a/b) = √a / √b",
                            "🔧 Simplifying: √18 = √(9·2) = 3√2",
                            "These rules help us simplify complex square roots! 🍃"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Simplifying square roots",
                        dialogue: [],
                        example: {
                            problem: "√72",
                            solution: "6√2",
                            steps: [
                                "Split 72 into factors: 72 = 36 · 2",
                                "Spot the perfect square: 36 = 6²",
                                "Apply the square root rule: √72 = √(36·2) = √36 · √2",
                                "Simplify: √36 = 6",
                                "Result: 6√2"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
            'power-laws': {
                title: "Conquering the Exponent Rules",
                description: "Learn the exponent rules and become an exponent pirate",
                steps: [
                    {
                        type: 'introduction',
                        title: "Ahoy, sailor!",
                        dialogue: [
                            "🏴‍☠️ Ahoy! Captain Potentius here, ready for a mathematical adventure!",
                            "Today we sail through the stormy waters of the exponent rules!",
                            "These mighty rules are like treasure - once you find them, they make you rich!",
                            "Ready to plunder the secrets of exponents? ⚓"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "The Exponent Rules Treasure Map",
                        dialogue: [
                            "🏴‍☠️ Here are the most valuable treasures of the exponent rules:",
                            "⚔️ Product rule: a^m · a^n = a^(m+n)",
                            "🗡️ Quotient rule: a^m / a^n = a^(m-n)",
                            "🛡️ Power rule: (a^m)^n = a^(m·n)",
                            "💎 Negative exponents: a^(-n) = 1/a^n",
                            "🏆 Zero exponent: a^0 = 1",
                            "With these weapons you're unbeatable! ⚡"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Exponent rules in action",
                        dialogue: [],
                        example: {
                            problem: "2³ · 2⁵",
                            solution: "2⁸ = 256",
                            steps: [
                                "Spot the equal bases: 2³ · 2⁵",
                                "Apply the product rule: a^m · a^n = a^(m+n)",
                                "Add the exponents: 3 + 5 = 8",
                                "Result: 2⁸",
                                "Calculate: 2⁸ = 256"
                            ]
                        },
                        action: 'practice'
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
    
    // Method to switch tutor based on selected math topic
    setTutorForTopic(topicKey) {
        const tutorMapping = {
            'binomial-formulas': 'binomial-formulas',
            'quadratic-equations': 'quadratic-equations', 
            'quadratic-functions': 'quadratic-functions',
            'function-transformations': 'function-transformations',
            'square-roots': 'square-roots',
            'power-laws': 'power-laws'
        };
        
        const tutorKey = tutorMapping[topicKey] || 'binomial-formulas';
        this.currentTutor = this.tutorCharacters[tutorKey];
        
        // Update UI if tutorial is active
        if (this.isActive) {
            this.updateTutorUI();
        }
        
        return this.currentTutor;
    }
    
    // Method to get appropriate tutor for current math topics selection
    selectTutorForCurrentTopics() {
        // Get selected topics from math-topics-system
        const selectedTopics = JSON.parse(localStorage.getItem('selectedMathTopics') || '["binomial-formulas"]');
        
        // Priority order for tutor selection (if multiple topics selected)
        const tutorPriority = [
            'quadratic-equations',
            'quadratic-functions', 
            'function-transformations',
            'square-roots',
            'power-laws',
            'binomial-formulas'
        ];
        
        // Find the highest priority selected topic
        for (const topic of tutorPriority) {
            if (selectedTopics.includes(topic)) {
                return this.setTutorForTopic(topic);
            }
        }
        
        // Default fallback
        return this.setTutorForTopic('binomial-formulas');
    }
    
    // Update tutor information in UI
    updateTutorUI() {
        const avatarElement = document.querySelector('.tutor-avatar');
        const nameElement = document.querySelector('.tutor-name');
        const specialtyElement = document.querySelector('.tutor-specialty');
        
        if (avatarElement) avatarElement.textContent = this.currentTutor.avatar;
        if (nameElement) nameElement.textContent = this.currentTutor.name;
        if (specialtyElement) specialtyElement.textContent = this.currentTutor.specialty;
    }
    
    // Start tutorial for a specific topic
    startTutorialForTopic(topicKey) {
        console.log(`🎓 Starting tutorial for topic: ${topicKey}`);
        
        // FORCE RELOAD: Clear any cached tutorial state
        this.isActive = false;
        this.currentStep = 0;
        
        // Set the appropriate tutor
        this.setTutorForTopic(topicKey);
        
        // Check if lesson exists for this topic
        if (!this.lessons[topicKey]) {
            console.warn(`❌ No tutorial lesson found for topic: ${topicKey}`);
            console.log('Available lessons:', Object.keys(this.lessons));
            return false;
        }
        
        console.log(`✅ Found lesson for topic: ${topicKey}`);
        console.log(`📖 Lesson title: ${this.lessons[topicKey].title}`);
        console.log(`📝 First step: ${this.lessons[topicKey].steps[0].title}`);
        
        // Start the tutorial
        this.startTutorial(topicKey);
        return true;
    }
    
    // Enhanced start tutorial method
    startTutorial(lessonKey = null) {
        console.log(`🎬 startTutorial called with lessonKey: ${lessonKey}`);
        
        // If no lesson specified, select based on current math topics
        if (!lessonKey) {
            const selectedTutor = this.selectTutorForCurrentTopics();
            lessonKey = 'binomial-formulas'; // Fallback only when no lesson specified
            console.log(`🔄 No lessonKey provided, using fallback: ${lessonKey}`);
        }
        
        // Check if lesson exists
        if (!this.lessons[lessonKey]) {
            console.warn(`❌ Lesson '${lessonKey}' not found, falling back to binomial-formulas`);
            console.log('Available lessons:', Object.keys(this.lessons));
            lessonKey = 'binomial-formulas';
        }
        
        console.log(`📚 Setting currentLesson to: ${lessonKey}`);
        this.currentLesson = lessonKey;
        this.currentStep = 0;
        this.isActive = true;
        
        // Update tutor for this lesson
        this.setTutorForTopic(lessonKey);
        console.log(`👨‍🏫 Current tutor set to: ${this.currentTutor.name}`);
        
        // FORCE RECREATION: Remove existing tutorial UI to ensure fresh content
        const existingOverlay = document.getElementById('tutorialOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Create fresh tutorial UI with current tutor
        this.createTutorialUI();
        
        // Hide all menus
        const menus = ['mainMenu', 'classSelectionMenu', 'mathTopicsMenu', 'difficultySelectionMenu', 'akademieMenu', 'learningModeMenu'];
        menus.forEach(menuId => {
            const menu = document.getElementById(menuId);
            if (menu) menu.style.display = 'none';
        });
        
        // Hide game canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.display = 'none';
        
        // Show tutorial overlay
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            this.updateTutorUI();
            this.displayCurrentStep();
        }
        
        // Disable body scrolling
        document.body.style.overflow = 'hidden';
        
        console.log(`✅ Tutorial started successfully for lesson: ${lessonKey}`);
    }
    
    createTutorialUI() {
        // Create tutorial overlay HTML
        const tutorialHTML = `
            <div id="tutorialOverlay" class="tutorial-overlay ${this.isDarkMode ? 'dark-mode' : 'light-mode'}" style="display: none;">
                <div class="tutorial-container">
                    <div class="tutorial-header">
                        <div class="tutor-avatar">${this.currentTutor.avatar}</div>
                        <div class="tutor-info">
                            <h2 class="tutor-name">${this.currentTutor.name}</h2>
                            <p class="tutor-specialty">${this.currentTutor.specialty}</p>
                            <div class="lesson-progress">
                                <span id="tutorialProgress">Step 1 of 9</span>
                            </div>
                        </div>
                        <div class="tutorial-header-controls">
                            <button class="theme-toggle-btn" onclick="tutorialSystem.toggleTheme()" title="Toggle theme">
                                <span class="theme-icon">${this.isDarkMode ? '☀️' : '🌙'}</span>
                            </button>
                            <button class="tutorial-close" onclick="tutorialSystem.exitTutorial()">✕</button>
                        </div>
                    </div>
                    
                    <div class="tutorial-content">
                        <h3 id="tutorialStepTitle">Welcome!</h3>
                        <div id="tutorialDialogue" class="tutorial-dialogue"></div>
                        <div id="tutorialExample" class="tutorial-example" style="display: none;"></div>
                        <div id="tutorialProblem" class="tutorial-problem" style="display: none;"></div>
                    </div>
                    
                    <div class="tutorial-controls">
                        <button id="tutorialPrevBtn" class="tutorial-btn secondary" onclick="tutorialSystem.previousStep()" style="display: none;">
                            ← Back
                        </button>
                        <button id="tutorialNextBtn" class="tutorial-btn primary" onclick="tutorialSystem.nextStep()">
                            Continue →
                        </button>
                        <button id="tutorialHintBtn" class="tutorial-btn hint" onclick="tutorialSystem.showHint()" style="display: none;">
                            💡 Hint
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
                    this.handleEnterKey();
                } else if (e.key === 'Escape') {
                    this.exitTutorial();
                } else if (e.key === 'ArrowLeft') {
                    this.previousStep();
                } else if (e.key === 'ArrowRight') {
                    this.handleArrowRightKey();
                }
            }
        });
    }
    
    // NOTE: This duplicate method was removed - the main startTutorial method above handles all functionality
    
    displayCurrentStep() {
        console.log(`🎬 displayCurrentStep called - currentLesson: ${this.currentLesson}, currentStep: ${this.currentStep}`);
        
        const lesson = this.lessons[this.currentLesson];
        if (!lesson) {
            console.error(`❌ No lesson found for key: ${this.currentLesson}`);
            console.log('Available lessons:', Object.keys(this.lessons));
            return;
        }
        
        const step = lesson.steps[this.currentStep];
        if (!step) {
            console.error(`❌ No step found at index: ${this.currentStep} for lesson: ${this.currentLesson}`);
            return;
        }
        
        console.log(`✅ Displaying lesson: ${lesson.title}, step: ${step.title}`);
        
        // Update progress
        document.getElementById('tutorialProgress').textContent = 
            `Step ${this.currentStep + 1} of ${lesson.steps.length}`;
        
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
        
        // Check current step type
        const currentStep = this.lessons[this.currentLesson].steps[this.currentStep];
        const isTaskStep = currentStep.type === 'practice';
        const isExampleStep = currentStep.type === 'example';
        
        if (isTaskStep) {
            // For task steps, show only initialMessage if it exists, then stop
            const messagesToShow = currentStep.initialMessage || [];
            messagesToShow.forEach((line) => {
                const p = document.createElement('p');
                p.textContent = line;
                p.classList.add('dialogue-line');
                dialogueContainer.appendChild(p);
            });
        } else if (isExampleStep) {
            // For example steps, show no dialogue (professor stays silent)
            return;
        } else {
            // For introduction/theory/conclusion steps, show animated dialogue
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
    }
    
    handleStepType(step) {
        // Hide all optional sections
        document.getElementById('tutorialExample').style.display = 'none';
        document.getElementById('tutorialProblem').style.display = 'none';
        document.getElementById('tutorialHintBtn').style.display = 'none';
        
        // Control dialogue container visibility based on step type
        const dialogueContainer = document.getElementById('tutorialDialogue');
        
        if (step.type === 'example' || step.type === 'practice') {
            // Hide dialogue container completely for examples and practice
            dialogueContainer.style.display = 'none';
        } else {
            // Show dialogue container for introduction/theory/conclusion
            dialogueContainer.style.display = 'flex';
        }
        
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
            <div class="example-header">📝 Example:</div>
            <div class="example-problem">${example.problem}</div>
            <div class="example-solution">= ${example.solution}</div>
            <div class="example-steps">
                <div class="steps-header">Solution steps:</div>
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
            <div class="problem-header">🎯 Your task:</div>
            <div class="problem-question">${problem.question} = ?</div>
            <input type="text" id="tutorialAnswer" class="problem-input" placeholder="Your answer...">
            <button class="problem-check-btn" onclick="tutorialSystem.checkAnswer()">Check answer</button>
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
            // Show green screen flash effect
            this.showSuccessFlash();
            
            feedback.innerHTML = `
                <div class="feedback-correct">
                    ✅ Correct! Well done!
                    <div class="explanation">${step.problem.explanation}</div>
                </div>
            `;
            
            // Enable next button and mark step as solved
            const nextBtn = document.getElementById('tutorialNextBtn');
            nextBtn.disabled = false;
            nextBtn.textContent = 'Continue →';
            
            // Disable answer input to prevent further changes
            document.getElementById('tutorialAnswer').disabled = true;
            
            // Play success sound
            if (window.audioManager) {
                window.audioManager.playSound('correct-answer', 'feedback');
            }
        } else {
            feedback.innerHTML = `
                <div class="feedback-incorrect">
                    ❌ Not quite right. Try again!
                    <div class="hint-suggestion">💡 Use the Hint button for help</div>
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
            nextBtn.textContent = 'Solve the problem';
        } else if (step.action === 'complete') {
            nextBtn.textContent = 'Finish tutorial';
        } else {
            nextBtn.disabled = false;
            nextBtn.textContent = 'Continue →';
        }
    }
    
    handleEnterKey() {
        const currentStep = this.lessons[this.currentLesson].steps[this.currentStep];
        
        // For practice steps, check if answer is required and correct
        if (currentStep.type === 'practice') {
            const answerInput = document.getElementById('tutorialAnswer');
            const nextBtn = document.getElementById('tutorialNextBtn');
            
            // If there's an answer input and it's not disabled, try to check the answer
            if (answerInput && !answerInput.disabled) {
                // If there's text in the input, check the answer
                if (answerInput.value.trim()) {
                    this.checkAnswer();
                }
                return; // Don't proceed to next step
            }
            
            // If the next button is disabled, don't allow proceeding
            if (nextBtn && nextBtn.disabled) {
                return;
            }
        }
        
        // For non-practice steps or when answer is already correct, proceed normally
        this.nextStep();
    }
    
    handleArrowRightKey() {
        const currentStep = this.lessons[this.currentLesson].steps[this.currentStep];
        
        // For practice steps, don't allow arrow key navigation if answer not solved
        if (currentStep.type === 'practice') {
            const nextBtn = document.getElementById('tutorialNextBtn');
            if (nextBtn && nextBtn.disabled) {
                return; // Don't allow navigation if answer not correct
            }
        }
        
        this.nextStep();
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
        alert('🎉 Tutorial complete! You are now ready for real battles!');
        
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
        
        // Hide tutorial overlay
        const overlay = document.getElementById('tutorialOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
        
        // Return to Akademie menu if we came from there
        if (window.akademieSystem && window.akademieSystem.currentMode === 'training') {
            window.akademieSystem.showAkademieMenu();
        } else {
            // Show main menu as fallback
            showMainMenu();
        }
        
        console.log('Tutorial exited');
    }
    
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('tutorial-dark-mode', this.isDarkMode.toString());
        
        const overlay = document.getElementById('tutorialOverlay');
        const themeIcon = document.querySelector('.theme-icon');
        
        if (this.isDarkMode) {
            overlay.classList.remove('light-mode');
            overlay.classList.add('dark-mode');
            themeIcon.textContent = '☀️';
        } else {
            overlay.classList.remove('dark-mode');
            overlay.classList.add('light-mode');
            themeIcon.textContent = '🌙';
        }
        
        // Play theme toggle sound
        if (window.audioManager) {
            window.audioManager.playSound('ui-click', 'feedback');
        }
    }
    
    showSuccessFlash() {
        // Create success flash overlay
        const flashOverlay = document.createElement('div');
        flashOverlay.className = 'tutorial-success-flash';
        flashOverlay.innerHTML = `
            <div class="success-flash-content">
                <div class="success-icon">✅</div>
                <div class="success-text">CORRECT!</div>
            </div>
        `;
        
        // Add to tutorial overlay
        const tutorialOverlay = document.getElementById('tutorialOverlay');
        tutorialOverlay.appendChild(flashOverlay);
        
        // Trigger animation
        setTimeout(() => {
            flashOverlay.classList.add('flash-active');
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            if (flashOverlay.parentNode) {
                flashOverlay.parentNode.removeChild(flashOverlay);
            }
        }, 1500);
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
