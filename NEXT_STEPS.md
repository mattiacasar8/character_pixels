Dobbiamo implementare sostanziali cambiamenti al modo in cui vengono generati gli umani in human-generator e tutti i relativi file associati (controlla con attenzione dipendenze e flusso di informazioni)innanzitutto i valori “standard” devono diventare i seguenti:

TORSO TOP
17 - 35%
TORSO BOT
14 - 27%
TORSO H
20 - 41%
HEAD SIZE
14 - 24%
ARM LEN
14 - 22%
LEG LEN
12 - 18%
NECK W
4 - 6%
NECK H
2 - 4%
U.ARM W
9 - 14%
F.ARM W
6 - 9%
ARM ANG
-40 to 0°
ELBOW ANG
-5 to 35°
THIGH W
7 - 12%
SHIN W
5 - 8%
LEG ANG
-25 to 0°

il che significa poi che gli altri preset dovranno essere delle variazioni di questi valori.

—Ci sono dei problemi nella costruzione della figura (a partire da bones/shapes layer) - La testa dovrebbe essere più rotonda, a forma di cranio, ora è troppo squadrata.

Le braccia hanno un problema nella rotazione, la spalla dovrebbe fungere da pivot, ma invece quando cambia l’angolo non ruotano veramente. Questo fa in modo che quando l’angolo è -90 lo spessore delle braccia diventa quasi zero (il trapezio viene appiattito!) va fissata questa cosa.

L’intera figura sembra troppo vicina al bordo superiore e la testa spesso viene tagliata, questo fa si che molti personaggi appaiano “pelati” con i capelli superiori tagliati, sposterei tutto lo shapes layer di poco più in basso, permettendo alla generazione di coprire sempre il top della testa e lasciando anche un pochino di spazio in più per capelli.

—

Infine, dal punto di vista estetico, va notevolmente raffinato l’algoritmo di colorazione.

In generale ai vestiti va dato un po di shading, ad esempio aggiungendo un leggero bordo o qualche dettaglio di riflesso. Immaginiamo una luce che colpisce il nostro personaggio e gli da un po di shadow in alcuni punti della maglietta/pantaloni.

I colori e i pattern degli indumenti devono essere molto più fantasy/medievali e ci devono essere maggiori combinazioni e pattern possibili.prendi letteralmente ispirazione da veri vestiti medievali, i loro colori, possibili combinazioni  e cerchiamo di fare una serie di algoritmi che vanno a simulare queste combinazioni (per ora abbiamo qualche pattern, tipo quadrati, bottoni, ecc.) dobbiamo espandere drasticamente e renderli più fantasy.

Lo stesso vale per lo stile dei capelli, le espressioni facciali e le acconciature. Tenendo conto ovviamente delle limitazioni che abbiamo.

—

Per quanto riguarda infine le animazioni, attualmente funziona abbastanza bene, ma quando la testa si sposta verso l’alto il collo viene separato dalla parte sottostante, va quindi copiata la fila di pixel sottostante quando la testa si alza in modo che non risulti fluttuante.