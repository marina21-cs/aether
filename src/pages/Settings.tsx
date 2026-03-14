import { User, Shield, Bell, CreditCard, Lock, Smartphone, Mail, Globe, LogOut } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Settings & Profile</h1>
          <p className="text-text-secondary">Manage your account preferences, security, and subscription tier.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <div className="glass-panel p-4 rounded-2xl border border-glass-border">
            <nav className="space-y-1">
              <button className="w-full flex items-center px-4 py-3 rounded-xl bg-accent-primary/10 text-accent-primary border border-accent-primary/20 transition-all font-medium text-sm">
                <User className="w-4 h-4 mr-3" /> Profile
              </button>
              <button className="w-full flex items-center px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-all font-medium text-sm">
                <Shield className="w-4 h-4 mr-3" /> Security
              </button>
              <button className="w-full flex items-center px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-all font-medium text-sm">
                <Bell className="w-4 h-4 mr-3" /> Notifications
              </button>
              <button className="w-full flex items-center px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-all font-medium text-sm">
                <CreditCard className="w-4 h-4 mr-3" /> Billing & Tier
              </button>
              <button className="w-full flex items-center px-4 py-3 rounded-xl text-text-secondary hover:text-text-primary hover:bg-glass-bg transition-all font-medium text-sm">
                <Globe className="w-4 h-4 mr-3" /> Preferences
              </button>
            </nav>
            
            <div className="mt-8 pt-4 border-t border-glass-border">
              <button className="w-full flex items-center px-4 py-3 rounded-xl text-accent-danger hover:bg-accent-danger/10 transition-all font-medium text-sm">
                <LogOut className="w-4 h-4 mr-3" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          <div className="glass-panel p-8 rounded-2xl border border-glass-border">
            <h2 className="font-display font-bold text-xl text-white mb-6">Personal Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-secondary to-accent-primary p-[3px]">
                <div className="w-full h-full rounded-full bg-bg-card border-2 border-glass-border flex items-center justify-center overflow-hidden">
                  <span className="font-display font-bold text-3xl text-white">GV</span>
                </div>
              </div>
              <div>
                <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors mb-2">
                  Change Avatar
                </button>
                <p className="text-xs text-text-muted">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">First Name</label>
                <input 
                  type="text" 
                  defaultValue="Gabriel" 
                  className="w-full bg-bg-dark border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="Velasco" 
                  className="w-full bg-bg-dark border border-glass-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="email" 
                    defaultValue="gabriel.v@example.com" 
                    className="w-full bg-bg-dark border border-glass-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input 
                    type="tel" 
                    defaultValue="+63 917 123 4567" 
                    className="w-full bg-bg-dark border border-glass-border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-accent-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-glass-border flex justify-end gap-3">
              <button className="px-6 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button className="px-6 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                Save Changes
              </button>
            </div>
          </div>

          {/* Subscription Tier */}
          <div className="glass-panel p-8 rounded-2xl border border-accent-primary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="font-display font-bold text-xl text-white mb-6 relative z-10">Current Plan</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-xl bg-bg-dark/50 border border-glass-border relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">AETHER Premium</h3>
                  <span className="text-[10px] font-mono bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded border border-accent-primary/30">ACTIVE</span>
                </div>
                <p className="text-sm text-text-secondary">Billed annually. Next charge: Nov 15, 2024</p>
              </div>
              
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-2xl font-bold text-white">₱4,990<span className="text-sm text-text-muted font-normal">/yr</span></div>
                <button className="mt-2 text-sm text-accent-secondary hover:text-white transition-colors">Manage Billing</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
