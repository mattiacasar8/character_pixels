import { BackstoryGenerator } from './js/backstory-generator.js';

const generator = new BackstoryGenerator();

console.log("--- Testing Backstory Generator ---");

for (let i = 0; i < 5; i++) {
    const name = `Character${i}`;
    const story = generator.generate(name);
    console.log(`\n[${name}]: ${story}`);

    if (!story || story.includes('undefined') || story.includes('null')) {
        console.error("ERROR: Invalid story generated");
        process.exit(1);
    }
}

console.log("\n--- Test Passed ---");
