import { ArrowUpRight, ArrowDownRight, AlertTriangle, TrendingDown, DollarSign, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const projectionData = [
  { year: 'Year 1', withFees: 1050000, withoutFees: 1060000, inflation: 1020000 },
  { year: 'Year 5', withFees: 1280000, withoutFees: 1350000, inflation: 1100000 },
  { year: 'Year 10', withFees: 1650000, withoutFees: 1820000, inflation: 1210000 },
  { year: 'Year 15', withFees: 2120000, withoutFees: 2450000, inflation: 1340000 },
  { year: 'Year 20', withFees: 2750000, withoutFees: 3300000, inflation: 1480000 },
];

const feeBreakdownData = [
  { name: 'Management Fee', value: 1.5 },
  { name: 'Platform Fee', value: 0.25 },
  { name: 'Fund Expense Ratio', value: 0.45 },
  { name: 'Trading Commissions', value: 0.15 },
];

export function FeeScanner() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Fee Analyzer & Real-Return</h1>
          <p className="text-text-secondary">Uncover hidden costs and see the true impact of inflation on your wealth.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent-warning text-bg-dark text-sm font-bold hover:bg-accent-warning/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            Optimize Fees
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Annual Fees */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-accent-danger/30">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-danger/10 rounded-full blur-2xl group-hover:bg-accent-danger/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Total Annual Fees</div>
              <div className="font-display font-bold text-3xl text-white">2.35%</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-danger/10 flex items-center justify-center border border-accent-danger/20">
              <AlertTriangle className="w-5 h-5 text-accent-danger" />
            </div>
          </div>
          <div className="flex items-center text-sm relative z-10">
            <span className="text-accent-danger font-medium mr-2">₱ 292,575</span>
            <span className="text-text-muted text-xs">estimated cost this year</span>
          </div>
        </div>

        {/* Real Return (Post-Inflation) */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-accent-warning/30">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-warning/10 rounded-full blur-2xl group-hover:bg-accent-warning/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Real Return (YTD)</div>
              <div className="font-display font-bold text-3xl text-white">4.2%</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-warning/10 flex items-center justify-center border border-accent-warning/20">
              <TrendingDown className="w-5 h-5 text-accent-warning" />
            </div>
          </div>
          <div className="flex items-center text-sm relative z-10">
            <span className="text-text-muted text-xs">Nominal Return: </span>
            <span className="text-white font-medium ml-1"> 8.4%</span>
            <span className="mx-2 text-glass-border">|</span>
            <span className="text-text-muted text-xs">Inflation: </span>
            <span className="text-accent-danger font-medium ml-1"> 4.2%</span>
          </div>
        </div>

        {/* Potential Savings */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group border-accent-success/30">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent-success/10 rounded-full blur-2xl group-hover:bg-accent-success/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Potential 20-Yr Savings</div>
              <div className="font-display font-bold text-3xl text-white">₱ 5.5M</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-success/10 flex items-center justify-center border border-accent-success/20">
              <DollarSign className="w-5 h-5 text-accent-success" />
            </div>
          </div>
          <div className="flex items-center text-sm relative z-10">
            <span className="flex items-center text-accent-success bg-accent-success/10 px-2 py-0.5 rounded text-xs font-medium mr-2 border border-accent-success/20">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Actionable
            </span>
            <span className="text-text-muted text-xs">by optimizing to 0.8% fees</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* The Compounding Cost of Fees */}
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display font-bold text-lg text-white">The Compounding Cost of Fees</h2>
                <p className="text-xs text-text-muted mt-1">Projected wealth over 20 years (Assuming 8% gross return)</p>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWithoutFees" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-success)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWithFees" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInflation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-danger)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--color-accent-danger)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
                  <XAxis dataKey="year" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${(value / 1000000).toFixed(1)}M`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                    formatter={(value: number) => [`₱${value.toLocaleString()}`, '']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="withoutFees" name="0% Fees (Theoretical)" stroke="var(--color-accent-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorWithoutFees)" />
                  <Area type="monotone" dataKey="withFees" name="Current Fees (2.35%)" stroke="var(--color-accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorWithFees)" />
                  <Area type="monotone" dataKey="inflation" name="Purchasing Power (Inflation Adjusted)" stroke="var(--color-accent-danger)" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorInflation)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <h2 className="font-display font-bold text-lg text-white mb-6">Current Fee Breakdown</h2>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeBreakdownData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="var(--color-text-muted)" fontSize={12} tickFormatter={(val) => `${val}%`} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-text-primary)" fontSize={12} width={150} />
                  <Tooltip 
                    cursor={{fill: 'var(--color-glass-bg)'}}
                    contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-glass-border)', borderRadius: '8px' }}
                    formatter={(value: number) => [`${value}%`, 'Fee']}
                  />
                  <Bar dataKey="value" fill="var(--color-accent-warning)" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Actions */}
        <div className="space-y-6">
          
          {/* AI Fee Analysis */}
          <div className="glass-panel p-6 rounded-2xl border border-accent-warning/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-warning/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center mb-4 relative z-10">
              <ShieldAlert className="w-5 h-5 text-accent-warning mr-2" />
              <h3 className="font-display font-bold text-lg text-white">AETHER Analysis</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <p className="text-sm text-text-secondary leading-relaxed">
                Your current blended fee rate of <strong className="text-white">2.35%</strong> is <strong className="text-accent-danger">0.85% higher</strong> than the industry average for your asset class mix.
              </p>
              
              <div className="p-3 rounded-lg bg-bg-dark/50 border border-glass-border">
                <div className="text-xs font-mono text-text-muted mb-1">PRIMARY CULPRIT</div>
                <div className="text-sm text-white font-medium">BPI Equity Value Fund</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-text-muted">Management Fee</span>
                  <span className="text-xs text-accent-danger font-bold">2.00%</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bg-dark/50 border border-glass-border">
                <div className="text-xs font-mono text-text-muted mb-1">RECOMMENDED ALTERNATIVE</div>
                <div className="text-sm text-white font-medium">Vanguard Total World Stock (VT)</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-text-muted">Expense Ratio</span>
                  <span className="text-xs text-accent-success font-bold">0.07%</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-accent-warning text-bg-dark text-sm font-bold hover:bg-accent-warning/90 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              Apply Recommendations
            </button>
          </div>

          {/* Inflation Impact */}
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-white">PH Inflation Impact</h3>
              <Info className="w-4 h-4 text-text-muted" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-glass-border pb-3">
                <div>
                  <div className="text-xs text-text-muted mb-1">Current PH Inflation Rate</div>
                  <div className="text-xl font-bold text-white">4.2%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-muted mb-1">Your Portfolio Yield</div>
                  <div className="text-xl font-bold text-accent-success">8.4%</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-text-secondary mb-2">Purchasing Power Loss (Cash)</div>
                <div className="flex items-center">
                  <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden mr-3">
                    <div className="h-full bg-accent-danger rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-xs font-mono text-accent-danger">-₱ 52,290</span>
                </div>
                <p className="text-[10px] text-text-muted mt-2">Your ₱1.24M in cash is losing value. Consider moving excess to high-yield digital banks or short-term bonds.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
