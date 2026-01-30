import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Activity, Clock } from "lucide-react";

interface ActivityItem {
  id: number;
  title: string;
  owner_name: string | null;
  created_at: string;
}

export function ActivityMonitoring() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 10000); // Polling every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/activity');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="size-4 text-emerald-500" />
          Real-time Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-xs text-muted-foreground italic text-center py-4">
              No recent activity detected.
            </div>
          ) : (
            activities.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs border-l-2 border-primary/20 pl-3 py-1">
                <div className="flex-1">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-muted-foreground">
                    Synced for <span className="text-foreground">{item.owner_name || 'Anonymous'}</span>
                  </p>
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                  <Clock className="size-3" />
                  {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
