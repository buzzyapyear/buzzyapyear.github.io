export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(v, s) {
  return { x: v.x * s, y: v.y * s };
}

export function magnitude(v) {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalize(v) {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function limit(v, max) {
  const mag = magnitude(v);
  if (mag > max) {
    return scale(normalize(v), max);
  }
  return v;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerpVec(a, b, t) {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function angleBetween(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

export function circleCollision(a, radiusA, b, radiusB) {
  return distance(a, b) < radiusA + radiusB;
}

export function resolveCircleOverlap(a, radiusA, b, radiusB) {
  const dist = distance(a, b);
  const minDist = radiusA + radiusB;
  if (dist >= minDist || dist === 0) return null;

  const angle = Math.atan2(b.y - a.y, b.x - a.x);
  const overlap = minDist - dist;
  const pushX = Math.cos(angle) * overlap / 2;
  const pushY = Math.sin(angle) * overlap / 2;

  return { pushX, pushY };
}
