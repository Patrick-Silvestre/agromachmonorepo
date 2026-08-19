'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Anima um numero de 0 ate `target` usando requestAnimationFrame.
 * Sem lib externa - efeito sutil de "premium", nao decorativo.
 */
export function useCountUp(target: number, durationMs = 900) {
  // Aba em segundo plano pausa requestAnimationFrame (comportamento normal do navegador).
  // Nesse caso comeca direto no valor final, em vez de travar em 0.
  const startsHidden = typeof document !== 'undefined' && document.hidden;
  const [value, setValue] = useState(() => (startsHidden ? target : 0));
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.hidden) {
      return;
    }

    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, durationMs]);

  return value;
}
