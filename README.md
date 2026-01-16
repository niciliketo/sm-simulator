# Social Media Simulator

An interactive web-based simulation exploring how emotional contagion, network effects, and content recommendation algorithms shape online discourse. Watch in real-time as sentiment spreads through a network of people, influenced by algorithmic bias and social connections.

## What It Simulates

This project models a simplified social media platform where:

- **People** represent users with varying emotional states (happiness) and susceptibility to influence
- **Posts** carry sentiment that reflects the author's current mood
- **Networks** connect people through follower/following relationships
- **Algorithms** control how content is surfaced to users (chronological vs. engagement-driven)

### Key Mechanisms

1. **Emotional Contagion**: People's moods shift based on the sentiment of content they consume. Negative content can cascade through networks, pulling down collective happiness.

2. **Algorithmic Amplification**: The algorithm bias parameter controls whether feeds show chronological content (bias = 0) or prioritize emotionally extreme posts (bias = 1), mimicking engagement-maximizing algorithms.

3. **Feedback Loops**: Unhappy people are more likely to post, and they tend to post negative content. When algorithms amplify this negativity, it creates self-reinforcing cycles.

## Features

- Real-time network graph visualization with color-coded happiness levels
- Interactive charts tracking average happiness and post volume over time
- Adjustable simulation parameters:
  - Algorithm bias (chronological vs. engagement-driven)
  - Post rate multiplier
  - Individual susceptibility
  - Network size and connectivity
- Step-through or continuous simulation modes

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to the URL shown (typically `http://localhost:5173`)

### Build

```bash
npm run build
```

### Test

```bash
npx vitest run
```

## Deployment

This project is configured for deployment to a Hetzner server using [Kamal 2](https://kamal-deploy.org/).

### Prerequisites

- [Kamal 2](https://kamal-deploy.org/) installed (`gem install kamal`)
- A GitHub Personal Access Token with `read:packages` and `write:packages` scopes
- Access to the deployment server (SSH key configured)

### Setup

1. **Set up secrets**:
   ```bash
   # Copy the secrets template
   cp .kamal/secrets-example .kamal/secrets

   # Set your GitHub token in your environment
   export GITHUB_TOKEN=your_github_token_here
   ```

2. **Initial deployment**:
   ```bash
   # This sets up the server, proxy, and deploys the app
   kamal setup
   ```

3. **Subsequent deployments**:
   ```bash
   # Deploy updates
   kamal deploy
   ```

### Useful Commands

```bash
# View application logs
kamal logs

# Access container shell
kamal shell

# Rollback to previous version
kamal rollback

# Check deployment status
kamal details
```

The application will be available at: https://sm.iliketo.net

## How to Use

1. **Initialize**: Set your desired number of people and average connections per person, then click "Initialize Network"
2. **Adjust Parameters**: Use the sliders to configure algorithm bias and post rate
3. **Run Simulation**: Click "Start" to run continuously or "Step" to advance one tick at a time
4. **Observe**: Watch the network graph change colors (green = happy, red = unhappy) and track metrics in the charts

## Technical Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling and dev server
- **Tailwind CSS 4** for styling
- **Recharts** for data visualization
- **react-force-graph-2d** for network graph rendering
- **Vitest** for testing

## Project Structure

```
src/
├── components/
│   ├── NetworkGraph.tsx      # Interactive force-directed graph visualization
│   └── TheorySection.tsx     # Explanation of simulation mechanics
├── engine/
│   ├── SimulationEngine.ts   # Core simulation logic
│   └── types.ts              # TypeScript interfaces
├── hooks/
│   └── useSimulation.ts      # React hook for simulation state
└── App.tsx                   # Main application component
```

## Simulation Details

### Individual Behavior

- Each person has a **happiness** score (0-1) that evolves based on consumed content
- **Susceptibility** (0-1) determines how strongly people are affected by posts
- **Post frequency** varies by individual, modified by emotional arousal
- Moods naturally decay toward neutral (0.5) over time

### Feed Algorithm

When `algorithmBias = 0`:
- Feeds show the 5 most recent posts from followed people (chronological)

When `algorithmBias > 0`:
- Feeds prioritize posts with extreme sentiment (far from 0.5)
- Higher bias means stronger prioritization of emotionally charged content

### Metrics

- **Average Happiness**: Mean happiness across all people (0-1)
- **Posts/Tick**: Number of new posts created each simulation step

## License

MIT

## Acknowledgments

Inspired by research on emotional contagion in social networks, filter bubbles, and the effects of engagement-driven content recommendation algorithms.
