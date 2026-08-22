import { settings } from '../../content';
import { useLocale } from '../../i18n/useLocale';

interface TelegramCtaProps {
  variant?: 'sun' | 'ink';
}

export function TelegramCta({ variant = 'sun' }: TelegramCtaProps) {
  const { copy } = useLocale();

  return (
    <a
      className={`telegram-cta telegram-cta--${variant}`}
      href={settings.telegramBotUrl}
      target="_blank"
      rel="noreferrer"
    >
      <span>{copy.common.telegramCta}</span>
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <path d="M4 14h17M15 7l7 7-7 7" />
      </svg>
    </a>
  );
}
