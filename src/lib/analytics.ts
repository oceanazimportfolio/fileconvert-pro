/**
 * Utility functions for global analytics tracking.
 * Safely wraps window.gtag and window.clarity to prevent runtime errors
 * if the analytics scripts are blocked or missing environment variables.
 */

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

// Declare the window interface extensions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Log a generic event to Google Analytics
 */
export const trackEvent = (action: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    try {
      window.gtag('event', action, params);
    } catch (err) {
      console.warn('Failed to track GA event', err);
    }
  }
};

/**
 * Specifically track when a tool is actively loaded/viewed
 */
export const trackToolUsage = (toolId: string, category: string = 'Tool', name: string = 'Unknown') => {
  trackEvent('tool_viewed', {
    tool_id: toolId,
    tool_name: name,
    tool_category: category,
  });
};

/**
 * Specifically track an active conversion or meaningful interaction taking place
 */
export const trackConversion = (
  toolId: string,
  actionType: 'convert' | 'download' | 'copy' | 'upload',
  outputFormat?: string
) => {
  const params: any = {
    tool_id: toolId,
    action_type: actionType,
  };

  if (outputFormat) {
    params.output_format = outputFormat;
  }

  trackEvent('tool_interaction', params);
};
