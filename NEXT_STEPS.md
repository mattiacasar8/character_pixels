Feature Roadmap & Implementation Plan
This document outlines the plan for the next phase of development, focusing on expanding the content generation capabilities and enhancing the user experience.

1. Human Creator
Goal: Create a distinct generator for human-like characters, separate from the current "creature/monster" generator.

Logic: Creare una nuova logica di costruzione sprite. Alla base della costruzione del personaggio abbiamo comunque su forme e heatmap.
Ma utilizzando proporzioni più strette e limitando la mutazione casuale.
Includiamo anche un passaggio per capelli occhi e bocca.
A differenza del generatore di mostri, che genera 3-5 colori e li usa per tutto il corpo, qui i colori vanno a zone e sono più specifici.
Utilizza un set di colori specifico per diverse zone: testa, mani e piedi utilizzano colori pelle. torso, gambe, braccia utilizzano colori vestiti.
Va modificato il file human palettes.js per aggiungere i colori specifici per le diverse zone.


2. Monster Backstory & Names
Goal: Give monsters their own unique narrative identity, distinct from the current generic/human-leaning backstories.
Utilizza la stessa logica di human-backstory ma con dataset monster-backstory data prendendo spunto dalla controparte umana.

Names: Sia per humans che per monsters bisogna implementare un name generator. Prendi spunto da name-generator.js e adattalo per i due tipi di personaggi. Includi anche un dataset di nomi per i mostri e uno per gli umani. troverai già dei file placeholder da utilizzare.
I nomi dovrebbero avere anche un cognome e un eventuale epiteto (es. Mattia Rossi, Mattia Rossi il Grande - oppure Xoltar Mongol il Diabolico per i mostri). Dovrebbero avere un suono fantasy generico, vedi name generator.

3. Animations (Idle State)
Goal: Bring characters to life with a simple 2-3 frame idle animation.

Implementation:
Breathing: Slight vertical expansion/contraction of the torso pixels.

La sprite va ridisegnata in 3 frame totali per dare l'idea di respiro e movimento. Per farlo aumentiamo la dimensione del torso e creiamo 3 frame. Per queste tre sprite usiamo la stessa palette di colori, e tutti gli altri dettagli rimangono invariati, al fine di evitare che il movimento si faccia troppo evidente.

4. Enhanced Viewing Mode
Goal: Improve the detailed view of a character (building on the Modal).

Features:
Animation - viene mostrata l'animazione idle.
Navigation - "Next/Previous" buttons to cycle through generated characters without closing the modal.
Export - viene esportata la sprite in 3 frame.

5. Advanced Export
Goal: Provide more robust export options for creators.

Formats:
Sprite Sheet: Export frames as a horizontal strip (already partially supported, needs refinement for animations).
Card Export: Download the entire "Card" (Image + Name + Story) as a PNG for sharing. La card dovrebbe essere verticale 1080x1920 (instagram) e contenere Nome, immagine (upscalata nearest neighbor a 500px), storia. Utilizzando le font corrette e il font size appropriato. Il tutto allineato a sinistra. (questo significa che vengono esportati 3 PNG, uno per ogni frame.)