export interface Agent {
  id: string;
  happiness: number; // 0.0 (Angry/Sad) to 1.0 (Happy)
  susceptibility: number; // 0.0 to 1.0 (How much posts affect them)
  followers: string[]; // IDs of agents following this agent
  following: string[]; // IDs of agents this agent follows
  postFrequency: number; // Chance to post per tick
}

export interface Post {
  id: string;
  authorId: string;
  sentiment: number; // 0.0 (Negative) to 1.0 (Positive)
  timestamp: number;
}

export interface SimulationConfig {
  algorithmBias: number; // 0.0 (Chronological) to 1.0 (Engagement/Extremist driven)
  postRateMultiplier: number; // Global multiplier for posting frequency
}
