# CPG v2 - Analysis & Roadmap

> Full project analysis and implementation plan for Character Pixels Generator v2.
> Last updated: December 2025

---

## 📋 Table of Contents

1. [Project Philosophy](#project-philosophy)
2. [Architecture Improvements](#architecture-improvements)
3. [Bug Tracker](#bug-tracker)
4. [V2 Feature Priorities](#v2-feature-priorities)
5. [Implementation Plan](#implementation-plan)

---

## Project Philosophy

**Core concept**: Characters emerge from randomization, not from deliberate construction. Interesting contradictions (a huge character with an elven name, a small character who slew a dragon) are **features**, not bugs. This is not a traditional character creator with races/classes/stats.

**Two modes**:
1. **Batch Mode** (current): Range-based sliders, random generation, bulk creation
2. **Single Character Mode** (v2): Precise values, element cycling, individual editing and export.

---

## Architecture Improvements

### 1. Naming System Symmetry

**Current state**:
```
js/generators/
├── name-generator.js        ← Human names logic here
├── human/
│   └── human-names.js       ← Almost empty stub
└── monster/
    └── monster-names.js     ← Monster names logic here
```

**Target state**:
```
js/generators/
├── name-generator.js        ← Unified interface, handles both types
├── human/
│   └── human-names.js       ← Human name generation logic + data
└── monster/
    └── monster-names.js     ← Monster name generation logic (already good)
```

**check**: names, backstory and other data should be in the /data folder and not sparse around the other files.

---

### 2. Backstory System Unification

**Current state**: Duplicated code in both `human-backstory.js` and `monster-backstory.js`

```javascript
// Duplicated in BOTH files:
- resolve(template)
- shuffleArray(array)
- pick(array, poolName)
- resetPools()
- capitalize()
```

**Target state**:
```
js/generators/
├── backstory-generator.js   ← Unified class with shared logic
├── human/
│   └── human-backstory.js   ← Extends BackstoryGenerator, uses human data
└── monster/
    └── monster-backstory.js ← Extends BackstoryGenerator, uses monster data
```

---

### 3. Main.js Split

**Current**: 927 lines handling everything

**Target**:
```
js/
├── main.js                  ← Entry point, App initialization only
├── app/
│   ├── UIManager.js         ← Sliders, checkboxes, presets, events
│   ├── ExportManager.js     ← Spritesheet, ZIP, card exports
│   └── ModalManager.js      ← Backstory modal, animation controls
```

---

### 4. Shared Processing Pipeline

**Current**: Lighting exists only in `human-generator.js`

**Target**: Create shared processors that work for BOTH humans and monsters:

```
js/core/
├── generator.js             ← Base CharacterGenerator (exists)
├── renderer.js              ← Canvas rendering (exists)
├── processors/
│   ├── pixel-filler.js      ← Shared pixel filling logic
│   ├── lighting-processor.js ← Light/shadow effects (toggle on/off)
│   └── outline-processor.js ← Outline application
```

These become toggleable features in presets, usable by both generator types.

---

### 5. Human Generator Cleanup

**Extract from `human-generator.js`**:
```
js/generators/human/
├── human-generator.js       ← Core body generation
├── clothing-generator.js    ← Patterns, shirts, pants logic
├── accessory-generator.js   ← Necklaces, belts, etc. (needs fixes)
└── face-generator.js        ← Already separate (good)
```

---

### 6. Body Proportions Configuration

**Current**: Magic numbers throughout code (found through artistic exploration)

**Target**: Centralize in `config.js` WITHOUT changing the current look and feel:

```javascript
// config.js - new section
export const BODY_PROPORTIONS = {
  human: {
    standard: { /* current values preserved */ },
    athletic: { /* ... */ },
    // ...
  },
  monster: {
    standard: { /* current values preserved */ },
    bulky: { /* ... */ },
    // ...
  }
};
```

This is organization only - no visual changes.

---

## Bug Tracker

### ✅ Verified & Fixed

| ID | Description | Status |
|----|-------------|--------|
| B01 | `nameGenerator` used without import in `exportZip()` | **FIXED** - Added import |
| B02 | Double application of smoothing/outline | **Already Fixed** - Code handles this correctly |
| B05 | `tint()` function green channel bug | **Not a bug** - Code is correct |
| B08 | Animation interval not cleaned up | **Already Fixed** - `stopAnimation()` exists |

### ⚪ Low Priority / Working

| ID | Description | Notes |
|----|-------------|-------|
| B07 | Canvas size bounds validation | HTML slider already constrains range |
| B09 | Belt detection reference equality | Works with current implementation |

---

## V2 Feature Priorities

### 🔴 HIGH Priority

#### 1. Single Character Mode ⭐ (PRIMARY FEATURE)

**Description**: "Crea il tuo personaggio" - Individual character creation mode.

**Key behaviors**:
- Precise slider values (not ranges)
- Cycle through options one by one (colors, patterns, etc.)
- Modify ONE element while preserving everything else (name, story, other visuals)
- True character customization experience

**Includes**:
- Edit name manually in modal
- Edit/regenerate backstory individually
- All options directly selectable (not random ranges)

---

#### 2. Character Persistence

**Description**: Save and load characters

**Requirements**:
- LocalStorage save/load
- Export/Import JSON character data
- "Favorites" or saved characters list
- Works for both batch and single character mode

**Depends on**: Single Character Mode

---

### 🟡 MEDIUM Priority

#### 3. Improved Hair System

**Additions**:
- Beards and facial hair
- More hair lengths and shapes
- Braids, ponytails
- Better integration with head shape

---

#### 4. Monster Lighting/Shading

**Description**: Apply lighting effects to monsters (currently human-only)

**Requirements**:
- Unified lighting processor (see Architecture #4)
- Toggle on/off in presets
- Same visual quality as human characters

---

#### 5. Fix Clothing Patterns & Accessories

**Problems to fix**:
- Necklace system gives poor results
- Some patterns look bad
- Belt detection could be more robust

---

## Implementation Plan

### Phase 0: Bug Fixes ✅ COMPLETE

**All identified bugs were verified and fixed/already working:**

- [x] **B01**: Add `nameGenerator` import to `main.js` → FIXED
- [x] **B02**: Already handled correctly in code
- [x] **B05**: Code was already correct
- [x] **B08**: `stopAnimation()` already cleans up interval

---

### Phase 1: Architecture Cleanup

**Objective**: Solid foundation for new features

#### 1.1 Unify Name Generators ✅
- [x] Move human name logic to `human-names.js`
- [x] Create interface in `name-generator.js` that delegates to appropriate generator
- [x] Imports work correctly
- [x] Verified both name systems work correctly

#### 1.2 Unify Backstory Generators ✅
- [x] Create `backstory-generator.js` base class with shared methods
- [x] Refactor `human-backstory.js` to extend base
- [x] Refactor `monster-backstory.js` to extend base
- [x] Verified in browser - all working

#### 1.3 Split Main.js ✅
- [x] Create `js/app/UIManager.js` - slider/checkbox/preset logic
- [x] Create `js/app/ExportManager.js` - all export functions
- [x] Create `js/app/ModalManager.js` - modal logic
- [x] Slim down `main.js` from ~930 to ~200 lines
- [x] Fixed initialization order issues
- [x] All functionality verified working

#### 1.4 Create Shared Processors ✅
- [x] Create `js/core/processors/` directory
- [x] Extract `lighting-processor.js` (LightingProcessor.js)
- [x] Make lighting work for monsters too (automatic via base class)
- [x] Extract `outline-processor.js` (OutlineProcessor.js)
- [x] Add processor toggle support in presets (via UIManager)

#### 1.5 Clean Up Human Generator (DONE)
- [x] Create `clothing-generator.js` and extract pattern logic.
- [x] Create `accessory-generator.js` and extract necklace/belt logic.
- [x] Fix necklace generation quality issues.
- [x] Improve poor-quality patterns.

#### 1.6 Organize Proportions (DONE)
- [x] Add `BODY_PROPORTIONS` to `config.js`
- [x] Move magic numbers from generators to config
- [x] Ensure NO visual changes (just organization)
- [x] Verify all presets still produce same results

---

### Phase 2: Single Character Mode

**Objective**: Core v2 feature - individual character creation

#### 2.1 Mode Switching UI
- [ ] Add mode toggle (Batch / Single) to sidebar
- [ ] Different UI layouts for each mode
- [ ] Preserve current batch mode entirely

#### 2.2 Single Mode Slider System
- [ ] Replace range sliders with single-value sliders in Single Mode
- [ ] Real-time preview updates
- [ ] Parameter locking (change one thing, keep rest)

#### 2.3 Option Cycling
- [ ] Color picker/cycler for skin, shirt, pants, hair
- [ ] Pattern selector (dropdown or cycle buttons)
- [ ] Accessory toggles

#### 2.4 Identity Editing
- [ ] In-modal name editing
- [ ] Backstory regeneration button
- [ ] Manual backstory editing (optional)

#### 2.5 Character State Management
- [ ] Character object holds all state
- [ ] Partial regeneration (only what changed)
- [ ] Consistent seed handling

---

### Phase 3: Character Persistence

**Objective**: Save and load characters

#### 3.1 LocalStorage System
- [ ] Save character to localStorage
- [ ] Load character from localStorage
- [ ] Character list/gallery view
- [ ] Delete saved characters

#### 3.2 Export/Import
- [ ] Export character as JSON file
- [ ] Import character from JSON file
- [ ] Validate imported data

#### 3.3 Integration
- [ ] Save button in Single Mode
- [ ] Save button in Modal
- [ ] Saved characters section in UI

---

### Phase 4: Polish & Medium Priority Features

#### 4.1 Hair System Improvements
- [ ] Add beard generation
- [ ] More hair style variety
- [ ] Better hair-head integration

#### 4.2 Monster Lighting ✅
- [x] Apply lighting processor to monsters
- [x] Test with all monster presets
- [x] Add toggle in monster presets

#### 4.3 Pattern & Accessory Fixes
- [ ] Improve necklace generation
- [ ] Fix bad patterns
- [ ] More accessory variety

---

### Future Phases (Not Scheduled)

- Equipment & Weapons system
- Monster body diversity (wings, tails)
- Backstory expansion
- Story tags system (e.g., `[Nobile] [Bugiardo]`)

---

## Quick Reference: File Changes Summary

### New Files to Create
```
js/app/UIManager.js
js/app/ExportManager.js
js/app/ModalManager.js
js/core/processors/lighting-processor.js
js/core/processors/outline-processor.js
js/generators/backstory-generator.js
js/generators/human/clothing-generator.js
js/generators/human/accessory-generator.js
```

### Files to Modify Significantly
```
js/main.js                    → Slim down, delegate to app modules
js/config.js                  → Add BODY_PROPORTIONS
js/generators/name-generator.js → Unified interface
js/generators/human/human-names.js → Move logic here
js/generators/human/human-generator.js → Extract clothing/accessories
js/generators/human/human-backstory.js → Extend base class
js/generators/monster/monster-backstory.js → Extend base class
```

---

*Phase 0 complete. Ready to start Phase 1 (Architecture Cleanup).*
