import type { CSSProperties } from 'react';
import { useLocale } from '../../i18n/useLocale';

export function ProjectBoard() {
  const { copy } = useLocale();
  const { board } = copy.process;

  return (
    <div className="project-board" aria-label={board.title}>
      <div className="project-board__header">
        <span>{board.title}</span>
        <span>{board.project}</span>
        <span className="project-board__live">● LIVE</span>
      </div>
      <div className="project-board__columns">
        {board.columns.map((column, columnIndex) => (
          <section
            className="project-board__column"
            key={`${column.title}-${columnIndex}`}
          >
            <h3>
              {column.title}
              <span>{String(column.cards.length).padStart(2, '0')}</span>
            </h3>
            <ul>
              {column.cards.map((card, cardIndex) => (
                <li
                  className="project-board__card"
                  key={`${card}-${cardIndex}`}
                  style={
                    {
                      '--card-tilt': `${((columnIndex + cardIndex) % 3) - 1}deg`,
                    } as CSSProperties
                  }
                >
                  <span>
                    BW-{columnIndex + 1}
                    {cardIndex + 1}
                  </span>
                  {card}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
