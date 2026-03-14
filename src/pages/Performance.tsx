import { TrendingUp, ArrowUpRight, ArrowDownRight, Download, Filter, Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const performanceData = [
  { month: 'Jan', portfolio: 2.1, benchmark: 1.5 },
  { month: 'Feb', portfolio: 3.4, benchmark: 2.8 },
  { month: 'Mar', portfolio: 1.2, benchmark: 0.5 },
  { month: 'Apr', portfolio: -0.5, benchmark: -1.2 },
  { month: 'May', portfolio: 4.2, benchmark: 3.1 },
  { month: 'Jun', portfolio: 5.8, benchmark: 4.5 },
  { month: 'Jul', portfolio: 7.1, benchmark: 5.2 },
  { month: 'Aug', portfolio: 6.5, benchmark: 4.8 },
  { month: 'Sep', portfolio: 8.4, benchmark: 6.1 },
];

export function Performance() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Performance & Alerts</h1>
          <p className="text-text-secondary">Track your historical returns against benchmarks and monitor critical system alerts.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-glass-border">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">YTD Return</div>
          <div className="font-display font-bold text-3xl text-accent-success">+8.4%</div>
          <div className="flex items-center text-xs mt-2 text-text-muted">
            <span className="text-white mr-1">vs Benchmark:</span>
            <span className="text-accent-success">+2.3%</span>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-glass-border">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">1-Year Return</div>
          <div className="font-display font-bold text-3xl text-white">+12.1%</div>
          <div className="flex items-center text-xs mt-2 text-text-muted">
            <span className="text-white mr-1">vs Benchmark:</span>
            <span className="text-accent-success">+3.5%</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-glass-border">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Max Drawdown</div>
          <div className="font-display font-bold text-3xl text-white">-4.2%</div>
          <div className="flex items-center text-xs mt-2 text-text-muted">
            <span className="text-white mr-1">Recovery:</span>
            <span className="text-text-muted">2 Months</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-glass-border">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Sharpe Ratio</div>
          <div className="font-display font-bold text-3xl text-white">1.85</div>
          <div className="flex items-center text-xs mt-2 text-text-muted">
            <span className="text-white mr-1">Risk-Adjusted:</span>
            <span className="text-accent-success">Excellent</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Performance Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display font-bold text-lg text-white">Cumulative Performance (YTD)</h2>
                <p className="text-xs text-text-muted mt-1">Your Portfolio vs Blended Benchmark (60% Equities / 40% Bonds)</p>
              </div>
              <div className="flex bg-bg-dark/50 rounded-lg p-1 border border-glass-border">
                <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">1M</button>
                <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">3M</button>
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-glass-bg text-white shadow-sm border border-glass-border">YTD</button>
                <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">1Y</button>
                <button className="px-3 py-1 text-xs font-medium rounded-md text-text-muted hover:text-white transition-colors">ALL</button>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke="var(--color-text-muted)" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  <Area type="monotone" dataKey="portfolio" name="Your Portfolio" stroke="var(--color-accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPortfolio)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Class Performance */}
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <h2 className="font-display font-bold text-lg text-white mb-6">Asset Class Contribution (YTD)</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-dark/50 border border-glass-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                    <TrendingUp className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Global Equities</h4>
                    <p className="text-xs text-text-muted">45% of Portfolio</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-accent-success">+12.4%</div>
                  <div className="text-xs text-text-muted">Contribution: +5.58%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-dark/50 border border-glass-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-secondary/10 flex items-center justify-center border border-accent-secondary/20">
                    <TrendingUp className="w-5 h-5 text-accent-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">PH Fixed Income</h4>
                    <p className="text-xs text-text-muted">30% of Portfolio</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-accent-success">+4.2%</div>
                  <div className="text-xs text-text-muted">Contribution: +1.26%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-dark/50 border border-glass-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-warning/10 flex items-center justify-center border border-accent-warning/20">
                    <TrendingUp className="w-5 h-5 text-accent-warning" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">Real Estate (REITs)</h4>
                    <p className="text-xs text-text-muted">15% of Portfolio</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-accent-danger">-1.5%</div>
                  <div className="text-xs text-text-muted">Contribution: -0.22%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-glass-border h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-lg text-white flex items-center">
                <Bell className="w-5 h-5 mr-2 text-accent-secondary" />
                System Alerts
              </h2>
              <span className="text-xs bg-accent-danger/20 text-accent-danger px-2 py-0.5 rounded-full border border-accent-danger/30">2 Unread</span>
            </div>

            <div className="space-y-4">
              {/* Alert 1 */}
              <div className="p-4 rounded-xl bg-accent-danger/5 border border-accent-danger/30 relative">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-danger"></div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-accent-danger shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Significant Drawdown Detected</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">Your PH Equity allocation dropped by 3.2% today due to local market volatility. AETHER recommends holding; this aligns with your long-term risk profile.</p>
                    <span className="text-[10px] font-mono text-text-muted mt-2 block">2 hours ago</span>
                  </div>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-4 rounded-xl bg-accent-warning/5 border border-accent-warning/30 relative">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent-warning"></div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-accent-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Cash Drag Warning</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">Cash allocation exceeds target by 5%. Inflation is currently eroding this value. View AI Advisor for deployment options.</p>
                    <span className="text-[10px] font-mono text-text-muted mt-2 block">Yesterday</span>
                  </div>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border opacity-70">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Dividend Received</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">₱12,500 dividend credited from AREIT. Automatically reinvested per your settings.</p>
                    <span className="text-[10px] font-mono text-text-muted mt-2 block">Oct 12, 2023</span>
                  </div>
                </div>
              </div>
              
              {/* Alert 4 */}
              <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border opacity-70">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Monthly Contribution Processed</h4>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">₱50,000 successfully transferred from BPI and allocated according to target weights.</p>
                    <span className="text-[10px] font-mono text-text-muted mt-2 block">Oct 1, 2023</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 text-sm text-text-muted hover:text-white transition-colors">
              View All History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
