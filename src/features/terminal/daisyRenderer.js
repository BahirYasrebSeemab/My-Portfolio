// Renders one ASCII frame of a spinning 3D daisy.
//
// Same technique as the classic ASCII "spinning donut" demo: sample points
// on a parametric surface, rotate them each frame, project to 2D with a
// perspective divide, resolve overlaps with a per-cell z-buffer, then pick
// a character by how much each surface point faces the light.
//
// Deliberately has zero React/DOM dependency — the terminal's `cat flower.js`
// command shows this exact file's source, so what you read here is what
// actually draws the flower.

const PETAL_COUNT = 12;
const PETAL_LENGTH = 1.7;
const PETAL_MAX_WIDTH = 0.45;
const PETAL_BOWL = 0.3;
const PETAL_TILT = 0.35;
const CENTER_RADIUS = 0.45;
const CENTER_DOME = 0.3;

const STEM_LENGTH = 2.6;
const STEM_RADIUS = 0.08;
const STEM_BEND = 0.25;
const LEAF_LENGTH = 0.75;
const LEAF_MAX_WIDTH = 0.32;
const LEAF_STEM_U = 0.45;
const LEAF_SIDE = 1;

// A little tilt off pure side-on, looking down onto the flower face rather
// than nearly edge-on.
const CAMERA_TILT = 0.85;
const WOBBLE_AMPLITUDE = 0.12;
const WOBBLE_SPEED = 0.6;
const SPIN_SPEED = 0.6;

const CAMERA_DISTANCE = 3.6;
const PROJECTION_SCALE = 1.35;
const VERTICAL_ANCHOR = 0.34;

const LUMINANCE_CHARS = ".,:;+*#%@";

function rotateX(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}

function rotateZ(p, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
}

function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function cross(a, b) {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

// The flower's center: a shallow dome sampled in polar coordinates.
function centerPoint(u, v) {
  const radius = u * CENTER_RADIUS;
  const angle = v * Math.PI * 2;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    z: CENTER_DOME * (1 - u * u),
    part: "center",
  };
}

// One petal: a tapered, slightly bowled blade, tilted up and placed
// radially around the center.
function petalPoint(index, u, v) {
  const width = PETAL_MAX_WIDTH * Math.sin(Math.PI * u);
  let x = CENTER_RADIUS + u * PETAL_LENGTH;
  const y = v * width * 0.5;
  let z = -PETAL_BOWL * v * v + 0.15 * Math.sin(Math.PI * u);

  const tiltedX = x * Math.cos(PETAL_TILT) + z * Math.sin(PETAL_TILT);
  const tiltedZ = -x * Math.sin(PETAL_TILT) + z * Math.cos(PETAL_TILT);
  x = tiltedX;
  z = tiltedZ;

  const angle = (index / PETAL_COUNT) * Math.PI * 2;
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
    z,
    part: "petal",
  };
}

// The stem: a thin, gently bent tube hanging below the flower head. Larger
// z renders lower on screen in this projection, so the stem needs the
// opposite sign from the head's small positive-z bulge to hang below it.
function stemPoint(u, v) {
  const angle = v * Math.PI * 2;
  const bendOffset = STEM_BEND * Math.sin(u * Math.PI * 0.5);
  return {
    x: bendOffset + STEM_RADIUS * Math.cos(angle),
    y: STEM_RADIUS * Math.sin(angle),
    z: u * STEM_LENGTH,
    part: "stem",
  };
}

// A single small leaf branching off the stem partway down.
function leafPoint(u, v) {
  const attach = stemPoint(LEAF_STEM_U, 0);
  const width = LEAF_MAX_WIDTH * Math.sin(Math.PI * u);
  return {
    x: attach.x + u * LEAF_LENGTH * LEAF_SIDE,
    y: attach.y + v * width * 0.5,
    z: attach.z + 0.1 - 0.12 * v * v,
    part: "leaf",
  };
}

// Approximate surface normal from nearby samples, works for any patch
// function regardless of its shape.
function surfaceNormal(pointAt, u, v) {
  const step = 0.01;
  const p0 = pointAt(u, v);
  const pu = pointAt(u + step, v);
  const pv = pointAt(u, v + step);
  return normalize(cross(subtract(pu, p0), subtract(pv, p0)));
}

export function renderDaisyFrame({ cols, rows, time }) {
  const cells = new Array(cols * rows).fill(null);
  const depth = new Array(cols * rows).fill(-Infinity);

  const spin = time * SPIN_SPEED;
  const wobble = Math.sin(time * WOBBLE_SPEED) * WOBBLE_AMPLITUDE;
  const tilt = CAMERA_TILT + wobble;
  const light = normalize({ x: -0.4, y: -0.6, z: 0.7 });

  const plot = (point, normal) => {
    let sp = rotateZ(point, spin);
    sp = rotateX(sp, tilt);
    let sn = rotateZ(normal, spin);
    sn = rotateX(sn, tilt);

    const z = CAMERA_DISTANCE + sp.z;
    if (z <= 0.1) return;
    const invZ = 1 / z;

    const screenX = Math.round(cols / 2 + PROJECTION_SCALE * cols * 0.5 * sp.x * invZ);
    const screenY = Math.round(rows * VERTICAL_ANCHOR - PROJECTION_SCALE * rows * 0.6 * sp.y * invZ);
    if (screenX < 0 || screenX >= cols || screenY < 0 || screenY >= rows) return;

    const index = screenY * cols + screenX;
    if (invZ <= depth[index]) return;

    depth[index] = invZ;
    const luminance = Math.max(0, dot(sn, light));
    const charIndex = Math.min(
      LUMINANCE_CHARS.length - 1,
      Math.floor(luminance * LUMINANCE_CHARS.length),
    );
    cells[index] = { char: LUMINANCE_CHARS[charIndex], part: point.part };
  };

  for (let u = 0; u <= 1; u += 0.06) {
    for (let v = 0; v < 1; v += 0.05) {
      plot(centerPoint(u, v), surfaceNormal(centerPoint, u, v));
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    const pointAt = (u, v) => petalPoint(i, u, v);
    for (let u = 0; u <= 1; u += 0.05) {
      for (let v = -1; v <= 1; v += 0.12) {
        plot(pointAt(u, v), surfaceNormal(pointAt, u, v));
      }
    }
  }

  for (let u = 0; u <= 1; u += 0.04) {
    for (let v = 0; v < 1; v += 0.15) {
      plot(stemPoint(u, v), surfaceNormal(stemPoint, u, v));
    }
  }

  for (let u = 0; u <= 1; u += 0.08) {
    for (let v = -1; v <= 1; v += 0.2) {
      plot(leafPoint(u, v), surfaceNormal(leafPoint, u, v));
    }
  }

  const grid = [];
  for (let row = 0; row < rows; row++) {
    const line = [];
    for (let col = 0; col < cols; col++) {
      line.push(cells[row * cols + col] || { char: " ", part: null });
    }
    grid.push(line);
  }
  return grid;
}
