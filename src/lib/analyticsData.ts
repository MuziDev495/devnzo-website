// Analytics data types and demo data generator

export interface AnalyticsOverview {
  pageViews: number;
  pageViewsChange: number;
  uniqueVisitors: number;
  visitorsChange: number;
  avgSessionDuration: number; // in seconds
  sessionChange: number;
  bounceRate: number;
  bounceRateChange: number;
  liveVisitors: number;
  topPage: {
    path: string;
    views: number;
  };
}

export interface DailyTraffic {
  date: string;
  pageViews: number;
  visitors: number;
}

export interface TopPage {
  path: string;
  title: string;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // in seconds
  bounceRate: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

export interface DeviceStat {
  device: string;
  percentage: number;
  color: string;
}

export interface BrowserStat {
  browser: string;
  percentage: number;
  color: string;
}

// Generate random number within range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate demo analytics overview
export const generateAnalyticsOverview = (): AnalyticsOverview => {
  return {
    pageViews: randomInRange(10000, 15000),
    pageViewsChange: randomInRange(-5, 20),
    uniqueVisitors: randomInRange(3000, 5000),
    visitorsChange: randomInRange(-3, 15),
    avgSessionDuration: randomInRange(120, 240),
    sessionChange: randomInRange(-10, 10),
    bounceRate: randomInRange(35, 55),
    bounceRateChange: randomInRange(-8, 8),
    liveVisitors: randomInRange(5, 25),
    topPage: {
      path: '/products',
      views: randomInRange(2000, 3500)
    }
  };
};

// Generate traffic data for last N days
export const generateDailyTraffic = (days: number): DailyTraffic[] => {
  const data: DailyTraffic[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Weekend has less traffic
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseViews = isWeekend ? randomInRange(200, 400) : randomInRange(400, 700);
    const baseVisitors = Math.floor(baseViews * 0.35);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pageViews: baseViews,
      visitors: baseVisitors
    });
  }
  
  return data;
};

// Generate top pages data
export const generateTopPages = (): TopPage[] => {
  const pages = [
    { path: '/products', title: 'Our Products' },
    { path: '/blog', title: 'Blog' },
    { path: '/', title: 'Home' },
    { path: '/about', title: 'About Us' },
    { path: '/contact', title: 'Contact' },
    { path: '/resources', title: 'Resources' },
    { path: '/partners', title: 'Partners' },
    { path: '/faq', title: 'FAQ' }
  ];
  
  return pages.map((page, index) => ({
    ...page,
    views: randomInRange(800 - index * 100, 1500 - index * 150),
    uniqueVisitors: randomInRange(400 - index * 50, 900 - index * 100),
    avgTimeOnPage: randomInRange(60, 180),
    bounceRate: randomInRange(30, 60)
  })).sort((a, b) => b.views - a.views);
};

// Generate traffic sources
export const generateTrafficSources = (): TrafficSource[] => {
  const sources = [
    { source: 'Direct', color: 'hsl(var(--primary))' },
    { source: 'Organic Search', color: 'hsl(var(--chart-2))' },
    { source: 'Social Media', color: 'hsl(var(--chart-3))' },
    { source: 'Referral', color: 'hsl(var(--chart-4))' },
    { source: 'Email', color: 'hsl(var(--chart-5))' }
  ];
  
  // Generate random percentages that sum to 100
  let remaining = 100;
  const result: TrafficSource[] = [];
  
  sources.forEach((source, index) => {
    if (index === sources.length - 1) {
      result.push({ ...source, visitors: remaining * 50, percentage: remaining });
    } else {
      const maxPercentage = Math.min(remaining - (sources.length - index - 1) * 5, remaining * 0.5);
      const percentage = randomInRange(10, maxPercentage);
      remaining -= percentage;
      result.push({ ...source, visitors: percentage * 50, percentage });
    }
  });
  
  return result.sort((a, b) => b.percentage - a.percentage);
};

// Generate device stats
export const generateDeviceStats = (): DeviceStat[] => {
  return [
    { device: 'Desktop', percentage: randomInRange(50, 65), color: 'hsl(var(--primary))' },
    { device: 'Mobile', percentage: randomInRange(25, 40), color: 'hsl(var(--chart-2))' },
    { device: 'Tablet', percentage: randomInRange(5, 15), color: 'hsl(var(--chart-3))' }
  ];
};

// Generate browser stats
export const generateBrowserStats = (): BrowserStat[] => {
  return [
    { browser: 'Chrome', percentage: randomInRange(55, 70), color: 'hsl(var(--chart-1))' },
    { browser: 'Safari', percentage: randomInRange(15, 25), color: 'hsl(var(--chart-2))' },
    { browser: 'Firefox', percentage: randomInRange(8, 15), color: 'hsl(var(--chart-3))' },
    { browser: 'Edge', percentage: randomInRange(5, 10), color: 'hsl(var(--chart-4))' },
    { browser: 'Other', percentage: randomInRange(2, 5), color: 'hsl(var(--chart-5))' }
  ];
};

// Format seconds to mm:ss
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
