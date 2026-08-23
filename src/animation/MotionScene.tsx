import { gsap, useGSAP } from './gsap';

export function MotionScene() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.site-header', {
        y: -30,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
      });

      gsap.to('.world-ribbon--one', {
        y: 240,
        rotate: -7,
        ease: 'none',
        scrollTrigger: {
          trigger: '.process-journey',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.to('.world-ribbon--two', {
        y: -180,
        rotate: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.archive',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      });

      gsap.from('.contact__routes > *', {
        y: 80,
        rotateZ: (index) => (index ? 1.5 : -2),
        autoAlpha: 0,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact__routes',
          start: 'top 78%',
        },
      });

      gsap.to('.contact__sun', {
        rotate: 28,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contact',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to('.site-footer__marquee', {
        xPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.site-footer',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
    });

    return () => media.revert();
  });

  return null;
}
