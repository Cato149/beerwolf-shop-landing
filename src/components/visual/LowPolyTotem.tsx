import { useLocale } from '../../i18n/useLocale';

export function LowPolyTotem() {
  const { copy } = useLocale();

  return (
    <figure className="low-poly-totem">
      <svg viewBox="0 0 640 700" role="img" aria-label={copy.hero.posterAlt}>
        <path className="totem-sun" d="M320 52 552 452 88 452z" />
        <path className="totem-ear totem-ear--left" d="m160 156 132 116-187 52z" />
        <path className="totem-ear totem-ear--right" d="m480 156-132 116 187 52z" />
        <path
          className="totem-face"
          d="m320 205 205 125-72 239-133 91-133-91-72-239z"
        />
        <path
          className="totem-plane totem-plane--one"
          d="m320 205 12 272-145 92-72-239z"
        />
        <path
          className="totem-plane totem-plane--two"
          d="m320 205 205 125-72 239-121-92z"
        />
        <path className="totem-plane totem-plane--three" d="m187 569 145-92-12 183z" />
        <path className="totem-plane totem-plane--four" d="m453 569-121-92-12 183z" />
        <path className="totem-eye" d="m174 362 110-38-47 82z" />
        <path className="totem-eye" d="m466 362-110-38 47 82z" />
        <path className="totem-snout" d="m320 395 70 127-70 75-70-75z" />
        <path className="totem-nose" d="m320 488 40 31-40 35-40-35z" />
        <g className="totem-rays">
          <path d="M320 18v76M98 80l57 65M542 80l-57 65M34 322h88M606 322h-88" />
        </g>
      </svg>
      <figcaption className="low-poly-totem__caption">
        <span>BW–01</span>
        <span>{copy.hero.stamp}</span>
      </figcaption>
    </figure>
  );
}
