import { useId } from 'react';
import { analyticsEvents, umamiEventAttrs } from '../../analytics/umami';
import { projects } from '../../content';
import { useLocale } from '../../i18n/useLocale';

type ArchiveCabinetProps = {
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function ArchiveCabinet({ selectedIndex, onSelect }: ArchiveCabinetProps) {
  const { copy, locale } = useLocale();
  const selectId = useId();
  const fileCount = String(projects.length).padStart(3, '0');

  return (
    <div className="archive__cabinet">
      <p className="archive-cabinet__brand">{copy.archive.cabinet.brand}</p>

      <div className="archive-cabinet__controls">
        <div className="archive-cabinet__picker">
          <label className="archive-cabinet__picker-label" htmlFor={selectId}>
            {copy.archive.cabinet.selectLabel}
          </label>

          <div className="archive-cabinet__select-wrap">
            <span className="archive-cabinet__count" aria-hidden="true">
              {fileCount} {copy.archive.cabinet.filesSuffix}
            </span>
            <select
              id={selectId}
              className="archive-cabinet__select"
              value={selectedIndex}
              onChange={(event) => onSelect(Number(event.target.value))}
              aria-label={copy.archive.cabinet.selectAriaLabel}
            >
              {projects.map((project, index) => {
                const title = project.translations[locale].title;

                return (
                  <option key={project.id} value={index}>
                    {String(index + 1).padStart(2, '0')} — {title}
                  </option>
                );
              })}
            </select>
            <span className="archive-cabinet__select-cue" aria-hidden="true">
              ▾
            </span>
          </div>
        </div>

        <a
          className="archive-cabinet__skip"
          href="#contact"
          {...umamiEventAttrs(analyticsEvents.skipToContact)}
        >
          {copy.archive.cabinet.skipToContact}
        </a>
      </div>
    </div>
  );
}
