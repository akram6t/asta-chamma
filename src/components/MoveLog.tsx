import React from 'react';
import { MoveLogEntry } from '../game/types';
import { ScrollText, Swords, Sparkles, Home, Info } from 'lucide-react';

interface MoveLogProps {
  logs: MoveLogEntry[];
  rulesSummary: string;
}

export const MoveLog: React.FC<MoveLogProps> = ({ logs, rulesSummary }) => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3.5 flex flex-col shadow-lg">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-800">
        <div className="flex items-center gap-1.5">
          <ScrollText className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
            Chronicle of Moves
          </h3>
        </div>
        <span className="text-[10px] text-amber-400/90 font-medium">
          {rulesSummary}
        </span>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
        {logs.length === 0 ? (
          <div className="text-stone-500 italic py-2 text-center text-[11px]">
            Match started. Cast the cowries to begin the chronicle.
          </div>
        ) : (
          logs.map((log) => {
            let borderClass = 'border-stone-800 bg-stone-950/60 text-stone-300';
            let Icon = Info;

            if (log.tone === 'cut') {
              borderClass = 'border-rose-700/60 bg-rose-950/40 text-rose-200 font-semibold';
              Icon = Swords;
            } else if (log.tone === 'bonus') {
              borderClass = 'border-amber-600/50 bg-amber-950/40 text-amber-200';
              Icon = Sparkles;
            } else if (log.tone === 'home') {
              borderClass = 'border-emerald-600/60 bg-emerald-950/40 text-emerald-200 font-bold';
              Icon = Home;
            } else if (log.tone === 'system') {
              borderClass = 'border-stone-800/80 bg-stone-950/40 text-stone-400 italic';
            }

            return (
              <div
                key={log.id}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 shadow-sm ${borderClass}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>{log.text}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
