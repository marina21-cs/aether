import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Upload, 
  Brain, 
  Eye, 
  FlaskConical, 
  AlertTriangle, 
  TrendingUp, 
  Settings,
  Bell,
  Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  { section: 'Main', items: [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Portfolio', path: '/portfolio', icon: BarChart3 },
    { name: 'Import Data', path: '/import', icon: Upload },
  ]},
  { section: 'Analysis', items: [
    { name: 'AI Advisor', path: '/advisor', icon: Brain, badge: 'PRO' },
    { name: 'Glass Box', path: '/glass-box', icon: Eye },
    { name: 'Simulator', path: '/simulator', icon: FlaskConical },
    { name: 'Fee Scanner', path: '/fee-scanner', icon: AlertTriangle },
    { name: 'Performance', path: '/performance', icon: TrendingUp },
  ]},
  { section: 'Settings', items: [
    { name: 'Settings', path: '/settings', icon: Settings },
  ]}
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary font-sans selection:bg-accent-primary/30">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-secondary/10 blur-[150px]"></div>
      </div>

      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-[240px] bg-[rgba(19,19,31,0.85)] border-r border-glass-border backdrop-blur-[16px] z-50 flex flex-col shadow-[4px_0_24px_rgba(124,58,237,0.06)]">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-glass-border shrink-0">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-accent-secondary to-accent-primary flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 22l10-20 10 20"></path>
              <path d="M2 14h20"></path>
            </svg>
          </div>
          <span className="font-display font-bold text-lg tracking-widest text-white">AETHER</span>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
          {NAV_ITEMS.map((section, idx) => (
            <div key={section.section}>
              <div className={cn(
                "text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 px-4",
                idx > 0 && "mt-6"
              )}>
                {section.section}
              </div>
              {section.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl transition-all group relative",
                      isActive 
                        ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20" 
                        : "text-text-secondary hover:text-text-primary hover:bg-glass-bg border border-transparent"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-primary rounded-r-full"></div>
                    )}
                    <Icon className={cn(
                      "w-5 h-5 mr-3 transition-colors",
                      isActive ? "text-accent-primary" : "text-text-muted group-hover:text-accent-secondary"
                    )} />
                    <span className="font-medium text-sm">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full border border-accent-primary/30">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Net Worth Ticker */}
        <div className="p-4 border-t border-glass-border bg-bg-dark/50 shrink-0">
          <div className="text-[10px] font-mono text-text-muted mb-1">LIVE NET WORTH</div>
          <div className="font-display font-bold text-lg text-white tracking-tight">₱ 12,450,000</div>
          <div className="flex items-center mt-1">
            <TrendingUp className="w-3 h-3 text-accent-success mr-1" />
            <span className="text-xs font-mono text-accent-success">+1.2% today</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="pl-[240px] relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 border-b border-glass-border bg-[rgba(19,19,31,0.6)] backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center bg-bg-dark/50 border border-glass-border rounded-full px-4 py-2 w-96">
            <Search className="w-4 h-4 text-text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search assets, analysis, or ask AI..." 
              className="bg-transparent border-none outline-none text-sm text-text-primary w-full placeholder:text-text-muted"
            />
            <div className="flex items-center gap-1 ml-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-bg-card border border-glass-border rounded text-text-muted">⌘</kbd>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-bg-card border border-glass-border rounded text-text-muted">K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-glass-bg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-primary rounded-full border border-bg-panel"></span>
            </button>
            <div className="h-8 w-px bg-glass-border mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-white group-hover:text-accent-secondary transition-colors">Gabriel Velasco</div>
                <div className="text-[10px] font-mono text-text-muted">Premium Tier</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-secondary to-accent-primary p-[2px]">
                <div className="w-full h-full rounded-full bg-bg-card border border-glass-border flex items-center justify-center overflow-hidden">
                  <span className="font-display font-bold text-sm">GV</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
