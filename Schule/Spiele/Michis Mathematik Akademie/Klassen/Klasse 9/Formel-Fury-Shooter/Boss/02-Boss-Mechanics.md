# Boss-Mechaniken - Angriffsmuster und Verhalten

## Angriffsmuster-System

### 🎯 Grundprinzip
Jeder Boss hat verschiedene **Angriffsmuster**, die in regelmäßigen Abständen aktiviert werden. Während eines Angriffsmusters:
- Boss ist **NICHT angreifbar**
- Aktive Formel-Eingabe wird **sofort unterbrochen**
- Spieler verliert **1 Leben** wenn Formel unterbrochen wird
- Angriff dauert **10-30 Sekunden (Tag)** oder **30-60 Sekunden (Nacht)**

### ⏱️ Timing-System

#### Tag-Modus (Multiple Choice)
- **Angriffsdauer**: 10-30 Sekunden (randomisiert)
- **Pause zwischen Angriffen**: 5-10 Sekunden
- **Grund**: Schnellere Formel-Lösung = kürzere Angriffe

#### Nacht-Modus (Freie Eingabe)
- **Angriffsdauer**: 30-60 Sekunden (randomisiert)
- **Pause zwischen Angriffen**: 10-15 Sekunden
- **Grund**: Längere Formel-Lösung = längere Angriffe

## Angriffsmuster nach Boss-Level

### Welle 10 - "Grundlagen-Prüfer"
#### Muster 1: "Algebra-Wellen"
- **Visuell**: Mathematische Symbole fliegen über den Bildschirm
- **Effekt**: Bildschirm wackelt leicht
- **Dauer**: 10-15 Sek (Tag) / 30-40 Sek (Nacht)

#### Muster 2: "Zahlen-Regen"
- **Visuell**: Zahlen fallen vom Himmel
- **Effekt**: Leichte Bildschirm-Verzerrung
- **Dauer**: 15-20 Sek (Tag) / 40-50 Sek (Nacht)

### Welle 20 - "Fortgeschrittenen-Herausforderer"
#### Muster 1: "Formel-Sturm"
- **Visuell**: Komplette Formeln wirbeln um den Boss
- **Effekt**: Bildschirm pulsiert
- **Dauer**: 12-18 Sek (Tag) / 35-45 Sek (Nacht)

#### Muster 2: "Variable-Chaos"
- **Visuell**: X, Y, Z Variablen explodieren um den Boss
- **Effekt**: Farbverzerrung des Bildschirms
- **Dauer**: 15-22 Sek (Tag) / 40-55 Sek (Nacht)

#### Muster 3: "Binomial-Blitz"
- **Visuell**: Binomische Formeln erscheinen und verschwinden schnell
- **Effekt**: Stroboskop-Effekt
- **Dauer**: 18-25 Sek (Tag) / 45-60 Sek (Nacht)

### Welle 30 - "Meister-Prüfer"
#### Muster 1: "Faktorisierungs-Wirbel"
- **Visuell**: Terme werden live faktorisiert und wieder zusammengesetzt
- **Effekt**: Bildschirm dreht sich leicht
- **Dauer**: 15-25 Sek (Tag) / 40-60 Sek (Nacht)

#### Muster 2: "Polynom-Explosion"
- **Visuell**: Komplexe Polynome explodieren in ihre Faktoren
- **Effekt**: Schockwellen-Effekt
- **Dauer**: 18-28 Sek (Tag) / 45-60 Sek (Nacht)

#### Muster 3: "Gleichungs-Matrix"
- **Visuell**: Matrix aus Gleichungen umhüllt den Boss
- **Effekt**: Matrix-ähnlicher Regen-Effekt
- **Dauer**: 20-30 Sek (Tag) / 50-60 Sek (Nacht)

#### Muster 4: "Algebra-Tornado"
- **Visuell**: Alle mathematischen Symbole wirbeln in einem Tornado
- **Effekt**: Bildschirm wird in Tornado-Bewegung verzerrt
- **Dauer**: 22-30 Sek (Tag) / 55-60 Sek (Nacht)

### Welle 40+ - "Grandmaster-Herausforderung"
#### Muster 1-4: Alle vorherigen Muster (verstärkt)
#### Muster 5: "Mathematik-Apokalypse"
- **Visuell**: Alle mathematischen Konzepte gleichzeitig
- **Effekt**: Komplette Bildschirm-Transformation
- **Dauer**: 25-30 Sek (Tag) / 60 Sek (Nacht)

#### Muster 6: "Formel-Fusion"
- **Visuell**: Verschiedene Formeln verschmelzen zu Super-Formeln
- **Effekt**: Kaleidoskop-Effekt mit Formeln
- **Dauer**: 28-30 Sek (Tag) / 60 Sek (Nacht)

## Angriffsmuster-Auswahl-System

### 🎲 Randomisierung
```javascript
// Pseudo-Code für Muster-Auswahl
function selectAttackPattern(bossLevel) {
    const availablePatterns = getAvailablePatterns(bossLevel);
    const randomPattern = random(availablePatterns);
    const duration = randomizeDuration(gameMode, bossLevel);
    return { pattern: randomPattern, duration: duration };
}
```

### 📈 Progressive Komplexität
- **Frühe Bosse**: Einfache, vorhersagbare Muster
- **Mittlere Bosse**: Mehr Variation, längere Dauer
- **Späte Bosse**: Komplexe Kombinationen, maximale Dauer

### 🔄 Wiederholungs-Vermeidung
- Gleiches Muster nicht 2x hintereinander
- Bei 4+ verfügbaren Mustern: Mindestens 2 verschiedene zwischen Wiederholung

## Unterbrechungs-Mechanik

### ⚠️ Formel-Unterbrechung
```javascript
// Wenn Angriff startet während Formel aktiv ist:
if (player.isInFormulaInput) {
    // 1. Formel-Eingabe sofort schließen
    closeFormulaInput();
    
    // 2. Leben abziehen
    player.loseLife(1);
    
    // 3. Feedback anzeigen
    showInterruptionFeedback("Angriff unterbrochen! -1 Leben");
    
    // 4. Angriffsmuster starten
    startAttackPattern();
}
```

### 💔 Leben-Verlust-Feedback
- **Visuell**: Roter Bildschirm-Flash
- **Audio**: Schaden-Sound
- **Text**: "UNTERBROCHEN! -1 Leben"
- **Dauer**: 1-2 Sekunden Feedback

### 🛡️ Schutz-Mechanik
- **Keine Unterbrechung** wenn Formel gerade **abgeschickt** wurde
- **Grace Period** von 0.5 Sekunden nach Formel-Abschluss
- **Warnung** 3 Sekunden vor Angriff (visueller Countdown)

## Boss-Angriffs-Warnsystem

### ⏰ Countdown-System
```
3 Sekunden vor Angriff:
"⚠️ ANGRIFF IN 3..."

2 Sekunden vor Angriff:
"⚠️ ANGRIFF IN 2..."

1 Sekunde vor Angriff:
"⚠️ ANGRIFF IN 1..."

Angriff startet:
"🔥 ANGRIFF AKTIV!"
```

### 🎨 Visuelle Warnung
- **Boss-Aura**: Boss leuchtet rot auf
- **Bildschirm-Rand**: Roter Rand pulsiert
- **UI-Warnung**: Große Warnung in der Mitte
- **Formel-Feld**: Wird rot umrandet

### 🔊 Audio-Warnung
- **Countdown-Sounds**: Beep bei jeder Sekunde
- **Angriffs-Sound**: Dramatischer Sound bei Angriff-Start
- **Musik-Änderung**: Musik wird intensiver während Angriff

## Technische Implementation-Hinweise

### BossAttackSystem Klasse
```javascript
class BossAttackSystem {
    constructor(boss) {
        this.boss = boss;
        this.currentPattern = null;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.warningTimer = 0;
        this.availablePatterns = [];
    }
    
    // Hauptmethoden:
    update(deltaTime) { /* Timing und State-Updates */ }
    startAttack() { /* Angriff initialisieren */ }
    endAttack() { /* Angriff beenden */ }
    selectPattern() { /* Muster auswählen */ }
    showWarning() { /* Warnung anzeigen */ }
    interruptFormula() { /* Formel unterbrechen */ }
}
```

### Integration mit Boss-States
- **VULNERABLE**: Boss kann angegriffen werden, Formeln lösbar
- **WARNING**: 3-Sekunden Warnung vor Angriff
- **ATTACKING**: Angriffsmuster aktiv, Boss unverwundbar
- **COOLDOWN**: Kurze Pause nach Angriff

Dieses Angriffsmuster-System sorgt für dynamische, herausfordernde Boss-Kämpfe, die den Spieler zwingen, strategisch zu denken und schnell zu handeln, während sie gleichzeitig ihre mathematischen Fähigkeiten unter Beweis stellen.
