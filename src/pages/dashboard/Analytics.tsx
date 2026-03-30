import { BarChart3 } from "lucide-react";

const Analytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>
      <p className="font-body text-sm text-muted-foreground">Track your business performance.</p>
    </div>
    <div className="text-center py-16 bg-card border border-border rounded-lg">
      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-heading text-lg font-bold text-foreground mb-2">Coming Soon</h3>
      <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
        Revenue, orders, customer growth, and performance insights — all in real-time.
      </p>
    </div>
  </div>
);

export default Analytics;
