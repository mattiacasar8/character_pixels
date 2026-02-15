/**
 * Text Animation — Pure module
 *
 * Computes text reveal/hide state at any point in time.
 * Used by both browser VideoExportManager and CLI export-video.
 *
 * Timeline:
 *   [0 .. nameEnd]           Name reveals letter by letter
 *   [nameEnd .. lineEnd]     Separator line grows left to right
 *   [lineEnd .. descEnd]     Description reveals word by word
 *   [descEnd .. hideStart]   Everything fully visible (steady state)
 *   [hideStart .. duration]  Everything hides in reverse order
 */

/**
 * Word-wrap text with orphan/widow prevention.
 * Short words (<4 chars) are bumped to the next line if they'd be alone at end of line.
 * Widows (short last line) get a word pulled from the previous line.
 *
 * @param {string} text
 * @param {function} measureWidth - (text) => number (pixel width)
 * @param {number} maxWidth
 * @returns {string[]} array of lines
 */
export function wrapText(text, measureWidth, maxWidth) {
    const words = text.split(' ');
    if (words.length === 0) return [];

    const lines = [];
    let currentLine = '';
    for (let n = 0; n < words.length; n++) {
        const testLine = currentLine ? currentLine + ' ' + words[n] : words[n];
        if (measureWidth(testLine) > maxWidth && currentLine) {
            const lineWords = currentLine.split(' ');
            if (lineWords.length > 1 && lineWords[lineWords.length - 1].length < 4) {
                const bumped = lineWords.pop();
                lines.push(lineWords.join(' '));
                currentLine = bumped + ' ' + words[n];
            } else {
                lines.push(currentLine);
                currentLine = words[n];
            }
        } else {
            currentLine = testLine;
        }
    }
    if (currentLine) lines.push(currentLine);

    // Fix widows
    if (lines.length >= 2) {
        const lastLine = lines[lines.length - 1];
        if (measureWidth(lastLine) < maxWidth / 3) {
            const prevWords = lines[lines.length - 2].split(' ');
            if (prevWords.length > 1) {
                const pulled = prevWords.pop();
                lines[lines.length - 2] = prevWords.join(' ');
                lines[lines.length - 1] = pulled + ' ' + lastLine;
            }
        }
    }

    return lines;
}

/**
 * Build the animation timeline from preset config and total video duration.
 *
 * @param {object} textAnim - { nameRevealDuration, lineRevealDuration, descRevealDuration, hideReverseDuration }
 * @param {number} totalDurationSec - total video length in seconds
 * @returns {object} timeline markers in seconds
 */
export function buildTimeline(textAnim, totalDurationSec) {
    const nameStart = 0;
    const nameEnd = textAnim.nameRevealDuration;
    const lineStart = nameEnd;
    const lineEnd = lineStart + textAnim.lineRevealDuration;
    const descStart = lineEnd;
    const descEnd = descStart + textAnim.descRevealDuration;
    const hideDuration = textAnim.hideReverseDuration;
    const hideStart = totalDurationSec - hideDuration;

    return { nameStart, nameEnd, lineStart, lineEnd, descStart, descEnd, hideStart, hideDuration, totalDurationSec };
}

/**
 * Compute the text animation state at a given time.
 *
 * @param {number} timeSec - current time in seconds
 * @param {object} timeline - from buildTimeline()
 * @param {string} name - full character name
 * @param {string[]} descLines - pre-wrapped description lines
 * @returns {object} { visibleName, separatorProgress, visibleDescWords, phase }
 *   - visibleName: string (partial or full name)
 *   - separatorProgress: 0..1 (how much of the line is drawn)
 *   - visibleDescWords: number of words to show across all lines
 *   - phase: 'reveal' | 'steady' | 'hide'
 */
export function getTextState(timeSec, timeline, name, descLines) {
    const totalDescWords = descLines.reduce((sum, line) => sum + line.split(' ').length, 0);

    // --- HIDE phase (reverse) ---
    if (timeSec >= timeline.hideStart) {
        const hideElapsed = timeSec - timeline.hideStart;
        const hideProgress = Math.min(hideElapsed / timeline.hideDuration, 1); // 0→1

        // Reverse order: description hides first, then line, then name
        // Split hide into 3 segments proportional to reveal durations
        const totalReveal = (timeline.nameEnd - timeline.nameStart) +
                           (timeline.lineEnd - timeline.lineStart) +
                           (timeline.descEnd - timeline.descStart);
        const descRatio = (timeline.descEnd - timeline.descStart) / totalReveal;
        const lineRatio = (timeline.lineEnd - timeline.lineStart) / totalReveal;
        // nameRatio = 1 - descRatio - lineRatio

        if (hideProgress < descRatio) {
            // Hiding description (word by word, last to first)
            const descHideProgress = hideProgress / descRatio;
            const wordsToShow = Math.round(totalDescWords * (1 - descHideProgress));
            return { visibleName: name, separatorProgress: 1, visibleDescWords: wordsToShow, phase: 'hide' };
        } else if (hideProgress < descRatio + lineRatio) {
            // Hiding line
            const lineHideProgress = (hideProgress - descRatio) / lineRatio;
            return { visibleName: name, separatorProgress: 1 - lineHideProgress, visibleDescWords: 0, phase: 'hide' };
        } else {
            // Hiding name (letter by letter, last to first)
            const nameHideProgress = (hideProgress - descRatio - lineRatio) / (1 - descRatio - lineRatio);
            const charsToShow = Math.round(name.length * (1 - nameHideProgress));
            return { visibleName: name.slice(0, charsToShow), separatorProgress: 0, visibleDescWords: 0, phase: 'hide' };
        }
    }

    // --- REVEAL phase ---
    let visibleName = '';
    let separatorProgress = 0;
    let visibleDescWords = 0;

    // Name reveal
    if (timeSec >= timeline.nameStart) {
        const nameElapsed = Math.min(timeSec - timeline.nameStart, timeline.nameEnd - timeline.nameStart);
        const nameProgress = nameElapsed / (timeline.nameEnd - timeline.nameStart);
        const charsToShow = Math.round(name.length * nameProgress);
        visibleName = name.slice(0, charsToShow);
    }

    // Line reveal
    if (timeSec >= timeline.lineStart) {
        const lineElapsed = Math.min(timeSec - timeline.lineStart, timeline.lineEnd - timeline.lineStart);
        separatorProgress = lineElapsed / (timeline.lineEnd - timeline.lineStart);
    }

    // Description reveal
    if (timeSec >= timeline.descStart) {
        const descElapsed = Math.min(timeSec - timeline.descStart, timeline.descEnd - timeline.descStart);
        const descProgress = descElapsed / (timeline.descEnd - timeline.descStart);
        visibleDescWords = Math.round(totalDescWords * descProgress);
    }

    const phase = timeSec < timeline.descEnd ? 'reveal' : 'steady';
    return { visibleName, separatorProgress, visibleDescWords, phase };
}

/**
 * Extract the first N words from wrapped lines, preserving line structure.
 *
 * @param {string[]} lines - wrapped description lines
 * @param {number} wordCount - total words to include
 * @returns {string[]} lines with only the visible words
 */
export function getVisibleLines(lines, wordCount) {
    if (wordCount <= 0) return [];
    const result = [];
    let remaining = wordCount;
    for (const line of lines) {
        const words = line.split(' ');
        if (remaining >= words.length) {
            result.push(line);
            remaining -= words.length;
        } else {
            if (remaining > 0) {
                result.push(words.slice(0, remaining).join(' '));
            }
            break;
        }
    }
    return result;
}
