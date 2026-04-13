#!/usr/bin/env node

/**
 * CLI Video Export Tool
 *
 * Generates MP4 videos from character seeds using:
 * - Pure character generation (no DOM)
 * - @napi-rs/canvas for frame rendering
 * - Raw PCM synthesis for audio (WAV)
 * - ffmpeg (native) for video assembly
 *
 * Usage:
 *   node cli/export-video.js --seed 12345              # Single video
 *   node cli/export-video.js --seed 12345,67890,11111   # Multiple seeds
 *   node cli/export-video.js --count 5                  # Random batch
 *   node cli/export-video.js --count 5 --type monster   # Monster batch
 *
 * Options:
 *   --seed <n>        Comma-separated seeds
 *   --count <n>       Generate n random characters
 *   --type <type>     'human' (default) or 'monster'
 *   --preset <name>   Body preset (standard, athletic, slim, stocky, tall)
 *   --output <dir>    Output directory (default: ./output)
 *   --size <n>        Canvas size in px (default: 50)
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

// Project imports (pure modules)
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

// --- Parse CLI args ---

function parseArgs() {
    const args = process.argv.slice(2);
    const opts = {
        seeds: [],
        count: 0,
        type: 'human',
        preset: 'standard',
        output: path.join(ROOT, 'output'),
        size: 50,
        lang: 'ita',
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--seed':
                opts.seeds = args[++i].split(',').map(Number);
                break;
            case '--count':
                opts.count = parseInt(args[++i], 10);
                break;
            case '--type':
                opts.type = args[++i];
                break;
            case '--preset':
                opts.preset = args[++i];
                break;
            case '--output':
                opts.output = path.resolve(args[++i]);
                break;
            case '--size':
                opts.size = parseInt(args[++i], 10);
                break;
            case '--lang':
                opts.lang = args[++i];
                break;
            case '--help':
                console.log(`Usage: node cli/export-video.js [options]

Options:
  --seed <n[,n,...]>  Character seed(s), comma-separated
  --count <n>         Generate n random characters
  --type <type>       'human' or 'monster' (default: human)
  --preset <name>     Body preset (default: standard)
  --output <dir>      Output directory (default: ./output)
  --size <n>          Canvas pixel size (default: 50)
  --lang <lang>       Language: 'ita' or 'eng' (default: ita)
  --help              Show this help`);
                process.exit(0);
        }
    }

    if (opts.seeds.length === 0 && opts.count === 0) {
        opts.count = 1; // Default: generate 1 random character
    }

    return opts;
}

// --- Register fonts ---

function registerFonts() {
    const fontsDir = path.join(ROOT, 'assets', 'fonts');

    // Try to register local fonts
    const fontFiles = [
        { file: 'InstrumentSerif-Regular.ttf', family: 'Instrument Serif' },
        { file: 'Inter-Regular.ttf', family: 'Inter' },
    ];

    for (const { file, family } of fontFiles) {
        const fontPath = path.join(fontsDir, file);
        if (fs.existsSync(fontPath)) {
            GlobalFonts.registerFromPath(fontPath, family);
        } else {
            console.warn(`Font not found: ${fontPath} — text will use fallback font`);
        }
    }
}

// --- Character generation (pure, no DOM) ---

function generateCharacter(generator, backstoryGenerator, preset, seed = null) {
    const params = generator.randomParamsInRange(preset, seed);

    // Add default effects
    params.effects = { smoothing: true, lighting: true, outline: false };
    params.lightDirection = 'top-left';

    const character = generator.generate(params);
    character.backstory = backstoryGenerator.generate(character.name);

    return character;
}

// --- Render pixels to canvas ---

function renderPixelsToCanvas(pixels, canvasSize, targetSize) {
    const canvas = createCanvas(targetSize, targetSize);
    const ctx = canvas.getContext('2d');

    // Scale factor
    const scale = targetSize / canvasSize;

    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const color = pixels[y]?.[x];
            if (color && color.r !== undefined) {
                ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                ctx.fillRect(Math.floor(x * scale), Math.floor(y * scale),
                    Math.ceil(scale), Math.ceil(scale));
            }
        }
    }

    return canvas;
}

// --- Draw video frame with animated text ---

/**
 * Draw a single video frame with sprite + animated text.
 * @param {object} spriteCanvas - pre-rendered sprite canvas for this animation frame
 * @param {object} textState - from getTextState()
 * @param {string[]} descLines - pre-wrapped description lines
 * @param {number} fullNameWidth - measured pixel width of full name (for separator sizing)
 * @param {object} preset - VIDEO_PRESETS.portrait
 * @returns {Canvas}
 */
function drawVideoFrame(spriteCanvas, textState, descLines, fullNameWidth, preset) {
    const canvas = createCanvas(preset.width, preset.height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = preset.backgroundColor;
    ctx.fillRect(0, 0, preset.width, preset.height);

    // Character sprite (centered)
    const spriteX = (preset.width - preset.spriteSize) / 2;
    ctx.drawImage(spriteCanvas, spriteX, preset.spritePaddingTop);

    // Text layout
    const textX = preset.textMarginLeft;
    const textMaxWidth = preset.width - preset.textMarginLeft * 2;
    const nameY = preset.spritePaddingTop + preset.spriteSize + preset.gapSpriteToName;

    // Name (animated: letter by letter)
    if (textState.visibleName.length > 0) {
        ctx.fillStyle = preset.textColor;
        ctx.font = `${preset.nameFontSize}px "${preset.nameFont}", serif`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(textState.visibleName, textX, nameY);
    }

    // Separator line (proportional to full name width, animated: grows left to right)
    const lineY = nameY + preset.nameFontSize + preset.separatorGapAbove;
    if (textState.separatorProgress > 0) {
        const separatorFullWidth = fullNameWidth;
        const separatorWidth = separatorFullWidth * textState.separatorProgress;
        ctx.fillStyle = preset.separatorColor;
        ctx.fillRect(textX, lineY, separatorWidth, preset.separatorHeight);
    }

    // Description (animated: word by word)
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

// --- FFmpeg pipeline ---

async function exportVideoForCharacter(character, animationFrames, canvasSize, outputPath) {
    const preset = VIDEO_PRESETS.portrait;
    const seed = character.params.seed;

    // Step 1: Generate music + audio WAV
    const { params: musicParams, sequences, totalDuration } = generateMusic(seed);
    const wavBuffer = renderWav(musicParams, sequences, totalDuration);

    // Write WAV to temp file
    const wavPath = outputPath.replace('.mp4', '.wav');
    fs.writeFileSync(wavPath, wavBuffer);

    // Step 2: Generate frame sequence (sprite animation timing)
    const totalDurationMs = totalDuration * 1000;
    const frameTimings = generateFrameSequence(musicParams.bpm, totalDurationMs);

    // Step 3: Expand frame timings to per-video-frame list at target FPS
    const fps = preset.fps;
    const totalFrames = Math.ceil(totalDuration * fps);
    const frameList = []; // sprite frameIndex for each video frame

    let timingIdx = 0;
    for (let f = 0; f < totalFrames; f++) {
        const timeMs = (f / fps) * 1000;
        while (timingIdx < frameTimings.length - 1 &&
               timeMs >= frameTimings[timingIdx].startMs + frameTimings[timingIdx].durationMs) {
            timingIdx++;
        }
        frameList.push(frameTimings[timingIdx].frameIndex);
    }

    // Step 4: Pre-render sprite canvases (only 3 unique animation frames)
    const spriteCanvases = {};
    for (let i = 0; i < animationFrames.length; i++) {
        spriteCanvases[i] = renderPixelsToCanvas(animationFrames[i], canvasSize, preset.spriteSize);
    }

    // Step 5: Pre-compute text layout + animation timeline
    const textMaxWidth = preset.width - preset.textMarginLeft * 2;
    const measureCtx = createCanvas(1, 1).getContext('2d');

    // Measure full name width for separator sizing
    measureCtx.font = `${preset.nameFontSize}px "${preset.nameFont}", serif`;
    const fullNameWidth = measureCtx.measureText(character.name).width;

    // Wrap description text
    measureCtx.font = `${preset.descFontSize}px "${preset.descFont}", sans-serif`;
    const descLines = wrapText(
        character.backstory || '',
        (t) => measureCtx.measureText(t).width,
        textMaxWidth
    );

    // Build animation timeline
    const timeline = buildTimeline(preset.textAnim, totalDuration);

    // Step 6: Spawn ffmpeg and pipe dynamically rendered frames
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
            try { fs.unlinkSync(wavPath); } catch {}
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`ffmpeg exited with code ${code}\n${stderrData}`));
            }
        });

        ffmpeg.on('error', (err) => {
            try { fs.unlinkSync(wavPath); } catch {}
            reject(err);
        });

        // Render and pipe each frame
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

// --- Main ---

async function main() {
    const opts = parseArgs();

    // Register fonts
    registerFonts();

    // Create output directory
    fs.mkdirSync(opts.output, { recursive: true });

    // Create generator
    const generator = opts.type === 'monster'
        ? new MonsterGenerator(opts.size, opts.lang)
        : new HumanGenerator(opts.size, opts.lang);

    const backstoryGenerator = opts.type === 'monster'
        ? new MonsterBackstoryGenerator(opts.lang)
        : new HumanBackstoryGenerator(opts.lang);

    // Determine seeds
    let seeds = opts.seeds;
    if (seeds.length === 0) {
        for (let i = 0; i < opts.count; i++) {
            seeds.push(Math.floor(Math.random() * 2147483647));
        }
    }

    console.log(`Generating ${seeds.length} video(s)...\n`);

    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        console.log(`[${i + 1}/${seeds.length}] Seed: ${seed}`);

        // Generate character
        const character = generateCharacter(generator, backstoryGenerator, opts.preset, seed);
        console.log(`  Name: ${character.name}`);

        // Generate animation frames
        const animationFrames = generator.generateAnimationFrames(character.params);
        console.log(`  Frames: ${animationFrames.length}`);

        // Generate music params for info
        const { params: musicParams, totalDuration } = generateMusic(seed);
        console.log(`  Music: ${musicParams.bpm} BPM, ${musicParams.scaleName}, ${totalDuration.toFixed(1)}s`);

        // Export video
        const safeName = character.name.replace(/[^a-zA-Z0-9-]/g, '_');
        const outputPath = path.join(opts.output, `${safeName}_${seed}.mp4`);

        try {
            await exportVideoForCharacter(character, animationFrames, opts.size, outputPath);
            console.log(`  Output: ${outputPath}\n`);
        } catch (err) {
            console.error(`  FAILED: ${err.message}\n`);
        }
    }

    console.log('Done.');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
