import ReactGA from 'react-ga4';

// Initialize Google Analytics 4
// Replace with your GA4 Measurement ID (format: G-XXXXXXXXXX)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

export const initGA = () => {
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    ReactGA.initialize(GA_MEASUREMENT_ID);
    console.log('Google Analytics initialized');
  } else {
    console.warn('Google Analytics Measurement ID not configured');
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
