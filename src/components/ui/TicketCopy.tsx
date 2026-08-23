import type { ReactNode } from 'react';

type TicketVariant = 'hero' | 'process' | 'archive';

interface TicketCopyProps {
  children: ReactNode;
  className?: string;
  code: string;
  variant: TicketVariant;
  /** Screen edge the ticket travels from during section-intro scroll. */
  edge?: 'start' | 'end';
}

export function TicketCopy({
  children,
  className = '',
  code,
  variant,
  edge,
}: TicketCopyProps) {
  return (
    <p
      className={`${className} ticket-copy ticket-copy--${variant}`.trim()}
      data-ticket={code}
      data-section-ticket={edge ? '' : undefined}
      data-ticket-edge={edge}
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
