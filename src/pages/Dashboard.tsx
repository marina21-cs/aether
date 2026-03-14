import { ArrowUpRight, ArrowDownRight, Activity, TrendingUp, DollarSign, PieChart, Shield, Zap, Upload, Brain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 10500000 },
  { name: 'Feb', value: 10800000 },
  { name: 'Mar', value: 10600000 },
  { name: 'Apr', value: 11200000 },
  { name: 'May', value: 11500000 },
  { name: 'Jun', value: 11800000 },
  { name: 'Jul', value: 12100000 },
  { name: 'Aug', value: 11900000 },
  { name: 'Sep', value: 12450000 },
];

export function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Welcome back, Gabriel</h1>
          <p className="text-text-secondary">Here is your wealth overview as of today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            AI Analysis
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Net Worth */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-primary/10 rounded-full blur-2xl group-hover:bg-accent-primary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Total Net Worth</div>
              <div className="font-display font-bold text-3xl text-white">₱ 12,450,000</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
              <DollarSign className="w-5 h-5 text-accent-primary" />
            </div>
          </div>
          <div className="flex items-center text-sm relative z-10">
            <span className="flex items-center text-accent-success bg-accent-success/10 px-2 py-0.5 rounded text-xs font-medium mr-2 border border-accent-success/20">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +8.4%
            </span>
            <span className="text-text-muted text-xs">vs last month</span>
          </div>
        </div>

        {/* Liquid Assets */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-secondary/10 rounded-full blur-2xl group-hover:bg-accent-secondary/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Liquid Assets</div>
              <div className="font-display font-bold text-3xl text-white">₱ 4,200,000</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-secondary/10 flex items-center justify-center border border-accent-secondary/20">
              <Activity className="w-5 h-5 text-accent-secondary" />
            </div>
          </div>
          <div className="flex items-center text-sm relative z-10">
            <span className="flex items-center text-accent-success bg-accent-success/10 px-2 py-0.5 rounded text-xs font-medium mr-2 border border-accent-success/20">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +2.1%
            </span>
            <span className="text-text-muted text-xs">vs last month</span>
          </div>
        </div>

        {/* Real Return (Post-Inflation) */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-warning/10 rounded-full blur-2xl group-hover:bg-accent-warning/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Real Return (YTD)</div>
              <div className="font-display font-bold text-3xl text-white">4.2%</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-warning/10 flex items-center justify-center border border-accent-warning/20">
              <TrendingUp className="w-5 h-5 text-accent-warning" />
            </div>
          </div>
          <div className="flex items-center text-sm relative z-10">
            <span className="flex items-center text-accent-danger bg-accent-danger/10 px-2 py-0.5 rounded text-xs font-medium mr-2 border border-accent-danger/20">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              -1.1%
            </span>
            <span className="text-text-muted text-xs">Inflation Impact (PH)</span>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="glass-panel p-6 rounded-2xl border border-glass-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display font-bold text-lg text-white">Wealth Growth Trajectory</h2>
            <p className="text-xs text-text-muted mt-1">Historical performance vs projected goals</p>
          </div>
          <div className="flex bg-bg-dark/50 rounded-lg p-1 border border-glass-border">
            <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">1M</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">3M</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md bg-glass-bg text-white shadow-sm border border-glass-border">YTD</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">1Y</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">ALL</button>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="var(--color-text-muted)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₱${(value / 1000000).toFixed(1)}M`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-card)', 
                  borderColor: 'var(--color-glass-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: 'var(--color-text-primary)' }}
                formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Net Worth']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-accent-primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="glass-panel p-6 rounded-2xl border border-glass-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-lg text-white flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-accent-secondary" />
              Asset Allocation
            </h2>
            <button className="text-xs text-accent-secondary hover:text-white transition-colors">View Details</button>
          </div>
          
          <div className="space-y-4">
            {/* Equities */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Global Equities</span>
                <span className="text-white font-medium">45%</span>
              </div>
              <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-accent-primary rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-text-muted">
                <span>₱ 5,602,500</span>
                <span className="text-accent-success">+12.4% YTD</span>
              </div>
            </div>
            
            {/* Fixed Income */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">PH Fixed Income</span>
                <span className="text-white font-medium">30%</span>
              </div>
              <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-accent-secondary rounded-full" style={{ width: '30%' }}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-text-muted">
                <span>₱ 3,735,000</span>
                <span className="text-accent-success">+4.2% YTD</span>
              </div>
            </div>
            
            {/* Real Estate */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Real Estate (REITs)</span>
                <span className="text-white font-medium">15%</span>
              </div>
              <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-accent-warning rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-text-muted">
                <span>₱ 1,867,500</span>
                <span className="text-accent-danger">-1.5% YTD</span>
              </div>
            </div>
            
            {/* Cash */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Cash & Equivalents</span>
                <span className="text-white font-medium">10%</span>
              </div>
              <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-accent-success rounded-full" style={{ width: '10%' }}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-text-muted">
                <span>₱ 1,245,000</span>
                <span className="text-text-muted">0.0% YTD</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="glass-panel p-6 rounded-2xl border border-glass-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="font-display font-bold text-lg text-white flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent-primary" />
              AETHER Insights
            </h2>
            <span className="text-[10px] bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full border border-accent-primary/30">LIVE</span>
          </div>
          
          <div className="space-y-4 relative z-10">
            {/* Insight 1 */}
            <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border hover:border-accent-primary/30 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-accent-warning shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-accent-primary transition-colors">High Cash Drag Detected</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">Your cash allocation (10%) is currently losing 4.2% to PH inflation. Consider deploying ₱500k into short-term T-bills yielding 5.8%.</p>
                </div>
              </div>
            </div>
            
            {/* Insight 2 */}
            <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border hover:border-accent-secondary/30 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-accent-success shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-accent-secondary transition-colors">Portfolio Rebalancing Opportunity</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">Global equities have drifted 5% above target. Rebalancing now could lock in ₱280k in gains while reducing risk exposure.</p>
                </div>
              </div>
            </div>
            
            {/* Insight 3 */}
            <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border hover:border-accent-primary/30 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(124,58,237,0.6)]"></div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-accent-primary transition-colors">Tax Optimization</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">You have ₱120k in unrealized losses in your local equity portfolio. Tax-loss harvesting could offset gains from your recent property sale.</p>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full mt-4 py-3 rounded-xl border border-glass-border text-sm font-medium text-white hover:bg-glass-bg transition-colors flex items-center justify-center">
            Open AI Advisor
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
