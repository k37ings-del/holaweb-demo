import { Globe } from "lucide-react";

const Website = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Website Builder</h1>
      <p className="font-body text-sm text-muted-foreground">Build your online presence.</p>
    </div>
    <div className="text-center py-16 bg-card border border-border rounded-lg">
      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-heading text-lg font-bold text-foreground mb-2">Coming Soon</h3>
      <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
        Create landing pages, online stores, and booking pages — all from your dashboard.
      </p>
    </div>
  </div>
);

export default Website;
