import { MotionScene } from '../animation/MotionScene';
import { SiteHeader } from '../components/ui/SiteHeader';
import { GlowField } from '../components/visual/GlowField';
import { GrainOverlay } from '../components/visual/GrainOverlay';
import { PixelGlyphs } from '../components/visual/PixelGlyphs';
import { useLocale } from '../i18n/useLocale';
import { ArchivePortfolio } from '../sections/ArchivePortfolio';
import { ContactSection } from '../sections/ContactSection';
import { HeroSection } from '../sections/HeroSection';
import { ProcessJourney } from '../sections/ProcessJourney';
import { SiteFooter } from '../sections/SiteFooter';

export function PosterWorld() {
  const { copy } = useLocale();

  return (
    <div className="poster-world" id="top">
      <a className="skip-link" href="#main-content">
        {copy.nav.skip}
      </a>
      <GlowField />
      <GrainOverlay />
      <PixelGlyphs />
      <div className="world-ribbon world-ribbon--one" aria-hidden="true" />
      <div className="world-ribbon world-ribbon--two" aria-hidden="true" />
      <MotionScene />

      <SiteHeader />

      <main id="main-content">
        <HeroSection />
        <ProcessJourney />
        <ArchivePortfolio />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>
  );
}
