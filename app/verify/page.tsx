import { Suspense } from "react";
import { CheckCircle2, Info, XCircle, AlertTriangle } from "lucide-react";

const STATUS: Record<string, { icon: React.ReactNode; iconClass: string; title: string; description: string }> = {
  success: {
    icon: <CheckCircle2 className="h-12 w-12" />,
    iconClass: "text-primary",
    title: "Message Confirmed",
    description: "Your message has been verified and will be delivered. Thank you.",
  },
  already: {
    icon: <Info className="h-12 w-12" />,
    iconClass: "text-secondary",
    title: "Already Confirmed",
    description: "This message has already been verified. No action needed.",
  },
  invalid: {
    icon: <XCircle className="h-12 w-12" />,
    iconClass: "text-red-400",
    title: "Invalid Link",
    description: "This verification link is invalid or expired. Please submit your message again.",
  },
  error: {
    icon: <AlertTriangle className="h-12 w-12" />,
    iconClass: "text-red-400",
    title: "Something Went Wrong",
    description: "An error occurred while verifying your message. Please try again.",
  },
};

function VerifyFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5">
      <div className="glass w-full max-w-md rounded-2xl p-8 text-center">
        <div className="mb-4 h-12 w-12 animate-pulse rounded-full bg-muted-foreground/20 mx-auto" />
        <div className="mb-2 h-6 w-48 animate-pulse rounded bg-muted-foreground/20 mx-auto" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted-foreground/20 mx-auto" />
      </div>
    </div>
  );
}

async function VerifyInner({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const info = STATUS[status ?? ""] ?? STATUS.invalid;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-5">
      <div className="glass w-full max-w-md rounded-2xl p-8 text-center">
        <div className={`mb-4 flex justify-center ${info.iconClass}`}>{info.icon}</div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          {info.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {info.description}
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-display text-sm font-bold text-primary-foreground transition-all duration-500 ease-premium hover:shadow-[0_0_40px_hsl(82_100%_66%/0.35)] hover:brightness-110"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyInner searchParams={searchParams} />
    </Suspense>
  );
}