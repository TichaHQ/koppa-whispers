import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MessageModal } from "@/components/ui/message-modal";

interface AnonymousMessage {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface AnonymousLink {
  id: string;
  link_name: string;
  link_slug: string;
  description: string | null;
}

export const LinkMessages = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<AnonymousMessage[]>([]);
  const [link, setLink] = useState<AnonymousLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<AnonymousMessage | null>(null);

  useEffect(() => {
    if (user && linkId) {
      fetchLinkAndMessages();
    }
  }, [user, linkId]);

  const fetchLinkAndMessages = async () => {
    try {
      // Fetch link details first
      const { data: linkData, error: linkError } = await supabase
        .from('anonymous_links')
        .select('*')
        .eq('id', linkId)
        .eq('user_id', user?.id)
        .single();

      if (linkError) {
        console.error('Error fetching link:', linkError);
        toast({
          title: "Error",
          description: "Failed to load link details",
          variant: "destructive",
        });
        navigate('/profile');
        return;
      }

      setLink(linkData);

      // Fetch messages for this link
      const { data: messagesData, error: messagesError } = await supabase
        .from('anonymous_messages')
        .select('*')
        .eq('recipient_user_id', user?.id)
        .eq('link_id', linkId)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-2 sm:p-4">
      <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/profile')}
            className="border-primary/20 text-primary hover:bg-primary/10 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        {/* Link Info Card */}
        {link && (
          <Card className="bg-gradient-card border-0 shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {link.link_name}
              </CardTitle>
              {link.description && (
                <CardDescription>{link.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-xs sm:text-sm text-muted-foreground break-all">
                <strong>Link:</strong> {window.location.origin}/message/{link.link_slug}
              </div>
              <div className="mt-2">
                <Badge variant="secondary">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        <div className="space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <Card className="bg-gradient-card border-0 shadow-glow">
              <CardContent className="py-6 sm:py-8 text-center px-4">
                <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm sm:text-base">No messages received for this link yet.</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Share your link to start receiving anonymous messages!
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card 
                key={message.id} 
                className="bg-gradient-card border-0 shadow-glow cursor-pointer hover:shadow-elegant transition-all"
                onClick={() => setSelectedMessage(message)}
              >
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed break-words line-clamp-3">
                    {message.message}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()} • {new Date(message.created_at).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {selectedMessage && (
        <MessageModal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          message={selectedMessage}
          title={link?.link_name || "Anonymous Message"}
        />
      )}
    </div>
  );
};