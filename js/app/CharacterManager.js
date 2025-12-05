export class CharacterManager {
    constructor() {
        this.characters = [];
        this.currentSelection = null;
    }

    /**
     * Creates a new character frame
     * @param {string} type 
     * @param {string} preset 
     */
    createCharacter(type = 'human', preset = 'standard') {
        // ID generation would happen here
        const id = crypto.randomUUID();
        const seed = Math.floor(Math.random() * 2147483647);

        // Return a simplified structure for now, to be expanded
        return {
            id,
            type,
            preset,
            seed
        };
    }

    /**
     * Updates an existing character
     * @param {string} id 
     * @param {Object} changes 
     */
    updateCharacter(id, changes) {
        const char = this.getCharacter(id);
        if (!char) return null;

        Object.assign(char, changes);
        return char;
    }

    getCharacter(id) {
        return this.characters.find(c => c.id === id);
    }

    /**
     * Sets the current character for single mode editing
     * @param {Object} character 
     */
    selectCharacter(character) {
        this.currentSelection = character;
    }

    /**
     * Returns the currently selected character
     * @returns {Object|null}
     */
    getSelectedCharacter() {
        return this.currentSelection;
    }

    saveToStorage() {
        console.log('Saving to localStorage not implemented yet');
        // localStorage.setItem('saved_characters', JSON.stringify(this.characters));
    }

    loadFromStorage() {
        console.log('Loading from localStorage not implemented yet');
        // const json = localStorage.getItem('saved_characters');
        // if (json) this.characters = JSON.parse(json);
    }
}
