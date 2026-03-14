import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Calendar } from "lucide-react";

const mockPrograms = [
  {
    id: "1",
    name: "MS Computer Science",
    university: "National University of Singapore",
    location: "Singapore",
    deadline: "Jan 15, 2027",
    match: 92,
    status: "Open",
  },
  {
    id: "2",
    name: "MS Data Science",
    university: "Nanyang Technological University",
    location: "Singapore",
    deadline: "Mar 1, 2027",
    match: 87,
    status: "Open",
  },
  {
    id: "3",
    name: "MS Artificial Intelligence",
    university: "MIT",
    location: "Cambridge, USA",
    deadline: "Dec 15, 2026",
    match: 78,
    status: "Open",
  },
  {
    id: "4",
    name: "MSc Machine Learning",
    university: "University College London",
    location: "London, UK",
    deadline: "Feb 28, 2027",
    match: 84,
    status: "Open",
  },
];

export default function ProgramsPage() {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Programs</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Graduate programs discovered by OuroborosAI agents.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {mockPrograms.map((program) => (
            <Card key={program.id} className="transition-colors hover:bg-accent/50">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-sm sm:text-base">{program.name}</CardTitle>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                      {program.university}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {program.match}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground sm:gap-4 sm:text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {program.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {program.deadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    {program.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
