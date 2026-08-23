import { useCallback, useRef, useState, type CSSProperties } from 'react';
import {
  ARCHIVE_SCROLL_SEQUENCE_LIMIT,
  type ArchiveMotionControls,
} from '../animation/archive-motion';
import { useArchiveMotion } from '../animation/useArchiveMotion';
import { useSectionIntroMotion } from '../animation/useSectionIntroMotion';
import { ArchiveCabinet } from '../components/ui/ArchiveCabinet';
import { TicketCopy } from '../components/ui/TicketCopy';
import { getAssetUrl, projects } from '../content';
import { useLocale } from '../i18n/useLocale';

export function ArchivePortfolio() {
  const { copy, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const motionControlsRef = useRef<ArchiveMotionControls | null>(null);
  const menuActiveIndexRef = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuActiveIndex, setMenuActiveIndex] = useState<number | null>(null);
  menuActiveIndexRef.current = menuActiveIndex;

  const handleExitMenuView = useCallback(() => {
    setMenuActiveIndex(null);
    motionControlsRef.current?.clearMenuView();
  }, []);

  const handleScrollActiveIndex = useCallback((index: number) => {
    setSelectedIndex(index);

    if (menuActiveIndexRef.current !== null) {
      setMenuActiveIndex(null);
      motionControlsRef.current?.clearMenuView();
    }
  }, []);

  useArchiveMotion(sectionRef, {
    controlsRef: motionControlsRef,
    menuActiveIndexRef,
    onActiveIndexChange: handleScrollActiveIndex,
    onExitMenuView: handleExitMenuView,
  });
  useSectionIntroMotion(sectionRef);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);

    if (motionControlsRef.current?.isScrollSequenceCard(index)) {
      setMenuActiveIndex(null);
    } else {
      setMenuActiveIndex(index);
    }

    motionControlsRef.current?.openCardFromMenu(index);
  };

  return (
    <section
      className="archive"
      id="archive"
      aria-labelledby="archive-title"
      ref={sectionRef}
    >
      <div className="section-shell archive__intro" data-section-intro>
        <div className="section-heading" data-section-heading>
          <p className="eyebrow">{copy.archive.eyebrow}</p>
          <h2 className="section-title" id="archive-title">
            {copy.archive.title}
          </h2>
        </div>
        <TicketCopy
          className="section-intro"
          code="ARCHIVE PASS / 003"
          variant="archive"
          edge="end"
        >
          {copy.archive.intro}
        </TicketCopy>
      </div>

      <div className="archive__stage" data-archive-stage>
        <ArchiveCabinet selectedIndex={selectedIndex} onSelect={handleSelect} />

        <div
          className="archive__cards section-shell"
          data-menu-view={menuActiveIndex !== null ? 'true' : undefined}
        >
          {projects.map((project, index) => {
            const translatedProject = project.translations[locale];
            const titleId = `project-${project.id}`;
            const isMenuOnly = index >= ARCHIVE_SCROLL_SEQUENCE_LIMIT;

            return (
              <article
                className={`archive-card archive-card--${project.artVariant}`}
                key={project.id}
                style={{ '--card-index': index } as CSSProperties}
                data-archive-card
                data-menu-only={isMenuOnly ? 'true' : undefined}
                data-menu-active={menuActiveIndex === index ? 'true' : undefined}
                aria-labelledby={titleId}
              >
                <div className="archive-card__tab" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{translatedProject.title}</span>
                </div>

                <div className="archive-card__paper">
                  <header className="archive-card__header">
                    <p>
                      BW–{project.year}–{String(index + 1).padStart(3, '0')}
                    </p>
                    <span>{copy.common.demoProject}</span>
                  </header>

                  <div className="archive-card__grid">
                    <figure className="archive-card__art">
                      <img
                        src={getAssetUrl(project.image)}
                        alt={project.imageAlt[locale]}
                        loading="lazy"
                        width="1200"
                        height="760"
                      />
                      <figcaption>
                        SCREEN PROOF / {project.artVariant.toUpperCase()}
                      </figcaption>
                    </figure>

                    <div className="archive-card__dossier">
                      <div className="archive-card__title-row">
                        <p>{project.client}</p>
                        <h3 id={titleId}>{translatedProject.title}</h3>
                      </div>

                      <p className="archive-card__description">
                        {translatedProject.description}
                      </p>

                      <dl>
                        <div>
                          <dt>{copy.archive.labels.client}</dt>
                          <dd>{project.client}</dd>
                        </div>
                        <div>
                          <dt>{copy.archive.labels.year}</dt>
                          <dd>{project.year}</dd>
                        </div>
                        <div>
                          <dt>{copy.archive.labels.direction}</dt>
                          <dd>{translatedProject.direction}</dd>
                        </div>
                        <div>
                          <dt>{copy.archive.labels.features}</dt>
                          <dd>
                            <ul>
                              {translatedProject.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                              ))}
                            </ul>
                          </dd>
                        </div>
                        <div>
                          <dt>{copy.archive.labels.stack}</dt>
                          <dd>{project.stack.join(' / ')}</dd>
                        </div>
                      </dl>

                      {project.liveUrl ? (
                        <a
                          className="archive-card__link"
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {copy.common.viewProject} ↗
                        </a>
                      ) : (
                        <span className="archive-card__status">
                          {copy.archive.labels.status}: {copy.common.demoProject}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
