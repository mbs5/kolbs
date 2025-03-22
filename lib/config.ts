/**
 * Runtime configuration for the application.
 * This file contains environment-specific settings.
 */

// Determine the deployment environment
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isVercel = process.env.VERCEL === '1';

// Application URLs
export const appUrl = process.env.NEXT_PUBLIC_APP_URL || (
  isDevelopment 
    ? 'http://localhost:3000' 
    : 'https://your-production-url.com'
);

// Clerk configuration helpers
export const hasClerkCredentials = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  process.env.CLERK_SECRET_KEY
);

// Feature flags
export const featureFlags = {
  enableAIFeedback: process.env.NEXT_PUBLIC_ENABLE_AI_FEEDBACK !== 'false',
  debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
};

// API endpoints
export const apiEndpoints = {
  skills: `${appUrl}/api/skills`,
  cycles: `${appUrl}/api/cycles`,
  feedback: `${appUrl}/api/feedback`,
  webhook: `${appUrl}/api/webhook/clerk`,
}; 