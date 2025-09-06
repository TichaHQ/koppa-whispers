import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AnonymousLink {
  id: string;
  link_name: string;
  link_slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export const AnonymousLinkManager = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<AnonymousLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user]);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('anonymous_links')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Error",
        description: "Failed to load your anonymous links",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      + '-' + Math.random().toString(36).substring(2, 8);
  };

  const handleCreateLink = async () => {
    if (!newLink.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your link",
        variant: "destructive",
      });
      return;
    }

    try {
      const slug = generateSlug(newLink.name);
      
      const { error } = await supabase
        .from('anonymous_links')
        .insert({
          user_id: user?.id,
          link_name: newLink.name.trim(),
          link_slug: slug,
          description: newLink.description.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Link created!",
        description: "Your new anonymous message link has been created",
      });

      setNewLink({ name: "", description: "" });
      setCreateDialogOpen(false);
      fetchLinks();
    } catch (error) {
      console.error('Error creating link:', error);
      toast({
        title: "Error",
        description: "Failed to create link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyLinkToClipboard = (slug: string) => {
    const url = `${window.location.origin}/message/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The anonymous message link has been copied to your clipboard",
    });
  };

  const toggleLinkStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('anonymous_links')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentStatus ? "Link deactivated" : "Link activated",
        description: `Your link has been ${currentStatus ? 'deactivated' : 'activated'}`,
      });

      fetchLinks();
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Error",
        description: "Failed to update link status",
        variant: "destructive",
      });
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('anonymous_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Link deleted",
        description: "Your anonymous message link has been deleted",
      });

      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading your anonymous links...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Anonymous Message Links</h2>
          <p className="text-muted-foreground">Create custom links for different types of anonymous messages</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Anonymous Message Link</DialogTitle>
              <DialogDescription>
                Create a custom link for receiving anonymous messages about a specific topic
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Link Name</label>
                <Input
                  placeholder="e.g., IBSE Education Group"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (Optional)</label>
                <Textarea
                  placeholder="What kind of messages should people send to this link?"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLink}>
                  Create Link
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {links.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">You haven't created any anonymous message links yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first link to start receiving anonymous messages!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {link.link_name}
                      <Badge variant={link.is_active ? "default" : "secondary"}>
                        {link.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    {link.description && (
                      <CardDescription>{link.description}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyLinkToClipboard(link.link_slug)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/message/${link.link_slug}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLinkStatus(link.id, link.is_active)}
                    >
                      {link.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <strong>Link:</strong> {window.location.origin}/message/{link.link_slug}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};