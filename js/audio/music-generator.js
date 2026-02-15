// Music Generator - Pure module, zero browser dependencies.
// Generates deterministic music parameters and note sequences from a character seed.
// All times in seconds, all notes as MIDI numbers.

import { SeededRandom } from '../utils/random.js';
import {
    SCALES, SCALE_NAMES, ROOT_NOTES, LEAD_WAVEFORMS, ARP_WAVEFORMS,
    MELODY_MOTIONS, BASS_PATTERNS, ARP_PATTERNS, RHYTHM_PATTERNS,
    BPM_RANGE, DEFAULT_BARS, BEATS_PER_BAR, SIXTEENTHS_PER_BAR
} from './music-config.js';

const SEED_SALT = 99999;

/**
 * Generate music parameters deterministically from a character seed.
 * Uses a salted seed to decorrelate from character body parameters.
 *
 * @param {number} seed - Character seed
 * @param {number} [bars=DEFAULT_BARS] - Number of bars
 * @returns {MusicParams}
 */
export function generateMusicParams(seed, bars = DEFAULT_BARS) {
    const rng = new SeededRandom(seed + SEED_SALT);

    const bpm = rng.int(BPM_RANGE.min, BPM_RANGE.max);
    const rootNote = ROOT_NOTES[rng.int(0, ROOT_NOTES.length - 1)];
    const scaleName = SCALE_NAMES[rng.int(0, SCALE_NAMES.length - 1)];
    const scale = SCALES[scaleName];
    const leadWaveform = LEAD_WAVEFORMS[rng.int(0, LEAD_WAVEFORMS.length - 1)];
    const arpWaveform = ARP_WAVEFORMS[rng.int(0, ARP_WAVEFORMS.length - 1)];
    const melodyMotion = MELODY_MOTIONS[rng.int(0, MELODY_MOTIONS.length - 1)];
    const bassPattern = BASS_PATTERNS[rng.int(0, BASS_PATTERNS.length - 1)];
    const arpPattern = ARP_PATTERNS[rng.int(0, ARP_PATTERNS.length - 1)];
    const rhythmPatternIndex = rng.int(0, RHYTHM_PATTERNS.length - 1);
    const rhythmPattern = RHYTHM_PATTERNS[rhythmPatternIndex];

    return {
        seed,
        bpm,
        rootNote,
        scaleName,
        scale,
        bars,
        leadWaveform,
        arpWaveform,
        melodyMotion,
        bassPattern,
        arpPattern,
        rhythmPatternIndex,
        rhythmPattern,
    };
}

/**
 * Generate all note sequences from music params.
 *
 * @param {MusicParams} params
 * @returns {{ melody: NoteEvent[], bass: NoteEvent[], arpeggio: NoteEvent[] }}
 */
export function generateNoteSequences(params) {
    // Use a separate RNG derived from seed for note generation, so adding/removing
    // params in generateMusicParams doesn't break note determinism.
    const rng = new SeededRandom(params.seed + SEED_SALT + 1);

    const melody = generateMelody(params, rng);
    const bass = generateBass(params, rng);
    const arpeggio = generateArpeggio(params, rng);

    return { melody, bass, arpeggio };
}

/**
 * Convenience: generate everything from a seed.
 *
 * @param {number} seed
 * @param {number} [bars]
 * @returns {{ params: MusicParams, sequences: NoteSequences, totalDuration: number }}
 */
export function generateMusic(seed, bars = DEFAULT_BARS) {
    const params = generateMusicParams(seed, bars);
    const sequences = generateNoteSequences(params);
    const totalDuration = bars * BEATS_PER_BAR * (60 / params.bpm);
    return { params, sequences, totalDuration };
}

// --- Internal helpers ---

/**
 * Convert a scale degree to a MIDI note number.
 * @param {number[]} scale - Scale intervals
 * @param {number} rootNote - MIDI root note
 * @param {number} degree - Scale degree (can be negative or > scale length for octave wrapping)
 * @returns {number} MIDI note number
 */
function scaleToMidi(scale, rootNote, degree) {
    const octaveOffset = Math.floor(degree / scale.length);
    const degreeInScale = ((degree % scale.length) + scale.length) % scale.length;
    return rootNote + scale[degreeInScale] + octaveOffset * 12;
}

/**
 * Convert sixteenth-note position to seconds.
 * @param {number} sixteenth - Position in sixteenth notes from start
 * @param {number} bpm - Beats per minute
 * @returns {number} Time in seconds
 */
function sixteenthToSeconds(sixteenth, bpm) {
    return sixteenth * (60 / bpm / 4);
}

/**
 * Generate melody note sequence.
 */
function generateMelody(params, rng) {
    const { scale, rootNote, bpm, bars, melodyMotion, rhythmPattern } = params;
    const notes = [];
    let currentDegree = rng.int(0, scale.length - 1); // Start on a random scale degree

    for (let bar = 0; bar < bars; bar++) {
        for (const slot of rhythmPattern) {
            const sixteenth = bar * SIXTEENTHS_PER_BAR + slot.beat;
            const time = sixteenthToSeconds(sixteenth, bpm);
            const duration = sixteenthToSeconds(slot.dur, bpm) * 0.9; // Slight gap

            // Move currentDegree based on motion style
            currentDegree = advanceMelodyDegree(currentDegree, melodyMotion, scale.length, rng);

            // Keep melody in a reasonable range (root octave + 1 octave above)
            while (currentDegree < 0) currentDegree += scale.length;
            while (currentDegree >= scale.length * 2) currentDegree -= scale.length;

            const midi = scaleToMidi(scale, rootNote, currentDegree);
            const velocity = 0.6 + rng.next() * 0.3; // 0.6 - 0.9

            notes.push({ time, note: midi, duration, velocity });
        }
    }

    return notes;
}

/**
 * Advance melody degree based on motion style.
 */
function advanceMelodyDegree(current, motion, scaleLen, rng) {
    switch (motion) {
        case 'stepwise':
            return current + rng.int(-2, 2);
        case 'jumpy':
            return current + rng.int(-5, 5);
        case 'arpeggiated': {
            // Cycle through chord tones: 0, 2, 4 (relative to current octave)
            const chordTones = [0, 2, 4];
            const octave = Math.floor(current / scaleLen);
            return octave * scaleLen + chordTones[rng.int(0, chordTones.length - 1)];
        }
        case 'chromatic':
            return current + (rng.next() > 0.5 ? 1 : -1);
        default:
            return current + rng.int(-1, 1);
    }
}

/**
 * Generate bass note sequence.
 */
function generateBass(params, rng) {
    const { scale, rootNote, bpm, bars, bassPattern } = params;
    const notes = [];
    const bassRoot = rootNote - 12; // One octave below

    for (let bar = 0; bar < bars; bar++) {
        const barNotes = generateBassBar(scale, bassRoot, bassPattern, bar, bpm, rng);
        notes.push(...barNotes);
    }

    return notes;
}

/**
 * Generate one bar of bass notes.
 */
function generateBassBar(scale, bassRoot, pattern, bar, bpm, rng) {
    const notes = [];
    const barStart = bar * SIXTEENTHS_PER_BAR;

    switch (pattern) {
        case 'root': {
            // Whole note on root
            notes.push({
                time: sixteenthToSeconds(barStart, bpm),
                note: bassRoot,
                duration: sixteenthToSeconds(SIXTEENTHS_PER_BAR, bpm) * 0.9,
                velocity: 0.7,
            });
            break;
        }
        case 'root_fifth': {
            // Root on beat 1, fifth on beat 3
            const fifth = scaleToMidi(scale, bassRoot, 4); // 5th degree
            notes.push({
                time: sixteenthToSeconds(barStart, bpm),
                note: bassRoot,
                duration: sixteenthToSeconds(8, bpm) * 0.9,
                velocity: 0.7,
            });
            notes.push({
                time: sixteenthToSeconds(barStart + 8, bpm),
                note: fifth,
                duration: sixteenthToSeconds(8, bpm) * 0.9,
                velocity: 0.65,
            });
            break;
        }
        case 'walking': {
            // Quarter notes walking through scale degrees
            const degrees = [0, rng.int(1, 3), rng.int(2, 5), rng.int(3, 6)];
            for (let i = 0; i < 4; i++) {
                notes.push({
                    time: sixteenthToSeconds(barStart + i * 4, bpm),
                    note: scaleToMidi(scale, bassRoot, degrees[i]),
                    duration: sixteenthToSeconds(4, bpm) * 0.85,
                    velocity: 0.65 + (i === 0 ? 0.1 : 0),
                });
            }
            break;
        }
        case 'octave_jump': {
            // Alternating root and octave above
            for (let i = 0; i < 4; i++) {
                notes.push({
                    time: sixteenthToSeconds(barStart + i * 4, bpm),
                    note: i % 2 === 0 ? bassRoot : bassRoot + 12,
                    duration: sixteenthToSeconds(4, bpm) * 0.8,
                    velocity: 0.7,
                });
            }
            break;
        }
        case 'pulse': {
            // Eighth note pulse on root
            for (let i = 0; i < 8; i++) {
                notes.push({
                    time: sixteenthToSeconds(barStart + i * 2, bpm),
                    note: bassRoot,
                    duration: sixteenthToSeconds(2, bpm) * 0.7,
                    velocity: 0.5 + (i % 2 === 0 ? 0.15 : 0),
                });
            }
            break;
        }
    }

    return notes;
}

/**
 * Generate arpeggio note sequence.
 */
function generateArpeggio(params, rng) {
    const { scale, rootNote, bpm, bars, arpPattern } = params;
    const notes = [];
    const arpRoot = rootNote + 12; // One octave above root for brightness

    for (let bar = 0; bar < bars; bar++) {
        const barStart = bar * SIXTEENTHS_PER_BAR;
        let patternIdx = 0;

        // Arpeggiate in sixteenth notes
        for (let i = 0; i < SIXTEENTHS_PER_BAR; i++) {
            const degree = arpPattern[patternIdx % arpPattern.length];
            const midi = scaleToMidi(scale, arpRoot, degree);

            notes.push({
                time: sixteenthToSeconds(barStart + i, bpm),
                note: midi,
                duration: sixteenthToSeconds(1, bpm) * 0.7,
                velocity: 0.3 + (patternIdx % arpPattern.length === 0 ? 0.1 : 0),
            });

            patternIdx++;
        }
    }

    return notes;
}
