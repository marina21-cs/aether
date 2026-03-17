import { SignUp } from "@clerk/react";
import { AuthLayout } from "@/src/components/auth/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="font-display text-[28px] font-bold text-text-primary">
            Create your account
          </h2>
          <p className="mt-2 font-body text-sm text-text-muted">
            Free forever. No credit card needed.
          </p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none p-0 w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton:
                "bg-glass-bg border border-glass-border backdrop-blur-[12px] rounded-[8px] h-[44px] text-text-primary font-body text-sm font-medium hover:border-border-accent transition-border-color duration-200",
              socialButtonsBlockButtonText: "text-text-primary font-body",
              dividerLine: "bg-border",
              dividerText: "text-text-muted font-body text-xs",
              formFieldLabel:
                "text-text-secondary font-body text-xs font-medium uppercase tracking-[0.04em]",
              formFieldInput:
                "bg-bg-elevated border border-glass-border rounded-[8px] h-[44px] text-text-primary font-body text-sm placeholder:text-text-muted focus:border-accent-bright focus:ring-2 focus:ring-accent-bright/15",
              formButtonPrimary:
                "bg-accent-primary hover:bg-accent-bright rounded-[8px] h-[44px] font-body text-sm font-medium shadow-glow hover:shadow-glow-hover transition-all duration-160 active:scale-[0.97]",
              footerAction: "hidden",
              formFieldInputShowPasswordButton: "text-text-muted",
              identityPreview: "bg-bg-elevated border border-glass-border",
              alert: "bg-bg-elevated border border-error/30 text-error",
            },
          }}
        />
        <p className="font-body text-xs text-text-muted text-center">
          Already have an account?{" "}
          <a href="/sign-in" className="text-accent-primary underline">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
