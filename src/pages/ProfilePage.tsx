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
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Your student profile used by OuroborosAI agents.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 rounded-xl">
                <AvatarImage src="/shadcn.jpg" />
                <AvatarFallback className="text-lg">{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user?.name ?? "User"}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Academic Background</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">University</dt>
                <dd className="text-sm font-medium">{mockProfile.university}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Degree</dt>
                <dd className="text-sm font-medium">{mockProfile.degree}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">GPA</dt>
                <dd className="text-sm font-medium">{mockProfile.gpa}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Graduation Year</dt>
                <dd className="text-sm font-medium">{mockProfile.graduationYear}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted-foreground">Target Degree</dt>
                <dd className="text-sm font-medium">{mockProfile.targetDegree}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockProfile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Research Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mockProfile.researchInterests.map((interest) => (
                <Badge key={interest} variant="outline">
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
