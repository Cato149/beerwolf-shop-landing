import { useRef } from 'react';
import { useProcessMotion } from '../animation/useProcessMotion';
import { useSectionIntroMotion } from '../animation/useSectionIntroMotion';
import { TicketCopy } from '../components/ui/TicketCopy';
import { ProjectBoard } from '../components/visual/ProjectBoard';
import { TelegramThread } from '../components/visual/TelegramThread';
import { useLocale } from '../i18n/useLocale';

export function ProcessJourney() {
  const { copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  useProcessMotion(sectionRef);
  useSectionIntroMotion(sectionRef);

  return (
    <section
      className="process-journey"
      id="process"
      aria-labelledby="process-title"
      ref={sectionRef}
    >
      <div className="section-shell process-journey__intro" data-section-intro>
        <div className="section-heading" data-section-heading>
          <p className="eyebrow">{copy.process.eyebrow}</p>
          <h2 className="section-title" id="process-title">
            {copy.process.title}
          </h2>
        </div>
        <TicketCopy
          className="section-intro"
          code="STUDIO LINE / 06 STOPS"
          variant="process"
          edge="end"
        >
          {copy.process.intro}
        </TicketCopy>
      </div>

      <div className="section-shell process-journey__track">
        <svg
          className="process-journey__line"
          viewBox="0 0 900 1900"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            data-process-path
            d="M180 0C760 170 730 390 270 520S105 840 665 960s232 340-260 465S250 1720 720 1900"
          />
        </svg>

        <ol className="process-steps">
          {copy.process.steps.map((step, index) => (
            <li
              className={`process-step process-step--${index % 2 ? 'right' : 'left'}${index === 3 || index === 4 ? '' : ' process-step--compact'}`}
              key={step.number}
              data-process-step
            >
              <article>
                <div className="process-step__marker">
                  <span>{step.number}</span>
                </div>
                <p className="process-step__kicker">{step.kicker}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>

              {index === 3 ? (
                <div className="process-step__artifact process-step__artifact--board">
                  <ProjectBoard />
                </div>
              ) : null}

              {index === 4 ? (
                <div className="process-step__artifact process-step__artifact--telegram">
                  <TelegramThread />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="process-journey__bleed" aria-hidden="true">
        PROCESS / PROCESS / PROCESS / PROCESS
      </div>
    </section>
  );
}
