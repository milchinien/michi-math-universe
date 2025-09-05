# Boss-State-Machine - Phasen-Management und Übergänge

## State-Machine-Übersicht

### 🔄 Boss-Lebenszyklus
Der Boss durchläuft verschiedene **States** (Zustände), die sein Verhalten und die Spieler-Interaktion bestimmen. Jeder State hat spezifische Regeln und Übergangsbedingungen.

### 📊 State-Diagramm
```
SPAWNING → VULNERABLE → WARNING → ATTACKING → COOLDOWN → VULNERABLE
    ↓                                                         ↑
DEFEATED ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## Detaillierte State-Definitionen

### 🌟 SPAWNING State
#### Zweck:
Boss erscheint und initialisiert sich für den Kampf.

#### Verhalten:
- **Dauer**: 2-3 Sekunden
- **Boss**: Spawn-Animation, wird sichtbar
- **Spieler**: Kann sich bewegen, aber Boss noch nicht angreifen
- **UI**: "Boss erscheint!" Nachricht
- **Audio**: Dramatische Boss-Musik startet

#### Übergangsbedingungen:
- **Nach Spawn-Animation** → VULNERABLE

#### Implementation:
```javascript
SPAWNING: {
    enter() {
        this.playSpawnAnimation();
        this.showBossMessage("Ein mächtiger Gegner erscheint!");
        this.startBossMusic();
        this.spawnTimer = 2000; // 2 Sekunden
    },
    
    update(deltaTime) {
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.setState('VULNERABLE');
        }
    },
    
    canPlayerAttack: false,
    canPlayerMove: true
}
```

### 🎯 VULNERABLE State
#### Zweck:
Boss kann angegriffen werden, Spieler löst Formeln.

#### Verhalten:
- **Dauer**: Unbegrenzt (bis Formel gelöst oder Angriff startet)
- **Boss**: Idle-Animation, wartend
- **Spieler**: Kann Formel-Eingabe öffnen und Boss angreifen
- **UI**: Formel-Interface verfügbar
- **Audio**: Ruhige Kampf-Musik

#### Übergangsbedingungen:
- **Formel korrekt gelöst** → Boss nimmt Schaden, bleibt VULNERABLE
- **Boss-HP = 0** → DEFEATED
- **Angriffs-Timer abgelaufen** → WARNING

#### Implementation:
```javascript
VULNERABLE: {
    enter() {
        this.enableFormulaInput();
        this.showVulnerableIndicator();
        this.startAttackTimer(); // Zufällige Zeit bis nächster Angriff
    },
    
    update(deltaTime) {
        this.updateAttackTimer(deltaTime);
        if (this.shouldStartAttack()) {
            this.setState('WARNING');
        }
    },
    
    onFormulaCorrect() {
        this.takeDamage();
        if (this.hp <= 0) {
            this.setState('DEFEATED');
        }
        // Bleibt in VULNERABLE für nächste Formel
    },
    
    canPlayerAttack: true,
    canPlayerMove: true
}
```

### ⚠️ WARNING State
#### Zweck:
3-Sekunden Warnung vor Boss-Angriff.

#### Verhalten:
- **Dauer**: Exakt 3 Sekunden
- **Boss**: Angriffs-Vorbereitung, Aura-Effekte
- **Spieler**: Kann noch schnell Formel abschließen
- **UI**: Countdown-Warnung, rote Bildschirm-Ränder
- **Audio**: Warnung-Sounds, Musik wird intensiver

#### Übergangsbedingungen:
- **Nach 3 Sekunden** → ATTACKING
- **Boss-HP = 0 während Warning** → DEFEATED

#### Implementation:
```javascript
WARNING: {
    enter() {
        this.warningTimer = 3000; // 3 Sekunden
        this.showWarningEffects();
        this.startWarningCountdown();
        this.playWarningSound();
    },
    
    update(deltaTime) {
        this.warningTimer -= deltaTime;
        this.updateWarningCountdown(this.warningTimer);
        
        if (this.warningTimer <= 0) {
            this.setState('ATTACKING');
        }
    },
    
    onFormulaCorrect() {
        // Formel kann noch abgeschlossen werden
        this.takeDamage();
        if (this.hp <= 0) {
            this.setState('DEFEATED');
            return;
        }
        // Warnung läuft weiter
    },
    
    canPlayerAttack: true, // Noch möglich
    canPlayerMove: true
}
```

### 🔥 ATTACKING State
#### Zweck:
Boss führt Angriffsmuster aus, ist unverwundbar.

#### Verhalten:
- **Dauer**: 10-30 Sek (Tag) / 30-60 Sek (Nacht)
- **Boss**: Angriffsmuster-Animation, unverwundbar
- **Spieler**: Kann sich bewegen, aber Boss nicht angreifen
- **UI**: Formel-Eingabe wird geschlossen/unterbrochen
- **Audio**: Intensive Angriffs-Musik und Effekte

#### Übergangsbedingungen:
- **Nach Angriffsdauer** → COOLDOWN
- **Niemals** → DEFEATED (Boss ist unverwundbar)

#### Implementation:
```javascript
ATTACKING: {
    enter() {
        this.closeFormulaInput();
        this.interruptActiveFormula();
        this.selectAttackPattern();
        this.startAttackPattern();
        this.makeInvulnerable();
    },
    
    update(deltaTime) {
        this.updateAttackPattern(deltaTime);
        this.attackTimer -= deltaTime;
        
        if (this.attackTimer <= 0) {
            this.setState('COOLDOWN');
        }
    },
    
    interruptActiveFormula() {
        if (this.player.isInFormulaInput) {
            this.player.loseLife(1);
            this.showInterruptionFeedback();
        }
    },
    
    canPlayerAttack: false,
    canPlayerMove: true
}
```

### 😴 COOLDOWN State
#### Zweck:
Kurze Pause nach Angriff, bevor Boss wieder verwundbar wird.

#### Verhalten:
- **Dauer**: 1-2 Sekunden
- **Boss**: Angriff-Ende-Animation, wird wieder normal
- **Spieler**: Kann sich bewegen, aber Boss noch nicht angreifen
- **UI**: Bereit-Machen für nächste Formel-Phase
- **Audio**: Musik beruhigt sich wieder

#### Übergangsbedingungen:
- **Nach Cooldown-Zeit** → VULNERABLE

#### Implementation:
```javascript
COOLDOWN: {
    enter() {
        this.cooldownTimer = 1500; // 1.5 Sekunden
        this.endAttackPattern();
        this.playRecoveryAnimation();
    },
    
    update(deltaTime) {
        this.cooldownTimer -= deltaTime;
        if (this.cooldownTimer <= 0) {
            this.setState('VULNERABLE');
        }
    },
    
    canPlayerAttack: false,
    canPlayerMove: true
}
```

### 🏆 DEFEATED State
#### Zweck:
Boss wurde besiegt, Kampf ist vorbei.

#### Verhalten:
- **Dauer**: 3-5 Sekunden (Death-Animation)
- **Boss**: Defeat-Animation, verschwindet
- **Spieler**: Kann sich bewegen, Kampf ist vorbei
- **UI**: Victory-Screen, Belohnungen anzeigen
- **Audio**: Victory-Musik, Boss-Death-Sound

#### Übergangsbedingungen:
- **Nach Death-Animation** → Boss wird entfernt, normale Wellen weitermachen

#### Implementation:
```javascript
DEFEATED: {
    enter() {
        this.playDeathAnimation();
        this.showVictoryMessage();
        this.giveRewards();
        this.playVictoryMusic();
        this.deathTimer = 4000; // 4 Sekunden
    },
    
    update(deltaTime) {
        this.deathTimer -= deltaTime;
        if (this.deathTimer <= 0) {
            this.removeBoss();
            this.returnToNormalWaves();
        }
    },
    
    canPlayerAttack: false,
    canPlayerMove: true
}
```

## State-Transition-System

### 🔧 State-Manager Klasse
```javascript
class BossStateMachine {
    constructor(boss) {
        this.boss = boss;
        this.currentState = null;
        this.states = {
            SPAWNING: new SpawningState(boss),
            VULNERABLE: new VulnerableState(boss),
            WARNING: new WarningState(boss),
            ATTACKING: new AttackingState(boss),
            COOLDOWN: new CooldownState(boss),
            DEFEATED: new DefeatedState(boss)
        };
    }
    
    setState(newStateName) {
        // Exit current state
        if (this.currentState) {
            this.currentState.exit();
        }
        
        // Enter new state
        this.currentState = this.states[newStateName];
        this.currentState.enter();
        
        console.log(`Boss State: ${newStateName}`);
    }
    
    update(deltaTime) {
        if (this.currentState) {
            this.currentState.update(deltaTime);
        }
    }
}
```

### 🎮 State-Interface
```javascript
class BossState {
    constructor(boss) {
        this.boss = boss;
    }
    
    enter() { /* Override in subclasses */ }
    exit() { /* Override in subclasses */ }
    update(deltaTime) { /* Override in subclasses */ }
    
    // Event handlers
    onFormulaCorrect() { /* Override if needed */ }
    onFormulaIncorrect() { /* Override if needed */ }
    onPlayerDamage() { /* Override if needed */ }
}
```

## Timing-Management

### ⏱️ Angriffs-Timer-System
```javascript
class AttackTimingSystem {
    constructor(gameMode) {
        this.gameMode = gameMode; // 'day' oder 'night'
        this.baseAttackInterval = gameMode === 'day' ? 15000 : 25000; // ms
        this.randomVariation = 0.3; // ±30% Variation
    }
    
    calculateNextAttackTime() {
        const base = this.baseAttackInterval;
        const variation = base * this.randomVariation;
        const randomOffset = (Math.random() - 0.5) * 2 * variation;
        return base + randomOffset;
    }
    
    calculateAttackDuration(bossLevel) {
        if (this.gameMode === 'day') {
            return 10000 + (bossLevel * 2000); // 10-30 Sekunden
        } else {
            return 30000 + (bossLevel * 3000); // 30-60 Sekunden
        }
    }
}
```

### 🔄 State-Persistence
```javascript
// Boss-State für Debugging und Wiederherstellung
class BossStateTracker {
    saveState() {
        return {
            currentState: this.stateMachine.currentState.name,
            hp: this.boss.hp,
            attackTimer: this.attackTimer,
            formulasCompleted: this.formulasCompleted
        };
    }
    
    loadState(savedState) {
        this.boss.hp = savedState.hp;
        this.attackTimer = savedState.attackTimer;
        this.formulasCompleted = savedState.formulasCompleted;
        this.stateMachine.setState(savedState.currentState);
    }
}
```

## Error-Handling und Edge-Cases

### 🛡️ State-Validation
```javascript
validateStateTransition(fromState, toState) {
    const validTransitions = {
        SPAWNING: ['VULNERABLE'],
        VULNERABLE: ['WARNING', 'DEFEATED'],
        WARNING: ['ATTACKING', 'DEFEATED'],
        ATTACKING: ['COOLDOWN'],
        COOLDOWN: ['VULNERABLE'],
        DEFEATED: []
    };
    
    if (!validTransitions[fromState].includes(toState)) {
        console.error(`Invalid state transition: ${fromState} → ${toState}`);
        return false;
    }
    return true;
}
```

### 🔧 Recovery-Mechanismen
- **State-Corruption**: Automatischer Reset zu VULNERABLE
- **Timer-Overflow**: Automatische State-Progression
- **Player-Disconnect**: Pause aller Timer
- **Performance-Issues**: Reduzierte Update-Frequenz

Diese State-Machine stellt sicher, dass Boss-Kämpfe vorhersagbar, fair und technisch robust ablaufen, während sie gleichzeitig spannende und herausfordernde Gameplay-Momente schaffen.
