import { ContactForm } from '../components/ui/ContactForm';
import { TelegramCta } from '../components/ui/TelegramCta';
import { settings } from '../content';
import { useLocale } from '../i18n/useLocale';

export function ContactSection() {
  const { copy } = useLocale();

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
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
          <p className="telegram-ticket__index">ROUTE / 01</p>
          <h3>{copy.contact.telegramTitle}</h3>
          <p>{copy.contact.telegramBody}</p>
          <TelegramCta variant="ink" />
          <a className="telegram-ticket__email" href={`mailto:${settings.email}`}>
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
