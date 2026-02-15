// WAV Renderer - Node.js audio synthesis from pure note sequences.
// Zero dependencies. Generates 16-bit PCM WAV from the same NoteSequences
// that Tone.js uses in the browser.

const SAMPLE_RATE = 44100;

/**
 * Convert MIDI note number to frequency in Hz.
 */
function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
}

// Waveform generators: input phase [0, 1), output [-1, 1]
const WAVEFORMS = {
    square:   (phase) => phase < 0.5 ? 1 : -1,
    triangle: (phase) => 4 * Math.abs(phase - 0.5) - 1,
    sawtooth: (phase) => 2 * phase - 1,
    pulse:    (phase) => phase < 0.25 ? 1 : -1,
};

/**
 * Simple ADSR envelope.
 */
function envelope(sampleIndex, totalSamples) {
    const attackSamples = Math.min(0.01 * SAMPLE_RATE, totalSamples * 0.1);
    const releaseSamples = Math.min(0.05 * SAMPLE_RATE, totalSamples * 0.3);

    if (sampleIndex < attackSamples) {
        return sampleIndex / attackSamples;
    }
    if (sampleIndex > totalSamples - releaseSamples) {
        return (totalSamples - sampleIndex) / releaseSamples;
    }
    return 1.0;
}

/**
 * Synthesize a single track of notes into a Float32Array.
 *
 * @param {Array<{time: number, note: number, duration: number, velocity: number}>} noteEvents
 * @param {string} waveformName - 'square' | 'triangle' | 'sawtooth' | 'pulse'
 * @param {number} totalDurationSec
 * @returns {Float32Array}
 */
function synthesizeTrack(noteEvents, waveformName, totalDurationSec) {
    const totalSamples = Math.ceil(totalDurationSec * SAMPLE_RATE);
    const buffer = new Float32Array(totalSamples);
    const wave = WAVEFORMS[waveformName] || WAVEFORMS.square;

    for (const { time, note, duration, velocity } of noteEvents) {
        const freq = midiToFreq(note);
        const startSample = Math.floor(time * SAMPLE_RATE);
        const numSamples = Math.floor(duration * SAMPLE_RATE);

        for (let i = 0; i < numSamples && (startSample + i) < totalSamples; i++) {
            const phase = ((startSample + i) * freq / SAMPLE_RATE) % 1;
            const env = envelope(i, numSamples);
            buffer[startSample + i] += wave(phase) * velocity * env;
        }
    }

    return buffer;
}

/**
 * Mix multiple tracks into a single buffer and convert to WAV.
 *
 * @param {Array<{buffer: Float32Array, volumeDb: number}>} tracks
 * @param {number} totalDurationSec
 * @returns {Buffer} WAV file as Node.js Buffer
 */
function mixToWav(tracks, totalDurationSec) {
    const totalSamples = Math.ceil(totalDurationSec * SAMPLE_RATE);
    const mixed = new Float32Array(totalSamples);

    for (const { buffer, volumeDb } of tracks) {
        const gain = Math.pow(10, volumeDb / 20);
        for (let i = 0; i < totalSamples; i++) {
            mixed[i] += (buffer[i] || 0) * gain;
        }
    }

    // Normalize to prevent clipping
    let peak = 0;
    for (let i = 0; i < totalSamples; i++) {
        peak = Math.max(peak, Math.abs(mixed[i]));
    }
    if (peak > 1) {
        for (let i = 0; i < totalSamples; i++) {
            mixed[i] /= peak;
        }
    }

    // Convert to 16-bit PCM
    const pcm = Buffer.alloc(totalSamples * 2);
    for (let i = 0; i < totalSamples; i++) {
        const sample = Math.max(-32768, Math.min(32767, Math.round(mixed[i] * 32767)));
        pcm.writeInt16LE(sample, i * 2);
    }

    return writeWavHeader(pcm);
}

/**
 * Wrap raw PCM data in a WAV header.
 */
function writeWavHeader(pcmData) {
    const header = Buffer.alloc(44);
    const dataLength = pcmData.length;

    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);           // fmt chunk size
    header.writeUInt16LE(1, 20);            // PCM format
    header.writeUInt16LE(1, 22);            // mono
    header.writeUInt32LE(SAMPLE_RATE, 24);
    header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
    header.writeUInt16LE(2, 32);            // block align
    header.writeUInt16LE(16, 34);           // bits per sample
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);

    return Buffer.concat([header, pcmData]);
}

/**
 * Render music to a WAV buffer from MusicParams and NoteSequences.
 * Volume levels match the browser Tone.js adapter (-6, -8, -14 dB).
 *
 * @param {import('../music-generator.js').MusicParams} params
 * @param {import('../music-generator.js').NoteSequences} sequences
 * @param {number} totalDuration - seconds
 * @returns {Buffer} WAV file
 */
export function renderWav(params, sequences, totalDuration) {
    const lead = synthesizeTrack(sequences.melody, params.leadWaveform, totalDuration);
    const bass = synthesizeTrack(sequences.bass, 'square', totalDuration);
    const arp = synthesizeTrack(sequences.arpeggio, params.arpWaveform, totalDuration);

    return mixToWav([
        { buffer: lead, volumeDb: -6 },
        { buffer: bass, volumeDb: -8 },
        { buffer: arp, volumeDb: -14 },
    ], totalDuration);
}
