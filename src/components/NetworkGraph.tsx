import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { Agent, Post } from '../engine/types';
import { generatePersonName } from '../utils/contentGenerator';

interface NetworkGraphProps {
  agents: Agent[];
  recentPosts?: Post[];
  selectedAgentId?: string | null;
  onNodeClick?: (agentId: string) => void;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  agents,
  recentPosts = [],
  selectedAgentId = null,
  onNodeClick,
}) => {
  const graphRef = useRef<any>(null);
  const [pulsingEdges, setPulsingEdges] = useState<Map<string, { color: string; timestamp: number }>>(new Map());

  // Track posts and create edge pulses
  useEffect(() => {
    if (recentPosts.length > 0) {
      const now = Date.now();
      const newPulses = new Map(pulsingEdges);

      // Add pulses for new posts
      recentPosts.forEach((post) => {
        const author = agents.find(a => a.id === post.authorId);
        if (author) {
          // Create pulses to all followers
          author.followers.forEach((followerId) => {
            const edgeKey = `${followerId}-${post.authorId}`; // follower -> author (following direction)
            newPulses.set(edgeKey, {
              color: getSentimentColor(post.sentiment),
              timestamp: now,
            });
          });
        }
      });

      // Remove old pulses (older than 1 second)
      newPulses.forEach((pulse, key) => {
        if (now - pulse.timestamp > 1000) {
          newPulses.delete(key);
        }
      });

      setPulsingEdges(newPulses);
    }
  }, [recentPosts, agents]);

  const graphData = useMemo(() => {
    const nodes = agents.map((agent) => ({
      id: agent.id,
      name: generatePersonName(agent.id),
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

  const getLinkColor = (link: any) => {
    const edgeKey = `${link.source.id || link.source}-${link.target.id || link.target}`;
    const pulse = pulsingEdges.get(edgeKey);

    if (pulse) {
      const age = Date.now() - pulse.timestamp;
      const opacity = Math.max(0, 1 - age / 1000); // Fade over 1 second
      return pulse.color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
    }

    return 'rgba(255, 255, 255, 0.1)';
  };

  const getNodeCanvasObject = useCallback((node: any, ctx: any, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    const isSelected = node.id === selectedAgentId;

    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, isSelected ? 8 : 6, 0, 2 * Math.PI);
    ctx.fillStyle = node.color;
    ctx.fill();

    if (isSelected) {
      ctx.strokeStyle = '#60a5fa'; // blue-400
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }

    // Draw label for selected node
    if (isSelected) {
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#e2e8f0'; // slate-200
      ctx.fillText(label, node.x, node.y + 10);
    }
  }, [selectedAgentId]);

  return (
    <div className="w-full h-full bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={(node: any) => `${node.name} (Happiness: ${node.happiness.toFixed(2)})`}
        nodeCanvasObject={getNodeCanvasObject}
        linkColor={getLinkColor}
        linkWidth={2}
        nodeRelSize={6}
        backgroundColor="#0f172a"
        warmupTicks={100}
        cooldownTicks={0}
        enableNodeDrag={false}
        onNodeClick={(node: any) => onNodeClick?.(node.id)}
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

function getSentimentColor(sentiment: number): string {
  // Same as happiness color - red for negative, green for positive
  const r = Math.floor(255 * (1 - sentiment));
  const g = Math.floor(255 * sentiment);
  const b = 100;
  return `rgb(${r}, ${g}, ${b})`;
}
