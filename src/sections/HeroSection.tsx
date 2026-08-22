import { useRef } from 'react';
import { useHeroMotion } from '../animation/useHeroMotion';
import { TelegramCta } from '../components/ui/TelegramCta';
import { TicketCopy } from '../components/ui/TicketCopy';
import { LowPolyTotem } from '../components/visual/LowPolyTotem';
import { useLocale } from '../i18n/useLocale';

export function HeroSection() {
  const { copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  useHeroMotion(sectionRef);

  return (
    <section
      className="hero section-shell"
      id="concept"
      aria-labelledby="hero-title"
      ref={sectionRef}
    >
      <div className="hero__copy">
        <p className="eyebrow hero__eyebrow" data-hero-reveal>
          {copy.hero.eyebrow}
        </p>
        <h1 className="hero__title" id="hero-title" data-hero-reveal>
          <span>{copy.hero.titleLead}</span>
          <span className="hero__title-accent">{copy.hero.titleAccent}</span>
        </h1>
        <div className="hero__story" data-hero-reveal>
          <TicketCopy
            className="hero__description"
            code="BW / ONE-WAY / 001"
            variant="hero"
          >
            {copy.hero.description}
          </TicketCopy>
          <TelegramCta />
        </div>
      </div>

      <div className="hero__art" data-hero-art>
        <LowPolyTotem />
      </div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span>{copy.common.scrollCue}</span>
        <i />
      </div>
    </section>
  );
}
