import type { ReactNode } from 'react';

type TicketVariant = 'hero' | 'process' | 'archive' | 'contact';

interface TicketCopyProps {
  children: ReactNode;
  className?: string;
  code: string;
  variant: TicketVariant;
}

export function TicketCopy({
  children,
  className = '',
  code,
  variant,
}: TicketCopyProps) {
  return (
    <p
      className={`${className} ticket-copy ticket-copy--${variant}`.trim()}
      data-ticket={code}
    >
      <span className="ticket-copy__text">{children}</span>
      <span className="ticket-copy__marks" aria-hidden="true">
        <i className="ticket-mark ticket-mark--paw" />
        <i className="ticket-mark ticket-mark--coffee" />
        <i className="ticket-mark ticket-mark--fingerprint" />
      </span>
    </p>
  );
}

