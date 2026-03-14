import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Globe } from "lucide-react";

const mockScholarships = [
  {
    id: "1",
    name: "NUS Merit Scholarship",
    provider: "National University of Singapore",
    amount: "Full tuition + S$6,000/year",
    deadline: "Mar 30, 2027",
    match: 92,
    eligibility: "International students with GPA 3.5+",
  },
  {
    id: "2",
    name: "ASEAN Scholarship",
    provider: "Ministry of Education, Singapore",
    amount: "Full tuition + living allowance",
    deadline: "Apr 15, 2027",
    match: 87,
    eligibility: "ASEAN nationals",
  },
  {
    id: "3",
    name: "Singapore International Graduate Award",
    provider: "A*STAR",
    amount: "Full funding for 4 years",
    deadline: "May 1, 2027",
    match: 85,
    eligibility: "PhD applicants in science & engineering",
  },
  {
    id: "4",
    name: "Commonwealth Scholarship",
    provider: "Commonwealth Scholarship Commission",
    amount: "Full tuition + travel + stipend",
    deadline: "Dec 1, 2026",
    match: 76,
    eligibility: "Commonwealth country citizens",
  },
];

export default function ScholarshipsPage() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Scholarships</h2>
          <p className="text-sm text-muted-foreground">
            Scholarships matched to your profile by OuroborosAI agents.
          </p>
        </div>

        <div className="grid gap-4">
          {mockScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="transition-colors hover:bg-accent/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{scholarship.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{scholarship.provider}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {scholarship.match}% match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    {scholarship.amount}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Deadline: {scholarship.deadline}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  {scholarship.eligibility}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
