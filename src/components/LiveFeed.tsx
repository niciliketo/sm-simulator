import React from 'react';
import type { Post } from '../engine/types';
import { MessageSquare } from 'lucide-react';

interface LiveFeedProps {
  posts: Post[];
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ posts }) => {
  // Show most recent posts first
  const recentPosts = [...posts].reverse().slice(0, 20);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-semibold uppercase tracking-wider">
        <MessageSquare size={16} /> Live Feed
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {recentPosts.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-8">
            No posts yet. Start the simulation to see activity.
          </div>
        ) : (
          recentPosts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 space-y-2 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  {post.authorId.replace('agent-', 'Agent ')}
                </span>
                <span className="text-xs text-slate-500">
                  Tick {post.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${post.sentiment * 100}%`,
                        backgroundColor: getSentimentColor(post.sentiment),
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs font-medium" style={{ color: getSentimentColor(post.sentiment) }}>
                  {getSentimentLabel(post.sentiment)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function getSentimentColor(sentiment: number): string {
  const r = Math.floor(255 * (1 - sentiment));
  const g = Math.floor(255 * sentiment);
  return `rgb(${r}, ${g}, 100)`;
}

function getSentimentLabel(sentiment: number): string {
  if (sentiment < 0.3) return 'Negative';
  if (sentiment < 0.45) return 'Slightly Negative';
  if (sentiment < 0.55) return 'Neutral';
  if (sentiment < 0.7) return 'Slightly Positive';
  return 'Positive';
}
