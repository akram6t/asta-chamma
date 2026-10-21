import React from 'react';
import { motion } from 'motion/react';
import { PlayerId, PlayerState, ObjectThemeId } from '../game/types';
import { Shield, Swords, Home, Lock, Unlock, Bot, User } from 'lucide-react';
import { OBJECT_THEMES } from '../game/themes';
import { PawnToken } from './PawnToken';

interface PlayerCardsProps {
  players: PlayerState[];
  turnIndex: PlayerId;
  objectTheme?: ObjectThemeId;
}

export const PlayerCards: React.FC<PlayerCardsProps> = ({ players, turnIndex, objectTheme = 'agate' }) => {
  const oTheme = OBJECT_THEMES[objectTheme] || OBJECT_THEMES.agate;
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {players.map((p) => {
        if (!p.active) return null;
        const isCurrentTurn = p.id === turnIndex;
        const homeCount = p.pawns.filter((pw) => pw.step === 24).length;
        const innerCount = p.pawns.filter((pw) => pw.step >= 16 && pw.step < 24).length;

        return (
          <motion.div
            key={p.id}
            animate={{
              scale: isCurrentTurn ? 1.02 : 1,
              borderColor: isCurrentTurn ? p.primary : 'rgba(41, 37, 36, 0.8)'
            }}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl p-3 border transition shadow-md relative overflow-hidden ${
              isCurrentTurn
                ? 'bg-stone-900 shadow-amber-500/10'
                : 'bg-stone-900/60 opacity-85'
            }`}
          >
            {/* Active Turn Glow Bar */}
            {isCurrentTurn && (
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: p.primary }}
              />
            )}

            {/* Header: Name & Role Badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: oTheme.getHouseColors(p.id).primary }}
                />
                <div className="truncate">
                  <span className="text-xs font-black text-stone-100 truncate block">
                    {p.short}
                  </span>
                </div>
              </div>

              {/* Bot vs Human Pill */}
              <div
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0 ${
                  p.isAI
                    ? 'bg-purple-950/70 text-purple-300 border border-purple-700/50'
                    : 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50'
                }`}
              >
                {p.isAI ? <Bot className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                <span>{p.isAI ? 'Bot' : 'Human'}</span>
              </div>
            </div>

            {/* Gate Status Pill */}
            <div className="mb-2">
              {p.hasHit ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
                  <Unlock className="w-2.5 h-2.5 text-emerald-400" />
                  <span>Inner Gate Open</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-700/40">
                  <Lock className="w-2.5 h-2.5 text-rose-400" />
                  <span>Need 1 Cut</span>
                </span>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-1 text-center pt-2 border-t border-stone-800/80 text-[11px]">
              <div className="bg-stone-950/50 rounded-lg p-1">
                <div className="text-[9px] text-stone-400 font-semibold flex items-center justify-center gap-0.5">
                  <Home className="w-2.5 h-2.5 text-amber-400" />
                  <span>Home</span>
                </div>
                <div className="font-black text-stone-100 text-xs mt-0.5">
                  {homeCount}/4
                </div>
              </div>

              <div className="bg-stone-950/50 rounded-lg p-1">
                <div className="text-[9px] text-stone-400 font-semibold flex items-center justify-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 text-blue-400" />
                  <span>Inner</span>
                </div>
                <div className="font-black text-stone-100 text-xs mt-0.5">
                  {innerCount}
                </div>
              </div>

              <div className="bg-stone-950/50 rounded-lg p-1">
                <div className="text-[9px] text-stone-400 font-semibold flex items-center justify-center gap-0.5">
                  <Swords className="w-2.5 h-2.5 text-rose-400" />
                  <span>Cuts</span>
                </div>
                <div className="font-black text-amber-300 text-xs mt-0.5">
                  {p.cutsMade}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
