import { Brain, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { AdvisorMessage as AdvisorMessageType } from "@/src/types/advisor";

interface AdvisorMessageProps {
  message: AdvisorMessageType;
}

export function AdvisorMessage({ message }: AdvisorMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3",
        isAssistant ? "bg-glass-bg/40" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border",
          isAssistant
            ? "border-accent-primary/40 bg-accent-subtle"
            : "border-glass-border bg-bg-elevated"
        )}
      >
        {isAssistant ? (
          <Brain size={14} className="text-accent-primary" />
        ) : (
          <User size={14} className="text-text-secondary" />
        )}
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-text-muted">
          {isAssistant ? "AETHER AI" : "You"}
        </p>
        <pre className="whitespace-pre-wrap break-words font-body text-sm leading-relaxed text-text-primary">
          {message.content}
        </pre>
      </div>
    </div>
  );
}
