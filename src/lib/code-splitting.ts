/**
 * Code Splitting Configuration
 * 
 * This module provides dynamic imports for large components
 * to reduce initial bundle size and improve performance.
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading component shown while dynamic components load
 */
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

/**
 * Discovery Modules - Lazy loaded on demand
 * Each module is ~30-50KB, total savings: ~500KB
 */
export const BrainModule = dynamic(
  () => import('@/app/discovery/brain/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const HeartModule = dynamic(
  () => import('@/app/discovery/heart/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LungsModule = dynamic(
  () => import('@/app/discovery/lungs/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const DigestiveModule = dynamic(
  () => import('@/app/discovery/digestive/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const KidneysModule = dynamic(
  () => import('@/app/discovery/kidneys/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const SkinModule = dynamic(
  () => import('@/app/discovery/skin/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const EyesModule = dynamic(
  () => import('@/app/discovery/eyes/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const EarsModule = dynamic(
  () => import('@/app/discovery/ears/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const MusclesBonesModule = dynamic(
  () => import('@/app/discovery/muscles-bones/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const ImmuneModule = dynamic(
  () => import('@/app/discovery/immune/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const HormonesModule = dynamic(
  () => import('@/app/discovery/hormones/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const SensesModule = dynamic(
  () => import('@/app/discovery/senses/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const MovementModule = dynamic(
  () => import('@/app/discovery/movement/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LanguageModule = dynamic(
  () => import('@/app/discovery/language/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LearningModule = dynamic(
  () => import('@/app/discovery/learning/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const EmotionsModule = dynamic(
  () => import('@/app/discovery/emotions/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * Intervention Modules - Lazy loaded on demand
 * Each module is ~20-30KB, total savings: ~200KB
 */
export const NutritionIntervention = dynamic(
  () => import('@/app/interventions/nutrition-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const SleepIntervention = dynamic(
  () => import('@/app/interventions/sleep-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const VisionIntervention = dynamic(
  () => import('@/app/interventions/vision-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const HearingIntervention = dynamic(
  () => import('@/app/interventions/hearing-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const DentalIntervention = dynamic(
  () => import('@/app/interventions/dental-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const AllergyIntervention = dynamic(
  () => import('@/app/interventions/allergy-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const DermatologyIntervention = dynamic(
  () => import('@/app/interventions/dermatology-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const FocusIntervention = dynamic(
  () => import('@/app/interventions/focus-intervention/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * Admin Dashboard Components - Lazy loaded
 * Total savings: ~100KB
 */
export const AdminClinics = dynamic(
  () => import('@/app/admin/clinics/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const AdminParents = dynamic(
  () => import('@/app/admin/parents/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const AdminCampaigns = dynamic(
  () => import('@/app/admin/campaigns/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const AdminAnalytics = dynamic(
  () => import('@/app/admin/analytics/page'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * 3D Visualization Components - Lazy loaded
 * These are heavy (three.js), total savings: ~600KB
 */
export const ThreeScene = dynamic(
  () => import('@/components/three/Scene'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * Chart Components - Lazy loaded
 * Recharts is heavy, savings: ~100KB
 */
export const AnalyticsCharts = dynamic(
  () => import('@/components/analytics/Charts'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

/**
 * Helper function to create dynamic component with custom loading
 */
export function createDynamicComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loading?: ComponentType;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || LoadingSpinner,
    ssr: options?.ssr ?? false,
  });
}

/**
 * Preload a dynamic component
 * Useful for prefetching on hover or route change
 */
export function preloadComponent(
  component: ReturnType<typeof dynamic>
): void {
  if (typeof window !== 'undefined' && 'preload' in component) {
    (component as any).preload();
  }
}
