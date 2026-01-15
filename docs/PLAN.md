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

### Phase 2: Simulation Engine (Core Logic) [ ]
- [ ] Define `Agent` model (happiness, susceptibility, connectivity)
- [ ] Define `Post` model (sentiment, author)
- [ ] Create `SimulationEngine` class (tick loop, interaction rules)
- [ ] Implement "Algorithm Bias" logic
- [ ] **Tests:** Unit tests for Agent state changes and Engine steps

### Phase 3: Visualization (The Graph) [ ]
- [ ] Integrate `react-force-graph-2d`
- [ ] Map agents to nodes (color = mood)
- [ ] Map relationships to links
- [ ] **Tests:** Component render tests

### Phase 4: UI & Controls [ ]
- [ ] Sidebar for simulation parameters (Bias, Speed, Population)
- [ ] Real-time stats charts (Avg Happiness, Post Sentiment)
- [ ] Main layout structure

### Phase 5: Polish & Documentation [ ]
- [ ] Add explanatory text/tutorial
- [ ] Code comments review
- [ ] Final QA
