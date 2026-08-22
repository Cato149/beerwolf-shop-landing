import { useState } from 'react';
import { settings } from '../../content';
import { useLocale } from '../../i18n/useLocale';
import { LanguageSwitcher } from './LanguageSwitcher';

export function SiteHeader() {
  const { copy } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '#concept', label: copy.nav.concept },
    { href: '#process', label: copy.nav.process },
    { href: '#archive', label: copy.nav.archive },
    { href: '#contact', label: copy.nav.contact },
  ];

  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label={settings.brandName}>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="m7 8 8 12 9-14 9 14 9-12-4 33H11z" />
          <path d="m17 25 7-6 7 6-7 11z" />
        </svg>
        <span>{settings.brandName}</span>
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
        <LanguageSwitcher />
      </div>
    </header>
  );
}
