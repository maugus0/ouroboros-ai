import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ReasoningCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  accentColor?: string;
  defaultOpen?: boolean;
  headerRight?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ReasoningCard({
  title,
  icon: Icon,
  iconColor = "text-muted-foreground",
  accentColor = "border-l-muted-foreground/30",
  defaultOpen = false,
  headerRight,
  children,
  className,
}: ReasoningCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          "overflow-hidden rounded-lg border border-border/60 bg-card/50 backdrop-blur-sm transition-all duration-200",
          "hover:border-border/80 hover:bg-card/70",
          isOpen && "border-border/80 bg-card/70",
          className
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
              "hover:bg-muted/30",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1"
            )}
          >
            <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center", iconColor)}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="flex-1 text-xs font-medium text-foreground/90">{title}</span>
            {headerRight && (
              <div className="mr-1" onClick={(e) => e.stopPropagation()}>
                {headerRight}
              </div>
            )}
            <div className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground/60">
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div
            className={cn("border-l-2 border-t border-t-border/40 px-3 pb-3 pt-2.5", accentColor)}
          >
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
