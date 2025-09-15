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
                personality: "weise und erfahren",
                greeting: "Willkommen in der Welt der binomischen Formeln!",
                specialty: "Binomische Formeln und algebraische Identitäten"
            },
            'quadratic-equations': {
                name: "Professor Algebrar",
                avatar: "👨‍🔬",
                personality: "analytisch und präzise",
                greeting: "Bereit, die Geheimnisse quadratischer Gleichungen zu entschlüsseln?",
                specialty: "Quadratische Gleichungen und Lösungsverfahren"
            },
            'quadratic-functions': {
                name: "Professor Parabolus",
                avatar: "👨‍🎨",
                personality: "kreativ und visuell",
                greeting: "Lass uns die elegante Welt der Parabeln erkunden!",
                specialty: "Quadratische Funktionen und Parabeln"
            },
            'function-transformations': {
                name: "Professor Transformis",
                avatar: "🧙‍♂️",
                personality: "dynamisch und wandelbar",
                greeting: "Bereit für die Magie der Funktions-Transformationen?",
                specialty: "Funktions-Transformationen und geometrische Veränderungen"
            },
            'square-roots': {
                name: "Professor Radicus",
                avatar: "🌳",
                personality: "geerdet und naturverbunden",
                greeting: "Lass uns die Wurzeln der Mathematik erforschen!",
                specialty: "Wurzelrechnung und Radikale"
            },
            'power-laws': {
                name: "Professor Potentius",
                avatar: "🏴‍☠️",
                personality: "abenteuerlustig und energisch",
                greeting: "Ahoy! Bereit für ein Abenteuer mit den Potenzgesetzen?",
                specialty: "Potenzgesetze und Exponentialrechnung"
            }
        };
        
        this.currentTutor = this.tutorCharacters['binomial-formulas'];
        
        this.lessons = {
            'quadratic-equations': {
                title: "Quadratische Gleichungen Meistern",
                description: "Lerne die p-q-Formel und Mitternachtsformel mit praktischen Beispielen",
                steps: [
                    {
                        type: 'introduction',
                        title: "Willkommen zu den Quadratischen Gleichungen!",
                        dialogue: [
                            "👨‍🏫 Hallo! Heute erobern wir die quadratischen Gleichungen!",
                            "Quadratische Gleichungen sind Gleichungen mit x² - sie kommen überall vor!",
                            "Wir lernen zwei mächtige Lösungsformeln: die p-q-Formel und die Mitternachtsformel.",
                            "Mit diesen Werkzeugen kannst du jede quadratische Gleichung lösen! 🎯"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "Was sind quadratische Gleichungen?",
                        dialogue: [
                            "👨‍🏫 Eine quadratische Gleichung hat die Form ax² + bx + c = 0",
                            "Das x² macht sie 'quadratisch' - das ist der höchste Exponent.",
                            "Beispiele: x² - 5x + 6 = 0 oder 2x² + 3x - 1 = 0",
                            "🔧 p-q-Formel: Für x² + px + q = 0",
                            "🔧 Mitternachtsformel: Für ax² + bx + c = 0",
                            "Beide führen zur Lösung - lass uns sie kennenlernen! 📐"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "p-q-Formel anwenden",
                        dialogue: [],
                        example: {
                            problem: "x² - 5x + 6 = 0",
                            solution: "x₁ = 2, x₂ = 3",
                            steps: [
                                "Erkenne: x² + px + q = 0 mit p = -5, q = 6",
                                "p-q-Formel: x = -p/2 ± √((p/2)² - q)",
                                "Einsetzen: x = 5/2 ± √((5/2)² - 6)",
                                "Berechnen: x = 2.5 ± √(6.25 - 6) = 2.5 ± 0.5",
                                "Lösungen: x₁ = 3, x₂ = 2"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
            'quadratic-functions': {
                title: "Quadratische Funktionen Verstehen",
                description: "Lerne Parabeln, Scheitelpunkte und Nullstellen zu bestimmen",
                steps: [
                    {
                        type: 'introduction',
                        title: "Willkommen zu den Parabeln!",
                        dialogue: [
                            "👨‍🏫 Heute entdecken wir die wunderschöne Welt der Parabeln!",
                            "Quadratische Funktionen zeichnen Parabeln - diese eleganten Kurven.",
                            "Wir lernen Scheitelpunkte, Nullstellen und die Scheitelpunktform kennen.",
                            "Parabeln sind überall: Brücken, Fontänen, Wurfbahnen! 🌉"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "Aufbau quadratischer Funktionen",
                        dialogue: [
                            "👨‍🏫 Eine quadratische Funktion hat die Form f(x) = ax² + bx + c",
                            "📍 Scheitelpunkt: Der höchste oder tiefste Punkt der Parabel",
                            "🎯 Nullstellen: Wo die Parabel die x-Achse schneidet",
                            "📐 Scheitelpunktform: f(x) = a(x - h)² + k",
                            "Der Parameter 'a' bestimmt Öffnung: a > 0 nach oben, a < 0 nach unten",
                            "Lass uns diese Eigenschaften erkunden! 🔍"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Scheitelpunkt bestimmen",
                        dialogue: [],
                        example: {
                            problem: "f(x) = x² - 4x + 3",
                            solution: "S(2, -1)",
                            steps: [
                                "Scheitelpunkt-Formel: x_s = -b/(2a)",
                                "Hier: a = 1, b = -4, also x_s = 4/2 = 2",
                                "y-Koordinate: f(2) = 4 - 8 + 3 = -1",
                                "Scheitelpunkt: S(2, -1)"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
            'function-transformations': {
                title: "Funktions-Transformationen Meistern",
                description: "Lerne Verschiebungen, Streckungen und Spiegelungen von Funktionen",
                steps: [
                    {
                        type: 'introduction',
                        title: "Willkommen zu den Transformationen!",
                        dialogue: [
                            "👨‍🏫 Heute verwandeln wir Funktionen wie Zauberer!",
                            "Transformationen verschieben, strecken und spiegeln Funktionen.",
                            "Mit wenigen Regeln kannst du jede Funktion nach Belieben verändern.",
                            "Das ist wie Funktions-Origami - elegant und mächtig! ✨"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "Die vier Grundtransformationen",
                        dialogue: [
                            "👨‍🏫 Es gibt vier Hauptarten von Transformationen:",
                            "↕️ Vertikale Verschiebung: f(x) + d",
                            "↔️ Horizontale Verschiebung: f(x + c)",
                            "📏 Vertikale Streckung: a·f(x)",
                            "🪞 Spiegelungen: -f(x) oder f(-x)",
                            "Jede Transformation hat ihre eigene Wirkung auf den Graphen! 🎨"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Verschiebung verstehen",
                        dialogue: [],
                        example: {
                            problem: "f(x) = x² → g(x) = (x - 2)² + 3",
                            solution: "2 nach rechts, 3 nach oben",
                            steps: [
                                "Ausgangsfunktion: f(x) = x²",
                                "Horizontale Verschiebung: (x - 2) bedeutet 2 nach rechts",
                                "Vertikale Verschiebung: +3 bedeutet 3 nach oben",
                                "Ergebnis: 2 Einheiten rechts, 3 Einheiten hoch"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
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
                        dialogue: [],
                        example: {
                            problem: "(a + b)²",
                            solution: "a² + 2ab + b²",
                            steps: [
                                "Erkenne die Struktur: (a + b)²",
                                "Wende Formel an: a² + 2ab + b²",
                                "Erstes Glied: a²",
                                "Mittleres Glied: 2ab",
                                "Letztes Glied: b²"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Jetzt bist du dran!",
                        dialogue: [],
                        initialMessage: [
                            "👨‍🏫 Perfekt! Jetzt versuch du es mal.",
                            "Löse die allgemeine Form: (a + b)²"
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
                        dialogue: [],
                        example: {
                            problem: "(a - b)²",
                            solution: "a² - 2ab + b²",
                            steps: [
                                "Erkenne die Struktur: (a - b)²",
                                "Wende Formel an: a² - 2ab + b²",
                                "Erstes Glied: a²",
                                "Mittleres Glied: -2ab (negativ!)",
                                "Letztes Glied: b²"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Übung zur zweiten Formel",
                        dialogue: [],
                        initialMessage: [
                            "👨‍🏫 Zeit für eine weitere Übung!",
                            "Löse die allgemeine Form: (a - b)²"
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
                        dialogue: [],
                        example: {
                            problem: "(a + b)(a - b)",
                            solution: "a² - b²",
                            steps: [
                                "Erkenne die Struktur: (a + b)(a - b)",
                                "Wende Formel an: a² - b²",
                                "Erstes Glied: a²",
                                "Zweites Glied: -b²",
                                "Das mittlere Glied fällt weg!"
                            ]
                        },
                        action: 'practice'
                    },
                    {
                        type: 'practice',
                        title: "Letzte Übung!",
                        dialogue: [],
                        initialMessage: [
                            "👨‍🏫 Zum Abschluss eine Aufgabe zur dritten Formel:",
                            "Löse die allgemeine Form: (a + b)(a - b)"
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
            },
            'square-roots': {
                title: "Wurzelrechnung Meistern",
                description: "Lerne Wurzeln zu vereinfachen, zu kombinieren und Wurzelgleichungen zu lösen",
                steps: [
                    {
                        type: 'introduction',
                        title: "Willkommen zur Wurzel-Akademie!",
                        dialogue: [
                            "🌳 Grüße, junger Mathematiker! Ich bin Professor Radicus.",
                            "Heute tauchen wir tief in die Wurzeln der Mathematik ein!",
                            "Wurzeln sind wie die Fundamente eines Baumes - sie geben Stabilität.",
                            "Lass uns gemeinsam diese natürlichen mathematischen Strukturen erforschen! 🌱"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "Was sind Wurzeln?",
                        dialogue: [
                            "🌳 Eine Wurzel ist die Umkehrung des Potenzierens.",
                            "√16 = 4, weil 4² = 16",
                            "📏 Wurzelgesetze: √(a·b) = √a · √b",
                            "📏 √(a/b) = √a / √b",
                            "🔧 Vereinfachung: √18 = √(9·2) = 3√2",
                            "Diese Gesetze helfen uns, komplexe Wurzeln zu vereinfachen! 🍃"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Wurzeln vereinfachen",
                        dialogue: [],
                        example: {
                            problem: "√72",
                            solution: "6√2",
                            steps: [
                                "Zerlege 72 in Primfaktoren: 72 = 36 · 2",
                                "Erkenne perfekte Quadrate: 36 = 6²",
                                "Wende Wurzelgesetz an: √72 = √(36·2) = √36 · √2",
                                "Vereinfache: √36 = 6",
                                "Ergebnis: 6√2"
                            ]
                        },
                        action: 'practice'
                    }
                ]
            },
            'power-laws': {
                title: "Potenzgesetze Erobern",
                description: "Lerne die Potenzgesetze und werde zum Exponential-Piraten",
                steps: [
                    {
                        type: 'introduction',
                        title: "Ahoy, Matrose!",
                        dialogue: [
                            "🏴‍☠️ Ahoy! Kapitän Potentius hier, bereit für ein mathematisches Abenteuer!",
                            "Heute segeln wir durch die stürmischen Gewässer der Potenzgesetze!",
                            "Diese mächtigen Gesetze sind wie Schätze - einmal gefunden, machen sie dich reich!",
                            "Bereit, die Geheimnisse der Exponenten zu plündern? ⚓"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'theory',
                        title: "Die Potenzgesetze-Schatzkarte",
                        dialogue: [
                            "🏴‍☠️ Hier sind die wertvollsten Schätze der Potenzgesetze:",
                            "⚔️ Produktregel: a^m · a^n = a^(m+n)",
                            "🗡️ Quotientenregel: a^m / a^n = a^(m-n)",
                            "🛡️ Potenzregel: (a^m)^n = a^(m·n)",
                            "💎 Negative Exponenten: a^(-n) = 1/a^n",
                            "🏆 Nullexponent: a^0 = 1",
                            "Mit diesen Waffen bist du unbesiegbar! ⚡"
                        ],
                        action: 'continue'
                    },
                    {
                        type: 'example',
                        title: "Potenzgesetze in Aktion",
                        dialogue: [],
                        example: {
                            problem: "2³ · 2⁵",
                            solution: "2⁸ = 256",
                            steps: [
                                "Erkenne gleiche Basen: 2³ · 2⁵",
                                "Wende Produktregel an: a^m · a^n = a^(m+n)",
                                "Addiere Exponenten: 3 + 5 = 8",
                                "Ergebnis: 2⁸",
                                "Berechne: 2⁸ = 256"
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
                                <span id="tutorialProgress">Schritt 1 von 9</span>
                            </div>
                        </div>
                        <div class="tutorial-header-controls">
                            <button class="theme-toggle-btn" onclick="tutorialSystem.toggleTheme()" title="Theme wechseln">
                                <span class="theme-icon">${this.isDarkMode ? '☀️' : '🌙'}</span>
                            </button>
                            <button class="tutorial-close" onclick="tutorialSystem.exitTutorial()">✕</button>
                        </div>
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
            // Show green screen flash effect
            this.showSuccessFlash();
            
            feedback.innerHTML = `
                <div class="feedback-correct">
                    ✅ Richtig! Sehr gut gemacht!
                    <div class="explanation">${step.problem.explanation}</div>
                </div>
            `;
            
            // Enable next button and mark step as solved
            const nextBtn = document.getElementById('tutorialNextBtn');
            nextBtn.disabled = false;
            nextBtn.textContent = 'Weiter →';
            
            // Disable answer input to prevent further changes
            document.getElementById('tutorialAnswer').disabled = true;
            
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
                <div class="success-text">RICHTIG!</div>
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
