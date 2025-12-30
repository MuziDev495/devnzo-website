import React, { useState, useEffect } from 'react';
import { Eye, Users, Clock, TrendingDown, Activity, FileText } from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import TrafficChart from './TrafficChart';
import TopPagesTable from './TopPagesTable';
import TrafficSourcesChart from './TrafficSourcesChart';
import DeviceStatsCard from './DeviceStatsCard';
import { 
  formatDuration,
  formatNumber,
  AnalyticsOverview,
  DailyTraffic,
  TopPage,
  TrafficSource,
  DeviceStat,
  BrowserStat
} from '@/lib/analyticsData';
import {
  fetchAnalyticsOverview,
  fetchDailyTraffic,
  fetchTopPages,
  fetchTrafficSources,
  fetchDeviceStats,
  fetchBrowserStats,
  fetchLiveVisitors
} from '@/lib/analyticsFirestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('7');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trafficData, setTrafficData] = useState<DailyTraffic[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [devices, setDevices] = useState<DeviceStat[]>([]);
  const [browsers, setBrowsers] = useState<BrowserStat[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const days = parseInt(dateRange);
        
        const [
          overviewData,
          traffic,
          pages,
          sources,
          deviceStats,
          browserStats
        ] = await Promise.all([
          fetchAnalyticsOverview(days),
          fetchDailyTraffic(days),
          fetchTopPages(days),
          fetchTrafficSources(days),
          fetchDeviceStats(days),
          fetchBrowserStats(days)
        ]);

        setOverview(overviewData);
        setTrafficData(traffic);
        setTopPages(pages);
        setTrafficSources(sources);
        setDevices(deviceStats);
        setBrowsers(browserStats);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dateRange]);

  // Update live visitors periodically
  useEffect(() => {
    const updateLiveVisitors = async () => {
      try {
        const liveCount = await fetchLiveVisitors();
        setOverview(prev => prev ? { ...prev, liveVisitors: liveCount } : null);
      } catch (error) {
        console.error('Error fetching live visitors:', error);
      }
    };

    const interval = setInterval(updateLiveVisitors, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[350px] w-full rounded-lg" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!overview) return null;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Website Analytics</h2>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AnalyticsCard
          title="Page Views"
          value={formatNumber(overview.pageViews)}
          change={overview.pageViewsChange}
          icon={Eye}
          iconColor="text-primary"
        />
        <AnalyticsCard
          title="Unique Visitors"
          value={formatNumber(overview.uniqueVisitors)}
          change={overview.visitorsChange}
          icon={Users}
          iconColor="text-chart-2"
        />
        <AnalyticsCard
          title="Avg. Session"
          value={formatDuration(overview.avgSessionDuration)}
          change={overview.sessionChange}
          icon={Clock}
          iconColor="text-chart-3"
        />
        <AnalyticsCard
          title="Bounce Rate"
          value={`${overview.bounceRate}%`}
          change={overview.bounceRateChange}
          icon={TrendingDown}
          iconColor="text-chart-4"
        />
        <AnalyticsCard
          title="Live Visitors"
          value={overview.liveVisitors}
          icon={Activity}
          iconColor="text-green-500"
          isLive
        />
        <AnalyticsCard
          title="Top Page"
          value={overview.topPage.path}
          icon={FileText}
          iconColor="text-chart-5"
          subtitle={`${formatNumber(overview.topPage.views)} views`}
        />
      </div>

      {/* Traffic Chart */}
      <TrafficChart 
        data={trafficData} 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange} 
      />

      {/* Bottom Section: Top Pages & Traffic Sources */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopPagesTable pages={topPages} />
        </div>
        <div className="space-y-4">
          <TrafficSourcesChart sources={trafficSources} />
        </div>
      </div>

      {/* Device & Browser Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DeviceStatsCard devices={devices} browsers={browsers} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;