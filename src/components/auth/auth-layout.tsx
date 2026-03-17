import { type ReactNode } from "react";
import { GlowBlobs } from "@/src/components/layout/glow-blobs";
import { BrandPanel } from "./brand-panel";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen">
      <GlowBlobs />
      <BrandPanel />
      <div className="flex w-full items-center justify-center bg-bg-primary px-6 lg:w-1/2">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
