// Math and Geometry Utilities

export function createTrapezoid(centerX, centerY, topWidth, bottomWidth, length, angleDeg) {
    const angleRad = (angleDeg * Math.PI) / 180;

    const topLeft = {
        x: centerX - topWidth / 2,
        y: centerY
    };
    const topRight = {
        x: centerX + topWidth / 2,
        y: centerY
    };

    const dx = Math.sin(angleRad) * length;
    const dy = Math.cos(angleRad) * length;

    const bottomCenter = {
        x: centerX + dx,
        y: centerY + dy
    };

    const bottomLeft = {
        x: bottomCenter.x - bottomWidth / 2,
        y: bottomCenter.y
    };
    const bottomRight = {
        x: bottomCenter.x + bottomWidth / 2,
        y: bottomCenter.y
    };

    return {
        type: 'trapezoid',
        points: [topLeft, topRight, bottomRight, bottomLeft],
        center: { x: centerX, y: centerY },
        bottomCenter: bottomCenter,
        topWidth,
        bottomWidth,
        length,
        angle: angleDeg
    };
}

export function createJoint(center, radius) {
    return {
        type: 'circle',
        center: center,
        radius: radius
    };
}

export function getTrapezoidBottom(trap) {
    return trap.bottomCenter;
}

export function isPointInPolygon(point, vertices) {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function distance(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function pointToSegmentDistance(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lengthSq = dx * dx + dy * dy;

    if (lengthSq === 0) return distance(p, a);

    let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSq;
    t = Math.max(0, Math.min(1, t));

    const closest = {
        x: a.x + t * dx,
        y: a.y + t * dy
    };

    return distance(p, closest);
}
