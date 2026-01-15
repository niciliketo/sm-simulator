import { useEffect } from 'react';
import { useSimulation } from './hooks/useSimulation';
import { NetworkGraph } from './components/NetworkGraph';
import { Play, Pause, RefreshCw, Activity } from 'lucide-react';

function App() {
  const {
    agents,
    stats,
    isRunning,
    setIsRunning,
    initialize,
    step,
    updateConfig,
  } = useSimulation({
    algorithmBias: 0.5,
    postRateMultiplier: 1.0,
  });

  useEffect(() => {
    initialize(50, 2);
  }, [initialize]);

  const currentHappiness = stats[stats.length - 1]?.averageHappiness || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Impact Simulator</h1>
          <p className="text-slate-400">Visualizing the spread of negativity in digital networks</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-3">
            <Activity className={currentHappiness < 0.4 ? "text-red-500" : "text-green-500"} size={20} />
            <span className="font-mono text-xl">{currentHappiness.toFixed(3)}</span>
            <span className="text-xs text-slate-500 uppercase font-bold">Avg Happiness</span>
          </div>
          
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
          >
            {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={() => initialize(50, 2)}
            className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 h-[600px]">
          <NetworkGraph agents={agents} />
        </div>
        
        <aside className="bg-slate-900 p-6 rounded-lg border border-slate-700 flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Controls</h2>
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-400">Algorithm Bias (Negativity)</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                className="w-full mt-2"
                onChange={(e) => updateConfig({ algorithmBias: parseFloat(e.target.value) })}
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 uppercase">
                <span>Chronological</span>
                <span>Engaging</span>
              </div>
            </label>

            <button 
              onClick={() => step()}
              disabled={isRunning}
              className="w-full py-2 bg-slate-800 rounded border border-slate-700 hover:bg-slate-700 disabled:opacity-50"
            >
              Step Manually
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>How it works:</strong> Nodes represent people. Red means unhappy, Green means happy. 
              The algorithm prioritizes "engaging" (extreme) content, often leading to feedback loops of negativity.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;