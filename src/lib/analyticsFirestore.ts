// Real analytics data fetcher from Firestore
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import {
  AnalyticsOverview,
  DailyTraffic,
  TopPage,
  TrafficSource,
  DeviceStat,
  BrowserStat
} from './analyticsData';

export interface AnalyticsEvent {
  type: 'pageview';
  path: string;
  title: string;
  timestamp: Timestamp;
  sessionId: string;
  referrer: string;
  userAgent: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
}

// Get date N days ago
const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Fetch all analytics events for a date range
export const fetchAnalyticsEvents = async (days: number): Promise<AnalyticsEvent[]> => {
  const startDate = getDateDaysAgo(days);
  const eventsRef = collection(db, 'analytics_events');
  const q = query(
    eventsRef,
    where('timestamp', '>=', Timestamp.fromDate(startDate)),
    orderBy('timestamp', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as AnalyticsEvent);
};

// Fetch analytics overview
export const fetchAnalyticsOverview = async (days: number = 7): Promise<AnalyticsOverview> => {
  const events = await fetchAnalyticsEvents(days);
  const previousEvents = await fetchAnalyticsEvents(days * 2);
  
  // Filter previous period events
  const cutoffDate = getDateDaysAgo(days);
  const previousPeriodEvents = previousEvents.filter(e => 
    e.timestamp.toDate() < cutoffDate
  );
  
  // Current period stats
  const pageViews = events.length;
  const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
  
  // Previous period stats
  const prevPageViews = previousPeriodEvents.length;
  const prevUniqueSessions = new Set(previousPeriodEvents.map(e => e.sessionId)).size;
  
  // Calculate changes
  const pageViewsChange = prevPageViews > 0 
    ? Math.round(((pageViews - prevPageViews) / prevPageViews) * 100) 
    : 0;
  const visitorsChange = prevUniqueSessions > 0 
    ? Math.round(((uniqueSessions - prevUniqueSessions) / prevUniqueSessions) * 100) 
    : 0;
  
  // Calculate session duration (approximate based on events per session)
  const sessionEventCounts: Record<string, number> = {};
  events.forEach(e => {
    sessionEventCounts[e.sessionId] = (sessionEventCounts[e.sessionId] || 0) + 1;
  });
  const avgEventsPerSession = Object.values(sessionEventCounts).reduce((a, b) => a + b, 0) / 
    Math.max(Object.keys(sessionEventCounts).length, 1);
  const avgSessionDuration = Math.round(avgEventsPerSession * 45); // Estimate 45 sec per page
  
  // Calculate bounce rate (sessions with only 1 page view)
  const singlePageSessions = Object.values(sessionEventCounts).filter(c => c === 1).length;
  const bounceRate = Object.keys(sessionEventCounts).length > 0
    ? Math.round((singlePageSessions / Object.keys(sessionEventCounts).length) * 100)
    : 0;
  
  // Top page
  const pageCounts: Record<string, number> = {};
  events.forEach(e => {
    pageCounts[e.path] = (pageCounts[e.path] || 0) + 1;
  });
  const topPagePath = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0] || ['/', 0];
  
  return {
    pageViews,
    pageViewsChange,
    uniqueVisitors: uniqueSessions,
    visitorsChange,
    avgSessionDuration,
    sessionChange: 0, // Would need more data to calculate
    bounceRate,
    bounceRateChange: 0, // Would need more data to calculate
    liveVisitors: await getLiveVisitorCount(),
    topPage: {
      path: topPagePath[0],
      views: topPagePath[1]
    }
  };
};

// Fetch daily traffic data
export const fetchDailyTraffic = async (days: number): Promise<DailyTraffic[]> => {
  const events = await fetchAnalyticsEvents(days);
  
  // Group by date
  const dailyData: Record<string, { pageViews: number; sessions: Set<string> }> = {};
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyData[dateKey] = { pageViews: 0, sessions: new Set() };
  }
  
  events.forEach(event => {
    const dateKey = event.timestamp.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dailyData[dateKey]) {
      dailyData[dateKey].pageViews++;
      dailyData[dateKey].sessions.add(event.sessionId);
    }
  });
  
  return Object.entries(dailyData).map(([date, data]) => ({
    date,
    pageViews: data.pageViews,
    visitors: data.sessions.size
  }));
};

// Fetch top pages
export const fetchTopPages = async (days: number = 7): Promise<TopPage[]> => {
  const events = await fetchAnalyticsEvents(days);
  
  const pageData: Record<string, { 
    title: string;
    views: number; 
    sessions: Set<string>;
    eventCount: number;
  }> = {};
  
  events.forEach(event => {
    if (!pageData[event.path]) {
      pageData[event.path] = { 
        title: event.title || event.path,
        views: 0, 
        sessions: new Set(),
        eventCount: 0
      };
    }
    pageData[event.path].views++;
    pageData[event.path].sessions.add(event.sessionId);
    pageData[event.path].eventCount++;
  });
  
  return Object.entries(pageData)
    .map(([path, data]) => ({
      path,
      title: data.title,
      views: data.views,
      uniqueVisitors: data.sessions.size,
      avgTimeOnPage: Math.round((data.eventCount / data.views) * 60), // Estimate
      bounceRate: Math.round((data.sessions.size === 1 ? 100 : 50)) // Simplified
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
};

// Fetch traffic sources
export const fetchTrafficSources = async (days: number = 7): Promise<TrafficSource[]> => {
  const events = await fetchAnalyticsEvents(days);
  
  const sourceData: Record<string, number> = {};
  const sourceColors: Record<string, string> = {
    'Direct': 'hsl(var(--primary))',
    'Google': 'hsl(var(--chart-2))',
    'Facebook': 'hsl(var(--chart-3))',
    'Twitter': 'hsl(var(--chart-4))',
    'LinkedIn': 'hsl(var(--chart-5))',
    'Other': 'hsl(var(--muted-foreground))'
  };
  
  events.forEach(event => {
    let source = 'Direct';
    if (event.referrer) {
      if (event.referrer.includes('google')) source = 'Google';
      else if (event.referrer.includes('facebook')) source = 'Facebook';
      else if (event.referrer.includes('twitter') || event.referrer.includes('t.co')) source = 'Twitter';
      else if (event.referrer.includes('linkedin')) source = 'LinkedIn';
      else if (event.referrer) source = 'Other';
    }
    sourceData[source] = (sourceData[source] || 0) + 1;
  });
  
  const total = Object.values(sourceData).reduce((a, b) => a + b, 0) || 1;
  
  return Object.entries(sourceData)
    .map(([source, visitors]) => ({
      source,
      visitors,
      percentage: Math.round((visitors / total) * 100),
      color: sourceColors[source] || 'hsl(var(--muted-foreground))'
    }))
    .sort((a, b) => b.visitors - a.visitors);
};

// Fetch device stats
export const fetchDeviceStats = async (days: number = 7): Promise<DeviceStat[]> => {
  const events = await fetchAnalyticsEvents(days);
  
  const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
  events.forEach(event => {
    deviceCounts[event.device] = (deviceCounts[event.device] || 0) + 1;
  });
  
  const total = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;
  
  return [
    { device: 'Desktop', percentage: Math.round((deviceCounts.desktop / total) * 100), color: 'hsl(var(--primary))' },
    { device: 'Mobile', percentage: Math.round((deviceCounts.mobile / total) * 100), color: 'hsl(var(--chart-2))' },
    { device: 'Tablet', percentage: Math.round((deviceCounts.tablet / total) * 100), color: 'hsl(var(--chart-3))' }
  ];
};

// Fetch browser stats
export const fetchBrowserStats = async (days: number = 7): Promise<BrowserStat[]> => {
  const events = await fetchAnalyticsEvents(days);
  
  const browserCounts: Record<string, number> = {};
  events.forEach(event => {
    browserCounts[event.browser] = (browserCounts[event.browser] || 0) + 1;
  });
  
  const total = Object.values(browserCounts).reduce((a, b) => a + b, 0) || 1;
  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  
  return Object.entries(browserCounts)
    .map(([browser, count], index) => ({
      browser,
      percentage: Math.round((count / total) * 100),
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
};

// Get live visitor count (sessions active in last 5 minutes)
export const getLiveVisitorCount = async (): Promise<number> => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const eventsRef = collection(db, 'analytics_events');
  const q = query(
    eventsRef,
    where('timestamp', '>=', Timestamp.fromDate(fiveMinutesAgo))
  );
  
  const snapshot = await getDocs(q);
  const uniqueSessions = new Set(snapshot.docs.map(doc => doc.data().sessionId));
  return uniqueSessions.size;
};
