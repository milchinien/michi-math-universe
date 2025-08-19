# Spiel 2: √Rave Runner – Graphen-Parkour

# Kurzbeschreibung

Rhythmischer Parkour-Runner: Du surfst auf dem Graphen von f(x) = a·√(b x + c) + d. Beats triggern Parameterwechsel; nur wenn du die Transformation korrekt antizipierst, triffst du Ringe und vermeidest „Ableitungs-Klippen".

# Ausührliche Beschfreibung

- Flow: Du bewegst dich von links nach rechts auf dem Graphen. Checkpoints markieren den „Startpunkt" (x = −c/b). Vor dem Startpunkt existiert der Track bei gerader Wurzel nicht.
- Transformation on-beat: Jede 4 Takte wechselt genau ein Parameter. Visuals zeigen: a↑ ⇒ höherer Peak, a<0 ⇒ invertierte Spur; b↑ ⇒ x-Stauchung; c⇒ horizontale Verschiebung; d⇒ vertikale Verschiebung.
- Skill-Sections: 
  - „Nullstellen-Combo": Schalte d so, dass a·√(b x + c) + d = 0 an den Ring-Positionen erfüllt ist.
  - „Schnittpunkt-Challenge": Triff y = m x + t, indem du Parameter so wählst, dass sich Graph und Gerade schneiden.
- Ableitungs-Gameplay: In hell markierten Zonen ist die Steigung relevant: Geschwindigkeit ∝ 1/(2√(x)) bei √x-Abschnitten. Am Rand (Startpunkt) ist Tangente quasi senkrecht ⇒ Sprungfenster extrem kurz.
- Fehlersimulation: Quadrieren ohne Prüfung erzeugt „Fake-Ringe": Sie sehen echt aus, geben aber Minuspunkte. Nur wer nach dem Quadrieren die Definitionsprüfung gedanklich macht, meidet die Fakes.
- Warum hilft mir das?
  - Du verknüpfst Parametertransformationen mit motorischer Antizipation.
  - Du spürst das Steigungsverhalten von √x: schnell am Anfang, flacher später.
  - Du trainierst Nullstellen-/Schnittpunktdenken und die Pflicht zur Probe nach dem Quadrieren.


