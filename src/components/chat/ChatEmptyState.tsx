import { Upload, Search, UserCheck, FileText } from "lucide-react";

interface ChatEmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  {
    icon: Upload,
    title: "Upload my CV",
    description: "for analysis and feedback",
    prompt: "I'd like to upload my CV for analysis and feedback",
  },
  {
    icon: Search,
    title: "Find scholarships",
    description: "matching my profile",
    prompt: "Find scholarships matching my profile for a Master's degree",
  },
  {
    icon: UserCheck,
    title: "Review my profile",
    description: "and suggest improvements",
    prompt: "Review my student profile and suggest improvements",
  },
  {
    icon: FileText,
    title: "Draft a Statement",
    description: "of Purpose for applications",
    prompt: "Help me draft a Statement of Purpose for my graduate application",
  },
];

export function ChatEmptyState({ onSuggestionClick }: ChatEmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 pb-8">
        <img src="/orb.jpg" alt="" className="h-16 w-16 rounded-full object-cover" />
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight">How can I help you today?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask me anything about scholarships, programs, or applications.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s.title}
            onClick={() => onSuggestionClick(s.prompt)}
            className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent"
          >
            <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
