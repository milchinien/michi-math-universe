/**
 * FORMEL-FURY-SHOOTER - FORMULA SYSTEM
 * Handles all mathematical formula generation, validation, and scoring
 * Phase 4.2: Modulare Struktur
 */

class FormulaSystem {
    constructor() {
        this.currentFormula = null;
        this.currentSolution = null;
        this.score = 0;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        
        // Combo system
        this.combo = 0;
        this.maxCombo = 0;
        this.comboStartTime = 0;
        this.comboTimeLimit = 10000; // 10 seconds per combo
        this.lastAnswerTime = 0;
        
        // Scoring system
        this.baseScore = 100;
        this.comboMultiplier = 1.5;
        this.speedBonus = 50;
        this.combatBonus = 50;
        
        // UI Elements
        this.formulaHUD = document.getElementById('formulaHUD');
        this.formulaDisplay = document.getElementById('formulaDisplay');
        this.formulaInput = document.getElementById('formulaInput');
        this.feedbackDisplay = document.getElementById('feedbackDisplay');
        // Score displays removed - using high score display instead
        
        // Initialize high score
        this.highScore = this.loadHighScore();
        
        // Additional UI elements
        this.comboElement = document.getElementById('comboValue');
        this.comboMaxElement = document.getElementById('comboMaxValue');
        this.comboTimerElement = document.getElementById('comboTimer');
        this.highScoreElement = document.getElementById('highScoreValue');
        
        this.setupEventListeners();
        this.generateFormula();
        this.startComboTimer();
        this.updateHighScoreDisplay();
        
        // Initialize timeout tracking
        this.nextFormulaTimeout = null;
        
        // Boss system integration
        this.currentWave = 1;
        this.currentBossStage = 0;
        this.totalBossStages = 0;
        this.isBossMode = false;
    }

    setupEventListeners() {
        // Enter key to submit answer
        this.formulaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
        
        // Add micro-shake and audio feedback on formula input
        this.formulaInput.addEventListener('input', (e) => {
            // Trigger micro-shake screen effect when typing
            if (window.gameEngine && window.gameEngine.screenEffects) {
                window.gameEngine.screenEffects.onFormulaInput();
            }
            
            // Trigger keypress audio feedback
            if (window.gameEngine && window.gameEngine.audioManager) {
                window.gameEngine.audioManager.onFormulaKeyPress();
            }
        });
    }

    generateFormula() {
        // Check if we're in boss mode first - Updated for new Boss System
        if (window.gameEngine && window.gameEngine.waveSystem && window.gameEngine.waveSystem.bossManager) {
            const bossManager = window.gameEngine.waveSystem.bossManager;
            
            if (bossManager.isBossActive()) {
                const boss = bossManager.currentBoss;
                const formulaSystem = boss.formulaSystem;
                
                // Get formula from boss system
                if (formulaSystem.currentFormula) {
                    return formulaSystem.currentFormula;
                } else {
                    // Generate new formula through boss system
                    formulaSystem.generateNextFormula();
                    return formulaSystem.currentFormula || this.generateBinomialFormula();
                }
            }
        }
        
        // Fallback to old boss mode check
        if (this.isBossMode) {
            return this.generateBossFormula();
        }
        
        // Get selected math topics from the math topics system
        const selectedTopics = this.getSelectedMathTopics();
        const availableTypes = this.getFormulaTypesFromTopics(selectedTopics);
        
        if (availableTypes.length === 0) {
            console.warn('⚠️ No formula types available, falling back to binomial formulas');
            const fallbackTypes = this.getBinomialFormulaTypes();
            const selectedType = fallbackTypes[Math.floor(Math.random() * fallbackTypes.length)];
            return this.generateFormulaByType(selectedType);
        }
        
        const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        console.log(`🧮 Formula generation - Selected topics: ${selectedTopics.map(t => t.name).join(', ')}`);
        console.log(`🧮 Available types: ${availableTypes.length}, Selected: ${selectedType}`);
        
        return this.generateFormulaByType(selectedType);
    }

    getSelectedMathTopics() {
        // Get selected topics from the math topics system
        if (window.mathTopicsSystem) {
            return window.mathTopicsSystem.getCurrentFormulaTypes();
        }
        
        // Fallback to binomial formulas if system not available
        return [{
            id: 'binomial-formulas',
            name: 'Binomische Formeln',
            category: 'algebra',
            difficulty: 1
        }];
    }
    
    getFormulaTypesFromTopics(selectedTopics) {
        const availableTypes = [];
        
        for (const topic of selectedTopics) {
            switch (topic.id) {
                case 'binomial-formulas':
                    availableTypes.push(...this.getBinomialFormulaTypes());
                    break;
                case 'quadratic-equations':
                    availableTypes.push(...this.getQuadraticEquationTypes());
                    break;
                case 'polynomial-division':
                    availableTypes.push(...this.getPolynomialDivisionTypes());
                    break;
                case 'linear-functions':
                    availableTypes.push(...this.getLinearFunctionTypes());
                    break;
                case 'quadratic-functions':
                    availableTypes.push(...this.getQuadraticFunctionTypes());
                    break;
                case 'exponential-functions':
                    availableTypes.push(...this.getExponentialFunctionTypes());
                    break;
                case 'prime-factorization':
                    availableTypes.push(...this.getPrimeFactorizationTypes());
                    break;
                case 'gcd-lcm':
                    availableTypes.push(...this.getGcdLcmTypes());
                    break;
                default:
                    console.warn(`⚠️ Unknown topic: ${topic.id}`);
                    break;
            }
        }
        
        return availableTypes;
    }
    
    getBinomialFormulaTypes() {
        return [
            'expansion_plus',        // (a+b)² = a² + 2ab + b²
            'expansion_minus',       // (a-b)² = a² - 2ab + b²
            'difference_squares',    // (a+b)(a-b) = a² - b²
            'factorization_difference', // a² - b² = (a+b)(a-b)
            'factorization_square'   // a² + 2ab + b² = (a+b)²
        ];
    }
    
    getQuadraticEquationTypes() {
        return [
            'quadratic_factorizable',
            'quadratic_pq_formula',
            'quadratic_abc_formula',
            'quadratic_no_solution'
        ];
    }
    
    getPolynomialDivisionTypes() {
        // TODO: Implement polynomial division formula types
        return [];
    }
    
    getLinearFunctionTypes() {
        // TODO: Implement linear function formula types
        return [];
    }
    
    getQuadraticFunctionTypes() {
        // TODO: Implement quadratic function formula types
        return [];
    }

    getExponentialFunctionTypes() {
        // TODO: Implement exponential function formula types
        return [];
    }
    
    getPrimeFactorizationTypes() {
        // TODO: Implement prime factorization formula types
        return [];
    }
    
    getGcdLcmTypes() {
        // TODO: Implement GCD/LCM formula types
        return [];
    }

    getAvailableFormulaTypes(allTypes) {
        // Legacy method - now using topic-based selection
        return this.getBinomialFormulaTypes();
    }

    generateFormulaByType(type) {
        // Get difficulty settings to adjust formula complexity
        const complexityLevel = this.getDifficultyComplexity();
        const showExplanations = this.shouldShowExplanations();
        
        let formula, solution, choices;
        
        switch (type) {
            case 'expansion_plus':
                return this.generateExpansionPlus();
            case 'expansion_minus':
                return this.generateExpansionMinus();
            case 'difference_squares':
                return this.generateDifferenceSquares();
            case 'factorization_difference':
                return this.generateFactorizationDifference();
            case 'factorization_square':
                return this.generateFactorizationSquare();
            case 'quadratic_factorizable':
                return this.generateQuadraticFactorizable();
            case 'quadratic_pq_formula':
                return this.generateQuadraticPQFormula();
            case 'quadratic_abc_formula':
                return this.generateQuadraticABCFormula();
            case 'quadratic_no_solution':
                return this.generateQuadraticNoSolution();
            default:
                console.log(`⚠️ Unknown formula type: ${type}, defaulting to expansion_plus`);
                return this.generateExpansionPlus();
        }
    }

    generateExpansionPlus() {
        const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        // Generate coefficients with variety
        const a = this.generateCoefficient();
        const b = this.generateConstant();
        
        const formulaText = `(${this.formatTerm(a, variable)} + ${b})²`;
        
        // Calculate solution: (ax + b)² = a²x² + 2abx + b²
        const coefficient_x2 = a * a;
        const coefficient_x = 2 * a * b;
        const constant = b * b;
        
        const formula = {
            text: formulaText,
            type: 'expansion_plus',
            typeName: 'Erste Binomische Formel',
            a: a,
            b: b,
            variable: variable,
            difficulty: this.calculateDifficulty(a, b, coefficient_x2, coefficient_x, constant),
            coefficients: {
                x2: coefficient_x2,
                x: coefficient_x,
                constant: constant
            }
        };
        
        formula.solutions = this.generateExpansionSolutions(coefficient_x2, coefficient_x, constant, variable);
        this.updateCurrentFormula(formula);
        return formula;
    }

    generateExpansionMinus() {
        const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        const a = this.generateCoefficient();
        const b = this.generateConstant();
        
        const formulaText = `(${this.formatTerm(a, variable)} - ${b})²`;
        
        // Calculate solution: (ax - b)² = a²x² - 2abx + b²
        const coefficient_x2 = a * a;
        const coefficient_x = -2 * a * b; // Negative middle term
        const constant = b * b;
        
        const formula = {
            text: formulaText,
            type: 'expansion_minus',
            typeName: 'Zweite Binomische Formel',
            a: a,
            b: b,
            variable: variable,
            difficulty: this.calculateDifficulty(a, b, coefficient_x2, Math.abs(coefficient_x), constant),
            coefficients: {
                x2: coefficient_x2,
                x: coefficient_x,
                constant: constant
            }
        };
        
        formula.solutions = this.generateExpansionSolutions(coefficient_x2, coefficient_x, constant, variable);
        this.updateCurrentFormula(formula);
        return formula;
    }

    generateDifferenceSquares() {
        const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        const a = this.generateCoefficient();
        const b = this.generateConstant();
        
        const formulaText = `(${this.formatTerm(a, variable)} + ${b})(${this.formatTerm(a, variable)} - ${b})`;
        
        // Calculate solution: (ax + b)(ax - b) = a²x² - b²
        const coefficient_x2 = a * a;
        const coefficient_x = 0; // No middle term
        const constant = -(b * b); // Negative constant
        
        const formula = {
            text: formulaText,
            type: 'difference_squares',
            typeName: 'Dritte Binomische Formel',
            a: a,
            b: b,
            variable: variable,
            difficulty: this.calculateDifficulty(a, b, coefficient_x2, 0, Math.abs(constant)) + 0.5,
            coefficients: {
                x2: coefficient_x2,
                x: coefficient_x,
                constant: constant
            }
        };
        
        formula.solutions = this.generateDifferenceSquaresSolutions(coefficient_x2, constant, variable);
        this.updateCurrentFormula(formula);
        return formula;
    }

    generateFactorizationDifference() {
        const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        const a = this.generateCoefficient();
        const b = this.generateConstant();
        
        // Start with expanded form: a²x² - b²
        const coefficient_x2 = a * a;
        const constant = -(b * b);
        
        const formulaText = `${this.formatQuadraticTerm(coefficient_x2, variable)} ${constant >= 0 ? '+' : '-'} ${Math.abs(constant)}`;
        
        const formula = {
            text: formulaText,
            type: 'factorization_difference',
            typeName: 'Faktorisierung (Differenz)',
            a: a,
            b: b,
            variable: variable,
            difficulty: this.calculateDifficulty(a, b, coefficient_x2, 0, Math.abs(constant)) + 1.0,
            coefficients: {
                x2: coefficient_x2,
                x: 0,
                constant: constant
            }
        };
        
        formula.solutions = this.generateFactorizationDifferenceSolutions(a, b, variable);
        this.updateCurrentFormula(formula);
        return formula;
    }

    generateFactorizationSquare() {
        const variables = ['x', 'y', 'z', 'a', 'b', 'c'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        const a = this.generateCoefficient();
        const b = this.generateConstant();
        
        // Start with expanded form: a²x² + 2abx + b²
        const coefficient_x2 = a * a;
        const coefficient_x = 2 * a * b;
        const constant = b * b;
        
        const formulaText = this.formatExpandedForm(coefficient_x2, coefficient_x, constant, variable);
        
        const formula = {
            text: formulaText,
            type: 'factorization_square',
            typeName: 'Faktorisierung (Quadrat)',
            a: a,
            b: b,
            variable: variable,
            difficulty: this.calculateDifficulty(a, b, coefficient_x2, coefficient_x, constant) + 1.5,
            coefficients: {
                x2: coefficient_x2,
                x: coefficient_x,
                constant: constant
            }
        };
        
    }

    formatQuadraticTerm(coefficient, variable) {
        if (coefficient === 1) return `${variable}²`;
        return `${coefficient}${variable}²`;
    }

    formatExpandedForm(a2, a1, a0, variable) {
        let result = this.formatQuadraticTerm(a2, variable);
        
        if (a1 > 0) {
            result += ` + ${a1 === 1 ? variable : a1 + variable}`;
        } else if (a1 < 0) {
            result += ` - ${Math.abs(a1) === 1 ? variable : Math.abs(a1) + variable}`;
        }
        
        if (a0 > 0) {
            result += ` + ${a0}`;
        } else if (a0 < 0) {
            result += ` - ${Math.abs(a0)}`;
        }
        
        return result;
    }

    updateCurrentFormula(formula) {
        this.currentFormula = formula;
        this.currentSolution = formula.solutions;
        
        console.log(`Generated ${formula.typeName}:`, formula.text);
        console.log('Expected solutions:', formula.solutions);
    }

    calculateDifficulty(a, b, x2, x, constant) {
        // Base difficulty factors
        let difficulty = 1;
        
        // Coefficient complexity
        if (a >= 4 || b >= 4) difficulty += 0.5;
        if (a >= 6 || b >= 8) difficulty += 0.5;
        
        // Result complexity  
        if (x2 >= 16) difficulty += 0.5; // 4² or higher
        if (Math.abs(x) >= 20) difficulty += 0.5; // Large middle terms
        if (Math.abs(constant) >= 25) difficulty += 0.5; // Large constants
        
        // Very complex combinations
        if (x2 > 25 && Math.abs(x) > 30) difficulty += 1;
        if (Math.abs(constant) > 36) difficulty += 0.5;
        
        return Math.max(1, Math.min(5, difficulty)); // Extended range 1-5
    }

    // Helper methods for difficulty integration
    getDifficultyComplexity() {
        if (window.mathTopicsSystem) {
            return window.mathTopicsSystem.getComplexityLevel();
        }
        return 2; // Default medium complexity
    }
    
    shouldShowExplanations() {
        if (window.mathTopicsSystem) {
            return window.mathTopicsSystem.shouldShowExplanations();
        }
        return false; // Default no explanations
    }

    // Helper methods for coefficient generation with difficulty adjustment
    generateCoefficient() {
        const complexityLevel = this.getDifficultyComplexity();
        
        switch (complexityLevel) {
            case 1: // Tutorial - very simple
                return Math.floor(Math.random() * 2) + 1; // 1-2
            case 2: // Easy - simple
                return Math.floor(Math.random() * 3) + 1; // 1-3
            case 3: // Medium - moderate
                return Math.floor(Math.random() * 5) + 1; // 1-5
            case 4: // Hard - complex
                return Math.floor(Math.random() * 8) + 1; // 1-8
            default:
                return Math.floor(Math.random() * 3) + 1; // Fallback
        }
    }

    generateConstant() {
        const complexityLevel = this.getDifficultyComplexity();
        
        switch (complexityLevel) {
            case 1: // Tutorial - very simple
                return Math.floor(Math.random() * 3) + 1; // 1-3
            case 2: // Easy - simple
                return Math.floor(Math.random() * 4) + 1; // 1-4
            case 3: // Medium - moderate
                return Math.floor(Math.random() * 6) + 1; // 1-6
            case 4: // Hard - complex
                return Math.floor(Math.random() * 10) + 1; // 1-10
            default:
                return Math.floor(Math.random() * 4) + 1; // Fallback
        }
    }

    // Helper method for formatting terms in formulas
    formatTerm(coefficient, variable) {
        if (coefficient === 1) {
            return variable;
        } else if (coefficient === -1) {
            return `-${variable}`;
        } else {
            return `${coefficient}${variable}`;
        }
    }

    startComboTimer() {
        this.comboStartTime = Date.now();
        this.lastAnswerTime = Date.now();
    }

    updateComboTimer() {
        const currentTime = Date.now();
        const timeSinceLastAnswer = currentTime - this.lastAnswerTime;
        
        // Break combo if too much time has passed
        if (this.combo > 0 && timeSinceLastAnswer > this.comboTimeLimit) {
            this.breakCombo('Zeit abgelaufen!');
        }
    }

    incrementCombo() {
        this.combo++;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        this.lastAnswerTime = Date.now();
        
        // Show combo feedback
        if (this.combo >= 3) {
            this.showComboFeedback();
        }
    }

    breakCombo(reason = 'Falsche Antwort!') {
        if (this.combo >= 3) {
            this.showFeedback(`Combo gebrochen! ${reason} (Combo: ${this.combo})`, false);
        }
        this.combo = 0;
        this.lastAnswerTime = Date.now();
    }

    showComboFeedback() {
        const comboMessages = {
            3: 'Combo x3! 🔥',
            5: 'Combo x5! ⚡',
            7: 'Combo x7! 💫',
            10: 'Combo x10! 🌟',
            15: 'MEGA COMBO x15! 💥',
            20: 'ULTRA COMBO x20! 🚀'
        };
        
        const message = comboMessages[this.combo] || `Combo x${this.combo}! 🎯`;
        this.showFeedback(message, true);
    }

    calculateScore(formula, timeTaken, isCombat = false) {
        let score = this.baseScore;
        
        // Difficulty multiplier
        score *= formula.difficulty;
        
        // Combo multiplier
        if (this.combo >= 3) {
            score *= (1 + (this.combo - 1) * 0.2); // 20% per combo level after 3
        }
        
        // Speed bonus (under 5 seconds = bonus)
        if (timeTaken < 5000) {
            const speedMultiplier = Math.max(0.5, (5000 - timeTaken) / 5000);
            score += this.speedBonus * speedMultiplier;
        }
        
        // Combat bonus
        if (isCombat) {
            score += this.combatBonus;
        }
        
        return Math.round(score);
    }

    generateExpansionSolutions(a2, a1, a0, variable) {
        const solutions = [];
        
        // Standard expanded form
        const x2_term = a2 === 1 ? `${variable}²` : `${a2}${variable}²`;
        const x2_term_alt = a2 === 1 ? `${variable}^2` : `${a2}${variable}^2`;
        
        // Handle middle term
        let middleTerm = '';
        let middleTermAlt = '';
        if (a1 > 0) {
            middleTerm = a1 === 1 ? ` + ${variable}` : ` + ${a1}${variable}`;
            middleTermAlt = middleTerm;
        } else if (a1 < 0) {
            middleTerm = Math.abs(a1) === 1 ? ` - ${variable}` : ` - ${Math.abs(a1)}${variable}`;
            middleTermAlt = middleTerm;
        }
        
        // Handle constant term
        const constantTerm = a0 > 0 ? ` + ${a0}` : (a0 < 0 ? ` - ${Math.abs(a0)}` : '');
        
        // Main solutions
        solutions.push(`${x2_term}${middleTerm}${constantTerm}`);
        solutions.push(`${x2_term_alt}${middleTermAlt}${constantTerm}`);
        
        // With spaces
        const x2_spaced = a2 === 1 ? `${variable}²` : `${a2} ${variable}²`;
        const x2_spaced_alt = a2 === 1 ? `${variable}^2` : `${a2} ${variable}^2`;
        
        let middleSpaced = '';
        if (a1 > 0) {
            middleSpaced = a1 === 1 ? ` + ${variable}` : ` + ${a1} ${variable}`;
        } else if (a1 < 0) {
            middleSpaced = Math.abs(a1) === 1 ? ` - ${variable}` : ` - ${Math.abs(a1)} ${variable}`;
        }
        
        solutions.push(`${x2_spaced}${middleSpaced}${constantTerm}`);
        solutions.push(`${x2_spaced_alt}${middleSpaced}${constantTerm}`);
        
        // Different order variations
        if (a1 !== 0 && a0 !== 0) {
            solutions.push(`${x2_term}${constantTerm}${middleTerm}`);
            solutions.push(`${x2_term_alt}${constantTerm}${middleTermAlt}`);
        }
        
        return [...new Set(solutions)]; // Remove duplicates
    }

    generateDifferenceSquaresSolutions(a2, constant, variable) {
        const solutions = [];
        
        // a²x² - b² format
        const x2_term = a2 === 1 ? `${variable}²` : `${a2}${variable}²`;
        const x2_term_alt = a2 === 1 ? `${variable}^2` : `${a2}${variable}^2`;
        
        const constantTerm = constant < 0 ? ` - ${Math.abs(constant)}` : ` + ${constant}`;
        
        solutions.push(`${x2_term}${constantTerm}`);
        solutions.push(`${x2_term_alt}${constantTerm}`);
        
        // With spaces
        const x2_spaced = a2 === 1 ? `${variable}²` : `${a2} ${variable}²`;
        const x2_spaced_alt = a2 === 1 ? `${variable}^2` : `${a2} ${variable}^2`;
        
        solutions.push(`${x2_spaced}${constantTerm}`);
        solutions.push(`${x2_spaced_alt}${constantTerm}`);
        
        return [...new Set(solutions)];
    }

    generateFactorizationDifferenceSolutions(a, b, variable) {
        const solutions = [];
        
        // (ax + b)(ax - b) format
        const term1 = a === 1 ? variable : `${a}${variable}`;
        const term2 = a === 1 ? variable : `${a}${variable}`;
        
        solutions.push(`(${term1} + ${b})(${term2} - ${b})`);
        solutions.push(`(${term2} - ${b})(${term1} + ${b})`); // Commutative
        
        // With spaces
        solutions.push(`(${term1} + ${b}) (${term2} - ${b})`);
        solutions.push(`(${term2} - ${b}) (${term1} + ${b})`);
        
        // Alternative notation
        solutions.push(`(${term1}+${b})(${term2}-${b})`);
        solutions.push(`(${term2}-${b})(${term1}+${b})`);
        
        return [...new Set(solutions)];
    }

    generateFactorizationSquareSolutions(a, b, variable) {
        const solutions = [];
        
        // Determine if it's (a+b)² or (a-b)² based on middle term
        const middleCoeff = 2 * a * b;
        const term = a === 1 ? variable : `${a}${variable}`;
        
        if (middleCoeff > 0) {
            // (ax + b)²
            solutions.push(`(${term} + ${b})²`);
            solutions.push(`(${term} + ${b})^2`);
            solutions.push(`(${term}+${b})²`);
            solutions.push(`(${term}+${b})^2`);
        } else {
            // (ax - b)²
            solutions.push(`(${term} - ${b})²`);
            solutions.push(`(${term} - ${b})^2`);
            solutions.push(`(${term}-${b})²`);
            solutions.push(`(${term}-${b})^2`);
        }
        
        return [...new Set(solutions)];
    }

    normalizeExpression(expr) {
        return expr
            .toLowerCase()
            .replace(/\s+/g, '') // Remove all spaces
            .replace(/\^2/g, '²') // Convert ^2 to ²
            .replace(/\*([xyzabc])/g, '$1') // Remove * before variables
            .replace(/([xyzabc])\*/g, '$1') // Remove * after variables
            .replace(/\+\+/g, '+') // Fix double plus
            .replace(/--/g, '+') // Convert -- to +
            .replace(/\+-/g, '-') // Convert +- to -
            .replace(/-\+/g, '-') // Convert -+ to -
            .replace(/\(\s*([^)]+)\s*\)/g, '($1)') // Normalize parentheses
            .replace(/([0-9])([xyzabc])/g, '$1$2') // Ensure no space between coefficient and variable
            .replace(/\+1([xyzabc])/g, '+$1') // Simplify +1x to +x
            .replace(/^1([xyzabc])/g, '$1') // Simplify 1x to x at start
            .replace(/-1([xyzabc])/g, '-$1'); // Simplify -1x to -x
    }

    validateAnswer(userInput) {
        const normalizedInput = this.normalizeExpression(userInput);
        
        // Direct solution match
        for (let solution of this.currentSolution) {
            const normalizedSolution = this.normalizeExpression(solution);
            if (normalizedInput === normalizedSolution) {
                return true;
            }
        }
        
        // Type-specific validation
        return this.validateByFormulaType(normalizedInput);
    }

    validateByFormulaType(normalizedInput) {
        const formula = this.currentFormula;
        
        switch (formula.type) {
            case 'expansion_plus':
            case 'expansion_minus':
                return this.validateExpansion(normalizedInput);
            case 'difference_squares':
                return this.validateDifferenceSquares(normalizedInput);
            case 'factorization_difference':
                return this.validateFactorizationDifference(normalizedInput);
            case 'factorization_square':
                return this.validateFactorizationSquare(normalizedInput);
            case 'quadratic_factorizable':
            case 'quadratic_pq_formula':
            case 'quadratic_abc_formula':
                return this.validateQuadraticSolutions(normalizedInput);
            case 'quadratic_no_solution':
                return this.validateQuadraticNoSolution(normalizedInput);
            default:
                return this.validateExpansion(normalizedInput);
        }
    }

    validateExpansion(normalizedInput) {
        const { x2, x, constant } = this.currentFormula.coefficients;
        const variable = this.currentFormula.variable;
        
        // Check for all required terms
        const hasX2Term = this.checkQuadraticTerm(normalizedInput, x2, variable);
        const hasXTerm = x === 0 || this.checkLinearTerm(normalizedInput, x, variable);
        const hasConstantTerm = constant === 0 || this.checkConstantTerm(normalizedInput, constant);
        
        return hasX2Term && hasXTerm && hasConstantTerm;
    }

    validateDifferenceSquares(normalizedInput) {
        const { x2, constant } = this.currentFormula.coefficients;
        const variable = this.currentFormula.variable;
        
        const hasX2Term = this.checkQuadraticTerm(normalizedInput, x2, variable);
        const hasConstantTerm = this.checkConstantTerm(normalizedInput, constant);
        
        // Should NOT have linear term
        const hasNoLinearTerm = !this.hasLinearTerm(normalizedInput, variable);
        
        return hasX2Term && hasConstantTerm && hasNoLinearTerm;
    }

    validateFactorizationDifference(normalizedInput) {
        const { a, b } = this.currentFormula;
        const variable = this.currentFormula.variable;
        
        // Should be in form (ax+b)(ax-b) or (ax-b)(ax+b)
        const pattern1 = this.normalizeExpression(`(${a === 1 ? variable : a + variable}+${b})(${a === 1 ? variable : a + variable}-${b})`);
        const pattern2 = this.normalizeExpression(`(${a === 1 ? variable : a + variable}-${b})(${a === 1 ? variable : a + variable}+${b})`);
        
        return normalizedInput === pattern1 || normalizedInput === pattern2;
    }

    validateFactorizationSquare(normalizedInput) {
        const { a, b } = this.currentFormula;
        const variable = this.currentFormula.variable;
        const middleCoeff = 2 * a * b;
        
        if (middleCoeff > 0) {
            // Should be (ax+b)²
            const pattern = this.normalizeExpression(`(${a === 1 ? variable : a + variable}+${b})²`);
            return normalizedInput === pattern;
        } else {
            // Should be (ax-b)²
            const pattern = this.normalizeExpression(`(${a === 1 ? variable : a + variable}-${b})²`);
            return normalizedInput === pattern;
        }
    }

    // Helper validation methods
    checkQuadraticTerm(input, expectedCoeff, variable) {
        if (expectedCoeff === 1) {
            return input.includes(`${variable}²`) || input.includes(`${variable}^2`);
        }
        return input.includes(`${expectedCoeff}${variable}²`) || input.includes(`${expectedCoeff}${variable}^2`);
    }

    checkLinearTerm(input, expectedCoeff, variable) {
        if (expectedCoeff === 1) {
            return input.includes(`+${variable}`) || input.includes(`${variable}+`) || 
                   (input.includes(variable) && !input.includes(`${variable}²`) && !input.includes(`${variable}^2`));
        } else if (expectedCoeff === -1) {
            return input.includes(`-${variable}`);
        } else if (expectedCoeff > 0) {
            return input.includes(`+${expectedCoeff}${variable}`) || input.includes(`${expectedCoeff}${variable}`);
        } else {
            return input.includes(`${expectedCoeff}${variable}`) || input.includes(`-${Math.abs(expectedCoeff)}${variable}`);
        }
    }

    checkConstantTerm(input, expectedConstant) {
        if (expectedConstant > 0) {
            return input.includes(`+${expectedConstant}`) || input.includes(`${expectedConstant}`);
        } else {
            return input.includes(`${expectedConstant}`) || input.includes(`-${Math.abs(expectedConstant)}`);
        }
    }

    hasLinearTerm(input, variable) {
        // Check if input contains linear term (variable without ²)
        const regex = new RegExp(`\\d*${variable}(?![²^2])`, 'g');
        return regex.test(input);
    }

    submitAnswer() {
        const userAnswer = this.formulaInput.value.trim();
        
        if (!userAnswer) {
            this.showFeedback('Bitte gib eine Antwort ein!', false);
            return;
        }
        
        const isCorrect = this.validateAnswer(userAnswer);
        
        if (isCorrect) {
            this.correctAnswers++;
            this.score += 100;
            this.showFeedback('Richtig! +100 Punkte', true);
        } else {
            this.incorrectAnswers++;
            this.score = Math.max(0, this.score - 25);
            this.showFeedback(`Falsch! Richtig wäre: ${this.currentSolution[0]}`, false);
        }
        
        this.updateScoreDisplay();
        this.formulaInput.value = '';
        
        // Clear any existing timeout to prevent race conditions
        if (this.nextFormulaTimeout) {
            clearTimeout(this.nextFormulaTimeout);
        }
        
        // Generate new formula after a delay
        this.nextFormulaTimeout = setTimeout(() => {
            this.generateFormula();
            this.showFormulaHUD();
            this.nextFormulaTimeout = null;
        }, 2000);
    }

    skipFormula() {
        this.showFeedback(`Übersprungen! Lösung war: ${this.currentSolution[0]}`, false);
        this.formulaInput.value = '';
        
        // Clear any existing timeout to prevent race conditions
        if (this.nextFormulaTimeout) {
            clearTimeout(this.nextFormulaTimeout);
        }
        
        this.nextFormulaTimeout = setTimeout(() => {
            this.generateFormula();
            this.showFormulaHUD();
            this.nextFormulaTimeout = null;
        }, 1500);
    }

    showFeedback(message, isCorrect) {
        this.feedbackDisplay.textContent = message;
        this.feedbackDisplay.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect';
        this.feedbackDisplay.style.display = 'block';
        
        setTimeout(() => {
            this.feedbackDisplay.style.display = 'none';
        }, 2000);
    }

    updateScoreDisplay() {
        // Score display removed - only update high score display
        
        // Update combo display
        this.updateComboDisplay();
        
        // Check and update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        // Update high score display which now includes current score
        this.updateHighScoreDisplay();
    }

    updateComboDisplay() {
        // Update combo counter
        if (this.comboElement) {
            this.comboElement.textContent = this.combo;
            this.comboElement.className = this.combo >= 3 ? 'combo-active' : '';
        }
        
        // Update max combo
        if (this.comboMaxElement) {
            this.comboMaxElement.textContent = this.maxCombo;
        }
        
        // Update combo timer
        if (this.comboTimerElement && this.combo > 0) {
            const currentTime = Date.now();
            const timeSinceLastAnswer = currentTime - this.lastAnswerTime;
            const timeLeft = Math.max(0, this.comboTimeLimit - timeSinceLastAnswer);
            const secondsLeft = Math.ceil(timeLeft / 1000);
            
            this.comboTimerElement.textContent = secondsLeft;
            this.comboTimerElement.style.color = secondsLeft <= 3 ? '#ff0000' : '#ffff00';
        } else if (this.comboTimerElement) {
            this.comboTimerElement.textContent = '10';
            this.comboTimerElement.style.color = '#ffff00';
        }
    }

    updateHighScoreDisplay() {
        if (this.highScoreElement) {
            // Show both current score and high score
            this.highScoreElement.textContent = `Score: ${this.score} | High: ${this.highScore}`;
        }
    }

    loadHighScore() {
        const saved = localStorage.getItem('formelFuryHighScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        localStorage.setItem('formelFuryHighScore', this.highScore.toString());
        this.updateHighScoreDisplay();
    }

    showFormulaHUD() {
        // Clear any pending timeout when manually showing HUD
        if (this.nextFormulaTimeout) {
            clearTimeout(this.nextFormulaTimeout);
            this.nextFormulaTimeout = null;
        }
        
        // Enhanced display with formula type
        const displayText = `${this.currentFormula.typeName}: ${this.currentFormula.text}`;
        this.formulaDisplay.innerHTML = `
            <div class="formula-type">${this.currentFormula.typeName}</div>
            <div class="formula-text">${this.currentFormula.text}</div>
            <div class="formula-hint">
                <small>Löse die binomische Formel!</small>
            </div>
        `;
        this.formulaHUD.style.display = 'block';
        this.formulaInput.focus();
    }

    hideFormulaHUD() {
        this.formulaHUD.style.display = 'none';
    }

    toggleFormulaHUD() {
        if (this.formulaHUD.style.display === 'none' || !this.formulaHUD.style.display) {
            this.showFormulaHUD();
        } else {
            this.hideFormulaHUD();
        }
    }

    // Boss system methods
    generateFormulaWithDifficulty(targetDifficulty) {
        // Generate formula with specific difficulty for boss stages
        let attempts = 0;
        let formula = null;
        
        while (attempts < 10) {
            formula = this.generateFormula();
            if (Math.abs(formula.difficulty - targetDifficulty) < 0.5) {
                break;
            }
            attempts++;
        }
        
        console.log(`🐉 Boss formula generated (difficulty ${formula.difficulty.toFixed(1)}): ${formula.text}`);
        return formula;
    }
    
    setBossMode(isActive, currentStage = 0, totalStages = 0) {
        this.isBossMode = isActive;
        this.currentBossStage = currentStage;
        this.totalBossStages = totalStages;
        
        if (isActive) {
            console.log(`🐉 Boss mode activated: Stage ${currentStage}/${totalStages}`);
        } else {
            console.log(`🐉 Boss mode deactivated`);
        }
    }
    
    advanceBossStage() {
        if (this.isBossMode && this.currentBossStage < this.totalBossStages) {
            this.currentBossStage++;
            console.log(`🐉 Boss stage advanced: ${this.currentBossStage}/${this.totalBossStages}`);
            return true;
        }
        return false;
    }
    
    onBossFormulaCorrect() {
        // Handle correct boss formula answer - Updated for new Boss System
        if (window.gameEngine && window.gameEngine.waveSystem && window.gameEngine.waveSystem.bossManager) {
            const bossManager = window.gameEngine.waveSystem.bossManager;
            
            if (bossManager.isBossActive()) {
                const boss = bossManager.currentBoss;
                const formulaSystem = boss.formulaSystem;
                
                // Let the boss formula system handle the validation
                const result = formulaSystem.validateAnswer(this.currentFormula, this.lastPlayerAnswer);
                
                if (result.isCorrect) {
                    // Update boss progress
                    boss.formulasSolved++;
                    
                    // Check if boss is defeated
                    if (boss.formulasSolved >= boss.formulasRequired) {
                        boss.defeat();
                        return true;
                    }
                    
                    // Generate next formula for boss
                    formulaSystem.generateNextFormula();
                    
                    // Update formula display with boss formula
                    if (formulaSystem.currentFormula) {
                        this.currentFormula = formulaSystem.currentFormula;
                        this.updateFormulaDisplay();
                    }
                }
                
                return true;
            }
        }
        
        // Fallback to old system if new boss system not available
        if (this.isBossMode && window.game && window.game.enemySpawner && window.game.enemySpawner.currentBoss) {
            const boss = window.game.enemySpawner.currentBoss;
            
            // Boss takes damage and advances stage
            const defeated = boss.takeDamage(100);
            
            if (!defeated) {
                // Boss advances to next stage
                const hasNextStage = boss.nextStage();
                if (hasNextStage) {
                    // Update formula system with new boss formula
                    this.currentFormula = boss.assignedFormula;
                    this.updateFormulaDisplay();
                } else {
                    // Boss defeated
                    if (window.game.enemySpawner) {
                        window.game.enemySpawner.onBossDefeated();
                    }
                    this.setBossMode(false);
                }
            } else {
                // Boss defeated
                if (window.game.enemySpawner) {
                    window.game.enemySpawner.onBossDefeated();
                }
                this.setBossMode(false);
            }
            
            return true;
        }
        return false;
    }
    
    updateFormulaDisplay() {
        if (this.formulaDisplay && this.currentFormula) {
            this.formulaDisplay.innerHTML = `
                <div class="formula-type">${this.currentFormula.typeName}</div>
                <div class="formula-text">${this.currentFormula.text}</div>
                <div class="formula-hint">
                    <small>${this.isBossMode ? `Boss Stage ${this.currentBossStage}/${this.totalBossStages}` : 'Löse die binomische Formel!'}</small>
                </div>
            `;
        }
    }

    getDebugInfo() {
        return {
            currentFormula: this.currentFormula ? this.currentFormula.text : 'None',
            score: this.score,
            highScore: this.highScore,
            combo: this.combo,
            maxCombo: this.maxCombo,
            correct: this.correctAnswers,
            incorrect: this.incorrectAnswers,
            bossMode: this.isBossMode,
            bossStage: `${this.currentBossStage}/${this.totalBossStages}`
        };
    }

    // Quadratic Equation Generation Methods
    generateQuadraticFactorizable() {
        const variables = ['x'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        // Start with very simple integer roots for beginners
        const simpleRoots = [
            [1, 2], [1, 3], [2, 3], [1, 4], [2, 4], 
            [0, 1], [0, 2], [0, 3], [-1, 1], [-1, 2],
            [-2, 1], [-1, 0], [1, -1], [2, -1]
        ];
        
        const [x1, x2] = simpleRoots[Math.floor(Math.random() * simpleRoots.length)];
        
        // Calculate coefficients: (x - x1)(x - x2) = x² - (x1+x2)x + x1*x2
        const b = -(x1 + x2);
        const c = x1 * x2;
        
        const formulaText = this.formatQuadraticEquation(1, b, c, variable);
        
        const formula = {
            text: formulaText,
            type: 'quadratic_factorizable',
            typeName: 'Quadratische Gleichung (Faktorisierbar)',
            variable: variable,
            solutions: [x1, x2].sort((a, b) => a - b), // Sort solutions
            difficulty: this.calculateQuadraticDifficulty(1, b, c),
            coefficients: { a: 1, b: b, c: c }
        };
        
        this.updateCurrentFormula(formula);
        return formula;
    }

    generateQuadraticPQFormula() {
        const variables = ['x'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        // Use predefined simple p-q combinations that result in nice solutions
        const simplePQ = [
            { p: -3, q: 2 },   // x² - 3x + 2 = 0 → x₁=1, x₂=2
            { p: -5, q: 6 },   // x² - 5x + 6 = 0 → x₁=2, x₂=3
            { p: -4, q: 3 },   // x² - 4x + 3 = 0 → x₁=1, x₂=3
            { p: -1, q: 0 },   // x² - x = 0 → x₁=0, x₂=1
            { p: -2, q: 0 },   // x² - 2x = 0 → x₁=0, x₂=2
            { p: 1, q: 0 },    // x² + x = 0 → x₁=-1, x₂=0
            { p: -4, q: 4 },   // x² - 4x + 4 = 0 → x₁=x₂=2 (doppelte Lösung)
            { p: -6, q: 9 }    // x² - 6x + 9 = 0 → x₁=x₂=3 (doppelte Lösung)
        ];
        
        const { p, q } = simplePQ[Math.floor(Math.random() * simplePQ.length)];
        
        // Calculate discriminant: (p/2)² - q
        const discriminant = (p/2) * (p/2) - q;
        
        // Calculate solutions: x = -p/2 ± √((p/2)² - q)
        let solutions = [];
        if (discriminant > 0) {
            const x1 = -p/2 + Math.sqrt(discriminant);
            const x2 = -p/2 - Math.sqrt(discriminant);
            solutions = [x1, x2].sort((a, b) => a - b);
        } else if (discriminant === 0) {
            const x = -p/2;
            solutions = [x]; // Doppelte Lösung
        }
        
        const formulaText = this.formatQuadraticEquation(1, p, q, variable);
        
        const formula = {
            text: formulaText,
            type: 'quadratic_pq_formula',
            typeName: 'Quadratische Gleichung (p-q-Formel)',
            variable: variable,
            solutions: solutions,
            difficulty: this.calculateQuadraticDifficulty(1, p, q) + 0.5,
            coefficients: { a: 1, b: p, c: q }
        };
        
        this.updateCurrentFormula(formula);
        return formula;
    }

    generateQuadraticABCFormula() {
        const variables = ['x'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        // Use predefined simple abc combinations that result in nice solutions
        const simpleABC = [
            { a: 2, b: -6, c: 4 },   // 2x² - 6x + 4 = 0 → x₁=1, x₂=2
            { a: 2, b: -4, c: 2 },   // 2x² - 4x + 2 = 0 → x₁=x₂=1
            { a: 3, b: -6, c: 3 },   // 3x² - 6x + 3 = 0 → x₁=x₂=1
            { a: 2, b: -2, c: 0 },   // 2x² - 2x = 0 → x₁=0, x₂=1
            { a: 2, b: 2, c: 0 },    // 2x² + 2x = 0 → x₁=-1, x₂=0
            { a: 2, b: -8, c: 6 },   // 2x² - 8x + 6 = 0 → x₁=1, x₂=3
            { a: 3, b: -9, c: 6 }    // 3x² - 9x + 6 = 0 → x₁=1, x₂=2
        ];
        
        const { a, b, c } = simpleABC[Math.floor(Math.random() * simpleABC.length)];
        
        // Calculate discriminant: b² - 4ac
        const discriminant = b * b - 4 * a * c;
        
        // Calculate solutions: x = (-b ± √(b² - 4ac)) / (2a)
        let solutions = [];
        if (discriminant > 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            solutions = [x1, x2].sort((a, b) => a - b);
        } else if (discriminant === 0) {
            const x = -b / (2 * a);
            solutions = [x]; // Doppelte Lösung
        }
        
        const formulaText = this.formatQuadraticEquation(a, b, c, variable);
        
        const formula = {
            text: formulaText,
            type: 'quadratic_abc_formula',
            typeName: 'Quadratische Gleichung (abc-Formel)',
            variable: variable,
            solutions: solutions,
            difficulty: this.calculateQuadraticDifficulty(a, b, c) + 1.0,
            coefficients: { a: a, b: b, c: c }
        };
        
        this.updateCurrentFormula(formula);
        return formula;
    }

    generateQuadraticNoSolution() {
        const variables = ['x'];
        const variable = variables[Math.floor(Math.random() * variables.length)];
        
        // Use simple predefined combinations with no real solutions
        const noSolutionCombos = [
            { a: 1, b: 2, c: 5 },   // x² + 2x + 5 = 0 (Diskriminante: 4 - 20 = -16)
            { a: 1, b: 1, c: 1 },   // x² + x + 1 = 0 (Diskriminante: 1 - 4 = -3)
            { a: 2, b: 2, c: 3 },   // 2x² + 2x + 3 = 0 (Diskriminante: 4 - 24 = -20)
            { a: 1, b: 0, c: 1 },   // x² + 1 = 0 (Diskriminante: 0 - 4 = -4)
            { a: 1, b: 4, c: 5 }    // x² + 4x + 5 = 0 (Diskriminante: 16 - 20 = -4)
        ];
        
        const { a, b, c } = noSolutionCombos[Math.floor(Math.random() * noSolutionCombos.length)];
        
        const formulaText = this.formatQuadraticEquation(a, b, c, variable);
        
        const formula = {
            text: formulaText,
            type: 'quadratic_no_solution',
            typeName: 'Quadratische Gleichung (Keine reellen Lösungen)',
            variable: variable,
            solutions: [], // No real solutions
            difficulty: this.calculateQuadraticDifficulty(a, b, c) + 0.8,
            coefficients: { a: a, b: b, c: c }
        };
        
        this.updateCurrentFormula(formula);
        return formula;
    }

    formatQuadraticEquation(a, b, c, variable) {
        let equation = '';
        
        // Format ax²
        if (a === 1) {
            equation += `${variable}²`;
        } else if (a === -1) {
            equation += `-${variable}²`;
        } else {
            equation += `${a}${variable}²`;
        }
        
        // Format bx
        if (b > 0) {
            equation += ` + ${b === 1 ? '' : b}${variable}`;
        } else if (b < 0) {
            equation += ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}${variable}`;
        }
        
        // Format c
        if (c > 0) {
            equation += ` + ${c}`;
        } else if (c < 0) {
            equation += ` - ${Math.abs(c)}`;
        }
        
        return equation + ' = 0';
    }

    calculateQuadraticDifficulty(a, b, c) {
        let difficulty = 1.0;
        
        // Higher coefficients = higher difficulty
        difficulty += Math.abs(a) * 0.1;
        difficulty += Math.abs(b) * 0.1;
        difficulty += Math.abs(c) * 0.1;
        
        // Negative coefficients add complexity
        if (b < 0) difficulty += 0.2;
        if (c < 0) difficulty += 0.2;
        
        return Math.min(difficulty, 3.0); // Cap at 3.0
    }

    validateQuadraticSolutions(normalizedInput) {
        const solutions = this.currentFormula.solutions;
        
        if (solutions.length === 0) {
            // No solution case
            return this.validateQuadraticNoSolution(normalizedInput);
        }
        
        const userSolutions = this.parseQuadraticSolutions(normalizedInput);
        
        if (userSolutions.length !== solutions.length) {
            return false;
        }
        
        // Sort both arrays for comparison
        const sortedUser = userSolutions.sort((a, b) => a - b);
        const sortedCorrect = solutions.sort((a, b) => a - b);
        
        // Compare with tolerance
        const tolerance = 0.01;
        return sortedUser.every((userSol, index) => 
            Math.abs(userSol - sortedCorrect[index]) < tolerance
        );
    }

    validateQuadraticNoSolution(normalizedInput) {
        const noSolutionPatterns = [
            /keine.*lösung/i,
            /keine.*reell/i,
            /unmöglich/i,
            /nicht.*lösbar/i,
            /∅/,
            /leere.*menge/i,
            /no.*solution/i
        ];
        
        return noSolutionPatterns.some(pattern => pattern.test(normalizedInput));
    }

    parseQuadraticSolutions(input) {
        const solutions = [];
        
        // Remove spaces and common prefixes
        let cleanInput = input.replace(/\s/g, '').toLowerCase();
        cleanInput = cleanInput.replace(/x[₁₂]?=/g, '');
        cleanInput = cleanInput.replace(/lösung[en]?:/g, '');
        
        // Try different separation patterns
        const separators = [',', ';', '∨', 'oder', 'and', '&'];
        let parts = [cleanInput];
        
        for (const sep of separators) {
            if (cleanInput.includes(sep)) {
                parts = cleanInput.split(sep);
                break;
            }
        }
        
        // Parse each part as a number
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed) {
                const num = parseFloat(trimmed);
                if (!isNaN(num)) {
                    solutions.push(num);
                }
            }
        }
        
        return solutions;
    }
}
