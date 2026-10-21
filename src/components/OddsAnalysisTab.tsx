import React from 'react';
import { PROBABILITY_TABLE } from '../game/constants';
import { BarChart3, Compass, Sparkles, BookOpen } from 'lucide-react';

export const OddsAnalysisTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cowrie Probability Breakdown */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h2 className="font-heritage text-lg sm:text-xl font-bold text-amber-200">
              1. Mathematical Analysis of 4 Cowrie Shells
            </h2>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            Unlike uniform 6-sided cubic dice, 4 cowrie shells (<span className="italic text-amber-300">Cypraea moneta</span>) yield a non-uniform binomial distribution across <span className="text-white font-bold">2⁴ = 16</span> possible configurations (assuming probability <span className="font-mono text-emerald-400">p = 0.5</span> per mouth landing up):
          </p>

          <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 bg-stone-900/80">
                  <th className="py-2.5 px-3">Mouths Up</th>
                  <th className="py-2.5 px-3">Traditional Name</th>
                  <th className="py-2.5 px-3">Steps</th>
                  <th className="py-2.5 px-3">Combos</th>
                  <th className="py-2.5 px-3">Odds</th>
                  <th className="py-2.5 px-3">Bonus?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-200">
                {PROBABILITY_TABLE.map((row, i) => (
                  <tr key={i} className={row.bonus ? 'bg-amber-500/10' : ''}>
                    <td className="py-2.5 px-3 font-mono text-[11px]">{row.mouthsUp}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-100">{row.name}</td>
                    <td className="py-2.5 px-3 font-black text-amber-300">{row.steps}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-400">{row.combos}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">{row.odds}</td>
                    <td className="py-2.5 px-3">
                      {row.bonus ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Yes (+1)
                        </span>
                      ) : (
                        <span className="text-stone-500 text-[10px]">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Stat Cards */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-2.5">
              <div className="text-[10px] text-stone-400">Single Cast EV</div>
              <div className="text-base font-black text-amber-300 mt-0.5">2.50 steps</div>
              <div className="text-[9px] text-stone-500 mt-0.5">(4×1 + 6×2 + 4×3 + 1×4 + 1×8)/16</div>
            </div>
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-2.5">
              <div className="text-[10px] text-stone-400">Bonus Chain Odds</div>
              <div className="text-base font-black text-emerald-400 mt-0.5">12.50%</div>
              <div className="text-[9px] text-stone-500 mt-0.5">1 in 8 throws grants re-roll</div>
            </div>
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-2.5">
              <div className="text-[10px] text-stone-400">Turn EV (w/ Bonus)</div>
              <div className="text-base font-black text-amber-300 mt-0.5">2.857 steps</div>
              <div className="text-[9px] text-stone-500 mt-0.5">2.50 / (1 − 0.125) = 20/7</div>
            </div>
          </div>
        </div>

        {/* 25-Step Spiral Journey */}
        <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-amber-400" />
              <h2 className="font-heritage text-lg sm:text-xl font-bold text-amber-200">
                2. Topological Spiral Journey (25 Steps)
              </h2>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed mb-3">
              Each pebble starts on its outer crossed home (<span className="font-mono text-amber-300">Step 0</span>) and traverses exactly <span className="text-white font-bold">24 steps (25 cells)</span> into the central sanctuary:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-stone-950/70 border border-stone-800">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <span>↺ Phase A — Outer Perimeter Track (Steps 0 → 15)</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  Pawns orbit counter-clockwise around the 16 exterior cells. Every 4 steps (<span className="font-mono text-amber-300">Steps 0, 4, 8, 12</span>) is an <span className="text-white font-bold">X-marked Safe House</span> where pawns cannot be captured. A Chamma (4) or Ashta (8) from a safe house lands directly on another safe house!
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950/70 border border-rose-900/40">
                <div className="font-bold text-rose-300 flex items-center gap-1.5 mb-1">
                  <span>🔒 Phase B — Blood Gate at Step 15 (Hit Qualification)</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  <span className="font-mono text-rose-300">Step 15</span> sits immediately to the left of the player's home house. A pawn can only turn into the inner ring (<span className="font-mono text-amber-300">Step 15 → 16</span>) if the player has <span className="text-white font-bold">captured ("cut") at least 1 enemy pawn</span>. Until unlocked, pawns loop endlessly around the outer perimeter.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950/70 border border-emerald-900/40">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
                  <span>↻ Phase C — Inner Clockwise Loop (16 → 23) &amp; Sanctuary (24)</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  Direction reverses to <span className="text-white font-bold">clockwise</span> around the 8 squares of the inner 3×3 ring. Because there are no safe squares on the inner ring, pawns are vulnerable unless paired as a <span className="text-white font-bold">Double (Jodi)</span>. Exact count is required to enter the center Ashoka Chakra (<span className="font-mono text-amber-300">Step 24</span>).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
