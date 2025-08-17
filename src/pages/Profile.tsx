import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, MessageSquare, Facebook, Instagram, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SendAnonymousMessage } from "@/components/anonymous/SendAnonymousMessage";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  "Federal Capital Territory (Abuja)"
];

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [publicProfile, setPublicProfile] = useState<any>(null);
  const [loadingPublicProfile, setLoadingPublicProfile] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [formData, setFormData] = useState({
    batch: '',
    stream: '',
    year_of_deployment: '',
    state_of_deployment: '',
    email: ''
  });

  const isOwnProfile = !username || (profile?.username === username);
  const displayProfile = isOwnProfile ? profile : publicProfile;

  useEffect(() => {
    // If loading is done and no user, but we have a username (public profile view), allow it
    if (!loading && !user && !username) {
      navigate('/auth');
      return;
    }

    if (profile && isOwnProfile) {
      setFormData({
        batch: profile.batch || '',
        stream: profile.stream || '',
        year_of_deployment: profile.year_of_deployment?.toString() || '',
        state_of_deployment: profile.state_of_deployment || '',
        email: profile.email || ''
      });
    }

    // If viewing someone else's profile, fetch their public data
    if (username && !isOwnProfile) {
      fetchPublicProfile(username);
    }
  }, [user, profile, loading, navigate, username, isOwnProfile]);

  const fetchPublicProfile = async (targetUsername: string) => {
    setLoadingPublicProfile(true);
    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .eq('username', targetUsername)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Profile not found",
            description: "The user profile you're looking for doesn't exist.",
            variant: "destructive"
          });
          navigate('/');
        } else {
          console.error('Error fetching public profile:', error);
        }
        return;
      }
      
      setPublicProfile(data);
    } catch (error) {
      console.error('Error fetching public profile:', error);
    } finally {
      setLoadingPublicProfile(false);
    }
  };

  const handleSave = async () => {
    try {
      const updates = {
        ...formData,
        year_of_deployment: formData.year_of_deployment ? parseInt(formData.year_of_deployment) : null
      };

      console.log('Saving profile updates:', updates);
      const { error } = await updateProfile(updates);
      
      if (!error) {
        setIsEditing(false);
        toast({
          title: "Profile updated!",
          description: "Your profile changes have been saved successfully.",
        });
      } else {
        console.error('Profile update error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to save your profile changes. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = (platform: string) => {
    const profileUrl = `${window.location.origin}/profile/${displayProfile?.username}`;
    const shareText = `Hey fellow koppas! 🚀 I'm on KoppaWhisper - the anonymous messaging platform for our NYSC community. Want to tell me something anonymously? Drop your thoughts, confessions, or just say hi! 💬✨ ${profileUrl}`;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(profileUrl);
        toast({
          title: "Link copied!",
          description: "Profile link has been copied to clipboard.",
        });
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}&quote=${encodeURIComponent("Hey fellow koppas! 🚀 I'm on KoppaWhisper - send me anonymous messages and let's connect!")}`, '_blank');
        break;
      case 'instagram':
        toast({
          title: "Instagram sharing",
          description: "Copy the link and share it in your Instagram story or bio!",
        });
        navigator.clipboard.writeText(profileUrl);
        break;
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || loadingPublicProfile) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If viewing someone else's profile and not authenticated, show anonymous message form
  if (!user && username && publicProfile) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              ← Back to Home
            </Button>
          </div>
          
          <div className="text-center text-white mb-6">
            <h1 className="text-2xl font-bold mb-2">@{publicProfile.username}'s Profile</h1>
            <p className="text-white/80">Send them an anonymous message!</p>
          </div>
          
          <SendAnonymousMessage 
            recipientUsername={publicProfile.username}
            recipientUserId={publicProfile.user_id}
          />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show dashboard for authenticated users on their own profile
  if (isOwnProfile && showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-hero p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowDashboard(false)}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              ← Back to Profile
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Card className="bg-gradient-card border-0 shadow-glow">
            <CardContent className="p-6">
              <Dashboard />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="border-primary/20 text-primary hover:bg-primary/10"
          >
            ← Back to Home
          </Button>
          
          {isOwnProfile && (
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="bg-gradient-card border-0 shadow-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              @{displayProfile?.username || 'Loading...'}
            </CardTitle>
            <CardDescription>
              {isOwnProfile ? 'Your KoppaWhisper Profile' : 'KoppaWhisper Profile'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Info */}
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch</Label>
                  {isEditing && isOwnProfile ? (
                    <Select 
                      value={formData.batch} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, batch: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Batch A</SelectItem>
                        <SelectItem value="B">Batch B</SelectItem>
                        <SelectItem value="C">Batch C</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-muted rounded-md">
                      {displayProfile?.batch ? `Batch ${displayProfile.batch}` : 'Not set'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Stream</Label>
                  {isEditing && isOwnProfile ? (
                    <Select 
                      value={formData.stream} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Stream 1</SelectItem>
                        <SelectItem value="2">Stream 2</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-muted rounded-md">
                      {displayProfile?.stream ? `Stream ${displayProfile.stream}` : 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Year of Deployment</Label>
                {isEditing && isOwnProfile ? (
                  <Select 
                    value={formData.year_of_deployment} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, year_of_deployment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    {displayProfile?.year_of_deployment || 'Not set'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>State of Deployment</Label>
                {isEditing && isOwnProfile ? (
                  <Select 
                    value={formData.state_of_deployment} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, state_of_deployment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianStates.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    {displayProfile?.state_of_deployment || 'Not set'}
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <div className="space-y-2">
                  <Label>Email (Optional - for password reset)</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="p-2 bg-muted rounded-md">
                      {profile?.email || 'Not set'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isOwnProfile && (
                <div className="space-y-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="flex-1">
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        onClick={() => setShowDashboard(true)} 
                        className="w-full"
                        variant="hero"
                      >
                        View Dashboard
                      </Button>
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        variant="outline"
                        className="w-full"
                      >
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Anonymous message option for viewing other profiles */}
              {!isOwnProfile && user && publicProfile && (
                <SendAnonymousMessage 
                  recipientUsername={publicProfile.username}
                  recipientUserId={publicProfile.user_id}
                />
              )}

              {/* Share Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Share Profile</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleShare('copy')}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('facebook')}
                    className="flex items-center gap-2"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('instagram')}
                    className="flex items-center gap-2"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}