import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useState } from "react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, password: string) => void;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to Events Dashboard</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your personalized events dashboard.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button type="button" variant="outline" className="w-full">
              Create Account
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}