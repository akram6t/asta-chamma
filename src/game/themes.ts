import { BoardTheme, BoardThemeId, ObjectTheme, ObjectThemeId, PlayerId } from './types';

export const BOARD_THEMES: Record<BoardThemeId, BoardTheme> = {
  khadi: {
    id: 'khadi',
    name: 'Royal Khadi Cloth',
    subtitle: 'Bharataha Authentic Handwoven Fabric',
    badge: 'Classic Heritage',
    matClass: 'theme-board-khadi',
    gridLineColor: '#172554',
    gridLineWidth: 3.2,
    innerBorderColor: 'rgba(180, 83, 9, 0.55)',
    textColor: '#172554',
    accentText: '#1e3a8a',
    bgCellInner: 'rgba(30, 58, 138, 0.035)',
    safeHouseCrossColor: '#172554',
    chakraFill: '#f6f1e7',
    chakraStroke: '#172554',
    previewBg: 'linear-gradient(135deg, #f6f1e7, #e8dfce)',
    description: 'Woven khadi cotton texture with deep indigo block-print linework and traditional saffron touches.'
  },
  sandalwood: {
    id: 'sandalwood',
    name: 'Imperial Sandalwood',
    subtitle: 'Vedic Carved Teak & Brass Inlay',
    badge: 'Royal Temple',
    matClass: 'theme-board-sandalwood',
    gridLineColor: '#eab308',
    gridLineWidth: 3.5,
    innerBorderColor: 'rgba(234, 179, 8, 0.75)',
    textColor: '#fef08a',
    accentText: '#fde047',
    bgCellInner: 'rgba(234, 179, 8, 0.05)',
    safeHouseCrossColor: '#fbbf24',
    chakraFill: '#291e14',
    chakraStroke: '#fbbf24',
    previewBg: 'linear-gradient(135deg, #382414, #1f130a)',
    description: 'Rich dark sandalwood grain with metallic polished brass inlay borders and warm temple lantern glow.'
  },
  marble: {
    id: 'marble',
    name: 'Jaipur White Marble',
    subtitle: 'Makrana Stone with Pietra Dura Inlay',
    badge: 'Palace Luxe',
    matClass: 'theme-board-marble',
    gridLineColor: '#1e293b',
    gridLineWidth: 3,
    innerBorderColor: 'rgba(190, 24, 93, 0.55)',
    textColor: '#0f172a',
    accentText: '#991b1b',
    bgCellInner: 'rgba(190, 24, 93, 0.03)',
    safeHouseCrossColor: '#be123c',
    chakraFill: '#f8fafc',
    chakraStroke: '#be123c',
    previewBg: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    description: 'Pristine polished white marble with delicate grey mineral veins and ruby-red floral inlay.'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Midnight Obsidian',
    subtitle: 'Volcanic Basalt with Burnished Bronze',
    badge: 'Modern Luxe',
    matClass: 'theme-board-obsidian',
    gridLineColor: '#d97706',
    gridLineWidth: 3.2,
    innerBorderColor: 'rgba(217, 119, 6, 0.7)',
    textColor: '#fbbf24',
    accentText: '#f59e0b',
    bgCellInner: 'rgba(217, 119, 6, 0.06)',
    safeHouseCrossColor: '#f59e0b',
    chakraFill: '#141416',
    chakraStroke: '#f59e0b',
    previewBg: 'linear-gradient(135deg, #1c1917, #09090b)',
    description: 'Deep volcanic black slate with glowing bronze linework and high-contrast royal gold accents.'
  },
  terracotta: {
    id: 'terracotta',
    name: 'Kerala Terracotta',
    subtitle: 'Baked Earth Tile with Rice-Flour Kolam',
    badge: 'Folk Heritage',
    matClass: 'theme-board-terracotta',
    gridLineColor: '#fef2f2',
    gridLineWidth: 3.2,
    innerBorderColor: 'rgba(254, 242, 242, 0.8)',
    textColor: '#fff1f2',
    accentText: '#ffe4e6',
    bgCellInner: 'rgba(255, 255, 255, 0.06)',
    safeHouseCrossColor: '#ffffff',
    chakraFill: '#881337',
    chakraStroke: '#ffffff',
    previewBg: 'linear-gradient(135deg, #9f1239, #6f1d1b)',
    description: 'Rustic baked terracotta clay with sacred white rice-flour chalk (Kolam/Rangoli) auspicious linework.'
  }
};

export const OBJECT_THEMES: Record<ObjectThemeId, ObjectTheme> = {
  agate: {
    id: 'agate',
    name: 'Tumbled Agate Stones',
    subtitle: 'Natural River Gemstone Pebbles',
    badge: 'Authentic Photo',
    description: 'Smooth organic agate stone pebbles with glossy mineral highlights and authentic white cowrie shells.',
    pawnShape: 'pebble',
    soundType: 'stone',
    shellStyle: 'enamel',
    getHouseColors: (playerIdx: PlayerId) => {
      const palettes = [
        { light: '#fb923c', primary: '#ea580c', dark: '#9a3412', glow: 'rgba(234, 88, 12, 0.45)', label: 'Carnelian Orange' },
        { light: '#2dd4bf', primary: '#0d9488', dark: '#115e59', glow: 'rgba(13, 148, 136, 0.45)', label: 'Turquoise Jade' },
        { light: '#60a5fa', primary: '#2563eb', dark: '#1e3a8a', glow: 'rgba(37, 99, 235, 0.45)', label: 'Lapis Lazuli' },
        { light: '#c084fc', primary: '#7e22ce', dark: '#581c87', glow: 'rgba(126, 34, 206, 0.45)', label: 'Amethyst Quartz' }
      ];
      return palettes[playerIdx];
    }
  },
  brass: {
    id: 'brass',
    name: 'Carved Royal Brass',
    subtitle: 'Heavy Bell-Metal & Oxidised Bronze',
    badge: 'Temple Castings',
    description: 'Metallic antique brass and bell-metal pawns with concentric temple finial crowns and golden cowries.',
    pawnShape: 'brass_finial',
    soundType: 'metal',
    shellStyle: 'brass',
    getHouseColors: (playerIdx: PlayerId) => {
      const palettes = [
        { light: '#fde047', primary: '#ca8a04', dark: '#713f12', glow: 'rgba(202, 138, 4, 0.45)', label: 'Polished Brass' },
        { light: '#5eead4', primary: '#0f766e', dark: '#134e4a', glow: 'rgba(15, 118, 110, 0.45)', label: 'Verdigris Bronze' },
        { light: '#93c5fd', primary: '#1d4ed8', dark: '#172554', glow: 'rgba(29, 78, 216, 0.45)', label: 'Cobalt Gunmetal' },
        { light: '#f472b6', primary: '#9d174d', dark: '#500724', glow: 'rgba(157, 23, 77, 0.45)', label: 'Rose Copper' }
      ];
      return palettes[playerIdx];
    }
  },
  channapatna: {
    id: 'channapatna',
    name: 'Channapatna Lacquer Wood',
    subtitle: 'GI-Tagged Karnataka Turned Wood',
    badge: 'Handcrafted',
    description: 'Smooth turned Wrightia tinctoria ivory wood painted with glossy natural vegetable dyes.',
    pawnShape: 'wooden_peg',
    soundType: 'wood',
    shellStyle: 'wood',
    getHouseColors: (playerIdx: PlayerId) => {
      const palettes = [
        { light: '#f97316', primary: '#c2410c', dark: '#7c2d12', glow: 'rgba(194, 65, 12, 0.45)', label: 'Turmeric Orange' },
        { light: '#10b981', primary: '#047857', dark: '#064e3b', glow: 'rgba(4, 120, 87, 0.45)', label: 'Neem Green' },
        { light: '#38bdf8', primary: '#0284c7', dark: '#075985', glow: 'rgba(2, 132, 199, 0.45)', label: 'Indigo Blue' },
        { light: '#e879f9', primary: '#a21caf', dark: '#701a75', glow: 'rgba(162, 28, 175, 0.45)', label: 'Beetroot Violet' }
      ];
      return palettes[playerIdx];
    }
  },
  crystal: {
    id: 'crystal',
    name: 'Agni Radiant Crystals',
    subtitle: 'Faceted Diamond Cut Gemstones',
    badge: 'Glowing Gems',
    description: 'Prismatic faceted gemstone jewels with inner refractions, ambient glow, and mother-of-pearl cowries.',
    pawnShape: 'faceted_gem',
    soundType: 'glass',
    shellStyle: 'pearl',
    getHouseColors: (playerIdx: PlayerId) => {
      const palettes = [
        { light: '#fdba74', primary: '#f97316', dark: '#9a3412', glow: 'rgba(249, 115, 22, 0.65)', label: 'Solar Topaz' },
        { light: '#6ee7b7', primary: '#10b981', dark: '#064e3b', glow: 'rgba(16, 185, 129, 0.65)', label: 'Radiant Emerald' },
        { light: '#93c5fd', primary: '#3b82f6', dark: '#1e3a8a', glow: 'rgba(59, 130, 246, 0.65)', label: 'Celestial Sapphire' },
        { light: '#d8b4fe', primary: '#a855f7', dark: '#581c87', glow: 'rgba(168, 85, 247, 0.65)', label: 'Mystic Amethyst' }
      ];
      return palettes[playerIdx];
    }
  }
};

export interface ThemePreset {
  id: string;
  name: string;
  boardTheme: BoardThemeId;
  objectTheme: ObjectThemeId;
  description: string;
  emoji: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'classic',
    name: 'Royal Khadi & Agate',
    boardTheme: 'khadi',
    objectTheme: 'agate',
    description: 'The authentic cloth game mat with smooth natural tumbled stones as shown in the original edition.',
    emoji: '🧵'
  },
  {
    id: 'temple',
    name: 'Temple Sandalwood & Brass',
    boardTheme: 'sandalwood',
    objectTheme: 'brass',
    description: 'Deep wood grain with carved temple brass goti and golden cowrie shells.',
    emoji: '🛕'
  },
  {
    id: 'palace',
    name: 'Jaipur Palace Marble & Crystals',
    boardTheme: 'marble',
    objectTheme: 'crystal',
    description: 'White Makrana marble with glowing faceted agni crystals and mother-of-pearl shells.',
    emoji: '🏰'
  },
  {
    id: 'heritage',
    name: 'Karnataka Channapatna Heritage',
    boardTheme: 'khadi',
    objectTheme: 'channapatna',
    description: 'Traditional khadi mat paired with famous Karnataka turned lacquered ivory-wood pawns.',
    emoji: '🪵'
  },
  {
    id: 'village',
    name: 'Kerala Clay & Wooden Goti',
    boardTheme: 'terracotta',
    objectTheme: 'channapatna',
    description: 'Burnt terracotta clay tiles with auspicious rice-flour Kolam line art and wooden pegs.',
    emoji: '🏺'
  },
  {
    id: 'midnight',
    name: 'Midnight Basalt & Bronze',
    boardTheme: 'obsidian',
    objectTheme: 'brass',
    description: 'Dramatic black volcanic stone with burnished antique copper-bronze finials.',
    emoji: '✨'
  }
];
