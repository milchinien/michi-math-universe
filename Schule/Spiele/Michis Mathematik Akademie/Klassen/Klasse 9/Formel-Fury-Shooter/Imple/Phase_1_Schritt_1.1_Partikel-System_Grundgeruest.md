# Phase 1, Schritt 1.1: Partikel-System Grundgerüst

## Ziel
Implementierung eines leistungsstarken Partikel-Systems als Basis für alle visuellen Effekte im Spiel.

## Beschreibung
Dieses System bildet das Fundament für alle spektakulären visuellen Effekte. Es ermöglicht die Darstellung von Explosionen, Trails, schwebenden Formeln und anderen dynamischen Elementen.

## Konkrete Implementierung

### 1. Partikel-Engine Klasse
- **ParticleSystem.js** erstellen mit Basis-Funktionalität
- Object-Pooling für Performance-Optimierung
- Verschiedene Partikel-Typen (Explosion, Trail, Float, Spark)
- Physik-Simulation (Gravitation, Luftwiderstand, Kollision)

### 2. Formel-Symbol-Partikel
- Mathematische Symbole als Partikel (+, -, ×, ÷, =, x², etc.)
- Spawnen bei richtigen Antworten aus dem Gegner heraus
- Verschiedene Farben je nach Formel-Typ
- Rotation und Skalierung während der Lebensdauer

### 3. Energie-Trails
- Leuchtende Spuren hinter dem Spieler bei Bewegung
- Intensität abhängig von Geschwindigkeit
- Farbwechsel bei verschiedenen Power-ups
- Fade-out Effekt mit Transparenz

### 4. Explosions-Partikel
- Spektakuläre Explosionen bei Gegner-Eliminierung
- Verschiedene Größen je nach Gegner-Typ
- Schockwellen-Effekt mit Ring-Partikeln
- Debris-Partikel für realistische Zerstörung

## Technische Details

### Partikel-Eigenschaften
```javascript
// Beispiel Partikel-Objekt Struktur
{
    x, y: Position,
    vx, vy: Geschwindigkeit,
    life: Lebensdauer,
    maxLife: Maximale Lebensdauer,
    size: Größe,
    color: Farbe (RGBA),
    type: Partikel-Typ,
    rotation: Drehung,
    rotationSpeed: Drehgeschwindigkeit
}
```

### Performance-Optimierungen
- Maximale Partikel-Anzahl begrenzen (1000-2000)
- Culling außerhalb des Bildschirms
- Batch-Rendering für gleiche Partikel-Typen
- Wiederverwendung von Partikel-Objekten

### Integration ins bestehende System
- Partikel-Update in der Haupt-Game-Loop
- Rendering nach Spielelementen, vor UI
- Event-basierte Partikel-Erzeugung
- Konfigurierbare Partikel-Dichte für verschiedene Geräte

## Visuelle Ziele
- **Formel-Explosionen**: Mathematische Symbole fliegen spektakulär auseinander
- **Bewegungs-Trails**: Spieler hinterlässt leuchtende Energiespur
- **Erfolgs-Effekte**: Überwältigende Partikel-Show bei richtigen Antworten
- **Atmosphäre**: Schwebende Formel-Fragmente in der Arena

## Testkriterien
- Mindestens 60 FPS bei 500+ aktiven Partikeln
- Verschiedene Partikel-Typen funktionieren korrekt
- Partikel reagieren auf Spiel-Events
- Visuell beeindruckende Effekte ohne Performance-Einbußen

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 1, Schritt 1.2: Screen-Impact-System**
