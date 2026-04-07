import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Crown, AlertTriangle } from "lucide-react";

const SubscriptionBubble = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [planName, setPlanName] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

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

      if (data && data.length > 0) {
        const sub = data[0];
        setSubscription(sub);
        setPlanName((sub as any).subscription_plans?.name || "Plan");

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
  }, []);

  if (!subscription) return null;

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
