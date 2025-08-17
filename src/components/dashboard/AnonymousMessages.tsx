import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Clock, Share2, Copy, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AnonymousMessage {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface AnonymousMessagesProps {
  onBack: () => void;
}

export const AnonymousMessages = ({ onBack }: AnonymousMessagesProps) => {
  const [messages, setMessages] = useState<AnonymousMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('anonymous_messages')
        .select('*')
        .eq('recipient_user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('anonymous_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (!error) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${profile?.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied!",
      description: "Your profile link has been copied to clipboard. Share it to receive anonymous messages!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Anonymous Messages</h2>
        <p className="text-muted-foreground">Messages sent to you anonymously by other users</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-3">No anonymous messages yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start receiving anonymous messages by sharing your profile link with friends, classmates, or on social media!
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleShareProfile}
                className="w-full max-w-xs"
                variant="default"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share My Profile Link
              </Button>
              <p className="text-xs text-muted-foreground">
                People can send you anonymous messages when they visit your profile
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Anonymous message</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground whitespace-pre-wrap mb-3">{message.message}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Always show share button at bottom */}
      <div className="pt-6 border-t">
        <div className="text-center">
          <Button 
            onClick={handleShareProfile}
            variant="outline"
            className="max-w-xs"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Your Anonymous Link
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Get more anonymous messages by sharing your profile
          </p>
        </div>
      </div>
    </div>
  );
};