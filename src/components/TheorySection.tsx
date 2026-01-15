import React from 'react';
import { Brain, Zap, Share2 } from 'lucide-react';

export const TheorySection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 border-t border-slate-800 pt-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-400">
          <Brain size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Emotional Contagion</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Agents in this simulation have a "Happiness" score. When they consume content from their feed, 
          their mood shifts based on the sentiment of the posts they see. Negative content tends to 
          spread faster as it lowers the happiness of others, making them more likely to post negative content themselves.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Zap size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">The Engagement Algorithm</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          The "Algorithm Bias" slider controls how content is prioritized. In "Neutral" mode, posts are shown chronologically. 
          As bias increases, the algorithm prioritizes "extreme" content (further from 0.5 sentiment). 
          This mimics how real-world algorithms often favor high-arousal (often negative) content to maximize watch time.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-400">
          <Share2 size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Feedback Loops</h3>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Watch how local clusters of negativity (red nodes) can infect the entire network. 
          High susceptibility means agents are easily influenced by their peers, while low susceptibility 
          acts as a buffer against viral negativity.
        </p>
      </div>
    </div>
  );
};
