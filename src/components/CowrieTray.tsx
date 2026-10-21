import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Link2, Dices, Timer } from 'lucide-react';
import { PlayerState, RollItem, ObjectThemeId } from '../game/types';
import { ROLL_NAMES } from '../game/constants';
import { OBJECT_THEMES } from '../game/themes';

interface CowrieTrayProps {
  activePlayer: PlayerState;
  phase: 'ROLL' | 'MOVE' | 'ANIMATING' | 'GAMEOVER';
  shells: [number, number, number, number];
  rollPool: RollItem[];
  selectedRollId: string | null;
  onSelectRoll: (id: string) => void;
  onThrow: () => void;
  onForceRoll: (val: number) => void;
  pairMoveMode: boolean;
  onTogglePairMode: () => void;
  lastRollText: string;
  isRolling: boolean;
  objectTheme?: ObjectThemeId;
  timeLeft?: number;
  turnTimerDuration?: number;
  turnTimerEnabled?: boolean;
}

export const CowrieTray: React.FC<CowrieTrayProps> = ({
  activePlayer,
  phase,
  shells,
  rollPool,
  selectedRollId,
  onSelectRoll,
  onThrow,
  onForceRoll,
  pairMoveMode,
  onTogglePairMode,
  lastRollText,
  isRolling,
  objectTheme = 'agate',
  timeLeft = 20,
  turnTimerDuration = 20,
  turnTimerEnabled = true
}) => {
  const unusedRolls = rollPool.filter((r) => !r.used);
  const canThrow = (phase === 'ROLL' || unusedRolls.length > 0) && !activePlayer.isAI && phase !== 'ANIMATING' && phase !== 'GAMEOVER';
  const hasBonusPending = unusedRolls.some(r => r.value === 4 || r.value === 8);

  const showTimer = !activePlayer.isAI && phase !== 'GAMEOVER' && phase !== 'ANIMATING' && turnTimerEnabled;

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl">
      {/* Current Turn Header */}
      <div className="mb-3 pb-2.5 border-b border-stone-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-4 h-4 rounded-full ring-4 shadow-sm"
              style={{
                backgroundColor: activePlayer.primary,
                boxShadow: `0 0 0 4px ${activePlayer.glow}`
              }}
            />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                Current Turn {activePlayer.isAI ? '(AI Bot)' : ''}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>{activePlayer.name}</span>
                <span className="text-xs font-medium text-stone-400">({activePlayer.gemName})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visual Turn Countdown Timer Badge for Human Players */}
            {showTimer && (
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border transition select-none ${
                  timeLeft <= 5
                    ? 'bg-rose-500/25 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/30'
                    : timeLeft <= 10
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-stone-950/80 border-stone-700 text-stone-200'
                }`}
                title={`Turn Timer: ${timeLeft}s remaining`}
              >
                <Timer className={`w-3.5 h-3.5 ${timeLeft <= 5 ? 'text-rose-400 animate-spin' : 'text-amber-400'}`} />
                <span>{timeLeft}s</span>
              </div>
            )}

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                phase === 'ROLL'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10 animate-pulse'
                  : phase === 'MOVE'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                  : phase === 'ANIMATING'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {phase === 'ROLL'
                ? activePlayer.isAI ? '🤖 AI Casting...' : 'Cast Cowries'
                : phase === 'MOVE'
                ? activePlayer.isAI ? '🤖 AI Selecting...' : 'Select Pawn'
                : phase === 'ANIMATING'
                ? 'Hopping...'
                : 'Match Over'}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar for Human Turn Timer */}
        {showTimer && (
          <div className="w-full bg-stone-950/90 h-1.5 rounded-full overflow-hidden mt-2.5 p-0.5 border border-stone-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                timeLeft <= 5
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
                  : timeLeft <= 10
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{
                width: `${Math.max(0, Math.min(100, (timeLeft / (turnTimerDuration || 20)) * 100))}%`
              }}
            />
          </div>
        )}
      </div>

      {/* 4 Cowrie Shells Tray */}
      <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-3.5 mb-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
            <span>4 Cowrie Shells</span>
            <span className="text-[11px] text-stone-500 italic">(Gavvalu / Kavade)</span>
          </span>
          <span className="text-xs font-extrabold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-600/40">
            {lastRollText}
          </span>
        </div>

        {/* 4 Cowrie Shells Visual Cards with 3D Flip & Tumble Motion */}
        <div className="grid grid-cols-4 gap-2.5 my-2.5">
          {shells.map((mouthUp, idx) => (
            <motion.div
              key={idx}
              animate={
                isRolling
                  ? {
                      y: [-25, 4, 0],
                      rotateX: [0, 180, 360],
                      rotateZ: [-20, 30, (idx - 1.5) * 15],
                      scale: [1, 1.18, 1]
                    }
                  : {
                      y: 0,
                      rotateX: 0,
                      rotateZ: (idx - 1.5) * 8,
                      scale: 1
                    }
              }
              transition={{
                duration: 0.52,
                delay: idx * 0.05,
                ease: 'easeInOut'
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl bg-stone-900/90 border transition shadow-lg ${
                mouthUp
                  ? 'border-amber-400/50 bg-gradient-to-b from-amber-950/30 to-stone-900 shadow-amber-500/10'
                  : 'border-stone-800 bg-stone-900'
              }`}
            >
              <div className="w-14 h-9 relative flex items-center justify-center">
                {mouthUp ? (
                  /* Authentic Mouth-Up Cowrie Shell with Serrated Lips */
                  <svg viewBox="0 0 64 44" className="w-full h-full drop-shadow">
                    <defs>
                      <linearGradient id={`gradShell_${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        {objectTheme === 'brass' ? (
                          <>
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#854d0e" />
                          </>
                        ) : objectTheme === 'channapatna' ? (
                          <>
                            <stop offset="0%" stopColor="#fed7aa" />
                            <stop offset="50%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#78350f" />
                          </>
                        ) : objectTheme === 'crystal' ? (
                          <>
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="40%" stopColor="#f0abfc" />
                            <stop offset="70%" stopColor="#a5f3fc" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#fffbf2" />
                            <stop offset="60%" stopColor="#f3eee3" />
                            <stop offset="100%" stopColor="#ded5c4" />
                          </>
                        )}
                      </linearGradient>
                      <radialGradient id={`glow_${idx}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(251, 191, 36, 0.4)" />
                        <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
                      </radialGradient>
                    </defs>
                    <ellipse cx="32" cy="22" rx="30" ry="19" fill={`url(#glow_${idx})`} />
                    <ellipse cx="32" cy="22" rx="27" ry="18" fill={`url(#gradShell_${idx})`} stroke={objectTheme === 'brass' ? '#ca8a04' : '#c8bea8'} strokeWidth="1.8" />
                    <ellipse cx="32" cy="22" rx="22" ry="13" fill={objectTheme === 'brass' ? '#fef08a' : objectTheme === 'crystal' ? '#fdf4ff' : '#f8f4ec'} />
                    {/* Aperture slit */}
                    <path d="M12 22 Q32 17 52 22 Q32 27 12 22 Z" fill={objectTheme === 'brass' ? '#422006' : objectTheme === 'channapatna' ? '#451a03' : '#292524'} />
                    {/* Serrated tooth ridges */}
                    <path
                      d="M17 19 L17 25 M22 18 L22 26 M27 18 L27 26 M32 18 L32 26 M37 18 L37 26 M42 18 L42 26 M47 19 L47 25"
                      stroke={objectTheme === 'brass' ? '#fef08a' : '#f5f5f4'}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  /* Smooth Inverted Dorsal Hump */
                  <svg viewBox="0 0 64 44" className="w-full h-full drop-shadow">
                    <defs>
                      <linearGradient id={`gradHump_${idx}`} x1="30%" y1="0%" x2="70%" y2="100%">
                        {objectTheme === 'brass' ? (
                          <>
                            <stop offset="0%" stopColor="#fef9c3" />
                            <stop offset="50%" stopColor="#ca8a04" />
                            <stop offset="100%" stopColor="#713f12" />
                          </>
                        ) : objectTheme === 'channapatna' ? (
                          <>
                            <stop offset="0%" stopColor="#ffedd5" />
                            <stop offset="50%" stopColor="#b45309" />
                            <stop offset="100%" stopColor="#78350f" />
                          </>
                        ) : objectTheme === 'crystal' ? (
                          <>
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="40%" stopColor="#bae6fd" />
                            <stop offset="70%" stopColor="#fbcfe8" />
                            <stop offset="100%" stopColor="#ddd6fe" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#faf7f0" />
                            <stop offset="50%" stopColor="#ede5d5" />
                            <stop offset="100%" stopColor="#cfc4ae" />
                          </>
                        )}
                      </linearGradient>
                    </defs>
                    <ellipse cx="32" cy="22" rx="27" ry="18" fill={`url(#gradHump_${idx})`} stroke={objectTheme === 'brass' ? '#ca8a04' : '#c8bea8'} strokeWidth="1.8" />
                    {/* Dorsal crown shine highlight */}
                    <ellipse cx="28" cy="17" rx="16" ry="8" fill="#ffffff" opacity={objectTheme === 'crystal' ? 0.85 : 0.65} />
                    <path d="M10 26 Q32 34 54 26" fill="none" stroke={objectTheme === 'brass' ? '#ca8a04' : '#beaf96'} strokeWidth="1.6" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[10px] font-bold mt-1 tracking-tight ${
                  mouthUp ? 'text-amber-300' : 'text-stone-400'
                }`}
              >
                {mouthUp ? 'Mouth Up (1)' : 'Hump Down (0)'}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons: Throw Cowries + Pair Move Toggle */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onThrow}
            disabled={!canThrow || isRolling}
            className={`flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center justify-center gap-2 select-none ${
              canThrow && !isRolling
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/20 cursor-pointer active:scale-95'
                : 'bg-stone-800 text-stone-500 border border-stone-700/60 opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="text-base">🐚</span>
            <span>
              {isRolling
                ? 'Casting Shells...'
                : hasBonusPending
                ? 'Bonus Throw! Cast Again'
                : 'Throw Cowrie Shells'}
            </span>
            {hasBonusPending && <Sparkles className="w-4 h-4 text-stone-950 animate-spin" />}
          </motion.button>

          <button
            onClick={onTogglePairMode}
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              pairMoveMode
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-stone-800/90 hover:bg-stone-700 border-stone-700 text-stone-300'
            }`}
            title="When two friendly pawns occupy the same square, advance them together as a protected Double"
          >
            <Link2 className={`w-3.5 h-3.5 ${pairMoveMode ? 'text-stone-950' : 'text-amber-400'}`} />
            <span>{pairMoveMode ? 'Move: Pair (2×)' : 'Move: Single'}</span>
          </button>
        </div>
      </div>

      {/* Active Roll Pool (Multi-Roll Accumulation for 4/8 bonus throws) */}
      <div className="bg-stone-950/70 border border-stone-800/90 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Roll Pool</span>
          </span>
          <span className="text-[11px] font-medium text-stone-400">
            {unusedRolls.length} available
          </span>
        </div>

        <div className="flex flex-wrap gap-2 min-h-[38px] items-center">
          {rollPool.length === 0 ? (
            <span className="text-xs text-stone-500 italic">
              Cast the cowries to generate movement steps...
            </span>
          ) : (
            <AnimatePresence>
              {rollPool.map((rObj) => {
                const isSelected = rObj.id === selectedRollId && !rObj.used;
                const isBonus = rObj.value === 4 || rObj.value === 8;
                return (
                  <motion.button
                    key={rObj.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={() => {
                      if (!rObj.used) onSelectRoll(rObj.id);
                    }}
                    disabled={rObj.used}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                      rObj.used
                        ? 'bg-stone-900/60 border border-stone-800 text-stone-600 line-through cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300 shadow-md shadow-amber-500/25 scale-105'
                        : isBonus
                        ? 'bg-amber-950/80 hover:bg-amber-900 border border-amber-500/50 text-amber-300'
                        : 'bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200'
                    }`}
                  >
                    <span>+{rObj.value}</span>
                    {isBonus && <span className="text-[10px] text-amber-300 font-normal">★</span>}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Quick Test Cast Bar (Sandbox controls to verify rules immediately) */}
        <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-center justify-between gap-1 flex-wrap">
          <span className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider">Test Cast:</span>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => onForceRoll(1)}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300 border border-stone-700 transition"
              title="Force Dayam (1)"
            >
              1
            </button>
            <button
              onClick={() => onForceRoll(2)}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300 border border-stone-700 transition"
              title="Force Duga (2)"
            >
              2
            </button>
            <button
              onClick={() => onForceRoll(3)}
              className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300 border border-stone-700 transition"
              title="Force Thiga (3)"
            >
              3
            </button>
            <button
              onClick={() => onForceRoll(4)}
              className="px-2 py-0.5 rounded bg-amber-950/70 hover:bg-amber-900 text-[10px] text-amber-300 border border-amber-700/50 transition font-bold"
              title="Force Chamma (4 - Extra Roll)"
            >
              4 (Chamma+)
            </button>
            <button
              onClick={() => onForceRoll(8)}
              className="px-2 py-0.5 rounded bg-amber-950/70 hover:bg-amber-900 text-[10px] text-amber-300 border border-amber-700/50 transition font-bold"
              title="Force Ashta (8 - Extra Roll)"
            >
              8 (Ashta+)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
