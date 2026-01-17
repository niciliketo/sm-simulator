import React, { useState, useMemo } from 'react';
import { User, Heart, Target, MessageSquare, X, Send, Users } from 'lucide-react';
import type { Agent, Post } from '../engine/types';
import { generatePersonName, generateContent } from '../utils/contentGenerator';

interface AgentDetailPanelProps {
  agentId: string;
  agent: Agent;
  posts: Post[]; // All posts for dependency tracking
  getAgentFeed: (agentId: string) => Post[];
  getAgentPosts: (agentId: string) => Post[];
  setAgentHappiness: (agentId: string, happiness: number) => boolean;
  injectPost: (agentId: string, sentiment: number) => Post | null;
  onClose: () => void;
  isRunning: boolean;
}

export const AgentDetailPanel: React.FC<AgentDetailPanelProps> = ({
  agentId,
  agent,
  posts,
  getAgentFeed,
  getAgentPosts,
  setAgentHappiness,
  injectPost,
  onClose,
  isRunning,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'posts'>('feed');
  const [happinessInput, setHappinessInput] = useState(agent.happiness);
  const [customPostSentiment, setCustomPostSentiment] = useState(0.5);

  // Compute feed and posts (updates when posts array changes)
  const agentFeed = useMemo(() => getAgentFeed(agentId), [agentId, getAgentFeed, posts]);
  const agentPosts = useMemo(() => getAgentPosts(agentId), [agentId, getAgentPosts, posts]);

  const handleHappinessChange = () => {
    setAgentHappiness(agentId, happinessInput);
  };

  const handleInjectPost = () => {
    injectPost(agentId, customPostSentiment);
    setCustomPostSentiment(0.5);
  };

  // Update happiness input when agent changes
  React.useEffect(() => {
    setHappinessInput(agent.happiness);
  }, [agent.happiness]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {generatePersonName(agentId)}
            </h3>
            <p className="text-xs text-slate-500 font-mono">{agentId}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Live indicator */}
      {isRunning && (
        <div className="px-5 py-2 bg-slate-800/50 border-b border-slate-700 flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live updating
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Heart size={16} />}
            label="Happiness"
            value={`${(agent.happiness * 100).toFixed(0)}%`}
            color={getHappinessColor(agent.happiness)}
          />
          <StatCard
            icon={<Target size={16} />}
            label="Susceptibility"
            value={`${(agent.susceptibility * 100).toFixed(0)}%`}
            color="text-purple-400"
          />
          <StatCard
            icon={<MessageSquare size={16} />}
            label="Post Frequency"
            value={`${(agent.postFrequency * 100).toFixed(0)}%`}
            color="text-blue-400"
          />
          <StatCard
            icon={<Users size={16} />}
            label="Connections"
            value={`${agent.following.length} / ${agent.followers.length}`}
            subLabel="Following / Followers"
            color="text-emerald-400"
          />
        </div>

        {/* Happiness Control */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
          <label className="text-sm font-medium text-slate-200">
            Adjust Happiness
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={happinessInput}
            onChange={(e) => setHappinessInput(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {(happinessInput * 100).toFixed(0)}%
            </span>
            <button
              onClick={handleHappinessChange}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Post Injection */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
          <label className="text-sm font-medium text-slate-200">
            Post as {generatePersonName(agentId).split(' ')[0]}
          </label>
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Sentiment</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={customPostSentiment}
              onChange={(e) => setCustomPostSentiment(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="text-xs text-slate-400 text-center">
              {getSentimentLabel(customPostSentiment)}
            </div>
          </div>
          <div className="text-sm text-slate-300 italic bg-slate-900/50 p-3 rounded border border-slate-700 min-h-[60px]">
            {generateContent(customPostSentiment, `preview-${customPostSentiment.toFixed(2)}`)}
          </div>
          <button
            onClick={handleInjectPost}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={16} />
            Post Now
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'feed'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Their Feed ({agentFeed.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Their Posts ({agentPosts.length})
          </button>
        </div>

        {/* Post List */}
        {activeTab === 'feed' && (
          <PostList posts={agentFeed.slice().reverse()} emptyMessage="No posts in feed yet" />
        )}
        {activeTab === 'posts' && (
          <PostList posts={agentPosts.slice().reverse()} emptyMessage="No posts created yet" />
        )}
      </div>
    </div>
  );
};

// Helper components
const StatCard = ({ icon, label, value, subLabel, color }: any) => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
    {icon && <div className={`${color} mb-2`}>{icon}</div>}
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-slate-400 mt-1">{label}</div>
    {subLabel && <div className="text-[10px] text-slate-500">{subLabel}</div>}
  </div>
);

const PostList = ({ posts, emptyMessage }: { posts: Post[]; emptyMessage: string }) => {
  const [prevPostIds, setPrevPostIds] = React.useState<Set<string>>(new Set());
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const currentIds = new Set(posts.map(p => p.id));
    const hasNewPosts = posts.some(p => !prevPostIds.has(p.id));

    if (hasNewPosts && scrollRef.current) {
      // Smooth scroll to top when new posts arrive
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setPrevPostIds(currentIds);
  }, [posts]);

  const isNewPost = (postId: string) => !prevPostIds.has(postId);

  return (
    <div ref={scrollRef} className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      {posts.length === 0 ? (
        <div className="text-slate-500 text-sm text-center py-8">{emptyMessage}</div>
      ) : (
        posts.map((post, index) => (
          <div
            key={post.id}
            className={`bg-slate-800/50 border border-slate-700 rounded-lg p-3 space-y-2 hover:bg-slate-800 transition-all ${
              isNewPost(post.id) && index < 3 ? 'animate-slideIn' : ''
            }`}
            style={{
              animationDelay: isNewPost(post.id) ? `${index * 50}ms` : '0ms'
            }}
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
        ))
      )}
    </div>
  );
};

function getHappinessColor(happiness: number): string {
  if (happiness < 0.3) return 'text-red-400';
  if (happiness < 0.7) return 'text-yellow-400';
  return 'text-green-400';
}

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
