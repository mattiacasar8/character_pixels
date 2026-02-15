// Frame Sequence Generator - Pure module, zero browser dependencies.
// Generates animation frame timing synced to BPM.

/**
 * Generate a frame timing sequence synced to BPM.
 * Uses ping-pong pattern: 0 -> 1 -> 2 -> 1 -> 0 -> 1 -> 2 -> ...
 * Each frame lasts one beat (60000 / bpm ms).
 *
 * @param {number} bpm - Beats per minute
 * @param {number} totalDurationMs - Total music duration in milliseconds
 * @returns {{ frameIndex: number, startMs: number, durationMs: number }[]}
 */
export function generateFrameSequence(bpm, totalDurationMs) {
    const beatDurationMs = 60000 / bpm;
    const pingPong = [0, 1, 2, 1]; // One full cycle
    const frames = [];
    let elapsed = 0;
    let cycleIndex = 0;

    while (elapsed < totalDurationMs) {
        const frameIndex = pingPong[cycleIndex % pingPong.length];
        const remaining = totalDurationMs - elapsed;
        const durationMs = Math.min(beatDurationMs, remaining);

        frames.push({ frameIndex, startMs: elapsed, durationMs });

        elapsed += durationMs;
        cycleIndex++;
    }

    return frames;
}
