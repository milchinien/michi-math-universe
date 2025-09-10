# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a German-language educational mathematics project called "Michis Mathematik Akademie" focused on creating interactive math learning games for students in grades 7-12 (German school system). The main application is a collection of HTML5 Canvas-based educational games that teach various mathematical concepts through gamification.

## Key Architecture

### Main Structure
- **index.html**: Main landing page with game selection for various math games
- **Schule/**: Primary directory containing all educational content
  - **Spiele/**: Contains individual game implementations (HTML5/Canvas games)
  - **Prompts/**: Contains structured prompt templates for game/content creation
  - **Ideen/**: Game ideas and concept documentation
  - **Inhalte/**: Math topic summaries and content overviews
  - **Plan/**: Educational roadmaps and timelines

### Featured Game: Formel-Fury-Shooter
Located in `Schule/Spiele/Michis Mathematik Akademie/Klassen/Klasse 9/Formel-Fury-Shooter/`

**Architecture:**
- **index.html**: Main game entry point with class selection menu
- **js/**: Modular JavaScript game systems
  - `main.js`: Core game initialization
  - `game-engine.js`: Main game loop and rendering
  - `formula-system.js`: Binomial formula validation and generation
  - `enemy-system.js`: Enemy AI and spawning
  - `boss-system.js`: Boss fight mechanics
  - `particle-system.js`: Visual effects
  - Additional systems for shop, upgrades, audio, etc.
- **styles/**: Modular CSS for different game screens
- **Boss/**: Boss system documentation
- **Implementationen/**: Step-by-step implementation guides

## Development Commands

Since this is a static HTML/JavaScript project without a build system:
- Open HTML files directly in browser for testing
- No build/compile commands needed
- Use browser DevTools for debugging

## Content Creation Workflow

The project follows a structured approach for creating new educational content:

1. **Define Topic**: Use `Schule/Prompts/1. Thema definieren.md` template
2. **Generate Ideas**: Use `Schule/Prompts/2. Spiele Ideen.md` for game concepts
3. **Plan Game**: Use `Schule/Prompts/3. Spiel planen.md` for detailed planning
4. **Implementation**: Use `Schule/Prompts/4. Implementatierung planen.md` for technical planning

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5 Canvas
- **Styling**: CSS3 with gradient-heavy visual design
- **Math Validation**: Built-in formula validation systems
- **Storage**: LocalStorage for game progress and settings
- **No external dependencies** for core functionality (pure vanilla implementation)

## Important Notes

- All content is in German language
- Educational focus on German curriculum (Klasse 7-12)
- Games emphasize learning through interaction and gamification
- Binomial formulas (Binomische Formeln) are a core focus area
- Visual design uses purple/blue gradients consistently