import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  LineChart,
  Brain,
  Calculator,
  BadgePercent,
  FlaskConical,
  TrendingUp,
  Settings,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/holdings", label: "Holdings", icon: PieChart },
  { href: "/dashboard/market", label: "Market Updates", icon: LineChart },
  { href: "/dashboard/data", label: "Data Import", icon: FileText },
];

const analysisNav = [
  { href: "/dashboard/advisor", label: "AI Advisor", icon: Brain },
  { href: "/dashboard/glass-box", label: "Glass Box", icon: Calculator },
  { href: "/dashboard/simulator", label: "Simulator", icon: FlaskConical },
  { href: "/dashboard/fees", label: "Fee Analyzer", icon: BadgePercent },
  { href: "/dashboard/performance", label: "Performance", icon: TrendingUp },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
];

const settingsNav = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const NAV_TOUR_TARGETS: Record<string, string> = {
  "/dashboard": "nav-dashboard",
  "/dashboard/holdings": "nav-holdings",
  "/dashboard/market": "nav-market",
  "/dashboard/data": "nav-data-import",
  "/dashboard/advisor": "nav-advisor",
  "/dashboard/glass-box": "nav-glass-box",
  "/dashboard/simulator": "nav-simulator",
  "/dashboard/fees": "nav-fee-analyzer",
  "/dashboard/performance": "nav-performance",
  "/dashboard/alerts": "nav-alerts",
  "/dashboard/settings": "nav-settings",
};

function NavSection({
  label,
  items,
  pathname,
  collapsed,
  onNavigate,
}: {
  label: string;
  items: typeof mainNav;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {!collapsed && (
        <span className="mb-1 px-3 font-body text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted">
          {label}
        </span>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <NavLink
            key={item.href}
            to={item.href}
            data-tour={NAV_TOUR_TARGETS[item.href]}
            title={collapsed ? item.label : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-[8px] px-3 font-body text-sm transition-all duration-200",
              collapsed ? "h-10 justify-center" : "h-10",
              isActive
                ? "bg-accent-subtle text-accent-primary"
                : "text-text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-text-primary"
            )}
          >
            <item.icon
              size={18}
              className={cn(
                "flex-shrink-0",
                isActive ? "text-accent-primary" : ""
              )}
              aria-hidden="true"
            />
            {!collapsed && item.label}
          </NavLink>
        );
      })}
    </div>
  );
}

interface SidebarProps {
  fxRate?: number | null;
  fxStatus?: "fresh" | "stale";
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onRequestCloseMobile?: () => void;
}

export function Sidebar({
  fxRate,
  fxStatus = "fresh",
  collapsed,
  onToggleCollapse,
  isMobile = false,
  mobileOpen = false,
  onRequestCloseMobile,
}: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const effectiveCollapsed = isMobile ? false : collapsed;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r transition-all duration-300",
        effectiveCollapsed ? "w-[72px]" : "w-[240px]",
        isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
      )}
      style={{
        backgroundColor: "#111113",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      {/* Brand */}
      <div className="flex h-16 items-center justify-between px-4">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5"
          aria-label="AETHER Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect width="28" height="28" rx="8" fill="#6EE7B7" fillOpacity="0.15" />
            <path
              d="M14 6L20 22H8L14 6Z"
              stroke="#6EE7B7"
              strokeWidth="1.5"
              strokeLinejoin="round"
              fill="none"
            />
            <line x1="10.5" y1="16" x2="17.5" y2="16" stroke="#6EE7B7" strokeWidth="1.5" />
          </svg>
          {!effectiveCollapsed && (
            <span
              className="text-[1.1rem] font-bold tracking-[0.12em]"
              style={{ fontFamily: "TT Bakers, serif", color: "#F4F4F5" }}
            >
              AETHER
            </span>
          )}
        </NavLink>
        {isMobile ? (
          <button
            type="button"
            onClick={onRequestCloseMobile}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-text-primary"
            aria-label="Close navigation"
          >
            <X size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-text-primary"
            aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {effectiveCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <NavSection
          label="Main"
          items={mainNav}
          pathname={pathname}
          collapsed={effectiveCollapsed}
          onNavigate={onRequestCloseMobile}
        />
        <NavSection
          label="Analysis"
          items={analysisNav}
          pathname={pathname}
          collapsed={effectiveCollapsed}
          onNavigate={onRequestCloseMobile}
        />
        <NavSection
          label="Account"
          items={settingsNav}
          pathname={pathname}
          collapsed={effectiveCollapsed}
          onNavigate={onRequestCloseMobile}
        />
      </nav>

      {/* FX Rate (bottom) */}
      <div
        className="border-t px-4 py-3"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        {!effectiveCollapsed ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                fxStatus === "fresh" ? "bg-accent-primary pulse-dot" : "bg-accent-warning"
              )}
            />
            <span
              className="text-xs text-text-muted"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {fxRate ? `$1 = ₱${fxRate.toFixed(2)}` : "Loading FX..."}
            </span>
            {fxStatus === "stale" && (
              <span className="text-[10px] text-accent-warning">stale</span>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                fxStatus === "fresh" ? "bg-accent-primary pulse-dot" : "bg-accent-warning"
              )}
              title={fxRate ? `$1 = ₱${fxRate.toFixed(2)}` : "Loading FX..."}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
