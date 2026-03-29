import {
  ArrowRight,
  Brain,
  Fingerprint,
  Globe,
  LayoutGrid,
  Network,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { GlowBlobs } from "@/src/components/layout/glow-blobs";

const featureCards = [
  {
    icon: Brain,
    title: "AI Financial Advisor",
    description:
      "Receive portfolio guidance that blends local context, macro signals, and your personal risk profile.",
  },
  {
    icon: LayoutGrid,
    title: "Glass Box Transparency",
    description:
      "Trace every recommendation to its source assumptions with plain-language reasoning.",
  },
  {
    icon: TrendingUp,
    title: "PSEi Real Benchmarks",
    description:
      "Benchmark your returns against local indices and inflation-adjusted purchasing power.",
  },
];

const precisionPillars = [
  {
    title: "Automated Rebalancing",
    description:
      "Maintain your target allocation with scenario-aware nudges instead of manual spreadsheet work.",
  },
  {
    title: "Direct Custody Mindset",
    description:
      "Keep visibility over where your money sits, how it moves, and how much it costs to manage.",
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-primary text-text-primary">
      <GlowBlobs />

      <header className="sticky top-0 z-30 border-b border-glass-border bg-bg-primary/75 backdrop-blur-xl">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/aether-logo.png"
              alt="Aether logo"
              className="h-10 w-10 rounded-xl border border-glass-border object-cover shadow-[0_0_24px_rgba(110,231,183,0.22)]"
            />
            <span className="font-display text-xl font-bold tracking-[0.08em] text-text-primary">
              AETHER
            </span>
          </Link>

          <div className="hidden items-center gap-8 font-body text-sm text-text-secondary md:flex">
            <a href="#features" className="hover:text-text-primary">
              Features
            </a>
            <a href="#precision" className="hover:text-text-primary">
              Precision
            </a>
            <a href="#start" className="hover:text-text-primary">
              Getting Started
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/sign-in"
              className="flex h-[40px] items-center rounded-[8px] border border-border bg-transparent px-4 font-body text-sm font-medium text-text-secondary transition-[color,border-color,background] duration-160 hover:border-border-accent hover:bg-glass-bg hover:text-text-primary"
            >
              Get Started
            </Link>
            <Link
              to="/sign-up"
              className="flex h-[40px] items-center rounded-[8px] bg-accent-primary px-4 font-body text-sm font-semibold text-bg-primary shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97]"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 pb-20 pt-10 lg:pt-16">
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-primary/30 bg-accent-subtle px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Wealth Intelligence Platform
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-[40px] font-bold leading-[1.1] text-text-primary sm:text-[56px] lg:text-[70px]">
              Engineered for modern Filipino investors.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-7 text-text-secondary sm:text-lg">
              AETHER combines portfolio analytics, AI advisor guidance, and
              transparent cost intelligence in one command center.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3" id="start">
              <Link
                to="/sign-in"
                className="inline-flex h-[44px] items-center gap-2 rounded-[8px] bg-accent-primary px-6 font-body text-sm font-semibold text-bg-primary shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97]"
              >
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex h-[44px] items-center rounded-[8px] border border-border bg-glass-bg px-6 font-body text-sm font-medium text-text-primary transition-[border-color,background] duration-160 hover:border-border-accent hover:bg-bg-elevated"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-glass-border bg-glass-bg p-6 shadow-glass backdrop-blur-xl">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
              Portfolio Snapshot
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-glass-border bg-bg-surface p-4">
                <p className="font-body text-xs text-text-muted">Net Worth</p>
                <p className="mt-2 font-display text-2xl text-text-primary">PHP 18.2M</p>
              </div>
              <div className="rounded-xl border border-glass-border bg-bg-surface p-4">
                <p className="font-body text-xs text-text-muted">Real Return</p>
                <p className="mt-2 font-display text-2xl text-accent-primary">+7.2%</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-border-accent bg-accent-subtle p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent-primary" aria-hidden="true" />
                <p className="font-body text-sm text-text-primary">
                  Advisory logic is explainable and benchmarked.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto mt-20 w-full max-w-7xl px-6 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
              Core Intelligence
            </h2>
            <p className="max-w-sm text-right font-body text-sm text-text-secondary">
              Built for clarity, confidence, and decisions you can defend.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="group rounded-2xl border border-glass-border bg-glass-bg p-6 shadow-glass transition-all duration-200 hover:border-border-accent hover:bg-bg-elevated"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Icon className="h-6 w-6 text-accent-primary" aria-hidden="true" />
                    <span className="font-mono text-xs text-text-muted">0{index + 1}</span>
                  </div>
                  <h3 className="font-display text-2xl text-text-primary">{card.title}</h3>
                  <p className="mt-3 font-body text-sm leading-7 text-text-secondary">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section
          id="precision"
          className="mx-auto mt-20 grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-10"
        >
          <div>
            <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
              A heritage of precision engineering.
            </h2>
            <div className="mt-8 space-y-6">
              {precisionPillars.map((pillar, index) => (
                <div key={pillar.title} className="flex gap-4">
                  <div
                    className={`mt-3 h-px w-12 ${
                      index === 0 ? "bg-accent-primary" : "bg-border"
                    }`}
                  />
                  <div>
                    <h3 className="font-body text-base font-semibold text-text-primary">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-7 text-text-secondary">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-2xl border border-glass-border bg-gradient-to-br from-bg-elevated via-bg-surface to-bg-secondary p-8 shadow-glass">
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_25%_15%,rgba(110,231,183,0.15),transparent_55%)]" />
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
                Global Finance Review
              </p>
              <p className="mt-6 font-display text-4xl italic text-accent-primary">
                &quot;Flawless execution.&quot;
              </p>
              <p className="mt-6 font-body text-sm leading-7 text-text-secondary">
                Institutional rigor translated into approachable guidance for
                long-term wealth building.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-20 w-full max-w-7xl px-6 lg:px-10">
          <div className="rounded-2xl border border-glass-border bg-bg-surface px-6 py-14 text-center shadow-glass sm:px-10">
            <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
              Start with confidence.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-sm leading-7 text-text-secondary sm:text-base">
              Enter your account and launch your personalized financial command
              center from day one.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/sign-in"
                className="inline-flex h-[44px] items-center rounded-[8px] border border-border bg-transparent px-6 font-body text-sm font-medium text-text-primary transition-[border-color,background] duration-160 hover:border-border-accent hover:bg-glass-bg"
              >
                Get Started
              </Link>
              <Link
                to="/sign-up"
                className="inline-flex h-[44px] items-center rounded-[8px] bg-accent-primary px-6 font-body text-sm font-semibold text-bg-primary shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-10 border-t border-glass-border bg-bg-primary/90">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/aether-logo.png"
                alt="Aether logo"
                className="h-8 w-8 rounded-lg border border-glass-border object-cover"
              />
              <span className="font-display text-lg font-bold tracking-[0.07em] text-text-primary">
                AETHER
              </span>
            </div>
            <p className="mt-3 max-w-xs font-body text-sm leading-6 text-text-secondary">
              Elevated wealth management through transparent intelligence.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
              Product
            </h3>
            <ul className="mt-4 space-y-2 font-body text-sm text-text-secondary">
              <li>AI Advisor</li>
              <li>Benchmarks</li>
              <li>Glass Box</li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-2 font-body text-sm text-text-secondary">
              <li>About</li>
              <li>Philosophy</li>
              <li>Journal</li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-text-muted">
              Network
            </h3>
            <div className="mt-4 flex items-center gap-4 text-text-muted">
              <Globe className="h-5 w-5" aria-hidden="true" />
              <Network className="h-5 w-5" aria-hidden="true" />
              <Fingerprint className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
