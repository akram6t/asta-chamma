export type PlayerId = 0 | 1 | 2 | 3;

export type GameMode = 
  | 'bot_1v3'      // 1 Human (South) vs 3 Bots
  | 'bot_1v1'      // 1 Human (South) vs 1 Bot (North)
  | 'pass_4p'      // 4 Players Pass & Play
  | 'pass_2p'      // 2 Players Pass & Play (South vs North)
  | 'spectate_4bot'; // 4 Bots (Watch AI battle)

export type BotDifficulty = 'casual' | 'smart';

export type Coord = [number, number];

export interface HouseDef {
  id: PlayerId;
  name: string;
  regionalName: string;
  gemName: string;
  short: string;
  homeCoord: Coord;
  direction: 'South' | 'East' | 'North' | 'West';
  primary: string;
  light: string;
  dark: string;
  glow: string;
  badgeClass: string;
}

export interface PawnState {
  id: number;
  step: number; // 0..24 (0 = player's crossed Home square, 24 = Center Chakra)
  finished: boolean;
}

export interface PlayerState extends HouseDef {
  active: boolean;
  isAI: boolean;
  hasHit: boolean;
  cutsMade: number;
  pawns: PawnState[];
}

export interface RollItem {
  id: string;
  value: number; // 1, 2, 3, 4, 8
  used: boolean;
  timestamp: number;
}

export interface GameRules {
  bloodGate: boolean;   // Must cut >= 1 enemy pawn before entering inner 3x3 loop
  doubles: boolean;     // 2 friendly pawns form protected Double (Jodi/Gatti)
  threeBust: boolean;   // 3 consecutive 4/8 rolls bust the turn
}

export type GamePhase = 'ROLL' | 'MOVE' | 'ANIMATING' | 'GAMEOVER';

export interface MoveEvaluation {
  valid: boolean;
  reason?: string;
  startStep: number;
  targetStep: number;
  tracedSteps: number[];
  targetCoord: Coord;
  movingCount: number;
  partnerPawnId: number | null;
  cutVictims: { oppId: PlayerId; pawnId: number }[];
  isHomeFinish: boolean;
  formsDouble: boolean;
}

export interface CandidateMove {
  rollObj: RollItem;
  pawnId: number;
  asPair: boolean;
  eval: MoveEvaluation;
}

export interface MoveLogEntry {
  id: string;
  text: string;
  tone: 'normal' | 'cut' | 'bonus' | 'home' | 'system';
  timestamp: number;
}

export interface GameState {
  mode: GameMode;
  botDifficulty: BotDifficulty;
  rules: GameRules;
  players: PlayerState[];
  turnIndex: PlayerId;
  phase: GamePhase;
  rollPool: RollItem[];
  selectedRollId: string | null;
  consecutiveHighRolls: number;
  pairMoveMode: boolean;
  lastShells: [number, number, number, number];
  lastRollText: string;
  pathPreviewPlayer: number; // -1 for active turn player, 0..3 for specific house
  showStepNumbers: boolean;
  boardTheme: BoardThemeId;
  objectTheme: ObjectThemeId;
  logs: MoveLogEntry[];
  winner: PlayerState | null;
  turnCount: number;
}

export type BoardThemeId = 'khadi' | 'sandalwood' | 'marble' | 'obsidian' | 'terracotta';
export type ObjectThemeId = 'agate' | 'brass' | 'channapatna' | 'crystal';

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  subtitle: string;
  badge: string;
  matClass: string;
  gridLineColor: string;
  gridLineWidth: number;
  innerBorderColor: string;
  textColor: string;
  accentText: string;
  bgCellInner: string;
  safeHouseCrossColor: string;
  chakraFill: string;
  chakraStroke: string;
  previewBg: string;
  description: string;
}

export interface ObjectTheme {
  id: ObjectThemeId;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  pawnShape: 'pebble' | 'brass_finial' | 'wooden_peg' | 'faceted_gem';
  soundType: 'stone' | 'metal' | 'wood' | 'glass';
  shellStyle: 'enamel' | 'brass' | 'wood' | 'pearl';
  getHouseColors: (playerIdx: PlayerId) => {
    light: string;
    primary: string;
    dark: string;
    glow: string;
    label: string;
  };
}

