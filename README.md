# Asta Chamma (Chauka Bara) 🐚🎲

A rich, authentic web implementation of **Asta Chamma** (also known as *Chauka Bara*, *Kavidi Kali*, *Changa Po*, *Daayam*, *Katay*, *Champool*), an ancient Indian strategy race board game played with 4 traditional cowrie shells and gem pawns.

![Asta Chamma Banner](public/vite.svg)

---

## ✨ Features

- **Traditional 5x5 Board Layout**:
  - 4 Player Home Squares on the outer rim (South, East, North, West).
  - 4 Safe Rest Sanctuaries (marked with Traditional Sacred Cross `X`).
  - Central Haven Sanctuary (*Chinnata / Swarga*), reachable only after entering the inner ring.
- **Authentic Cowrie Shell Mechanics**:
  - Realistic physics & 3D rotation animation when casting shells.
  - Indian score system:
    - 1 shell mouth-up: **Dayam (1)** (Enables starting out of home) + Bonus turn
    - 2 shells mouth-up: **Erra (2)**
    - 3 shells mouth-up: **Muru (3)**
    - 4 shells mouth-up: **Chamma (4)** + Bonus turn
    - All 4 flat down: **Asta (8)** + Bonus turn
- **Advanced Game Options & Indian House Rules**:
  - **Cut Requirement to Enter Inner Ring**: Requires eliminating at least one opponent pawn before entering the inner sanctum.
  - **Rest Sanctuary Safety**: Pawns resting on sanctuary squares are completely protected from capture.
  - **Double / Pair Stacking**: Move twin pawns together as an escorted fortified unit.
  - **Dayam/Asta/Chamma Bonus Turns**: Earn consecutive rolls for traditional high-value throws.
  - **Grace Throw Rule**: Single-pawn grace roll fallback.
- **Visual Turn Countdown Timer**:
  - Configurable Blitz (15s), Standard (20s), Relaxed (30s), or Unlimited turns for human players.
  - Visual pulsing progress bar with color shifts (Green → Amber → Red) and audio ticking warning.
  - Automatic cowrie casting and safe auto-move fallback on timeout to prevent stalled games.
- **Multiple Game Modes & AI Bot**:
  - **1 Human vs 3 AI Bots** (4-Player Free-For-All)
  - **1 Human vs 1 AI Bot** (2-Player Duel)
  - **4-Player Local Pass & Play**
  - **2-Player Local Pass & Play**
  - Bot difficulty levels: Easy, Medium, Hard (with strategic pathing, capture prioritization, and inner sanctum sprints).
- **Themes & Aesthetics**:
  - Board Themes: Royal Sandalwood, Midnight Obsidian, Ancient Temple Slate, Royal Terracotta, Emerald Silk.
  - Pawn Themes: Precious Jewels (Ruby, Emerald, Sapphire, Topaz), Royal Brass Coins, Marble Stones, Handcrafted Clay.
- **Audio & Visual Effects**:
  - Procedural sound effects for shell throws, pawn hops, captures, safe sanctuary landings, and victory fanfare.
  - Canvas confetti celebration on game win.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/akram6t/asta-chamma.git

# Enter the project directory
cd asta-chamma

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Canvas Confetti**
- **Web Audio API**

---

## 📜 License

MIT License. Designed & developed with cultural authenticity.
