import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockProfile = {
  university: "National University of Singapore",
  degree: "Bachelor of Computing",
  gpa: "3.8 / 4.0",
  targetDegree: "Master's in Computer Science",
  graduationYear: "2025",
  skills: ["Python", "Machine Learning", "React", "TypeScript", "LangChain", "PyTorch"],
  researchInterests: ["Multi-Agent Systems", "NLP", "Explainable AI"],
};

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Profile</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Your student profile used by OuroborosAI agents.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 rounded-xl sm:h-16 sm:w-16">
                <AvatarImage src="/shadcn.jpg" />
                <AvatarFallback className="text-base sm:text-lg">
                  {user?.name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg">{user?.name ?? "User"}</CardTitle>
                <CardDescription className="truncate">{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Academic Background</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <dt className="text-xs text-muted-foreground sm:text-sm">University</dt>
                <dd className="text-sm font-medium">{mockProfile.university}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground sm:text-sm">Degree</dt>
                <dd className="text-sm font-medium">{mockProfile.degree}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground sm:text-sm">GPA</dt>
                <dd className="text-sm font-medium">{mockProfile.gpa}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground sm:text-sm">Graduation Year</dt>
                <dd className="text-sm font-medium">{mockProfile.graduationYear}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted-foreground sm:text-sm">Target Degree</dt>
                <dd className="text-sm font-medium">{mockProfile.targetDegree}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {mockProfile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Research Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {mockProfile.researchInterests.map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
