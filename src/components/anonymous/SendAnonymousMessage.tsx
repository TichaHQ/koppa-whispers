import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SendAnonymousMessageProps {
  recipientUsername: string;
  recipientUserId: string;
}

export const SendAnonymousMessage = ({ recipientUsername, recipientUserId }: SendAnonymousMessageProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (message.length > 256) {
      toast({
        title: "Error",
        description: "Message must be 256 characters or less",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from('anonymous_messages')
        .insert({
          recipient_user_id: recipientUserId,
          message: message.trim(),
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Message sent!",
        description: `Your anonymous message has been sent to ${recipientUsername}`,
      });

      setMessage("");
      setShowSignupPrompt(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/auth');
  };

  const remainingChars = 256 - message.length;

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6" style={{ background: 'var(--gradient-hero)' }}>
        <div className="flex items-center justify-center min-h-full">
          <Card className="max-w-md w-full shadow-lg border-0" style={{ 
            background: 'var(--gradient-card)',
            boxShadow: 'var(--shadow-medium)'
          }}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                Send Anonymous Message
              </CardTitle>
              <CardDescription className="text-base">
                Send an anonymous message to <span className="font-semibold text-primary">{recipientUsername}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your anonymous message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none border-2 focus:border-primary/50 transition-colors"
                  maxLength={256}
                />
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${remainingChars < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {remainingChars} characters remaining
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                disabled={sending || !message.trim()}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-[1.02]"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                {sending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send Anonymous Message"
                )}
              </Button>

              <div className="text-center p-4 bg-accent/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  🤫 Your message will be sent anonymously. The recipient won't know who sent it.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create Your Account
            </DialogTitle>
            <DialogDescription className="text-left">
              Your message has been sent successfully! Want to receive anonymous messages too? 
              Create your account to get your own profile link and start receiving messages from other corpers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowSignupPrompt(false)} className="flex-1">
              Maybe later
            </Button>
            <Button onClick={handleCreateAccount} className="flex-1">
              Create account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};