import { Shield, Eye, Lock } from "lucide-react";

const trustSignals = [
  { icon: Lock, text: "AES-256 encrypted" },
  { icon: Shield, text: "Read-only access to brokerages" },
  { icon: Eye, text: "You control your data" },
];

export function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative bg-bg-surface border-r border-glass-border backdrop-blur-[12px]">
      <div className="flex flex-col items-center gap-12">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <svg
            width="48"
            height="48"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect width="28" height="28" rx="8" fill="#7c3aed" />
            <path
              d="M8 14h12M14 8l6 6-6 6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="font-display text-2xl font-bold tracking-[0.08em] text-text-primary">
            AETHER
          </h1>
          <p className="font-body text-lg text-text-muted">
            Your net worth, to the peso.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-col gap-4">
          {trustSignals.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <Icon
                size={18}
                className="text-success flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-body text-sm font-medium text-text-secondary">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
