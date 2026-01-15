# Project Plan: Social Media Impact Simulator

## Overview
A client-side agent-based simulation to visualize how social media algorithms and user interactions facilitate the spread of negativity.

## Tech Stack
- **Framework:** React (TypeScript) + Vite
- **Styling:** Tailwind CSS
- **Visualization:** `react-force-graph-2d`
- **Charts:** `recharts`
- **Testing:** Vitest + React Testing Library

## Roadmap

### Phase 1: Setup & Scaffolding [x]
- [x] Initialize Git Repo
- [x] Scaffold React App
- [x] Configure Tailwind CSS
- [x] Configure Test Environment

### Phase 2: Simulation Engine (Core Logic) [x]
- [x] Define `Agent` model (happiness, susceptibility, connectivity)
- [x] Define `Post` model (sentiment, author)
- [x] Create `SimulationEngine` class (tick loop, interaction rules)
- [x] Implement "Algorithm Bias" logic
- [x] **Tests:** Unit tests for Agent state changes and Engine steps

### Phase 3: Visualization (The Graph) [x]
- [x] Integrate `react-force-graph-2d`
- [x] Map agents to nodes (color = mood)
- [x] Map relationships to links
- [ ] **Tests:** Component render tests

### Phase 4: UI & Controls [x]
- [x] Sidebar for simulation parameters (Bias, Speed, Population)
- [x] Real-time stats charts (Avg Happiness, Post Sentiment)
- [x] Main layout structure

### Phase 5: Polish & Documentation [x]
- [x] Add explanatory text/tutorial
- [x] Code comments review
- [x] Final QA
