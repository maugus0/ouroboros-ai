import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingBlockProps {
  label: string;
  summary?: string;
  accentColor?: string;
  children: ReactNode;
}

export function ThinkingBlock({
  label,
  summary,
  accentColor = "text-muted-foreground",
  children,
}: ThinkingBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1.5 text-xs transition-colors",
          "text-muted-foreground/70 hover:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
        )}
      >
        <ChevronRight
          className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-90")}
        />
        <span className={cn("font-medium", accentColor)}>{label}</span>
        {summary && !isOpen && <span className="text-muted-foreground/50">— {summary}</span>}
      </button>

      {isOpen && (
        <div className="mt-1.5 border-l-2 border-border/50 pl-4 text-xs text-muted-foreground/80">
          {children}
        </div>
      )}
    </div>
  );
}
