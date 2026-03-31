import { BarChart3, TrendingUp, Users, CreditCard, Globe, Cloud } from "lucide-react";

const metrics = [
  { icon: TrendingUp, label: "Revenue Tracking", description: "Track daily, weekly, and monthly revenue across all payment channels" },
  { icon: CreditCard, label: "Payment Analytics", description: "Conversion rates, average order value, and payment method breakdown" },
  { icon: Users, label: "Customer Growth", description: "New vs returning customers, acquisition channels, and retention rates" },
  { icon: Globe, label: "Website Performance", description: "Page views, bounce rates, and traffic sources for your online presence" },
];

const Analytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Analytics & Insights</h1>
      <p className="font-body text-sm text-muted-foreground">Data-driven decisions for your business.</p>
    </div>

    {/* AWS Banner */}
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
        <Cloud className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-subheading text-sm font-semibold text-foreground">Powered by Amazon Web Services</p>
        <p className="font-body text-xs text-muted-foreground">Enterprise-grade analytics infrastructure with real-time data processing, dashboards, and reporting.</p>
      </div>
      <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-body text-xs font-medium shrink-0">Coming Soon</span>
    </div>

    {/* Metrics Preview */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-card border border-border rounded-lg p-5 space-y-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <metric.icon className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-subheading text-sm font-semibold text-foreground">{metric.label}</h3>
            <p className="font-body text-xs text-muted-foreground mt-1">{metric.description}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Chart placeholder */}
    <div className="bg-card border border-border rounded-lg p-8 text-center">
      <BarChart3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="font-heading text-lg font-bold text-foreground mb-2">Analytics Dashboard</h3>
      <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
        Revenue charts, customer growth graphs, and performance insights will appear here once your business generates data.
      </p>
    </div>
  </div>
);

export default Analytics;
