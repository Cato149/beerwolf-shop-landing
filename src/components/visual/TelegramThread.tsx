import { useLocale } from '../../i18n/useLocale';

export function TelegramThread() {
  const { copy } = useLocale();
  const { telegram } = copy.process;

  return (
    <div className="telegram-thread" aria-label={telegram.title}>
      <div className="telegram-thread__topbar">
        <div className="telegram-thread__avatar" aria-hidden="true">
          BW
        </div>
        <div>
          <strong>{telegram.title}</strong>
          <span>{telegram.status}</span>
        </div>
        <span className="telegram-thread__signal" aria-hidden="true">
          ▮▮▮
        </span>
      </div>

      <div className="telegram-thread__messages">
        {telegram.messages.map((message, index) => (
          <p
            className={`telegram-thread__message telegram-thread__message--${message.from}`}
            key={`${message.from}-${index}`}
          >
            {message.text}
            <span>{`16:${24 + index * 3}`}</span>
          </p>
        ))}
      </div>

      <ul className="telegram-thread__actions" aria-label={telegram.title}>
        {telegram.actions.map((action) => (
          <li key={action}>/{action.toLocaleLowerCase().replaceAll(' ', '_')}</li>
        ))}
      </ul>
    </div>
  );
}
