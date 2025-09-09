import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Settings, Users } from 'lucide-react';

export const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={isActive('/admin') ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
          >
            Back to App
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground mt-2">
        Direct link: <code className="bg-muted px-2 py-1 rounded text-sm">{window.location.origin}/admin</code>
      </p>
    </Card>
  );
};