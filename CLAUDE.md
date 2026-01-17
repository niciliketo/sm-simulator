# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based social media simulation that models emotional contagion, network effects, and algorithmic content recommendation. The simulation demonstrates how engagement-driven algorithms can amplify extreme content and create feedback loops that affect collective happiness.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Run tests
npx vitest run

# Run tests in watch mode
npx vitest

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Testing

- **Test Framework**: Vitest with jsdom environment
- **Test Setup**: `src/test/setup.ts` configures globals and environment
- **Running single test file**: `npx vitest src/engine/SimulationEngine.test.ts`
- **Coverage**: Not currently configured

## Deployment

Deployed to Hetzner using Kamal 2:

```bash
# Initial setup (first deployment)
kamal setup

# Deploy updates
kamal deploy

# View logs
kamal logs

# Rollback
kamal rollback
```

The app is containerized with nginx serving the built static files.

## Architecture

### Core Simulation Engine

The heart of the application is `SimulationEngine.ts`, which implements a tick-based simulation:

1. **Agents** (people) have:
   - `happiness` (0-1): Current emotional state
   - `susceptibility` (0-1): How much content affects them
   - `postFrequency`: Base probability of posting per tick
   - `following`/`followers`: Network connections

2. **Posts** carry:
   - `sentiment` (0-1): Emotional tone derived from author's happiness
   - `authorId`: Who created it
   - `timestamp`: When it was created

3. **Simulation loop** (in `step()` method):
   - Agents post based on emotional arousal (extreme happiness/unhappiness increases posting)
   - Agents consume feeds based on algorithm bias
   - Agent happiness shifts based on consumed content (emotional contagion)
   - Natural mood decay toward neutral (0.5)

### Feed Algorithm

The `getFeedForAgent()` method is crucial to understanding the simulation:

- **When `algorithmBias = 0`**: Chronological feed (last 5 posts from followed users)
- **When `algorithmBias > 0`**: Prioritizes posts with extreme sentiment (far from 0.5)
- This mimics engagement-driven algorithms that surface emotionally charged content

### State Management

- **Hook**: `useSimulation.ts` wraps the engine in a React hook
- **Pattern**: The engine is stored in a `useRef` to persist across renders
- **Updates**: After each step, arrays are spread to trigger React re-renders
- **Interval**: `setInterval` drives continuous simulation when running

### UI Components

- **NetworkGraph**: Force-directed graph using `react-force-graph-2d`
  - Node colors interpolate from red (unhappy) to green (happy)
  - Shows real-time pulse animations for new posts
  - Layout is stable due to fixed link distance and centering

- **LiveFeed**: Scrollable feed showing recent posts with:
  - Generated person names (deterministic from agent ID)
  - Generated content matching sentiment ranges
  - Real-time updates as posts are created

- **HappinessChart**: Recharts line chart tracking average happiness over last 50 ticks

### Content Generation

`contentGenerator.ts` provides deterministic humanization:
- `generatePersonName()`: Maps agent IDs to consistent first/last name combinations
- `generateContent()`: Selects from sentiment-appropriate message pools

## Code Patterns

### Adding Simulation Parameters

When adding new simulation parameters:

1. Add to `SimulationConfig` interface in `types.ts`
2. Update `setConfig()` usage in `SimulationEngine.ts`
3. Add UI control in `App.tsx` that calls `updateConfig()`
4. Consider impact on both posting behavior and feed algorithm

### Modifying Agent Behavior

Agent state updates happen in two phases:
1. **Posting phase**: Iterate agents, generate posts based on state
2. **Consumption phase**: Iterate agents, update state based on feed

This two-phase approach prevents order-dependent effects within a tick.

### Performance Considerations

- Posts are capped at 1000 in `SimulationEngine` (trimmed each tick)
- Stats array is capped at 50 ticks in `useSimulation`
- Live feed shows last 100 posts
- Network graph stabilization is achieved via fixed node positions

## Tech Stack

- React 19 + TypeScript
- Vite 7 (build tool)
- Tailwind CSS 4 (styling via @tailwindcss/vite plugin)
- Recharts (charts)
- react-force-graph-2d (network visualization)
- Vitest (testing)
- Kamal 2 (deployment)
