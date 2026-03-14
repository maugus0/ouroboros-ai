import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ApplicationStatus = "applied" | "in_progress" | "not_started" | "accepted" | "rejected";

interface Application {
  id: string;
  program: string;
  university: string;
  status: ApplicationStatus;
  match: number;
  deadline: string;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  applied: { label: "Applied", variant: "default" },
  in_progress: { label: "In Progress", variant: "secondary" },
  not_started: { label: "Not Started", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const mockApplications: Application[] = [
  {
    id: "1",
    program: "MS Computer Science",
    university: "NUS",
    status: "applied",
    match: 92,
    deadline: "Jan 15, 2027",
  },
  {
    id: "2",
    program: "MS Data Science",
    university: "NTU",
    status: "in_progress",
    match: 87,
    deadline: "Mar 1, 2027",
  },
  {
    id: "3",
    program: "MS Artificial Intelligence",
    university: "MIT",
    status: "not_started",
    match: 78,
    deadline: "Dec 15, 2026",
  },
  {
    id: "4",
    program: "MSc Machine Learning",
    university: "UCL",
    status: "in_progress",
    match: 84,
    deadline: "Feb 28, 2027",
  },
  {
    id: "5",
    program: "MS Computer Engineering",
    university: "Stanford",
    status: "not_started",
    match: 75,
    deadline: "Dec 1, 2026",
  },
];

export default function ApplicationsPage() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Applications</h2>
          <p className="text-sm text-muted-foreground">Track your graduate program applications.</p>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Match</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApplications.map((app) => {
                const status = statusConfig[app.status];
                return (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.program}</TableCell>
                    <TableCell>{app.university}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{app.match}%</TableCell>
                    <TableCell>{app.deadline}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Update status</DropdownMenuItem>
                          <DropdownMenuItem>Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
