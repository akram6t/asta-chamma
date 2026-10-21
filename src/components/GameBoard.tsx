import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coord, PlayerId, PlayerState, RollItem, MoveEvaluation, BoardThemeId, ObjectThemeId } from '../game/types';
import { PLAYER_PATHS, isSafeCell, HOUSE_DEFS } from '../game/constants';
import { evaluateMove, getPawnCoord } from '../game/rules';
import { BOARD_THEMES, OBJECT_THEMES } from '../game/themes';
import { PawnToken } from './PawnToken';

interface GameBoardProps {
  players: PlayerState[];
  turnIndex: PlayerId;
  phase: 'ROLL' | 'MOVE' | 'ANIMATING' | 'GAMEOVER';
  selectedRollId: string | null;
  rollPool: RollItem[];
  pairMoveMode: boolean;
  onExecuteMove: (playerIdx: PlayerId, pawnIdx: number) => void;
  pathPreviewPlayer: number; // -1 for active player, 0..3 for specific house
  setPathPreviewPlayer: (idx: number) => void;
  showStepNumbers: boolean;
  setShowStepNumbers: (show: boolean) => void;
  boardTheme: BoardThemeId;
  objectTheme: ObjectThemeId;
  animatingPawn: {
    playerIdx: PlayerId;
    pawnIdx: number;
    currentCoord: Coord;
  } | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  players,
  turnIndex,
  phase,
  selectedRollId,
  rollPool,
  pairMoveMode,
  onExecuteMove,
  pathPreviewPlayer,
  setPathPreviewPlayer,
  showStepNumbers,
  setShowStepNumbers,
  boardTheme,
  objectTheme,
  animatingPawn
}) => {
  const [hoveredCell, setHoveredCell] = useState<Coord | null>(null);
  const [hoveredPawn, setHoveredPawn] = useState<{ playerIdx: PlayerId; pawnIdx: number } | null>(null);

  const activePlayer = players.find(p => p.id === turnIndex) || players[0];
  const selectedRoll = rollPool.find(r => r.id === selectedRollId && !r.used);

  const bTheme = BOARD_THEMES[boardTheme] || BOARD_THEMES.khadi;
  const oTheme = OBJECT_THEMES[objectTheme] || OBJECT_THEMES.agate;

  // Compute movable pawns & candidate move trajectories
  const movablePawnEvaluations = new Map<number, MoveEvaluation>();
  const hasUnusedRolls = rollPool.some(r => !r.used);
  if ((phase === 'MOVE' || hasUnusedRolls) && selectedRoll && !activePlayer.isAI) {
    activePlayer.pawns.forEach(pawn => {
      let ev = evaluateMove(players, { bloodGate: true, doubles: true, threeBust: false }, activePlayer.id, pawn.id, selectedRoll.value, pairMoveMode);
      if (!ev.valid && pairMoveMode) {
        ev = evaluateMove(players, { bloodGate: true, doubles: true, threeBust: false }, activePlayer.id, pawn.id, selectedRoll.value, false);
      }
      if (ev.valid) {
        movablePawnEvaluations.set(pawn.id, ev);
      }
    });
  }

  // Active path to preview (either selected or active turn)
  const routePlayerId: PlayerId = (pathPreviewPlayer === -1 ? activePlayer.id : pathPreviewPlayer) as PlayerId;
  const routePath = PLAYER_PATHS[routePlayerId];
  const routeHouseColors = oTheme.getHouseColors(routePlayerId);

  // If a pawn is hovered and is movable, get its target coord and traced path
  const hoveredMoveEval = hoveredPawn ? movablePawnEvaluations.get(hoveredPawn.pawnIdx) : null;

  return (
    <div className="flex flex-col items-center w-full max-w-[620px] mx-auto select-none">
      {/* Board Mat Container with Theme Background */}
      <div className={`w-full ${bTheme.matClass} rounded-3xl p-3 sm:p-5 border-2 border-stone-500/40 shadow-2xl relative transition-all duration-300`}>
        {/* Top Cultural Title */}
        <div className="text-center mb-1.5">
          <h2
            className="font-heritage font-extrabold text-base sm:text-xl tracking-tight flex items-center justify-center gap-2"
            style={{ color: bTheme.textColor }}
          >
            <span>Asta Chamma</span>
            <span className="text-xs sm:text-sm font-semibold opacity-90">(Chinnata | 5 Houses)</span>
          </h2>
        </div>

        {/* Board with Vertical Calligraphy Ribbons */}
        <div className="flex items-stretch justify-center gap-1 sm:gap-2">
          {/* Left Vertical Regional Names */}
          <div
            className="vertical-text-left text-[9px] sm:text-[11px] font-extrabold tracking-widest flex items-center justify-center py-2 px-0.5 select-none opacity-85"
            style={{ color: bTheme.accentText }}
          >
            Daayam / Thaayam • Chauka Bara / Katte Mane
          </div>

          {/* 5x5 Grid Board Container */}
          <div
            className="relative flex-1 aspect-square max-w-[480px] w-full rounded-sm shadow-inner overflow-hidden border-[4.5px]"
            style={{
              borderColor: bTheme.gridLineColor,
              backgroundColor: bTheme.chakraFill
            }}
          >
            {/* Background SVG for Paths, Crosses & Ashoka Chakra */}
            <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Spiral Route Path Ribbon */}
              <polyline
                points={routePath.map(([r, c]) => `${c * 100 + 50},${r * 100 + 50}`).join(' ')}
                fill="none"
                stroke={routeHouseColors.primary}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.22"
              />

              {/* Inner 3x3 Loop Accent Frame */}
              <rect
                x="102"
                y="102"
                width="296"
                height="296"
                fill={bTheme.bgCellInner}
                stroke={bTheme.innerBorderColor}
                strokeWidth="2.5"
                strokeDasharray="8 5"
              />

              {/* Grid Lines */}
              {[1, 2, 3, 4].map(i => (
                <g key={`lines_${i}`}>
                  {/* Horizontal */}
                  <line x1="0" y1={i * 100} x2="500" y2={i * 100} stroke={bTheme.gridLineColor} strokeWidth={bTheme.gridLineWidth} />
                  {/* Vertical */}
                  <line x1={i * 100} y1="0" x2={i * 100} y2="500" stroke={bTheme.gridLineColor} strokeWidth={bTheme.gridLineWidth} />
                </g>
              ))}

              {/* Diagonal Crosses for 5 Safe Houses: (4,2), (2,4), (0,2), (2,0), and (2,2) */}
              {[
                [4, 2],
                [2, 4],
                [0, 2],
                [2, 0],
                [2, 2]
              ].map(([r, c]) => {
                const x = c * 100;
                const y = r * 100;
                return (
                  <g key={`safe_cross_${r}_${c}`} stroke={bTheme.safeHouseCrossColor} strokeWidth="3.2" strokeLinecap="round">
                    <line x1={x + 3} y1={y + 3} x2={x + 97} y2={y + 97} />
                    <line x1={x + 97} y1={y + 3} x2={x + 3} y2={y + 97} />
                  </g>
                );
              })}

              {/* Center Sanctuary (2,2) - Authentic 24-spoke Ashoka Chakra Medallion */}
              <g transform="translate(250, 250)">
                <circle cx="0" cy="0" r="28" fill={bTheme.chakraFill} />
                <circle cx="0" cy="0" r="25" fill="none" stroke={bTheme.chakraStroke} strokeWidth="2.6" />
                <circle cx="0" cy="0" r="20.5" fill="none" stroke={bTheme.chakraStroke} strokeWidth="1.2" />
                <circle cx="0" cy="0" r="4.5" fill={bTheme.chakraStroke} />
                {/* 24 spokes */}
                {Array.from({ length: 24 }).map((_, idx) => {
                  const ang = (idx * 360) / 24;
                  return (
                    <line
                      key={`spoke_${idx}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-20.5"
                      stroke={bTheme.chakraStroke}
                      strokeWidth="1.2"
                      transform={`rotate(${ang})`}
                    />
                  );
                })}
              </g>

              {/* Hovered Move Trajectory Preview Line */}
              {hoveredMoveEval && (
                <polyline
                  points={[
                    `${getPawnCoord(activePlayer.id, hoveredMoveEval.startStep)[1] * 100 + 50},${
                      getPawnCoord(activePlayer.id, hoveredMoveEval.startStep)[0] * 100 + 50
                    }`,
                    ...hoveredMoveEval.tracedSteps.map(
                      st => `${getPawnCoord(activePlayer.id, st)[1] * 100 + 50},${getPawnCoord(activePlayer.id, st)[0] * 100 + 50}`
                    )
                  ].join(' ')}
                  fill="none"
                  stroke={routeHouseColors.primary}
                  strokeWidth="5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              )}
            </svg>

            {/* Interactive Grid Overlay (5x5 Cells) */}
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 w-full h-full">
              {Array.from({ length: 25 }).map((_, i) => {
                const r = Math.floor(i / 5);
                const c = i % 5;
                const safe = isSafeCell(r, c);

                // Step index for route preview
                const stepNum = routePath.findIndex(([pr, pc]) => pr === r && pc === c);

                // Check if this cell is target of any movable pawn
                let targetOfMove: MoveEvaluation | null = null;
                for (const ev of movablePawnEvaluations.values()) {
                  if (ev.targetCoord[0] === r && ev.targetCoord[1] === c) {
                    targetOfMove = ev;
                    break;
                  }
                }

                // Check occupants of this cell
                const cellPawns: { player: PlayerState; pawnId: number }[] = [];
                players.forEach(pl => {
                  if (!pl.active) return;
                  pl.pawns.forEach(pw => {
                    // If this pawn is animating, its position is controlled separately
                    if (animatingPawn && animatingPawn.playerIdx === pl.id && animatingPawn.pawnIdx === pw.id) {
                      return;
                    }
                    const [pr, pc] = getPawnCoord(pl.id, pw.step);
                    if (pr === r && pc === c) {
                      cellPawns.push({ player: pl, pawnId: pw.id });
                    }
                  });
                });

                // Check for Doubles (stacked friendly pawns)
                const doubleCounts: Record<PlayerId, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
                cellPawns.forEach(cp => {
                  doubleCounts[cp.player.id]++;
                });

                // Check if this cell contains any movable pawn of active player
                const movablePawnInCell = cellPawns.find(
                  cp => cp.player.id === activePlayer.id && movablePawnEvaluations.has(cp.pawnId)
                );

                return (
                  <div
                    key={`cell_${r}_${c}`}
                    onMouseEnter={() => setHoveredCell([r, c])}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => {
                      if (movablePawnInCell) {
                        onExecuteMove(activePlayer.id, movablePawnInCell.pawnId);
                      }
                    }}
                    className="relative w-full h-full flex items-center justify-center cursor-pointer transition"
                  >
                    {/* Legal Target Cell Highlight */}
                    {targetOfMove && (
                      <div
                        className={`absolute inset-1 rounded-md transition ${
                          targetOfMove.cutVictims.length > 0
                            ? 'bg-rose-500/25 border-2 border-rose-500 ring-2 ring-rose-500/40 animate-pulse'
                            : 'bg-emerald-500/25 border-2 border-emerald-500 ring-2 ring-emerald-500/30'
                        }`}
                      />
                    )}

                    {/* Step Number Display (if toggled) */}
                    {showStepNumbers && stepNum !== -1 && (
                      <span
                        className="absolute top-1 left-1.5 text-[9px] sm:text-[11px] font-black pointer-events-none drop-shadow-sm"
                        style={{ color: routeHouseColors.primary }}
                      >
                        #{stepNum}
                      </span>
                    )}

                    {/* Render Pawns inside this cell */}
                    {cellPawns.length > 0 && (
                      <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
                        {cellPawns.map((item, pIndex) => {
                          const isMovable = movablePawnEvaluations.has(item.pawnId) && item.player.id === activePlayer.id;
                          const total = cellPawns.length;

                          // Position tokens cleanly within the cell:
                          let posStyle: React.CSSProperties = {
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                          };

                          if (safe && total <= 4 && !(r === 2 && c === 2)) {
                            // Triangle quadrant positions matching authentic photo
                            const quadrants = [
                              { left: '50%', top: '22%' }, // Top triangle
                              { left: '78%', top: '50%' }, // Right triangle
                              { left: '50%', top: '78%' }, // Bottom triangle
                              { left: '22%', top: '50%' }  // Left triangle
                            ];
                            posStyle = {
                              ...quadrants[pIndex % 4],
                              transform: 'translate(-50%, -50%)'
                            };
                          } else if (total > 1) {
                            // Arranged in circle around cell
                            const ang = (pIndex * (Math.PI * 2)) / total - Math.PI / 4;
                            const dist = total <= 4 ? 26 : 32;
                            posStyle = {
                              left: `${50 + Math.cos(ang) * dist}%`,
                              top: `${50 + Math.sin(ang) * dist}%`,
                              transform: 'translate(-50%, -50%)'
                            };
                          }

                          return (
                            <button
                              type="button"
                              aria-label={`Pawn ${item.pawnId + 1} of ${item.player.name}`}
                              key={`pawn_${item.player.id}_${item.pawnId}`}
                              style={posStyle}
                              onMouseEnter={() =>
                                isMovable && setHoveredPawn({ playerIdx: item.player.id, pawnIdx: item.pawnId })
                              }
                              onMouseLeave={() => setHoveredPawn(null)}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isMovable) {
                                  onExecuteMove(item.player.id, item.pawnId);
                                }
                              }}
                              className={`absolute transition-transform duration-200 outline-none ${
                                isMovable
                                  ? 'hover:scale-125 z-20 cursor-pointer'
                                  : 'z-10 cursor-default'
                              }`}
                            >
                              {/* Pulsing ring for movable pawns */}
                              {isMovable && (
                                <motion.div
                                  animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.4, 0.9] }}
                                  transition={{ repeat: Infinity, duration: 1.3 }}
                                  className="absolute -inset-1.5 rounded-full border-2 border-amber-400 bg-amber-400/20 shadow-md shadow-amber-400/40 pointer-events-none"
                                />
                              )}

                              {/* Styled Pawn Token Component */}
                              <PawnToken
                                playerIdx={item.player.id}
                                pawnId={item.pawnId}
                                objectTheme={objectTheme}
                              />
                            </button>
                          );
                        })}

                        {/* Double / Twin Stack Badge (🔗 2x) */}
                        {Object.entries(doubleCounts).map(([pIdStr, count]) => {
                          const pId = parseInt(pIdStr, 10) as PlayerId;
                          if (count >= 2 && !safe) {
                            return (
                              <div
                                key={`double_badge_${r}_${c}_${pId}`}
                                className="absolute z-25 -bottom-1 px-1.5 py-0.2 bg-stone-950/95 border border-amber-400 rounded-full text-[9px] font-black text-amber-300 shadow-lg flex items-center gap-0.5"
                              >
                                <span>🔗</span>
                                <span>{count}×</span>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Animating Pawn Floating Layer (Step-by-Step Hop) */}
            {animatingPawn && (
              <motion.div
                initial={false}
                animate={{
                  left: `${animatingPawn.currentCoord[1] * 20 + 10}%`,
                  top: `${animatingPawn.currentCoord[0] * 20 + 10}%`
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <motion.div
                  animate={{ y: [-8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.18 }}
                >
                  <PawnToken
                    playerIdx={animatingPawn.playerIdx}
                    pawnId={animatingPawn.pawnIdx}
                    objectTheme={objectTheme}
                    size="lg"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Hover Tooltip (Zone & Step info) */}
            {hoveredCell && (
              <div className="absolute top-2 left-2 bg-stone-900/95 text-amber-100 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md border border-amber-500/40 pointer-events-none shadow-xl z-30">
                {hoveredCell[0] === 2 && hoveredCell[1] === 2
                  ? '☸️ Central Ashoka Chakra (Step 24 Sanctuary)'
                  : isSafeCell(hoveredCell[0], hoveredCell[1])
                  ? `🛡️ Safe House Cross (${hoveredCell[0] + 1},${hoveredCell[1] + 1})`
                  : hoveredCell[0] >= 1 && hoveredCell[0] <= 3 && hoveredCell[1] >= 1 && hoveredCell[1] <= 3
                  ? `↻ Inner Clockwise Loop (${hoveredCell[0] + 1},${hoveredCell[1] + 1})`
                  : `↺ Outer Perimeter Track (${hoveredCell[0] + 1},${hoveredCell[1] + 1})`}
              </div>
            )}
          </div>

          {/* Right Vertical Regional Names */}
          <div
            className="vertical-text-right text-[9px] sm:text-[11px] font-extrabold tracking-widest flex items-center justify-center py-2 px-0.5 select-none opacity-85"
            style={{ color: bTheme.accentText }}
          >
            Champool • Chomal Ishto / Kaangi chaala • Changa po
          </div>
        </div>

        {/* Bottom Cultural Footer */}
        <div
          className="mt-2.5 pt-1.5 flex items-center justify-between text-[10px] sm:text-xs font-bold px-2 sm:px-4 border-t border-stone-400/30"
          style={{ color: bTheme.textColor }}
        >
          <span className="tracking-wide">☸ Traditional 5×5 Spiral Grid</span>
          <span className="opacity-90 hidden sm:inline">Outer: Counter-Clockwise ↺ • Inner: Clockwise ↻</span>
        </div>
      </div>

      {/* Path Inspector & Legend Controls Below Board */}
      <div className="w-full mt-3 bg-stone-900/90 border border-stone-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-stone-400 font-semibold text-[11px]">Show Spiral Path:</span>
          <button
            onClick={() => setPathPreviewPlayer(-1)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
              pathPreviewPlayer === -1 ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-300 hover:text-white'
            }`}
          >
            Active
          </button>
          {HOUSE_DEFS.map((h, i) => {
            const hColors = oTheme.getHouseColors(h.id);
            return (
              <button
                key={h.id}
                onClick={() => setPathPreviewPlayer(i)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  pathPreviewPlayer === i ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 hover:bg-stone-700'
                }`}
                style={{ color: pathPreviewPlayer === i ? '#0c0a09' : hColors.light }}
              >
                {h.short}
              </button>
            );
          })}
        </div>

        <label className="flex items-center gap-1.5 text-stone-300 cursor-pointer text-[11px]">
          <input
            type="checkbox"
            checked={showStepNumbers}
            onChange={(e) => setShowStepNumbers(e.target.checked)}
            className="rounded bg-stone-800 border-stone-600 text-amber-500 focus:ring-amber-400"
          />
          <span>Step Numbers (#0..#24)</span>
        </label>
      </div>
    </div>
  );
};
