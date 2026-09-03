import { analyticsEvents, trackEvent } from '../../analytics/umami';
import { supportedLocales, type Locale } from '../../content';
import { useLocale } from '../../i18n/useLocale';

export function LanguageSwitcher() {
  const { locale, copy, setLocale } = useLocale();

  return (
    <div className="language-switcher" role="group" aria-label={copy.common.language}>
      {supportedLocales.map((candidate: Locale) => (
        <button
          className="language-switcher__option"
          type="button"
          key={candidate}
          aria-pressed={candidate === locale}
          onClick={() => {
            if (candidate !== locale) {
              trackEvent(analyticsEvents.languageSwitch, { from: locale, to: candidate });
            }
            setLocale(candidate);
          }}
        >
          {candidate.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
