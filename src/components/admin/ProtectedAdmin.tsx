import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { AdminDashboard } from './AdminDashboard';
import { Card } from '@/components/ui/card';

export const ProtectedAdmin = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [userProfile, setUserProfile] = useState<{ username: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Show loading while checking authentication and profile
  if (adminLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying access...</p>
          </Card>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Redirect if username doesn't match the logged-in user's username
  if (!userProfile || userProfile.username !== username) {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
};