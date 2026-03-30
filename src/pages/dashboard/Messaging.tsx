import { MessageSquare } from "lucide-react";

const Messaging = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Messaging</h1>
      <p className="font-body text-sm text-muted-foreground">Communicate with your customers.</p>
    </div>
    <div className="text-center py-16 bg-card border border-border rounded-lg">
      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-heading text-lg font-bold text-foreground mb-2">Coming Soon</h3>
      <p className="font-body text-sm text-muted-foreground max-w-sm mx-auto">
        WhatsApp, email, and SMS messaging will be available here. Send invoices, share products, and automate notifications.
      </p>
    </div>
  </div>
);

export default Messaging;
