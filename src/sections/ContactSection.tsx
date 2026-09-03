import { useRef } from 'react';
import { analyticsEvents, umamiEventAttrs } from '../analytics/umami';
import { useContactMotion } from '../animation/useContactMotion';
import { ContactForm } from '../components/ui/ContactForm';
import { TelegramCta } from '../components/ui/TelegramCta';
import { settings } from '../content';
import { useLocale } from '../i18n/useLocale';

// 20-point burst used by vintage windshield price stickers.
const STICKER_BURST_POINTS = [
  [50, 1.4],
  [53.8, 16.8],
  [63.9, 5.2],
  [62.6, 21.4],
  [78.6, 12.8],
  [71.4, 26.8],
  [88.8, 24.2],
  [78.2, 34.6],
  [97.2, 37.4],
  [82.4, 44.2],
  [99.2, 51.8],
  [83.6, 55.8],
  [96.4, 67.2],
  [81.2, 65.4],
  [89.4, 81.6],
  [75.4, 73.2],
  [78.2, 91.8],
  [67.2, 78.6],
  [64.8, 97.6],
  [57.4, 81.4],
  [50, 98.6],
  [42.6, 81.4],
  [35.2, 97.6],
  [32.8, 78.6],
  [21.8, 91.8],
  [24.6, 73.2],
  [10.6, 81.6],
  [18.8, 65.4],
  [3.6, 67.2],
  [16.4, 55.8],
  [0.8, 51.8],
  [17.6, 44.2],
  [2.8, 37.4],
  [21.8, 34.6],
  [11.2, 24.2],
  [28.6, 26.8],
  [21.4, 12.8],
  [37.4, 21.4],
  [36.1, 5.2],
  [46.2, 16.8],
]
  .map(([x, y]) => `${x},${y}`)
  .join(' ');

export function ContactSection() {
  const { copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  useContactMotion(sectionRef);

  return (
    <section
      className="contact"
      id="contact"
      aria-labelledby="contact-title"
      ref={sectionRef}
    >
      <div className="contact__sun" aria-hidden="true" />
      <div className="section-shell contact__heading">
        <div className="section-heading">
          <p className="eyebrow">{copy.contact.eyebrow}</p>
          <h2 id="contact-title" className="contact__logo-heading">
            <span className="contact__logo-question">
              {copy.contact.heading.question}
            </span>
            <span className="contact__logo-lockup">
              <span className="contact__logo-script">
                {copy.contact.heading.scriptLine}
              </span>
              <span className="contact__logo-brand">{copy.contact.heading.brand}</span>
            </span>
          </h2>
        </div>
      </div>

      <div className="section-shell contact__routes">
        <aside className="telegram-ticket">
          <div className="telegram-ticket__tear" aria-hidden="true" />
          <div
            className="contact-price-sticker"
            data-price-sticker
            aria-label={copy.contact.priceSticker}
          >
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <polygon points={STICKER_BURST_POINTS} />
              <circle cx="50" cy="50" r="27.5" />
            </svg>
            <span>{copy.contact.priceSticker}</span>
          </div>
          <p className="telegram-ticket__index">ROUTE / 01</p>
          <h3>{copy.contact.telegramTitle}</h3>
          <p>{copy.contact.telegramBody}</p>
          <TelegramCta variant="ink" source="contact" />
          <a
            className="telegram-ticket__email"
            href={`mailto:${settings.email}`}
            {...umamiEventAttrs(analyticsEvents.contactEmail, { source: 'contact' })}
          >
            {settings.email}
          </a>
          <span className="telegram-ticket__availability">
            ● {copy.contact.availability}
          </span>
        </aside>

        <div className="contact__form-wrap">
          <div className="contact__form-heading">
            <p>ROUTE / 02</p>
            <h3>{copy.contact.formTitle}</h3>
            <p>{copy.contact.formIntro}</p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
