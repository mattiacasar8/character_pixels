// Tone.js Browser Adapter
// Wraps Tone.js (loaded via CDN as global) for live preview and offline rendering.
// This is the ONLY module that touches Tone.js — all other audio code is pure.

/**
 * Get Tone.js global, throwing if not loaded.
 */
function getTone() {
    if (typeof Tone === 'undefined') {
        throw new Error('Tone.js not loaded. Ensure the CDN script is included.');
    }
    return Tone;
}

/**
 * Convert MIDI note number to Tone.js note string.
 * E.g., 60 → "C4", 48 → "C3"
 */
export function midiToToneNote(midi) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const name = noteNames[midi % 12];
    return `${name}${octave}`;
}

/**
 * Create Tone.js synths for the three tracks.
 * Returns synths and a dispose function to clean up.
 *
 * @param {import('../music-generator.js').MusicParams} params
 * @param {object} [destination] - Tone.js destination node (defaults to Tone.Destination)
 * @returns {{ lead: Tone.Synth, bass: Tone.Synth, arp: Tone.Synth, dispose: Function }}
 */
export function createSynths(params, destination) {
    const T = getTone();
    const dest = destination || T.Destination;

    const leadVol = new T.Volume(-6).connect(dest);
    const bassVol = new T.Volume(-8).connect(dest);
    const arpVol = new T.Volume(-14).connect(dest);

    const lead = new T.Synth({
        oscillator: { type: params.leadWaveform === 'pulse' ? 'square' : params.leadWaveform },
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.4, release: 0.2 },
    }).connect(leadVol);

    const bass = new T.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.6, release: 0.15 },
    }).connect(bassVol);

    const arp = new T.Synth({
        oscillator: { type: params.arpWaveform === 'pulse' ? 'square' : params.arpWaveform },
        envelope: { attack: 0.005, decay: 0.08, sustain: 0.2, release: 0.1 },
    }).connect(arpVol);

    return {
        lead, bass, arp,
        dispose() {
            lead.dispose();
            bass.dispose();
            arp.dispose();
            leadVol.dispose();
            bassVol.dispose();
            arpVol.dispose();
        }
    };
}

/**
 * Schedule all note sequences on Tone.js Transport for live playback.
 *
 * @param {import('../music-generator.js').NoteSequences} sequences
 * @param {{ lead: Tone.Synth, bass: Tone.Synth, arp: Tone.Synth }} synths
 * @param {number} bpm
 * @param {number} totalDuration - Total loop duration in seconds
 * @returns {{ start: Function, stop: Function, dispose: Function }}
 */
export function schedulePlayback(sequences, synths, bpm, totalDuration) {
    const T = getTone();
    T.Transport.bpm.value = bpm;
    T.Transport.loop = true;
    T.Transport.loopStart = 0;
    T.Transport.loopEnd = totalDuration;

    const parts = [];

    // Schedule each track as a Tone.Part
    const trackMap = [
        { events: sequences.melody, synth: synths.lead },
        { events: sequences.bass, synth: synths.bass },
        { events: sequences.arpeggio, synth: synths.arp },
    ];

    for (const { events, synth } of trackMap) {
        const partEvents = events.map(e => [e.time, e]);
        const part = new T.Part((time, event) => {
            synth.triggerAttackRelease(
                midiToToneNote(event.note),
                event.duration,
                time,
                event.velocity
            );
        }, partEvents);
        part.start(0);
        parts.push(part);
    }

    let started = false;

    return {
        async start() {
            await T.start(); // Required for browser autoplay policy
            T.Transport.start();
            started = true;
        },
        stop() {
            if (started) {
                T.Transport.stop();
                T.Transport.cancel(); // Clear all scheduled events
                T.Transport.position = 0;
                started = false;
            }
        },
        dispose() {
            this.stop();
            T.Transport.loop = false;
            T.Transport.cancel();
            for (const part of parts) {
                part.dispose();
            }
            parts.length = 0;
        }
    };
}

/**
 * Render audio offline to an AudioBuffer using Tone.Offline.
 * Used for video export (complete audio buffer, no realtime playback).
 *
 * @param {import('../music-generator.js').MusicParams} params
 * @param {import('../music-generator.js').NoteSequences} sequences
 * @param {number} totalDuration - Duration in seconds
 * @returns {Promise<AudioBuffer>}
 */
export async function renderOffline(params, sequences, totalDuration) {
    const T = getTone();

    const buffer = await T.Offline(({ transport }) => {
        transport.bpm.value = params.bpm;

        // Create synths inline using .toDestination() which correctly routes
        // to the offline context in Tone.js v14. Do NOT use createSynths()
        // here — it references the live context's Tone.Destination.
        const leadVol = new T.Volume(-6).toDestination();
        const bassVol = new T.Volume(-8).toDestination();
        const arpVol = new T.Volume(-14).toDestination();

        const lead = new T.Synth({
            oscillator: { type: params.leadWaveform === 'pulse' ? 'square' : params.leadWaveform },
            envelope: { attack: 0.01, decay: 0.15, sustain: 0.4, release: 0.2 },
        }).connect(leadVol);

        const bass = new T.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.6, release: 0.15 },
        }).connect(bassVol);

        const arp = new T.Synth({
            oscillator: { type: params.arpWaveform === 'pulse' ? 'square' : params.arpWaveform },
            envelope: { attack: 0.005, decay: 0.08, sustain: 0.2, release: 0.1 },
        }).connect(arpVol);

        const trackMap = [
            { events: sequences.melody, synth: lead },
            { events: sequences.bass, synth: bass },
            { events: sequences.arpeggio, synth: arp },
        ];

        for (const { events, synth } of trackMap) {
            const partEvents = events.map(e => [e.time, e]);
            const part = new T.Part((time, event) => {
                synth.triggerAttackRelease(
                    midiToToneNote(event.note),
                    event.duration,
                    time,
                    event.velocity
                );
            }, partEvents);
            part.start(0);
        }

        transport.start(0);
    }, totalDuration);

    // Tone.Offline in v14 returns a ToneAudioBuffer, not a native AudioBuffer.
    // Extract the native AudioBuffer via .get()
    return buffer.get();
}
