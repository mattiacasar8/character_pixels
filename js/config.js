// Configuration and Constants

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

export const FANTASY_PALETTES = [
    // Gameboy
    [{ r: 15, g: 56, b: 15 }, { r: 48, g: 98, b: 48 }, { r: 139, g: 172, b: 15 }, { r: 155, g: 188, b: 15 }],
    // NES
    [{ r: 124, g: 124, b: 124 }, { r: 0, g: 0, b: 252 }, { r: 0, g: 0, b: 188 }, { r: 68, g: 40, b: 188 }],
    // Pico8
    [{ r: 29, g: 43, b: 83 }, { r: 126, g: 37, b: 83 }, { r: 0, g: 135, b: 81 }, { r: 171, g: 82, b: 54 }],
    // Sepia/RPG
    [{ r: 75, g: 61, b: 68 }, { r: 139, g: 109, b: 156 }, { r: 198, g: 159, b: 165 }, { r: 242, g: 211, b: 171 }],
    // Forest
    [{ r: 34, g: 49, b: 28 }, { r: 74, g: 105, b: 48 }, { r: 134, g: 170, b: 84 }, { r: 194, g: 214, b: 156 }],
    // Desert
    [{ r: 88, g: 48, b: 35 }, { r: 150, g: 91, b: 64 }, { r: 204, g: 142, b: 91 }, { r: 235, g: 205, b: 158 }],
    // Ice
    [{ r: 25, g: 60, b: 88 }, { r: 61, g: 135, b: 177 }, { r: 127, g: 198, b: 222 }, { r: 206, g: 237, b: 245 }],
    // Fire
    [{ r: 66, g: 16, b: 8 }, { r: 131, g: 44, b: 19 }, { r: 212, g: 73, b: 34 }, { r: 243, g: 143, b: 66 }],
    // Arcane
    [{ r: 50, g: 26, b: 81 }, { r: 110, g: 61, b: 139 }, { r: 168, g: 111, b: 193 }, { r: 211, g: 172, b: 230 }],
    // Undead
    [{ r: 38, g: 43, b: 35 }, { r: 72, g: 91, b: 70 }, { r: 133, g: 155, b: 129 }, { r: 178, g: 191, b: 175 }]
];
