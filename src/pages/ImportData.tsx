import { Upload, Link as LinkIcon, FileText, CheckCircle2, AlertTriangle, RefreshCw, Plus } from 'lucide-react';

export function ImportData() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Data Ingestion</h1>
          <p className="text-text-secondary">Connect your accounts or upload statements to keep your portfolio up to date.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-accent-primary text-white text-sm font-medium hover:bg-accent-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync All Connections
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct API Connections */}
        <div className="glass-panel p-6 rounded-2xl border border-glass-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-lg text-white flex items-center">
              <LinkIcon className="w-5 h-5 mr-2 text-accent-secondary" />
              Direct API Connections
            </h2>
            <span className="text-xs bg-accent-success/20 text-accent-success px-2 py-0.5 rounded-full border border-accent-success/30">3 Active</span>
          </div>

          <div className="space-y-4">
            {/* Connection 1 */}
            <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-2">
                  <span className="font-bold text-red-600">BPI</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">Bank of the Philippine Islands</h4>
                  <p className="text-xs text-text-muted mt-0.5">Last synced: 10 mins ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-accent-success flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                </span>
                <button className="text-text-muted hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Connection 2 */}
            <div className="p-4 rounded-xl bg-bg-dark/50 border border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#00529B] flex items-center justify-center p-2">
                  <span className="font-bold text-white text-xs">COL</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">COL Financial</h4>
                  <p className="text-xs text-text-muted mt-0.5">Last synced: 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-accent-success flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Connected
                </span>
                <button className="text-text-muted hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Connection 3 (Error) */}
            <div className="p-4 rounded-xl bg-accent-danger/5 border border-accent-danger/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-2">
                  <span className="font-bold text-blue-800 text-xs">BDO</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">BDO Unibank</h4>
                  <p className="text-xs text-accent-danger mt-0.5">Authentication expired</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-xs font-medium text-bg-dark bg-accent-danger px-3 py-1.5 rounded-lg hover:bg-accent-danger/90 transition-colors">
                  Reconnect
                </button>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl border border-dashed border-glass-border text-sm font-medium text-text-muted hover:text-white hover:border-white/30 transition-colors flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Add New Connection
            </button>
          </div>
        </div>

        {/* Manual Upload */}
        <div className="glass-panel p-6 rounded-2xl border border-glass-border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display font-bold text-lg text-white flex items-center">
              <Upload className="w-5 h-5 mr-2 text-accent-primary" />
              Manual Document Upload
            </h2>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-glass-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-accent-primary/50 hover:bg-accent-primary/5 transition-all cursor-pointer mb-6 group">
            <div className="w-16 h-16 rounded-full bg-bg-dark/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-text-muted group-hover:text-accent-primary transition-colors" />
            </div>
            <h3 className="text-sm font-medium text-white mb-1">Drag & drop your statements here</h3>
            <p className="text-xs text-text-muted mb-4">Supports PDF, CSV, Excel from any PH broker or bank</p>
            <button className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-sm font-medium hover:bg-white/5 transition-colors">
              Browse Files
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Recent Uploads</h3>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-dark/50 border border-glass-border">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-text-muted" />
                <div>
                  <div className="text-sm text-white">FMS_Statement_Q3.pdf</div>
                  <div className="text-[10px] text-text-muted">Parsed successfully • 2 days ago</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-accent-success" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-bg-dark/50 border border-glass-border">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-text-muted" />
                <div>
                  <div className="text-sm text-white">BPI_Trade_History_2023.csv</div>
                  <div className="text-[10px] text-text-muted">Parsed successfully • 1 week ago</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-accent-success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
