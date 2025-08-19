# Phase 2.1: Basis-Enemy-System

## Ziel
Implementiere einfache Gegner, die spawnen und dem Spieler folgen.

## Implementierung

- [x] Enemy-Basisklasse erstellen
- [x] Einfache Enemy-Sprites (Rechtecke mit Farben) implementieren
- [x] Enemy-Spawning-System einrichten
- [x] Basis-AI: Verfolge den Spieler
- [x] Kollisionserkennung zwischen Spieler und Gegnern
- [x] Einfaches Health-System für Gegner
- [x] Enemy-Rendering mit zugewiesener Formel über dem Kopf

## Erwartetes Ergebnis
Gegner spawnen regelmäßig, verfolgen den Spieler und zeigen binomische Formeln über ihren Köpfen an.

## Technische Details
- Enemy-Klasse mit AI-Verhalten
- Spawning-Timer-System
- Vektor-basierte Bewegung zu Spieler
- Text-Rendering für Formeln

## Builds auf
- Phase 1.3 (UI und Formel-System)

## ✅ Implementiert (Vollständig)

### Features umgesetzt:
- **Enemy-Basisklasse**: Vollständige Gegner-Logik mit AI, Health und Rendering
- **Hexagon-Sprites**: Sci-Fi Alien-Design mit rotem Neon-Glow und Pulsing-Effekten
- **EnemySpawner-System**: Intelligentes Spawning alle 3 Sekunden, max 5 Gegner gleichzeitig
- **Smart-AI**: Verfolgt Spieler mit Bewegungs-Noise für natürliches Verhalten
- **Kollisionssystem**: Player vs Enemy mit bidirektionalem Schaden
- **Health-System**: Gegner haben 100 HP, Player hat 100 HP mit visuellen Gesundheitsbalken
- **Formula-Display**: Binomische Formeln erscheinen über Gegnern bei Annäherung (100px Radius)
- **Death-Animations**: Gegner verschwinden mit Fade + Scale Effekt über 1 Sekunde
- **Boundary-Handling**: Gegner prallen von Wänden ab, bleiben im Spielbereich

### AI-Verhalten:
- **Player-Tracking**: Berechnet Richtung zum Spieler alle 100ms
- **Movement-Noise**: Zufällige Abweichung für natürliche Bewegung
- **Physics-based Movement**: Beschleunigung, Geschwindigkeitsbegrenzung, Delta-Time
- **Wall-Bouncing**: Prallen mit reduzierter Geschwindigkeit von Rändern ab
- **Smart-Spawning**: Spawnt mindestens 100px entfernt vom Spieler

### Visual-Design:
- **Hexagon-Form**: 6-eckige Alien-Gegner für Sci-Fi-Atmosphäre
- **Pulsing-Glow**: Dynamische Glow-Intensität für lebendige Effekte
- **Rotation**: Gegner rotieren basierend auf Bewegungsrichtung
- **Health-Bars**: Farbcodierte Gesundheitsanzeige (Grün/Gelb/Rot)
- **Formula-Tooltips**: Elegante schwarze Boxen mit rotem Rand für Formeln

### Combat-System:
- **Collision-Damage**: Player verliert 10 HP, Enemy verliert 25 HP pro Berührung
- **Health-Tracking**: Live-Anzeige der Player-Gesundheit
- **Auto-Respawn**: Player startet mit voller Gesundheit nach Tod (temporär)
- **Enemy-Death**: Gegner verschwinden bei 0 HP mit Animation

### Game-Integration:
- **Non-Blocking**: Enemies laufen parallel zu Formula-System
- **Performance**: Effiziente Rendering-Pipeline und Collision-Detection
- **Debug-Info**: Live-Enemy-Count und Spawn-Timer im Debug-Display
- **Console-Logging**: Spawning und Collision-Events für Debugging

### Controls & Interaction:
- **WASD**: Player-Bewegung (unverändert)
- **SPACE**: Formula-HUD (unverändert)
- **Proximity-Formula**: Nähere dich Gegnern um ihre Formeln zu sehen
- **Auto-Combat**: Berührung löst automatisch Schaden aus

Das Enemy-System ist vollständig funktional und schafft eine dynamische, herausfordernde Spielumgebung. Spieler müssen sich zwischen dem Lösen von Formeln und dem Ausweichen vor Gegnern entscheiden - perfekt für das Rogue-like Konzept!
