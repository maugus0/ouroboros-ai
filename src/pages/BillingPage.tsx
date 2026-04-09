import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Billing</h2>
            <Badge variant="secondary" className="text-xs">
              <Clock className="mr-1 h-3 w-3" />
              Coming Soon
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your subscription and payment methods.
          </p>
        </div>

        <Card className="border-dashed">
          <CardContent className="py-8 text-center sm:py-12">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Billing is not yet available</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              OuroborosAI is currently free during early access. Subscription plans and payment
              management will appear here once billing is integrated with the backend.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
