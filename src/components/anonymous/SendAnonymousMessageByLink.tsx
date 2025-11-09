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
    <>
      <div className="min-h-screen p-4 sm:p-6" style={{ background: 'var(--gradient-hero)' }}>
        <div className="flex items-center justify-center min-h-full">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Koppa<span className="text-yellow-300">Whisper</span>
              </h1>
              <p className="text-sm text-white/80">Anonymous messaging platform</p>
            </div>
            
            <div className="text-center mb-6 px-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white break-words">
                {linkData.link_name}
              </h2>
              {linkData.description && (
                <p className="text-sm text-white/70 mt-2 break-words">
                  {linkData.description}
                </p>
              )}
            </div>

            <Card className="shadow-lg border-0" style={{
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
                  Send your anonymous message below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Type your anonymous message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[140px] resize-none border-2 focus:border-primary/50 transition-colors"
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${remainingChars < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
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
    </>
  );
};