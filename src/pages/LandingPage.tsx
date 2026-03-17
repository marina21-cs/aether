import { Link } from "react-router-dom";
import { GlowBlobs } from "@/src/components/layout/glow-blobs";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bg-primary px-6">
      <GlowBlobs />

      {/* Brand */}
      <div className="relative z-10 flex flex-col items-center gap-4">
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
        <h1 className="font-display text-4xl font-bold tracking-[0.05em] text-text-primary">
          AETHER
        </h1>
        <p className="font-body text-lg text-text-secondary">
          Wealth intelligence for Filipino investors.
        </p>
      </div>

      {/* CTA */}
      <div className="relative z-10 flex gap-3">
        <Link
          to="/sign-up"
          className="flex h-[44px] items-center rounded-[8px] bg-accent-primary px-6 font-body text-sm font-medium text-white shadow-glow transition-[background,box-shadow,transform] duration-160 hover:bg-accent-bright hover:shadow-glow-hover active:scale-[0.97]"
        >
          Get Started
        </Link>
        <Link
          to="/sign-in"
          className="flex h-[44px] items-center rounded-[8px] border border-border bg-transparent px-6 font-body text-sm font-medium text-text-secondary transition-[color,border-color,background] duration-160 hover:border-border-accent hover:bg-glass-bg hover:text-text-primary"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
