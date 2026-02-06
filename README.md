# Dungeon Craiwler

An AI-driven text dungeon crawler played in the browser. Descend through a procedurally narrated dungeon, making decisions through a two-tier choice system. Runs last 15–30 minutes and end in permadeath.

*You feel like a co-author of your story, but you can absolutely die in it.*

## Running the Game

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Enter Your API Key

On the title screen, paste your Anthropic API key. The key is used client-side only and is never stored or transmitted anywhere except directly to the Anthropic API.

## API Keys Required

| Key | Required | How to Get |
|-----|----------|------------|
| Anthropic API | Yes | https://console.anthropic.com/ |

The game calls the Anthropic API directly from the browser using:
- **Claude Sonnet** for opening scenarios, action resolution, and floor transitions
- **Claude Haiku** for sub-option generation, custom input validation, and "load more" options

## How to Play

1. **Choose a class**: Fighter (STR), Merchant (CHA), or Artist (CRE)
2. **Read the narration**: Each situation is described in 2-3 sentences
3. **Pick a high-level intent**: 4 options like "Fight", "Negotiate", "Investigate"
4. **Choose a specific action**: Each intent expands into 4 sub-actions with stat checks
5. **See the outcome**: Success, partial success, or failure based on your stats + luck
6. **Survive 10 floors**: Or die trying

### Wild Options

One option in each set is marked **WILD** (pulsing red border). These are high-risk, high-reward choices that can pay off spectacularly or backfire badly. They're a real strategic axis, not comic relief.

### Custom Actions

Click "Write your own action" to type a free-text command (max 200 characters). If your action is impossible given the world state, it fails diegetically and costs your turn.

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Serve with any static file server.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- Anthropic Claude API (Sonnet + Haiku)
