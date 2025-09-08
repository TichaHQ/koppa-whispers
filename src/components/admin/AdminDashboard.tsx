import { useState } from 'react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAnalytics, TimeFrame, AnalyticsFilters } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, BarChart3, Shield, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const { data, loading, error } = useAnalytics(timeFrame, filters);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center p-6 space-y-4">
            <Shield className="h-16 w-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateFilter = (key: keyof AnalyticsFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitor your webapp's performance, user engagement, and growth metrics
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Filters & Settings</CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Time Frame */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Time Frame</label>
                <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Batch Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Batch</label>
                <Select value={filters.batch || 'all'} onValueChange={(value) => updateFilter('batch', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Batches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    {data?.uniqueBatches.map(batch => (
                      <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stream Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Stream</label>
                <Select value={filters.stream || 'all'} onValueChange={(value) => updateFilter('stream', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Streams" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Streams</SelectItem>
                    {data?.uniqueStreams.map(stream => (
                      <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">State</label>
                <Select value={filters.state || 'all'} onValueChange={(value) => updateFilter('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {data?.uniqueStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Year</label>
                <Select value={filters.year?.toString() || 'all'} onValueChange={(value) => updateFilter('year', value === 'all' ? undefined : parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {data?.uniqueYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.batch && (
                  <Badge variant="secondary">
                    Batch: {filters.batch}
                  </Badge>
                )}
                {filters.stream && (
                  <Badge variant="secondary">
                    Stream: {filters.stream}
                  </Badge>
                )}
                {filters.state && (
                  <Badge variant="secondary">
                    State: {filters.state}
                  </Badge>
                )}
                {filters.year && (
                  <Badge variant="secondary">
                    Year: {filters.year}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <p className="text-destructive">Error loading analytics: {error}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Users */}
              <Card className="bg-gradient-card border-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{data?.totalUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              {/* Active Users */}
              <Card className="bg-gradient-card border-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{data?.activeUsers || 0}</div>
                  <p className="text-xs text-muted-foreground">Online in last 5 minutes</p>
                </CardContent>
              </Card>

              {/* Visitor Trend */}
              <Card className="bg-gradient-card border-primary/10 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Visitor Trend</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {data?.visitors.reduce((sum, v) => sum + v.count, 0) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Total {timeFrame} visits</p>
                </CardContent>
              </Card>
            </div>

            {/* Visitor Chart */}
            <Card className="bg-gradient-card border-primary/10">
              <CardHeader>
                <CardTitle className="text-foreground">Visitor Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} visitor trends
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.visitors || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(value) => {
                          if (timeFrame === 'yearly') return value;
                          if (timeFrame === 'monthly') return value.split('-')[1] + '/' + value.split('-')[0];
                          return new Date(value).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          });
                        }}
                      />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px'
                        }}
                        labelFormatter={(value) => {
                          if (timeFrame === 'yearly') return `Year ${value}`;
                          if (timeFrame === 'monthly') return new Date(value + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                          return new Date(value).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          });
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};