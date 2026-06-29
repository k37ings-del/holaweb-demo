import { useState, useEffect } from "react";
import { Crown, AlertTriangle } from "lucide-react";
import { subscriptionService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

const SubscriptionBubble = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const sub = await subscriptionService.getCurrentSubscription(user.id);
      if (sub) {
        setSubscription(sub);

        const endDate = sub.ends_at || sub.trial_ends_at;
        if (endDate) {
          const now = new Date();
          const end = new Date(endDate);
          const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          setDaysLeft(diff);
          setIsExpired(diff <= 0 || sub.status === "expired" || sub.status === "cancelled");
        }
        if (sub.status === "expired" || sub.status === "cancelled") {
          setIsExpired(true);
        }
      }
    };
    load();
  }, [user]);

  if (!subscription) return null;

  const planName = (subscription as any).subscription_plans?.name || "Plan";

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-subheading text-xs font-semibold ${
        isExpired
          ? "bg-destructive/10 text-destructive border border-destructive/20"
          : "bg-green-500/10 text-green-500 border border-green-500/20"
      }`}
    >
      {isExpired ? <AlertTriangle className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
      {planName} {isExpired ? "— Expired" : daysLeft !== null && daysLeft <= 7 ? `— ${daysLeft}d left` : ""}
    </div>
  );
};

export default SubscriptionBubble;
