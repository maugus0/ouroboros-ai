export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted sm:h-8 sm:w-8">
        <img src="/orb.jpg" alt="" className="h-5 w-5 rounded-full object-cover sm:h-6 sm:w-6" />
      </div>
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s] sm:h-2 sm:w-2" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s] sm:h-2 sm:w-2" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 sm:h-2 sm:w-2" />
      </div>
    </div>
  );
}
