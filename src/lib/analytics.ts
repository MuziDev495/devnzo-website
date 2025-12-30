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

// Session ID management
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

// Detect browser
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
};

// Track page view to Firestore
export const trackPageViewToFirestore = async (path: string, title: string): Promise<void> => {
  try {
    const eventsRef = collection(db, 'analytics_events');
    await addDoc(eventsRef, {
      type: 'pageview',
      path,
      title,
      timestamp: Timestamp.now(),
      sessionId: getSessionId(),
      referrer: document.referrer || '',
      userAgent: navigator.userAgent,
      device: getDeviceType(),
      browser: getBrowser()
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};
