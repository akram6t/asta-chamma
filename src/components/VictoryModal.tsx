import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PlayerState } from '../game/types';
import { Trophy, Swords, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  winner: PlayerState | null;
  turnCount: number;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ winner, turnCount, onPlayAgain }) => {
  useEffect(() => {
    if (winner) {
      // Fire confetti bursts
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#ea580c', '#0d9488', '#2563eb', '#7e22ce', '#fbbf24']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#ea580c', '#0d9488', '#2563eb', '#7e22ce', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-amber-500/70 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: winner.primary }}
        />

        {/* Trophy Header */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400 shadow-inner mb-3">
          <Trophy className="w-9 h-9" />
        </div>

        <h3 className="font-heritage text-2xl font-black text-amber-300 mb-1">
          {winner.name} Wins!
        </h3>
        <p className="text-xs text-stone-300 mb-4 font-medium">
          {winner.gemName} has guided all 4 agate pawns home into the central Ashoka Chakra!
        </p>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-2 my-4 text-xs">
          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-2.5">
            <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
              <Swords className="w-3 h-3 text-rose-400" />
              <span>Cuts Made</span>
            </div>
            <div className="text-lg font-black text-amber-300 mt-1">
              {winner.cutsMade}
            </div>
          </div>

          <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-2.5">
            <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Total Turns</span>
            </div>
            <div className="text-lg font-black text-emerald-300 mt-1">
              {turnCount}
            </div>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Another Match</span>
        </button>
      </div>
    </div>
  );
};
