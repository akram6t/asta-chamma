import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, X, Check, Sparkles, Wand2 } from 'lucide-react';
import { BoardThemeId, ObjectThemeId } from '../game/types';
import { BOARD_THEMES, OBJECT_THEMES, THEME_PRESETS } from '../game/themes';
import { sounds } from '../game/sound';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBoardTheme: BoardThemeId;
  currentObjectTheme: ObjectThemeId;
  onSelectThemes: (boardTheme: BoardThemeId, objectTheme: ObjectThemeId) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentBoardTheme,
  currentObjectTheme,
  onSelectThemes
}) => {
  const [selectedBoard, setSelectedBoard] = useState<BoardThemeId>(currentBoardTheme);
  const [selectedObject, setSelectedObject] = useState<ObjectThemeId>(currentObjectTheme);

  if (!isOpen) return null;

  const activeBoardDef = BOARD_THEMES[selectedBoard];
  const activeObjectDef = OBJECT_THEMES[selectedObject];

  const handleApply = () => {
    onSelectThemes(selectedBoard, selectedObject);
    sounds.playBonus();
    onClose();
  };

  const handleSelectPreset = (bId: BoardThemeId, oId: ObjectThemeId) => {
    setSelectedBoard(bId);
    setSelectedObject(oId);
    sounds.playStep();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-stone-900 border border-stone-700/80 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heritage font-extrabold text-base sm:text-lg text-amber-200">
                Board &amp; Object Themes
              </h3>
              <p className="text-[11px] text-stone-400">
                Customize traditional cloth, temple woods, and royal stone gotis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1">
          {/* Quick Curated Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-300 mb-2">
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Royal Curated Presets</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isActive = selectedBoard === preset.boardTheme && selectedObject === preset.objectTheme;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.boardTheme, preset.objectTheme)}
                    className={`p-2.5 rounded-2xl border text-left transition flex items-start gap-2 ${
                      isActive
                        ? 'border-amber-400 bg-amber-500/15 ring-1 ring-amber-400'
                        : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                    }`}
                  >
                    <span className="text-lg shrink-0">{preset.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-stone-100 truncate flex items-center gap-1">
                        <span>{preset.name}</span>
                        {isActive && <Check className="w-3 h-3 text-amber-400 inline shrink-0" />}
                      </div>
                      <div className="text-[9px] text-stone-400 line-clamp-1">{preset.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-Time Live Combo Preview Bar */}
          <div className="p-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              {/* Mini Board Sample */}
              <div
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center relative overflow-hidden shadow-md shrink-0 ${activeBoardDef.matClass}`}
                style={{ borderColor: activeBoardDef.gridLineColor }}
              >
                {/* Mini Cross */}
                <svg viewBox="0 0 40 40" className="w-full h-full absolute inset-0">
                  <line x1="0" y1="0" x2="40" y2="40" stroke={activeBoardDef.gridLineColor} strokeWidth="2.5" />
                  <line x1="40" y1="0" x2="0" y2="40" stroke={activeBoardDef.gridLineColor} strokeWidth="2.5" />
                  <circle cx="20" cy="20" r="5" fill={activeBoardDef.chakraFill} stroke={activeBoardDef.chakraStroke} strokeWidth="1.5" />
                </svg>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  Active Combination
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  {activeBoardDef.name} + {activeObjectDef.name}
                </div>
                <div className="text-[10px] text-stone-400">
                  Sound: <span className="text-stone-200 capitalize font-medium">{activeObjectDef.soundType} resonance</span> • Shells: <span className="text-stone-200 capitalize font-medium">{activeObjectDef.shellStyle}</span>
                </div>
              </div>
            </div>

            {/* 4 Sample Pawns */}
            <div className="flex items-center gap-1.5 shrink-0">
              {[0, 1, 2, 3].map((pId) => {
                const colors = activeObjectDef.getHouseColors(pId as 0 | 1 | 2 | 3);
                return (
                  <div
                    key={pId}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-md flex items-center justify-center relative border border-white/40"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${colors.light}, ${colors.primary} 65%, ${colors.dark} 100%)`,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.45)'
                    }}
                  >
                    <div className="absolute top-0.5 left-1 w-1.5 h-0.5 bg-white/50 rounded-full rotate-[-25deg]" />
                    <span className="text-[9px] font-black text-white drop-shadow">
                      {pId + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1: Board Themes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                1. Select Board Surface
              </span>
              <span className="text-[10px] text-stone-400">
                {Object.keys(BOARD_THEMES).length} Traditional Textures
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(BOARD_THEMES).map((b) => {
                const isSelected = selectedBoard === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBoard(b.id);
                      sounds.playStep();
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 relative overflow-hidden ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400 shadow-lg'
                        : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                    }`}
                  >
                    {/* Small Mat Preview Box */}
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow relative overflow-hidden ${b.matClass}`}
                      style={{ borderColor: b.gridLineColor }}
                    >
                      <svg viewBox="0 0 40 40" className="w-full h-full absolute inset-0">
                        <line x1="0" y1="0" x2="40" y2="40" stroke={b.gridLineColor} strokeWidth="2.5" />
                        <line x1="40" y1="0" x2="0" y2="40" stroke={b.gridLineColor} strokeWidth="2.5" />
                        <circle cx="20" cy="20" r="5" fill={b.chakraFill} stroke={b.chakraStroke} strokeWidth="1.5" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="text-xs font-black text-stone-100 truncate">
                          {b.name}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-stone-950">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-amber-400/90 font-medium">{b.badge}</div>
                      <div className="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                        {b.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Object Themes (Pawns & Cowries) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                2. Select Pawns &amp; Cowrie Objects
              </span>
              <span className="text-[10px] text-stone-400">
                {Object.keys(OBJECT_THEMES).length} Distinct Materials
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.values(OBJECT_THEMES).map((obj) => {
                const isSelected = selectedObject === obj.id;
                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => {
                      setSelectedObject(obj.id);
                      sounds.playStep();
                    }}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400 shadow-lg'
                        : 'border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 text-stone-300'
                    }`}
                  >
                    {/* 4 Tokens Preview Grid */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-stone-900 rounded-xl border border-stone-800 shrink-0">
                      {[0, 1, 2, 3].map((pId) => {
                        const colors = obj.getHouseColors(pId as 0 | 1 | 2 | 3);
                        return (
                          <div
                            key={pId}
                            className="w-5 h-5 rounded-full flex items-center justify-center relative shadow-sm"
                            style={{
                              background: `radial-gradient(circle at 35% 35%, ${colors.light}, ${colors.primary} 65%, ${colors.dark} 100%)`
                            }}
                          >
                            <span className="text-[8px] font-black text-white">
                              {pId + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="text-xs font-black text-stone-100 truncate">
                          {obj.name}
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-stone-950">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-amber-400/90 font-medium">{obj.badge}</div>
                      <div className="text-[10px] text-stone-400 line-clamp-2 mt-0.5 leading-snug">
                        {obj.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Apply Selected Themes</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
