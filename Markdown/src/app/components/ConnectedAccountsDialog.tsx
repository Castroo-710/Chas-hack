import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { Check, Link2 } from "lucide-react";

interface ConnectedAccount {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  description: string;
}

interface ConnectedAccountsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectedAccounts: ConnectedAccount[];
  onToggleAccount: (accountId: string) => void;
}

export function ConnectedAccountsDialog({
  open,
  onOpenChange,
  connectedAccounts,
  onToggleAccount,
}: ConnectedAccountsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connected Accounts</DialogTitle>
          <DialogDescription>
            Connect your favorite platforms to sync events and stay organized.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto">
          {connectedAccounts.map((account) => (
            <Card key={account.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl mt-1">{account.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{account.name}</h3>
                      {account.connected && (
                        <Badge variant="secondary" className="gap-1">
                          <Check className="size-3" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant={account.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => onToggleAccount(account.id)}
                  className="gap-2"
                >
                  {account.connected ? (
                    "Disconnect"
                  ) : (
                    <>
                      <Link2 className="size-4" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
