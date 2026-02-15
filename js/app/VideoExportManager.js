/**
 * VideoExportManager
 * Browser: exports WebM video (preview quality) with canvas recording + Tone.js audio.
 * Production MP4 export is handled by the CLI tool (cli/export-video.js).
 */
import { generateMusic } from '../audio/music-generator.js';
import { generateFrameSequence } from '../audio/frame-sequence.js';
import { renderOffline } from '../audio/browser/tone-adapter.js';
import { wrapText, buildTimeline, getTextState, getVisibleLines } from '../audio/text-animation.js';
import { VIDEO_PRESETS } from '../config.js';

export class VideoExportManager {
    constructor(app) {
        this.app = app;
        this.isExporting = false;
    }

    /**
     * Export a character as a WebM video with music (browser preview).
     * For MP4 production, use: node cli/export-video.js --seed <seed>
     */
    async exportVideo(character) {
        if (this.isExporting) {
            console.warn('Export already in progress.');
            return;
        }

        this.isExporting = true;
        const overlay = this._showProgressOverlay('Preparing...');

        try {
            this._ensureAnimationFrames(character);

            // Step 1: Generate music
            this._updateProgress(overlay, 'Generating audio...');
            const { params, sequences, totalDuration } = generateMusic(character.params.seed);

            // Step 2: Generate frame sequence
            const totalDurationMs = totalDuration * 1000;
            const frameTimings = generateFrameSequence(params.bpm, totalDurationMs);

            // Step 3: Render audio offline
            const audioBuffer = await renderOffline(params, sequences, totalDuration);

            // Step 4: Record video as WebM
            this._updateProgress(overlay, 'Recording video...');
            const webmBlob = await this._recordVideo(character, frameTimings, audioBuffer, totalDuration);

            // Step 5: Download
            this._downloadBlob(webmBlob, `${character.name.replace(/\s+/g, '_')}_video.webm`);

        } catch (err) {
            console.error('Video export failed:', err);
            alert('Video export failed. Check the console for details.');
        } finally {
            this._hideProgressOverlay(overlay);
            this.isExporting = false;
        }
    }

    _ensureAnimationFrames(char) {
        if (!char.animationFrames) {
            char.animationFrames = this.app.currentGenerator.generateAnimationFrames(char.params);
        }
    }

    /**
     * Record animated canvas + audio as WebM blob.
     */
    async _recordVideo(character, frameTimings, audioBuffer, totalDuration) {
        const preset = VIDEO_PRESETS.portrait;
        const canvas = document.createElement('canvas');
        canvas.width = preset.width;
        canvas.height = preset.height;
        const ctx = canvas.getContext('2d');

        // Pre-compute text layout
        const textMaxWidth = preset.width - preset.textMarginLeft * 2;

        ctx.font = `${preset.nameFontSize}px "${preset.nameFont}", serif`;
        const fullNameWidth = ctx.measureText(character.name).width;

        ctx.font = `${preset.descFontSize}px "${preset.descFont}", sans-serif`;
        const descLines = wrapText(
            character.backstory || '',
            (t) => ctx.measureText(t).width,
            textMaxWidth
        );

        // Build animation timeline
        const timeline = buildTimeline(preset.textAnim, totalDuration);

        // Set up audio for recording (not playback)
        const audioCtx = new AudioContext();
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        const streamDest = audioCtx.createMediaStreamDestination();
        source.connect(streamDest);

        // Combine canvas video stream + audio stream
        const videoStream = canvas.captureStream(preset.fps);
        const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...streamDest.stream.getAudioTracks(),
        ]);

        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
            ? 'video/webm;codecs=vp9,opus'
            : 'video/webm';

        const recorder = new MediaRecorder(combinedStream, {
            mimeType,
            videoBitsPerSecond: 5_000_000,
        });

        const chunks = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        return new Promise((resolve, reject) => {
            recorder.onstop = () => {
                audioCtx.close();
                resolve(new Blob(chunks, { type: 'video/webm' }));
            };
            recorder.onerror = (e) => {
                audioCtx.close();
                reject(e.error || new Error('MediaRecorder error'));
            };

            recorder.start();
            source.start();

            this._animateFrames(ctx, character, frameTimings, preset, timeline, descLines, fullNameWidth).then(() => {
                setTimeout(() => {
                    recorder.stop();
                    source.stop();
                }, 100);
            });
        });
    }

    /**
     * Draw a complete frame: background + sprite + animated text.
     */
    _drawFrame(ctx, character, frameIndex, preset, textState, descLines, fullNameWidth) {
        const textX = preset.textMarginLeft;
        const textMaxWidth = preset.width - preset.textMarginLeft * 2;

        // Background
        ctx.fillStyle = preset.backgroundColor;
        ctx.fillRect(0, 0, preset.width, preset.height);

        // Character sprite (centered)
        const spriteX = (preset.width - preset.spriteSize) / 2;
        const spriteY = preset.spritePaddingTop;
        const charCanvas = this.app.characterRenderer.createCanvas();
        this.app.characterRenderer.drawCharacter(charCanvas, character, {
            showFinal: true,
            frameIndex,
        });
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(charCanvas, spriteX, spriteY, preset.spriteSize, preset.spriteSize);

        // Name (animated: letter by letter)
        const nameY = preset.spritePaddingTop + preset.spriteSize + preset.gapSpriteToName;
        if (textState.visibleName.length > 0) {
            ctx.fillStyle = preset.textColor;
            ctx.font = `${preset.nameFontSize}px "${preset.nameFont}", serif`;
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillText(textState.visibleName, textX, nameY);
        }

        // Separator line (proportional to full name width, animated)
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
    }

    async _animateFrames(ctx, character, frameTimings, preset, timeline, descLines, fullNameWidth) {
        let elapsedMs = 0;
        for (const frame of frameTimings) {
            const timeSec = elapsedMs / 1000;
            const textState = getTextState(timeSec, timeline, character.name, descLines);
            this._drawFrame(ctx, character, frame.frameIndex, preset, textState, descLines, fullNameWidth);
            await this._sleep(frame.durationMs);
            elapsedMs += frame.durationMs;
        }
    }

    // --- Helpers ---

    _downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    _showProgressOverlay(text) {
        const overlay = document.createElement('div');
        overlay.className = 'video-export-overlay';
        overlay.innerHTML = `<div class="video-export-progress"><span class="video-export-text">${text}</span></div>`;
        document.body.appendChild(overlay);
        return overlay;
    }

    _updateProgress(overlay, text) {
        if (overlay) {
            const el = overlay.querySelector('.video-export-text');
            if (el) el.textContent = text;
        }
    }

    _hideProgressOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
}
