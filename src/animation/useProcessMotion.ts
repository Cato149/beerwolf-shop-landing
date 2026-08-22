import type { RefObject } from 'react';
import { gsap, useGSAP } from './gsap';

export function useProcessMotion(scope: RefObject<HTMLElement>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(min-width: 59rem) and (prefers-reduced-motion: no-preference)', () => {
        const steps = gsap.utils.toArray<HTMLElement>('[data-process-step]');

        steps.forEach((step, index) => {
          const article = step.querySelector('article');
          const artifact = step.querySelector('.process-step__artifact');
          const fromX = index % 2 ? 72 : -72;

          gsap.fromTo(
            article,
            { x: fromX, y: 24, rotateZ: index % 2 ? 2 : -2, autoAlpha: 0.2 },
            {
              x: 0,
              y: 0,
              rotateZ: 0,
              autoAlpha: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 78%',
                end: 'center 52%',
                scrub: 0.8,
              },
            },
          );

          if (artifact) {
            gsap.fromTo(
              artifact,
              { x: -fromX * 0.5, y: 55, rotateZ: index % 2 ? -3 : 3, autoAlpha: 0 },
              {
                x: 0,
                y: 0,
                rotateZ: 0,
                autoAlpha: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: artifact,
                  start: 'top 88%',
                  end: 'center 65%',
                  scrub: 0.7,
                },
              },
            );
          }
        });
      });

      media.add('(max-width: 58rem) and (prefers-reduced-motion: no-preference)', () => {
        const steps = gsap.utils.toArray<HTMLElement>('[data-process-step]');

        steps.forEach((step) => {
          const article = step.querySelector('article');
          const artifact = step.querySelector('.process-step__artifact');

          gsap.fromTo(
            article,
            { y: 24, autoAlpha: 0.2 },
            {
              y: 0,
              autoAlpha: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 82%',
                end: 'center 58%',
                scrub: 0.8,
              },
            },
          );

          if (artifact) {
            gsap.fromTo(
              artifact,
              { y: 36, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: artifact,
                  start: 'top 88%',
                  end: 'center 68%',
                  scrub: 0.7,
                },
              },
            );
          }
        });
      });

      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('[data-process-path]', {
          strokeDashoffset: -120,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1,
          },
        });

        gsap.from('.project-board__card', {
          y: 70,
          rotateZ: () => gsap.utils.random(-7, 7),
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.project-board',
            start: 'top 72%',
          },
        });

        gsap.from('.telegram-thread__message', {
          y: 32,
          scale: 0.92,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.telegram-thread',
            start: 'top 72%',
          },
        });

        gsap.to('.process-journey__bleed', {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-journey__bleed',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });

      return () => media.revert();
    },
    { scope },
  );
}
