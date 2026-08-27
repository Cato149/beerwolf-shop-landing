import { analyticsEvents, umamiEventAttrs } from '../../analytics/umami';
import { settings } from '../../content';
import { useLocale } from '../../i18n/useLocale';

interface TelegramCtaProps {
  variant?: 'sun' | 'ink';
  source: 'hero' | 'contact';
}

export function TelegramCta({ variant = 'sun', source }: TelegramCtaProps) {
  const { copy } = useLocale();

  return (
    <a
      className={`telegram-cta telegram-cta--${variant}`}
      href={settings.telegramBotUrl}
      target="_blank"
      rel="noreferrer"
      {...umamiEventAttrs(analyticsEvents.telegramBot, { source })}
    >
      <span className="telegram-cta__copy">
        <strong>{copy.common.telegramCta}</strong>
        <small>{copy.common.telegramCtaNote}</small>
      </span>
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M4 14h17M15 7l7 7-7 7" />
      </svg>
    </a>
  );
}
