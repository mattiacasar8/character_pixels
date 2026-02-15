// Music Configuration - Pure constants, zero runtime dependencies.
// All values are plain data: MIDI numbers, semitone intervals, string identifiers.

// Scales as semitone intervals from root
export const SCALES = {
    minor:          [0, 2, 3, 5, 7, 8, 10],
    harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
    dorian:         [0, 2, 3, 5, 7, 9, 10],
    phrygian:       [0, 1, 3, 5, 7, 8, 10],
};

export const SCALE_NAMES = Object.keys(SCALES);

// Root notes as MIDI numbers (C3=48 through B3=59)
export const ROOT_NOTES = [48, 50, 52, 53, 55, 57, 59]; // C D E F G A B (natural notes only)

// Waveform types as string identifiers (adapters map these to engine-specific types)
export const LEAD_WAVEFORMS = ['square', 'square', 'triangle', 'sawtooth', 'pulse'];
export const ARP_WAVEFORMS = ['pulse', 'square', 'triangle'];

// Melody motion styles
export const MELODY_MOTIONS = ['stepwise', 'jumpy', 'arpeggiated', 'chromatic'];

// Bass patterns
export const BASS_PATTERNS = ['root', 'root_fifth', 'walking', 'octave_jump', 'pulse'];

// Arpeggio interval patterns (scale degree offsets)
export const ARP_PATTERNS = [
    [0, 2, 4],         // 1-3-5 triad
    [0, 2, 4, 5],      // 1-3-5-6
    [0, 4, 2, 5],      // 1-5-3-6
    [0, 2, 4, 7],      // wide spread
    [0, 1, 2, 3],      // chromatic run
    [0, 2, 4, 2],      // bounce
];

// Rhythm patterns: arrays of { beat, dur } in sixteenth-note units (16 per bar)
export const RHYTHM_PATTERNS = [
    // Pattern 0: straight quarters
    [{ beat: 0, dur: 4 }, { beat: 4, dur: 4 }, { beat: 8, dur: 4 }, { beat: 12, dur: 4 }],
    // Pattern 1: dotted eighth feel
    [{ beat: 0, dur: 3 }, { beat: 3, dur: 3 }, { beat: 6, dur: 2 }, { beat: 8, dur: 3 }, { beat: 11, dur: 3 }, { beat: 14, dur: 2 }],
    // Pattern 2: syncopated
    [{ beat: 0, dur: 3 }, { beat: 3, dur: 5 }, { beat: 8, dur: 3 }, { beat: 11, dur: 5 }],
    // Pattern 3: sparse (half notes)
    [{ beat: 0, dur: 8 }, { beat: 8, dur: 8 }],
    // Pattern 4: busy sixteenths
    [{ beat: 0, dur: 2 }, { beat: 2, dur: 2 }, { beat: 4, dur: 2 }, { beat: 6, dur: 2 }, { beat: 8, dur: 2 }, { beat: 10, dur: 2 }, { beat: 12, dur: 2 }, { beat: 14, dur: 2 }],
    // Pattern 5: offbeat emphasis
    [{ beat: 2, dur: 4 }, { beat: 6, dur: 2 }, { beat: 10, dur: 4 }, { beat: 14, dur: 2 }],
    // Pattern 6: waltz-like (grouped in 3s within 4/4)
    [{ beat: 0, dur: 3 }, { beat: 3, dur: 3 }, { beat: 6, dur: 4 }, { beat: 10, dur: 3 }, { beat: 13, dur: 3 }],
    // Pattern 7: kick-snare feel
    [{ beat: 0, dur: 4 }, { beat: 4, dur: 2 }, { beat: 8, dur: 4 }, { beat: 12, dur: 2 }, { beat: 14, dur: 2 }],
];

// BPM range
export const BPM_RANGE = { min: 80, max: 140 };

// Default number of bars
export const DEFAULT_BARS = 6;

// Beats per bar (4/4 time)
export const BEATS_PER_BAR = 4;

// Sixteenth notes per bar
export const SIXTEENTHS_PER_BAR = 16;
