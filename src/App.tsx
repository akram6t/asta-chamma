/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { CowrieTray } from './components/CowrieTray';
import { PlayerCards } from './components/PlayerCards';
import { MoveLog } from './components/MoveLog';
import { SettingsModal } from './components/SettingsModal';
import { ThemeModal } from './components/ThemeModal';
import { VictoryModal } from './components/VictoryModal';
import { OddsAnalysisTab } from './components/OddsAnalysisTab';
import { RulesTab } from './components/RulesTab';
import {
  Coord,
  GameMode,
  BotDifficulty,
  GameRules,
  GamePhase,
  PlayerId,
  PlayerState,
  RollItem,
  MoveLogEntry,
  BoardThemeId,
  ObjectThemeId
} from './game/types';
import { HOUSE_DEFS } from './game/constants';
import { BOARD_THEMES, OBJECT_THEMES } from './game/themes';
import {
  createInitialPlayers,
  evaluateMove,
  findBestBotMove,
  getAllValidMoves,
  getPawnCoord,
  rollCowries
} from './game/rules';
import { sounds } from './game/sound';

export default function App() {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'play' | 'analysis' | 'rules'>('play');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Theme Customization
  const [boardTheme, setBoardTheme] = useState<BoardThemeId>('khadi');
  const [objectTheme, setObjectTheme] = useState<ObjectThemeId>('agate');

  // Match Configuration
  const [mode, setMode] = useState<GameMode>('bot_1v3');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('smart');
  const [rules, setRules] = useState<GameRules>({
    bloodGate: true,
    doubles: true,
    threeBust: false
  });

  // Game Match State
  const [players, setPlayers] = useState<PlayerState[]>(() =>
    createInitialPlayers('bot_1v3', { bloodGate: true, doubles: true, threeBust: false })
  );
  const [turnIndex, setTurnIndex] = useState<PlayerId>(0);
  const [phase, setPhase] = useState<GamePhase>('ROLL');
  const [rollPool, setRollPool] = useState<RollItem[]>([]);
  const [selectedRollId, setSelectedRollId] = useState<string | null>(null);
  const [consecutiveHighRolls, setConsecutiveHighRolls] = useState<number>(0);
  const [pairMoveMode, setPairMoveMode] = useState<boolean>(false);
  const [lastShells, setLastShells] = useState<[number, number, number, number]>([1, 1, 0, 1]);
  const [lastRollText, setLastRollText] = useState<string>('Ready to Cast');
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [pathPreviewPlayer, setPathPreviewPlayer] = useState<number>(-1);
  const [showStepNumbers, setShowStepNumbers] = useState<boolean>(false);
  const [logs, setLogs] = useState<MoveLogEntry[]>([]);
  const [winner, setWinner] = useState<PlayerState | null>(null);
  const [turnCount, setTurnCount] = useState<number>(1);

  // Human Turn Countdown Timer State
  const [turnTimerEnabled, setTurnTimerEnabled] = useState<boolean>(true);
  const [turnTimerDuration, setTurnTimerDuration] = useState<number>(20);
  const [timeLeft, setTimeLeft] = useState<number>(20);

  // Stepping Animation State
  const [animatingPawn, setAnimatingPawn] = useState<{
    playerIdx: PlayerId;
    pawnIdx: number;
    currentCoord: Coord;
  } | null>(null);

  // Refs for timer management
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, []);

  // Sync sound engine enabled state
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  const addLog = useCallback(
    (text: string, tone: 'normal' | 'cut' | 'bonus' | 'home' | 'system' = 'normal') => {
      setLogs((prev) => [
        {
          id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          text,
          tone,
          timestamp: Date.now()
        },
        ...prev
      ]);
    },
    []
  );

  // Initialize a new match
  const initMatch = useCallback(
    (newMode = mode, newDifficulty = botDifficulty, newRules = rules) => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      const newPlayers = createInitialPlayers(newMode, newRules);
      setPlayers(newPlayers);
      setTurnIndex(0);
      setPhase('ROLL');
      setRollPool([]);
      setSelectedRollId(null);
      setConsecutiveHighRolls(0);
      setPairMoveMode(false);
      setLastShells([1, 0, 1, 1]);
      setLastRollText('Ready to Cast');
      setIsRolling(false);
      setWinner(null);
      setTurnCount(1);
      setAnimatingPawn(null);
      setTimeLeft(turnTimerDuration);

      const modeLabels: Record<GameMode, string> = {
        bot_1v3: '1 Human vs 3 AI Bots',
        bot_1v1: '1 Human vs 1 AI Bot (2-Player Duel)',
        pass_4p: '4-Player Local Pass & Play',
        pass_2p: '2-Player Local Pass & Play',
        spectate_4bot: 'Spectator Mode (4 AI Houses)'
      };

      setLogs([
        {
          id: 'init_log',
          text: `✨ New match initialized [${modeLabels[newMode]}]. All 4 pawns begin on their crossed Safe House (Step 0).`,
          tone: 'system',
          timestamp: Date.now()
        }
      ]);
    },
    [mode, botDifficulty, rules, turnTimerDuration]
  );

  // Advance turn to next active house
  const endTurn = useCallback(() => {
    if (phase === 'GAMEOVER') return;

    setRollPool([]);
    setSelectedRollId(null);
    setConsecutiveHighRolls(0);
    setPhase('ROLL');
    setTimeLeft(turnTimerDuration);

    let nextIndex = turnIndex;
    for (let i = 1; i <= 4; i++) {
      const cand = ((turnIndex + i) % 4) as PlayerId;
      if (players[cand].active) {
        nextIndex = cand;
        break;
      }
    }

    setTurnIndex(nextIndex);
    setTurnCount((prev) => prev + 1);
  }, [phase, turnIndex, players, turnTimerDuration]);

  // Cast cowrie shells
  const handleThrow = useCallback(
    (forcedValue: number | null = null) => {
      if (phase !== 'ROLL' && rollPool.filter((r) => !r.used).length === 0) return;
      if (phase === 'ANIMATING' || phase === 'GAMEOVER') return;

      const player = players.find((p) => p.id === turnIndex);
      if (!player) return;

      sounds.playShellToss();
      setIsRolling(true);

      setTimeout(() => {
        if (!isMountedRef.current) return;
        setIsRolling(false);

        const { shells, rollValue, rollName, isBonusRoll } = rollCowries(forcedValue);
        setLastShells(shells);
        setLastRollText(rollName);

        // High-Roll Streak Tracking
        let newStreak = isBonusRoll ? consecutiveHighRolls + 1 : 0;
        setConsecutiveHighRolls(newStreak);

        // Check 3x Consecutive High-Roll Bust Rule
        if (rules.threeBust && newStreak >= 3) {
          addLog(
            `⚡ ${player.short} rolled three consecutive 4s/8s (Moor Naak Shyam)! Turn busts and passes.`,
            'cut'
          );
          setRollPool([]);
          setSelectedRollId(null);
          endTurn();
          return;
        }

        const newRoll: RollItem = {
          id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          value: rollValue,
          used: false,
          timestamp: Date.now()
        };

        const updatedPool = [...rollPool, newRoll];
        setRollPool(updatedPool);
        setSelectedRollId((prev) => prev ?? newRoll.id);

        if (isBonusRoll) {
          sounds.playBonus();
          addLog(`🐚 ${player.short} cast ${rollName} — Bonus Throw awarded!`, 'bonus');
          setPhase('ROLL'); // Can throw again before moving
        } else {
          addLog(`🐚 ${player.short} cast ${rollName}.`, 'normal');
          setPhase('MOVE');

          // Check if any legal moves exist
          const validMoves = getAllValidMoves(players, rules, updatedPool, player.id, pairMoveMode);
          if (validMoves.length === 0) {
            addLog(
              `⏭️ ${player.short} has no legal moves for [${updatedPool
                .filter((r) => !r.used)
                .map((r) => r.value)
                .join(', ')}]. Turn passes.`,
              'system'
            );
            setTimeout(() => {
              if (isMountedRef.current) endTurn();
            }, 750);
          }
        }
      }, 520);
    },
    [phase, rollPool, players, turnIndex, consecutiveHighRolls, rules, addLog, endTurn, pairMoveMode]
  );

  // Execute a pawn movement with step-by-step hopping animation
  const handleExecuteMove = useCallback(
    (playerIdx: PlayerId, pawnIdx: number, specificRollId?: string, forcePairMode?: boolean) => {
      if (phase !== 'MOVE' && phase !== 'ROLL') return;
      const player = players.find((p) => p.id === playerIdx);
      if (!player) return;

      const rollToUseId = specificRollId ?? selectedRollId;
      const rollObj = rollPool.find((r) => r.id === rollToUseId && !r.used);
      if (!rollObj) return;

      const usePairMode = forcePairMode !== undefined ? forcePairMode : pairMoveMode;
      let moveEval = evaluateMove(players, rules, playerIdx, pawnIdx, rollObj.value, usePairMode);
      if (!moveEval.valid && usePairMode) {
        // Fallback to single pawn move if double move is invalid
        moveEval = evaluateMove(players, rules, playerIdx, pawnIdx, rollObj.value, false);
      }
      if (!moveEval.valid) return;

      setPhase('ANIMATING');

      // Animate step-by-step traversal
      const stepsToAnimate = moveEval.tracedSteps;
      let curStepIndex = 0;

      const soundType = OBJECT_THEMES[objectTheme]?.soundType || 'stone';

      const animateNextStep = () => {
        if (curStepIndex < stepsToAnimate.length) {
          const stepVal = stepsToAnimate[curStepIndex];
          const coord = getPawnCoord(playerIdx, stepVal);
          setAnimatingPawn({ playerIdx, pawnIdx, currentCoord: coord });
          sounds.playStep(soundType);
          curStepIndex++;
          setTimeout(animateNextStep, 95);
        } else {
          // Animation finished: finalize board state
          setAnimatingPawn(null);

          // Mark roll as used
          const nextPool = rollPool.map((r) => (r.id === rollObj.id ? { ...r, used: true } : r));
          setRollPool(nextPool);

          // Update player's pawns
          const updatedPlayers = players.map((pl) => {
            if (pl.id !== playerIdx) return pl;

            let updatedPawns = pl.pawns.map((pw) => {
              if (pw.id === pawnIdx) {
                return {
                  ...pw,
                  step: moveEval.targetStep,
                  finished: moveEval.targetStep === 24
                };
              }
              if (moveEval.movingCount === 2 && pw.id === moveEval.partnerPawnId) {
                return {
                  ...pw,
                  step: moveEval.targetStep,
                  finished: moveEval.targetStep === 24
                };
              }
              return pw;
            });

            return {
              ...pl,
              pawns: updatedPawns,
              cutsMade: pl.cutsMade + moveEval.cutVictims.length,
              hasHit: pl.hasHit || moveEval.cutVictims.length > 0
            };
          });

          // Handle captured opponent pawns (returned to step 0)
          let earnedCutBonus = false;
          if (moveEval.cutVictims.length > 0) {
            earnedCutBonus = true;
            sounds.playCut();

            moveEval.cutVictims.forEach((victim) => {
              const opp = updatedPlayers.find((p) => p.id === victim.oppId);
              if (opp) {
                const victimPawn = opp.pawns.find((pw) => pw.id === victim.pawnId);
                if (victimPawn) {
                  victimPawn.step = 0;
                  victimPawn.finished = false;
                }
                const unlocked = !player.hasHit;
                addLog(
                  `⚔️ ${player.short} CUT ${opp.short}'s pawn at (${moveEval.targetCoord[0] + 1},${
                    moveEval.targetCoord[1] + 1
                  })! ${unlocked ? '🔓 Inner Blood-Gate UNLOCKED & ' : ''}Bonus Throw awarded!`,
                  'cut'
                );
              }
            });
          } else if (moveEval.isHomeFinish) {
            sounds.playHome();
            addLog(
              `☸️ ${player.short} guided ${
                moveEval.movingCount === 2 ? 'a Double pair' : 'a pawn'
              } into the central Ashoka Chakra Sanctuary!`,
              'home'
            );
          } else {
            const label = moveEval.movingCount === 2 ? 'Double pair' : `Pawn #${pawnIdx + 1}`;
            const orbitNote =
              moveEval.startStep <= 15 && moveEval.targetStep < moveEval.startStep
                ? ' (continuing outer loop — 1 cut needed for inner gate)'
                : '';
            addLog(
              `${player.short} advanced ${label} by ${rollObj.value} to Step ${moveEval.targetStep}${orbitNote}.`,
              'normal'
            );
          }

          if (moveEval.formsDouble) {
            sounds.playDoubleLock();
          }

          setPlayers(updatedPlayers);

          // Check Victory Condition: all 4 pawns at step 24
          const currentPl = updatedPlayers.find((p) => p.id === playerIdx);
          if (currentPl && currentPl.pawns.every((p) => p.step === 24)) {
            setPhase('GAMEOVER');
            setWinner(currentPl);
            sounds.playVictory();
            addLog(
              `🏆 VICTORY! ${currentPl.name} (${currentPl.gemName}) has safely guided all 4 pawns home!`,
              'home'
            );
            return;
          }

          // If cut earned a bonus throw, set phase to ROLL so player casts again!
          if (earnedCutBonus) {
            setPhase('ROLL');
            const nextUnused = nextPool.find((r) => !r.used);
            setSelectedRollId(nextUnused ? nextUnused.id : null);
            return;
          }

          // Check remaining unused rolls in pool
          const remainingUnused = nextPool.filter((r) => !r.used);
          if (remainingUnused.length > 0) {
            setSelectedRollId(remainingUnused[0].id);
            setPhase('MOVE');

            // Verify if remaining moves are valid
            const validMoves = getAllValidMoves(
              updatedPlayers,
              rules,
              remainingUnused,
              playerIdx,
              pairMoveMode
            );
            if (validMoves.length === 0) {
              addLog(`⏭️ No further legal moves for remaining rolls. Turn passes.`, 'system');
              setTimeout(() => {
                if (isMountedRef.current) endTurn();
              }, 700);
            }
          } else {
            endTurn();
          }
        }
      };

      animateNextStep();
    },
    [phase, players, rollPool, selectedRollId, rules, pairMoveMode, addLog, endTurn, objectTheme]
  );

  // AI Autonomous Bot Execution Effect
  useEffect(() => {
    const activePlayer = players.find((p) => p.id === turnIndex);
    if (!activePlayer || !activePlayer.isAI || phase === 'GAMEOVER' || phase === 'ANIMATING') {
      return;
    }

    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);

    aiTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;

      if (phase === 'ROLL') {
        handleThrow();
      } else if (phase === 'MOVE') {
        const bestMove = findBestBotMove(
          players,
          rules,
          rollPool,
          activePlayer.id,
          botDifficulty
        );
        if (bestMove) {
          handleExecuteMove(activePlayer.id, bestMove.pawnId, bestMove.rollObj.id, bestMove.asPair);
        } else {
          endTurn();
        }
      }
    }, 640);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [turnIndex, phase, players, rules, rollPool, botDifficulty, handleThrow, handleExecuteMove, endTurn]);

  // Reset countdown timer on turn change or phase change
  useEffect(() => {
    setTimeLeft(turnTimerDuration);
  }, [turnIndex, phase, turnTimerDuration]);

  // Human Turn Countdown Timer Effect
  useEffect(() => {
    const activePlayer = players.find((p) => p.id === turnIndex);
    // Only countdown for active human players during ROLL or MOVE phase
    if (
      !activePlayer ||
      activePlayer.isAI ||
      phase === 'GAMEOVER' ||
      phase === 'ANIMATING' ||
      isRolling ||
      !turnTimerEnabled ||
      isSettingsOpen ||
      isThemeModalOpen
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired! Trigger automatic action based on current phase
          if (phase === 'ROLL') {
            addLog(
              `⏰ Time expired! Auto-casting cowrie shells for ${activePlayer.short}...`,
              'system'
            );
            handleThrow();
          } else if (phase === 'MOVE') {
            const unusedRolls = rollPool.filter((r) => !r.used);
            const validMoves = getAllValidMoves(
              players,
              rules,
              unusedRolls,
              activePlayer.id,
              pairMoveMode
            );
            if (validMoves.length > 0) {
              const randMove = validMoves[Math.floor(Math.random() * validMoves.length)];
              addLog(
                `⏰ Time expired! Auto-selected move for ${activePlayer.short} (Pawn #${randMove.pawnId + 1}).`,
                'system'
              );
              handleExecuteMove(activePlayer.id, randMove.pawnId, randMove.rollObj.id, randMove.asPair);
            } else {
              addLog(
                `⏰ Time expired! No legal moves, passing turn for ${activePlayer.short}.`,
                'system'
              );
              endTurn();
            }
          }
          return turnTimerDuration;
        }

        // Low time warning tick (at 5, 4, 3, 2, 1 seconds)
        if (prev <= 6 && prev > 1) {
          sounds.playTimerTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    turnIndex,
    phase,
    players,
    rules,
    rollPool,
    pairMoveMode,
    isRolling,
    turnTimerEnabled,
    turnTimerDuration,
    isSettingsOpen,
    isThemeModalOpen,
    handleThrow,
    handleExecuteMove,
    endTurn,
    addLog
  ]);

  // Apply settings from Setup Modal and start new match
  const handleApplySettings = () => {
    setIsSettingsOpen(false);
    setActiveTab('play');
    initMatch(mode, botDifficulty, rules);
  };

  const activePlayer = players.find((p) => p.id === turnIndex) || players[0];
  const rulesSummary = `Blood-Gate: ${rules.bloodGate ? 'ON' : 'OFF'} • Doubles: ${
    rules.doubles ? 'ON' : 'OFF'
  } • 3× Bust: ${rules.threeBust ? 'ON' : 'OFF'}`;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenThemes={() => setIsThemeModalOpen(true)}
        onResetMatch={() => initMatch()}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 py-4">
        {/* TAB 1: PLAY BOARD */}
        {activeTab === 'play' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Traditional Game Board with Selected Theme (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <GameBoard
                players={players}
                turnIndex={turnIndex}
                phase={phase}
                selectedRollId={selectedRollId}
                rollPool={rollPool}
                pairMoveMode={pairMoveMode}
                onExecuteMove={handleExecuteMove}
                pathPreviewPlayer={pathPreviewPlayer}
                setPathPreviewPlayer={setPathPreviewPlayer}
                showStepNumbers={showStepNumbers}
                setShowStepNumbers={setShowStepNumbers}
                boardTheme={boardTheme}
                objectTheme={objectTheme}
                animatingPawn={animatingPawn}
              />
            </div>

            {/* Right Column: Cowrie Shell Tray, Player Houses, and Chronicle Log (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3.5">
              {/* Cowrie Shells & Active Roll Pool Card */}
              <CowrieTray
                activePlayer={activePlayer}
                phase={phase}
                shells={lastShells}
                rollPool={rollPool}
                selectedRollId={selectedRollId}
                onSelectRoll={(id) => setSelectedRollId(id)}
                onThrow={() => handleThrow()}
                onForceRoll={(val) => handleThrow(val)}
                pairMoveMode={pairMoveMode}
                onTogglePairMode={() => setPairMoveMode((prev) => !prev)}
                lastRollText={lastRollText}
                isRolling={isRolling}
                objectTheme={objectTheme}
                timeLeft={timeLeft}
                turnTimerDuration={turnTimerDuration}
                turnTimerEnabled={turnTimerEnabled}
              />

              {/* 4 Houses Status Grid */}
              <PlayerCards
                players={players}
                turnIndex={turnIndex}
                objectTheme={objectTheme}
              />

              {/* Move Chronicle Log */}
              <MoveLog logs={logs} rulesSummary={rulesSummary} />
            </div>
          </div>
        )}

        {/* TAB 2: PATH GEOMETRY & ODDS ANALYZER */}
        {activeTab === 'analysis' && <OddsAnalysisTab />}

        {/* TAB 3: COMPLETE TRADITIONAL RULES */}
        {activeTab === 'rules' && <RulesTab />}
      </main>

      {/* Theme Customization Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentBoardTheme={boardTheme}
        currentObjectTheme={objectTheme}
        onSelectThemes={(b, o) => {
          setBoardTheme(b);
          setObjectTheme(o);
          addLog(
            `🎨 Themes applied: ${BOARD_THEMES[b].name} surface with ${OBJECT_THEMES[o].name}.`,
            'system'
          );
        }}
      />

      {/* Match Setup & Traditional Rules Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mode={mode}
        setMode={setMode}
        botDifficulty={botDifficulty}
        setBotDifficulty={setBotDifficulty}
        rules={rules}
        setRules={setRules}
        turnTimerDuration={turnTimerDuration}
        setTurnTimerDuration={setTurnTimerDuration}
        turnTimerEnabled={turnTimerEnabled}
        setTurnTimerEnabled={setTurnTimerEnabled}
        onApplyAndRestart={handleApplySettings}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        winner={winner}
        turnCount={turnCount}
        onPlayAgain={() => initMatch()}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
