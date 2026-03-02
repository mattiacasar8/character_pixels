#!/usr/bin/env node

/**
 * Batch Generator — Character Pixels
 *
 * Genera N video con ratio mostri/umani configurabile e produce manifest.json.
 *
 * Uso base:
 *   node cli/generate-batch.js
 *
 * Opzioni:
 *   --total <n>       Numero totale di video da generare (default: 120)
 *   --monsters <n>    Numero di mostri (default: 24, cioè 1:4 su 120)
 *   --humans <n>      Numero di umani (default: calcolato da total - monsters)
 *   --output <dir>    Cartella di output (default: ./output)
 *   --size <n>        Canvas size in px (default: 50)
 *   --seed <n>        Seed globale per generazione deterministica (opzionale)
 * Esempi:
 *   node cli/generate-batch.js                          # 120 video, 24 mostri, 96 umani
 *   node cli/generate-batch.js --total 60               # 60 video, 12 mostri, 48 umani (ratio 1:4)
 *   node cli/generate-batch.js --total 50 --monsters 10 # 50 video, 10 mostri, 40 umani
 *   node cli/generate-batch.js --total 10 --monsters 5  # 10 video, 5 mostri, 5 umani (ratio 1:1)
 *   node cli/generate-batch.js --output ./my-batch      # cartella output custom
 *   node cli/generate-batch.js --total 120 --seed 42718301  # batch deterministico
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

import { HumanGenerator } from '../js/generators/human/human-generator.js';
import { MonsterGenerator } from '../js/generators/monster/monster-generator.js';
import { HumanBackstoryGenerator } from '../js/generators/human/human-backstory.js';
import { MonsterBackstoryGenerator } from '../js/generators/monster/monster-backstory.js';
import { generateMusic } from '../js/audio/music-generator.js';
import { generateFrameSequence } from '../js/audio/frame-sequence.js';
import { renderWav } from '../js/audio/node/wav-renderer.js';
import { VIDEO_PRESETS } from '../js/config.js';
import { wrapText, buildTimeline, getTextState, getVisibleLines } from '../js/audio/text-animation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Template caption ─────────────────────────────────────────────────────────
// Formato del testo pubblicato come caption su Instagram.
// Variabili disponibili: {name}, {backstory}
const CAPTION_TEMPLATE = `\n—\n{name}\n—\n{backstory}\n—`;

// ─── Parse CLI args ───────────────────────────────────────────────────────────

function parseArgs() {
    const args = process.argv.slice(2);

    // Default: 120 totali, ratio 1:4 (24 mostri, 96 umani)
    const opts = {
        total: 120,
        monsters: null,   // null = calcolato automaticamente
        output: path.join(ROOT, 'output'),
        size: 50,
        seed: null,       // null = casuale per ogni personaggio
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--total':
                opts.total = parseInt(args[++i], 10);
                break;
            case '--monsters':
                opts.monsters = parseInt(args[++i], 10);
                break;
            case '--humans':
                // --humans imposta il numero di umani, i mostri sono il resto
                opts.monsters = opts.total - parseInt(args[++i], 10);
                break;
            case '--output':
                opts.output = path.resolve(args[++i]);
                break;
            case '--size':
                opts.size = parseInt(args[++i], 10);
                break;
            case '--seed':
                opts.seed = parseInt(args[++i], 10);
                break;
            case '--help':
                console.log(`
Uso: node cli/generate-batch.js [opzioni]

Opzioni:
  --total <n>       Numero totale di video (default: 120)
  --monsters <n>    Numero di mostri (default: total / 5, ratio 1:4)
  --humans <n>      Numero di umani (alternativa a --monsters)
  --output <dir>    Cartella output (default: ./output)
  --size <n>        Canvas pixel size (default: 50)
  --seed <n>        Seed globale per generazione deterministica

Esempi:
  node cli/generate-batch.js
  node cli/generate-batch.js --total 60
  node cli/generate-batch.js --total 50 --monsters 10
  node cli/generate-batch.js --output ./batch-gennaio
  node cli/generate-batch.js --total 120 --seed 42718301
`);
                process.exit(0);
        }
    }

    // Calcola mostri se non specificato: ratio 1:4 (20% mostri, 80% umani)
    if (opts.monsters === null) {
        opts.monsters = Math.round(opts.total / 5);
    }

    // Clamp monsters tra 0 e total
    opts.monsters = Math.max(0, Math.min(opts.monsters, opts.total));
    opts.humans = opts.total - opts.monsters;

    return opts;
}

// ─── Seeded PRNG (Mulberry32) ─────────────────────────────────────────────────

/**
 * Crea un generatore di numeri pseudo-casuali deterministici.
 * Stesso algoritmo usato in js/utils/random.js (Mulberry32).
 * Restituisce valori in [0, 1).
 */
function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
        s |= 0; s = s + 0x6D2B79F5 | 0;
        let t = Math.imul(s ^ s >>> 15, 1 | s);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// ─── Build sequence interleaved ──────────────────────────────────────────────

/**
 * Costruisce la sequenza di tipo ('human'/'monster') intercalando i mostri
 * uniformemente tra gli umani.
 * Es. 4 umani + 1 mostro → [human, human, human, human, monster]
 *     con spacing uniforme → [human, human, monster, human, human]
 */
function buildTypeSequence(totalHumans, totalMonsters) {
    const total = totalHumans + totalMonsters;
    const sequence = [];

    if (totalMonsters === 0) {
        return Array(total).fill('human');
    }

    // Distribuisce i mostri uniformemente
    const interval = total / totalMonsters;
    const monsterPositions = new Set();
    for (let i = 0; i < totalMonsters; i++) {
        monsterPositions.add(Math.round(interval * i + interval / 2) - 1);
    }

    for (let i = 0; i < total; i++) {
        sequence.push(monsterPositions.has(i) ? 'monster' : 'human');
    }

    // Aggiusta eventuali overflow (se arrotondi e vai oltre total)
    let monsterCount = sequence.filter(t => t === 'monster').length;
    let humanCount = sequence.filter(t => t === 'human').length;

    // Correggi se necessario
    while (monsterCount > totalMonsters) {
        const idx = sequence.lastIndexOf('monster');
        sequence[idx] = 'human';
        monsterCount--;
        humanCount++;
    }
    while (humanCount > totalHumans) {
        const idx = sequence.lastIndexOf('human');
        sequence[idx] = 'monster';
        humanCount--;
        monsterCount++;
    }

    return sequence;
}

// ─── Register fonts ───────────────────────────────────────────────────────────

function registerFonts() {
    const fontsDir = path.join(ROOT, 'assets', 'fonts');
    const fontFiles = [
        { file: 'InstrumentSerif-Regular.ttf', family: 'Instrument Serif' },
        { file: 'Inter-Regular.ttf', family: 'Inter' },
    ];
    for (const { file, family } of fontFiles) {
        const fontPath = path.join(fontsDir, file);
        if (fs.existsSync(fontPath)) {
            GlobalFonts.registerFromPath(fontPath, family);
        }
    }
}

// ─── Character generation ─────────────────────────────────────────────────────

const MONSTER_PRESETS = ['standard', 'short', 'tall', 'thin', 'bulky'];

function generateCharacter(generator, backstoryGenerator, seed, preset = 'standard') {
    const params = generator.randomParamsInRange(preset, seed);
    params.effects = { smoothing: true, lighting: true, outline: false };
    params.lightDirection = 'top-left';
    const character = generator.generate(params);
    character.backstory = backstoryGenerator.generate(character.name);
    return character;
}

// ─── Caption builder ─────────────────────────────────────────────────────────

function buildCaption(character) {
    return CAPTION_TEMPLATE
        .replace('{name}', character.name)
        .replace('{backstory}', character.backstory || character.name);
}

// ─── Canvas rendering (copiata da export-video.js) ───────────────────────────

function renderPixelsToCanvas(pixels, canvasSize, targetSize) {
    const canvas = createCanvas(targetSize, targetSize);
    const ctx = canvas.getContext('2d');
    const scale = targetSize / canvasSize;
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const color = pixels[y]?.[x];
            if (color && color.r !== undefined) {
                ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                ctx.fillRect(
                    Math.floor(x * scale), Math.floor(y * scale),
                    Math.ceil(scale), Math.ceil(scale)
                );
            }
        }
    }
    return canvas;
}

function drawVideoFrame(spriteCanvas, textState, descLines, fullNameWidth, preset) {
    const canvas = createCanvas(preset.width, preset.height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = preset.backgroundColor;
    ctx.fillRect(0, 0, preset.width, preset.height);

    const spriteX = (preset.width - preset.spriteSize) / 2;
    ctx.drawImage(spriteCanvas, spriteX, preset.spritePaddingTop);

    const textX = preset.textMarginLeft;
    const nameY = preset.spritePaddingTop + preset.spriteSize + preset.gapSpriteToName;

    if (textState.visibleName.length > 0) {
        ctx.fillStyle = preset.textColor;
        ctx.font = `${preset.nameFontSize}px "${preset.nameFont}", serif`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(textState.visibleName, textX, nameY);
    }

    const lineY = nameY + preset.nameFontSize + preset.separatorGapAbove;
    if (textState.separatorProgress > 0) {
        const separatorWidth = fullNameWidth * textState.separatorProgress;
        ctx.fillStyle = preset.separatorColor;
        ctx.fillRect(textX, lineY, separatorWidth, preset.separatorHeight);
    }

    const descY = lineY + preset.separatorHeight + preset.separatorGapBelow;
    if (textState.visibleDescWords > 0) {
        const visibleLines = getVisibleLines(descLines, textState.visibleDescWords);
        ctx.font = `${preset.descFontSize}px "${preset.descFont}", sans-serif`;
        ctx.fillStyle = preset.descTextColor;
        ctx.textAlign = 'left';
        let curY = descY;
        for (const line of visibleLines) {
            ctx.fillText(line, textX, curY);
            curY += preset.descLineHeight;
        }
    }

    return canvas;
}

async function exportVideo(character, animationFrames, canvasSize, outputPath) {
    const preset = VIDEO_PRESETS.portrait;
    const seed = character.params.seed;

    const { params: musicParams, sequences, totalDuration } = generateMusic(seed);
    const wavBuffer = renderWav(musicParams, sequences, totalDuration);
    const wavPath = outputPath.replace('.mp4', '.wav');
    fs.writeFileSync(wavPath, wavBuffer);

    const fps = preset.fps;
    const totalFrames = Math.ceil(totalDuration * fps);
    const totalDurationMs = totalDuration * 1000;
    const frameTimings = generateFrameSequence(musicParams.bpm, totalDurationMs);

    const frameList = [];
    let timingIdx = 0;
    for (let f = 0; f < totalFrames; f++) {
        const timeMs = (f / fps) * 1000;
        while (
            timingIdx < frameTimings.length - 1 &&
            timeMs >= frameTimings[timingIdx].startMs + frameTimings[timingIdx].durationMs
        ) {
            timingIdx++;
        }
        frameList.push(frameTimings[timingIdx].frameIndex);
    }

    const spriteCanvases = {};
    for (let i = 0; i < animationFrames.length; i++) {
        spriteCanvases[i] = renderPixelsToCanvas(animationFrames[i], canvasSize, preset.spriteSize);
    }

    const textMaxWidth = preset.width - preset.textMarginLeft * 2;
    const measureCtx = createCanvas(1, 1).getContext('2d');
    measureCtx.font = `${preset.nameFontSize}px "${preset.nameFont}", serif`;
    const fullNameWidth = measureCtx.measureText(character.name).width;
    measureCtx.font = `${preset.descFontSize}px "${preset.descFont}", sans-serif`;
    const descLines = wrapText(
        character.backstory || '',
        (t) => measureCtx.measureText(t).width,
        textMaxWidth
    );
    const timeline = buildTimeline(preset.textAnim, totalDuration);

    return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-y',
            '-f', 'rawvideo',
            '-pix_fmt', 'rgba',
            '-s', `${preset.width}x${preset.height}`,
            '-r', String(fps),
            '-i', 'pipe:0',
            '-i', wavPath,
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '23',
            '-pix_fmt', 'yuv420p',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-movflags', '+faststart',
            '-shortest',
            outputPath,
        ], { stdio: ['pipe', 'pipe', 'pipe'] });

        let stderrData = '';
        ffmpeg.stderr.on('data', (d) => { stderrData += d.toString(); });
        ffmpeg.on('close', (code) => {
            try { fs.unlinkSync(wavPath); } catch { }
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg exited with code ${code}\n${stderrData}`));
        });
        ffmpeg.on('error', (err) => {
            try { fs.unlinkSync(wavPath); } catch { }
            reject(err);
        });

        let frameIdx = 0;
        function writeNext() {
            while (frameIdx < frameList.length) {
                const timeSec = frameIdx / fps;
                const spriteIdx = frameList[frameIdx];
                const textState = getTextState(timeSec, timeline, character.name, descLines);
                const frameCanvas = drawVideoFrame(
                    spriteCanvases[spriteIdx], textState, descLines, fullNameWidth, preset
                );
                const ctx = frameCanvas.getContext('2d');
                const pixelData = ctx.getImageData(0, 0, frameCanvas.width, frameCanvas.height).data;
                frameIdx++;
                const canWrite = ffmpeg.stdin.write(Buffer.from(pixelData));
                if (!canWrite) {
                    ffmpeg.stdin.once('drain', writeNext);
                    return;
                }
            }
            ffmpeg.stdin.end();
        }
        writeNext();
    });
}

// ─── Manifest helpers ─────────────────────────────────────────────────────────

function loadManifest(manifestPath) {
    if (fs.existsSync(manifestPath)) {
        return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    }
    return [];
}

function saveManifest(manifestPath, manifest) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const opts = parseArgs();

    console.log(`\nCharacter Pixels — Batch Generator`);
    console.log(`====================================`);
    console.log(`Totale video:  ${opts.total}`);
    console.log(`  Umani:       ${opts.humans}`);
    console.log(`  Mostri:      ${opts.monsters}`);
    console.log(`  Ratio:       1:${(opts.humans / Math.max(opts.monsters, 1)).toFixed(1)}`);
    console.log(`Seed globale:  ${opts.seed !== null ? opts.seed : '(casuale)'}`);
    console.log(`Output:        ${opts.output}\n`);

    registerFonts();
    fs.mkdirSync(opts.output, { recursive: true });

    const manifestPath = path.join(opts.output, 'manifest.json');
    const manifest = loadManifest(manifestPath);

    // Istanze generator
    const humanGen = new HumanGenerator(opts.size);
    const monsterGen = new MonsterGenerator(opts.size);
    const humanBackstory = new HumanBackstoryGenerator();
    const monsterBackstory = new MonsterBackstoryGenerator();

    // Costruisce sequenza intercalata
    const typeSequence = buildTypeSequence(opts.humans, opts.monsters);

    // RNG: deterministico se --seed è fornito, altrimenti casuale
    const rng = opts.seed !== null ? mulberry32(opts.seed) : null;

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < typeSequence.length; i++) {
        const type = typeSequence[i];
        const seed = rng
            ? Math.floor(rng() * 2147483647)
            : Math.floor(Math.random() * 2147483647);
        const generator = type === 'monster' ? monsterGen : humanGen;
        const backstoryGen = type === 'monster' ? monsterBackstory : humanBackstory;

        // Monsters get a random body preset for variety; humans always use 'standard'
        const preset = type === 'monster'
            ? MONSTER_PRESETS[Math.abs(seed) % MONSTER_PRESETS.length]
            : 'standard';

        console.log(`[${i + 1}/${typeSequence.length}] ${type.toUpperCase()} [${preset}] — seed: ${seed}`);

        const character = generateCharacter(generator, backstoryGen, seed, preset);
        console.log(`  Nome: ${character.name}`);

        const safeName = character.name.replace(/[^a-zA-Z0-9-]/g, '_');
        const filename = `${safeName}_${seed}.mp4`;
        const outputPath = path.join(opts.output, filename);

        try {
            const animationFrames = generator.generateAnimationFrames(character.params);
            await exportVideo(character, animationFrames, opts.size, outputPath);

            const entry = {
                filename,
                name: character.name,
                type,
                seed,
                caption: buildCaption(character),
                status: 'ready',
                published_at: null,
            };

            manifest.push(entry);
            saveManifest(manifestPath, manifest);

            console.log(`  OK → ${filename}\n`);
            successCount++;
        } catch (err) {
            console.error(`  ERRORE: ${err.message}\n`);
            failCount++;
        }
    }

    console.log(`====================================`);
    console.log(`Completato: ${successCount} OK, ${failCount} errori`);
    console.log(`Manifest:   ${manifestPath}`);
    console.log(`\nProssimo step: carica la cartella output/ su Cloudflare R2`);
    console.log(`Vedi AUTOMATION.md per le istruzioni complete.\n`);
}

main().catch(err => {
    console.error('Errore fatale:', err);
    process.exit(1);
});
