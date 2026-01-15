import { render } from '@testing-library/react';
import { NetworkGraph } from './NetworkGraph';
import { describe, it, expect, vi } from 'vitest';

// Mock react-force-graph-2d because it uses Canvas which is hard to test in jsdom
vi.mock('react-force-graph-2d', () => ({
  default: () => <div data-testid="force-graph" />
}));

describe('NetworkGraph', () => {
  it('renders without crashing', () => {
    const mockAgents = [
      { id: '1', happiness: 0.5, susceptibility: 0.5, followers: [], following: [], postFrequency: 0.1 }
    ];
    const { getByTestId } = render(<NetworkGraph agents={mockAgents} />);
    expect(getByTestId('force-graph')).toBeDefined();
  });
});
