# Funktions-Graffiti Implementation Plan

## Game Overview
A creative puzzle game where players are "Asymptote", a street artist whose spray can draws rational function graphs. Players construct functions by dragging components into numerator/denominator to hit target points while avoiding forbidden zones (asymptotes).

## Technical Architecture

### Core Technologies
- **Single HTML File**: All HTML, CSS, and JavaScript embedded
- **Math.js**: For function evaluation and symbolic math operations
- **Canvas API**: For drawing coordinate system, function graphs, and visual effects
- **Drag & Drop API**: For component manipulation in the function builder
- **CSS Animations**: For graffiti spray effects and UI transitions

### Game Components

#### 1. Function Builder System
- **Component Library**: Draggable mathematical components
  - Linear factors: `(x-a)`, `(x+a)` 
  - Quadratic factors: `x^2`, `(x-a)^2`
  - Constants: `1`, `2`, `3`, `-1`, etc.
  - Coefficients: `2x`, `3x`, `-x`
- **Numerator/Denominator Slots**: Drop zones for building the function
- **Real-time Preview**: Function updates as components are added/removed
- **Validation**: Ensures mathematical validity (no division by zero at target points)

#### 2. Graph Rendering Engine
- **Coordinate System**: Scalable grid with axis labels
- **Function Plotting**: High-resolution curve drawing with asymptote detection
- **Visual Effects**: 
  - Graffiti spray animation as function is drawn
  - Glowing target points
  - Red forbidden zones (vertical/horizontal lines)
  - Particle effects for successful hits

#### 3. Level System
- **Progressive Difficulty**: 
  - Level 1-3: Simple targets, basic asymptotes
  - Level 4-6: Multiple targets, horizontal asymptotes
  - Level 7-9: Removable discontinuities required
  - Level 10+: Complex combinations
- **Target Types**:
  - Regular points: Function must pass through
  - Forbidden zones: Vertical lines (poles) and horizontal lines (limits)
  - Special points: Require removable discontinuities

#### 4. Game Mechanics
- **Construction Phase**: Player builds function using drag & drop
- **Spray Phase**: Animated drawing of the function graph
- **Validation**: Check if all targets hit and no forbidden zones crossed
- **Scoring**: Based on efficiency (fewer components = higher score)

## Implementation Structure

### HTML Structure
```html
<!DOCTYPE html>
<html>
<head>
  <!-- Meta, title, embedded CSS -->
</head>
<body>
  <div class="game-container">
    <div class="header">
      <!-- Title, score, level -->
    </div>
    <div class="main-area">
      <div class="canvas-container">
        <canvas id="gameCanvas"></canvas>
        <!-- Target points and forbidden zones overlay -->
      </div>
      <div class="function-builder">
        <div class="component-library">
          <!-- Draggable math components -->
        </div>
        <div class="function-display">
          <div class="numerator-slot"></div>
          <div class="denominator-slot"></div>
        </div>
        <div class="controls">
          <!-- Spray, clear, hint buttons -->
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

### CSS Design
- **Graffiti Theme**: Dark urban background, neon colors, street art fonts
- **Drag & Drop Visual Feedback**: Hover states, drop zones highlighting
- **Animations**: Spray effects, particle systems, smooth transitions
- **Responsive Design**: Adapts to different screen sizes

### JavaScript Architecture

#### Core Classes
```javascript
class FunctionBuilder {
  // Manages numerator/denominator construction
  // Handles drag & drop operations
  // Validates mathematical correctness
}

class GraphRenderer {
  // Draws coordinate system and function graphs
  // Handles asymptote detection and rendering
  // Creates visual effects (spray, particles)
}

class LevelManager {
  // Defines level objectives and constraints
  // Validates level completion
  // Manages progression and scoring
}

class GameEngine {
  // Coordinates all game systems
  // Handles game state and user interactions
  // Manages animations and timing
}
```

#### Key Features
- **Real-time Function Evaluation**: Using Math.js for accurate calculations
- **Asymptote Detection**: Automatic identification of vertical/horizontal asymptotes
- **Removable Discontinuity Handling**: Special logic for holes in functions
- **Visual Feedback**: Immediate response to player actions

## Level Design Examples

### Level 1: "First Tag"
- **Objective**: Hit point (2, 3)
- **Forbidden**: Vertical line at x = 1
- **Solution**: Simple function like `(x-2)^2 + 3` or `3x/(x-1) + something`

### Level 5: "Under the Bridge"
- **Objective**: Hit points (0, 2) and (3, 1)
- **Forbidden**: Horizontal line at y = 4
- **Solution**: Requires horizontal asymptote management

### Level 8: "The Impossible Tag"
- **Objective**: Hit point (2, 5)
- **Forbidden**: Vertical line at x = 2
- **Solution**: Create removable discontinuity with (x-2) in both numerator and denominator

## User Experience Flow

1. **Level Introduction**: Show target points and forbidden zones
2. **Construction Phase**: Player drags components to build function
3. **Preview**: Real-time graph updates as function changes
4. **Spray Action**: Animated drawing of final function
5. **Validation**: Check success/failure with visual feedback
6. **Progression**: Unlock next level or retry current

## Technical Challenges & Solutions

### Challenge 1: Function Evaluation Near Asymptotes
- **Solution**: Use limit calculations and special handling for discontinuities

### Challenge 2: Drag & Drop with Mathematical Validation
- **Solution**: Real-time validation with visual feedback for invalid combinations

### Challenge 3: Smooth Graph Rendering
- **Solution**: Adaptive sampling with higher density near asymptotes

### Challenge 4: Educational Value
- **Solution**: Progressive difficulty with hints explaining mathematical concepts

## Success Metrics
- **Educational**: Players understand how function components affect graphs
- **Engagement**: Compelling progression and creative problem-solving
- **Technical**: Smooth performance and accurate mathematical rendering

## Development Phases
1. **Core Framework**: Basic HTML structure and CSS styling
2. **Function Builder**: Drag & drop system and mathematical validation
3. **Graph Renderer**: Canvas-based plotting with visual effects
4. **Level System**: Progressive challenges and validation logic
5. **Polish**: Animations, sound effects, and user experience refinement

This plan creates an innovative educational game that transforms abstract mathematical concepts into concrete, creative problem-solving challenges.
