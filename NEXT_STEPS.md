Feature Roadmap & Implementation Plan
This document outlines the plan for the next phase of development, focusing on expanding the content generation capabilities and enhancing the user experience.

1. Human Creator
Goal: Create a distinct generator for human-like characters, separate from the current "creature/monster" generator.

Logic: Implement a HumanGenerator class that enforces stricter proportions (head, torso, legs, arms) and limits random mutation.
Visuals: Use specific color palettes (skin tones, clothing colors) and shapes (less jagged, more organic).
UI: Add a toggle or tab to switch between "Monster" and "Human" generation modes.
2. Monster Backstory & Names
Goal: Give monsters their own unique narrative identity, distinct from the current generic/human-leaning backstories.

Names: Create a MonsterNameGenerator using guttural sounds, descriptive titles (e.g., "The Sludge", "Xog'thra"), and less "human" structures.
Backstory: Create a MonsterBackstoryGenerator with data pools focused on habitats, instincts, legendary feats, and ominous origins (e.g., "Spawned from the abyss", "Created in a lab").
3. Animations (Idle State)
Goal: Bring characters to life with a simple 2-3 frame idle animation.

Implementation:
Breathing: Slight vertical expansion/contraction of the torso pixels.
Bobbing: Moving the entire sprite up/down by 1 pixel.
Glowing: Pulsing colors for magical parts (eyes, cores).
Rendering: Update renderer.js to handle multi-frame rendering and loop playback in the UI.
4. Enhanced Viewing Mode
Goal: Improve the detailed view of a character (building on the new Modal).

Features:
Zoom: Allow zooming in/out on the pixel art.
Animation Toggle: Play/pause the idle animation.
Edit Name/Story: Allow users to manually edit the generated text.
Navigation: "Next/Previous" buttons to cycle through generated characters without closing the modal.
5. Advanced Export
Goal: Provide more robust export options for creators.

Formats:
GIF: Export the idle animation as a GIF.
Sprite Sheet: Export frames as a horizontal strip (already partially supported, needs refinement for animations).
Card Export: Download the entire "Card" (Image + Name + Story) as a PNG for sharing.
Proposed Order of Execution
Human Creator: Establishes the second major content type.
Monster Backstory: Polishes the existing monster content.
Animations: Adds visual polish to both types.
Enhanced Viewing: Improves how users interact with the new content.
Advanced Export: Allows users to save their creations in new ways.