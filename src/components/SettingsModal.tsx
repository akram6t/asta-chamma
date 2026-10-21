import React from 'react';
import { GameMode, BotDifficulty, GameRules } from '../game/types';
import { X, Bot, Users, ShieldAlert, Sparkles, Check, Timer } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  botDifficulty: BotDifficulty;
  setBotDifficulty: (diff: BotDifficulty) => void;
  rules: GameRules;
  setRules: React.Dispatch<React.SetStateAction<GameRules>>;
  turnTimerDuration: number;
  setTurnTimerDuration: (sec: number) => void;
  turnTimerEnabled: boolean;
  setTurnTimerEnabled: (enabled: boolean) => void;
  onApplyAndRestart: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  mode,
  setMode,
  botDifficulty,
  setBotDifficulty,
  rules,
  setRules,
  turnTimerDuration,
  setTurnTimerDuration,
  turnTimerEnabled,
  setTurnTimerEnabled,
  onApplyAndRestart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-700/80 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h3 className="font-heritage font-extrabold text-lg sm:text-xl text-amber-200">
              Match Setup &amp; Rules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 my-4">
          {/* Game Mode Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-stone-300 mb-2">
              Select Game Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('bot_1v3')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                  mode === 'bot_1v3'
                    ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-stone-100">1 Human vs 3 Bots</div>
                  <div className="text-[10px] text-stone-400">Play Orange against Teal, Blue &amp; Purple</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('bot_1v1')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                  mode === 'bot_1v1'
                    ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-stone-100">1 Human vs 1 Bot (2P)</div>
                  <div className="text-[10px] text-stone-400">Head-to-head duel (South vs North)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('pass_4p')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                  mode === 'pass_4p'
                    ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-stone-100">4-Player Pass &amp; Play</div>
                  <div className="text-[10px] text-stone-400">Local multiplayer with 4 real players</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('pass_2p')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                  mode === 'pass_2p'
                    ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-stone-100">2-Player Pass &amp; Play</div>
                  <div className="text-[10px] text-stone-400">Local multiplayer (Orange vs Blue)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('spectate_4bot')}
                className={`col-span-1 sm:col-span-2 p-3 rounded-2xl border text-left transition flex items-start gap-2.5 ${
                  mode === 'spectate_4bot'
                    ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-stone-100">🍿 Spectator AI Battle</div>
                  <div className="text-[10px] text-stone-400">Watch 4 AI Bot houses battle each other autonomously</div>
                </div>
              </button>
            </div>
          </div>

          {/* Bot Intelligence Setting */}
          {(mode === 'bot_1v3' || mode === 'bot_1v1' || mode === 'spectate_4bot') && (
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-stone-300 mb-2">
                Bot Difficulty
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBotDifficulty('casual')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    botDifficulty === 'casual'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:text-white'
                  }`}
                >
                  Casual Bot (Relaxed)
                </button>
                <button
                  type="button"
                  onClick={() => setBotDifficulty('smart')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    botDifficulty === 'smart'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:text-white'
                  }`}
                >
                  Smart Tactician (Cuts &amp; Doubles)
                </button>
              </div>
            </div>
          )}

          {/* Turn Countdown Timer Settings */}
          <div className="pt-3 border-t border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider font-bold text-stone-300 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-amber-400" />
                <span>Human Turn Countdown Timer</span>
              </label>
              <span className="text-[11px] font-semibold text-stone-400">
                {turnTimerEnabled ? `${turnTimerDuration}s limit` : 'Unlimited'}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 mb-2.5 leading-relaxed">
              When time expires, the game will automatically roll cowries or execute a random valid move/pass so gameplay stays brisk.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '15s Blitz', sec: 15, enabled: true },
                { label: '20s Standard', sec: 20, enabled: true },
                { label: '30s Relaxed', sec: 30, enabled: true },
                { label: 'Off', sec: 0, enabled: false }
              ].map((opt) => {
                const isSelected = opt.enabled
                  ? turnTimerEnabled && turnTimerDuration === opt.sec
                  : !turnTimerEnabled;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      if (opt.enabled) {
                        setTurnTimerEnabled(true);
                        setTurnTimerDuration(opt.sec);
                      } else {
                        setTurnTimerEnabled(false);
                      }
                    }}
                    className={`p-2 rounded-xl border text-xs font-bold transition text-center ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/50'
                        : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Authentic Traditional Rules Toggles */}
          <div className="space-y-3 pt-3 border-t border-stone-800">
            <div className="text-xs uppercase tracking-wider font-bold text-stone-300">
              Traditional Indian Rule Variations
            </div>

            {/* Blood Gate */}
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/80 cursor-pointer hover:bg-stone-800/20 transition">
              <input
                type="checkbox"
                checked={rules.bloodGate}
                onChange={(e) => setRules((r) => ({ ...r, bloodGate: e.target.checked }))}
                className="mt-1 rounded bg-stone-800 border-stone-600 text-amber-500 focus:ring-amber-400"
              />
              <div className="text-xs">
                <div className="font-bold text-stone-100">
                  Blood-Gate Rule (Capture Required for Inner Loop)
                </div>
                <div className="text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                  Pawns must cut at least one enemy pawn to enter the clockwise inner ring; otherwise, they loop endlessly around the outer perimeter.
                </div>
              </div>
            </label>

            {/* Doubles / Twin stack */}
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/80 cursor-pointer hover:bg-stone-800/20 transition">
              <input
                type="checkbox"
                checked={rules.doubles}
                onChange={(e) => setRules((r) => ({ ...r, doubles: e.target.checked }))}
                className="mt-1 rounded bg-stone-800 border-stone-600 text-amber-500 focus:ring-amber-400"
              />
              <div className="text-xs">
                <div className="font-bold text-stone-100">
                  Double / Twin-Stack Shield &amp; Blockade (Jodi / Gatti)
                </div>
                <div className="text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                  Two friendly pawns on an unsafe cell form a protected Double that cannot be cut or passed by a single enemy pawn.
                </div>
              </div>
            </label>

            {/* 3x High Roll Bust */}
            <label className="flex items-start gap-3 p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/80 cursor-pointer hover:bg-stone-800/20 transition">
              <input
                type="checkbox"
                checked={rules.threeBust}
                onChange={(e) => setRules((r) => ({ ...r, threeBust: e.target.checked }))}
                className="mt-1 rounded bg-stone-800 border-stone-600 text-amber-500 focus:ring-amber-400"
              />
              <div className="text-xs">
                <div className="font-bold text-stone-100">
                  3× Consecutive High-Roll Bust (Moor Naak Shyam)
                </div>
                <div className="text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                  Throwing three consecutive 4s/8s in a single turn cancels accumulated moves and forfeits the turn.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onApplyAndRestart}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs sm:text-sm transition shadow-lg shadow-amber-500/20"
          >
            Apply &amp; Start Match
          </button>
        </div>
      </div>
    </div>
  );
};
