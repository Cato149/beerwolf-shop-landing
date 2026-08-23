import type { RefObject } from 'react';
import { gsap, useGSAP } from './gsap';

/**
 * After a section heading arrives at the bottom of the viewport, further
 * scroll pulls the intro ticket in from the matching screen edge.
 */
function getTicketHiddenX(ticket: HTMLElement, edge: 'start' | 'end') {
  const rect = ticket.getBoundingClientRect();
  const currentX = Number(gsap.getProperty(ticket, 'x')) || 0;
  const naturalLeft = rect.left - currentX;
  const naturalRight = rect.right - currentX;
  const gutter = 48;

  if (edge === 'start') {
    return -(naturalRight + gutter);
  }

  return window.innerWidth - naturalLeft + gutter;
}

export function useSectionIntroMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const root = scope.current;
        if (!root) return;

        const intros = gsap.utils.toArray<HTMLElement>('[data-section-intro]', root);

        intros.forEach((intro) => {
          const heading = intro.querySelector<HTMLElement>('[data-section-heading]');
          const ticket = intro.querySelector<HTMLElement>('[data-section-ticket]');
          if (!heading || !ticket) return;

          const edge = ticket.dataset.ticketEdge === 'start' ? 'start' : 'end';

          gsap.fromTo(
            ticket,
            {
              x: () => getTicketHiddenX(ticket, edge),
              autoAlpha: 0.12,
            },
            {
              x: 0,
              autoAlpha: 1,
              ease: 'power3.out',
              immediateRender: true,
              scrollTrigger: {
                trigger: heading,
                // Heading sits at the bottom, then more scroll unspools the ticket.
                start: 'top 90%',
                end: 'top 28%',
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { scope },
  );
}
