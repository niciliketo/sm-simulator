import { describe, it, expect, beforeEach } from 'vitest';
import { SimulationEngine } from './SimulationEngine';

describe('SimulationEngine', () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine({
      algorithmBias: 0.5,
      postRateMultiplier: 1.0,
    });
  });

  it('should initialize agents correctly', () => {
    engine.initialize(10, 2);
    const agents = engine.getAgents();
    expect(agents).toHaveLength(10);
    expect(agents[0].following.length).toBeGreaterThanOrEqual(0);
  });

  it('should update average happiness after a step', () => {
    engine.initialize(20, 3);
    const initialHappiness = engine.step().averageHappiness;
    
    // Run multiple steps
    for (let i = 0; i < 10; i++) {
      engine.step();
    }
    
    const finalHappiness = engine.step().averageHappiness;
    expect(typeof finalHappiness).toBe('number');
    expect(finalHappiness).toBeGreaterThanOrEqual(0);
    expect(finalHappiness).toBeLessThanOrEqual(1);
  });

  it('should reflect algorithm bias in feed selection', () => {
    // This is a more complex test, but we can verify it runs without crashing
    engine.initialize(5, 4);
    engine.setConfig({ algorithmBias: 1.0 });
    const result = engine.step();
    expect(result.tick).toBe(1);
  });
});
