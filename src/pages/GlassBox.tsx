import { Eye, Shield, Zap, Activity, ArrowRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export function GlassBox() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2 flex items-center">
            <Eye className="w-8 h-8 mr-3 text-accent-secondary" />
            Glass Box Engine
          </h1>
          <p className="text-text-secondary">Full transparency into how AETHER's AI makes decisions for your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Methodology
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent-secondary text-white text-sm font-medium hover:bg-accent-secondary/90 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Run Diagnostics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Current AI State */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-accent-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="font-display font-bold text-lg text-white mb-6 relative z-10">System Status</h2>
            
            <div className="space-y-6 relative z-10">
              {/* Status Indicator */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-bg-dark/50 border border-glass-border">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-accent-success mr-3 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Engine Active</span>
                </div>
                <span className="text-xs font-mono text-text-muted">v2.4.1</span>
              </div>

              {/* Data Sources */}
              <div>
                <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Active Data Streams</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-accent-success" /> PSEi Real-time</span>
                    <span className="text-white font-mono text-xs">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-accent-success" /> BSP Rates</span>
                    <span className="text-white font-mono text-xs">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-accent-success" /> Global Macro (Fed)</span>
                    <span className="text-white font-mono text-xs">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-accent-success" /> Your Brokerage API</span>
                    <span className="text-white font-mono text-xs">Connected</span>
                  </div>
                </div>
              </div>

              {/* Confidence Score */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider">Model Confidence</h3>
                  <span className="text-xl font-bold text-accent-secondary">92%</span>
                </div>
                <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                  <div className="h-full bg-accent-secondary rounded-full" style={{ width: '92%' }}></div>
                </div>
                <p className="text-[10px] text-text-muted mt-2">High confidence based on low market volatility and strong data correlation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Decision Logic */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-glass-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display font-bold text-lg text-white">Recent AI Decision Matrix</h2>
              <span className="text-xs font-mono text-text-muted">Last updated: 10 mins ago</span>
            </div>

            {/* Decision Item 1 */}
            <div className="mb-8 relative">
              <div className="absolute left-6 top-10 bottom-[-2rem] w-px bg-glass-border"></div>
              
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent-warning/10 flex items-center justify-center border border-accent-warning/30 shrink-0">
                  <AlertTriangle className="w-6 h-6 text-accent-warning" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-accent-warning bg-accent-warning/10 px-2 py-0.5 rounded border border-accent-warning/20">RECOMMENDATION</span>
                    <span className="text-xs text-text-muted">ID: REB-8492</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Reduce PH Equity Exposure by 5%</h3>
                  <p className="text-sm text-text-secondary mt-1">Triggered by shifting macroeconomic indicators and your risk profile.</p>
                </div>
              </div>

              {/* The "Why" */}
              <div className="ml-16 space-y-3">
                <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border">
                  <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">The "Why" (Factor Analysis)</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-danger"></div>
                        <span className="text-sm text-white">Inflation Data (BSP)</span>
                      </div>
                      <span className="text-xs font-mono text-accent-danger">Weight: 40%</span>
                    </div>
                    <p className="text-xs text-text-muted pl-3.5 border-l border-glass-border ml-0.5">Recent CPI print came in higher than expected, signaling potential rate hikes which negatively impact local equities.</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-warning"></div>
                        <span className="text-sm text-white">Portfolio Drift</span>
                      </div>
                      <span className="text-xs font-mono text-accent-warning">Weight: 35%</span>
                    </div>
                    <p className="text-xs text-text-muted pl-3.5 border-l border-glass-border ml-0.5">Your PH equity allocation drifted to 35% (Target: 30%) due to recent market gains. Taking profit is advised.</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-success"></div>
                        <span className="text-sm text-white">Global Tech Momentum</span>
                      </div>
                      <span className="text-xs font-mono text-accent-success">Weight: 25%</span>
                    </div>
                    <p className="text-xs text-text-muted pl-3.5 border-l border-glass-border ml-0.5">Strong signals in US tech sector provide a better risk-adjusted alternative for the redeployed capital.</p>
                  </div>
                </div>
                
                <button className="flex items-center text-sm text-accent-secondary hover:text-white transition-colors">
                  View Full Mathematical Model <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* Decision Item 2 */}
            <div className="relative">
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent-success/10 flex items-center justify-center border border-accent-success/30 shrink-0">
                  <Shield className="w-6 h-6 text-accent-success" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-accent-success bg-accent-success/10 px-2 py-0.5 rounded border border-accent-success/20">ACTION TAKEN</span>
                    <span className="text-xs text-text-muted">ID: ACT-1024</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Auto-Harvested Tax Losses</h3>
                  <p className="text-sm text-text-secondary mt-1">Executed sale of underperforming assets to offset recent capital gains.</p>
                </div>
              </div>

              {/* The "Why" */}
              <div className="ml-16 space-y-3">
                <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border">
                  <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">Execution Logic</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-success"></div>
                        <span className="text-sm text-white">Tax Optimization Rule</span>
                      </div>
                      <span className="text-xs font-mono text-text-muted">Triggered</span>
                    </div>
                    <p className="text-xs text-text-muted pl-3.5 border-l border-glass-border ml-0.5">Identified ₱50,000 in unrealized losses in ACEN. Sold to offset gains from your recent property transaction, saving approx ₱7,500 in taxes.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
