import { useState } from 'react';
import { analyticsEvents, umamiEventAttrs } from '../../analytics/umami';
import { settings } from '../../content';
import { useLocale } from '../../i18n/useLocale';
import { LanguageSwitcher } from './LanguageSwitcher';

export function SiteHeader() {
  const { copy } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '#process', label: copy.nav.process },
    { href: '#archive', label: copy.nav.archive },
    { href: '#contact', label: copy.nav.contact },
  ];

  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label={copy.nav.brand}>
        {copy.nav.brand}
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="site-navigation"
        aria-label={isOpen ? copy.nav.menuClose : copy.nav.menuOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
      </button>

      <div className="site-header__panel" id="site-navigation" data-open={isOpen}>
        <nav aria-label={copy.nav.label}>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className="site-header__me"
          href={settings.personalSiteUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => setIsOpen(false)}
          {...umamiEventAttrs(analyticsEvents.personalSite, { source: 'header' })}
        >
          {copy.common.me}
        </a>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
