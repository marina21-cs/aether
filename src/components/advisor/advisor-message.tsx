import { Brain, User } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { formatAdvisorSections, formatUserMessage } from "@/src/lib/advisor/format";
import type { AdvisorMessage as AdvisorMessageType } from "@/src/types/advisor";

interface AdvisorMessageProps {
  message: AdvisorMessageType;
  isTyping?: boolean;
}

export function AdvisorMessage({ message, isTyping = false }: AdvisorMessageProps) {
  const isAssistant = message.role === "assistant";
  const formattedSections = isAssistant ? formatAdvisorSections(message.content) : [];
  const userContent = !isAssistant ? formatUserMessage(message.content) : "";

  const renderSectionLine = (line: string, index: number) => {
    if (!line.trim()) {
      return <div key={index} className="h-1.5" />;
    }

    if (line.startsWith("- ")) {
      return (
        <p key={index} className="pl-4 text-sm text-text-primary">
          <span className="-ml-4 mr-1.5 text-text-muted">-</span>
          {line.slice(2)}
        </p>
      );
    }

    return (
      <p key={index} className="text-sm text-text-primary">
        {line}
      </p>
    );
  };

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

        {isAssistant ? (
          <div className="space-y-3">
            {isTyping ? (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-primary">
                {message.content || "Thinking"}
                <span className="ml-1 inline-block animate-pulse text-accent-primary">|</span>
              </p>
            ) : formattedSections.length > 0 ? (
              formattedSections.map((section) => (
                <section key={`${message.id}-${section.title}`} className="space-y-1">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-accent-primary">
                    {section.title}
                  </h3>
                  <div className="space-y-1 leading-relaxed">
                    {section.lines.map((line, index) => renderSectionLine(line, index))}
                  </div>
                </section>
              ))
            ) : (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-primary">
                {message.content}
              </p>
            )}
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-primary">
            {userContent}
          </p>
        )}
      </div>
    </div>
  );
}
