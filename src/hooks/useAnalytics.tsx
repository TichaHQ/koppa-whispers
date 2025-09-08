import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface AnalyticsFilters {
  batch?: string;
  stream?: string;
  state?: string;
  year?: number;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  visitors: { date: string; count: number }[];
  uniqueBatches: string[];
  uniqueStreams: string[];
  uniqueStates: string[];
  uniqueYears: number[];
}

export const useAnalytics = (timeFrame: TimeFrame = 'daily', filters: AnalyticsFilters = {}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build base query with filters
        let profilesQuery = supabase.from('profiles').select('*');
        
        if (filters.batch) {
          profilesQuery = profilesQuery.eq('batch', filters.batch);
        }
        if (filters.stream) {
          profilesQuery = profilesQuery.eq('stream', filters.stream);
        }
        if (filters.state) {
          profilesQuery = profilesQuery.eq('state_of_deployment', filters.state);
        }
        if (filters.year) {
          profilesQuery = profilesQuery.eq('year_of_deployment', filters.year);
        }

        // Get total users with filters
        const { count: totalUsers, error: totalError } = await profilesQuery;
        if (totalError) throw totalError;

        // Get active users (last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        let sessionsQuery = supabase
          .from('user_sessions')
          .select('user_id')
          .gte('last_seen', fiveMinutesAgo);

        // Apply filters to active users by joining with profiles
        if (Object.keys(filters).length > 0) {
          const { data: filteredProfiles } = await profilesQuery.select('user_id');
          if (filteredProfiles) {
            const userIds = filteredProfiles.map(p => p.user_id);
            sessionsQuery = sessionsQuery.in('user_id', userIds);
          }
        }

        const { count: activeUsers, error: activeError } = await sessionsQuery;
        if (activeError) throw activeError;

        // Get visitor data based on timeframe
        const getDateRange = () => {
          const now = new Date();
          let startDate = new Date();
          
          switch (timeFrame) {
            case 'daily':
              startDate.setDate(now.getDate() - 7);
              break;
            case 'weekly':
              startDate.setDate(now.getDate() - 28);
              break;
            case 'monthly':
              startDate.setMonth(now.getMonth() - 12);
              break;
            case 'yearly':
              startDate.setFullYear(now.getFullYear() - 5);
              break;
          }
          
          return startDate.toISOString();
        };

        const startDate = getDateRange();
        let visitorQuery = supabase
          .from('user_sessions')
          .select('created_at')
          .gte('created_at', startDate)
          .order('created_at', { ascending: true });

        // Apply filters for visitors
        if (Object.keys(filters).length > 0) {
          const { data: filteredProfiles } = await profilesQuery.select('user_id');
          if (filteredProfiles) {
            const userIds = filteredProfiles.map(p => p.user_id);
            visitorQuery = visitorQuery.in('user_id', userIds);
          }
        }

        const { data: visitorSessions, error: visitorError } = await visitorQuery;
        if (visitorError) throw visitorError;

        // Process visitor data based on timeframe
        const visitors = processVisitorData(visitorSessions || [], timeFrame);

        // Get unique filter options
        const { data: allProfiles } = await supabase
          .from('profiles')
          .select('batch, stream, state_of_deployment, year_of_deployment');

        const uniqueBatches = [...new Set(allProfiles?.map(p => p.batch).filter(Boolean))] as string[];
        const uniqueStreams = [...new Set(allProfiles?.map(p => p.stream).filter(Boolean))] as string[];
        const uniqueStates = [...new Set(allProfiles?.map(p => p.state_of_deployment).filter(Boolean))] as string[];
        const uniqueYears = [...new Set(allProfiles?.map(p => p.year_of_deployment).filter(Boolean))] as number[];

        setData({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          visitors,
          uniqueBatches,
          uniqueStreams,
          uniqueStates,
          uniqueYears: uniqueYears.sort((a, b) => b - a),
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeFrame, JSON.stringify(filters)]);

  return { data, loading, error };
};

const processVisitorData = (sessions: { created_at: string }[], timeFrame: TimeFrame) => {
  const visitorMap = new Map<string, number>();

  sessions.forEach(session => {
    const date = new Date(session.created_at);
    let key: string;

    switch (timeFrame) {
      case 'daily':
        key = date.toISOString().split('T')[0];
        break;
      case 'weekly':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = startOfWeek.toISOString().split('T')[0];
        break;
      case 'monthly':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'yearly':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    visitorMap.set(key, (visitorMap.get(key) || 0) + 1);
  });

  return Array.from(visitorMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};