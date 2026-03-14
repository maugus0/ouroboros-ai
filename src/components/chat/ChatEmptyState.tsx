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
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
      <div className="flex flex-col items-center gap-3 pb-6 sm:gap-4 sm:pb-8">
        <img
          src="/orb.jpg"
          alt=""
          className="h-12 w-12 rounded-full object-cover sm:h-16 sm:w-16"
        />
        <div className="text-center">
          <h2 className="text-lg font-semibold tracking-tight sm:text-2xl">
            How can I help you today?
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Ask me anything about scholarships, programs, or applications.
          </p>
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        {suggestions.map((s) => (
          <button
            key={s.title}
            onClick={() => onSuggestionClick(s.prompt)}
            className="flex items-start gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-accent sm:p-4"
          >
            <s.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground sm:h-5 sm:w-5" />
            <div className="min-w-0">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
