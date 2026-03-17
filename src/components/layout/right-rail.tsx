import { MessageSquare, X } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { AdvisorChat } from "@/src/components/advisor/advisor-chat";

interface RightRailProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RightRail({ isOpen, onClose }: RightRailProps) {

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20"
          aria-label="Close advisor overlay"
          onClick={onClose}
        />
      )}

      {/* Right Rail Panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen w-[360px] max-w-[92vw] flex-col border-l border-glass-border bg-bg-surface backdrop-blur-[12px] transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-glass-border px-4">
          <div className="flex items-center gap-2">
            <MessageSquare
              size={18}
              className="text-accent-primary"
              aria-hidden="true"
            />
            <span className="font-display text-sm font-semibold text-text-primary">
              AI Advisor
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-text-muted hover:bg-glass-bg hover:text-text-primary focus-ring"
            aria-label="Close AI Advisor"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 p-3">
          <AdvisorChat compact />
        </div>
      </aside>
    </>
  );
}
