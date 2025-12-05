// Configuration and Constants

// PARAM_CONFIG: UI Slider Definitions & Constraints
// This block defines the "Physical Sliders" available in the UI.
// - hardMin/hardMax: Absolute limits for the slider.
// - safeMin/safeMax: "Safe" ranges for random generation (overridden by presets).
// - step/label/suffix: UI formatting options.
//
// NOTE: Random generation logic (safeMin/safeMax) here is mostly fallback.
// Actual body proportions for generation are now in BODY_PROPORTIONS below.

export const PARAM_CONFIG = {
    torsoTopWidth: {
        hardMin: 5, hardMax: 50,
        safeMin: 16, safeMax: 32,
        step: 1,
        label: 'Torso Width (Top)',
        suffix: '%'
    },
    torsoBottomWidth: {
        hardMin: 5, hardMax: 45,
        safeMin: 12, safeMax: 28,
        step: 1,
        label: 'Torso Width (Bottom)',
        suffix: '%'
    },
    torsoHeight: {
        hardMin: 10, hardMax: 60,
        safeMin: 24, safeMax: 36,
        step: 1,
        label: 'Torso Height',
        suffix: '%'
    },
    headWidth: {
        hardMin: 5, hardMax: 40,
        safeMin: 12, safeMax: 24,
        step: 1,
        label: 'Head Size',
        suffix: '%'
    },
    neckWidth: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 10,
        step: 1,
        label: 'Neck Width',
        suffix: '%'
    },
    neckHeight: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 12,
        step: 1,
        label: 'Neck Height',
        suffix: '%'
    },
    upperArmTopWidth: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 12,
        step: 1,
        label: 'Upper Arm Width',
        suffix: '%'
    },
    forearmTopWidth: {
        hardMin: 2, hardMax: 18,
        safeMin: 3, safeMax: 10,
        step: 1,
        label: 'Forearm Width',
        suffix: '%'
    },
    upperArmLength: {
        hardMin: 10, hardMax: 40,
        safeMin: 16, safeMax: 28,
        step: 1,
        label: 'Arm Length',
        suffix: '%'
    },
    armAngle: {
        hardMin: -180, hardMax: 0,
        safeMin: -80, safeMax: -10,
        step: 5,
        label: 'Arm Angle',
        suffix: '°'
    },
    elbowAngle: {
        hardMin: -90, hardMax: 90,
        safeMin: -70, safeMax: 70,
        step: 5,
        label: 'Elbow Angle',
        suffix: '°'
    },
    thighTopWidth: {
        hardMin: 3, hardMax: 25,
        safeMin: 6, safeMax: 16,
        step: 1,
        label: 'Thigh Width',
        suffix: '%'
    },
    shinTopWidth: {
        hardMin: 2, hardMax: 20,
        safeMin: 4, safeMax: 12,
        step: 1,
        label: 'Shin Width',
        suffix: '%'
    },
    thighLength: {
        hardMin: 10, hardMax: 40,
        safeMin: 16, safeMax: 28,
        step: 1,
        label: 'Thigh Length',
        suffix: '%'
    },
    legAngle: {
        hardMin: -45, hardMax: 15,
        safeMin: -25, safeMax: 0,
        step: 5,
        label: 'Leg Angle',
        suffix: '°'
    },
    fillDensity: {
        hardMin: 0.1, hardMax: 1.0,
        safeMin: 0.3, safeMax: 1.0,
        step: 0.05,
        label: 'Fill Density',
        suffix: ''
    }
};

export const BODY_PROPORTIONS = {
    human: {
        base: {
            // Torso (17-35%, 14-27%, 20-41%)
            torsoTopWidth: { min: 17, max: 35 },
            torsoBottomWidth: { min: 14, max: 27 },
            torsoHeight: { min: 20, max: 41 },
            // Position: Dynamic based on height
            torsoY: { min: 28, max: 34 },

            // Neck (4-6%, 2-4%)
            neckWidth: { min: 4, max: 6 },
            neckHeight: { min: 2, max: 4 },

            // Head (14-24%)
            headWidth: { min: 14, max: 24 },
            headHeight: { min: 14, max: 24 },

            // Arms (Len: 14-22%, W: 9-14%, 6-9%)
            upperArmTopWidth: { min: 9, max: 14 },
            upperArmBottomWidth: { min: 7, max: 11 }, // Slightly tapered
            upperArmLength: { min: 14, max: 22 },
            forearmTopWidth: { min: 6, max: 9 },
            forearmBottomWidth: { min: 5, max: 8 },
            forearmLength: { min: 14, max: 22 },

            // Angles
            armAngle: { min: -40, max: 0 },
            elbowAngle: { min: -5, max: 35 },

            // Legs (Len: 12-18%, W: 7-12%, 5-8%)
            thighTopWidth: { min: 7, max: 12 },
            thighBottomWidth: { min: 6, max: 10 },
            thighLength: { min: 12, max: 18 },
            shinTopWidth: { min: 5, max: 8 },
            shinBottomWidth: { min: 4, max: 7 },
            shinLength: { min: 12, max: 18 },
            legAngle: { min: -25, max: 0 },

            // Generation
            fillDensity: { min: 1.0, max: 1.0 }
        },
        presets: {
            athletic: {
                torsoTopWidth: { min: 18, max: 24 },        // Much wider
                torsoBottomWidth: { min: 16, max: 22 },
                torsoHeight: { min: 24, max: 30 },
                upperArmTopWidth: { min: 6, max: 10 },       // Muscular arms
                forearmTopWidth: { min: 5, max: 8 },
                thighTopWidth: { min: 8, max: 12 },          // Thick legs
                shinTopWidth: { min: 6, max: 10 }
            },
            slim: {
                torsoTopWidth: { min: 10, max: 14 },         // Much narrower
                torsoBottomWidth: { min: 8, max: 12 },
                torsoHeight: { min: 20, max: 26 },           // Slightly shorter torso
                upperArmTopWidth: { min: 3, max: 5 },        // Thin arms
                forearmTopWidth: { min: 3, max: 5 },
                thighTopWidth: { min: 4, max: 6 },           // Thin legs
                shinTopWidth: { min: 3, max: 5 }
            },
            stocky: {
                torsoTopWidth: { min: 20, max: 26 },         // Very wide
                torsoBottomWidth: { min: 18, max: 24 },
                torsoHeight: { min: 20, max: 26 },           // Shorter torso
                torsoY: { min: 14, max: 18 },                // Lower position
                upperArmTopWidth: { min: 6, max: 9 },        // Thick arms
                thighTopWidth: { min: 8, max: 12 },          // Very thick legs
                thighLength: { min: 8, max: 12 },            // Shorter legs
                shinLength: { min: 8, max: 12 }
            },
            tall: {
                torsoHeight: { min: 26, max: 34 },           // Taller torso
                torsoY: { min: 10, max: 14 },                // Higher to fit
                headHeight: { min: 7, max: 10 },
                upperArmLength: { min: 14, max: 18 },        // Longer limbs
                forearmLength: { min: 14, max: 18 },
                thighLength: { min: 12, max: 16 },
                shinLength: { min: 12, max: 16 }
            }
        }
    },
    monster: {
        base: {
            torsoTopWidth: { min: 16, max: 32 },
            torsoBottomWidth: { min: 12, max: 28 },
            torsoHeight: { min: 24, max: 36 },
            torsoY: { min: 16, max: 24 },
            neckWidth: { min: 4, max: 10 },
            neckHeight: { min: 4, max: 12 },
            headWidth: { min: 12, max: 24 },
            headHeight: { min: 12, max: 24 },
            upperArmTopWidth: { min: 4, max: 12 },
            upperArmBottomWidth: { min: 3, max: 10 },
            upperArmLength: { min: 16, max: 28 },
            forearmTopWidth: { min: 3, max: 10 },
            forearmBottomWidth: { min: 2, max: 8 },
            forearmLength: { min: 16, max: 28 },
            armAngle: { min: -80, max: -10 },
            elbowAngle: { min: -70, max: 70 },
            thighTopWidth: { min: 6, max: 16 },
            thighBottomWidth: { min: 4, max: 12 },
            thighLength: { min: 16, max: 28 },
            shinTopWidth: { min: 4, max: 12 },
            shinBottomWidth: { min: 3, max: 10 },
            shinLength: { min: 20, max: 32 },
            legAngle: { min: -25, max: 0 },
            fillDensity: { min: 0.7, max: 1.0 }
        },
        presets: {
            short: {
                torsoHeight: { min: 24, max: 30 },
                torsoY: { min: 24, max: 32 },
                thighLength: { min: 12, max: 20 },
                shinLength: { min: 16, max: 24 }
            },
            tall: {
                torsoHeight: { min: 32, max: 44 },
                torsoY: { min: 12, max: 20 },
                thighLength: { min: 24, max: 36 },
                shinLength: { min: 28, max: 40 },
                upperArmLength: { min: 24, max: 36 },
                forearmLength: { min: 24, max: 36 }
            },
            thin: {
                torsoTopWidth: { min: 12, max: 20 },
                torsoBottomWidth: { min: 10, max: 18 },
                upperArmTopWidth: { min: 3, max: 6 },
                forearmTopWidth: { min: 2, max: 5 },
                thighTopWidth: { min: 4, max: 8 },
                shinTopWidth: { min: 3, max: 6 }
            },
            bulky: {
                torsoTopWidth: { min: 24, max: 36 },
                torsoBottomWidth: { min: 20, max: 32 },
                upperArmTopWidth: { min: 8, max: 16 },
                forearmTopWidth: { min: 6, max: 12 },
                thighTopWidth: { min: 10, max: 20 },
                shinTopWidth: { min: 8, max: 16 },
                headWidth: { min: 16, max: 28 }
            }
        }
    }
};
