"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MessageCircleQuestion } from "lucide-react";

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast({
        variant: "destructive",
        title: "No Feedback Provided",
        description: "Please enter your feedback before submitting.",
      });
      return;
    }

    // In a real application, you would send this to a server.
    console.log("Feedback Submitted:", feedback);

    toast({
      title: "Feedback Submitted!",
      description: "Thank you for helping us improve.",
    });
    setFeedback("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
            <MessageCircleQuestion className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
            <DialogDescription>
              We'd love to hear your thoughts on what's working and what could be better.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="feedback-textarea">Your Feedback</Label>
              <Textarea
                id="feedback-textarea"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us how we can improve..."
                className="h-32"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Feedback</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
