import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RoomCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "" });
  const [createdRoom, setCreatedRoom] = useState<{ id: string; name: string; link: string } | null>(null);
  const { toast } = useToast();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // TODO: Implement room creation with Supabase
    setTimeout(() => {
      const roomId = Math.random().toString(36).substring(7);
      const roomLink = `${window.location.origin}/room/${roomId}`;
      setCreatedRoom({
        id: roomId,
        name: newRoom.name,
        link: roomLink
      });
      setNewRoom({ name: "", description: "" });
      setIsCreating(false);
      toast({
        title: "Room Created!",
        description: "Your anonymous chat room is ready to use.",
      });
    }, 1000);
  };

  const copyLink = () => {
    if (createdRoom) {
      navigator.clipboard.writeText(createdRoom.link);
      toast({
        title: "Link Copied!",
        description: "Room link copied to clipboard.",
      });
    }
  };

  const shareWhatsApp = () => {
    if (createdRoom) {
      const text = `Join my anonymous chat room "${createdRoom.name}" on KoppaWhisper: ${createdRoom.link}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Anonymous Room</h1>
          <p className="text-muted-foreground">Start anonymous conversations with fellow corps members</p>
        </div>

        {!createdRoom ? (
          <Card className="bg-gradient-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                New Chat Room
              </CardTitle>
              <CardDescription>
                Create a room for anonymous discussions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    placeholder="e.g., Camp Crush, Ibadan SE Education CDS"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roomDescription">Room Description</Label>
                  <Textarea
                    id="roomDescription"
                    placeholder="Brief description of what this room is for..."
                    value={newRoom.description}
                    onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isCreating}
                  variant="hero"
                >
                  {isCreating ? "Creating Room..." : "Create Room"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-card border-0 shadow-glow">
            <CardHeader>
              <CardTitle className="text-primary">🎉 Room Created Successfully!</CardTitle>
              <CardDescription>
                Share this link to let others join your anonymous room
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <h3 className="font-semibold text-accent-foreground mb-2">{createdRoom.name}</h3>
                <p className="text-sm text-muted-foreground break-all">{createdRoom.link}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={copyLink} variant="social" className="flex-1">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button onClick={shareWhatsApp} variant="social" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on WhatsApp
                </Button>
              </div>
              
              <Button 
                onClick={() => setCreatedRoom(null)} 
                variant="outline" 
                className="w-full"
              >
                Create Another Room
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};