import type { Agent, Post, SimulationConfig } from './types';

export class SimulationEngine {
  private agents: Map<string, Agent> = new Map();
  private posts: Post[] = [];
  private tickCount: number = 0;
  private config: SimulationConfig;

  constructor(config: SimulationConfig) {
    this.config = config;
  }

  public initialize(agentCount: number, averageConnections: number) {
    this.agents.clear();
    this.posts = [];
    this.tickCount = 0;

    // Create agents
    for (let i = 0; i < agentCount; i++) {
      const agent: Agent = {
        id: `agent-${i}`,
        happiness: 0.5 + (Math.random() - 0.5) * 0.2, // Start neutral-ish
        susceptibility: Math.random(),
        followers: [],
        following: [],
        postFrequency: 0.1 + Math.random() * 0.2,
      };
      this.agents.set(agent.id, agent);
    }

    // Create connections (simple random graph)
    const agentIds = Array.from(this.agents.keys());
    for (const agentId of agentIds) {
      const agent = this.agents.get(agentId)!;
      for (let j = 0; j < averageConnections; j++) {
        const targetId = agentIds[Math.floor(Math.random() * agentIds.length)];
        if (targetId !== agentId && !agent.following.includes(targetId)) {
          agent.following.push(targetId);
          this.agents.get(targetId)!.followers.push(agentId);
        }
      }
    }
  }

  public step() {
    this.tickCount++;
    const newPosts: Post[] = [];

    // 1. Agents Post Content
    this.agents.forEach((agent) => {
      // Unhappy agents are slightly more likely to post (or we can make it neutral for now)
      // High emotional arousal (low happiness or very high happiness) could drive posting
      const arousal = Math.abs(agent.happiness - 0.5) * 2;
      const effectivePostFrequency = agent.postFrequency * (1 + arousal) * this.config.postRateMultiplier;

      if (Math.random() < effectivePostFrequency) {
        const post: Post = {
          id: `post-${this.tickCount}-${agent.id}`,
          authorId: agent.id,
          // Sentiment is influenced by current happiness but slightly skewed towards extremes
          sentiment: this.clamp(agent.happiness + (Math.random() - 0.5) * 0.2),
          timestamp: this.tickCount,
        };
        newPosts.push(post);
        this.posts.push(post);
      }
    });

    // 2. Agents Consume Feeds
    this.agents.forEach((agent) => {
      const feed = this.getFeedForAgent(agent);
      if (feed.length === 0) return;

      // Calculate mood shift based on feed.
      // This is the core mechanism of emotional contagion.
      let moodDelta = 0;
      feed.forEach((post) => {
        // The impact of a post depends on the agent's susceptibility.
        // (post.sentiment - 0.5) ranges from -0.5 (negative) to 0.5 (positive).
        const impact = (post.sentiment - 0.5) * agent.susceptibility;
        moodDelta += impact;
      });

      // Update happiness: The average sentiment of the feed shifts the current mood.
      agent.happiness = this.clamp(agent.happiness + moodDelta / feed.length);
      
      // Natural decay: Over time, moods tend to drift back toward neutral (0.5).
      // This prevents the simulation from staying permanently at 0 or 1 without active stimulus.
      agent.happiness += (0.5 - agent.happiness) * 0.05;
    });

    // Keep memory manageable
    if (this.posts.length > 1000) {
      this.posts = this.posts.slice(-1000);
    }

    return {
      tick: this.tickCount,
      newPostsCount: newPosts.length,
      averageHappiness: this.getAverageHappiness(),
    };
  }

  private getFeedForAgent(agent: Agent): Post[] {
    // Filter posts to only show content from agents this user follows.
    const followedPosts = this.posts.filter((p) => agent.following.includes(p.authorId));
    
    if (this.config.algorithmBias === 0) {
      // Purely chronological feed: show the most recent 5 posts.
      return followedPosts.slice(-5);
    }

    // Algorithmic Feed: favors "extreme" content (engagement proxy).
    // We sort posts by their absolute distance from neutral (0.5).
    // The algorithmBias determines how strongly this sorting influences the feed.
    return followedPosts
      .sort((a, b) => {
        const scoreA = Math.abs(a.sentiment - 0.5);
        const scoreB = Math.abs(b.sentiment - 0.5);
        // If bias is high, high-arousal content (extremes) moves to the top.
        return (scoreB - scoreA) * this.config.algorithmBias;
      })
      .slice(-5);
  }

  private getAverageHappiness(): number {
    let sum = 0;
    this.agents.forEach((a) => (sum += a.happiness));
    return sum / this.agents.size;
  }

  private clamp(val: number): number {
    return Math.max(0, Math.min(1, val));
  }

  public getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public setConfig(config: Partial<SimulationConfig>) {
    this.config = { ...this.config, ...config };
  }
}
