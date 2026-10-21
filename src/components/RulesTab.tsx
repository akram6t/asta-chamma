import React from 'react';
import { BookOpen, Shield, Swords, Sparkles, AlertCircle, Award } from 'lucide-react';

export const RulesTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h2 className="font-heritage text-xl sm:text-2xl font-bold text-amber-200">
            Complete Rules &amp; Traditional Heritage of Asta Chamma
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 mb-6 leading-relaxed">
          The 5×5 cloth board (<span className="font-semibold text-amber-300">Chinnata / 5 Houses</span>) is one of the ancient strategic racing games of India. Known across regional languages as <span className="text-white font-semibold">Chauka Bara / Katte Mane</span> (Kannada), <span className="text-white font-semibold">Asta Chamma</span> (Telugu), <span className="text-white font-semibold">Daayam / Thaayam</span> (Tamil), <span className="text-white font-semibold">Champool</span> (Marathi), and <span className="text-white font-semibold">Chomal Ishto / Changa Po</span> (Hindi / Rajasthani).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Card 1 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-sm">
                <span>1. Casting Cowrie Shells</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Cast 4 cowrie shells. Count the mouths facing upwards:
                <br /><strong className="text-white">1 Up</strong> = 1 step (Dayam / Okkati)
                <br /><strong className="text-white">2 Up</strong> = 2 steps (Duga / Rendu)
                <br /><strong className="text-white">3 Up</strong> = 3 steps (Thiga / Moodu)
                <br /><strong className="text-amber-300">4 Up</strong> = 4 steps (Chamma / Chauka) + <span className="text-amber-300 font-bold">Extra Roll!</span>
                <br /><strong className="text-amber-300">0 Up (All Hump)</strong> = 8 steps (Ashta / Bara) + <span className="text-amber-300 font-bold">Extra Roll!</span>
              </p>
            </div>
            <div className="mt-3 text-[10px] text-amber-400/80 bg-amber-950/40 p-1.5 rounded-lg border border-amber-800/40">
              Rolls accumulate in the Roll Pool and can be split between pawns!
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-300 font-bold text-sm">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>2. Safe Houses (Ghatta / Chira)</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                The 4 outer crossed squares <strong className="text-white">(4,2), (2,4), (0,2), (2,0)</strong> and the central Ashoka Chakra <strong className="text-white">(2,2)</strong> are Safe Houses. Pawns resting on an X-marked square are completely immune to capture, and pawns of multiple players may share the same safe square safely.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-blue-400/80 bg-blue-950/40 p-1.5 rounded-lg border border-blue-800/40">
              Safe houses are spaced exactly 4 steps apart on the outer perimeter!
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-rose-300 font-bold text-sm">
                <Swords className="w-4 h-4 text-rose-400" />
                <span>3. Cutting (Champa) &amp; Blood Gate</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Landing on an opponent's single pawn on an unsafe square cuts (captures) it, sending it back to its starting Home square (<span className="font-mono text-white">Step 0</span>) and granting an immediate bonus throw!
                <br /><br />
                A player <strong className="text-white">must score at least one cut</strong> in the game before any of their pawns are permitted to turn inward into the inner clockwise track.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-rose-400/80 bg-rose-950/40 p-1.5 rounded-lg border border-rose-800/40">
              Until unlocked, pawns at Step 15 continue orbiting the outer ring!
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-sm">
                <span>4. Doubles / Twins (Jodi / Gatti)</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Stacking two friendly pawns on the same unsafe square forms a <strong className="text-white">Double (Jodi)</strong>.
                <br /><br />
                • A single enemy pawn <strong className="text-rose-300">cannot cut a Double</strong>.
                <br />• A single pawn cannot jump over an enemy Double on the outer track (Blockade).
                <br />• You can toggle <strong className="text-amber-300">Move: Pair</strong> to advance both pawns together using one roll.
                <br />• Only an enemy Double can cut a Double!
              </p>
            </div>
            <div className="mt-3 text-[10px] text-purple-400/80 bg-purple-950/40 p-1.5 rounded-lg border border-purple-800/40">
              Doubles provide vital armor when traversing the unsafe inner ring!
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-300 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>5. 3× High-Roll Bust (Moor Naak)</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                Known in Karnataka tradition as <span className="italic text-white">Moor Naak Shyam / Moor Ent Shyam</span>: if a player casts Chamma (4) or Ashta (8) three times consecutively in a single turn, the streak is considered over-blessed and busts the turn. This variation can be toggled on or off in Setup.
              </p>
            </div>
            <div className="mt-3 text-[10px] text-stone-400 bg-stone-900 p-1.5 rounded-lg border border-stone-800">
              Probability of three consecutive 4s/8s is (1/8)³ = 1 in 512 turns!
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-300 font-bold text-sm">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>6. Sanctuary Entry &amp; Victory</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                To enter the central Ashoka Chakra (<span className="font-mono text-white">Step 24</span>), you must roll the exact remaining steps required.
                <br /><br />
                Notice: Entering the inner loop at <span className="font-mono text-amber-300">Step 16</span> is exactly <span className="font-bold text-amber-300">8 steps</span> from the center—meaning an <span className="text-white font-bold">Ashta (8)</span> from Step 16 scores an instant home run! The first player to bring all 4 pawns home wins!
              </p>
            </div>
            <div className="mt-3 text-[10px] text-emerald-400/80 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-800/40">
              First house to guide all 4 pawns to the center wins the match!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
