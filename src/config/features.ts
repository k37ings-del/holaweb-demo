/**
 * Feature flags. Enable future modules without code changes by flipping a flag here
 * (or wiring it to env / settings later).
 */
import { ENV } from "./env";

export const FEATURES = {
  aiAssistant: true,
  adminDashboard: true,
  websiteScraper: true,
  pricingPage: false,
  weeklyAnalyticsEmail: true,
  devLogging: ENV.IS_DEV,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export const isEnabled = (flag: FeatureFlag): boolean => FEATURES[flag] === true;
