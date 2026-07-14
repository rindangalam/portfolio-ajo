import { cn } from "@/lib/utils";

interface SectionDividerProps {
  color?: "primary" | "secondary" | "accent";
  className?: string;
}

const COLOR_MAP = {
  primary: "via-primary/40",
  secondary: "via-secondary/40",
  accent: "via-accent/40",
};

const DOT_COLOR_MAP = {
  primary: "bg-primary/20",
  secondary: "bg-secondary/20",
  accent: "bg-accent/20",
};

export function SectionDivider({ color = "secondary", className }: SectionDividerProps) {
  return (
    <div className={cn("relative flex items-center justify-center py-4", className)}>
      <div className={`h-px w-full bg-gradient-to-r from-transparent ${COLOR_MAP[color]} to-transparent`} />
      <div className={`absolute h-2 w-2 rounded-full ${DOT_COLOR_MAP[color]} blur-sm`} />
    </div>
  );
}
