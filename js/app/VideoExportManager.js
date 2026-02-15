/**
 * VideoExportManager
 * Browser: exports WebM video (preview quality) with canvas recording + Tone.js audio.
 * Production MP4 export is handled by the CLI tool (cli/export-video.js).
 */
import { generateMusic } from '../audio/music-generator.js';
import { generateFrameSequence } from '../audio/frame-sequence.js';
import { renderOffline } from '../audio/browser/tone-adapter.js';
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
            const webmBlob = await this._recordVideo(character, frameTimings, audioBuffer);

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
    async _recordVideo(character, frameTimings, audioBuffer) {
        const preset = VIDEO_PRESETS.portrait;
        const canvas = document.createElement('canvas');
        canvas.width = preset.width;
        canvas.height = preset.height;
        const ctx = canvas.getContext('2d');

        // Draw static elements (background, name, backstory)
        this._drawStaticLayout(ctx, character, preset);

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

            this._animateFrames(ctx, character, frameTimings, preset).then(() => {
                setTimeout(() => {
                    recorder.stop();
                    source.stop();
                }, 100);
            });
        });
    }

    _drawStaticLayout(ctx, character, preset) {
        ctx.fillStyle = preset.backgroundColor;
        ctx.fillRect(0, 0, preset.width, preset.height);

        const nameY = preset.spritePaddingTop + preset.spriteSize + preset.gapSpriteToName;
        ctx.fillStyle = preset.textColor;
        ctx.font = `${preset.nameFontSize}px "${preset.nameFont}", serif`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.fillText(character.name, preset.width / 2, nameY);

        const descY = nameY + preset.nameFontSize + preset.gapNameToDesc;
        ctx.font = `${preset.descFontSize}px "${preset.descFont}", sans-serif`;
        ctx.fillStyle = preset.descTextColor;
        ctx.textAlign = 'center';
        this._drawWrappedTextCentered(ctx, character.backstory || '', preset.width / 2, descY, preset.descMaxWidth, preset.descLineHeight);
    }

    _drawCharacterFrame(ctx, character, frameIndex, preset) {
        const spriteX = (preset.width - preset.spriteSize) / 2;
        const spriteY = preset.spritePaddingTop;

        ctx.fillStyle = preset.backgroundColor;
        ctx.fillRect(spriteX, spriteY, preset.spriteSize, preset.spriteSize);

        const charCanvas = this.app.characterRenderer.createCanvas();
        this.app.characterRenderer.drawCharacter(charCanvas, character, {
            showFinal: true,
            frameIndex,
        });

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(charCanvas, spriteX, spriteY, preset.spriteSize, preset.spriteSize);
    }

    async _animateFrames(ctx, character, frameTimings, preset) {
        for (const frame of frameTimings) {
            this._drawCharacterFrame(ctx, character, frame.frameIndex, preset);
            await this._sleep(frame.durationMs);
        }
    }

    // --- Helpers ---

    _drawWrappedTextCentered(ctx, text, centerX, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let curY = y;
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                ctx.fillText(line.trim(), centerX, curY);
                line = words[n] + ' ';
                curY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), centerX, curY);
    }

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
