import type { RefObject } from 'react';
import { gsap, useGSAP } from './gsap';

/**
 * Pops the dealership-style price sticker onto the Fastest Route card once that
 * ticket enters the upper half of the viewport.
 */
export function useContactMotion(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const sticker =
          scope.current?.querySelector<HTMLElement>('[data-price-sticker]');
        const ticket = scope.current?.querySelector<HTMLElement>('.telegram-ticket');
        if (!sticker || !ticket) return;

        gsap.fromTo(
          sticker,
          { autoAlpha: 0, scale: 0.12, rotate: -28 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: 12,
            duration: 0.72,
            ease: 'back.out(2.1)',
            scrollTrigger: {
              trigger: ticket,
              start: 'top 68%',
              once: true,
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope },
  );
}
