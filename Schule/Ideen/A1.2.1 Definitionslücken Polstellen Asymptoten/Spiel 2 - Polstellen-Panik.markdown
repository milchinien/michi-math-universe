# Spiel 2: Polstellen-Panik

### Kurzbeschreibung

Ein Tower-Defense-Spiel der anderen Art. Du bist im Ursprung des Koordinatensystems gefangen und musst "Funktions-Monster" abschießen, bevor sie dich mit ihren Polstellen vernichten.

### Ausführliche Beschreibung

**Setting:** Du bist ein gestrandeter Mathematiker auf einer kleinen Plattform im Zentrum ($x=0$) eines dunklen, digitalen Raumes. Aus allen Richtungen kriechen leuchtende "Funktions-Monster" auf dich zu.

**Gameplay:**
Am oberen Bildschirmrand tauchen nacheinander verschiedene gebrochenrationale Funktionen auf, z.B. $f(x) = \frac{x-1}{x}$, $g(x) = \frac{x}{x-1}$, $h(x) = \frac{x^2}{x}$.

1. **Die Monster:** Jede Funktion ist ein Monster. Die Monster bewegen sich entlang ihres Graphen in Richtung der y-Achse.
2. **Die Bedrohung:** Deine Achillesferse ist die $x$-Position $x=0$. Wenn ein Funktions-Monster eine Polstelle bei $x=0$ hat (wie $f(x)$), wird es beim Erreichen der y-Achse einen verheerenden Energiestrahl entlang der gesamten Achse abfeuern (visualisiert das Verhalten gegen $\pm\infty$) und dich sofort auslöschen.
3. **Deine Waffe:** Du hast eine Kanone. Du musst die ankommenden Funktionen anvisieren und analysieren. Deine Aufgabe ist es, NUR die gefährlichen Monster abzuschießen – also die, die eine Polstelle bei $x=0$ haben.
4. **Falsche Ziele & Power-Ups:**
   - Schießt du ein harmloses Monster ab, wie $g(x)$ (Polstelle bei $x=1$, nicht bei $x=0$), verlierst du Punkte oder Energie.
   - Monster mit einer hebbaren Lücke bei $x=0$ (wie $h(x)$) sind "getarnt". Sie sehen gefährlich aus, aber wenn sie die y-Achse erreichen, lösen sie sich einfach auf und hinterlassen ein Power-Up, weil die Lücke ja "gestopft" werden kann. Du musst also lernen, zwischen echten Polstellen und hebbaren Lücken zu unterscheiden.
5. **Der Schwierigkeitsgrad:** Später kommen Funktionen, bei denen du erst den Nenner faktorisieren musst, um zu sehen, ob $(x-0)$ bzw. $x$ ein Faktor ist.

**Warum hilft das bei Mathe?**
Dieses Spiel zwingt dich zur blitzschnellen und wiederholten Anwendung der Kernregel: "Wann ist eine Definitionslücke eine Polstelle und wann nicht?". Du musst in Sekundenbruchteilen den Nenner auf eine Nullstelle bei $x=0$ prüfen UND den Zähler an dieser Stelle checken. Es trainiert den Unterschied zwischen Polstelle ($Nenner=0$, $Zähler \neq 0$) und hebbarer Lücke ($Nenner=0$, $Zähler=0$) unter Zeitdruck.
