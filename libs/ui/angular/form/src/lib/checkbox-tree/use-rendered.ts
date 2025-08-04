import { afterNextRender, signal, Signal } from '@angular/core';

/**
 * Creates a signal that becomes true after the component is rendered
 * @returns A signal that is initially false and becomes true after rendering
 */
export function useRenderedSignal(): Signal<boolean> {
  const renderedSignal = signal(false);

  afterNextRender(() => {
    renderedSignal.set(true);
  });

  return renderedSignal;
}
