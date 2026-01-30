
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Type definition for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const GA_MEASUREMENT_ID = 'G-RNZ2F2D7EV';

// Standardized Event Names
export type AnalyticsEvent =
  | 'lead_form_open'      // Core Function Trigger
  | 'lead_form_start'     // Core Function Engagement
  | 'generate_lead'       // Core Function Completion (Conversion)
  | 'lead_form_error'     // Core Function Error
  | 'lead_form_abandon';  // Core Function Abandonment

interface EventParams {
  source?: string;
  course_name?: string;
  error_type?: string;
  error_code?: string;
  abandon_reason?: string;
  progress?: string;
  [key: string]: any;
}

/**
 * Sends an event to Google Analytics 4
 */
export const trackEvent = (
  eventName: AnalyticsEvent | string,
  params?: EventParams
) => {
  // Safe check for window and gtag
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    // Fallback for development/blocked environments
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${eventName}`, params);
    }
  }
};

/**
 * React Hook to track page views on route changes
 * Places this in your main App component
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};
