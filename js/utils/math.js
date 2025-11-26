// Math and Geometry Utilities

export function createTrapezoid(centerX, centerY, topWidth, bottomWidth, length, angleDeg) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    // Calculate the center of the top edge (pivot point)
    // We assume (centerX, centerY) is the top-center pivot
    const topCenterX = centerX;
    const topCenterY = centerY;

    // Calculate top corners relative to top-center, then rotate
    // Top edge is perpendicular to the length vector
    // Vector along the top edge: (cos, -sin) * width/2  <-- Perpendicular to (sin, cos)
    // Actually, if direction is (sin, cos), perpendicular is (cos, -sin)

    // Direction vector of the limb (downwards-ish)
    const dirX = sin;
    const dirY = cos;

    // Perpendicular vector (rightwards-ish)
    const perpX = cos;
    const perpY = -sin;

    const topLeft = {
        x: topCenterX - perpX * (topWidth / 2),
        y: topCenterY - perpY * (topWidth / 2)
    };
    const topRight = {
        x: topCenterX + perpX * (topWidth / 2),
        y: topCenterY + perpY * (topWidth / 2)
    };

    // Bottom center
    const bottomCenterX = topCenterX + dirX * length;
    const bottomCenterY = topCenterY + dirY * length;

    const bottomLeft = {
        x: bottomCenterX - perpX * (bottomWidth / 2),
        y: bottomCenterY - perpY * (bottomWidth / 2)
    };
    const bottomRight = {
        x: bottomCenterX + perpX * (bottomWidth / 2),
        y: bottomCenterY + perpY * (bottomWidth / 2)
    };

    return {
        type: 'trapezoid',
        points: [topLeft, topRight, bottomRight, bottomLeft],
        center: { x: centerX, y: centerY }, // Keep original center ref if needed, though top-center is pivot
        bottomCenter: { x: bottomCenterX, y: bottomCenterY },
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
