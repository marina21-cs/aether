import { useState } from 'react';
import { Play, RotateCcw, Save, Share2, TrendingUp, AlertTriangle, Info, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const generateData = (years: number, initial: number, contribution: number, returnRate: number, volatility: number) => {
  const data = [];
  let current = initial;
  for (let i = 0; i <= years; i++) {
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const actualReturn = returnRate * randomFactor;
    
    data.push({
      year: `Year ${i}`,
      value: Math.round(current),
      target: Math.round(initial * Math.pow(1 + 0.08, i) + contribution * 12 * ((Math.pow(1 + 0.08, i) - 1) / 0.08))
    });
    
    current = current * (1 + actualReturn) + (contribution * 12);
  }
  return data;
};

export function Simulator() {
  const [years, setYears] = useState(20);
  const [initial, setInitial] = useState(12450000);
  const [contribution, setContribution] = useState(50000);
  const [returnRate, setReturnRate] = useState(0.08);
  const [volatility, setVolatility] = useState(0.12);
  const [data, setData] = useState(generateData(20, 12450000, 50000, 0.08, 0.12));

  const runSimulation = () => {
    setData(generateData(years, initial, contribution, returnRate, volatility));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Sandbox Wealth Simulator</h1>
          <p className="text-text-secondary">Test different scenarios and see how they impact your long-term wealth.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors flex items-center">
            <Save className="w-4 h-4 mr-2" />
            Save Scenario
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent-secondary text-white text-sm font-medium hover:bg-accent-secondary/90 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center" onClick={runSimulation}>
            <Play className="w-4 h-4 mr-2" />
            Run Simulation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-lg text-white">Parameters</h2>
              <button className="text-text-muted hover:text-white transition-colors" onClick={() => {
                setYears(20); setInitial(12450000); setContribution(50000); setReturnRate(0.08); setVolatility(0.12);
              }}>
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Time Horizon */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Time Horizon</label>
                  <span className="text-sm font-mono text-white">{years} Years</span>
                </div>
                <input 
                  type="range" min="5" max="40" step="1" 
                  value={years} onChange={(e) => setYears(parseInt(e.target.value))}
                  className="w-full accent-accent-secondary"
                />
              </div>

              {/* Initial Capital */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Initial Capital</label>
                  <span className="text-sm font-mono text-white">₱{(initial/1000000).toFixed(1)}M</span>
                </div>
                <input 
                  type="range" min="1000000" max="50000000" step="500000" 
                  value={initial} onChange={(e) => setInitial(parseInt(e.target.value))}
                  className="w-full accent-accent-secondary"
                />
              </div>

              {/* Monthly Contribution */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Monthly Addition</label>
                  <span className="text-sm font-mono text-white">₱{(contribution/1000).toFixed(0)}k</span>
                </div>
                <input 
                  type="range" min="0" max="500000" step="5000" 
                  value={contribution} onChange={(e) => setContribution(parseInt(e.target.value))}
                  className="w-full accent-accent-secondary"
                />
              </div>

              {/* Expected Return */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Expected Return</label>
                  <span className="text-sm font-mono text-white">{(returnRate*100).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0.02" max="0.15" step="0.005" 
                  value={returnRate} onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                  className="w-full accent-accent-secondary"
                />
              </div>

              {/* Volatility */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-text-secondary">Volatility (Risk)</label>
                  <span className="text-sm font-mono text-white">{(volatility*100).toFixed(1)}%</span>
                </div>
                <input 
                  type="range" min="0.05" max="0.25" step="0.01" 
                  value={volatility} onChange={(e) => setVolatility(parseFloat(e.target.value))}
                  className="w-full accent-accent-secondary"
                />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-glass-border">
              <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-4">Life Events</h3>
              <button className="w-full py-2 rounded-lg border border-dashed border-glass-border text-text-muted hover:text-white hover:border-white/30 transition-colors flex items-center justify-center text-sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Major Expense / Windfall
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Chart & Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-lg text-white">Projected Growth</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent-secondary mr-2"></div>
                  <span className="text-xs text-text-muted">Simulated Path</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-text-muted mr-2"></div>
                  <span className="text-xs text-text-muted">Target (8% Baseline)</span>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-secondary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-secondary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
                  <XAxis dataKey="year" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${(value / 1000000).toFixed(0)}M`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                    formatter={(value: number, name: string) => [`₱${value.toLocaleString()}`, name === 'value' ? 'Simulated' : 'Target']}
                  />
                  <Area type="monotone" dataKey="target" stroke="var(--color-text-muted)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  <Area type="monotone" dataKey="value" stroke="var(--color-accent-secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorSim)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-glass-border">
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Final Portfolio Value</div>
              <div className="font-display font-bold text-3xl text-white">₱{(data[data.length-1].value / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-text-muted mt-2">In Year {years}</div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-glass-border">
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Total Contributions</div>
              <div className="font-display font-bold text-3xl text-white">₱{((initial + (contribution * 12 * years)) / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-text-muted mt-2">Principal + Additions</div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-glass-border bg-accent-secondary/5">
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Total Growth</div>
              <div className="font-display font-bold text-3xl text-accent-secondary">₱{((data[data.length-1].value - (initial + (contribution * 12 * years))) / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-text-muted mt-2">Compound Interest Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
