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




