import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Briefcase, Sparkles, Clock } from "lucide-react";

const assessments = [
  {
    title: "Career Aptitude Assessment",
    description:
      "Discover your strengths, preferred work environments, and career paths that align with your skills and personality.",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Personality Profile",
    description:
      "Understand your personality traits, communication style, and how you collaborate — helping agents match you with the right programs.",
    icon: Brain,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Interest Mapping",
    description:
      "Map your academic and professional interests to specific fields, research areas, and industry sectors for precise matching.",
    icon: Sparkles,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function AssessmentsPage() {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Assessments</h2>
            <Badge variant="secondary" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Coming Soon
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Career and personality assessments to help our AI agents find the best matches for you.
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="py-8 text-center sm:py-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Assessments are on the way</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We&apos;re building career and personality assessments that will give our AI agents
              deeper insight into your goals. The results will be used alongside your profile to
              match you with the most fitting scholarships, programs, and opportunities.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assessments.map((a) => (
            <Card key={a.title} className="opacity-75 transition-opacity hover:opacity-100">
              <CardContent className="pt-6">
                <div className={`mb-3 inline-flex rounded-lg p-2.5 ${a.bg}`}>
                  <a.icon className={`h-5 w-5 ${a.color}`} />
                </div>
                <h4 className="text-sm font-semibold">{a.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {a.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
