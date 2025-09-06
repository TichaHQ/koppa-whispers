import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AnonymousLink {
  id: string;
  link_name: string;
  description: string | null;
  user_id: string;
}

export const SendAnonymousMessageByLink = () => {
  const { slug } = useParams<{ slug: string }>();
  const [linkData, setLinkData] = useState<AnonymousLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      fetchLinkData();
    }
  }, [slug]);

  const fetchLinkData = async () => {
    try {
      const { data, error } = await supabase
        .from('anonymous_links')
        .select('*')
        .eq('link_slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Link not found",
          description: "This anonymous message link doesn't exist or has been deactivated.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setLinkData(data);
    } catch (error) {
      console.error('Error fetching link data:', error);
      toast({
        title: "Error",
        description: "Failed to load the message link",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    if (message.length > 500) {
      toast({
        title: "Error",
        description: "Message must be 500 characters or less",
        variant: "destructive",
      });
      return;
    }

    if (!linkData) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('anonymous_messages')
        .insert({
          recipient_user_id: linkData.user_id,
          message: message.trim(),
          link_id: linkData.id,
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
        description: `Your anonymous message has been sent!`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!linkData) {
    return null;
  }

  const remainingChars = 500 - message.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Anonymous Message
            </CardTitle>
            <CardDescription>
              Send an anonymous message to <strong>{linkData.link_name}</strong>
              {linkData.description && (
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                  {linkData.description}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Textarea
                placeholder="Type your anonymous message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${remainingChars < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {remainingChars} characters remaining
                </span>
              </div>
            </div>
            
            <Button 
              onClick={handleSendMessage} 
              disabled={sending || !message.trim()}
              className="w-full"
            >
              {sending ? "Sending..." : "Send Anonymous Message"}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Your message will be sent anonymously. The recipient won't know who sent it.
              </p>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showSignupPrompt} onOpenChange={setShowSignupPrompt}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Your Account
              </DialogTitle>
              <DialogDescription className="text-left">
                Your message has been sent successfully! Want to receive anonymous messages too? 
                Create your account to get your own profile link and start receiving messages from others.
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
      </div>
    </div>
  );
};