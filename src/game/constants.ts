import { Coord, HouseDef, PlayerId } from './types';

// Outer perimeter anti-clockwise ring (16 cells, starting from South (4,2))
export const OUTER_CCW: Coord[] = [
  [4, 2], [4, 3], [4, 4], [3, 4],
  [2, 4], [1, 4], [0, 4], [0, 3],
  [0, 2], [0, 1], [0, 0], [1, 0],
  [2, 0], [3, 0], [4, 0], [4, 1]
];

// Inner 3x3 clockwise ring (8 cells, starting from South-West inner entry (3,1))
export const INNER_CW: Coord[] = [
  [3, 1], [2, 1], [1, 1], [1, 2],
  [1, 3], [2, 3], [3, 3], [3, 2]
];

// Build the 25-step spiral path (indices 0..24) for each of the 4 Houses
// Player 0: South (4,2) — Orange
// Player 1: East  (2,4) — Teal
// Player 2: North (0,2) — Blue
// Player 3: West  (2,0) — Purple
export function buildPlayerPath(playerIdx: PlayerId): Coord[] {
  const outerOffset = playerIdx * 4; // 0, 4, 8, 12
  // Inner entry cell is clockwise around the inner ring:
  // South enters at (3,1) [idx 0], East enters at (3,3) [idx 6],
  // North enters at (1,3) [idx 4], West enters at (1,1) [idx 2]
  const innerOffsets = [0, 6, 4, 2];
  const inOffset = innerOffsets[playerIdx];

  const path: Coord[] = [];
  for (let i = 0; i < 16; i++) {
    path.push(OUTER_CCW[(outerOffset + i) % 16]);
  }
  for (let i = 0; i < 8; i++) {
    path.push(INNER_CW[(inOffset + i) % 8]);
  }
  path.push([2, 2]); // Step 24: Central Ashoka Chakra Sanctuary
  return path;
}

export const PLAYER_PATHS: Record<PlayerId, Coord[]> = {
  0: buildPlayerPath(0),
  1: buildPlayerPath(1),
  2: buildPlayerPath(2),
  3: buildPlayerPath(3)
};

export const SAFE_CELL_SET = new Set<string>(['4,2', '2,4', '0,2', '2,0', '2,2']);

export function isSafeCell(r: number, c: number): boolean {
  return SAFE_CELL_SET.has(`${r},${c}`);
}

export const HOUSE_DEFS: HouseDef[] = [
  {
    id: 0,
    name: 'South House',
    regionalName: 'Dakshina Mane',
    gemName: 'Carnelian Agate',
    short: 'Orange (S)',
    direction: 'South',
    homeCoord: [4, 2],
    primary: '#ea580c',
    light: '#fb923c',
    dark: '#9a3412',
    glow: 'rgba(234, 88, 12, 0.45)',
    badgeClass: 'border-orange-500/50 bg-orange-950/40 text-orange-200'
  },
  {
    id: 1,
    name: 'East House',
    regionalName: 'Poorva Mane',
    gemName: 'Turquoise Jade',
    short: 'Teal (E)',
    direction: 'East',
    homeCoord: [2, 4],
    primary: '#0d9488',
    light: '#2dd4bf',
    dark: '#115e59',
    glow: 'rgba(13, 148, 136, 0.45)',
    badgeClass: 'border-teal-500/50 bg-teal-950/40 text-teal-200'
  },
  {
    id: 2,
    name: 'North House',
    regionalName: 'Uttara Mane',
    gemName: 'Lapis Lazuli',
    short: 'Blue (N)',
    direction: 'North',
    homeCoord: [0, 2],
    primary: '#2563eb',
    light: '#60a5fa',
    dark: '#1e3a8a',
    glow: 'rgba(37, 99, 235, 0.45)',
    badgeClass: 'border-blue-500/50 bg-blue-950/40 text-blue-200'
  },
  {
    id: 3,
    name: 'West House',
    regionalName: 'Pashchima Mane',
    gemName: 'Amethyst Quartz',
    short: 'Purple (W)',
    direction: 'West',
    homeCoord: [2, 0],
    primary: '#7e22ce',
    light: '#c084fc',
    dark: '#581c87',
    glow: 'rgba(126, 34, 206, 0.45)',
    badgeClass: 'border-purple-500/50 bg-purple-950/40 text-purple-200'
  }
];

export const ROLL_NAMES: Record<number, { name: string; regional: string; bonus: boolean }> = {
  1: { name: 'Dayam (1)', regional: 'Okkati / Ekka', bonus: false },
  2: { name: 'Duga (2)', regional: 'Rendu / Dwi', bonus: false },
  3: { name: 'Thiga (3)', regional: 'Moodu / Tri', bonus: false },
  4: { name: 'Chamma (4)', regional: 'Chauka / Naak', bonus: true },
  8: { name: 'Ashta (8)', regional: 'Bara / Entu', bonus: true }
};

export const PROBABILITY_TABLE = [
  { mouthsUp: '1 Up, 3 Down', name: 'Okkati / Dayam / Ekka', steps: 1, combos: '4/16', odds: '25.00%', bonus: false },
  { mouthsUp: '2 Up, 2 Down', name: 'Rendu / Duga / Two', steps: 2, combos: '6/16', odds: '37.50%', bonus: false },
  { mouthsUp: '3 Up, 1 Down', name: 'Moodu / Thiga / Three', steps: 3, combos: '4/16', odds: '25.00%', bonus: false },
  { mouthsUp: '4 Up, 0 Down', name: 'Chamma / Chauka (4)', steps: 4, combos: '1/16', odds: '6.25%', bonus: true },
  { mouthsUp: '0 Up, 4 Down', name: 'Ashta / Bara (8)', steps: 8, combos: '1/16', odds: '6.25%', bonus: true }
];
