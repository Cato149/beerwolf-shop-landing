import type { RefObject } from 'react';
import { gsap, useGSAP } from './gsap';

export function useHeroMotion(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const section = scope.current;
        const art = section?.querySelector<HTMLElement>('[data-hero-art]');
        if (!section || !art) return;

        const ticket = section.querySelector<HTMLElement>('[data-section-ticket]');
        const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
        entrance
          .fromTo(
            '[data-hero-reveal]',
            { y: 42, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.16 },
          )
          .fromTo(
            art,
            { x: 90, rotateY: -16, rotateZ: 7, autoAlpha: 0 },
            {
              x: 0,
              rotateY: 0,
              rotateZ: 0,
              autoAlpha: 1,
              duration: 1.35,
            },
            0.2,
          );

        if (ticket) {
          entrance.fromTo(
            ticket,
            {
              x: () => {
                const rect = ticket.getBoundingClientRect();
                return -(rect.right + 48);
              },
              autoAlpha: 0,
            },
            { x: 0, autoAlpha: 1, duration: 1.15 },
            0.55,
          );
        }

        gsap.to('.low-poly-totem', {
          y: -16,
          rotateZ: -1.5,
          duration: 4.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        gsap.to(art, {
          yPercent: 18,
          rotateZ: -3,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        const rotateX = gsap.quickTo(art, 'rotateX', {
          duration: 0.8,
          ease: 'power3.out',
        });
        const rotateY = gsap.quickTo(art, 'rotateY', {
          duration: 0.8,
          ease: 'power3.out',
        });

        const onPointerMove = (event: PointerEvent) => {
          const bounds = section.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          rotateX(y * -8);
          rotateY(x * 10);
        };

        const onPointerLeave = () => {
          rotateX(0);
          rotateY(0);
        };

        section.addEventListener('pointermove', onPointerMove, { passive: true });
        section.addEventListener('pointerleave', onPointerLeave);

        return () => {
          section.removeEventListener('pointermove', onPointerMove);
          section.removeEventListener('pointerleave', onPointerLeave);
        };
      });

      return () => media.revert();
    },
    { scope },
  );
}
