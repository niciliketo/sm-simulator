import React, { useEffect, useRef, useState } from 'react';
import type { Post } from '../engine/types';
import { MessageSquare } from 'lucide-react';
import { generateContent, generatePersonName } from '../utils/contentGenerator';

interface LiveFeedProps {
  posts: Post[];
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ posts }) => {
  // Show most recent posts first
  const recentPosts = [...posts].reverse().slice(0, 20);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevPostIdsRef = useRef<Set<string>>(new Set());
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set());

  // Track new posts and animate them in
  useEffect(() => {
    const currentPostIds = new Set(recentPosts.map(p => p.id));
    const newIds = new Set<string>();

    recentPosts.forEach(post => {
      if (!prevPostIdsRef.current.has(post.id)) {
        newIds.add(post.id);
      }
    });

    if (newIds.size > 0) {
      setNewPostIds(newIds);

      // Remove the "new" status after animation completes
      const timer = setTimeout(() => {
        setNewPostIds(new Set());
      }, 300);

      return () => clearTimeout(timer);
    }

    prevPostIdsRef.current = currentPostIds;
  }, [recentPosts]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-semibold uppercase tracking-wider">
        <MessageSquare size={16} /> Live Feed
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {recentPosts.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-8">
            No posts yet. Start the simulation to see activity.
          </div>
        ) : (
          recentPosts.map((post) => {
            const isNew = newPostIds.has(post.id);
            return (
              <div
                key={post.id}
                className={`bg-slate-800/50 border border-slate-700 rounded-lg p-3 space-y-2 hover:bg-slate-800 transition-colors ${
                  isNew ? 'animate-grow-in' : ''
                }`}
                style={isNew ? { animation: 'grow-in 300ms ease-out' } : undefined}
              >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">
                  {generatePersonName(post.authorId)}
                </span>
                <span className="text-xs text-slate-500">
                  Tick {post.timestamp}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {generateContent(post.sentiment, post.id)}
              </p>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex-1">
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
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
            );
          })
        )}
      </div>
      <style>{`
        @keyframes grow-in {
          from {
            max-height: 1px;
            opacity: 0.3;
            overflow: hidden;
          }
          to {s
            max-height: 500px;
            opacity: 1;
            overflow: visible;
          }
        }
      `}</style>
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
