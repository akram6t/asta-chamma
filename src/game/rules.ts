import { Coord, GameMode, GameRules, PlayerId, PlayerState, RollItem, CandidateMove, MoveEvaluation } from './types';
import { HOUSE_DEFS, PLAYER_PATHS, isSafeCell, ROLL_NAMES } from './constants';

export function createInitialPlayers(mode: GameMode, rules: GameRules): PlayerState[] {
  const activeIds: PlayerId[] = (mode === 'bot_1v1' || mode === 'pass_2p') ? [0, 2] : [0, 1, 2, 3];
  
  return HOUSE_DEFS.map((def) => {
    const isActive = activeIds.includes(def.id);
    let isAI = false;
    if (isActive) {
      if (mode === 'bot_1v3') isAI = def.id !== 0;
      else if (mode === 'bot_1v1') isAI = def.id !== 0;
      else if (mode === 'spectate_4bot') isAI = true;
      else isAI = false; // pass_4p or pass_2p
    }

    return {
      ...def,
      active: isActive,
      isAI,
      hasHit: !rules.bloodGate,
      cutsMade: 0,
      pawns: [0, 1, 2, 3].map(pId => ({
        id: pId,
        step: 0, // Starts at starting crossed safe house (Step 0)
        finished: false
      }))
    };
  });
}

export function getPawnCoord(playerIdx: PlayerId, step: number): Coord {
  return PLAYER_PATHS[playerIdx][step] || [2, 2];
}

export function getCellOccupants(players: PlayerState[], r: number, c: number): Record<PlayerId, number[]> {
  const map: Record<PlayerId, number[]> = { 0: [], 1: [], 2: [], 3: [] };
  players.forEach(p => {
    if (!p.active) return;
    p.pawns.forEach(pawn => {
      const [pr, pc] = getPawnCoord(p.id, pawn.step);
      if (pr === r && pc === c) {
        map[p.id].push(pawn.id);
      }
    });
  });
  return map;
}

export function evaluateMove(
  players: PlayerState[],
  rules: GameRules,
  playerIdx: PlayerId,
  pawnIdx: number,
  rollVal: number,
  asPair = false
): MoveEvaluation {
  const player = players.find(p => p.id === playerIdx);
  if (!player || !player.active) {
    return {
      valid: false,
      reason: 'Player inactive',
      startStep: 0,
      targetStep: 0,
      tracedSteps: [],
      targetCoord: [0, 0],
      movingCount: 0,
      partnerPawnId: null,
      cutVictims: [],
      isHomeFinish: false,
      formsDouble: false
    };
  }

  const pawn = player.pawns.find(p => p.id === pawnIdx);
  if (!pawn || pawn.finished || pawn.step === 24) {
    return {
      valid: false,
      reason: 'Pawn already finished in the Center Sanctuary',
      startStep: pawn ? pawn.step : 0,
      targetStep: 0,
      tracedSteps: [],
      targetCoord: [2, 2],
      movingCount: 0,
      partnerPawnId: null,
      cutVictims: [],
      isHomeFinish: false,
      formsDouble: false
    };
  }

  const [startR, startC] = getPawnCoord(playerIdx, pawn.step);
  const startOccupants = getCellOccupants(players, startR, startC)[playerIdx];

  // If pair move requested, check if at least 2 friendly pawns are at this square (and not finished)
  if (asPair && startOccupants.length < 2) {
    return {
      valid: false,
      reason: 'Need 2 friendly pawns on the same square to move as a Double',
      startStep: pawn.step,
      targetStep: 0,
      tracedSteps: [],
      targetCoord: [startR, startC],
      movingCount: 0,
      partnerPawnId: null,
      cutVictims: [],
      isHomeFinish: false,
      formsDouble: false
    };
  }

  const movingCount = asPair ? 2 : 1;
  const partnerPawnId = asPair ? (startOccupants.find(id => id !== pawnIdx) ?? null) : null;

  // Trace step-by-step path for `rollVal` steps
  let curStep = pawn.step;
  const tracedSteps: number[] = [];

  for (let s = 1; s <= rollVal; s++) {
    let nextStep = curStep + 1;

    // Check transition at Step 15 (Inner Gate)
    if (curStep === 15) {
      if (player.hasHit || !rules.bloodGate) {
        nextStep = 16; // Enter clockwise inner 3x3 loop!
      } else {
        // Blood gate locked: continue orbiting outer 16 cells
        nextStep = 0;
      }
    } else if (curStep >= 16) {
      // In the inner loop (16..23) -> must reach 24 by exact roll!
      if (nextStep > 24) {
        return {
          valid: false,
          reason: 'Must reach the Center Chakra with an exact count',
          startStep: pawn.step,
          targetStep: 0,
          tracedSteps: [],
          targetCoord: [2, 2],
          movingCount: 0,
          partnerPawnId: null,
          cutVictims: [],
          isHomeFinish: false,
          formsDouble: false
        };
      }
    }

    const [nr, nc] = getPawnCoord(playerIdx, nextStep);

    // Double Roadblock Rule on intermediate cells (s < rollVal):
    // A single pawn cannot jump past an opponent's Double on an unsafe cell
    if (rules.doubles && s < rollVal && !isSafeCell(nr, nc) && movingCount === 1) {
      const occ = getCellOccupants(players, nr, nc);
      for (let oppId = 0; oppId < 4; oppId++) {
        const id = oppId as PlayerId;
        if (id !== playerIdx && occ[id].length >= 2) {
          return {
            valid: false,
            reason: `Blocked by ${HOUSE_DEFS[id].short}'s Double at (${nr + 1},${nc + 1})`,
            startStep: pawn.step,
            targetStep: 0,
            tracedSteps: [],
            targetCoord: [nr, nc],
            movingCount: 0,
            partnerPawnId: null,
            cutVictims: [],
            isHomeFinish: false,
            formsDouble: false
          };
        }
      }
    }

    curStep = nextStep;
    tracedSteps.push(curStep);
  }

  const targetStep = curStep;
  const [tr, tc] = getPawnCoord(playerIdx, targetStep);
  const safe = isSafeCell(tr, tc);
  const targetOcc = getCellOccupants(players, tr, tc);

  // Check enemy pawns on the landing square
  const cutVictims: { oppId: PlayerId; pawnId: number }[] = [];
  if (!safe) {
    for (let oppId = 0; oppId < 4; oppId++) {
      const id = oppId as PlayerId;
      if (id === playerIdx) continue;
      const oppPawnsHere = targetOcc[id];
      if (oppPawnsHere.length > 0) {
        if (rules.doubles && oppPawnsHere.length >= 2 && movingCount === 1) {
          // Single pawn cannot land on or cut an opponent's Double!
          return {
            valid: false,
            reason: `A single pawn cannot cut ${HOUSE_DEFS[id].short}'s protected Double`,
            startStep: pawn.step,
            targetStep: 0,
            tracedSteps: [],
            targetCoord: [tr, tc],
            movingCount: 0,
            partnerPawnId: null,
            cutVictims: [],
            isHomeFinish: false,
            formsDouble: false
          };
        }

        // Capture! If moving as a Double onto a Double, cuts 2; if single onto single, cuts 1
        const numToCut = movingCount >= 2 ? Math.min(oppPawnsHere.length, 2) : 1;
        for (let k = 0; k < numToCut; k++) {
          cutVictims.push({ oppId: id, pawnId: oppPawnsHere[k] });
        }
      }
    }
  }

  return {
    valid: true,
    startStep: pawn.step,
    targetStep,
    tracedSteps,
    targetCoord: [tr, tc],
    movingCount,
    partnerPawnId,
    cutVictims,
    isHomeFinish: targetStep === 24,
    formsDouble: !safe && (targetOcc[playerIdx].length + movingCount >= 2)
  };
}

export function getAllValidMoves(
  players: PlayerState[],
  rules: GameRules,
  rollPool: RollItem[],
  playerIdx: PlayerId,
  preferPairMode = false
): CandidateMove[] {
  const unusedRolls = rollPool.filter(r => !r.used);
  const moves: CandidateMove[] = [];
  const player = players.find(p => p.id === playerIdx);
  if (!player || !player.active) return moves;

  unusedRolls.forEach(rollObj => {
    player.pawns.forEach(pawn => {
      // Single move check
      const resSingle = evaluateMove(players, rules, playerIdx, pawn.id, rollObj.value, false);
      if (resSingle.valid) {
        moves.push({ rollObj, pawnId: pawn.id, asPair: false, eval: resSingle });
      }
      // Pair move check (if Doubles enabled)
      if (rules.doubles) {
        const resPair = evaluateMove(players, rules, playerIdx, pawn.id, rollObj.value, true);
        if (resPair.valid) {
          moves.push({ rollObj, pawnId: pawn.id, asPair: true, eval: resPair });
        }
      }
    });
  });

  return moves;
}

export function findBestBotMove(
  players: PlayerState[],
  rules: GameRules,
  rollPool: RollItem[],
  playerIdx: PlayerId,
  difficulty: 'casual' | 'smart' = 'smart'
): CandidateMove | null {
  const allMoves = getAllValidMoves(players, rules, rollPool, playerIdx);
  if (allMoves.length === 0) return null;

  if (difficulty === 'casual') {
    // Casual: picks high scoring move with random variance
    allMoves.sort(() => Math.random() - 0.5);
    return allMoves[0];
  }

  const player = players.find(p => p.id === playerIdx)!;

  let bestMove = allMoves[0];
  let bestScore = -99999;

  allMoves.forEach(m => {
    let score = m.eval.targetStep * 3;

    // 1. High priority: Cuts (especially if Blood-Gate locked!)
    if (m.eval.cutVictims.length > 0) {
      score += (!player.hasHit ? 450 : 260) * m.eval.cutVictims.length;
    }

    // 2. High priority: Bringing pawn Home to Step 24
    if (m.eval.isHomeFinish) {
      score += 200 * m.eval.movingCount;
    }

    // 3. Safe house protection
    const [tr, tc] = m.eval.targetCoord;
    if (isSafeCell(tr, tc) && m.eval.targetStep > 0) {
      score += 75;
    }

    // 4. Forming a Double (Jodi)
    if (m.eval.formsDouble) {
      score += 50;
    }

    // 5. Entering inner loop (Step 15 -> 16)
    if (m.eval.startStep <= 15 && m.eval.targetStep >= 16) {
      score += 65;
    }

    // 6. Moving out of danger: if starting on unsafe square and vulnerable, moving is good
    const [sr, sc] = getPawnCoord(player.id, m.eval.startStep);
    if (!isSafeCell(sr, sc) && isSafeCell(tr, tc)) {
      score += 40;
    }

    // 7. Small penalty for leaving a safe cell unless cutting or finishing
    if (isSafeCell(sr, sc) && !isSafeCell(tr, tc) && m.eval.cutVictims.length === 0) {
      score -= 20;
    }

    // 8. Slight randomization to prevent robotic repetition
    score += Math.random() * 8;

    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
    }
  });

  return bestMove;
}

export function rollCowries(forcedValue: number | null = null): {
  shells: [number, number, number, number];
  rollValue: number;
  rollName: string;
  isBonusRoll: boolean;
} {
  let shells: [number, number, number, number] = [0, 0, 0, 0];

  if (forcedValue === null) {
    shells = [
      Math.random() < 0.5 ? 1 : 0,
      Math.random() < 0.5 ? 1 : 0,
      Math.random() < 0.5 ? 1 : 0,
      Math.random() < 0.5 ? 1 : 0
    ];
  } else {
    if (forcedValue === 1) shells = [1, 0, 0, 0];
    else if (forcedValue === 2) shells = [1, 1, 0, 0];
    else if (forcedValue === 3) shells = [1, 1, 1, 0];
    else if (forcedValue === 4) shells = [1, 1, 1, 1];
    else if (forcedValue === 8) shells = [0, 0, 0, 0];
    // Shuffle shells array
    shells.sort(() => Math.random() - 0.5);
  }

  const mouthsUp = shells.reduce((a, b) => a + b, 0);
  const rollValue = mouthsUp === 0 ? 8 : mouthsUp;
  const isBonusRoll = rollValue === 4 || rollValue === 8;
  const def = ROLL_NAMES[rollValue];
  const rollName = def ? `${def.name} (${def.regional})` : `${rollValue}`;

  return { shells, rollValue, rollName, isBonusRoll };
}
