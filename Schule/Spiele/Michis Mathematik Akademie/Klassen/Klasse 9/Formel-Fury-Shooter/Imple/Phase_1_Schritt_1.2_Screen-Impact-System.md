# Phase 1, Schritt 1.2: Screen-Impact-System

## Ziel
Implementierung eines dynamischen Screen-Impact-Systems für intensive visuelle Rückmeldung bei allen Spiel-Aktionen.

## Beschreibung
Dieses System sorgt für unmittelbares, körperlich spürbares Feedback durch Bildschirm-Effekte. Jede Aktion im Spiel wird durch entsprechende Screen-Reaktionen verstärkt.

## Konkrete Implementierung

### 1. Screen-Shake System
- **ScreenEffects.js** Klasse mit verschiedenen Shake-Intensitäten
- Micro-Shakes bei Formel-Eingabe (1-2px)
- Medium-Shakes bei Gegner-Treffern (3-5px)
- Heavy-Shakes bei Explosionen und Critical Hits (6-10px)
- Earthquake-Shakes bei Boss-Angriffen (10-15px)

### 2. Flash-Effekte
- **Damage-Flash**: Roter Bildschirm-Overlay bei Spieler-Schaden
- **Success-Flash**: Grüner/Goldener Flash bei richtigen Antworten
- **Critical-Flash**: Weißer Blitz bei kritischen Treffern
- **Combo-Flash**: Regenbogen-Flash bei hohen Combos

### 3. Bildschirm-Pulsieren
- **Heartbeat-Pulse**: Rhythmisches Pulsieren bei niedrigem Leben
- **Combo-Pulse**: Intensiveres Pulsieren bei Combo-Aufbau
- **Adrenalin-Pulse**: Schnelles Pulsieren in kritischen Situationen
- **Victory-Pulse**: Triumphierendes Pulsieren bei Wellen-Abschluss

### 4. Chromatic Aberration
- **Stress-Aberration**: Farbverschiebung bei hohem Stress
- **Speed-Aberration**: Bewegungsunschärfe bei schneller Bewegung
- **Impact-Aberration**: Kurze Verzerrung bei starken Treffern

## Technische Details

### Shake-Parameter
```javascript
// Beispiel Shake-Konfiguration
{
    intensity: 5,        // Stärke in Pixeln
    duration: 200,       // Dauer in Millisekunden
    frequency: 60,       // Frequenz der Oszillation
    decay: 0.95,        // Abschwächung pro Frame
    direction: 'both'    // 'horizontal', 'vertical', 'both'
}
```

### Flash-System
- Overlay-Canvas für Flash-Effekte
- Alpha-Blending für sanfte Übergänge
- Verschiedene Blend-Modi (multiply, screen, overlay)
- Timing-basierte Fade-Outs

### Performance-Optimierungen
- Shake-Intensität basierend auf Geräte-Performance
- Reduzierte Effekte auf mobilen Geräten
- Benutzer-Einstellungen für Empfindlichkeit
- GPU-beschleunigte Transformationen

## Visuelle Ziele
- **Unmittelbares Feedback**: Jede Aktion spürbar machen
- **Intensitäts-Abstufung**: Verschiedene Stärken für verschiedene Events
- **Atmosphäre**: Brutale, intensive Spielerfahrung
- **Immersion**: Spieler fühlt sich mitten im Geschehen

## Event-Integration
- Formel-Eingabe → Micro-Shake
- Richtige Antwort → Success-Flash + Medium-Shake
- Falsche Antwort → Damage-Flash + Heavy-Shake
- Gegner-Tod → Explosion-Shake + White-Flash
- Combo-Aufbau → Intensiveres Pulsieren
- Kritisches Leben → Heartbeat-Pulse + Red-Tint

## Testkriterien
- Alle Shake-Typen funktionieren flüssig
- Flash-Effekte sind deutlich sichtbar aber nicht blendend
- Performance bleibt bei 60 FPS stabil
- Effekte verstärken das Spielgefühl ohne zu stören

## Nächster Schritt
Nach erfolgreicher Implementierung → **Phase 1, Schritt 1.3: Audio-Feedback-Basis**
