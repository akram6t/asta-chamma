import React from 'react';
import { ObjectThemeId } from '../game/types';
import { OBJECT_THEMES } from '../game/themes';

interface PawnTokenProps {
  playerIdx: 0 | 1 | 2 | 3;
  pawnId: number;
  objectTheme: ObjectThemeId;
  size?: 'sm' | 'md' | 'lg';
}

export const PawnToken: React.FC<PawnTokenProps> = ({
  playerIdx,
  pawnId,
  objectTheme,
  size = 'md'
}) => {
  const themeDef = OBJECT_THEMES[objectTheme] || OBJECT_THEMES.agate;
  const colors = themeDef.getHouseColors(playerIdx);

  const sizeClasses = {
    sm: 'w-5 h-5 text-[8px]',
    md: 'w-6 h-6 sm:w-8 sm:h-8 text-[10px]',
    lg: 'w-8 h-8 sm:w-10 sm:h-10 text-xs'
  }[size];

  // 1. Carved Royal Brass Finial
  if (themeDef.pawnShape === 'brass_finial') {
    return (
      <div
        className={`${sizeClasses} rounded-full shadow-lg flex items-center justify-center relative border-2 select-none`}
        style={{
          background: `radial-gradient(circle at 35% 30%, ${colors.light}, ${colors.primary} 60%, ${colors.dark} 100%)`,
          borderColor: '#fef08a',
          boxShadow: `0 3px 8px rgba(0,0,0,0.6), 0 0 10px ${colors.glow}, inset 0 1px 2px rgba(255,255,255,0.8)`
        }}
      >
        {/* Inner concentric brass ring */}
        <div className="absolute inset-1 rounded-full border border-yellow-200/50 pointer-events-none" />
        {/* Top metallic finial highlight */}
        <div className="absolute top-0.5 w-2.5 h-1 bg-white/70 rounded-full blur-[0.4px]" />
        <span className="font-heritage font-extrabold text-stone-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] z-10">
          {pawnId + 1}
        </span>
      </div>
    );
  }

  // 2. Channapatna Lacquered Turned Wood Peg
  if (themeDef.pawnShape === 'wooden_peg') {
    return (
      <div
        className={`${sizeClasses} rounded-full shadow-md flex items-center justify-center relative border border-amber-950/40 select-none`}
        style={{
          background: `radial-gradient(ellipse at 40% 30%, ${colors.light}, ${colors.primary} 70%, ${colors.dark} 100%)`,
          boxShadow: '0 4px 7px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.6)'
        }}
      >
        {/* Wood lathe groove ring */}
        <div className="absolute inset-[3px] rounded-full border border-black/20 pointer-events-none" />
        {/* Glossy varnish streak */}
        <div className="absolute top-1 left-1.5 w-2 h-1 bg-white/45 rounded-full rotate-[-30deg]" />
        <span className="font-bold text-amber-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] z-10">
          {pawnId + 1}
        </span>
      </div>
    );
  }

  // 3. Agni Radiant Faceted Crystal Jewel
  if (themeDef.pawnShape === 'faceted_gem') {
    return (
      <div
        className={`${sizeClasses} rounded-lg shadow-xl flex items-center justify-center relative border border-white/70 select-none rotate-45`}
        style={{
          background: `radial-gradient(circle at 30% 30%, #ffffff, ${colors.light} 30%, ${colors.primary} 70%, ${colors.dark} 100%)`,
          boxShadow: `0 0 12px ${colors.glow}, 0 4px 10px rgba(0,0,0,0.6), inset 0 0 4px rgba(255,255,255,0.9)`
        }}
      >
        {/* Inner facet lines */}
        <div className="absolute inset-0.5 border border-white/50 rounded-sm pointer-events-none" />
        {/* Star sparkle glint */}
        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full blur-[0.2px]" />
        <span className="-rotate-45 font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10">
          {pawnId + 1}
        </span>
      </div>
    );
  }

  // 4. Default: Tumbled Agate Gemstone Pebble
  return (
    <div
      className={`${sizeClasses} rounded-full shadow-md flex items-center justify-center relative border border-white/40 select-none`}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${colors.light}, ${colors.primary} 65%, ${colors.dark} 100%)`,
        boxShadow: '0 3px 6px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.7)'
      }}
    >
      {/* Mineral shine gloss highlight */}
      <div className="absolute top-1 left-1.5 w-2 h-1 bg-white/50 rounded-full rotate-[-25deg]" />
      <span className="font-black text-white/90 drop-shadow z-10">
        {pawnId + 1}
      </span>
    </div>
  );
};
