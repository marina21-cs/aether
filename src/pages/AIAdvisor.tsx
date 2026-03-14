import { useState } from 'react';
import { Send, Bot, User, Sparkles, Paperclip, Mic, StopCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function AIAdvisor() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Good morning, Gabriel. I noticed your cash allocation has drifted to 15% following your recent dividend payouts. Given current PH inflation rates, this cash drag is costing you approximately ₱4,200 per month in real terms. Would you like me to suggest some short-term deployment options?',
      time: '09:41 AM'
    },
    {
      role: 'user',
      content: 'Yes, what are the best options right now for a 6-month horizon?',
      time: '09:45 AM'
    },
    {
      role: 'assistant',
      content: 'For a 6-month horizon with zero principal risk, here are the optimal options currently available in the Philippine market:\n\n1. **Digital Bank Time Deposits (Maya/Tonik)**: Yielding 6.0% - 6.5% p.a. net of tax.\n2. **BSP Securities (via your broker)**: Currently yielding around 5.8% gross.\n3. **Short-term Corporate Bonds**: Ayala Land 6-month paper is trading at 6.1% YTM.\n\nGiven your current tax bracket, the digital bank time deposits offer the best risk-adjusted *net* return. Should I prepare a transfer authorization for ₱500,000 to your Maya account?',
      time: '09:46 AM'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I am analyzing your request based on your current portfolio allocation and risk profile. Please give me a moment.',
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="font-display font-bold text-3xl text-white flex items-center">
            <Bot className="w-8 h-8 mr-3 text-accent-primary" />
            AETHER AI Advisor
          </h1>
          <p className="text-text-secondary mt-1">Your personal wealth strategist, powered by predictive intelligence.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center text-xs font-mono text-accent-success bg-accent-success/10 px-3 py-1 rounded-full border border-accent-success/20">
            <span className="w-2 h-2 rounded-full bg-accent-success mr-2 animate-pulse"></span>
            System Online
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-panel rounded-2xl border border-glass-border flex flex-col overflow-hidden relative">
        {/* Background Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Bot className="w-96 h-96 text-white" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex max-w-[80%]", msg.role === 'user' ? "ml-auto" : "")}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30 mr-3 shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-accent-primary" />
                </div>
              )}
              
              <div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-accent-primary text-white rounded-tr-sm" 
                    : "bg-bg-dark/80 border border-glass-border text-text-primary rounded-tl-sm backdrop-blur-sm"
                )}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                  ))}
                </div>
                <div className={cn("text-[10px] font-mono text-text-muted mt-1", msg.role === 'user' ? "text-right" : "")}>
                  {msg.time}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-bg-card flex items-center justify-center border border-glass-border ml-3 shrink-0 mt-1">
                  <User className="w-4 h-4 text-text-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-glass-border bg-bg-dark/50 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-2">
            <button className="p-3 rounded-xl text-text-muted hover:text-white hover:bg-glass-bg transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask AETHER about your portfolio, market trends, or tax strategies..." 
                className="w-full bg-bg-card border border-glass-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-colors">
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={handleSend}
              className="p-3 rounded-xl bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-3">
            <button className="text-[10px] font-mono text-text-muted hover:text-accent-secondary transition-colors flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Analyze Portfolio Risk
            </button>
            <button className="text-[10px] font-mono text-text-muted hover:text-accent-secondary transition-colors flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Tax Optimization Ideas
            </button>
            <button className="text-[10px] font-mono text-text-muted hover:text-accent-secondary transition-colors flex items-center">
              <Sparkles className="w-3 h-3 mr-1" /> Rebalancing Suggestions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
