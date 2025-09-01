# Phase 2, Schritt 2.1: Dash-Mechanik

## Ziel
Implementierung einer dynamischen Dash/Dodge-Mechanik für aktives, reaktionsschnelles Gameplay.

## Beschreibung
Das Dash-System ermöglicht schnelle, taktische Ausweichmanöver und macht das Gameplay deutlich aktiver. Spieler können sich blitzschnell aus Gefahrensituationen befreien oder aggressiv positionieren.

## Konkrete Implementierung

### 1. Dash-Bewegungssystem
- **DashSystem.js** Klasse für Dash-Mechanik
- Dash in 8 Richtungen (WASD + Diagonalen)
- Feste Dash-Distanz (100-150 Pixel)
- Dash-Geschwindigkeit deutlich höher als normale Bewegung
- Cooldown-System (1-2 Sekunden zwischen Dashes)

### 2. Dash-Input-Handling
- **Doppel-Tastendruck**: Schnelles doppeltes Drücken einer Richtungstaste
- **Shift + Richtung**: Alternative Eingabemethode
- **Maus-Dash**: Rechtsklick + Mausrichtung für präzise Dashes
- **Controller-Support**: Shoulder-Button für Dash

### 3. Dash-Physik und Kollision
- **I-Frames**: Kurze Unverwundbarkeit während Dash (0.2-0.3 Sekunden)
- **Wand-Kollision**: Dash stoppt bei Hindernissen
- **Gegner-Durchdringung**: Dash durch Gegner möglich während I-Frames
- **Momentum-Erhaltung**: Dash-Geschwindigkeit beeinflusst nachfolgende Bewegung

### 4. Visuelle Dash-Effekte
- **Dash-Trail**: Leuchtende Spur während Dash-Bewegung
- **Afterimage**: Kurze Nachbilder des Spielers
- **Partikel-Burst**: Explosionsartiger Partikel-Ausstoß am Start-Punkt
- **Distortion**: Leichte Bildverzerrung um den Spieler während Dash

## Technische Details

### Dash-Parameter
```javascript
// Dash-Konfiguration
{
    distance: 120,           // Dash-Distanz in Pixeln
    duration: 150,           // Dash-Dauer in Millisekunden
    cooldown: 1500,          // Cooldown zwischen Dashes
    iFrames: 200,            // Unverwundbarkeits-Zeit
    trailLength: 8,          // Anzahl Trail-Segmente
    speedMultiplier: 4       // Geschwindigkeits-Multiplikator
}
```

### Dash-Zustandsmaschine
- **Ready**: Dash verfügbar, Cooldown abgelaufen
- **Charging**: Dash wird ausgeführt, Spieler bewegt sich
- **Cooldown**: Dash nicht verfügbar, Timer läuft
- **Blocked**: Dash durch externe Faktoren blockiert

### Integration mit bestehenden Systemen
- **Player-Input**: Erweiterte Eingabe-Erkennung
- **Collision-System**: Spezielle Dash-Kollisions-Behandlung
- **Animation-System**: Dash-Animationen und Übergänge
- **Audio-System**: Dash-Sounds und Feedback

## Gameplay-Mechaniken

### Taktische Verwendung
- **Defensive Dashes**: Ausweichen vor Gegner-Angriffen
- **Offensive Dashes**: Schnelle Positionierung für Angriffe
- **Combo-Dashes**: Dash-Ketten für komplexe Manöver
- **Escape-Dashes**: Flucht aus überwältigenden Situationen

### Dash-Upgrades (Spätere Phasen)
- **Dash-Distanz**: Längere Dash-Reichweite
- **Cooldown-Reduktion**: Häufigere Dashes
- **Multi-Dash**: Mehrere Dashes hintereinander
- **Damage-Dash**: Schaden an durchdrungenen Gegnern

### Risiko-Belohnung-System
- **Perfekte Dashes**: Bonus bei knappen Ausweichmanövern
- **Dash-Combos**: Belohnungen für geschickte Dash-Sequenzen
- **Overuse-Penalty**: Malus bei exzessiver Dash-Nutzung
- **Timing-Rewards**: Bonus für gut getimte Dashes

## Visuelle Ziele
- **Geschwindigkeitsgefühl**: Spieler fühlt sich schnell und agil
- **Spektakuläre Trails**: Beeindruckende visuelle Spuren
- **Flüssige Animation**: Nahtlose Übergänge zwischen Bewegungen
- **Impact-Feedback**: Deutliche visuelle Rückmeldung bei Dash-Start

## Audio-Integration
- **Dash-Sound**: Charakteristischer "Whoosh"-Sound
- **Trail-Audio**: Subtiles Rauschen während Bewegung
- **Cooldown-Audio**: Akustisches Feedback bei Verfügbarkeit
- **Impact-Audio**: Sound bei Wand-Kollisionen

## Testkriterien
- Dash funktioniert in alle 8 Richtungen
- I-Frames bieten zuverlässigen Schutz
- Cooldown-System funktioniert korrekt
- Visuelle Effekte sind beeindruckend aber nicht störend
- Keine Performance-Einbußen bei häufigen Dashes

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 2, Schritt 2.2: Bewegung + Formel-Eingabe**
