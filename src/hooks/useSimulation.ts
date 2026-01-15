import { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationEngine } from '../engine/SimulationEngine';
import { Agent, SimulationConfig } from '../engine/types';

export const useSimulation = (initialConfig: SimulationConfig) => {
  const engineRef = useRef<SimulationEngine>(new SimulationEngine(initialConfig));
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<{ tick: number; averageHappiness: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tickRate, setTickRate] = useState(500); // ms per tick

  const initialize = useCallback((agentCount: number, connections: number) => {
    engineRef.current.initialize(agentCount, connections);
    setAgents([...engineRef.current.getAgents()]);
    setStats([{ tick: 0, averageHappiness: 0.5 }]);
  }, []);

  const step = useCallback(() => {
    const result = engineRef.current.step();
    setAgents([...engineRef.current.getAgents()]);
    setStats((prev) => [...prev, { tick: result.tick, averageHappiness: result.averageHappiness }].slice(-50));
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

  return {
    agents,
    stats,
    isRunning,
    setIsRunning,
    initialize,
    step,
    updateConfig,
    setTickRate,
  };
};
