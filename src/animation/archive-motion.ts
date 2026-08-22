/** How many dossiers play through the pinned scroll sequence on desktop. */
export const ARCHIVE_SCROLL_SEQUENCE_LIMIT = 3;

export type ArchiveMotionControls = {
  openCardFromMenu: (index: number) => void;
  clearMenuView: () => void;
  isScrollSequenceCard: (index: number) => boolean;
};
