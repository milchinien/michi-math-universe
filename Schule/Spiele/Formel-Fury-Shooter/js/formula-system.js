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
    }

    setupEventListeners() {
        // Enter key to submit answer
        this.formulaInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.submitAnswer();
            }
        });
    }

    generateFormula() {
        // Select formula type based on difficulty progression
        const formulaTypes = [
            'expansion_plus',    // (a+b)² = a² + 2ab + b²
            'expansion_minus',   // (a-b)² = a² - 2ab + b²
            'difference_squares', // (a+b)(a-b) = a² - b²
            'factorization_difference', // a² - b² = (a+b)(a-b)
            'factorization_square' // a² + 2ab + b² = (a+b)²
        ];
        
        // Progressive difficulty: start with simple, add complexity over time
        const availableTypes = this.getAvailableFormulaTypes(formulaTypes);
        const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        
        console.log(`🧮 Formula generation - Available types: ${availableTypes.length}, Selected: ${selectedType}`);
        console.log(`🧮 Available formula types:`, availableTypes);
        
        return this.generateFormulaByType(selectedType);
    }

    getAvailableFormulaTypes(allTypes) {
        // All formula types available from the start for better learning variety
        return [
            'expansion_plus',        // (a+b)² = a² + 2ab + b²
            'expansion_minus',       // (a-b)² = a² - 2ab + b²
            'difference_squares',    // (a+b)(a-b) = a² - b²
            'factorization_difference', // a² - b² = (a+b)(a-b)
            'factorization_square'   // a² + 2ab + b² = (a+b)²
        ];
    }

    generateFormulaByType(type) {
        console.log(`🧮 Generating formula of type: ${type}`);
        
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
        
        formula.solutions = this.generateFactorizationSquareSolutions(a, b, variable);
        this.updateCurrentFormula(formula);
        return formula;
    }

    // Helper methods for coefficient generation
    generateCoefficient() {
        // Progressive difficulty based on score
        if (this.score < 500) return Math.floor(Math.random() * 3) + 1; // 1-3
        if (this.score < 1500) return Math.floor(Math.random() * 5) + 1; // 1-5
        return Math.floor(Math.random() * 7) + 1; // 1-7
    }

    generateConstant() {
        if (this.score < 500) return Math.floor(Math.random() * 4) + 1; // 1-4
        if (this.score < 1500) return Math.floor(Math.random() * 6) + 1; // 1-6
        return Math.floor(Math.random() * 10) + 1; // 1-10
    }

    formatTerm(coefficient, variable) {
        if (coefficient === 1) return variable;
        return `${coefficient}${variable}`;
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

    getDebugInfo() {
        return {
            currentFormula: this.currentFormula ? this.currentFormula.text : 'None',
            score: this.score,
            highScore: this.highScore,
            combo: this.combo,
            maxCombo: this.maxCombo,
            correct: this.correctAnswers,
            incorrect: this.incorrectAnswers
        };
    }
}
