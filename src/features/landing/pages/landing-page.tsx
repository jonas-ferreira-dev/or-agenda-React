// src/features/landing/pages/landing-page.tsx

import { LandingHero } from '../components/landing-hero';
import { LandingProblemSection } from '../components/landing-problem-section';
import { LandingFeaturesSection } from '../components/landing-features-section';
import { LandingPricingSection } from '../components/landing-pricing-section';
import { LandingFinalCta } from '../components/landing-final-cta';

export function LandingPage() {
  return (
    <main className="landing-page">
      <LandingHero />
      <LandingProblemSection />
      <LandingFeaturesSection />
      <LandingPricingSection />
      <LandingFinalCta />
    </main>
  );
}