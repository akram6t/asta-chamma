import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialPlayers, evaluateMove, getAllValidMoves, getPawnCoord, rollCowries } from './rules';
import { isSafeCell, PLAYER_PATHS } from './constants';
import { GameRules } from './types';

const defaultRules: GameRules = {
  bloodGate: true,
  doubles: true,
  threeBust: false
};

test('board paths start at player safe house and end at center [2,2]', () => {
  assert.equal(PLAYER_PATHS[0].length, 25);
  assert.deepEqual(PLAYER_PATHS[0][0], [4, 2]); // South Home
  assert.deepEqual(PLAYER_PATHS[0][24], [2, 2]); // Center Chakra
  assert.deepEqual(PLAYER_PATHS[2][0], [0, 2]); // North Home
  assert.deepEqual(PLAYER_PATHS[2][24], [2, 2]);
});

test('safe cells are correctly recognized', () => {
  assert.equal(isSafeCell(4, 2), true);
  assert.equal(isSafeCell(2, 4), true);
  assert.equal(isSafeCell(0, 2), true);
  assert.equal(isSafeCell(2, 0), true);
  assert.equal(isSafeCell(2, 2), true);
  assert.equal(isSafeCell(4, 3), false);
  assert.equal(isSafeCell(1, 1), false);
});

test('blood-gate keeps un-cut pawns orbiting outer track when crossing step 15', () => {
  const players = createInitialPlayers('pass_4p', defaultRules);
  const south = players[0];
  south.hasHit = false;
  south.pawns[0].step = 14;

  // Move 2 steps: 14 -> 15 -> step 0 (loops outer)
  const evalOrbit = evaluateMove(players, defaultRules, 0, 0, 2, false);
  assert.equal(evalOrbit.valid, true);
  assert.equal(evalOrbit.targetStep, 0); // Continues outer track!
});

test('blood-gate unlocks inner track when player has scored a hit', () => {
  const players = createInitialPlayers('pass_4p', defaultRules);
  const south = players[0];
  south.hasHit = true;
  south.pawns[0].step = 14;

  // Move 2 steps: 14 -> 15 -> step 16 (enters inner loop)
  const evalEnter = evaluateMove(players, defaultRules, 0, 0, 2, false);
  assert.equal(evalEnter.valid, true);
  assert.equal(evalEnter.targetStep, 16);
});

test('exact roll required to enter center sanctuary at step 24', () => {
  const players = createInitialPlayers('pass_4p', defaultRules);
  const south = players[0];
  south.hasHit = true;
  south.pawns[0].step = 23;

  // 1 step reaches 24 (valid)
  const evalValid = evaluateMove(players, defaultRules, 0, 0, 1, false);
  assert.equal(evalValid.valid, true);
  assert.equal(evalValid.targetStep, 24);
  assert.equal(evalValid.isHomeFinish, true);

  // 2 steps overshoots 24 (invalid)
  const evalOvershoot = evaluateMove(players, defaultRules, 0, 0, 2, false);
  assert.equal(evalOvershoot.valid, false);
});

test('cutting enemy single pawn on unsafe cell returns it to start', () => {
  const players = createInitialPlayers('pass_4p', defaultRules);
  // Place North pawn on (4, 3) which is step 1 for South
  const north = players[2];
  north.pawns[0].step = 9; // Step 9 for North is (4,3)
  assert.deepEqual(getPawnCoord(2, 9), [4, 3]);

  // South pawn at step 0 rolls 1 -> lands on (4,3)
  const evalCut = evaluateMove(players, defaultRules, 0, 0, 1, false);
  assert.equal(evalCut.valid, true);
  assert.equal(evalCut.cutVictims.length, 1);
  assert.equal(evalCut.cutVictims[0].oppId, 2);
  assert.equal(evalCut.cutVictims[0].pawnId, 0);
});

test('protected double cannot be cut by single pawn on unsafe cell', () => {
  const players = createInitialPlayers('pass_4p', defaultRules);
  const north = players[2];
  // Two North pawns stacked on (4,3)
  north.pawns[0].step = 9;
  north.pawns[1].step = 9;

  // South single pawn attempts to land on (4,3)
  const evalTryCut = evaluateMove(players, defaultRules, 0, 0, 1, false);
  assert.equal(evalTryCut.valid, false);
  assert.match(evalTryCut.reason || '', /cannot cut/i);
});

test('cowrie rolling produces valid distribution and bonus rolls for 4 and 8', () => {
  const roll4 = rollCowries(4);
  assert.equal(roll4.rollValue, 4);
  assert.equal(roll4.isBonusRoll, true);

  const roll8 = rollCowries(8);
  assert.equal(roll8.rollValue, 8);
  assert.equal(roll8.isBonusRoll, true);

  const roll1 = rollCowries(1);
  assert.equal(roll1.rollValue, 1);
  assert.equal(roll1.isBonusRoll, false);
});
