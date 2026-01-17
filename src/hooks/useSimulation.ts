import { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationEngine } from '../engine/SimulationEngine';
import type { Agent, SimulationConfig, Post } from '../engine/types';

export const useSimulation = (initialConfig: SimulationConfig) => {
  const engineRef = useRef<SimulationEngine>(new SimulationEngine(initialConfig));
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<{ tick: number; averageHappiness: number }[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tickRate, setTickRate] = useState(500); // ms per tick

  const initialize = useCallback((agentCount: number, connections: number) => {
    engineRef.current.initialize(agentCount, connections);
    setAgents([...engineRef.current.getAgents()]);
    setStats([{ tick: 0, averageHappiness: 0.5 }]);
    setPosts([]);
  }, []);

  const step = useCallback(() => {
    const result = engineRef.current.step();
    setAgents([...engineRef.current.getAgents()]);
    setStats((prev) => [...prev, { tick: result.tick, averageHappiness: result.averageHappiness }].slice(-50));
    setPosts((prev) => [...prev, ...result.newPosts].slice(-100)); // Keep last 100 posts
    return result;
  }, []);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        step();
      }, tickRate);
    }
    return () => clearInterval(interval);
  }, [isRunning, tickRate, step]);

  const updateConfig = (config: Partial<SimulationConfig>) => {
    engineRef.current.setConfig(config);
  };

  const getAgent = useCallback((agentId: string) => {
    return engineRef.current.getAgent(agentId);
  }, []);

  const getAgentFeed = useCallback((agentId: string) => {
    return engineRef.current.getFeedForAgent(agentId);
  }, []);

  const getAgentPosts = useCallback((agentId: string) => {
    return engineRef.current.getAgentPosts(agentId);
  }, []);

  const setAgentHappiness = useCallback((agentId: string, happiness: number) => {
    const success = engineRef.current.setAgentHappiness(agentId, happiness);
    if (success) {
      setAgents([...engineRef.current.getAgents()]);
    }
    return success;
  }, []);

  const injectPost = useCallback((agentId: string, sentiment: number) => {
    const post = engineRef.current.injectPost(agentId, sentiment);
    if (post) {
      setPosts((prev) => [...prev, post].slice(-100));
      setAgents([...engineRef.current.getAgents()]);
    }
    return post;
  }, []);

  return {
    agents,
    stats,
    posts,
    isRunning,
    setIsRunning,
    initialize,
    step,
    updateConfig,
    setTickRate,
    getAgent,
    getAgentFeed,
    getAgentPosts,
    setAgentHappiness,
    injectPost,
  };
};
