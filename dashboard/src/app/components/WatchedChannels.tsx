import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trash2, Hash } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface WatchedChannel {
  id: number;
  guild_id: string;
  channel_id: string;
  channel_name: string;
}

export function WatchedChannels() {
  const { token } = useAuth();
  const [channels, setChannels] = useState<WatchedChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchChannels();
    }
  }, [token]);

  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/channels', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChannels(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Hash className="size-5" />
          Watched Channels
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading channels...</div>
        ) : channels.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            You are not watching any channels. Go to Discord and use <code>/watch</code> in a channel.
          </div>
        ) : (
          <div className="space-y-2">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                <div className="flex flex-col">
                  <span className="font-medium flex items-center gap-1">
                    <Hash className="size-3 text-muted-foreground" />
                    {channel.channel_name}
                  </span>
                  <span className="text-xs text-muted-foreground">Server: {channel.guild_id}</span>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
