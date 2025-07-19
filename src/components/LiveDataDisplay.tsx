import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

interface LiveDataDisplayProps {
  onDataUpdate: () => void;
  lastUpdated: string;
  autoRefresh?: boolean;
}

export function LiveDataDisplay({
  onDataUpdate,
  lastUpdated,
  autoRefresh = true,
}: LiveDataDisplayProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  // Convert last updated to a time ago string
  useEffect(() => {
    const updateTimeAgo = () => {
      const last = new Date(lastUpdated).getTime();
      const now = Date.now();
      const diffSeconds = Math.floor((now - last) / 1000);

      if (diffSeconds < 60) {
        setTimeAgo(`${diffSeconds}s ago`);
      } else if (diffSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffSeconds / 60)}m ago`);
      } else {
        setTimeAgo(`${Math.floor(diffSeconds / 3600)}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Auto refresh data
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onDataUpdate(); // trigger parent update
    setRefreshing(false);
  };

  return (
    <div className="flex items-center justify-between rounded-md border bg-card p-4">
      <div className="text-sm text-muted-foreground">
        Last Updated:{" "}
        <span className="font-medium text-foreground">{timeAgo}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={refreshing}
        className="gap-1"
      >
        <RefreshCw className="w-4 h-4 animate-spin" style={{ animationPlayState: refreshing ? "running" : "paused" }} />
        Refresh
      </Button>
    </div>
  );
}
