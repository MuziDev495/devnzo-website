import ReactGA from 'react-ga4';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// Initialize Google Analytics 4
const GA_MEASUREMENT_ID = "G-VWWD7KG1S4";

export const initGA = () => {
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    console.log('Google Analytics initialized');
  }
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track custom events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string) => {
  trackEvent('Form', 'Submit', formName);
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location?: string) => {
  trackEvent('Button', 'Click', `${buttonName}${location ? ` - ${location}` : ''}`);
};

// Track blog post views
export const trackBlogView = (postTitle: string, postSlug: string) => {
  trackEvent('Blog', 'View', postTitle);
};

// Session management
const SESSION_KEY = 'analytics_session_id';
const SESSION_TIMESTAMP_KEY = 'analytics_session_timestamp';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const getOrCreateSessionId = (): string => {
  const now = Date.now();
  const existingSessionId = localStorage.getItem(SESSION_KEY);
  const lastTimestamp = localStorage.getItem(SESSION_TIMESTAMP_KEY);

  // Check if session is still valid
  if (existingSessionId && lastTimestamp) {
    const timeSinceLastActivity = now - parseInt(lastTimestamp, 10);
    if (timeSinceLastActivity < SESSION_TIMEOUT) {
      localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
      return existingSessionId;
    }
  }

  // Create new session
  const newSessionId = generateSessionId();
  localStorage.setItem(SESSION_KEY, newSessionId);
  localStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
  return newSessionId;
};

// Device detection
export const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  const ua = navigator.userAgent.toLowerCase();
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Browser detection
export const getBrowserName = (): string => {
  const ua = navigator.userAgent;
  
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  
  return 'Other';
};

// Track page view to Firestore
export const trackPageViewToFirestore = async (path: string, title: string): Promise<void> => {
  // Skip admin pages
  if (path.startsWith('/admin')) {
    return;
  }

  try {
    const sessionId = getOrCreateSessionId();
    const device = getDeviceType();
    const browser = getBrowserName();
    const referrer = document.referrer || 'direct';

    await addDoc(collection(db, 'analytics_events'), {
      type: 'pageview',
      path,
      title,
      timestamp: Timestamp.now(),
      sessionId,
      referrer,
      device,
      browser
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};
