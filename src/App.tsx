import { useEffect } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { NetworkGraph } from './components/NetworkGraph';
import { HappinessChart } from './components/HappinessChart';
import { LiveFeed } from './components/LiveFeed';
import { TheorySection } from './components/TheorySection';
import { Play, Pause, RefreshCw, Activity, Settings2 } from 'lucide-react';

function App() {
  const {
    agents,
    stats,
    posts,
    isRunning,
    setIsRunning,
    initialize,
    step,
    updateConfig,
    setTickRate,
  } = useSimulation({
    algorithmBias: 0.5,
    postRateMultiplier: 1.0,
  });

  useEffect(() => {
    initialize(50, 3);
  }, [initialize]);

  const currentHappiness = stats[stats.length - 1]?.averageHappiness || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 flex flex-col gap-6 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 text-transparent bg-clip-text">
            Social Media Impact Simulator
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Simulating how algorithmic bias drives emotional contagion.
          </p>
        </div>
        
        <div className="flex gap-4 items-center self-end md:self-auto">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all shadow-lg ${
              isRunning 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isRunning ? 'PAUSE' : 'START SIMULATION'}
          </button>
          
          <button 
            onClick={() => initialize(50, 3)}
            title="Reset Simulation"
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 text-slate-400 hover:text-white"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
        {/* Main Graph Area */}
        <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden relative shadow-2xl">
          <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Happy
            <span className="w-2 h-2 rounded-full bg-red-500 ml-2"></span> Unhappy
          </div>
          <NetworkGraph agents={agents} recentPosts={posts.slice(-10)} />
        </div>

        {/* Live Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <LiveFeed posts={posts} />
        </div>

        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2">
          
          {/* Stats Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-semibold uppercase tracking-wider">
              <Activity size={16} /> Live Statistics
            </div>
            
            <div className="flex items-end justify-between mb-2">
               <span className="text-3xl font-mono font-bold text-white">
                 {(currentHappiness * 100).toFixed(1)}%
               </span>
               <span className={`text-sm font-medium mb-1 ${currentHappiness > 0.5 ? 'text-emerald-400' : 'text-red-400'}`}>
                 Avg Happiness
               </span>
            </div>
            
            <HappinessChart data={stats} />
          </div>

          {/* Controls Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex-1">
            <div className="flex items-center gap-2 mb-6 text-slate-400 text-sm font-semibold uppercase tracking-wider">
              <Settings2 size={16} /> Configuration
            </div>
            
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-200">Algorithm Bias</label>
                  <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400">High Impact</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2" 
                  step="0.1"
                  defaultValue="0.5"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  onChange={(e) => updateConfig({ algorithmBias: parseFloat(e.target.value) })}
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium uppercase">
                  <span>Extreme Content</span>
                  <span>Neutral</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Controls how much the feed prioritizes emotional/extreme content over chronological posts.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-200">Simulation Speed</label>
                <input 
                  type="range" 
                  min="100" 
                  max="1000" 
                  step="100" 
                  defaultValue="500"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500"
                  style={{ direction: 'rtl' }} // Higher value = Slower, so flip it visualy
                  onChange={(e) => setTickRate(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium uppercase">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <button 
                  onClick={() => step()}
                  disabled={isRunning}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Step Single Frame
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <TheorySection />
    </div>
  );
}

export default App;