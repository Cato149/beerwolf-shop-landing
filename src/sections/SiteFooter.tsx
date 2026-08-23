import { useState } from 'react';
import { settings } from '../content';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { useLocale } from '../i18n/useLocale';

export function SiteFooter() {
  const { copy } = useLocale();
  const [isRadioFound, setIsRadioFound] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="section-shell site-footer__grid">
        <div className="site-footer__signal">
          <span aria-hidden="true">⌁</span>
          <p>{copy.footer.signoff}</p>
        </div>

        <div>
          <p className="site-footer__label">{copy.footer.socialTitle}</p>
          <ul className="site-footer__links">
            <li>
              <a href={settings.personalSiteUrl} target="_blank" rel="noreferrer">
                {copy.common.me} ↗
              </a>
            </li>
            {settings.socials.map((social) => (
              <li key={social.label}>
                <a href={social.url} target="_blank" rel="noreferrer">
                  {social.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <LanguageSwitcher />
      </div>

      <div className="section-shell site-footer__bottom">
        <p>
          © {year} {copy.footer.copyright}
        </p>
        <button
          className="wolf-radio"
          type="button"
          aria-label={copy.footer.easterEgg}
          aria-pressed={isRadioFound}
          title={copy.footer.easterEgg}
          onClick={() => setIsRadioFound((current) => !current)}
        >
          <span aria-hidden="true">▥</span>
        </button>
        <a href="#top">↑ TOP</a>
        <p className="wolf-radio__message" data-visible={isRadioFound}>
          {copy.footer.easterEgg}
        </p>
      </div>

      <div className="site-footer__marquee" aria-hidden="true">
        BEERWOLF · ONE OF ONE · BEERWOLF · ONE OF ONE · BEERWOLF · ONE OF ONE ·
      </div>
    </footer>
  );
}
