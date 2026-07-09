import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/use-notifications";
import { webhookEventsService } from "@/services";
import { Bell, X, AlertTriangle, Info, CheckCircle, Zap, ExternalLink, CheckCheck } from "lucide-react";

type Kind = "warning" | "info" | "success" | "event";

interface FeedItem {
  id: string;
  kind: Kind;
  title: string;
  message: string;
  timestamp: Date;
  link?: string | null;
  unread?: boolean;
  onOpen?: () => void;
}

const iconMap: Record<Kind, typeof Bell> = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  event: Zap,
};

const colorMap: Record<Kind, string> = {
  warning: "text-yellow-500",
  info: "text-blue-500",
  success: "text-green-500",
  event: "text-primary",
};

const PAGE_SIZE = 10;

function subscriptionItems(subscription: any): FeedItem[] {
  const items: FeedItem[] = [];
  if (subscription && !Array.isArray(subscription)) {
    const sub = subscription as any;
    const endDate = sub.ends_at || sub.trial_ends_at;
    if (endDate && typeof endDate === "string") {
      const end = new Date(endDate).getTime();
      if (!isNaN(end) && end > 0) {
        const diff = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff <= 0) {
          items.push({
            id: "sub-expired", kind: "warning", timestamp: new Date(),
            title: "Subscription Expired",
            message: `Your ${sub.subscription_plans?.name || "subscription"} has expired.`,
          });
        } else if (diff <= 7) {
          items.push({
            id: "sub-expiring", kind: "warning", timestamp: new Date(),
            title: "Subscription Expiring Soon",
            message: `Expires in ${diff} day${diff === 1 ? "" : "s"}.`,
          });
        }
      }
    }
    if (sub.status === "trial") {
      items.push({
        id: "trial-active", kind: "info", timestamp: new Date(),
        title: "Free Trial Active", message: `You're on a free trial of ${sub.subscription_plans?.name || "your plan"}.`,
      });
    }
  }
  return items;
}

const NotificationsPanel = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data: subscription } = useNotifications();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const eventsQuery = useQuery({
    queryKey: ["webhook-events", page],
    queryFn: () => webhookEventsService.list(PAGE_SIZE * page, 0),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const unreadQuery = useQuery({
    queryKey: ["webhook-events-unread"],
    queryFn: () => webhookEventsService.unreadCount(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  const items = useMemo<FeedItem[]>(() => {
    const list: FeedItem[] = [];
    list.push(...subscriptionItems(subscription));
    for (const e of eventsQuery.data ?? []) {
      list.push({
        id: `evt-${e.id}`,
        kind: "event",
        title: e.title,
        message: e.message ?? "",
        timestamp: new Date(e.created_at),
        link: e.link,
        unread: !e.is_read,
        onOpen: async () => {
          if (!e.is_read) {
            try { await webhookEventsService.markRead(e.id); } catch { /* ignore */ }
            qc.invalidateQueries({ queryKey: ["webhook-events"] });
            qc.invalidateQueries({ queryKey: ["webhook-events-unread"] });
          }
        },
      });
    }
    list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (list.length === 0) {
      list.push({
        id: "all-good", kind: "success", timestamp: new Date(),
        title: "All good!", message: "No new notifications.",
      });
    }
    return list;
  }, [subscription, eventsQuery.data, qc]);

  const unreadCount = unreadQuery.data ?? 0;
  const hasWarning = items.some((n) => n.kind === "warning") || unreadCount > 0;
  const hasMore = (eventsQuery.data?.length ?? 0) >= PAGE_SIZE * page;

  const markAllRead = async () => {
    try {
      await webhookEventsService.markAllRead();
      qc.invalidateQueries({ queryKey: ["webhook-events"] });
      qc.invalidateQueries({ queryKey: ["webhook-events-unread"] });
    } catch { /* ignore */ }
  };

  const handleItemClick = (item: FeedItem, e: React.MouseEvent) => {
    item.onOpen?.();
    if (!item.link) return;
    // Internal dashboard/admin routes → SPA navigation.
    if (item.link.startsWith("/")) {
      e.preventDefault();
      setOpen(false);
      navigate(item.link);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {hasWarning && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 0 ? (unreadCount > 99 ? "99+" : unreadCount) : "!"}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-lg shadow-xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-subheading text-sm font-semibold text-foreground">
                Notifications {unreadCount > 0 && <span className="ml-1 text-primary">({unreadCount})</span>}
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="inline-flex items-center gap-1 text-[11px] font-subheading font-semibold text-primary hover:underline"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[26rem] overflow-y-auto">
              {items.map((n) => {
                const Icon = iconMap[n.kind];
                const body = (
                  <div className="flex items-start gap-3">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${colorMap[n.kind]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-subheading text-xs font-semibold text-foreground truncate">{n.title}</p>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                      </div>
                      {n.message && (
                        <p className="font-body text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      )}
                      <p className="font-body text-[10px] text-muted-foreground/70 mt-1">
                        {n.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {n.link && <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />}
                  </div>
                );
                return n.link ? (
                  <a
                    key={n.id}
                    href={n.link}
                    target={n.link.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={(e) => handleItemClick(n, e)}
                    className={`block px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors ${n.unread ? "bg-primary/5" : ""}`}
                  >
                    {body}
                  </a>
                ) : (
                  <div key={n.id} className="px-4 py-3 border-b border-border/50 last:border-0">
                    {body}
                  </div>
                );
              })}
            </div>
            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="w-full text-center py-2.5 border-t border-border font-subheading text-xs font-semibold text-primary hover:bg-muted/50 transition-colors"
              >
                Load more
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsPanel;
