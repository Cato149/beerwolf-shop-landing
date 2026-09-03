import type { MutableRefObject, RefObject } from 'react';
import {
  ARCHIVE_SCROLL_SEQUENCE_LIMIT,
  type ArchiveMotionControls,
} from './archive-motion';
import { gsap, ScrollTrigger, useGSAP } from './gsap';

type UseArchiveMotionOptions = {
  controlsRef: MutableRefObject<ArchiveMotionControls | null>;
  menuActiveIndexRef: RefObject<number | null>;
  onActiveIndexChange?: (index: number) => void;
  onExitMenuView?: () => void;
};

function getCardDetails(card: HTMLElement) {
  return card.querySelectorAll(
    '.archive-card__dossier > *:not(.archive-card__link):not(.archive-card__status), .archive-card__art img',
  );
}

function setScrollCardPointerEvents(cards: HTMLElement[], activeIndex: number) {
  cards.forEach((card, cardIndex) => {
    card.style.pointerEvents = cardIndex === activeIndex ? 'auto' : 'none';
  });
}

/** Real timeline label: ScrollTrigger.labelToScroll() only looks up exact keys. */
function getOpenCardScrollLabel(index: number) {
  return `card-${index}-open`;
}

function openMenuOnlyCard(cards: HTMLElement[], index: number) {
  const selected = cards[index];
  if (!selected) return;

  cards.forEach((card, cardIndex) => {
    const details = getCardDetails(card);

    if (cardIndex === index) {
      gsap.to(card, {
        y: 0,
        xPercent: 0,
        z: 0,
        scale: 1,
        rotation: cardIndex % 2 ? 0.35 : -0.35,
        autoAlpha: 1,
        pointerEvents: 'auto',
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      gsap.to(details, {
        y: 0,
        autoAlpha: 1,
        duration: 0.35,
        stagger: 0.04,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      return;
    }

    gsap.to(card, {
      autoAlpha: 0,
      pointerEvents: 'none',
      duration: 0.25,
      overwrite: 'auto',
    });
  });
}

export function useArchiveMotion(
  scope: RefObject<HTMLElement | null>,
  {
    controlsRef,
    menuActiveIndexRef,
    onActiveIndexChange,
    onExitMenuView,
  }: UseArchiveMotionOptions,
) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();

      const bindMenuExitOnScroll = () => {
        const exitMenuView = () => {
          if (menuActiveIndexRef.current === null) return;
          onExitMenuView?.();
        };

        window.addEventListener('wheel', exitMenuView, { passive: true });
        window.addEventListener('touchmove', exitMenuView, { passive: true });

        return () => {
          window.removeEventListener('wheel', exitMenuView);
          window.removeEventListener('touchmove', exitMenuView);
        };
      };

      media.add(
        '(min-width: 929px) and (prefers-reduced-motion: no-preference)',
        () => {
          const stage =
            scope.current?.querySelector<HTMLElement>('[data-archive-stage]');
          const cards = gsap.utils.toArray<HTMLElement>('[data-archive-card]');
          if (!stage || !cards.length) return;

          const scrollCards = cards.slice(0, ARCHIVE_SCROLL_SEQUENCE_LIMIT);
          const menuOnlyCards = cards.slice(ARCHIVE_SCROLL_SEQUENCE_LIMIT);
          const removeMenuExitListener = bindMenuExitOnScroll();

          const primeScrollCards = () => {
            scrollCards.forEach((card, index) => {
              gsap.set(card, {
                // Sit just under the fold so the first dossier peeks as soon as
                // the title hits the viewport center and the timeline starts.
                y: () => window.innerHeight * 0.22 + index * 22,
                z: index * -28,
                rotation: (index - 1) * 0.7,
                clearProps: 'opacity,visibility,scale,xPercent,pointerEvents',
              });
              gsap.set(getCardDetails(card), { y: 22, autoAlpha: 0 });
            });
          };

          const primeMenuOnlyCards = () => {
            menuOnlyCards.forEach((card) => {
              gsap.set(card, {
                autoAlpha: 0,
                pointerEvents: 'none',
                y: 0,
                z: 0,
                rotation: 0,
              });
              gsap.set(getCardDetails(card), { y: 0, autoAlpha: 1 });
            });
          };

          primeScrollCards();
          primeMenuOnlyCards();
          setScrollCardPointerEvents(scrollCards, 0);

          const heading =
            scope.current?.querySelector<HTMLElement>('[data-section-heading]');

          const timeline = gsap.timeline({
            scrollTrigger: {
              // First dossier starts rising once the archive title sits at the
              // bottom of the viewport, not after the intro has already left.
              trigger: heading ?? stage,
              start: heading ? 'top 90%' : 'top top',
              endTrigger: stage,
              end: 'bottom bottom',
              scrub: 0.9,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (menuActiveIndexRef.current !== null) return;

                const activeIndex =
                  scrollCards.length <= 1
                    ? 0
                    : Math.min(
                        scrollCards.length - 1,
                        Math.round(self.progress * (scrollCards.length - 1)),
                      );

                setScrollCardPointerEvents(scrollCards, activeIndex);
                onActiveIndexChange?.(activeIndex);
              },
            },
          });

          scrollCards.forEach((card, index) => {
            const details = getCardDetails(card);
            const label = `card-${index}`;

            timeline
              .addLabel(label)
              .to(
                card,
                {
                  y: 0,
                  z: 0,
                  rotation: index % 2 ? 0.35 : -0.35,
                  duration: 0.9,
                  ease: 'power3.out',
                },
                label,
              )
              .to(
                details,
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.42,
                  stagger: 0.045,
                  ease: 'power2.out',
                },
                `${label}+=0.42`,
              )
              .to({}, { duration: 0.52 })
              // Named label — "card-0+=0.92" is a position, not a labels{} key, so
              // labelToScroll() used to return 0 and jump the page to the hero.
              .addLabel(`${label}-open`, `${label}+=0.92`);

            if (index < scrollCards.length - 1) {
              timeline.to(card, {
                y: () => -window.innerHeight * 0.16,
                xPercent: index % 2 ? 13 : -13,
                scale: 0.84,
                rotation: index % 2 ? 7 : -7,
                autoAlpha: 0,
                pointerEvents: 'none',
                duration: 0.72,
                ease: 'power2.inOut',
              });
            }
          });

          controlsRef.current = {
            openCardFromMenu: (index: number) => {
              if (index < ARCHIVE_SCROLL_SEQUENCE_LIMIT) {
                const scrollTrigger = timeline.scrollTrigger;
                if (!scrollTrigger) return;

                const target = scrollTrigger.labelToScroll(
                  getOpenCardScrollLabel(index),
                );
                // Missing labels resolve to 0 and would snap the page to the hero.
                if (target > 0) {
                  scrollTrigger.scroll(target);
                } else {
                  cards[index]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }
                onActiveIndexChange?.(index);
                return;
              }

              openMenuOnlyCard(cards, index);
            },
            clearMenuView: () => {
              const scrollTrigger = timeline.scrollTrigger;
              if (!scrollTrigger) return;

              cards.forEach((card) => {
                gsap.set(card, {
                  clearProps: 'transform,opacity,scale,rotate,pointerEvents',
                });
                gsap.set(getCardDetails(card), { clearProps: 'transform,opacity' });
              });

              primeScrollCards();
              primeMenuOnlyCards();
              timeline.progress(scrollTrigger.progress);
            },
            isScrollSequenceCard: (index: number) =>
              index < ARCHIVE_SCROLL_SEQUENCE_LIMIT,
          };

          document.fonts.ready.then(() => ScrollTrigger.refresh());

          return () => {
            removeMenuExitListener();
            controlsRef.current = null;
          };
        },
      );

      media.add(
        '(max-width: 928px) and (prefers-reduced-motion: no-preference)',
        () => {
          const cards = gsap.utils.toArray<HTMLElement>('[data-archive-card]');
          const removeMenuExitListener = bindMenuExitOnScroll();

          cards.forEach((card, index) => {
            gsap.fromTo(
              card,
              {
                y: 90,
                rotateZ: index % 2 ? 2.5 : -2.5,
                autoAlpha: 0,
              },
              {
                y: 0,
                rotateZ: index % 2 ? 0.5 : -0.5,
                autoAlpha: 1,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 84%',
                },
              },
            );
          });

          controlsRef.current = {
            openCardFromMenu: (index: number) => {
              cards[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              onActiveIndexChange?.(index);
            },
            clearMenuView: () => undefined,
            isScrollSequenceCard: () => true,
          };

          return () => {
            removeMenuExitListener();
            controlsRef.current = null;
          };
        },
      );

      media.add('(prefers-reduced-motion: reduce)', () => {
        controlsRef.current = {
          openCardFromMenu: (index: number) => {
            const cards =
              scope.current?.querySelectorAll<HTMLElement>('[data-archive-card]');
            cards?.[index]?.scrollIntoView({ behavior: 'auto', block: 'center' });
            onActiveIndexChange?.(index);
          },
          clearMenuView: () => undefined,
          isScrollSequenceCard: () => true,
        };

        return () => {
          controlsRef.current = null;
        };
      });

      return () => media.revert();
    },
    {
      scope,
      dependencies: [
        controlsRef,
        menuActiveIndexRef,
        onActiveIndexChange,
        onExitMenuView,
      ],
    },
  );
}
