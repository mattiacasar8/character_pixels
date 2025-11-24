# Character Pixels Experiment

This project is an experiment in procedural generation for storytelling and generative art. It generates unique pixel-art characters with names and backstories.

## How It Works

### 1. Character Generation
The project now supports two distinct generator types:
-   **Monsters (`js/generators/monster/monster-generator.js`)**: Generates pixel-art monsters using fantasy palettes and proportions.
-   **Humans (`js/generators/human/human-generator.js`)**: Generates human-like characters with specific proportions and skin/clothing palettes.

The visual generation process follows these steps:
-   **Skeleton Construction**: A "skeleton" is built using trapezoids for body parts (torso, limbs, head).
-   **Heatmap Generation**: A probability heatmap is created based on the skeleton shapes.
-   **Pixel Filling**: Pixels are filled based on the heatmap density and a random palette.
-   **Mirroring**: The left side is mirrored to the right to create symmetry (humanoid effect).
-   **Post-Processing**: Cellular automata smoothing and outlining are applied to clean up the sprite.

### 2. Name Generation
-   **Monsters**: `js/generators/monster/monster-names.js` using data from `js/data/monster-names-data.js`. Generates guttural, monstrous names (e.g., "Xogthra", "Vexgor").
-   **Humans**: `js/generators/name-generator.js` using data from `js/data/human-names-data.js`. Generates fantasy human names with prefixes, suffixes, and titles.

### 3. Backstory Generation
-   **Monsters**: `js/generators/monster/monster-backstory.js` using data from `js/data/monster-backstory-data.js`. Generates origins, habitats, instincts, and legends.
-   **Humans**: `js/generators/human/human-backstory.js` (implicit in main logic), using data from `js/data/human-backstory-data.js`.

## Project Structure

-   `index.html`: Main entry point.
-   `js/main.js`: Orchestrates the application, UI logic, and generation flow.
-   `js/generators/`: Contains generator logic, separated into `human/` and `monster/` directories.
-   `js/data/`: Contains data files (`human-palettes.js`, `monster-palettes.js`, `human-backstory-data.js`, etc.).
-   `js/core/`: Contains core logic (`generator.js`, `renderer.js`).
-   `js/utils/`: Utility functions for math and randomness.

## Usage

1.  Open `index.html` in a browser.
2.  Use the sliders to adjust generation parameters (limb sizes, angles, etc.).
3.  Click "Generate" to create new characters.
4.  Click on a character card to view their generated backstory.
5.  Use "Export" buttons to save spritesheets or ZIP archives.
