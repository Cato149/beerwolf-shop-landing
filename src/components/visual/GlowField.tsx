import { useEffect, useRef } from 'react';

export function GlowField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    let nextX = window.innerWidth * 0.68;
    let nextY = window.innerHeight * 0.24;

    const paint = () => {
      field.style.setProperty('--pointer-x', `${nextX}px`);
      field.style.setProperty('--pointer-y', `${nextY}px`);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="glow-field" ref={fieldRef} aria-hidden="true">
      <span className="glow-field__pointer" />
      <span className="glow-field__orb glow-field__orb--one" />
      <span className="glow-field__orb glow-field__orb--two" />
      <span className="glow-field__orb glow-field__orb--three" />
    </div>
  );
}
