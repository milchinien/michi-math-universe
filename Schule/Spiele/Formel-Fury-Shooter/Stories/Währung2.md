# Formel-Fury-Shooter: Währungssystem-Implementation

## 🎯 Ziel
Implementiere ein Währungssystem ("Algebra-Coins" 💰) das parallel zum bestehenden Score-System läuft und als Grundlage für ein zukünftiges Shop-System dient.

## 🔧 Technische Anforderungen

### 1. Währungs-Klasse erstellen
- [ ] **CurrencySystem-Klasse** in neuer Datei `js/currency-system.js`
- [ ] **Münz-Sammlung** mit verschiedenen Werten je Enemy-Typ:
  - **Polynom-Zombie**: 2-4 Coins (Standard)
  - **Gleichungs-Geist**: 3-6 Coins (Schnell, höhere Belohnung)
  - **Elite-Bestie**: 8-12 Coins (Boss-Belohnung)
  - **Standard-Gegner**: 2-5 Coins (Basis)
- [ ] **Combo-Bonus für Währung**: +50% Coins ab 3x Combo, +100% ab 5x Combo
- [ ] **LocalStorage-Persistierung** für dauerhafte Münz-Sammlung

### 2. UI-Integration
- [ ] **Währungs-Display** oben links neben FPS-Counter:
  );
  ```

### 4. Visuelle Effekte
- [ ] **Münz-Partikel-System** für Drop-Animation:
  - Goldene, glitzernde Münz-Sprites
  - Smooth-Movement zum Spieler
  - Fade-out mit "+X" Text-Overlay
- [ ] **CSS-Animationen** für Währungs-Display:
  - Puls-Effekt bei Münz-Erhalt
  - Grüner Glow bei großen Münz-Gewinnen (>10 Coins)

### 5. Balance & Gameplay
- [ ] **Münz-Werte basierend auf Enemy-Difficulty**:
  - Schwierigere Formeln = mehr Coins
  - Längere Kampfzeit = Bonus-Coins
  - Speed-Bonus auch für Währung
- [ ] **Anti-Grind-Mechanik**: Münz-Rate sinkt leicht bei sehr langen Sessions
- [ ] **Währungs-Reset-Option** in Einstellungen-Menü

## 📊 Erwartete Integration-Punkte

### FormulaSystem.js
```javascript
// In handleCorrectAnswer():
if (this.targetedEnemy) {
    // ... existing code ...
    
    // NEW: Currency reward
    const coinsEarned = game.currencySystem.calculateCoins(
        this.targetedEnemy, 
        this.combo, 
        timeTaken
    );
    game.currencySystem.addCoins(coinsEarned);
}
```

### GameEngine.js
```javascript
// In constructor:
this.currencySystem = null;

// In initializeGameObjects():
this.currencySystem = new CurrencySystem();

// In render():
this.currencySystem.update(deltaTime);
this.currencySystem.render(this.ctx);
```

### HTML (index.html)
```html
<!-- In HUD Elements section -->
<div id="currencyDisplay">
    💰 <span id="coinValue">0</span> Algebra-Coins
</div>
```

## 🎨 Design-Spezifikationen

### Münz-Display Style
```css
#currencyDisplay {
    position: absolute;
    top: 40px;  /* Under FPS counter */
    left: 10px;
    color: #ffd700; /* Gold color */
    font-size: 16px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    z-index: 100;
}

.coin-gain-animation {
    animation: coinPulse 0.3s ease-out;
}

@keyframes coinPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); color: #ffff00; }
    100% { transform: scale(1); }
}
```

## 🔮 Zukunftsfähigkeit
- **Shop-System-Vorbereitung**: Struktur erlaubt einfache Shop-Integration
- **Item-Kauf-Interface**: Currency-Klasse hat `spendCoins(amount)` Methode
- **Achievement-System**: Münz-Milestones für Belohnungen

## ⚡ Performance-Hinweise
- Münz-Animationen via `requestAnimationFrame` für 60fps
- Object-Pooling für Münz-Partikel (max. 10 gleichzeitig)
- Throttle Currency-Display-Updates (max. 30fps)

## 🧪 Testing-Checkliste
- [ ] Münzen werden korrekt vergeben nach Enemy-Tod
- [ ] UI-Display aktualisiert sich in Echtzeit
- [ ] LocalStorage speichert/lädt Münzen korrekt
- [ ] Combo-Bonus berechnet sich richtig
- [ ] Münz-Animationen laufen flüssig
- [ ] Keine Performance-Einbrüche bei vielen Münz-Drops

## 💡 Bonus-Features (Optional)
- [ ] **Münz-Magnetismus**: Coins fliegen automatisch zum Spieler in 50px Radius
- [ ] **Daily-Bonus**: Erste Session des Tages gibt 2x Coins
- [ ] **Streak-Bonus**: 10+ Combo gibt seltene "Platinum-Coins" (5x Wert)