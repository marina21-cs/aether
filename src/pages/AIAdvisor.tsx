import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import { AdvisorChat } from "@/src/components/advisor/advisor-chat";

export function AIAdvisor() {
  const location = useLocation();

  const initialPrompt = useMemo(() => {
    const prompt = new URLSearchParams(location.search).get("prompt");
    if (!prompt) return null;
    const trimmed = prompt.trim();
    return trimmed.length > 0 ? trimmed : null;
  }, [location.search]);

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-6xl flex-col gap-4 animate-in fade-in duration-500">
      <header>
        <h1 className="flex items-center font-display text-3xl font-bold text-white">
          <Bot className="mr-3 h-8 w-8 text-accent-primary" />
          AETHER AI Advisor
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ask portfolio-aware questions with Philippine market context and transparent assumptions.
        </p>
      </header>

      <div className="min-h-0 flex-1">
        <AdvisorChat initialPrompt={initialPrompt} />
      </div>
    </div>
  );
}
