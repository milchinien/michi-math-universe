# Boss System - Übersicht und Kernkonzept

## Ziel des Boss-Systems

Das Boss-System ist das ultimative Prüfungssystem für alle bisher gelernten binomischen Formeln. Es erscheint alle 10 Wellen (10, 20, 30, 40, ...) und testet das gesamte Wissen des Spielers in einer intensiven, aber fairen Herausforderung.

## Kern-Anforderungen

### 🎯 Boss-Erscheinung
- **Timing**: Nur alle 10 Wellen (10, 20, 30, 40, ...)
- **Exklusivität**: Boss erscheint ALLEINE - keine anderen Gegner
- **Statisch**: Boss bewegt sich nicht, bleibt an fester Position
- **Unendliche Zeit**: Keine Zeitbegrenzung für Formel-Lösung

### 🧠 Lern-Prüfung
- **Comprehensive Testing**: Testet ALLES was bisher gelernt wurde
- **Progressive Schwierigkeit**: Jeder Boss wird komplexer als der vorherige
- **Wissens-Validation**: Stellt sicher, dass Grundlagen sitzen bevor es weitergeht

### ⚔️ Angriffsmuster-System
- **Angriffsphasen**: Boss hat verschiedene Angriffsmuster
- **Timing**: 
  - Tag-Modus: 10-30 Sekunden pro Angriff
  - Nacht-Modus: 30-60 Sekunden pro Angriff
- **Unterbrechung**: Während Angriffen kann Boss NICHT angegriffen werden
- **Formel-Unterbrechung**: Aktive Formel-Eingabe wird abgebrochen → 1 Leben verloren

## Boss-Progression-System

### Welle 10 - "Grundlagen-Prüfer"
- **Formeln**: Einfache binomische Formeln (a+b)², (a-b)²
- **Komplexität**: 1-2 Variablen, kleine Zahlen
- **Angriffsmuster**: 1-2 verschiedene Muster

### Welle 20 - "Fortgeschrittenen-Herausforderer"  
- **Formeln**: Gemischte Terme, (a+b)(a-b) = a²-b²
- **Komplexität**: 2-3 Variablen, mittlere Zahlen
- **Angriffsmuster**: 2-3 verschiedene Muster

### Welle 30 - "Meister-Prüfer"
- **Formeln**: Verschachtelte Formeln, Faktorisierung
- **Komplexität**: 3+ Variablen, große Zahlen
- **Angriffsmuster**: 3-4 verschiedene Muster

### Welle 40+ - "Grandmaster-Herausforderung"
- **Formeln**: Komplexe Kombinationen, Multi-Step-Lösungen
- **Komplexität**: Maximale Schwierigkeit
- **Angriffsmuster**: 4+ verschiedene Muster mit Kombinationen

## Boss-Verhalten-Zyklus

```
1. BOSS ERSCHEINT
   ↓
2. FORMEL-PHASE (Unendliche Zeit)
   - Kein Gegner in der gesamten Welle
   - Spieler löst Formel
   - Boss ist verwundbar
   ↓
3. ANGRIFFS-PHASE (10-60 Sekunden)
   - Boss führt Angriffsmuster aus
   - Boss ist NICHT angreifbar
   - Formel-Eingabe wird unterbrochen
   ↓
4. ZURÜCK ZU FORMEL-PHASE
   (Wiederholt bis Boss besiegt)
```

## Technische Kern-Komponenten

### BossManager Klasse
- Verwaltet Boss-Spawning alle 10 Wellen
- Koordiniert Boss-Lebenszyklus
- Integriert mit WaveSystem

### Boss Klasse
- Statisches Entity mit fester Position
- Angriffsmuster-System
- Formel-Challenge-Integration
- Phasen-Management

### BossFormulaSystem
- Generiert progressive Formel-Challenges
- Validiert alle bisherigen Lernfortschritte
- Skaliert Schwierigkeit basierend auf Welle

### BossAttackSystem
- Verwaltet verschiedene Angriffsmuster
- Timing-System für Angriffsphasen
- Unterbrechungs-Mechanik für Formel-Eingabe

## Erfolgs-Kriterien

### ✅ Lern-Effektivität
- Boss zwingt zur Wiederholung aller Konzepte
- Progressive Schwierigkeit verhindert "Durchmogeln"
- Faire aber herausfordernde Prüfung

### ✅ Gameplay-Balance
- Boss ist herausfordernd aber nicht frustrierend
- Angriffsphasen geben Pause zwischen Formeln
- Unendliche Zeit verhindert Stress-Fehler

### ✅ Progression-Gefühl
- Jeder Boss fühlt sich wie ein Meilenstein an
- Sichtbare Steigerung der Komplexität
- Belohnendes Gefühl beim Besiegen

## Nächste Schritte

1. **Boss-Mechaniken** - Detaillierte Angriffsmuster und Verhalten
2. **Formel-System** - Progressive Schwierigkeit und Wissens-Testing
3. **State-Machine** - Phasen-Management und Übergänge
4. **Visual-System** - Boss-Darstellung und Effekte
5. **Integration** - Verbindung mit bestehendem Wave-System
6. **Implementation** - Code-Struktur und finale Umsetzung

Dieses Boss-System wird das Herzstück der Lern-Validation und sorgt dafür, dass Spieler wirklich alle Konzepte beherrschen, bevor sie zu schwierigeren Inhalten weitergehen.
