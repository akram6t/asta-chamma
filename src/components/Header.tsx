import React from 'react';
import { Volume2, VolumeX, RotateCcw, Settings, Info, BarChart2, Shield, Palette } from 'lucide-react';

interface HeaderProps {
  activeTab: 'play' | 'analysis' | 'rules';
  setActiveTab: (tab: 'play' | 'analysis' | 'rules') => void;
  onOpenSettings: () => void;
  onOpenThemes: () => void;
  onResetMatch: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenThemes,
  onResetMatch,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-700/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-heritage font-bold text-xl shadow-inner select-none">
            ☸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heritage font-extrabold text-base sm:text-lg tracking-wide text-amber-100 drop-shadow-sm">
                ASTA CHAMMA <span className="text-xs sm:text-sm font-medium text-amber-400/90">(Chinnata | 5 Houses)</span>
              </h1>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block tracking-normal">
              Chauka Bara • Katte Mane • Daayam • Champool • Chomal Ishto • Changa Po
            </p>
          </div>
        </div>

        {/* Navigation Tabs & Controls */}
        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="inline-flex rounded-lg bg-stone-900 p-0.5 border border-stone-800">
            <button
              onClick={() => setActiveTab('play')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'play'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Play Board</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'analysis'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Path &amp;</span> Odds
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'rules'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Rules</span>
            </button>
          </div>

          {/* Themes Modal Trigger */}
          <button
            onClick={onOpenThemes}
            className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-200 flex items-center gap-1.5 transition active:scale-95"
            title="Customize Board Surfaces & Pawn Object Themes"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Themes</span>
          </button>

          {/* Setup Modal Trigger */}
          <button
            onClick={onOpenSettings}
            className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-medium text-stone-200 flex items-center gap-1.5 transition active:scale-95"
            title="Game Setup, Bot Mode & Rule Toggles"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Setup</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border text-xs font-medium transition active:scale-95 ${
              soundEnabled
                ? 'bg-stone-900 hover:bg-stone-800 border-stone-800 text-amber-300'
                : 'bg-stone-950 border-stone-800 text-stone-500'
            }`}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset Game */}
          <button
            onClick={onResetMatch}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-950/40 flex items-center gap-1.5 active:scale-95"
            title="Start New Match"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
