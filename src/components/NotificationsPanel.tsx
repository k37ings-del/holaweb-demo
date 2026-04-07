import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Bell, X, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  message: string;
  timestamp: Date;
}

const NotificationsPanel = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(name)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const notifs: Notification[] = [];

      if (data && data.length > 0) {
        const sub = data[0];
        const endDate = sub.ends_at || sub.trial_ends_at;
        if (endDate) {
          const now = new Date();
          const end = new Date(endDate);
          const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          if (diff <= 0) {
            notifs.push({
              id: "sub-expired",
              type: "warning",
              title: "Subscription Expired",
              message: `Your ${(sub as any).subscription_plans?.name || "subscription"} has expired. Renew to continue using all features.`,
              timestamp: new Date(),
            });
          } else if (diff <= 7) {
            notifs.push({
              id: "sub-expiring",
              type: "warning",
              title: "Subscription Expiring Soon",
              message: `Your ${(sub as any).subscription_plans?.name || "subscription"} expires in ${diff} day${diff === 1 ? "" : "s"}. Renew now to avoid interruption.`,
              timestamp: new Date(),
            });
          }
        }

        if (sub.status === "trial") {
          notifs.push({
            id: "trial-active",
            type: "info",
            title: "Free Trial Active",
            message: `You're on a free trial of ${(sub as any).subscription_plans?.name || "your plan"}.`,
            timestamp: new Date(),
          });
        }
      }

      if (notifs.length === 0) {
        notifs.push({
          id: "all-good",
          type: "success",
          title: "All good!",
          message: "No new notifications.",
          timestamp: new Date(),
        });
      }

      setNotifications(notifs);
    };
    load();
  }, []);

  const hasWarning = notifications.some((n) => n.type === "warning");

  const iconMap = {
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle,
  };

  const colorMap = {
    warning: "text-yellow-500",
    info: "text-blue-500",
    success: "text-green-500",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5" />
        {hasWarning && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-subheading text-sm font-semibold text-foreground">Notifications</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = iconMap[n.type];
                return (
                  <div key={n.id} className="px-4 py-3 border-b border-border/50 last:border-0">
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorMap[n.type]}`} />
                      <div>
                        <p className="font-subheading text-xs font-semibold text-foreground">{n.title}</p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPanel;
