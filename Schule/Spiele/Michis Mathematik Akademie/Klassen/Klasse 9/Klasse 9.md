# Klasse 9 Integration für Formel-Fury-Shooter

## **Ziel**
Erweitere das bestehende Formel-Fury-Shooter Spiel um mathematische Aufgaben der 9. Klasse, zusätzlich zu den bereits implementierten binomischen Formeln.

## **Mathematische Themen Klasse 9**

### **1. Quadratische Gleichungen**
- **Normalform**: ax² + bx + c = 0
- **p-q-Formel**: x² + px + q = 0 → x = -p/2 ± √((p/2)² - q)
- **abc-Formel**: x = (-b ± √(b² - 4ac)) / (2a)
- **Faktorisierung**: x² - 5x + 6 = 0 → (x-2)(x-3) = 0
- **Satz von Vieta**: x₁ + x₂ = -p, x₁ · x₂ = q

### **2. Lineare Funktionen (erweitert)**
- **Steigung berechnen**: m = (y₂-y₁)/(x₂-x₁)
- **Punkt-Steigungs-Form**: y - y₁ = m(x - x₁)
- **Schnittpunkte**: Zwei Geraden schneiden
- **Parallele/Senkrechte Geraden**

### **3. Quadratische Funktionen**
- **Normalparabel**: f(x) = x²
- **Verschobene Parabeln**: f(x) = (x-d)² + e
- **Scheitelpunktform**: f(x) = a(x-d)² + e
- **Nullstellen berechnen**
- **Schnittpunkt mit y-Achse**

### **4. Potenzen und Wurzeln**
- **Potenzgesetze**: aᵐ · aⁿ = aᵐ⁺ⁿ
- **Wurzelgesetze**: √a · √b = √(ab)
- **Rationalmachen des Nenners**: 1/√2 = √2/2
- **Wurzelgleichungen**: √(x+3) = 5

### **5. Prozent- und Zinsrechnung (komplex)**
- **Zinseszins**: K = K₀ · (1+p)ⁿ
- **Exponentielles Wachstum/Zerfall**
- **Prozentuale Änderungen verketten**

## **Implementierungs-Spezifikation**

### **Aufgaben-Struktur**
```
Aufgabe = {
  typ: "quadratische_gleichung" | "lineare_funktion" | "quadratische_funktion" | "potenzen_wurzeln" | "prozent_zins",
  schwierigkeit: 1-5,
  aufgabe: "Löse: x² - 5x + 6 = 0",
  antwort: ["x₁ = 2", "x₂ = 3"] oder "x₁ = 2; x₂ = 3",
  punkte: 100-300,
  zeitlimit: 15-45 sekunden,
  hinweis: "Verwende die p-q-Formel oder faktorisiere"
}
```

### **Eingabe-Modi**
- **Einzelwert**: Eine Zahl (z.B. Steigung)
- **Zwei Lösungen**: x₁ = 2; x₂ = 3 (Format: "2;3" oder "2,3")
- **Funktionsterm**: f(x) = 2x + 3 (Format: "2x+3")
- **Koordinaten**: Punkt (2|3) (Format: "2,3" oder "(2,3)")

### **Gegner-Zuordnung**
- **Gleichungs-Geister**: Quadratische Gleichungen (blaue Aura)
- **Funktions-Dämonen**: Lineare/Quadratische Funktionen (grüne Aura)
- **Potenz-Trolle**: Potenzen und Wurzeln (rote Aura)
- **Zins-Zombies**: Prozent- und Zinsrechnung (gelbe Aura)

### **Schwierigkeits-Progression**
- **Level 1-2**: Einfache quadratische Gleichungen (ganzzahlige Lösungen)
- **Level 3-4**: Komplexere Gleichungen, lineare Funktionen
- **Level 5-6**: Quadratische Funktionen, Wurzelgleichungen
- **Level 7-8**: Gemischte Aufgaben, Zinseszins
- **Level 9-10**: Boss-Level mit kombinierten Aufgaben

### **Validierungs-System**
- **Toleranz für Rundungsfehler**: ±0.01 für Dezimalzahlen
- **Multiple Antwort-Formate**: "2;3", "x₁=2, x₂=3", "2,3"
- **Vereinfachung prüfen**: 2x+4 = 2(x+2) als äquivalent erkennen

### **Integration in bestehende Systeme**
- **formula-system.js erweitern**: Neue Validierungs-Funktionen
- **enemy-system.js**: Neue Gegner-Typen mit Klasse-9-Aufgaben
- **Menü-System**: "Klasse 9 Modus" als neue Option
- **Upgrade-System**: Spezielle Upgrades für Klasse-9-Themen

### **Belohnungs-Anpassung**
- **Basis-Punkte**: 150-400 (höher als binomische Formeln)
- **Zeitbonus**: Schnelle Lösung = +50% Punkte
- **Streak-Bonus**: Aufeinanderfolgende richtige Antworten
- **Themen-Mastery**: Bonus für 10 richtige Aufgaben eines Typs

## **Vorbereitung: Grundlagen aus dem SkillTree**

### **Erforderliche Vorkenntnisse (aus GRUNDLAGE WISSEN DER MITTLEREN REIFE)**

**Algebraische Grundlagen:**
- ✅ **Termumformungen** (Klammern, Binomische Formeln) - bereits implementiert
- ✅ **Lineare Gleichungen & Ungleichungen**
- ✅ **Lineare Gleichungssysteme**
- ✅ **Quadratische Gleichungen (p-q-Formel)** - Kernthema Klasse 9
- ✅ **Potenzen & Wurzeln** - erweitert in Klasse 9
- ✅ **Prozent- & Zinsrechnung** - komplexer in Klasse 9

**Funktionen (Einführung):**
- ✅ **Funktionsbegriff, Darstellungsformen**
- ✅ **Lineare Funktionen** - erweitert mit Steigungsberechnung
- ✅ **Quadratische Funktionen** - Scheitelpunktform, Nullstellen
- ✅ **Einfache Potenzfunktionen** - Basis für Potenzgesetze

### **Klasse 9 Erweiterungen basierend auf SkillTree**

**A1.1: Polynomfunktionen höheren Grades (Vorbereitung)**
- Verhalten im Unendlichen verstehen
- Nullstellen durch Faktorisierung finden
- Symmetrie-Eigenschaften erkennen

**A1.2: Gebrochenrationale Funktionen (Einführung)**
- Definitionslücken identifizieren
- Einfache Polstellen erkennen
- Asymptoten-Verhalten verstehen

**A1.3: Wurzelfunktionen (Grundlagen)**
- Definitionsbereich von Wurzelfunktionen
- Einfache Wurzelgleichungen lösen
- Rationalmachen des Nenners

### **Aufgaben-Kategorien nach SkillTree-Progression**

**Stufe 1: Grundlagen festigen**
- Quadratische Gleichungen (p-q-Formel, abc-Formel)
- Lineare Funktionen (Steigung, Punkt-Steigungs-Form)
- Potenzgesetze anwenden

**Stufe 2: Funktionen erweitern**
- Quadratische Funktionen (Scheitelpunktform)
- Nullstellen berechnen
- Schnittpunkte bestimmen

**Stufe 3: Komplexere Strukturen**
- Wurzelgleichungen lösen
- Einfache gebrochenrationale Funktionen
- Exponentielles Wachstum (Zinseszins)

**Stufe 4: Vernetzung**
- Kombinierte Aufgaben verschiedener Bereiche
- Anwendungsaufgaben mit realem Bezug
- Vorbereitung auf Oberstufen-Themen

### **Lernpfad-Integration**

**Abhängigkeiten beachten:**
- Termumformungen → Quadratische Gleichungen
- Lineare Funktionen → Quadratische Funktionen  
- Potenzgesetze → Wurzelgesetze
- Grundlagen → Anwendungen

**Progression im Spiel:**
- Spieler startet mit bekannten binomischen Formeln
- Schrittweise Einführung neuer Themen
- Wiederholung und Vernetzung alter Themen
- Vorbereitung auf Oberstufen-Mathematik

Implementiere diese Spezifikation als nahtlose Erweiterung des bestehenden Spiels, ohne die bereits funktionierenden binomischen Formeln zu beeinträchtigen.