import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { Agent } from '../engine/types';

interface NetworkGraphProps {
  agents: Agent[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ agents }) => {
  const graphData = useMemo(() => {
    const nodes = agents.map((agent) => ({
      id: agent.id,
      name: `Agent ${agent.id.split('-')[1]}`,
      happiness: agent.happiness,
      color: getHappinessColor(agent.happiness),
    }));

    const links: { source: string; target: string }[] = [];
    agents.forEach((agent) => {
      agent.following.forEach((targetId) => {
        links.push({
          source: agent.id,
          target: targetId,
        });
      });
    });

    return { nodes, links };
  }, [agents]);

  return (
    <div className="w-full h-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node: any) => `${node.name} (Happiness: ${node.happiness.toFixed(2)})`}
        nodeColor={(node: any) => node.color}
        linkColor={() => 'rgba(255, 255, 255, 0.1)'}
        nodeRelSize={6}
        backgroundColor="#0f172a"
      />
    </div>
  );
};

function getHappinessColor(happiness: number): string {
  // Simple Red to Green gradient
  const r = Math.floor(255 * (1 - happiness));
  const g = Math.floor(255 * happiness);
  const b = 100;
  return `rgb(${r}, ${g}, ${b})`;
}
