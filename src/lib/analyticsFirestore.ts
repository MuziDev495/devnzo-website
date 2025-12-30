import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  AnalyticsOverview, 
  DailyTraffic, 
  TopPage, 
  TrafficSource, 
  DeviceStat, 
  BrowserStat 
} from './analyticsData';

const ANALYTICS_COLLECTION = 'analytics_events';

// Get timestamp for N days ago
const getDaysAgoTimestamp = (days: number): Timestamp => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(date);
};

// Analytics event type
interface AnalyticsEvent {
  id: string;
  type: string;
  path: string;
  title: string;
  timestamp: Timestamp;
  sessionId: string;
  referrer: string;
  device: string;
  browser: string;
}

// Fetch all analytics events for a given period
const fetchEventsForPeriod = async (days: number): Promise<AnalyticsEvent[]> => {
  const startTimestamp = getDaysAgoTimestamp(days);
  
  const q = query(
    collection(db, ANALYTICS_COLLECTION),
    where('type', '==', 'pageview'),
    where('timestamp', '>=', startTimestamp),
    orderBy('timestamp', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as AnalyticsEvent));
};

// Fetch analytics overview
export const fetchAnalyticsOverview = async (days: number): Promise<AnalyticsOverview> => {
  const events = await fetchEventsForPeriod(days);
  const previousEvents = await fetchEventsForPeriod(days * 2);
  
  // Filter previous period events (between days*2 and days ago)
  const startOfCurrentPeriod = getDaysAgoTimestamp(days).toMillis();
  const previousPeriodEvents = previousEvents.filter(
    e => e.timestamp.toMillis() < startOfCurrentPeriod
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

  // Group by path to find top page
  const pathCounts: Record<string, number> = {};
  events.forEach(e => {
    pathCounts[e.path] = (pathCounts[e.path] || 0) + 1;
  });
  
  const topPageEntry = Object.entries(pathCounts).sort((a, b) => b[1] - a[1])[0];
  const topPage = topPageEntry 
    ? { path: topPageEntry[0], views: topPageEntry[1] }
    : { path: '/', views: 0 };

  // Live visitors (sessions active in last 5 minutes)
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  const liveVisitors = new Set(
    events
      .filter(e => e.timestamp.toMillis() > fiveMinutesAgo)
      .map(e => e.sessionId)
  ).size;

  return {
    pageViews,
    pageViewsChange,
    uniqueVisitors: uniqueSessions,
    visitorsChange,
    avgSessionDuration: 0, // Not tracked yet
    sessionChange: 0,
    bounceRate: 0, // Not tracked yet
    bounceRateChange: 0,
    liveVisitors,
    topPage
  };
};

// Fetch daily traffic data
export const fetchDailyTraffic = async (days: number): Promise<DailyTraffic[]> => {
  const events = await fetchEventsForPeriod(days);
  
  // Group by date
  const dailyData: Record<string, { pageViews: number; sessions: Set<string> }> = {};
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyData[dateStr] = { pageViews: 0, sessions: new Set() };
  }

  events.forEach(e => {
    const date = e.timestamp.toDate();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (dailyData[dateStr]) {
      dailyData[dateStr].pageViews++;
      dailyData[dateStr].sessions.add(e.sessionId);
    }
  });

  return Object.entries(dailyData)
    .map(([date, data]) => ({
      date,
      pageViews: data.pageViews,
      visitors: data.sessions.size
    }))
    .reverse();
};

// Fetch top pages
export const fetchTopPages = async (days: number, limit: number = 10): Promise<TopPage[]> => {
  const events = await fetchEventsForPeriod(days);
  
  // Group by path
  const pageData: Record<string, { 
    title: string; 
    views: number; 
    sessions: Set<string>;
  }> = {};

  events.forEach(e => {
    if (!pageData[e.path]) {
      pageData[e.path] = { 
        title: e.title || e.path, 
        views: 0, 
        sessions: new Set()
      };
    }
    pageData[e.path].views++;
    pageData[e.path].sessions.add(e.sessionId);
  });

  return Object.entries(pageData)
    .map(([path, data]) => ({
      path,
      title: data.title,
      views: data.views,
      uniqueVisitors: data.sessions.size,
      avgTimeOnPage: 0, // Not tracked
      bounceRate: 0 // Not tracked
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

// Fetch traffic sources
export const fetchTrafficSources = async (days: number): Promise<TrafficSource[]> => {
  const events = await fetchEventsForPeriod(days);
  
  // Categorize referrers
  const sourceData: Record<string, number> = {
    'Direct': 0,
    'Organic Search': 0,
    'Social Media': 0,
    'Referral': 0
  };

  const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu'];
  const socialMedia = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'pinterest'];

  events.forEach(e => {
    const referrer = (e.referrer || 'direct').toLowerCase();
    
    if (referrer === 'direct' || referrer === '') {
      sourceData['Direct']++;
    } else if (searchEngines.some(se => referrer.includes(se))) {
      sourceData['Organic Search']++;
    } else if (socialMedia.some(sm => referrer.includes(sm))) {
      sourceData['Social Media']++;
    } else {
      sourceData['Referral']++;
    }
  });

  const total = Object.values(sourceData).reduce((a, b) => a + b, 0) || 1;
  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))'
  ];

  return Object.entries(sourceData)
    .map(([source, visitors], index) => ({
      source,
      visitors,
      percentage: Math.round((visitors / total) * 100),
      color: colors[index] || 'hsl(var(--muted))'
    }))
    .filter(s => s.visitors > 0)
    .sort((a, b) => b.visitors - a.visitors);
};

// Fetch device stats
export const fetchDeviceStats = async (days: number): Promise<DeviceStat[]> => {
  const events = await fetchEventsForPeriod(days);
  
  const deviceCounts: Record<string, number> = {
    'Desktop': 0,
    'Mobile': 0,
    'Tablet': 0
  };

  events.forEach(e => {
    const device = e.device || 'desktop';
    const deviceName = device.charAt(0).toUpperCase() + device.slice(1);
    deviceCounts[deviceName] = (deviceCounts[deviceName] || 0) + 1;
  });

  const total = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;
  const colors = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  return Object.entries(deviceCounts)
    .map(([device, count], index) => ({
      device,
      percentage: Math.round((count / total) * 100),
      color: colors[index] || 'hsl(var(--muted))'
    }))
    .filter(d => d.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);
};

// Fetch browser stats
export const fetchBrowserStats = async (days: number): Promise<BrowserStat[]> => {
  const events = await fetchEventsForPeriod(days);
  
  const browserCounts: Record<string, number> = {};

  events.forEach(e => {
    const browser = e.browser || 'Other';
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
  });

  const total = Object.values(browserCounts).reduce((a, b) => a + b, 0) || 1;
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return Object.entries(browserCounts)
    .map(([browser, count], index) => ({
      browser,
      percentage: Math.round((count / total) * 100),
      color: colors[index % colors.length]
    }))
    .filter(b => b.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
};

// Fetch live visitors (sessions active in last 5 minutes)
export const fetchLiveVisitors = async (): Promise<number> => {
  const fiveMinutesAgo = Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000));
  
  const q = query(
    collection(db, ANALYTICS_COLLECTION),
    where('type', '==', 'pageview'),
    where('timestamp', '>=', fiveMinutesAgo)
  );

  const snapshot = await getDocs(q);
  const sessions = new Set(snapshot.docs.map(doc => doc.data().sessionId));
  return sessions.size;
};
