// Analytics data types

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
